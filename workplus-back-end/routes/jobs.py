from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import Notification, SavedJob, db, Job, Company, User, JobApplication, Analytics
from sqlalchemy import or_, func, desc
from datetime import datetime, timedelta

jobs_bp = Blueprint('jobs', __name__)


@jobs_bp.route('/', methods=['GET'])
# @jwt_required(optional=True)  # авторизация не обязательна, но если есть токен — используем
def get_jobs():
    if request.method == "OPTIONS":
        # Прямой ответ БЕЗ редиректов
        return jsonify({}), 200
    """Получить список вакансий с фильтрацией и пагинацией"""
    try:
        # Параметры пагинации
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)

        # Фильтры (оставляем твой код как есть)
        search = request.args.get('search', '').strip()
        category = request.args.get('category')
        city = request.args.get('city')
        employment_type = request.args.get('employment_type')
        experience_level = request.args.get('experience_level')
        remote_work = request.args.get('remote_work', type=bool)
        salary_min = request.args.get('salary_min', type=int)
        salary_max = request.args.get('salary_max', type=int)
        sort_by = request.args.get('sort', 'created_at')
        order = request.args.get('order', 'desc')
        featured_only = request.args.get('featured', type=bool)
        urgent_only = request.args.get('urgent', type=bool)

        # Построение запроса
        query = Job.query.join(Company).filter(
            Job.is_active == True,
            Company.is_active == True
        )

        # Применение фильтров (оставил твой код без изменений)
        if search:
            search_filter = or_(
                Job.title.ilike(f'%{search}%'),
                Job.description.ilike(f'%{search}%'),
                Job.requirements.ilike(f'%{search}%'),
                Company.name.ilike(f'%{search}%')
            )
            query = query.filter(search_filter)

        if category:
            query = query.filter(Job.category == category)

        if city:
            query = query.filter(Job.city == city)

        if employment_type:
            query = query.filter(Job.employment_type == employment_type)

        if experience_level:
            query = query.filter(Job.experience_level == experience_level)

        if remote_work is not None:
            query = query.filter(Job.remote_work == remote_work)

        if salary_min:
            query = query.filter(
                or_(
                    Job.salary_min >= salary_min,
                    Job.salary_max >= salary_min
                )
            )

        if salary_max:
            query = query.filter(
                Job.salary_min <= salary_max
            )

        if featured_only:
            query = query.filter(Job.is_featured == True)

        if urgent_only:
            query = query.filter(Job.is_urgent == True)

        # Сортировка
        if sort_by == 'salary_min':
            query = query.order_by(desc(Job.salary_min) if order == 'desc' else Job.salary_min)
        elif sort_by == 'title':
            query = query.order_by(desc(Job.title) if order == 'desc' else Job.title)
        elif sort_by == 'views':
            query = query.order_by(desc(Job.views_count) if order == 'desc' else Job.views_count)
        else:  # created_at по умолчанию
            query = query.order_by(desc(Job.created_at) if order == 'desc' else Job.created_at)

        query = query.filter(Job.moderation_status == "approved")

        # Пагинация
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        # Получаем текущего юзера (если есть)
        # ПРОБЛЕМА: User ID = None (пользователь не авторизован)
        # Поэтому applied_jobs всегда пустой и applied всегда False

        user_id = request.args.get('user_id', None)
        applied_jobs = set()

        # Отладочная информация
        print(f"User ID: {user_id}")
        print(f"Is user authenticated: {user_id is not None}")

        if user_id:
            apps = JobApplication.query.filter_by(candidate_id=user_id).all()
            applied_jobs = {int(a.job_id) for a in apps}
            print(f"Found applications: {len(apps)}")
            print(f"Applied job IDs: {applied_jobs}")
        else:
            print("User not authenticated - applied will be False for all jobs")

        # Формируем результат
        jobs_list = []
        for job in pagination.items:
            job_dict = job.to_dict()
            
            # Если пользователь не авторизован, applied = False
            # Если авторизован, проверяем наличие заявки
            if user_id is None:
                job_dict['applied'] = False
            else:
                job_dict['applied'] = int(job.id) in applied_jobs
            
            jobs_list.append(job_dict)


        # Альтернативный вариант - более надежный:
        # Можно также добавить логирование для отладки:
        print(f"User ID: {user_id}")
        print(f"Applied jobs: {applied_jobs}")
        # print(f"Current job ID: {job.id}, type: {type(job.id)}")
        # print(f"Applied check result: {int(job.id) in applied_jobs}")

        # Или использовать более явную проверку:
        # for job in pagination.items:
        #     job_dict = job.to_dict()
        #     is_applied = False
        #     if user_id and applied_jobs:
        #         # Проверяем оба варианта типов
        #         is_applied = (job.id in applied_jobs or 
        #                     str(job.id) in applied_jobs or 
        #                     int(job.id) in applied_jobs)
        #     job_dict['applied'] = is_applied
        #     jobs_list.append(job_dict)

        stats = get_jobs_statistics()
        print(f"Total jobs processed: {len(jobs_list)}")

        return jsonify({
            'jobs': jobs_list,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_prev': pagination.has_prev,
                'has_next': pagination.has_next
            },
            'filters': {
                'categories': stats['categories'],
                'cities': stats['cities'],
                'employment_types': stats['employment_types'],
                'experience_levels': stats['experience_levels']
            },
            'applied_filters': {
                'search': search,
                'category': category,
                'city': city,
                'employment_type': employment_type,
                'experience_level': experience_level,
                'remote_work': remote_work,
                'salary_min': salary_min,
                'salary_max': salary_max,
                'featured_only': featured_only,
                'urgent_only': urgent_only,
                'sort': sort_by,
                'order': order
            }
        })

    except Exception as e:
        print(f"Ошибка получения вакансий: {e}")
        return jsonify({'error': 'Ошибка при получении списка вакансий'}), 500

@jobs_bp.route('/<int:job_id>', methods=['GET'])
def get_job_detail(job_id):
    """Получить детальную информацию о вакансии"""
    try:
        job = Job.query.join(Company).filter(
            Job.id == job_id,
            Job.is_active == True,
            Company.is_active == True
        ).first()
        
        if not job:
            return jsonify({'error': 'Вакансия не найдена'}), 404
        
        # Увеличиваем счетчик просмотров
        job.views_count = (job.views_count or 0) + 1
        db.session.commit()
        
        # Трекаем просмотр в аналитике (если Analytics существует)
        try:
            Analytics.track_metric('job_views', job.id, 'job')
        except:
            pass
        
        # Получаем данные о пользователе если авторизован
        user_application = None
        user_saved = False
        current_user_id = None
        
        try:
            from flask_jwt_extended import verify_jwt_in_request
            verify_jwt_in_request(optional=True)
            current_user_id = get_jwt_identity()
            
            if current_user_id:
                user_id = int(current_user_id)
                
                # Проверяем, подавал ли пользователь заявку
                user_application = JobApplication.query.filter_by(
                    job_id=job_id,
                    candidate_id=user_id
                ).first()
                
                # Проверяем, сохранена ли вакансия пользователем (если модель SavedJob существует)
                try:
                    saved_job = SavedJob.query.filter_by(
                        job_id=job_id,
                        user_id=user_id
                    ).first()
                    user_saved = saved_job is not None
                except:
                    user_saved = False
        except:
            pass
        
        # Получаем связанные вакансии
        related_jobs = Job.query.join(Company).filter(
            Job.category == job.category,
            Job.id != job_id,
            Job.is_active == True,
            Company.is_active == True
        ).limit(5).all()
        
        # Формируем ответ
        response_data = job.to_dict()
        response_data['user_applied'] = user_application is not None
        response_data['user_saved'] = user_saved
        response_data['user_application'] = user_application.to_dict(include_candidate=False) if user_application else None
        response_data['related_jobs'] = [
            {
                'id': related_job.id,
                'title': related_job.title,
                'company': related_job.company.name,
                'city': related_job.city,
                'salary_display': related_job.get_salary_range(),
                'created_at': related_job.created_at.isoformat() if related_job.created_at else None
            }
            for related_job in related_jobs
        ]
        
        return jsonify(response_data)
    
    except Exception as e:
        print(f"Ошибка получения вакансии: {e}")
        return jsonify({'error': 'Ошибка при получении вакансии'}), 500
    
    
@jobs_bp.route('/search', methods=['POST'])
def search_jobs():
    """Расширенный поиск вакансий"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400
        
        # Параметры пагинации
        page = data.get('page', 1)
        per_page = min(data.get('per_page', 20), 100)
        
        # Построение запроса
        query = Job.query.join(Company).filter(
            Job.is_active == True,
            Company.is_active == True
        )
        
        # Поиск по ключевым словам
        if data.get('keywords'):
            keywords = data['keywords'].strip()
            search_filter = or_(
                Job.title.ilike(f'%{keywords}%'),
                Job.description.ilike(f'%{keywords}%'),
                Job.requirements.ilike(f'%{keywords}%'),
                Company.name.ilike(f'%{keywords}%')
            )
            query = query.filter(search_filter)
        
        # Фильтр по навыкам
        if data.get('skills'):
            skills_conditions = []
            for skill in data['skills'].split(sep=','):
                skills_conditions.append(Job.skills.ilike(f'%{skill}%'))
            if skills_conditions:
                query = query.filter(or_(*skills_conditions))
        
        # Фильтр по местоположению
        if data.get('locations'):
            location_conditions = []
            for location in data['locations']:
                location_conditions.append(Job.city.ilike(f'%{location}%'))
            if location_conditions:
                query = query.filter(or_(*location_conditions))
        
        # Фильтр по категориям
        if data.get('categories'):
            query = query.filter(Job.category.in_(data['categories']))
        
        # Фильтр по типам занятости
        if data.get('employment_types'):
            query = query.filter(Job.employment_type.in_(data['employment_types']))
        
        # Фильтр по уровню опыта
        if data.get('experience_levels'):
            query = query.filter(Job.experience_level.in_(data['experience_levels']))
        
        # Фильтр по зарплате
        if data.get('salary_range'):
            salary_range = data['salary_range']
            if salary_range.get('min'):
                query = query.filter(Job.salary_max >= salary_range['min'])
            if salary_range.get('max'):
                query = query.filter(Job.salary_min <= salary_range['max'])
        
        # Фильтр по компаниям
        if data.get('companies'):
            company_ids = [comp['id'] for comp in data['companies'] if 'id' in comp]
            if company_ids:
                query = query.filter(Job.company_id.in_(company_ids))
        
        # Фильтр по дате публикации
        if data.get('published_within_days'):
            days = data['published_within_days']
            date_threshold = datetime.utcnow() - timedelta(days=days)
            query = query.filter(Job.created_at >= date_threshold)
        
        # Дополнительные фильтры
        if data.get('remote_only'):
            query = query.filter(Job.remote_work == True)
        
        if data.get('featured_only'):
            query = query.filter(Job.is_featured == True)
        
        if data.get('urgent_only'):
            query = query.filter(Job.is_urgent == True)
        
        # Сортировка
        sort_by = data.get('sort', 'relevance')
        if sort_by == 'newest':
            query = query.order_by(desc(Job.created_at))
        elif sort_by == 'salary_desc':
            query = query.order_by(desc(Job.salary_max))
        elif sort_by == 'salary_asc':
            query = query.order_by(Job.salary_min)
        elif sort_by == 'title':
            query = query.order_by(Job.title)
        else:  # relevance
            query = query.order_by(desc(Job.is_featured), desc(Job.is_urgent), desc(Job.created_at))
        
        # Пагинация
        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'jobs': [job.to_dict() for job in pagination.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            },
            'search_params': data
        })
    
    except Exception as e:
        print(f"Ошибка поиска вакансий: {e}")
        return jsonify({'error': 'Ошибка при поиске вакансий'}), 500

@jobs_bp.route('/<int:job_id>/apply', methods=['POST'])
@jwt_required()
def apply_for_job(job_id):
    """Подать заявку на вакансию"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'candidate':
            return jsonify({'error': 'Только кандидаты могут подавать заявки'}), 403
        
        job = Job.query.filter_by(id=job_id, is_active=True).first()
        if not job:
            return jsonify({'error': 'Вакансия не найдена'}), 404
        
        # Проверяем, не подавал ли уже заявку
        existing_application = JobApplication.query.filter_by(
            job_id=job_id,
            candidate_id=user_id
        ).first()
        
        if existing_application:
            return jsonify({'error': 'Вы уже подали заявку на эту вакансию'}), 400
        
        data = request.get_json() or {}
        
        # Создаем заявку
        application = JobApplication(
            job_id=job_id,
            candidate_id=user_id,
            cover_letter=data.get('cover_letter'),
            resume_url=data.get('resume_url') or user.resume_url,
            portfolio_url=data.get('portfolio_url') or user.portfolio_url,
            expected_salary=data.get('expected_salary')
        )
        
        # Автоматический скоринг на основе навыков
        application.auto_score = calculate_candidate_score(user, job)
        
        db.session.add(application)
        
        # Обновляем счетчик заявок у вакансии
        job.applications_count += 1
        
        db.session.commit()
        
        # Трекаем заявку в аналитике
        Analytics.track_metric('applications', job_id, 'job')

        # ✅ Создаём уведомление работодателю
        employer = User.query.get(job.posted_by)
        if employer:
            notif = Notification(
                user_id=employer.id,
                type="new_application",
                message=f"Кандидат {user.name} подал заявку на вашу вакансию «{job.title}»",
                job_id=job.id,
                job_title=job.title,
                company_name=employer.company.name if employer.company else None
            )
            db.session.add(notif)
            db.session.commit()
        
        return jsonify({
            'message': 'Заявка успешно подана',
            'application': application.to_dict(include_candidate=False)
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка подачи заявки: {e}")
        return jsonify({'error': 'Ошибка при подаче заявки'}), 500

@jobs_bp.route('/my-applications', methods=['GET'])
@jwt_required()
def get_my_applications():
    """Получить мои заявки"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'candidate':
            return jsonify({'error': 'Только кандидаты могут просматривать свои заявки'}), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status = request.args.get('status')
        
        query = JobApplication.query.filter_by(candidate_id=user_id)
        
        if status:
            query = query.filter(JobApplication.status == status)
        
        query = query.order_by(desc(JobApplication.created_at))
        
        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        applications_data = []
        for app in pagination.items:
            app_dict = app.to_dict(include_candidate=False)
            app_dict['job'] = app.job.to_dict() if app.job else None
            applications_data.append(app_dict)
        
        return jsonify({
            'applications': applications_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        })
    
    except Exception as e:
        print(f"Ошибка получения заявок: {e}")
        return jsonify({'error': 'Ошибка при получении заявок'}), 500

@jobs_bp.route('/categories', methods=['GET'])
def get_job_categories():
    """Получить список категорий вакансий"""
    try:
        categories = db.session.query(
            Job.category,
            func.count(Job.id).label('count')
        ).filter(Job.is_active == True)\
         .group_by(Job.category)\
         .having(func.count(Job.id) > 0)\
         .order_by(func.count(Job.id).desc())\
         .all()
        
        return jsonify({
            'categories': [
                {'name': category, 'count': count}
                for category, count in categories
            ]
        })
    
    except Exception as e:
        print(f"Ошибка получения категорий: {e}")
        return jsonify({'error': 'Ошибка при получении категорий'}), 500

def get_jobs_statistics():
    """Получить статистику для фильтров"""
    try:
        # Категории
        categories = db.session.query(
            Job.category,
            func.count(Job.id).label('count')
        ).filter(Job.is_active == True)\
         .group_by(Job.category)\
         .all()
        
        # Города
        cities = db.session.query(
            Job.city,
            func.count(Job.id).label('count')
        ).filter(Job.is_active == True, Job.city.isnot(None))\
         .group_by(Job.city)\
         .all()
        
        # Типы занятости
        employment_types = db.session.query(
            Job.employment_type,
            func.count(Job.id).label('count')
        ).filter(Job.is_active == True)\
         .group_by(Job.employment_type)\
         .all()
        
        # Уровни опыта
        experience_levels = db.session.query(
            Job.experience_level,
            func.count(Job.id).label('count')
        ).filter(Job.is_active == True, Job.experience_level.isnot(None))\
         .group_by(Job.experience_level)\
         .all()
        
        return {
            'categories': [{'name': name, 'count': count} for name, count in categories],
            'cities': [{'name': name, 'count': count} for name, count in cities],
            'employment_types': [{'name': name, 'count': count} for name, count in employment_types],
            'experience_levels': [{'name': name, 'count': count} for name, count in experience_levels]
        }
    
    except Exception as e:
        print(f"Ошибка получения статистики: {e}")
        return {
            'categories': [],
            'cities': [],
            'employment_types': [],
            'experience_levels': []
        }

def calculate_candidate_score(candidate, job):
    """Рассчитать автоматический скор кандидата"""
    try:
        score = 0.0
        max_score = 100.0
        
        # Скор по навыкам (40% от общего скора)
        candidate_skills = candidate.get_skills_list()
        job_skills = job.get_skills_list()
        
        if job_skills and candidate_skills:
            matching_skills = set(candidate_skills) & set(job_skills)
            skill_score = (len(matching_skills) / len(job_skills)) * 40
            score += skill_score
        
        # Скор по опыту (30% от общего скора)
        if candidate.experience_years is not None and job.experience_level:
            experience_mapping = {
                'junior': (0, 2),
                'middle': (2, 5),
                'senior': (5, 100)
            }
            
            if job.experience_level in experience_mapping:
                min_exp, max_exp = experience_mapping[job.experience_level]
                if min_exp <= candidate.experience_years <= max_exp:
                    score += 30
                elif candidate.experience_years > max_exp:
                    score += 25  # Переквалификация
                else:
                    score += 10  # Недостаточно опыта
        
        # Скор по образованию (20% от общего скора)
        if candidate.education_level and job.education_required:
            education_levels = {
                'school': 1,
                'college': 2,
                'bachelor': 3,
                'master': 4,
                'phd': 5
            }
            
            candidate_level = education_levels.get(candidate.education_level, 0)
            required_level = education_levels.get(job.education_required, 0)
            
            if candidate_level >= required_level:
                score += 20
            elif candidate_level == required_level - 1:
                score += 15
            else:
                score += 5
        
        # Скор по местоположению (10% от общего скора)
        if candidate.city and job.city:
            if candidate.city.lower() == job.city.lower():
                score += 10
            elif job.remote_work:
                score += 8
        elif job.remote_work:
            score += 10
        
        return min(score / max_score, 1.0)  # Нормализуем до 0-1
    
    except Exception as e:
        print(f"Ошибка расчета скора: {e}")
        return 0.0
    
@jobs_bp.route('/<int:job_id>/save', methods=['POST'])
@jwt_required()
def save_job(job_id):
    """Сохранить вакансию в избранное"""
    try:
        user_id = int(get_jwt_identity())
        
        # Проверяем существование вакансии
        job = Job.query.filter_by(id=job_id, is_active=True).first()
        if not job:
            return jsonify({'error': 'Вакансия не найдена'}), 404
        
        # Проверяем, не сохранена ли уже вакансия
        existing_save = SavedJob.query.filter_by(
            job_id=job_id,
            user_id=user_id
        ).first()
        
        if existing_save:
            return jsonify({'error': 'Вакансия уже сохранена'}), 400
        
        # Создаем запись о сохранении
        saved_job = SavedJob(
            job_id=job_id,
            user_id=user_id,
            saved_at=datetime.utcnow()
        )
        
        db.session.add(saved_job)
        db.session.commit()
        
        return jsonify({'message': 'Вакансия сохранена в избранное'}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка сохранения вакансии: {e}")
        return jsonify({'error': 'Ошибка при сохранении вакансии'}), 500


@jobs_bp.route('/<int:job_id>/save', methods=['DELETE'])
@jwt_required()
def unsave_job(job_id):
    """Удалить вакансию из избранного"""
    try:
        user_id = int(get_jwt_identity())
        
        # Находим сохраненную вакансию
        saved_job = SavedJob.query.filter_by(
            job_id=job_id,
            user_id=user_id
        ).first()
        
        if not saved_job:
            return jsonify({'error': 'Вакансия не найдена в избранном'}), 404
        
        db.session.delete(saved_job)
        db.session.commit()
        
        return jsonify({'message': 'Вакансия удалена из избранного'}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка удаления вакансии из избранного: {e}")
        return jsonify({'error': 'Ошибка при удалении вакансии из избранного'}), 500

@jobs_bp.route('/', methods=['POST'])
@jwt_required()
def create_job():
    """Создать вакансию (админ/работодатель)"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user or user.user_type not in ("admin", "employer"):
            return jsonify({"error": "Недостаточно прав"}), 403

        data = request.get_json()
        if not data or "title" not in data:
            return jsonify({"error": "Не переданы данные"}), 400

        # Проверка компании
        company_id = data.get("company_id") or user.company_id
        if not company_id:
            return jsonify({"error": "Не указана компания"}), 400

        job = Job(
            title=data["title"],
            description=data.get("description", ""),
            requirements="\n".join(data.get("requirements", [])),
            responsibilities="\n".join(data.get("responsibilities", [])),
            benefits="\n".join(data.get("benefits", [])),
            category=data.get("category", "Другое"),
            employment_type=data.get("employment_type", "full_time"),
            experience_level=data.get("experience_level", "junior"),
            salary_min=data.get("salary_min"),
            salary_max=data.get("salary_max"),
            salary_currency=data.get("salary_currency", "KZT"),
            city=data.get("city"),
            company_id=company_id,
            posted_by=user.id,
            is_active=True,
            moderation_status="pending"
        )

        db.session.add(job)
        db.session.commit()

        return jsonify(job.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка при создании вакансии: {e}")
        return jsonify({"error": "Ошибка при создании вакансии"}), 500