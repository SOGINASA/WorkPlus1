from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
from sqlalchemy import func, desc, and_, or_

from db_models import (
    db, Vacancy, Application, VacancyCategory, Skill, UserSkill, 
    VacancyStatus, ApplicationStatus, User, Test, UserTestResult,
    Notification, AnalyticsEvent, TestQuestion
)
from routes.api_auth import user_required, token_required
from utils.helpers import (
    calculate_matching_score, create_search_filters, format_salary,
    send_notification, track_event
)
from config import Constants

user_bp = Blueprint('user', __name__)

@user_bp.route('/dashboard', methods=['GET'])
@user_required
def get_dashboard_stats():
    """API: Статистика дашборда пользователя"""
    try:
        user = request.current_user
        
        # Статистика по откликам
        total_applications = Application.query.filter_by(user_id=user.id).count()
        
        # Новые отклики за неделю
        week_ago = datetime.now() - timedelta(days=7)
        new_applications = Application.query.filter_by(
            user_id=user.id
        ).filter(Application.created_at >= week_ago).count()
        
        # Статистика по статусам
        applications_by_status = db.session.query(
            Application.status,
            func.count(Application.id)
        ).filter_by(user_id=user.id).group_by(Application.status).all()
        
        status_stats = {status.value: count for status, count in applications_by_status}
        
        # Последние отклики
        recent_applications = Application.query.filter_by(
            user_id=user.id
        ).order_by(desc(Application.created_at)).limit(5).all()
        
        recent_applications_data = []
        for app in recent_applications:
            recent_applications_data.append({
                'id': app.id,
                'status': app.status.value,
                'created_at': app.created_at.isoformat(),
                'vacancy': {
                    'id': app.vacancy.id,
                    'title': app.vacancy.title,
                    'company_name': app.vacancy.employer.company_name,
                    'city': app.vacancy.city
                }
            })
        
        # Рекомендованные вакансии
        recommended_vacancies = []
        if user.city and user.experience_years is not None:
            base_query = Vacancy.query.filter_by(status=VacancyStatus.ACTIVE)
            
            # Фильтр по городу и опыту
            recommended = base_query.filter(
                and_(
                    Vacancy.city == user.city,
                    Vacancy.experience_required <= user.experience_years + 1
                )
            ).order_by(desc(Vacancy.created_at)).limit(5).all()
            
            for vacancy in recommended:
                matching_score = calculate_matching_score(vacancy, user)
                recommended_vacancies.append({
                    'id': vacancy.id,
                    'title': vacancy.title,
                    'company_name': vacancy.employer.company_name,
                    'city': vacancy.city,
                    'salary': format_salary(vacancy.salary_from, vacancy.salary_to),
                    'matching_score': matching_score,
                    'created_at': vacancy.created_at.isoformat()
                })
        
        # Непрочитанные уведомления
        unread_notifications = Notification.query.filter_by(
            user_id=user.id,
            is_read=False
        ).count()
        
        # Процент заполненности профиля
        profile_completeness = calculate_profile_completeness(user)
        
        return jsonify({
            'success': True,
            'stats': {
                'total_applications': total_applications,
                'new_applications': new_applications,
                'status_stats': status_stats
            },
            'recent_applications': recent_applications_data,
            'recommended_vacancies': recommended_vacancies,
            'unread_notifications': unread_notifications,
            'profile_completeness': profile_completeness
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get dashboard stats error: {str(e)}")
        return jsonify({'error': 'Failed to get dashboard statistics'}), 500

def calculate_profile_completeness(user):
    """Расчет процента заполненности профиля"""
    total_fields = 10
    filled_fields = 0
    
    if user.full_name:
        filled_fields += 1
    if user.email:
        filled_fields += 1
    if user.phone:
        filled_fields += 1
    if user.city:
        filled_fields += 1
    if user.birth_date:
        filled_fields += 1
    if user.bio:
        filled_fields += 1
    if user.experience_years is not None:
        filled_fields += 1
    if user.desired_salary_from or user.desired_salary_to:
        filled_fields += 1
    if user.resume_file:
        filled_fields += 1
    if user.skills:
        filled_fields += 1
    
    return int((filled_fields / total_fields) * 100)

@user_bp.route('/search', methods=['GET'])
@user_required
def search_vacancies():
    """API: Поиск вакансий"""
    try:
        user = request.current_user
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
            from db_models import VacancySkill
            query = query.join(VacancySkill).filter(
                VacancySkill.skill_id.in_(filters['skill_ids'])
            )
        
        # Сортировка
        sort_by = request.args.get('sort', 'date')
        if sort_by == 'date':
            query = query.order_by(desc(Vacancy.created_at))
        elif sort_by == 'salary':
            query = query.order_by(desc(Vacancy.salary_to), desc(Vacancy.salary_from))
        elif sort_by == 'relevance':
            # Сортировка по релевантности (упрощенная)
            query = query.order_by(desc(Vacancy.created_at))
        
        # Пагинация
        vacancies = query.paginate(page=page, per_page=per_page, error_out=False)
        
        # Формируем результат с расчетом совместимости
        result = []
        for vacancy in vacancies.items:
            matching_score = calculate_matching_score(vacancy, user)
            
            # Проверяем, подавал ли уже отклик
            has_applied = Application.query.filter_by(
                user_id=user.id,
                vacancy_id=vacancy.id
            ).first() is not None
            
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
                'matching_score': matching_score,
                'has_applied': has_applied,
                'published_at': vacancy.published_at.isoformat() if vacancy.published_at else None,
                'created_at': vacancy.created_at.isoformat()
            })
        
        # Трекинг поиска
        track_event('vacancy_search', user_id=user.id, metadata=filters)
        
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
        current_app.logger.error(f"Search vacancies error: {str(e)}")
        return jsonify({'error': 'Failed to search vacancies'}), 500

@user_bp.route('/vacancy/<int:vacancy_id>', methods=['GET'])
@user_required
def get_vacancy_detail(vacancy_id):
    """API: Детальный просмотр вакансии для пользователя"""
    try:
        user = request.current_user
        
        vacancy = Vacancy.query.filter_by(
            id=vacancy_id,
            status=VacancyStatus.ACTIVE
        ).first()
        
        if not vacancy:
            return jsonify({'error': 'Vacancy not found'}), 404
        
        # Увеличиваем счетчик просмотров
        vacancy.increment_views()
        
        # Проверяем, подавал ли уже отклик
        existing_application = Application.query.filter_by(
            user_id=user.id,
            vacancy_id=vacancy_id
        ).first()
        
        # Расчет совместимости
        matching_score = calculate_matching_score(vacancy, user)
        
        # Похожие вакансии
        similar_vacancies = Vacancy.query.filter(
            and_(
                Vacancy.id != vacancy_id,
                Vacancy.status == VacancyStatus.ACTIVE,
                or_(
                    Vacancy.city == vacancy.city,
                    Vacancy.category_id == vacancy.category_id
                )
            )
        ).limit(5).all()
        
        similar_vacancies_data = []
        for v in similar_vacancies:
            similar_vacancies_data.append({
                'id': v.id,
                'title': v.title,
                'company_name': v.employer.company_name,
                'city': v.city,
                'salary': format_salary(v.salary_from, v.salary_to)
            })
        
        # Требуемые тесты
        required_tests = []
        optional_tests = []
        
        for vt in vacancy.tests:
            test_data = {
                'id': vt.test.id,
                'title': vt.test.title,
                'description': vt.test.description,
                'questions_count': vt.test.questions_count,
                'time_limit': vt.test.time_limit,
                'passing_score': vt.test.passing_score,
                'min_score': vt.min_score
            }
            
            if vt.is_required:
                required_tests.append(test_data)
            else:
                optional_tests.append(test_data)
        
        # Результаты тестов пользователя
        user_test_results = {}
        for tr in user.test_results:
            if tr.is_passed:
                user_test_results[tr.test_id] = {
                    'score': tr.score,
                    'passed': tr.is_passed,
                    'completed_at': tr.completed_at.isoformat()
                }
        
        # Требуемые навыки
        required_skills = []
        for vs in vacancy.required_skills:
            required_skills.append({
                'id': vs.skill.id,
                'name': vs.skill.name,
                'category': vs.skill.category,
                'required_level': vs.required_level,
                'is_required': vs.is_required
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
        
        vacancy_data = {
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
            'required_tests': required_tests,
            'optional_tests': optional_tests,
            'company': company,
            'views_count': vacancy.views_count,
            'applications_count': vacancy.applications_count,
            'published_at': vacancy.published_at.isoformat() if vacancy.published_at else None,
            'expires_at': vacancy.expires_at.isoformat() if vacancy.expires_at else None,
            'created_at': vacancy.created_at.isoformat()
        }
        
        application_data = None
        if existing_application:
            application_data = {
                'id': existing_application.id,
                'status': existing_application.status.value,
                'created_at': existing_application.created_at.isoformat(),
                'viewed_by_employer': existing_application.viewed_by_employer
            }
        
        # Трекинг просмотра
        track_event('vacancy_view', user_id=user.id, vacancy_id=vacancy_id)
        
        return jsonify({
            'success': True,
            'vacancy': vacancy_data,
            'matching_score': matching_score,
            'similar_vacancies': similar_vacancies_data,
            'user_test_results': user_test_results,
            'application': application_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get vacancy detail error: {str(e)}")
        return jsonify({'error': 'Failed to get vacancy details'}), 500

@user_bp.route('/applications', methods=['GET'])
@user_required
def get_my_applications():
    """API: Мои отклики"""
    try:
        user = request.current_user
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status_filter = request.args.get('status', 'all')
        
        query = Application.query.filter_by(user_id=user.id)
        
        if status_filter != 'all':
            try:
                query = query.filter_by(status=ApplicationStatus(status_filter))
            except ValueError:
                return jsonify({'error': 'Invalid status filter'}), 400
        
        applications = query.order_by(desc(Application.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Статистика по статусам
        status_counts = db.session.query(
            Application.status,
            func.count(Application.id)
        ).filter_by(user_id=user.id).group_by(Application.status).all()
        
        status_stats = {status.value: count for status, count in status_counts}
        
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
                    'salary': format_salary(app.vacancy.salary_from, app.vacancy.salary_to),
                    'status': app.vacancy.status.value
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
            },
            'status_stats': status_stats
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get user applications error: {str(e)}")
        return jsonify({'error': 'Failed to get applications'}), 500

@user_bp.route('/applications/<int:application_id>', methods=['GET'])
@user_required
def get_application_detail(application_id):
    """API: Детали отклика"""
    try:
        user = request.current_user
        
        application = Application.query.filter_by(
            id=application_id,
            user_id=user.id
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Результаты тестов по этому отклику
        test_results = []
        for tr in application.test_results:
            test_results.append({
                'test_id': tr.test_id,
                'test_title': tr.test.title,
                'score': tr.score,
                'max_score': tr.max_score,
                'is_passed': tr.is_passed,
                'completed_at': tr.completed_at.isoformat() if tr.completed_at else None
            })
        
        application_data = {
            'id': application.id,
            'status': application.status.value,
            'cover_letter': application.cover_letter,
            'viewed_by_employer': application.viewed_by_employer,
            'viewed_at': application.viewed_at.isoformat() if application.viewed_at else None,
            'interview_scheduled_at': application.interview_scheduled_at.isoformat() if application.interview_scheduled_at else None,
            'interview_notes': application.interview_notes,
            'rejection_reason': application.rejection_reason,
            'created_at': application.created_at.isoformat(),
            'updated_at': application.updated_at.isoformat(),
            'vacancy': {
                'id': application.vacancy.id,
                'title': application.vacancy.title,
                'description': application.vacancy.description,
                'company_name': application.vacancy.employer.company_name,
                'city': application.vacancy.city,
                'salary': format_salary(application.vacancy.salary_from, application.vacancy.salary_to),
                'employment_type': application.vacancy.employment_type
            },
            'test_results': test_results
        }
        
        return jsonify({
            'success': True,
            'application': application_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get application detail error: {str(e)}")
        return jsonify({'error': 'Failed to get application details'}), 500

@user_bp.route('/tests', methods=['GET'])
@user_required
def get_available_tests():
    """API: Доступные тесты"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        category_filter = request.args.get('category', 'all')
        
        query = Test.query.filter_by(is_active=True)
        
        if category_filter != 'all':
            query = query.join(Skill).filter(Skill.category == category_filter)
        
        tests = query.order_by(Test.title).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Результаты тестов пользователя
        user = request.current_user
        user_results = {}
        for tr in user.test_results:
            user_results[tr.test_id] = {
                'best_score': tr.score,
                'is_passed': tr.is_passed,
                'completed_at': tr.completed_at.isoformat() if tr.completed_at else None
            }
        
        result = []
        for test in tests.items:
            user_result = user_results.get(test.id)
            
            result.append({
                'id': test.id,
                'title': test.title,
                'description': test.description,
                'skill_name': test.skill.name if test.skill else None,
                'skill_category': test.skill.category if test.skill else None,
                'questions_count': test.questions_count,
                'time_limit': test.time_limit,
                'passing_score': test.passing_score,
                'user_result': user_result
            })
        
        # Категории навыков для фильтра
        skill_categories = db.session.query(Skill.category).distinct().all()
        categories = [cat[0] for cat in skill_categories if cat[0]]
        
        return jsonify({
            'success': True,
            'tests': result,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': tests.total,
                'pages': tests.pages,
                'has_next': tests.has_next,
                'has_prev': tests.has_prev
            },
            'categories': categories
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get available tests error: {str(e)}")
        return jsonify({'error': 'Failed to get tests'}), 500

@user_bp.route('/notifications', methods=['GET'])
@user_required
def get_notifications():
    """API: Уведомления пользователя"""
    try:
        user = request.current_user
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        notifications = Notification.query.filter_by(
            user_id=user.id
        ).order_by(desc(Notification.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        result = []
        for notification in notifications.items:
            result.append({
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'notification_type': notification.notification_type,
                'is_read': notification.is_read,
                'read_at': notification.read_at.isoformat() if notification.read_at else None,
                'created_at': notification.created_at.isoformat(),
                'related_vacancy_id': notification.related_vacancy_id,
                'related_application_id': notification.related_application_id
            })
        
        return jsonify({
            'success': True,
            'notifications': result,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': notifications.total,
                'pages': notifications.pages,
                'has_next': notifications.has_next,
                'has_prev': notifications.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get notifications error: {str(e)}")
        return jsonify({'error': 'Failed to get notifications'}), 500

@user_bp.route('/notifications/mark-read', methods=['PUT'])
@user_required
def mark_notifications_read():
    """API: Отметить уведомления как прочитанные"""
    try:
        user = request.current_user
        data = request.get_json()
        
        notification_ids = data.get('notification_ids', []) if data else []
        
        if notification_ids:
            # Отмечаем конкретные уведомления
            notifications = Notification.query.filter(
                and_(
                    Notification.user_id == user.id,
                    Notification.id.in_(notification_ids),
                    Notification.is_read == False
                )
            ).all()
        else:
            # Отмечаем все непрочитанные
            notifications = Notification.query.filter_by(
                user_id=user.id,
                is_read=False
            ).all()
        
        for notification in notifications:
            notification.is_read = True
            notification.read_at = datetime.now()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'{len(notifications)} notifications marked as read'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Mark notifications read error: {str(e)}")
        return jsonify({'error': 'Failed to mark notifications as read'}), 500
    

from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from sqlalchemy import func, desc, and_, or_

from db_models import (
    db, Vacancy, Application, VacancyCategory, Skill, UserSkill, 
    VacancyStatus, ApplicationStatus, User, Test, UserTestResult,
    Notification, AnalyticsEvent, TestQuestion
)
from utils.decorators import user_required
from utils.helpers import (
    allowed_file, save_uploaded_file, send_notification, track_event,
    calculate_matching_score, create_search_filters, paginate_query,
    format_salary
)
from config import Constants

user_bp = Blueprint('user', __name__, template_folder='../templates/user')

@user_bp.route('/dashboard')
@login_required
@user_required
def dashboard():
    """Дашборд пользователя"""
    
    # Статистика по откликам
    total_applications = Application.query.filter_by(user_id=current_user.id).count()
    
    # Новые отклики за неделю
    week_ago = datetime.now() - timedelta(days=7)
    new_applications = Application.query.filter_by(
        user_id=current_user.id
    ).filter(Application.created_at >= week_ago).count()
    
    # Статистика по статусам
    applications_by_status = db.session.query(
        Application.status,
        func.count(Application.id)
    ).filter_by(user_id=current_user.id).group_by(Application.status).all()
    
    status_stats = {status.value: count for status, count in applications_by_status}
    
    # Последние отклики
    recent_applications = Application.query.filter_by(
        user_id=current_user.id
    ).order_by(desc(Application.created_at)).limit(5).all()
    
    # Рекомендованные вакансии
    recommended_vacancies = []
    if current_user.city and current_user.experience_years is not None:
        base_query = Vacancy.query.filter_by(status=VacancyStatus.ACTIVE)
        
        # Фильтр по городу
        city_vacancies = base_query.filter_by(city=current_user.city)
        
        # Фильтр по опыту
        experience_vacancies = city_vacancies.filter(
            Vacancy.experience_required <= current_user.experience_years + 1
        )
        
        recommended_vacancies = experience_vacancies.order_by(
            desc(Vacancy.created_at)
        ).limit(5).all()
        
        # Если мало рекомендаций, добавляем общие по городу
        if len(recommended_vacancies) < 5:
            additional = city_vacancies.filter(
                ~Vacancy.id.in_([v.id for v in recommended_vacancies])
            ).limit(5 - len(recommended_vacancies)).all()
            recommended_vacancies.extend(additional)
    
    # Непрочитанные уведомления
    unread_notifications = Notification.query.filter_by(
        user_id=current_user.id,
        is_read=False
    ).count()
    
    # Профиль заполнен
    profile_completeness = calculate_profile_completeness(current_user)
    
    return render_template('dashboard.html',
                         total_applications=total_applications,
                         new_applications=new_applications,
                         status_stats=status_stats,
                         recent_applications=recent_applications,
                         recommended_vacancies=recommended_vacancies,
                         unread_notifications=unread_notifications,
                         profile_completeness=profile_completeness)

def calculate_profile_completeness(user):
    """Расчет процента заполненности профиля"""
    total_fields = 10
    filled_fields = 0
    
    if user.full_name:
        filled_fields += 1
    if user.email:
        filled_fields += 1
    if user.phone:
        filled_fields += 1
    if user.city:
        filled_fields += 1
    if user.birth_date:
        filled_fields += 1
    if user.bio:
        filled_fields += 1
    if user.experience_years is not None:
        filled_fields += 1
    if user.desired_salary_from or user.desired_salary_to:
        filled_fields += 1
    if user.resume_file:
        filled_fields += 1
    if user.skills:
        filled_fields += 1
    
    return int((filled_fields / total_fields) * 100)

@user_bp.route('/search')
@login_required
@user_required
def search_vacancies():
    """Поиск вакансий"""
    page = request.args.get('page', 1, type=int)
    
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
        from db_models import VacancySkill
        query = query.join(VacancySkill).filter(
            VacancySkill.skill_id.in_(filters['skill_ids'])
        )
    
    # Сортировка
    sort_by = request.args.get('sort', 'date')
    if sort_by == 'date':
        query = query.order_by(desc(Vacancy.created_at))
    elif sort_by == 'salary':
        query = query.order_by(desc(Vacancy.salary_to), desc(Vacancy.salary_from))
    elif sort_by == 'relevance':
        # TODO: Реализовать сортировку по релевантности
        query = query.order_by(desc(Vacancy.created_at))
    
    # Пагинация
    vacancies = paginate_query(query, page=page, per_page=20)
    
    # Получаем данные для фильтров
    categories = VacancyCategory.query.filter_by(is_active=True).all()
    skills = Skill.query.order_by(Skill.name).all()
    
    # Популярные города
    popular_cities = db.session.query(
        Vacancy.city,
        func.count(Vacancy.id).label('count')
    ).filter_by(status=VacancyStatus.ACTIVE).group_by(
        Vacancy.city
    ).order_by(desc('count')).limit(10).all()
    
    # Трекинг поиска
    track_event('vacancy_search', current_user.id, metadata=filters)
    
    return render_template('search.html',
                         vacancies=vacancies,
                         filters=filters,
                         categories=categories,
                         skills=skills,
                         popular_cities=popular_cities,
                         employment_types=Constants.EMPLOYMENT_TYPES,
                         experience_levels=Constants.EXPERIENCE_LEVELS)

@user_bp.route('/vacancy/<int:vacancy_id>')
@login_required
@user_required
def vacancy_detail(vacancy_id):
    """Детальный просмотр вакансии"""
    vacancy = Vacancy.query.filter_by(
        id=vacancy_id,
        status=VacancyStatus.ACTIVE
    ).first_or_404()
    
    # Увеличиваем счетчик просмотров
    vacancy.increment_views()
    
    # Проверяем, подавал ли уже отклик
    existing_application = Application.query.filter_by(
        user_id=current_user.id,
        vacancy_id=vacancy_id
    ).first()
    
    # Расчет совместимости
    matching_score = calculate_matching_score(vacancy, current_user)
    
    # Похожие вакансии
    similar_vacancies = Vacancy.query.filter(
        and_(
            Vacancy.id != vacancy_id,
            Vacancy.status == VacancyStatus.ACTIVE,
            or_(
                Vacancy.city == vacancy.city,
                Vacancy.category_id == vacancy.category_id
            )
        )
    ).limit(5).all()
    
    # Требуемые тесты
    required_tests = [vt.test for vt in vacancy.tests if vt.is_required]
    optional_tests = [vt.test for vt in vacancy.tests if not vt.is_required]
    
    # Результаты тестов пользователя
    user_test_results = {}
    if current_user.test_results:
        user_test_results = {
            tr.test_id: tr for tr in current_user.test_results 
            if tr.is_passed
        }
    
    # Трекинг просмотра
    track_event('vacancy_view', current_user.id, vacancy_id=vacancy_id)
    
    return render_template('vacancy_detail.html',
                         vacancy=vacancy,
                         existing_application=existing_application,
                         matching_score=matching_score,
                         similar_vacancies=similar_vacancies,
                         required_tests=required_tests,
                         optional_tests=optional_tests,
                         user_test_results=user_test_results,
                         application_statuses=Constants.APPLICATION_STATUSES)

@user_bp.route('/vacancy/<int:vacancy_id>/apply', methods=['POST'])
@login_required
@user_required
def apply_to_vacancy(vacancy_id):
    """Подача отклика на вакансию"""
    vacancy = Vacancy.query.filter_by(
        id=vacancy_id,
        status=VacancyStatus.ACTIVE
    ).first_or_404()
    
    # Проверяем, не подавал ли уже отклик
    existing_application = Application.query.filter_by(
        user_id=current_user.id,
        vacancy_id=vacancy_id
    ).first()
    
    if existing_application:
        return jsonify({
            'success': False, 
            'message': 'Вы уже подавали отклик на эту вакансию'
        })
    
    try:
        # Создаем новый отклик
        application = Application(
            user_id=current_user.id,
            vacancy_id=vacancy_id,
            cover_letter=request.json.get('cover_letter', '').strip()
        )
        
        db.session.add(application)
        
        # Увеличиваем счетчик откликов у вакансии
        vacancy.applications_count += 1
        
        db.session.commit()
        
        # Отправляем уведомление работодателю
        send_notification(
            employer_id=vacancy.employer_id,
            title='Новый отклик на вакансию',
            message=f'На вашу вакансию "{vacancy.title}" поступил новый отклик от {current_user.full_name}',
            notification_type='new_application',
            related_vacancy_id=vacancy_id,
            related_application_id=application.id,
            send_email=True
        )
        
        # Трекинг события
        track_event('application_sent', current_user.id, 
                   vacancy_id=vacancy_id, 
                   metadata={'application_id': application.id})
        
        return jsonify({
            'success': True,
            'message': 'Отклик успешно отправлен!',
            'application_id': application.id
        })
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error applying to vacancy: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Произошла ошибка при отправке отклика. Попробуйте еще раз.'
        })

@user_bp.route('/applications')
@login_required
@user_required
def my_applications():
    """Мои отклики"""
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', 'all')
    
    query = Application.query.filter_by(user_id=current_user.id)
    
    if status_filter != 'all':
        query = query.filter_by(status=ApplicationStatus(status_filter))
    
    applications = query.order_by(desc(Application.created_at)).paginate(
        page=page, per_page=20, error_out=False
    )
    
    # Статистика по статусам
    status_counts = db.session.query(
        Application.status,
        func.count(Application.id)
    ).filter_by(user_id=current_user.id).group_by(Application.status).all()
    
    status_stats = {status.value: count for status, count in status_counts}
    
    return render_template('applications.html',
                         applications=applications,
                         status_filter=status_filter,
                         status_stats=status_stats,
                         application_statuses=Constants.APPLICATION_STATUSES)

@user_bp.route('/application/<int:application_id>')
@login_required
@user_required
def application_detail(application_id):
    """Детали отклика"""
    application = Application.query.filter_by(
        id=application_id,
        user_id=current_user.id
    ).first_or_404()
    
    # Результаты тестов по этому отклику
    test_results = application.test_results
    
    return render_template('application_detail.html',
                         application=application,
                         test_results=test_results)

@user_bp.route('/profile', methods=['GET', 'POST'])
@login_required
@user_required
def profile():
    """Профиль пользователя"""
    if request.method == 'POST':
        try:
            # Обновление основной информации
            current_user.full_name = request.form.get('full_name', '').strip()
            current_user.phone = request.form.get('phone', '').strip()
            current_user.city = request.form.get('city', '').strip()
            current_user.bio = request.form.get('bio', '').strip()
            
            # Дата рождения
            birth_date_str = request.form.get('birth_date')
            if birth_date_str:
                current_user.birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
            
            # Опыт работы
            experience = request.form.get('experience_years', type=int)
            if experience is not None:
                current_user.experience_years = experience
            
            # Зарплатные ожидания
            salary_from = request.form.get('desired_salary_from', type=int)
            salary_to = request.form.get('desired_salary_to', type=int)
            if salary_from:
                current_user.desired_salary_from = salary_from
            if salary_to:
                current_user.desired_salary_to = salary_to
            
            # Загрузка аватара
            if 'avatar' in request.files:
                file = request.files['avatar']
                if file and allowed_file(file.filename, current_app.config['ALLOWED_AVATAR_EXTENSIONS']):
                    avatar_path = save_uploaded_file(file, 'avatar')
                    if avatar_path:
                        current_user.avatar_path = avatar_path
            
            # Загрузка резюме
            if 'resume' in request.files:
                file = request.files['resume']
                if file and allowed_file(file.filename, current_app.config['ALLOWED_RESUME_EXTENSIONS']):
                    resume_path = save_uploaded_file(file, 'resume')
                    if resume_path:
                        current_user.resume_file = resume_path
            
            current_user.updated_at = datetime.now()
            db.session.commit()
            
            flash('Профиль успешно обновлен!', 'success')
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error updating user profile: {str(e)}")
            flash('Ошибка при обновлении профиля', 'error')
    
    # Рассчитываем заполненность профиля
    completeness = calculate_profile_completeness(current_user)
    
    # Получаем навыки пользователя
    user_skills = current_user.skills
    
    # Все доступные навыки для выбора
    all_skills = Skill.query.order_by(Skill.category, Skill.name).all()
    
    return render_template('profile.html',
                         completeness=completeness,
                         user_skills=user_skills,
                         all_skills=all_skills,
                         experience_levels=Constants.EXPERIENCE_LEVELS)

@user_bp.route('/profile/skills', methods=['POST'])
@login_required
@user_required
def update_skills():
    """Обновление навыков пользователя"""
    try:
        skill_data = request.json.get('skills', [])
        
        # Удаляем все старые навыки
        UserSkill.query.filter_by(user_id=current_user.id).delete()
        
        # Добавляем новые
        for skill_info in skill_data:
            skill_id = skill_info.get('skill_id')
            level = skill_info.get('level', 1)
            years_experience = skill_info.get('years_experience', 0)
            
            if skill_id and Skill.query.get(skill_id):
                user_skill = UserSkill(
                    user_id=current_user.id,
                    skill_id=skill_id,
                    level=min(5, max(1, level)),  # Ограничиваем уровень от 1 до 5
                    years_experience=max(0, years_experience)
                )
                db.session.add(user_skill)
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Навыки обновлены!'})
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating user skills: {str(e)}")
        return jsonify({'success': False, 'message': 'Ошибка при обновлении навыков'})

@user_bp.route('/tests')
@login_required
@user_required
def available_tests():
    """Доступные тесты"""
    page = request.args.get('page', 1, type=int)
    category_filter = request.args.get('category', 'all')
    
    query = Test.query.filter_by(is_active=True)
    
    if category_filter != 'all':
        query = query.join(Skill).filter(Skill.category == category_filter)
    
    tests = query.order_by(Test.title).paginate(
        page=page, per_page=20, error_out=False
    )
    
    # Результаты тестов пользователя
    user_results = {}
    if current_user.test_results:
        user_results = {
            tr.test_id: tr for tr in current_user.test_results
        }
    
    # Категории навыков для фильтра
    skill_categories = db.session.query(Skill.category).distinct().all()
    categories = [cat[0] for cat in skill_categories if cat[0]]
    
    return render_template('tests.html',
                         tests=tests,
                         user_results=user_results,
                         categories=categories,
                         category_filter=category_filter)

@user_bp.route('/test/<int:test_id>')
@login_required
@user_required
def test_detail(test_id):
    """Информация о тесте"""
    test = Test.query.filter_by(id=test_id, is_active=True).first_or_404()
    
    # Проверяем, проходил ли уже этот тест
    user_result = UserTestResult.query.filter_by(
        user_id=current_user.id,
        test_id=test_id
    ).order_by(desc(UserTestResult.completed_at)).first()
    
    return render_template('test_detail.html',
                         test=test,
                         user_result=user_result)

@user_bp.route('/test/<int:test_id>/start', methods=['POST'])
@login_required
@user_required
def start_test(test_id):
    """Начать прохождение теста"""
    test = Test.query.filter_by(id=test_id, is_active=True).first_or_404()
    
    try:
        # Проверяем, не проходит ли уже тест
        active_result = UserTestResult.query.filter_by(
            user_id=current_user.id,
            test_id=test_id,
            completed_at=None
        ).first()
        
        if active_result:
            return jsonify({
                'success': False,
                'message': 'Вы уже начали прохождение этого теста'
            })
        
        # Создаем новый результат теста
        test_result = UserTestResult(
            user_id=current_user.id,
            test_id=test_id,
            max_score=test.questions_count,
            started_at=datetime.now()
        )
        
        db.session.add(test_result)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'redirect_url': url_for('user.take_test', test_id=test_id, result_id=test_result.id)
        })
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error starting test: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Ошибка при запуске теста'
        })

@user_bp.route('/test/<int:test_id>/take/<int:result_id>')
@login_required
@user_required
def take_test(test_id, result_id):
    """Прохождение теста"""
    test = Test.query.filter_by(id=test_id, is_active=True).first_or_404()
    
    test_result = UserTestResult.query.filter_by(
        id=result_id,
        user_id=current_user.id,
        test_id=test_id,
        completed_at=None
    ).first_or_404()
    
    # Проверяем, не истекло ли время
    if test.time_limit:
        time_passed = (datetime.now() - test_result.started_at).total_seconds() / 60
        if time_passed > test.time_limit:
            # Автоматически завершаем тест
            test_result.completed_at = datetime.now()
            test_result.time_spent = int(time_passed * 60)
            test_result.score = 0
            db.session.commit()
            
            flash('Время прохождения теста истекло', 'warning')
            return redirect(url_for('user.test_result', result_id=result_id))
    
    # Получаем вопросы теста
    questions = test.questions.order_by('order_number').all()
    
    return render_template('take_test.html',
                         test=test,
                         test_result=test_result,
                         questions=questions)

@user_bp.route('/test/<int:result_id>/submit', methods=['POST'])
@login_required
@user_required
def submit_test(result_id):
    """Сохранение результатов теста"""
    test_result = UserTestResult.query.filter_by(
        id=result_id,
        user_id=current_user.id,
        completed_at=None
    ).first_or_404()
    
    try:
        answers = request.json.get('answers', {})
        
        # Рассчитываем результат
        correct_answers = 0
        total_questions = 0
        
        for question in test_result.test.questions:
            total_questions += 1
            user_answer = answers.get(str(question.id))
            
            if user_answer:
                import json
                correct_answers_list = json.loads(question.correct_answers)
                
                if question.question_type == 'single_choice':
                    if user_answer in correct_answers_list:
                        correct_answers += 1
                elif question.question_type == 'multiple_choice':
                    if isinstance(user_answer, list) and set(user_answer) == set(correct_answers_list):
                        correct_answers += 1
        
        # Рассчитываем процент
        score_percentage = int((correct_answers / total_questions) * 100) if total_questions > 0 else 0
        
        # Обновляем результат
        test_result.score = correct_answers
        test_result.completed_at = datetime.now()
        test_result.answers = str(answers)
        test_result.time_spent = int((datetime.now() - test_result.started_at).total_seconds())
        test_result.is_passed = score_percentage >= test_result.test.passing_score
        
        # Если тест пройден, обновляем навык пользователя
        if test_result.is_passed and test_result.test.skill_id:
            user_skill = UserSkill.query.filter_by(
                user_id=current_user.id,
                skill_id=test_result.test.skill_id
            ).first()
            
            if user_skill:
                user_skill.is_verified = True
                user_skill.verified_at = datetime.now()
            else:
                # Создаем новый навык
                user_skill = UserSkill(
                    user_id=current_user.id,
                    skill_id=test_result.test.skill_id,
                    level=3,  # Средний уровень по умолчанию
                    is_verified=True,
                    verified_at=datetime.now()
                )
                db.session.add(user_skill)
        
        db.session.commit()
        
        # Трекинг события
        track_event('test_completed', current_user.id, 
                   metadata={
                       'test_id': test_result.test_id,
                       'score': score_percentage,
                       'passed': test_result.is_passed
                   })
        
        return jsonify({
            'success': True,
            'redirect_url': url_for('user.test_result', result_id=result_id)
        })
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error submitting test: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Ошибка при сохранении результатов теста'
        })

@user_bp.route('/test/result/<int:result_id>')
@login_required
@user_required
def test_result(result_id):
    """Результаты теста"""
    test_result = UserTestResult.query.filter_by(
        id=result_id,
        user_id=current_user.id
    ).first_or_404()
    
    if not test_result.completed_at:
        flash('Тест еще не завершен', 'warning')
        return redirect(url_for('user.take_test', 
                               test_id=test_result.test_id, 
                               result_id=result_id))
    
    # Рассчитываем процент
    score_percentage = int((test_result.score / test_result.max_score) * 100) if test_result.max_score > 0 else 0
    
    return render_template('test_result.html',
                         test_result=test_result,
                         score_percentage=score_percentage)

@user_bp.route('/notifications')
@login_required
@user_required
def notifications():
    """Уведомления пользователя"""
    page = request.args.get('page', 1, type=int)
    
    notifications = Notification.query.filter_by(
        user_id=current_user.id
    ).order_by(desc(Notification.created_at)).paginate(
        page=page, per_page=20, error_out=False
    )
    
    # Отмечаем как прочитанные
    unread_notifications = Notification.query.filter_by(
        user_id=current_user.id,
        is_read=False
    ).all()
    
    for notification in unread_notifications:
        notification.is_read = True
        notification.read_at = datetime.now()
    
    db.session.commit()
    
    return render_template('notifications.html', notifications=notifications)

@user_bp.route('/settings', methods=['GET', 'POST'])
@login_required
@user_required
def settings():
    """Настройки пользователя"""
    if request.method == 'POST':
        try:
            # Настройки уведомлений
            current_user.notifications_email = request.form.get('notifications_email') == 'on'
            current_user.notifications_sms = request.form.get('notifications_sms') == 'on'
            current_user.notifications_telegram = request.form.get('notifications_telegram') == 'on'
            
            # Telegram chat ID
            telegram_username = request.form.get('telegram_username', '').strip()
            if telegram_username:
                # TODO: Реализовать получение chat_id по username
                pass
            
            # Изменение пароля
            current_password = request.form.get('current_password')
            new_password = request.form.get('new_password')
            confirm_password = request.form.get('confirm_password')
            
            if current_password and new_password:
                if not current_user.check_password(current_password):
                    flash('Неверный текущий пароль', 'error')
                elif new_password != confirm_password:
                    flash('Пароли не совпадают', 'error')
                elif len(new_password) < 6:
                    flash('Пароль должен содержать минимум 6 символов', 'error')
                else:
                    current_user.set_password(new_password)
                    flash('Пароль успешно изменен', 'success')
            
            current_user.updated_at = datetime.now()
            db.session.commit()
            
            if not (current_password and new_password):
                flash('Настройки сохранены', 'success')
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error updating user settings: {str(e)}")
            flash('Ошибка при сохранении настроек', 'error')
    
    return render_template('settings.html')

# API endpoints

@user_bp.route('/api/vacancy/<int:vacancy_id>/favorite', methods=['POST'])
@login_required
@user_required
def toggle_favorite_vacancy(vacancy_id):
    """Добавление/удаление вакансии из избранного (заглушка)"""
    # TODO: Реализовать систему избранного
    return jsonify({'success': True, 'is_favorite': True})

@user_bp.route('/api/recommendations')
@login_required
@user_required
def get_recommendations():
    """API для получения рекомендованных вакансий"""
    limit = request.args.get('limit', 10, type=int)
    
    # Простая логика рекомендаций
    recommendations = Vacancy.query.filter_by(
        status=VacancyStatus.ACTIVE,
        city=current_user.city
    ).filter(
        Vacancy.experience_required <= (current_user.experience_years or 0) + 1
    ).order_by(desc(Vacancy.created_at)).limit(limit).all()
    
    result = []
    for vacancy in recommendations:
        result.append({
            'id': vacancy.id,
            'title': vacancy.title,
            'company': vacancy.employer.company_name,
            'city': vacancy.city,
            'salary': format_salary(vacancy.salary_from, vacancy.salary_to),
            'matching_score': calculate_matching_score(vacancy, current_user),
            'url': url_for('user.vacancy_detail', vacancy_id=vacancy.id)
        })
    
    return jsonify(result)