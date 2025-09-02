from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Job, Company, User, JobApplication, Analytics, Settings
from datetime import datetime, timedelta
from sqlalchemy import desc

employer_bp = Blueprint('employer', __name__)

@employer_bp.route('/jobs', methods=['GET'])
@jwt_required()
def get_employer_jobs():
    """Получить вакансии работодателя"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'employer':
            return jsonify({'error': 'Доступ только для работодателей'}), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        # Получаем вакансии пользователя
        query = Job.query.filter_by(posted_by=user_id)
        
        # Фильтр по статусу
        status = request.args.get('status')
        if status == 'active':
            query = query.filter(Job.is_active == True)
        elif status == 'inactive':
            query = query.filter(Job.is_active == False)
        
        query = query.order_by(desc(Job.created_at))
        
        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        jobs_data = []
        for job in pagination.items:
            job_dict = job.to_dict(include_applications=False)
            # Добавляем статистику заявок по статусам
            applications_stats = db.session.query(
                JobApplication.status,
                db.func.count(JobApplication.id).label('count')
            ).filter_by(job_id=job.id).group_by(JobApplication.status).all()
            
            job_dict['applications_stats'] = {
                status: count for status, count in applications_stats
            }
            jobs_data.append(job_dict)
        
        return jsonify({
            'jobs': jobs_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        })
    
    except Exception as e:
        print(f"Ошибка получения вакансий работодателя: {e}")
        return jsonify({'error': 'Ошибка при получении вакансий'}), 500

@employer_bp.route('/jobs', methods=['POST'])
@jwt_required()
def create_job():
    """Создать новую вакансию"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'employer':
            return jsonify({'error': 'Доступ только для работодателей'}), 403
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400
        
        # Проверяем обязательные поля
        required_fields = ['title', 'company_id', 'category', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Поле "{field}" обязательно'}), 400
        
        # Проверяем что компания принадлежит пользователю
        company = Company.query.get(data['company_id'])
        if not company:
            return jsonify({'error': 'Компания не найдена'}), 404
        
        # Проверяем связь пользователя с компанией
        if user.company_id != company.id:
            return jsonify({'error': 'У вас нет прав на создание вакансий для этой компании'}), 403
        
        # Создаем вакансию
        job = Job(
            title=data['title'],
            company_id=data['company_id'],
            posted_by=user_id,
            category=data['category'],
            employment_type=data.get('employment_type', 'full_time'),
            experience_level=data.get('experience_level'),
            description=data['description'],
            requirements=data.get('requirements'),
            responsibilities=data.get('responsibilities'),
            benefits=data.get('benefits'),
            city=data.get('city'),
            address=data.get('address'),
            remote_work=data.get('remote_work', False),
            salary_min=data.get('salary_min'),
            salary_max=data.get('salary_max'),
            salary_currency=data.get('salary_currency', 'KZT'),
            education_required=data.get('education_required'),
            is_urgent=data.get('is_urgent', False),
            is_featured=data.get('is_featured', False),
            publish_to_instagram=data.get('publish_to_instagram', False),
            publish_to_telegram=data.get('publish_to_telegram', False),
            publish_to_facebook=data.get('publish_to_facebook', False),
            publish_to_linkedin=data.get('publish_to_linkedin', False)
        )
        
        # Устанавливаем навыки и языки
        if data.get('skills'):
            job.set_skills_list(data['skills'])
        
        if data.get('languages'):
            job.set_languages_list(data['languages'])
        
        # Устанавливаем дату автозакрытия
        auto_close_days = Settings.get_setting('job_auto_close_days', 30)
        job.auto_close_date = (datetime.utcnow() + timedelta(days=int(auto_close_days))).date()
        
        # Публикуем сразу, если настроена автомодерация
        auto_approve = Settings.get_setting('auto_approve_jobs', False)
        if auto_approve:
            job.published_at = datetime.utcnow()
        
        db.session.add(job)
        db.session.commit()
        
        # Трекаем создание вакансии
        Analytics.track_metric('job_created', job.id, 'job')
        
        # TODO: Отправить в очередь на публикацию в соцсети
        if any([job.publish_to_instagram, job.publish_to_telegram, 
                job.publish_to_facebook, job.publish_to_linkedin]):
            # schedule_social_publishing(job.id)
            pass
        
        return jsonify({
            'message': 'Вакансия успешно создана',
            'job': job.to_dict(),
            'auto_approved': auto_approve
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка создания вакансии: {e}")
        return jsonify({'error': 'Ошибка при создании вакансии'}), 500

@employer_bp.route('/jobs/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    """Обновить вакансию"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'employer':
            return jsonify({'error': 'Доступ только для работодателей'}), 403
        
        job = Job.query.filter_by(id=job_id, posted_by=user_id).first()
        if not job:
            return jsonify({'error': 'Вакансия не найдена'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400
        
        # Обновляем поля
        updateable_fields = [
            'title', 'category', 'employment_type', 'experience_level',
            'description', 'requirements', 'responsibilities', 'benefits',
            'city', 'address', 'remote_work', 'salary_min', 'salary_max',
            'education_required', 'is_urgent', 'is_featured'
        ]
        
        for field in updateable_fields:
            if field in data:
                setattr(job, field, data[field])
        
        # Обновляем навыки и языки
        if 'skills' in data:
            job.set_skills_list(data['skills'])
        
        if 'languages' in data:
            job.set_languages_list(data['languages'])
        
        job.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Вакансия успешно обновлена',
            'job': job.to_dict()
        })
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка обновления вакансии: {e}")
        return jsonify({'error': 'Ошибка при обновлении вакансии'}), 500

@employer_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    """Удалить вакансию"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'employer':
            return jsonify({'error': 'Доступ только для работодателей'}), 403
        
        job = Job.query.filter_by(id=job_id, posted_by=user_id).first()
        if not job:
            return jsonify({'error': 'Вакансия не найдена'}), 404
        
        # Мягкое удаление - просто деактивируем
        job.is_active = False
        job.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': 'Вакансия успешно удалена'})
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка удаления вакансии: {e}")
        return jsonify({'error': 'Ошибка при удалении вакансии'}), 500

@employer_bp.route('/jobs/<int:job_id>/applications', methods=['GET'])
@jwt_required()
def get_job_applications(job_id):
    """Получить заявки на вакансию"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'employer':
            return jsonify({'error': 'Доступ только для работодателей'}), 403
        
        job = Job.query.filter_by(id=job_id, posted_by=user_id).first()
        if not job:
            return jsonify({'error': 'Вакансия не найдена'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status_filter = request.args.get('status')
        
        query = JobApplication.query.filter_by(job_id=job_id)
        
        if status_filter:
            query = query.filter(JobApplication.status == status_filter)
        
        # Сортировка по скору и дате
        query = query.order_by(desc(JobApplication.score), desc(JobApplication.created_at))
        
        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        # Отмечаем заявки как просмотренные
        for app in pagination.items:
            if not app.viewed_at:
                app.viewed_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'applications': [app.to_dict() for app in pagination.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            },
            'job': job.to_dict()
        })
    
    except Exception as e:
        print(f"Ошибка получения заявок: {e}")
        return jsonify({'error': 'Ошибка при получении заявок'}), 500

@employer_bp.route('/applications/<int:app_id>', methods=['PUT'])
@jwt_required()
def update_application_status(app_id):
    """Обновить статус заявки"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'employer':
            return jsonify({'error': 'Доступ только для работодателей'}), 403
        
        application = JobApplication.query.join(Job).filter(
            JobApplication.id == app_id,
            Job.posted_by == user_id
        ).first()
        
        if not application:
            return jsonify({'error': 'Заявка не найдена'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400
        
        # Обновляем статус
        if 'status' in data:
            valid_statuses = ['pending', 'viewed', 'interview', 'rejected', 'hired']
            if data['status'] not in valid_statuses:
                return jsonify({'error': 'Некорректный статус'}), 400
            
            application.status = data['status']
            application.responded_at = datetime.utcnow()
        
        # Обновляем HR заметки
        if 'hr_notes' in data:
            application.hr_notes = data['hr_notes']
        
        # Обновляем HR оценку
        if 'hr_score' in data:
            hr_score = float(data['hr_score'])
            if 0 <= hr_score <= 1:
                application.hr_score = hr_score
                # Пересчитываем общий скор
                auto_weight = 0.6
                hr_weight = 0.4
                application.score = (
                    (application.auto_score or 0) * auto_weight +
                    application.hr_score * hr_weight
                )
        
        # Дата интервью
        if 'interview_date' in data and data['interview_date']:
            try:
                application.interview_date = datetime.fromisoformat(data['interview_date'])
            except ValueError:
                return jsonify({'error': 'Некорректная дата интервью'}), 400
        
        application.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Заявка успешно обновлена',
            'application': application.to_dict()
        })
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка обновления заявки: {e}")
        return jsonify({'error': 'Ошибка при обновлении заявки'}), 500

@employer_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_employer_dashboard():
    """Получить дашборд работодателя"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'employer':
            return jsonify({'error': 'Доступ только для работодателей'}), 403
        
        # Основная статистика
        total_jobs = Job.query.filter_by(posted_by=user_id).count()
        active_jobs = Job.query.filter_by(posted_by=user_id, is_active=True).count()
        total_applications = db.session.query(JobApplication).join(Job).filter(
            Job.posted_by == user_id
        ).count()
        
        # Заявки по статусам
        applications_by_status = db.session.query(
            JobApplication.status,
            db.func.count(JobApplication.id).label('count')
        ).join(Job).filter(
            Job.posted_by == user_id
        ).group_by(JobApplication.status).all()
        
        # Статистика за последние 30 дней
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        recent_views = db.session.query(
            db.func.sum(Job.views_count).label('total_views')
        ).filter(
            Job.posted_by == user_id,
            Job.created_at >= thirty_days_ago
        ).scalar() or 0
        
        recent_applications = db.session.query(JobApplication).join(Job).filter(
            Job.posted_by == user_id,
            JobApplication.created_at >= thirty_days_ago
        ).count()
        
        # Топ вакансии по просмотрам
        top_jobs = Job.query.filter_by(posted_by=user_id, is_active=True)\
                       .order_by(desc(Job.views_count))\
                       .limit(5)\
                       .all()
        
        return jsonify({
            'stats': {
                'total_jobs': total_jobs,
                'active_jobs': active_jobs,
                'total_applications': total_applications,
                'recent_views': recent_views,
                'recent_applications': recent_applications
            },
            'applications_by_status': {
                status: count for status, count in applications_by_status
            },
            'top_jobs': [
                {
                    'id': job.id,
                    'title': job.title,
                    'views': job.views_count,
                    'applications': job.applications_count,
                    'created_at': job.created_at.isoformat()
                }
                for job in top_jobs
            ]
        })
    
    except Exception as e:
        print(f"Ошибка получения дашборда: {e}")
        return jsonify({'error': 'Ошибка при получении дашборда'}), 500