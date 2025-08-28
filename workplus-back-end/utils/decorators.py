from functools import wraps
from flask import flash, redirect, url_for, abort, request, jsonify
from flask_login import current_user
from db_models import Employer, User, Admin

def employer_required(f):
    """Декоратор для проверки, что текущий пользователь - работодатель"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('Для доступа к этой странице необходимо войти в систему', 'info')
            return redirect(url_for('auth.login'))
        
        if not isinstance(current_user, Employer):
            flash('Доступ запрещен. Эта страница только для работодателей.', 'error')
            return redirect(url_for('index'))
        
        if not current_user.is_active:
            flash('Ваш аккаунт деактивирован. Обратитесь в поддержку.', 'error')
            return redirect(url_for('auth.login'))
        
        return f(*args, **kwargs)
    return decorated_function

def user_required(f):
    """Декоратор для проверки, что текущий пользователь - соискатель"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('Для доступа к этой странице необходимо войти в систему', 'info')
            return redirect(url_for('auth.login'))
        
        if not isinstance(current_user, User):
            flash('Доступ запрещен. Эта страница только для соискателей.', 'error')
            return redirect(url_for('index'))
        
        if not current_user.is_active:
            flash('Ваш аккаунт деактивирован. Обратитесь в поддержку.', 'error')
            return redirect(url_for('auth.login'))
        
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Декоратор для проверки, что текущий пользователь - администратор"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('Для доступа к этой странице необходимо войти в систему', 'info')
            return redirect(url_for('auth.login'))
        
        if not isinstance(current_user, Admin):
            flash('Доступ запрещен. Требуются права администратора.', 'error')
            return redirect(url_for('index'))
        
        if not current_user.is_active:
            flash('Ваш аккаунт деактивирован.', 'error')
            return redirect(url_for('auth.login'))
        
        return f(*args, **kwargs)
    return decorated_function

def subscription_required(tiers):
    """Декоратор для проверки подписки работодателя"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return redirect(url_for('auth.login'))
            
            if not isinstance(current_user, Employer):
                abort(403)
            
            if current_user.subscription_tier not in tiers:
                if request.is_json:
                    return jsonify({
                        'error': 'Требуется обновление подписки',
                        'required_tiers': [tier.value for tier in tiers]
                    }), 403
                else:
                    flash('Эта функция доступна только в более высоких тарифах', 'info')
                    return redirect(url_for('employer.subscription'))
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def verified_employer_required(f):
    """Декоратор для проверки верификации работодателя"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return redirect(url_for('auth.login'))
        
        if not isinstance(current_user, Employer):
            abort(403)
        
        if not current_user.is_verified:
            flash('Для использования этой функции необходима верификация аккаунта', 'info')
            return redirect(url_for('employer.profile'))
        
        return f(*args, **kwargs)
    return decorated_function

def rate_limit(max_requests=100, per_hours=1):
    """Декоратор для ограничения частоты запросов"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # В продакшене здесь должна быть реализация с Redis
            # Пока что простая заглушка
            return f(*args, **kwargs)
        return decorated_function
    return decorator