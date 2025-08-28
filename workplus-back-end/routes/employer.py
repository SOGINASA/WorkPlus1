from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, session, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
import os
from datetime import datetime, timedelta
from sqlalchemy import func, desc, and_, or_

from db_models import (
    db, Vacancy, Application, VacancyCategory, Skill, VacancySkill, 
    User, VacancyStatus, ApplicationStatus, SubscriptionTier,
    Notification, AnalyticsEvent, SocialMediaPost, Test, VacancyTest
)
from utils.decorators import employer_required
from utils.helpers import allowed_file, send_notification, create_social_media_post, track_event
from config import Constants

employer_bp = Blueprint('employer', __name__, template_folder='../templates/employer')

@employer_bp.route('/dashboard')
@login_required
@employer_required
def dashboard():
    """Дашборд работодателя"""
    
    # Получаем статистику по вакансиям
    total_vacancies = Vacancy.query.filter_by(employer_id=current_user.id).count()
    active_vacancies = Vacancy.query.filter_by(
        employer_id=current_user.id, 
        status=VacancyStatus.ACTIVE
    ).count()
    
    # Статистика по откликам
    total_applications = db.session.query(func.count(Application.id)).join(
        Vacancy
    ).filter(
        Vacancy.employer_id == current_user.id
    ).scalar() or 0
    
    # Новые отклики (за последние 7 дней)
    week_ago = datetime.now() - timedelta(days=7)
    new_applications = db.session.query(func.count(Application.id)).join(
        Vacancy
    ).filter(
        and_(
            Vacancy.employer_id == current_user.id,
            Application.created_at >= week_ago,
            Application.status == ApplicationStatus.NEW
        )
    ).scalar() or 0
    
    # Последние вакансии
    recent_vacancies = Vacancy.query.filter_by(
        employer_id=current_user.id
    ).order_by(
        desc(Vacancy.created_at)
    ).limit(5).all()
    
    # Последние отклики
    recent_applications = db.session.query(Application).join(
        Vacancy
    ).filter(
        Vacancy.employer_id == current_user.id
    ).order_by(
        desc(Application.created_at)
    ).limit(10).all()
    
    # Информация о подписке
    subscription_info = {
        'tier': current_user.subscription_tier.value,
        'expires_at': current_user.subscription_end,
        'vacancies_used': current_user.used_vacancies,
        'vacancies_limit': current_user.vacancies_limit,
        'days_left': None
    }
    
    if current_user.subscription_end:
        days_left = (current_user.subscription_end - datetime.now()).days
        subscription_info['days_left'] = max(0, days_left)
    
    return render_template('dashboard.html', 
                         total_vacancies=total_vacancies,
                         active_vacancies=active_vacancies,
                         total_applications=total_applications,
                         new_applications=new_applications,
                         recent_vacancies=recent_vacancies,
                         recent_applications=recent_applications,
                         subscription_info=subscription_info)

@employer_bp.route('/vacancies')
@login_required
@employer_required
def vacancies():
    """Список вакансий работодателя"""
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', 'all')
    
    query = Vacancy.query.filter_by(employer_id=current_user.id)
    
    if status_filter != 'all':
        query = query.filter_by(status=VacancyStatus(status_filter))
    
    vacancies = query.order_by(desc(Vacancy.created_at)).paginate(
        page=page, per_page=20, error_out=False
    )
    
    return render_template('vacancies.html', 
                         vacancies=vacancies,
                         status_filter=status_filter,
                         vacancy_statuses=Constants.VACANCY_STATUSES)

@employer_bp.route('/vacancies/create', methods=['GET', 'POST'])
@login_required
@employer_required
def create_vacancy():
    """Создание новой вакансии"""
    
    # Проверка лимитов по подписке
    if not current_user.can_create_vacancy():
        flash('Достигнут лимит вакансий для вашего тарифа. Обновите подписку для создания новых вакансий.', 'warning')
        return redirect(url_for('employer.subscription'))
    
    if request.method == 'POST':
        try:
            # Получение данных из формы
            title = request.form.get('title', '').strip()
            description = request.form.get('description', '').strip()
            requirements = request.form.get('requirements', '').strip()
            responsibilities = request.form.get('responsibilities', '').strip()
            benefits = request.form.get('benefits', '').strip()
            
            # Зарплата
            salary_from = request.form.get('salary_from', type=int)
            salary_to = request.form.get('salary_to', type=int)
            
            # Условия работы
            employment_type = request.form.get('employment_type')
            schedule = request.form.get('schedule', '').strip()
            experience_required = request.form.get('experience_required', 0, type=int)
            
            # Локация
            city = request.form.get('city', '').strip()
            address = request.form.get('address', '').strip()
            remote_work = request.form.get('remote_work') == 'on'
            
            # Категория
            category_id = request.form.get('category_id', type=int)
            
            # Валидация обязательных полей
            if not all([title, description, employment_type, city]):
                flash('Заполните все обязательные поля', 'error')
                return render_template('create_vacancy.html',
                                     categories=VacancyCategory.query.filter_by(is_active=True).all(),
                                     employment_types=Constants.EMPLOYMENT_TYPES,
                                     experience_levels=Constants.EXPERIENCE_LEVELS)
            
            # Создание вакансии
            vacancy = Vacancy(
                title=title,
                description=description,
                requirements=requirements,
                responsibilities=responsibilities,
                benefits=benefits,
                salary_from=salary_from,
                salary_to=salary_to,
                employment_type=employment_type,
                schedule=schedule,
                experience_required=experience_required,
                city=city,
                address=address,
                remote_work=remote_work,
                category_id=category_id,
                employer_id=current_user.id,
                status=VacancyStatus.DRAFT
            )
            
            db.session.add(vacancy)
            db.session.flush()  # Получаем ID вакансии
            
            # Добавление требуемых навыков
            skill_ids = request.form.getlist('skills')
            for skill_id in skill_ids:
                if skill_id:
                    vacancy_skill = VacancySkill(
                        vacancy_id=vacancy.id,
                        skill_id=int(skill_id),
                        is_required=True
                    )
                    db.session.add(vacancy_skill)
            
            # Добавление тестов (если выбраны)
            test_ids = request.form.getlist('tests')
            for test_id in test_ids:
                if test_id:
                    vacancy_test = VacancyTest(
                        vacancy_id=vacancy.id,
                        test_id=int(test_id),
                        is_required=request.form.get(f'test_{test_id}_required') == 'on'
                    )
                    db.session.add(vacancy_test)
            
            # Автопубликация если выбрана
            if request.form.get('auto_publish') == 'on':
                vacancy.status = VacancyStatus.ACTIVE
                vacancy.published_at = datetime.now()
                
                # Увеличиваем счетчик использованных вакансий
                current_user.used_vacancies += 1
                
                # Автопостинг в соцсети (если доступно по тарифу)
                if current_user.subscription_tier in [SubscriptionTier.START, SubscriptionTier.GROWTH, SubscriptionTier.PRO]:
                    auto_post = request.form.get('auto_post_social') == 'on'
                    if auto_post:
                        create_social_media_post(vacancy)
            
            db.session.commit()
            
            # Аналитика
            track_event('vacancy_created', current_user.id, {'vacancy_id': vacancy.id})
            
            if vacancy.status == VacancyStatus.ACTIVE:
                flash('Вакансия успешно создана и опубликована!', 'success')
            else:
                flash('Вакансия сохранена как черновик. Опубликуйте её когда будете готовы.', 'info')
            
            return redirect(url_for('employer.vacancy_detail', vacancy_id=vacancy.id))
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error creating vacancy: {str(e)}")
            flash('Произошла ошибка при создании вакансии. Попробуйте еще раз.', 'error')
    
    # GET запрос - показываем форму
    categories = VacancyCategory.query.filter_by(is_active=True).order_by(VacancyCategory.sort_order).all()
    skills = Skill.query.order_by(Skill.name).all()
    tests = Test.query.filter_by(is_active=True).order_by(Test.title).all()
    
    return render_template('create_vacancy.html',
                         categories=categories,
                         skills=skills,
                         tests=tests,
                         employment_types=Constants.EMPLOYMENT_TYPES,
                         experience_levels=Constants.EXPERIENCE_LEVELS)

@employer_bp.route('/vacancies/<int:vacancy_id>')
@login_required
@employer_required
def vacancy_detail(vacancy_id):
    """Детальный просмотр вакансии"""
    vacancy = Vacancy.query.filter_by(
        id=vacancy_id, 
        employer_id=current_user.id
    ).first_or_404()
    
    # Получаем отклики на вакансию
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', 'all')
    
    query = Application.query.filter_by(vacancy_id=vacancy_id)
    if status_filter != 'all':
        query = query.filter_by(status=ApplicationStatus(status_filter))
    
    applications = query.order_by(desc(Application.created_at)).paginate(
        page=page, per_page=20, error_out=False
    )
    
    # Статистика по откликам
    stats = {
        'total': Application.query.filter_by(vacancy_id=vacancy_id).count(),
        'new': Application.query.filter_by(vacancy_id=vacancy_id, status=ApplicationStatus.NEW).count(),
        'viewed': Application.query.filter_by(vacancy_id=vacancy_id, status=ApplicationStatus.VIEWED).count(),
        'interviewed': Application.query.filter_by(vacancy_id=vacancy_id, status=ApplicationStatus.INTERVIEWED).count(),
        'hired': Application.query.filter_by(vacancy_id=vacancy_id, status=ApplicationStatus.HIRED).count(),
    }
    
    return render_template('vacancy_detail.html',
                         vacancy=vacancy,
                         applications=applications,
                         stats=stats,
                         status_filter=status_filter,
                         application_statuses=Constants.APPLICATION_STATUSES)

@employer_bp.route('/vacancies/<int:vacancy_id>/edit', methods=['GET', 'POST'])
@login_required
@employer_required
def edit_vacancy(vacancy_id):
    """Редактирование вакансии"""
    vacancy = Vacancy.query.filter_by(
        id=vacancy_id, 
        employer_id=current_user.id
    ).first_or_404()
    
    if request.method == 'POST':
        try:
            # Обновление полей вакансии
            vacancy.title = request.form.get('title', '').strip()
            vacancy.description = request.form.get('description', '').strip()
            vacancy.requirements = request.form.get('requirements', '').strip()
            vacancy.responsibilities = request.form.get('responsibilities', '').strip()
            vacancy.benefits = request.form.get('benefits', '').strip()
            
            vacancy.salary_from = request.form.get('salary_from', type=int)
            vacancy.salary_to = request.form.get('salary_to', type=int)
            
            vacancy.employment_type = request.form.get('employment_type')
            vacancy.schedule = request.form.get('schedule', '').strip()
            vacancy.experience_required = request.form.get('experience_required', 0, type=int)
            
            vacancy.city = request.form.get('city', '').strip()
            vacancy.address = request.form.get('address', '').strip()
            vacancy.remote_work = request.form.get('remote_work') == 'on'
            
            vacancy.category_id = request.form.get('category_id', type=int)
            vacancy.updated_at = datetime.now()
            
            # Обновление навыков
            # Сначала удаляем старые
            VacancySkill.query.filter_by(vacancy_id=vacancy.id).delete()
            
            # Добавляем новые
            skill_ids = request.form.getlist('skills')
            for skill_id in skill_ids:
                if skill_id:
                    vacancy_skill = VacancySkill(
                        vacancy_id=vacancy.id,
                        skill_id=int(skill_id),
                        is_required=True
                    )
                    db.session.add(vacancy_skill)
            
            db.session.commit()
            flash('Вакансия успешно обновлена!', 'success')
            
            return redirect(url_for('employer.vacancy_detail', vacancy_id=vacancy.id))
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error updating vacancy: {str(e)}")
            flash('Произошла ошибка при обновлении вакансии', 'error')
    
    # Получаем данные для формы
    categories = VacancyCategory.query.filter_by(is_active=True).order_by(VacancyCategory.sort_order).all()
    skills = Skill.query.order_by(Skill.name).all()
    vacancy_skills = [vs.skill_id for vs in vacancy.required_skills]
    
    return render_template('edit_vacancy.html',
                         vacancy=vacancy,
                         categories=categories,
                         skills=skills,
                         vacancy_skills=vacancy_skills,
                         employment_types=Constants.EMPLOYMENT_TYPES,
                         experience_levels=Constants.EXPERIENCE_LEVELS)

@employer_bp.route('/vacancies/<int:vacancy_id>/publish', methods=['POST'])
@login_required
@employer_required
def publish_vacancy(vacancy_id):
    """Публикация вакансии"""
    vacancy = Vacancy.query.filter_by(
        id=vacancy_id, 
        employer_id=current_user.id
    ).first_or_404()
    
    if vacancy.status == VacancyStatus.DRAFT:
        # Проверяем лимиты
        if not current_user.can_create_vacancy():
            return jsonify({'success': False, 'message': 'Достигнут лимит вакансий для вашего тарифа'})
        
        vacancy.status = VacancyStatus.ACTIVE
        vacancy.published_at = datetime.now()
        current_user.used_vacancies += 1
        
        # Автопостинг в соцсети (если доступно)
        if current_user.subscription_tier in [SubscriptionTier.START, SubscriptionTier.GROWTH, SubscriptionTier.PRO]:
            create_social_media_post(vacancy)
        
        db.session.commit()
        
        # Аналитика
        track_event('vacancy_published', current_user.id, {'vacancy_id': vacancy.id})
        
        return jsonify({'success': True, 'message': 'Вакансия опубликована!'})
    
    return jsonify({'success': False, 'message': 'Вакансия уже опубликована'})

@employer_bp.route('/vacancies/<int:vacancy_id>/pause', methods=['POST'])
@login_required
@employer_required
def pause_vacancy(vacancy_id):
    """Приостановка вакансии"""
    vacancy = Vacancy.query.filter_by(
        id=vacancy_id, 
        employer_id=current_user.id
    ).first_or_404()
    
    if vacancy.status == VacancyStatus.ACTIVE:
        vacancy.status = VacancyStatus.PAUSED
        db.session.commit()
        return jsonify({'success': True, 'message': 'Вакансия приостановлена'})
    
    return jsonify({'success': False, 'message': 'Невозможно приостановить эту вакансию'})

@employer_bp.route('/vacancies/<int:vacancy_id>/close', methods=['POST'])
@login_required
@employer_required
def close_vacancy(vacancy_id):
    """Закрытие вакансии"""
    vacancy = Vacancy.query.filter_by(
        id=vacancy_id, 
        employer_id=current_user.id
    ).first_or_404()
    
    reason = request.json.get('reason', 'closed')  # 'closed' или 'filled'
    
    if reason == 'filled':
        vacancy.status = VacancyStatus.FILLED
        vacancy.hired_count += 1
    else:
        vacancy.status = VacancyStatus.CLOSED
    
    db.session.commit()
    
    # Уведомляем кандидатов об изменении статуса
    active_applications = Application.query.filter_by(
        vacancy_id=vacancy_id
    ).filter(
        Application.status.in_([ApplicationStatus.NEW, ApplicationStatus.VIEWED, ApplicationStatus.SCREENING])
    ).all()
    
    for application in active_applications:
        send_notification(
            user_id=application.user_id,
            title='Вакансия закрыта',
            message=f'К сожалению, вакансия "{vacancy.title}" была закрыта работодателем.',
            notification_type='vacancy_closed',
            related_vacancy_id=vacancy.id
        )
    
    message = 'Вакансия закрыта (найден кандидат)' if reason == 'filled' else 'Вакансия закрыта'
    return jsonify({'success': True, 'message': message})

@employer_bp.route('/applications')
@login_required
@employer_required
def applications():
    """Все отклики работодателя"""
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', 'all')
    vacancy_filter = request.args.get('vacancy', 'all')
    
    # Базовый запрос - отклики на вакансии этого работодателя
    query = db.session.query(Application).join(Vacancy).filter(
        Vacancy.employer_id == current_user.id
    )
    
    # Фильтры
    if status_filter != 'all':
        query = query.filter(Application.status == ApplicationStatus(status_filter))
    
    if vacancy_filter != 'all':
        query = query.filter(Application.vacancy_id == int(vacancy_filter))
    
    applications = query.order_by(desc(Application.created_at)).paginate(
        page=page, per_page=20, error_out=False
    )
    
    # Получаем список вакансий для фильтра
    vacancies_for_filter = Vacancy.query.filter_by(
        employer_id=current_user.id
    ).order_by(Vacancy.title).all()
    
    return render_template('applications.html',
                         applications=applications,
                         status_filter=status_filter,
                         vacancy_filter=vacancy_filter,
                         vacancies_for_filter=vacancies_for_filter,
                         application_statuses=Constants.APPLICATION_STATUSES)

@employer_bp.route('/applications/<int:application_id>')
@login_required
@employer_required
def application_detail(application_id):
    """Детальный просмотр отклика"""
    application = db.session.query(Application).join(Vacancy).filter(
        and_(
            Application.id == application_id,
            Vacancy.employer_id == current_user.id
        )
    ).first_or_404()
    
    # Отмечаем как просмотренный
    application.mark_as_viewed()
    
    # Получаем результаты тестов кандидата
    test_results = application.test_results
    
    # Похожие кандидаты (упрощенная логика)
    similar_candidates = db.session.query(Application).join(Vacancy).join(User).filter(
        and_(
            Vacancy.employer_id == current_user.id,
            Application.id != application_id,
            User.city == application.user.city,
            User.experience_years >= application.user.experience_years - 1,
            User.experience_years <= application.user.experience_years + 1
        )
    ).limit(5).all()
    
    return render_template('application_detail.html',
                         application=application,
                         test_results=test_results,
                         similar_candidates=similar_candidates,
                         application_statuses=Constants.APPLICATION_STATUSES)

@employer_bp.route('/applications/<int:application_id>/update_status', methods=['POST'])
@login_required
@employer_required
def update_application_status(application_id):
    """Обновление статуса отклика"""
    application = db.session.query(Application).join(Vacancy).filter(
        and_(
            Application.id == application_id,
            Vacancy.employer_id == current_user.id
        )
    ).first_or_404()
    
    new_status = request.json.get('status')
    notes = request.json.get('notes', '')
    
    try:
        application.status = ApplicationStatus(new_status)
        application.updated_at = datetime.now()
        
        if new_status == 'interview_scheduled':
            interview_date = request.json.get('interview_date')
            if interview_date:
                application.interview_scheduled_at = datetime.fromisoformat(interview_date)
        
        if new_status == 'rejected':
            application.rejection_reason = request.json.get('rejection_reason', '')
        
        if notes:
            application.interview_notes = notes
        
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
        
        # Аналитика
        track_event('application_status_updated', current_user.id, {
            'application_id': application.id,
            'new_status': new_status
        })
        
        return jsonify({'success': True, 'message': 'Статус обновлен'})
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating application status: {str(e)}")
        return jsonify({'success': False, 'message': 'Ошибка при обновлении статуса'})

@employer_bp.route('/profile', methods=['GET', 'POST'])
@login_required
@employer_required
def profile():
    """Профиль работодателя"""
    if request.method == 'POST':
        try:
            # Обновление основной информации
            current_user.company_name = request.form.get('company_name', '').strip()
            current_user.company_description = request.form.get('company_description', '').strip()
            current_user.company_website = request.form.get('company_website', '').strip()
            current_user.company_size = request.form.get('company_size')
            current_user.industry = request.form.get('industry')
            
            # Контактная информация
            current_user.contact_person = request.form.get('contact_person', '').strip()
            current_user.phone = request.form.get('phone', '').strip()
            current_user.city = request.form.get('city', '').strip()
            current_user.address = request.form.get('address', '').strip()
            
            # Социальные сети
            current_user.instagram_account = request.form.get('instagram_account', '').strip()
            current_user.telegram_channel = request.form.get('telegram_channel', '').strip()
            current_user.tiktok_account = request.form.get('tiktok_account', '').strip()
            
            # Обработка загруженных файлов
            if 'license_file' in request.files:
                file = request.files['license_file']
                if file and allowed_file(file.filename, current_app.config['ALLOWED_DOCUMENT_EXTENSIONS']):
                    filename = secure_filename(f"license_{current_user.id}_{file.filename}")
                    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'company_docs', filename)
                    file.save(file_path)
                    current_user.license_file = f"company_docs/{filename}"
            
            current_user.updated_at = datetime.now()
            db.session.commit()
            
            flash('Профиль успешно обновлен!', 'success')
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error updating employer profile: {str(e)}")
            flash('Ошибка при обновлении профиля', 'error')
    
    return render_template('profile.html',
                         company_sizes=Constants.COMPANY_SIZES,
                         industries=Constants.INDUSTRIES)

@employer_bp.route('/subscription')
@login_required
@employer_required
def subscription():
    """Информация о подписке и тарифах"""
    from config import Config
    
    # Текущая подписка
    current_subscription = {
        'tier': current_user.subscription_tier.value,
        'start': current_user.subscription_start,
        'end': current_user.subscription_end,
        'vacancies_used': current_user.used_vacancies,
        'vacancies_limit': current_user.vacancies_limit
    }
    
    # Информация о тарифах
    subscription_plans = {
        'free': {
            'name': 'Бесплатный',
            'price': 0,
            'features': Config.SUBSCRIPTION_LIMITS['free']
        },
        'start': {
            'name': 'Старт',
            'price': Config.SUBSCRIPTION_PRICES['start'],
            'features': Config.SUBSCRIPTION_LIMITS['start']
        },
        'growth': {
            'name': 'Рост',
            'price': Config.SUBSCRIPTION_PRICES['growth'],
            'features': Config.SUBSCRIPTION_LIMITS['growth']
        },
        'pro': {
            'name': 'Профессиональный',
            'price': Config.SUBSCRIPTION_PRICES['pro'],
            'features': Config.SUBSCRIPTION_LIMITS['pro']
        }
    }
    
    return render_template('subscription.html',
                         current_subscription=current_subscription,
                         subscription_plans=subscription_plans)

@employer_bp.route('/analytics')
@login_required
@employer_required
def analytics():
    """Аналитика для работодателя"""
    
    # Проверяем доступ к аналитике (только для Growth и Pro)
    if current_user.subscription_tier not in [SubscriptionTier.GROWTH, SubscriptionTier.PRO]:
        flash('Аналитика доступна только в тарифах "Рост" и "Профессиональный"', 'info')
        return redirect(url_for('employer.subscription'))
    
    # Период для анализа
    period = request.args.get('period', '30')  # дней
    start_date = datetime.now() - timedelta(days=int(period))
    
    # Статистика по вакансиям
    vacancy_stats = {
        'total': Vacancy.query.filter_by(employer_id=current_user.id).count(),
        'active': Vacancy.query.filter_by(employer_id=current_user.id, status=VacancyStatus.ACTIVE).count(),
        'filled': Vacancy.query.filter_by(employer_id=current_user.id, status=VacancyStatus.FILLED).count(),
    }
    
    # Статистика по откликам
    application_stats = db.session.query(
        func.count(Application.id).label('total'),
        func.sum(func.case([(Application.status == ApplicationStatus.HIRED, 1)], else_=0)).label('hired')
    ).join(Vacancy).filter(
        and_(
            Vacancy.employer_id == current_user.id,
            Application.created_at >= start_date
        )
    ).first()
    
    # Топ вакансии по просмотрам
    top_vacancies = Vacancy.query.filter_by(
        employer_id=current_user.id
    ).order_by(desc(Vacancy.views_count)).limit(5).all()
    
    # Статистика по городам
    city_stats = db.session.query(
        Vacancy.city,
        func.count(Vacancy.id).label('count'),
        func.sum(Vacancy.applications_count).label('applications')
    ).filter_by(
        employer_id=current_user.id
    ).group_by(Vacancy.city).all()
    
    return render_template('analytics.html',
                         vacancy_stats=vacancy_stats,
                         application_stats=application_stats,
                         top_vacancies=top_vacancies,
                         city_stats=city_stats,
                         period=period)

@employer_bp.route('/messages')
@login_required
@employer_required
def messages():
    """Сообщения/уведомления работодателя"""
    page = request.args.get('page', 1, type=int)
    
    notifications = Notification.query.filter_by(
        employer_id=current_user.id
    ).order_by(desc(Notification.created_at)).paginate(
        page=page, per_page=20, error_out=False
    )
    
    # Отмечаем уведомления как прочитанные
    unread_notifications = Notification.query.filter_by(
        employer_id=current_user.id,
        is_read=False
    ).all()
    
    for notification in unread_notifications:
        notification.is_read = True
        notification.read_at = datetime.now()
    
    db.session.commit()
    
    return render_template('messages.html', notifications=notifications)

# API endpoints для AJAX запросов

@employer_bp.route('/api/vacancy/<int:vacancy_id>/stats')
@login_required
@employer_required
def vacancy_stats_api(vacancy_id):
    """API для получения статистики по вакансии"""
    vacancy = Vacancy.query.filter_by(
        id=vacancy_id, 
        employer_id=current_user.id
    ).first_or_404()
    
    stats = {
        'views': vacancy.views_count,
        'applications': vacancy.applications_count,
        'applications_by_status': {}
    }
    
    # Статистика по статусам откликов
    status_stats = db.session.query(
        Application.status,
        func.count(Application.id)
    ).filter_by(vacancy_id=vacancy_id).group_by(Application.status).all()
    
    for status, count in status_stats:
        stats['applications_by_status'][status.value] = count
    
    return jsonify(stats)

@employer_bp.route('/api/search/candidates')
@login_required
@employer_required
def search_candidates_api():
    """API для поиска кандидатов"""
    query = request.args.get('q', '').strip()
    city = request.args.get('city', '')
    experience = request.args.get('experience', type=int)
    skills = request.args.getlist('skills')
    
    # Базовый запрос
    candidates_query = User.query.filter_by(is_active=True)
    
    if city:
        candidates_query = candidates_query.filter(User.city.ilike(f'%{city}%'))
    
    if experience is not None:
        candidates_query = candidates_query.filter(User.experience_years >= experience)
    
    if query:
        candidates_query = candidates_query.filter(
            or_(
                User.full_name.ilike(f'%{query}%'),
                User.bio.ilike(f'%{query}%')
            )
        )
    
    # Фильтр по навыкам (упрощенный)
    if skills:
        from db_models import UserSkill
        candidates_query = candidates_query.join(UserSkill).join(Skill).filter(
            Skill.id.in_(skills)
        )
    
    candidates = candidates_query.limit(20).all()
    
    result = []
    for candidate in candidates:
        result.append({
            'id': candidate.id,
            'name': candidate.full_name,
            'city': candidate.city,
            'experience': candidate.experience_years,
            'rating': candidate.rating,
            'avatar': candidate.avatar_path
        })
    
    return jsonify(result)