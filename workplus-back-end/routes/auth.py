from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
import os
from datetime import datetime

from db_models import db, User, Employer, Admin
from utils.helpers import allowed_file, validate_phone, validate_email, validate_iin, save_uploaded_file

auth_bp = Blueprint('auth', __name__, template_folder='../templates/auth')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Страница входа"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        user_type = request.form.get('user_type', 'user')  # user или employer
        
        if not email or not password:
            flash('Заполните все поля', 'error')
            return render_template('login.html')
        
        user = None
        
        if user_type == 'employer':
            user = Employer.query.filter_by(email=email).first()
        elif user_type == 'admin':
            user = Admin.query.filter_by(email=email).first()
        else:
            user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            if not user.is_active:
                flash('Ваш аккаунт деактивирован. Обратитесь в поддержку.', 'error')
                return render_template('login.html')
            
            login_user(user, remember=True)
            
            # Обновляем время последней активности
            user.last_activity = datetime.now()
            db.session.commit()
            
            # Редирект на нужную страницу
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            
            return redirect(url_for('index'))
        else:
            flash('Неверный email или пароль', 'error')
    
    return render_template('login.html')

@auth_bp.route('/register/user', methods=['GET', 'POST'])
def register_user():
    """Регистрация соискателя"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        try:
            # Получение данных из формы
            email = request.form.get('email', '').strip().lower()
            password = request.form.get('password', '')
            confirm_password = request.form.get('confirm_password', '')
            full_name = request.form.get('full_name', '').strip()
            phone = request.form.get('phone', '').strip()
            city = request.form.get('city', '').strip()
            
            # Валидация
            if not all([email, password, full_name, phone, city]):
                flash('Заполните все обязательные поля', 'error')
                return render_template('register_user.html')
            
            if password != confirm_password:
                flash('Пароли не совпадают', 'error')
                return render_template('register_user.html')
            
            if len(password) < 6:
                flash('Пароль должен содержать минимум 6 символов', 'error')
                return render_template('register_user.html')
            
            if not validate_email(email):
                flash('Некорректный email адрес', 'error')
                return render_template('register_user.html')
            
            phone = validate_phone(phone)
            if not phone:
                flash('Некорректный номер телефона', 'error')
                return render_template('register_user.html')
            
            # Проверка уникальности
            if User.query.filter_by(email=email).first():
                flash('Пользователь с таким email уже существует', 'error')
                return render_template('register_user.html')
            
            if User.query.filter_by(phone=phone).first():
                flash('Пользователь с таким телефоном уже существует', 'error')
                return render_template('register_user.html')
            
            # Обработка аватара
            avatar_path = None
            if 'avatar' in request.files:
                file = request.files['avatar']
                if file and file.filename and allowed_file(file.filename, ['png', 'jpg', 'jpeg', 'gif']):
                    avatar_path = save_uploaded_file(file, 'avatar')
            
            # Создание пользователя
            user = User(
                email=email,
                phone=phone,
                full_name=full_name,
                city=city,
                avatar_path=avatar_path,
                is_active=True
            )
            user.set_password(password)
            
            db.session.add(user)
            db.session.commit()
            
            # Автоматический вход
            login_user(user, remember=True)
            
            flash('Регистрация успешно завершена!', 'success')
            return redirect(url_for('user.dashboard'))
            
        except Exception as e:
            db.session.rollback()
            flash('Произошла ошибка при регистрации. Попробуйте еще раз.', 'error')
            return render_template('register_user.html')
    
    return render_template('register_user.html')

@auth_bp.route('/register/employer', methods=['GET', 'POST'])
def register_employer():
    """Регистрация работодателя"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        try:
            # Получение данных
            email = request.form.get('email', '').strip().lower()
            password = request.form.get('password', '')
            confirm_password = request.form.get('confirm_password', '')
            
            company_name = request.form.get('company_name', '').strip()
            contact_person = request.form.get('contact_person', '').strip()
            phone = request.form.get('phone', '').strip()
            city = request.form.get('city', '').strip()
            
            company_size = request.form.get('company_size', '')
            industry = request.form.get('industry', '')
            
            # Валидация
            if not all([email, password, company_name, contact_person, phone, city]):
                flash('Заполните все обязательные поля', 'error')
                return render_template('register_employer.html')
            
            if password != confirm_password:
                flash('Пароли не совпадают', 'error')
                return render_template('register_employer.html')
            
            if len(password) < 6:
                flash('Пароль должен содержать минимум 6 символов', 'error')
                return render_template('register_employer.html')
            
            if not validate_email(email):
                flash('Некорректный email адрес', 'error')
                return render_template('register_employer.html')
            
            phone = validate_phone(phone)
            if not phone:
                flash('Некорректный номер телефона', 'error')
                return render_template('register_employer.html')
            
            # Проверка уникальности
            if Employer.query.filter_by(email=email).first():
                flash('Работодатель с таким email уже существует', 'error')
                return render_template('register_employer.html')
            
            # Создание работодателя
            from db_models import SubscriptionTier
            
            employer = Employer(
                email=email,
                phone=phone,
                company_name=company_name,
                contact_person=contact_person,
                city=city,
                company_size=company_size,
                industry=industry,
                subscription_tier=SubscriptionTier.FREE,
                vacancies_limit=1,
                is_active=True
            )
            employer.set_password(password)
            
            db.session.add(employer)
            db.session.commit()
            
            # Автоматический вход
            login_user(employer, remember=True)
            
            flash('Регистрация успешно завершена! Добро пожаловать в WorkPlus.kz!', 'success')
            return redirect(url_for('employer.dashboard'))
            
        except Exception as e:
            db.session.rollback()
            flash('Произошла ошибка при регистрации. Попробуйте еще раз.', 'error')
            return render_template('register_employer.html')
    
    from config import Constants
    return render_template('register_employer.html',
                         company_sizes=Constants.COMPANY_SIZES,
                         industries=Constants.INDUSTRIES)

@auth_bp.route('/logout')
@login_required
def logout():
    """Выход из системы"""
    logout_user()
    flash('Вы успешно вышли из системы', 'info')
    return redirect(url_for('auth.login'))

@auth_bp.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    """Восстановление пароля"""
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        
        if not validate_email(email):
            flash('Некорректный email адрес', 'error')
            return render_template('forgot_password.html')
        
        # Ищем пользователя в любой из таблиц
        user = User.query.filter_by(email=email).first()
        if not user:
            user = Employer.query.filter_by(email=email).first()
        
        if user:
            # TODO: Отправить email с инструкциями по восстановлению
            # Пока что просто показываем сообщение
            flash('Инструкции по восстановлению пароля отправлены на ваш email', 'info')
        else:
            # Не показываем, что пользователь не найден (безопасность)
            flash('Инструкции по восстановлению пароля отправлены на ваш email', 'info')
        
        return redirect(url_for('auth.login'))
    
    return render_template('forgot_password.html')

@auth_bp.route('/verify-email/<token>')
def verify_email(token):
    """Подтверждение email (заглушка)"""
    # TODO: Реализовать верификацию email
    flash('Email подтвержден!', 'success')
    return redirect(url_for('auth.login'))