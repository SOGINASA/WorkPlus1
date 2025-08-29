from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User, Company
from datetime import timedelta
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Валидация email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone(phone):
    """Валидация номера телефона (Казахстан)"""
    # Убираем все кроме цифр
    clean_phone = re.sub(r'\D', '', phone)
    
    # Казахстанские номера: +7 7XX XXX XXXX или 8 7XX XXX XXXX
    if len(clean_phone) == 11 and clean_phone.startswith('7'):
        return True
    elif len(clean_phone) == 11 and clean_phone.startswith('87'):
        return True
    
    return False

@auth_bp.route('/register', methods=['POST'])
def register():
    """Регистрация пользователя"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Данные не предоставлены'}), 400
    
    # Валидация обязательных полей
    required_fields = ['email', 'password', 'name', 'user_type']
    missing_fields = [field for field in required_fields if not data.get(field)]
    
    if missing_fields:
        return jsonify({
            'error': 'Отсутствуют обязательные поля',
            'missing_fields': missing_fields
        }), 400
    
    # Валидация email
    if not validate_email(data['email']):
        return jsonify({'error': 'Неверный формат email'}), 400
    
    # Валидация типа пользователя
    if data['user_type'] not in ['candidate', 'employer']:
        return jsonify({'error': 'Неверный тип пользователя'}), 400
    
    # Валидация телефона если указан
    if data.get('phone') and not validate_phone(data['phone']):
        return jsonify({'error': 'Неверный формат номера телефона'}), 400
    
    # Валидация пароля
    if len(data['password']) < 6:
        return jsonify({'error': 'Пароль должен содержать минимум 6 символов'}), 400
    
    # Проверка уникальности email
    existing_user = User.query.filter_by(email=data['email'].lower()).first()
    if existing_user:
        return jsonify({'error': 'Пользователь с таким email уже существует'}), 400
    
    try:
        # Создаем пользователя
        user = User(
            email=data['email'].lower(),
            name=data['name'],
            phone=data.get('phone'),
            city=data.get('city'),
            user_type=data['user_type']
        )
        user.set_password(data['password'])
        
        # Дополнительные поля для соискателя
        if data['user_type'] == 'candidate':
            user.education_level = data.get('education_level')
            user.experience_years = data.get('experience_years')
            user.telegram_username = data.get('telegram_username')
            
            if data.get('skills'):
                user.set_skills_list(data['skills'])
        
        # Дополнительные поля для работодателя
        elif data['user_type'] == 'employer':
            user.position = data.get('position')
            
            # Если указана компания
            if data.get('company_name'):
                company = Company(
                    name=data['company_name'],
                    description=data.get('company_description'),
                    industry=data.get('company_industry'),
                    size=data.get('company_size'),
                    website=data.get('company_website'),
                    city=data.get('city')
                )
                db.session.add(company)
                db.session.flush()  # Получаем ID
                user.company_id = company.id
        
        db.session.add(user)
        db.session.commit()
        
        # Создаем токены
        access_token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=24),
            additional_claims={
                'user_type': user.user_type,
                'email': user.email,
                'name': user.name
            }
        )
        
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Регистрация успешна',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка регистрации: {e}")
        return jsonify({'error': 'Ошибка при создании аккаунта'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Вход пользователя"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email и пароль обязательны'}), 400
    
    user = User.query.filter_by(email=data['email'].lower(), is_active=True).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Неверные учетные данные'}), 401
    
    # Обновляем время последнего входа
    from datetime import datetime
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Создаем токены
    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(hours=24),
        additional_claims={
            'user_type': user.user_type,
            'email': user.email,
            'name': user.name
        }
    )
    
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Вход выполнен успешно',
        'user': user.to_dict(include_sensitive=True),
        'access_token': access_token,
        'refresh_token': refresh_token
    })

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Обновление токена"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Пользователь не найден'}), 404
        
        new_access_token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=24),
            additional_claims={
                'user_type': user.user_type,
                'email': user.email,
                'name': user.name
            }
        )
        
        return jsonify({
            'access_token': new_access_token,
            'message': 'Токен обновлен'
        })
    
    except Exception as e:
        print(f"Ошибка обновления токена: {e}")
        return jsonify({'error': 'Ошибка обновления токена'}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Получить данные текущего пользователя"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Пользователь не найден'}), 404
        
        return jsonify({
            'user': user.to_dict(include_sensitive=True)
        })
    
    except Exception as e:
        print(f"Ошибка получения пользователя: {e}")
        return jsonify({'error': 'Ошибка получения данных пользователя'}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Обновление профиля пользователя"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Пользователь не найден'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400
        
        # Обновляем основные поля
        if 'name' in data:
            user.name = data['name']
        
        if 'phone' in data:
            if data['phone'] and not validate_phone(data['phone']):
                return jsonify({'error': 'Неверный формат номера телефона'}), 400
            user.phone = data['phone']
        
        if 'city' in data:
            user.city = data['city']
        
        # Поля для соискателя
        if user.user_type == 'candidate':
            if 'birth_date' in data:
                if data['birth_date']:
                    from datetime import datetime
                    user.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()
                else:
                    user.birth_date = None
            
            if 'gender' in data:
                user.gender = data['gender']
            
            if 'education_level' in data:
                user.education_level = data['education_level']
            
            if 'experience_years' in data:
                user.experience_years = data['experience_years']
            
            if 'skills' in data:
                user.set_skills_list(data['skills'])
            
            if 'resume_url' in data:
                user.resume_url = data['resume_url']
            
            if 'portfolio_url' in data:
                user.portfolio_url = data['portfolio_url']
            
            if 'telegram_username' in data:
                user.telegram_username = data['telegram_username']
        
        # Поля для работодателя
        elif user.user_type == 'employer':
            if 'position' in data:
                user.position = data['position']
        
        # Настройки уведомлений
        if 'email_notifications' in data:
            user.email_notifications = bool(data['email_notifications'])
        
        if 'sms_notifications' in data:
            user.sms_notifications = bool(data['sms_notifications'])
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Профиль обновлен',
            'user': user.to_dict(include_sensitive=True)
        })
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка обновления профиля: {e}")
        return jsonify({'error': 'Ошибка при обновлении профиля'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Смена пароля"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Пользователь не найден'}), 404
        
        data = request.get_json()
        if not data or not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Необходимы текущий и новый пароль'}), 400
        
        # Проверяем текущий пароль
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Неверный текущий пароль'}), 400
        
        # Валидация нового пароля
        if len(data['new_password']) < 6:
            return jsonify({'error': 'Новый пароль должен содержать минимум 6 символов'}), 400
        
        user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({'message': 'Пароль успешно изменен'})
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка смены пароля: {e}")
        return jsonify({'error': 'Ошибка при смене пароля'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Восстановление пароля"""
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'error': 'Email обязателен'}), 400
    
    user = User.query.filter_by(email=data['email'].lower(), is_active=True).first()
    
    if not user:
        # Не сообщаем о том, что пользователь не найден (безопасность)
        return jsonify({'message': 'Если пользователь с таким email существует, инструкции отправлены на почту'})
    
    try:
        # Генерируем токен сброса
        import secrets
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        
        db.session.commit()
        
        # Здесь должна быть отправка email с токеном сброса
        # TODO: Реализовать отправку email
        
        return jsonify({'message': 'Инструкции отправлены на почту'})
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка восстановления пароля: {e}")
        return jsonify({'error': 'Ошибка при отправке инструкций'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Сброс пароля по токену"""
    data = request.get_json()
    
    if not data or not data.get('token') or not data.get('password'):
        return jsonify({'error': 'Токен и новый пароль обязательны'}), 400
    
    user = User.query.filter_by(reset_token=data['token']).first()
    
    if not user or not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        return jsonify({'error': 'Недействительный или истекший токен'}), 400
    
    # Валидация нового пароля
    if len(data['password']) < 6:
        return jsonify({'error': 'Пароль должен содержать минимум 6 символов'}), 400
    
    try:
        user.set_password(data['password'])
        user.reset_token = None
        user.reset_token_expires = None
        
        db.session.commit()
        
        return jsonify({'message': 'Пароль успешно изменен'})
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка сброса пароля: {e}")
        return jsonify({'error': 'Ошибка при смене пароля'}), 500

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email():
    """Верификация email"""
    data = request.get_json()
    
    if not data or not data.get('token'):
        return jsonify({'error': 'Токен верификации обязателен'}), 400
    
    user = User.query.filter_by(verification_token=data['token']).first()
    
    if not user:
        return jsonify({'error': 'Недействительный токен верификации'}), 400
    
    try:
        user.is_verified = True
        user.verification_token = None
        
        db.session.commit()
        
        return jsonify({'message': 'Email успешно подтвержден'})
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка верификации email: {e}")
        return jsonify({'error': 'Ошибка при подтверждении email'}), 500

@auth_bp.route('/deactivate', methods=['POST'])
@jwt_required()
def deactivate_account():
    """Деактивация аккаунта"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404
        
        data = request.get_json()
        if not data or not data.get('password'):
            return jsonify({'error': 'Подтверждение паролем обязательно'}), 400
        
        if not user.check_password(data['password']):
            return jsonify({'error': 'Неверный пароль'}), 400
        
        user.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Аккаунт деактивирован'})
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка деактивации аккаунта: {e}")
        return jsonify({'error': 'Ошибка при деактивации аккаунта'}), 500