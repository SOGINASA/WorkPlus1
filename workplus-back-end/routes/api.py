from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
from sqlalchemy import func, desc, and_, or_

from db_models import (
    db, Vacancy, Application, VacancyCategory, Skill, UserSkill, VacancySkill,
    VacancyStatus, ApplicationStatus, User, Employer, Test, UserTestResult,
    Notification, City, SubscriptionTier
)
from routes.api_auth import token_required, employer_required, user_required, admin_required
from utils.helpers import (
    create_search_filters, calculate_matching_score, track_event,
    format_salary, create_social_media_post, send_notification
)
from config import Constants

api_bp = Blueprint('api', __name__)

# Включаем маршруты аутентификации
from routes.api_auth import api_auth_bp
api_bp.register_blueprint(api_auth_bp, url_prefix='/auth')

# === ПУБЛИЧНЫЕ API ENDPOINTS ===

@api_bp.route('/stats', methods=['GET'])
def get_public_stats():
    """Публичная статистика платформы"""
    try:
        # Статистика вакансий
        total_vacancies = Vacancy.query.filter_by(status=VacancyStatus.ACTIVE).count()
        
        # Статистика откликов за последний месяц
        month_ago = datetime.now() - timedelta(days=30)
        monthly_applications = Application.query.filter(
            Application.created_at >= month_ago
        ).count()
        
        # Активные работодатели
        active_employers = Employer.query.filter_by(is_active=True).count()
        
        # Популярные города
        popular_cities = db.session.query(
            Vacancy.city,
            func.count(Vacancy.id).label('count')
        ).filter_by(
            status=VacancyStatus.ACTIVE
        ).group_by(Vacancy.city).order_by(desc('count')).limit(10).all()
        
        # Популярные категории
        popular_categories = db.session.query(
            VacancyCategory.name,
            func.count(Vacancy.id).label('count')
        ).join(Vacancy).filter(
            Vacancy.status == VacancyStatus.ACTIVE
        ).group_by(VacancyCategory.name).order_by(desc('count')).limit(10).all()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_vacancies': total_vacancies,
                'monthly_applications': monthly_applications,
                'active_employers': active_employers,
                'popular_cities': [{'city': city, 'count': count} for city, count in popular_cities],
                'popular_categories': [{'category': cat, 'count': count} for cat, count in popular_categories]
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get public stats error: {str(e)}")
        return jsonify({'error': 'Failed to get statistics'}), 500

@api_bp.route('/vacancies', methods=['GET'])
def get_vacancies():
    """Получение списка вакансий с фильтрами и пагинацией"""
    try:
        # Параметры пагинации
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        # Создаем фильтры из параметров запроса
        filters = create_search_filters(request.args)
        
        # Базовый запрос - только активные вакансии
        query = Vacancy.query.filter_by(status=VacancyStatus.ACTIVE)
        
        # Применяем фильтры
        if filters.get('query'):
            search_term = f"%{filters['query']}%"
            query = query.filter(
                or_(
                    Vacancy.title.ilike(search_term),
                    Vacancy.description.ilike(search_term),
                    Vacancy.requirements.ilike(search_term)
                )
            )
        
        if filters.get('city'):
            query = query.filter(Vacancy.city.ilike(f"%{filters['city']}%"))
        
        if filters.get('salary_from'):
            query = query.filter(
                or_(
                    Vacancy.salary_from >= filters['salary_from'],
                    Vacancy.salary_to >= filters['salary_from']
                )
            )
        
        if filters.get('salary_to'):
            query = query.filter(Vacancy.salary_from <= filters['salary_to'])
        
        if filters.get('experience') is not None:
            query = query.filter(Vacancy.experience_required <= filters['experience'])
        
        if filters.get('employment_type'):
            query = query.filter_by(employment_type=filters['employment_type'])
        
        if filters.get('category_id'):
            query = query.filter_by(category_id=filters['category_id'])
        
        if filters.get('remote_work'):
            query = query.filter_by(remote_work=True)
        
        if filters.get('skill_ids'):
            query = query.join(VacancySkill).filter(
                VacancySkill.skill_id.in_(filters['skill_ids'])
            )
        
        # Сортировка
        sort_by = request.args.get('sort', 'date')
        if sort_by == 'date':
            query = query.order_by(desc(Vacancy.created_at))
        elif sort_by == 'salary':
            query = query.order_by(desc(Vacancy.salary_to), desc(Vacancy.salary_from))
        elif sort_by == 'views':
            query = query.order_by(desc(Vacancy.views_count))
        
        # Пагинация
        vacancies = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Формируем результат
        result = []
        for vacancy in vacancies.items:
            result.append({
                'id': vacancy.id,
                'title': vacancy.title,
                'description': vacancy.description[:200] + '...' if len(vacancy.description) > 200 else vacancy.description,
                'salary': format_salary(vacancy.salary_from, vacancy.salary_to),
                'city': vacancy.city,
                'employment_type': vacancy.employment_type,
                'experience_required': vacancy.experience_required,
                'remote_work': vacancy.remote_work,
                'company_name': vacancy.employer.company_name,
                'category': vacancy.category.name if vacancy.category else None,
                'views_count': vacancy.views_count,
                'applications_count': vacancy.applications_count,
                'published_at': vacancy.published_at.isoformat() if vacancy.published_at else None,
                'created_at': vacancy.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'vacancies': result,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': vacancies.total,
                'pages': vacancies.pages,
                'has_next': vacancies.has_next,
                'has_prev': vacancies.has_prev
            },
            'filters_applied': filters
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get vacancies error: {str(e)}")
        return jsonify({'error': 'Failed to get vacancies'}), 500

@api_bp.route('/vacancies/<int:vacancy_id>', methods=['GET'])
def get_vacancy_detail(vacancy_id):
    """Получение детальной информации о вакансии"""
    try:
        vacancy = Vacancy.query.filter_by(
            id=vacancy_id,
            status=VacancyStatus.ACTIVE
        ).first()
        
        if not vacancy:
            return jsonify({'error': 'Vacancy not found'}), 404
        
        # Увеличиваем счетчик просмотров
        vacancy.increment_views()
        
        # Получаем требуемые навыки
        required_skills = []
        for vs in vacancy.required_skills:
            required_skills.append({
                'id': vs.skill.id,
                'name': vs.skill.name,
                'category': vs.skill.category,
                'required_level': vs.required_level,
                'is_required': vs.is_required
            })
        
        # Получаем тесты
        tests = []
        for vt in vacancy.tests:
            tests.append({
                'id': vt.test.id,
                'title': vt.test.title,
                'description': vt.test.description,
                'is_required': vt.is_required,
                'min_score': vt.min_score
            })
        
        # Информация о компании
        company = {
            'id': vacancy.employer.id,
            'name': vacancy.employer.company_name,
            'description': vacancy.employer.company_description,
            'website': vacancy.employer.company_website,
            'size': vacancy.employer.company_size,
            'industry': vacancy.employer.industry,
            'city': vacancy.employer.city,
            'rating': vacancy.employer.rating,
            'rating_count': vacancy.employer.rating_count,
            'is_verified': vacancy.employer.is_verified
        }
        
        result = {
            'id': vacancy.id,
            'title': vacancy.title,
            'description': vacancy.description,
            'requirements': vacancy.requirements,
            'responsibilities': vacancy.responsibilities,
            'benefits': vacancy.benefits,
            'salary_from': vacancy.salary_from,
            'salary_to': vacancy.salary_to,
            'salary_currency': vacancy.salary_currency,
            'employment_type': vacancy.employment_type,
            'schedule': vacancy.schedule,
            'experience_required': vacancy.experience_required,
            'city': vacancy.city,
            'address': vacancy.address,
            'remote_work': vacancy.remote_work,
            'category': vacancy.category.name if vacancy.category else None,
            'required_skills': required_skills,
            'tests': tests,
            'company': company,
            'views_count': vacancy.views_count,
            'applications_count': vacancy.applications_count,
            'published_at': vacancy.published_at.isoformat() if vacancy.published_at else None,
            'expires_at': vacancy.expires_at.isoformat() if vacancy.expires_at else None,
            'created_at': vacancy.created_at.isoformat()
        }
        
        # Трекинг просмотра
        track_event('vacancy_view', vacancy_id=vacancy_id)
        
        return jsonify({
            'success': True,
            'vacancy': result
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get vacancy detail error: {str(e)}")
        return jsonify({'error': 'Failed to get vacancy details'}), 500

# === API ДЛЯ СОИСКАТЕЛЕЙ ===

@api_bp.route('/user/applications', methods=['GET'])
@user_required
def get_user_applications():
    """Получение списка откликов пользователя"""
    try:
        user = request.current_user
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status_filter = request.args.get('status')
        
        query = Application.query.filter_by(user_id=user.id)
        
        if status_filter:
            try:
                query = query.filter_by(status=ApplicationStatus(status_filter))
            except ValueError:
                return jsonify({'error': 'Invalid status filter'}), 400
        
        applications = query.order_by(desc(Application.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        result = []
        for app in applications.items:
            result.append({
                'id': app.id,
                'status': app.status.value,
                'cover_letter': app.cover_letter,
                'viewed_by_employer': app.viewed_by_employer,
                'viewed_at': app.viewed_at.isoformat() if app.viewed_at else None,
                'interview_scheduled_at': app.interview_scheduled_at.isoformat() if app.interview_scheduled_at else None,
                'interview_notes': app.interview_notes,
                'rejection_reason': app.rejection_reason,
                'created_at': app.created_at.isoformat(),
                'updated_at': app.updated_at.isoformat(),
                'vacancy': {
                    'id': app.vacancy.id,
                    'title': app.vacancy.title,
                    'company_name': app.vacancy.employer.company_name,
                    'city': app.vacancy.city,
                    'salary': format_salary(app.vacancy.salary_from, app.vacancy.salary_to)
                }
            })
        
        return jsonify({
            'success': True,
            'applications': result,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': applications.total,
                'pages': applications.pages,
                'has_next': applications.has_next,
                'has_prev': applications.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get user applications error: {str(e)}")
        return jsonify({'error': 'Failed to get applications'}), 500

@api_bp.route('/user/applications', methods=['POST'])
@user_required
def create_application():
    """Создание отклика на вакансию"""
    try:
        user = request.current_user
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'JSON data required'}), 400
        
        vacancy_id = data.get('vacancy_id')
        cover_letter = data.get('cover_letter', '').strip()
        
        if not vacancy_id:
            return jsonify({'error': 'Vacancy ID is required'}), 400
        
        # Проверяем существование вакансии
        vacancy = Vacancy.query.filter_by(
            id=vacancy_id,
            status=VacancyStatus.ACTIVE
        ).first()
        
        if not vacancy:
            return jsonify({'error': 'Vacancy not found or not active'}), 404
        
        # Проверяем, не подавал ли уже отклик
        existing_application = Application.query.filter_by(
            user_id=user.id,
            vacancy_id=vacancy_id
        ).first()
        
        if existing_application:
            return jsonify({'error': 'Application already exists'}), 409
        
        # Создаем отклик
        application = Application(
            user_id=user.id,
            vacancy_id=vacancy_id,
            cover_letter=cover_letter,
            status=ApplicationStatus.NEW
        )
        
        db.session.add(application)
        
        # Увеличиваем счетчик откликов у вакансии
        vacancy.applications_count += 1
        
        db.session.commit()
        
        # Отправляем уведомление работодателю
        send_notification(
            employer_id=vacancy.employer_id,
            title='Новый отклик на вакансию',
            message=f'На вашу вакансию "{vacancy.title}" поступил новый отклик от {user.full_name}',
            notification_type='new_application',
            related_vacancy_id=vacancy_id,
            related_application_id=application.id
        )
        
        # Трекинг события
        track_event('application_sent', user_id=user.id, 
                   vacancy_id=vacancy_id, 
                   metadata={'application_id': application.id})
        
        return jsonify({
            'success': True,
            'message': 'Application submitted successfully',
            'application': {
                'id': application.id,
                'status': application.status.value,
                'created_at': application.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create application error: {str(e)}")
        return jsonify({'error': 'Failed to submit application'}), 500

@api_bp.route('/user/profile', methods=['PUT'])
@user_required
def update_user_profile():
    """Обновление профиля пользователя"""
    try:
        user = request.current_user
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'JSON data required'}), 400
        
        # Обновляемые поля
        updateable_fields = [
            'full_name', 'phone', 'city', 'bio', 'experience_years',
            'desired_salary_from', 'desired_salary_to', 
            'notifications_email', 'notifications_sms', 'notifications_telegram'
        ]
        
        for field in updateable_fields:
            if field in data:
                setattr(user, field, data[field])
        
        # Дата рождения
        if 'birth_date' in data and data['birth_date']:
            try:
                user.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid birth date format'}), 400
        
        user.updated_at = datetime.now()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update user profile error: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500

@api_bp.route('/user/skills', methods=['GET'])
@user_required
def get_user_skills():
    """Получение навыков пользователя"""
    try:
        user = request.current_user
        
        skills = []
        for user_skill in user.skills:
            skills.append({
                'id': user_skill.skill.id,
                'name': user_skill.skill.name,
                'category': user_skill.skill.category,
                'level': user_skill.level,
                'years_experience': user_skill.years_experience,
                'is_verified': user_skill.is_verified,
                'verified_at': user_skill.verified_at.isoformat() if user_skill.verified_at else None
            })
        
        return jsonify({
            'success': True,
            'skills': skills
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get user skills error: {str(e)}")
        return jsonify({'error': 'Failed to get skills'}), 500

@api_bp.route('/user/skills', methods=['PUT'])
@user_required
def update_user_skills():
    """Обновление навыков пользователя"""
    try:
        user = request.current_user
        data = request.get_json()
        
        if not data or 'skills' not in data:
            return jsonify({'error': 'Skills data required'}), 400
        
        # Удаляем старые навыки
        UserSkill.query.filter_by(user_id=user.id).delete()
        
        # Добавляем новые
        for skill_data in data['skills']:
            skill_id = skill_data.get('skill_id')
            level = skill_data.get('level', 1)
            years_experience = skill_data.get('years_experience', 0)
            
            if not skill_id or not Skill.query.get(skill_id):
                continue
            
            user_skill = UserSkill(
                user_id=user.id,
                skill_id=skill_id,
                level=min(5, max(1, level)),
                years_experience=max(0, years_experience)
            )
            db.session.add(user_skill)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Skills updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update user skills error: {str(e)}")
        return jsonify({'error': 'Failed to update skills'}), 500

# === API ДЛЯ РАБОТОДАТЕЛЕЙ ===

@api_bp.route('/employer/vacancies', methods=['GET'])
@employer_required
def get_employer_vacancies():
    """Получение вакансий работодателя"""
    try:
        employer = request.current_user
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status_filter = request.args.get('status')
        
        query = Vacancy.query.filter_by(employer_id=employer.id)
        
        if status_filter:
            try:
                query = query.filter_by(status=VacancyStatus(status_filter))
            except ValueError:
                return jsonify({'error': 'Invalid status filter'}), 400
        
        vacancies = query.order_by(desc(Vacancy.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        result = []
        for vacancy in vacancies.items:
            result.append({
                'id': vacancy.id,
                'title': vacancy.title,
                'description': vacancy.description[:200] + '...' if len(vacancy.description) > 200 else vacancy.description,
                'status': vacancy.status.value,
                'city': vacancy.city,
                'salary': format_salary(vacancy.salary_from, vacancy.salary_to),
                'employment_type': vacancy.employment_type,
                'views_count': vacancy.views_count,
                'applications_count': vacancy.applications_count,
                'published_at': vacancy.published_at.isoformat() if vacancy.published_at else None,
                'created_at': vacancy.created_at.isoformat(),
                'updated_at': vacancy.updated_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'vacancies': result,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': vacancies.total,
                'pages': vacancies.pages,
                'has_next': vacancies.has_next,
                'has_prev': vacancies.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get employer vacancies error: {str(e)}")
        return jsonify({'error': 'Failed to get vacancies'}), 500

@api_bp.route('/employer/vacancies', methods=['POST'])
@employer_required
def create_vacancy():
    """Создание новой вакансии"""
    try:
        employer = request.current_user
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'JSON data required'}), 400
        
        # Проверяем лимиты по подписке
        if not employer.can_create_vacancy():
            return jsonify({'error': 'Vacancy limit reached for your subscription'}), 403
        
        # Обязательные поля
        required_fields = ['title', 'description', 'employment_type', 'city']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Создаем вакансию
        vacancy = Vacancy(
            title=data['title'].strip(),
            description=data['description'].strip(),
            requirements=data.get('requirements', '').strip(),
            responsibilities=data.get('responsibilities', '').strip(),
            benefits=data.get('benefits', '').strip(),
            salary_from=data.get('salary_from'),
            salary_to=data.get('salary_to'),
            employment_type=data['employment_type'],
            schedule=data.get('schedule', '').strip(),
            experience_required=data.get('experience_required', 0),
            city=data['city'].strip(),
            address=data.get('address', '').strip(),
            remote_work=data.get('remote_work', False),
            category_id=data.get('category_id'),
            employer_id=employer.id,
            status=VacancyStatus.DRAFT
        )
        
        db.session.add(vacancy)
        db.session.flush()  # Получаем ID
        
        # Добавляем требуемые навыки
        skills = data.get('required_skills', [])
        for skill_data in skills:
            skill_id = skill_data.get('skill_id')
            if skill_id and Skill.query.get(skill_id):
                vacancy_skill = VacancySkill(
                    vacancy_id=vacancy.id,
                    skill_id=skill_id,
                    required_level=skill_data.get('level', 1),
                    is_required=skill_data.get('is_required', False)
                )
                db.session.add(vacancy_skill)
        
        # Автопубликация
        if data.get('auto_publish', False):
            vacancy.status = VacancyStatus.ACTIVE
            vacancy.published_at = datetime.now()
            employer.used_vacancies += 1
            
            # Автопостинг в соцсети (если доступно по тарифу)
            if employer.subscription_tier in [SubscriptionTier.START, SubscriptionTier.GROWTH, SubscriptionTier.PRO]:
                if data.get('auto_post_social', False):
                    create_social_media_post(vacancy)
        
        db.session.commit()
        
        # Трекинг события
        track_event('vacancy_created', employer_id=employer.id, 
                   vacancy_id=vacancy.id)
        
        return jsonify({
            'success': True,
            'message': 'Vacancy created successfully',
            'vacancy': {
                'id': vacancy.id,
                'title': vacancy.title,
                'status': vacancy.status.value,
                'created_at': vacancy.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create vacancy error: {str(e)}")
        return jsonify({'error': 'Failed to create vacancy'}), 500

@api_bp.route('/employer/vacancies/<int:vacancy_id>/applications', methods=['GET'])
@employer_required
def get_vacancy_applications(vacancy_id):
    """Получение откликов на вакансию"""
    try:
        employer = request.current_user
        
        # Проверяем, принадлежит ли вакансия текущему работодателю
        vacancy = Vacancy.query.filter_by(
            id=vacancy_id,
            employer_id=employer.id
        ).first()
        
        if not vacancy:
            return jsonify({'error': 'Vacancy not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status_filter = request.args.get('status')
        
        query = Application.query.filter_by(vacancy_id=vacancy_id)
        
        if status_filter:
            try:
                query = query.filter_by(status=ApplicationStatus(status_filter))
            except ValueError:
                return jsonify({'error': 'Invalid status filter'}), 400
        
        applications = query.order_by(desc(Application.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        result = []
        for app in applications.items:
            # Отмечаем как просмотренный, если еще не был
            if not app.viewed_by_employer:
                app.mark_as_viewed()
            
            # Расчет совместимости
            matching_score = calculate_matching_score(vacancy, app.user)
            
            result.append({
                'id': app.id,
                'status': app.status.value,
                'cover_letter': app.cover_letter,
                'matching_score': matching_score,
                'interview_scheduled_at': app.interview_scheduled_at.isoformat() if app.interview_scheduled_at else None,
                'interview_notes': app.interview_notes,
                'rejection_reason': app.rejection_reason,
                'created_at': app.created_at.isoformat(),
                'candidate': {
                    'id': app.user.id,
                    'full_name': app.user.full_name,
                    'city': app.user.city,
                    'experience_years': app.user.experience_years,
                    'desired_salary_from': app.user.desired_salary_from,
                    'desired_salary_to': app.user.desired_salary_to,
                    'avatar_path': app.user.avatar_path,
                    'rating': app.user.rating,
                    'is_verified': app.user.is_verified
                }
            })
        
        return jsonify({
            'success': True,
            'applications': result,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': applications.total,
                'pages': applications.pages,
                'has_next': applications.has_next,
                'has_prev': applications.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get vacancy applications error: {str(e)}")
        return jsonify({'error': 'Failed to get applications'}), 500

@api_bp.route('/employer/applications/<int:application_id>/status', methods=['PUT'])
@employer_required
def update_application_status(application_id):
    """Обновление статуса отклика"""
    try:
        employer = request.current_user
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'JSON data required'}), 400
        
        new_status = data.get('status')
        if not new_status:
            return jsonify({'error': 'Status is required'}), 400
        
        # Проверяем, принадлежит ли отклик вакансии этого работодателя
        application = db.session.query(Application).join(Vacancy).filter(
            and_(
                Application.id == application_id,
                Vacancy.employer_id == employer.id
            )
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        try:
            application.status = ApplicationStatus(new_status)
            application.updated_at = datetime.now()
            
            # Дополнительные поля в зависимости от статуса
            if new_status == 'interview_scheduled':
                interview_date = data.get('interview_date')
                if interview_date:
                    try:
                        application.interview_scheduled_at = datetime.fromisoformat(interview_date)
                    except ValueError:
                        return jsonify({'error': 'Invalid interview date format'}), 400
            
            if new_status == 'rejected':
                application.rejection_reason = data.get('rejection_reason', '')
            
            if data.get('notes'):
                application.interview_notes = data.get('notes')
            
            db.session.commit()
            
            # Отправляем уведомление кандидату
            notification_messages = {
                'viewed': 'Ваш отклик просмотрен работодателем',
                'screening': 'Ваш отклик прошел первичный отбор',
                'interview_scheduled': 'Вам назначено собеседование',
                'interviewed': 'Собеседование завершено, ожидайте результатов',
                'offer_sent': 'Поздравляем! Вам отправлено предложение о работе',
                'hired': 'Поздравляем! Вы приняты на работу',
                'rejected': 'К сожалению, по вашему отклику принято отрицательное решение'
            }
            
            if new_status in notification_messages:
                send_notification(
                    user_id=application.user_id,
                    title='Обновление по отклику',
                    message=notification_messages[new_status],
                    notification_type='application_status_update',
                    related_application_id=application.id
                )
            
            # Трекинг события
            track_event('application_status_updated', employer_id=employer.id, 
                       metadata={'application_id': application.id, 'new_status': new_status})
            
            return jsonify({
                'success': True,
                'message': 'Application status updated successfully'
            }), 200
            
        except ValueError:
            return jsonify({'error': 'Invalid status value'}), 400
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update application status error: {str(e)}")
        return jsonify({'error': 'Failed to update application status'}), 500

# === СПРАВОЧНЫЕ API ===

@api_bp.route('/categories', methods=['GET'])
def get_categories():
    """Получение категорий вакансий"""
    try:
        categories = VacancyCategory.query.filter_by(is_active=True).order_by(
            VacancyCategory.sort_order
        ).all()
        
        result = []
        for category in categories:
            result.append({
                'id': category.id,
                'name': category.name,
                'description': category.description
            })
        
        return jsonify({
            'success': True,
            'categories': result
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get categories error: {str(e)}")
        return jsonify({'error': 'Failed to get categories'}), 500

@api_bp.route('/skills', methods=['GET'])
def get_skills():
    """Получение списка навыков"""
    try:
        category_filter = request.args.get('category')
        
        query = Skill.query.order_by(Skill.name)
        if category_filter:
            query = query.filter_by(category=category_filter)
        
        skills = query.all()
        
        result = []
        for skill in skills:
            result.append({
                'id': skill.id,
                'name': skill.name,
                'category': skill.category,
                'description': skill.description,
                'is_verified': skill.is_verified
            })
        
        return jsonify({
            'success': True,
            'skills': result
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get skills error: {str(e)}")
        return jsonify({'error': 'Failed to get skills'}), 500

@api_bp.route('/cities', methods=['GET'])
def get_cities():
    """Получение списка городов"""
    try:
        cities = City.query.filter_by(is_active=True).order_by(
            City.is_regional_center.desc(),
            City.population.desc()
        ).all()
        
        result = []
        for city in cities:
            result.append({
                'id': city.id,
                'name_ru': city.name_ru,
                'name_kz': city.name_kz,
                'region': city.region,
                'is_regional_center': city.is_regional_center,
                'population': city.population
            })
        
        return jsonify({
            'success': True,
            'cities': result
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get cities error: {str(e)}")
        return jsonify({'error': 'Failed to get cities'}), 500

@api_bp.route('/constants', methods=['GET'])
def get_constants():
    """Получение констант приложения"""
    return jsonify({
        'success': True,
        'constants': {
            'vacancy_statuses': Constants.VACANCY_STATUSES,
            'application_statuses': Constants.APPLICATION_STATUSES,
            'employment_types': Constants.EMPLOYMENT_TYPES,
            'experience_levels': Constants.EXPERIENCE_LEVELS,
            'company_sizes': Constants.COMPANY_SIZES,
            'industries': Constants.INDUSTRIES,
            'social_platforms': Constants.SOCIAL_PLATFORMS
        }
    }), 200