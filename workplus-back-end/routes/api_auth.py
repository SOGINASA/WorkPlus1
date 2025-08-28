from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps

from db_models import db, User, Employer, Admin
from utils.helpers import validate_email, validate_phone, validate_iin, track_event

api_auth_bp = Blueprint('api_auth', __name__)

def generate_token(user, user_type):
    """Генерация JWT токена"""
    payload = {
        'user_id': user.id,
        'user_type': user_type,  # 'user', 'employer', 'admin'
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(days=7),  # Токен на 7 дней
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token

def token_required(f):
    """Декоратор для проверки JWT токена"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Получаем токен из заголовка Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format. Use: Bearer <token>'}), 401
        
        if not token:
            return jsonify({'error': 'Authentication token is required'}), 401
        
        try:
            # Декодируем токен
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            
            # Получаем пользователя
            user_id = payload['user_id']
            user_type = payload['user_type']
            
            if user_type == 'user':
                current_user = User.query.get(user_id)
            elif user_type == 'employer':
                current_user = Employer.query.get(user_id)
            elif user_type == 'admin':
                current_user = Admin.query.get(user_id)
            else:
                return jsonify({'error': 'Invalid user type in token'}), 401
            
            if not current_user or not current_user.is_active:
                return jsonify({'error': 'User not found or account is inactive'}), 401
            
            # Обновляем время последней активности
            current_user.last_activity = datetime.now()
            try:
                db.session.commit()
            except Exception:
                db.session.rollback()
            
            # Добавляем пользователя в контекст запроса
            request.current_user = current_user
            request.user_type = user_type
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired. Please login again'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token. Please login again'}), 401
        except Exception as e:
            current_app.logger.error(f"Token verification error: {str(e)}")
            return jsonify({'error': 'Token verification failed'}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

def employer_required(f):
    """Декоратор для проверки, что текущий пользователь - работодатель"""
    @wraps(f)
    @token_required
    def decorated_function(*args, **kwargs):
        if request.user_type != 'employer':
            return jsonify({
                'error': 'Employer access required',
                'message': 'This endpoint is only available for employers',
                'required_role': 'employer',
                'current_role': request.user_type
            }), 403
        return f(*args, **kwargs)
    return decorated_function

def user_required(f):
    """Декоратор для проверки, что текущий пользователь - соискатель"""
    @wraps(f)
    @token_required
    def decorated_function(*args, **kwargs):
        if request.user_type != 'user':
            return jsonify({
                'error': 'User access required',
                'message': 'This endpoint is only available for job seekers',
                'required_role': 'user',
                'current_role': request.user_type
            }), 403
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Декоратор для проверки, что текущий пользователь - администратор"""
    @wraps(f)
    @token_required
    def decorated_function(*args, **kwargs):
        if request.user_type != 'admin':
            return jsonify({
                'error': 'Administrator access required',
                'message': 'This endpoint is only available for administrators',
                'required_role': 'admin',
                'current_role': request.user_type
            }), 403
        return f(*args, **kwargs)
    return decorated_function

@api_auth_bp.route('/login', methods=['POST'])
def login():
    """API авторизации"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'JSON data required',
                'message': 'Request body must contain valid JSON'
            }), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        user_type = data.get('user_type', 'user')  # user, employer, admin
        
        # Валидация обязательных полей
        if not email or not password:
            return jsonify({
                'error': 'Missing required fields',
                'message': 'Email and password are required'
            }), 400
        
        if not validate_email(email):
            return jsonify({
                'error': 'Invalid email format',
                'message': 'Please provide a valid email address'
            }), 400
        
        # Поиск пользователя в зависимости от типа
        user = None
        if user_type == 'employer':
            user = Employer.query.filter_by(email=email).first()
        elif user_type == 'admin':
            user = Admin.query.filter_by(email=email).first()
        else:
            user = User.query.filter_by(email=email).first()
            user_type = 'user'
        
        if not user or not user.check_password(password):
            # Логируем неуспешную попытку входа
            track_event('login_failed', metadata={'email': email, 'user_type': user_type})
            return jsonify({
                'error': 'Invalid credentials',
                'message': 'Incorrect email or password'
            }), 401
        
        if not user.is_active:
            return jsonify({
                'error': 'Account deactivated',
                'message': 'Your account has been deactivated. Please contact support.'
            }), 401
        
        # Генерируем токен
        token = generate_token(user, user_type)
        
        # Логируем успешный вход
        track_event('login_success', 
                   user_id=user.id if user_type == 'user' else None,
                   employer_id=user.id if user_type == 'employer' else None,
                   metadata={'user_type': user_type})
        
        # Формируем профиль пользователя
        profile = {
            'id': user.id,
            'email': user.email,
            'user_type': user_type,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat(),
            'last_activity': user.last_activity.isoformat() if user.last_activity else None
        }
        
        if user_type == 'user':
            profile.update({
                'full_name': user.full_name,
                'city': user.city,
                'phone': user.phone,
                'avatar_path': user.avatar_path,
                'rating': user.rating,
                'is_verified': user.is_verified,
                'experience_years': user.experience_years
            })
        elif user_type == 'employer':
            profile.update({
                'company_name': user.company_name,
                'contact_person': user.contact_person,
                'city': user.city,
                'phone': user.phone,
                'subscription_tier': user.subscription_tier.value,
                'is_verified': user.is_verified,
                'rating': user.rating,
                'vacancies_limit': user.vacancies_limit,
                'used_vacancies': user.used_vacancies
            })
        elif user_type == 'admin':
            profile.update({
                'full_name': user.full_name,
                'role': user.role
            })
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': profile,
            'expires_in': 7 * 24 * 3600  # 7 дней в секундах
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({
            'error': 'Login failed',
            'message': 'An error occurred during login. Please try again.'
        }), 500



@api_auth_bp.route('/register/employer', methods=['POST'])
def register_employer():
    """API регистрации работодателя"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'JSON data required',
                'message': 'Request body must contain valid JSON'
            }), 400
        
        # Обязательные поля
        required_fields = ['email', 'password', 'company_name', 'contact_person', 'phone', 'city']
        missing_fields = []
        
        for field in required_fields:
            if not data.get(field, '').strip():
                missing_fields.append(field)
        
        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'message': f'The following fields are required: {", ".join(missing_fields)}'
            }), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        company_name = data.get('company_name', '').strip()
        contact_person = data.get('contact_person', '').strip()
        phone = data.get('phone', '').strip()
        city = data.get('city', '').strip()
        
        # Валидация
        if len(password) < 6:
            return jsonify({
                'error': 'Password too short',
                'message': 'Password must be at least 6 characters long'
            }), 400
        
        if not validate_email(email):
            return jsonify({
                'error': 'Invalid email format',
                'message': 'Please provide a valid email address'
            }), 400
        
        validated_phone = validate_phone(phone)
        if not validated_phone:
            return jsonify({
                'error': 'Invalid phone format',
                'message': 'Please provide a valid Kazakhstan phone number'
            }), 400
        
        # Проверка уникальности
        if Employer.query.filter_by(email=email).first():
            return jsonify({
                'error': 'Email already exists',
                'message': 'An employer with this email address already exists'
            }), 409
        
        # Создание работодателя
        from db_models import SubscriptionTier
        
        employer = Employer(
            email=email,
            phone=validated_phone,
            company_name=company_name,
            contact_person=contact_person,
            city=city,
            company_description=data.get('company_description', '').strip(),
            company_website=data.get('company_website', '').strip(),
            company_size=data.get('company_size'),
            industry=data.get('industry'),
            bin_number=data.get('bin_number', '').strip(),
            subscription_tier=SubscriptionTier.FREE,
            vacancies_limit=1,
            is_active=True
        )
        employer.set_password(password)
        
        db.session.add(employer)
        db.session.commit()
        
        # Генерируем токен для автоматического входа
        token = generate_token(employer, 'employer')
        
        # Логируем регистрацию
        track_event('employer_registered', employer_id=employer.id)
        
        return jsonify({
            'success': True,
            'message': 'Employer registered successfully',
            'token': token,
            'user': {
                'id': employer.id,
                'email': employer.email,
                'company_name': employer.company_name,
                'contact_person': employer.contact_person,
                'city': employer.city,
                'subscription_tier': employer.subscription_tier.value,
                'user_type': 'employer'
            },
            'expires_in': 7 * 24 * 3600
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Employer registration error: {str(e)}")
        return jsonify({
            'error': 'Registration failed',
            'message': 'An error occurred during registration. Please try again.'
        }), 500

@api_auth_bp.route('/refresh', methods=['POST'])
@token_required
def refresh_token():
    """Обновление токена"""
    try:
        user = request.current_user
        user_type = request.user_type
        
        # Генерируем новый токен
        new_token = generate_token(user, user_type)
        
        return jsonify({
            'success': True,
            'message': 'Token refreshed successfully',
            'token': new_token,
            'expires_in': 7 * 24 * 3600
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Token refresh error: {str(e)}")
        return jsonify({
            'error': 'Token refresh failed',
            'message': 'Unable to refresh token. Please login again.'
        }), 500

@api_auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    """Получение профиля текущего пользователя"""
    try:
        user = request.current_user
        user_type = request.user_type
        
        profile = {
            'id': user.id,
            'email': user.email,
            'user_type': user_type,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat(),
            'updated_at': user.updated_at.isoformat() if hasattr(user, 'updated_at') and user.updated_at else None,
            'last_activity': user.last_activity.isoformat() if user.last_activity else None
        }
        
        if user_type == 'user':
            profile.update({
                'full_name': user.full_name,
                'phone': user.phone,
                'city': user.city,
                'birth_date': user.birth_date.isoformat() if user.birth_date else None,
                'bio': user.bio,
                'experience_years': user.experience_years,
                'desired_salary_from': user.desired_salary_from,
                'desired_salary_to': user.desired_salary_to,
                'avatar_path': user.avatar_path,
                'resume_file': user.resume_file,
                'rating': user.rating,
                'rating_count': user.rating_count,
                'is_verified': user.is_verified,
                'notifications_email': user.notifications_email,
                'notifications_sms': user.notifications_sms,
                'notifications_telegram': user.notifications_telegram
            })
        elif user_type == 'employer':
            profile.update({
                'company_name': user.company_name,
                'company_description': user.company_description,
                'company_website': user.company_website,
                'company_size': user.company_size,
                'industry': user.industry,
                'contact_person': user.contact_person,
                'phone': user.phone,
                'city': user.city,
                'address': user.address,
                'bin_number': user.bin_number,
                'is_verified': user.is_verified,
                'subscription_tier': user.subscription_tier.value,
                'subscription_start': user.subscription_start.isoformat() if user.subscription_start else None,
                'subscription_end': user.subscription_end.isoformat() if user.subscription_end else None,
                'vacancies_limit': user.vacancies_limit,
                'used_vacancies': user.used_vacancies,
                'rating': user.rating,
                'rating_count': user.rating_count,
                'total_hired': user.total_hired
            })
        elif user_type == 'admin':
            profile.update({
                'full_name': user.full_name,
                'role': user.role
            })
        
        return jsonify({
            'success': True,
            'user': profile
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get profile error: {str(e)}")
        return jsonify({
            'error': 'Failed to get profile',
            'message': 'Unable to retrieve user profile'
        }), 500

@api_auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    """Выход из системы (клиент должен удалить токен)"""
    try:
        user = request.current_user
        user_type = request.user_type
        
        # Логируем выход
        track_event('logout', 
                   user_id=user.id if user_type == 'user' else None,
                   employer_id=user.id if user_type == 'employer' else None)
        
        return jsonify({
            'success': True,
            'message': 'Logged out successfully. Please remove the token from client storage.'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Logout error: {str(e)}")
        return jsonify({
            'error': 'Logout failed',
            'message': 'An error occurred during logout'
        }), 500

@api_auth_bp.route('/verify-token', methods=['POST'])
@token_required
def verify_token():
    """Проверка валидности токена"""
    return jsonify({
        'success': True,
        'valid': True,
        'user_type': request.user_type,
        'user_id': request.current_user.id,
        'message': 'Token is valid'
        ': 7 * 24 * 3600  # 7 дней в секундах'
        }), 200
        

@api_auth_bp.route('/register/user', methods=['POST'])
def register_user():
    """API регистрации соискателя"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'JSON data required'}), 400
        
        # Обязательные поля
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        full_name = data.get('full_name', '').strip()
        phone = data.get('phone', '').strip()
        city = data.get('city', '').strip()
        
        # Валидация
        if not all([email, password, full_name, phone, city]):
            return jsonify({'error': 'All required fields must be filled'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        phone = validate_phone(phone)
        if not phone:
            return jsonify({'error': 'Invalid phone number format'}), 400
        
        # Проверка уникальности
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'User with this email already exists'}), 409
        
        if User.query.filter_by(phone=phone).first():
            return jsonify({'error': 'User with this phone already exists'}), 409
        
        # Дополнительные поля
        birth_date_str = data.get('birth_date')
        birth_date = None
        if birth_date_str:
            try:
                birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid birth date format. Use YYYY-MM-DD'}), 400
        
        # Создание пользователя
        user = User(
            email=email,
            phone=phone,
            full_name=full_name,
            city=city,
            birth_date=birth_date,
            bio=data.get('bio', '').strip(),
            experience_years=data.get('experience_years', 0),
            desired_salary_from=data.get('desired_salary_from'),
            desired_salary_to=data.get('desired_salary_to'),
            is_active=True
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Генерируем токен для автоматического входа
        token = generate_token(user, 'user')
        
        # Логируем регистрацию
        track_event('user_registered', user_id=user.id)
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'city': user.city,
                'user_type': 'user'
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"User registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500



# # @api_auth_bp.route('/refresh', methods=['POST'])
# # @token_required
# # def refresh_token():
# #     """Обновление токена"""
# #     try:
# #         user = request.current_user
# #         user_type = request.user_type
        
# #         # Генерируем новый токен
# #         new_token = generate_token(user, user_type)
        
# #         return jsonify({
# #             'success': True,
# #             'token': new_token,
# #             'expires_in': 7 * 24 * 3600
# #         }), 200
        
# #     except Exception as e:
# #         current_app.logger.error(f"Token refresh error: {str(e)}")
# #         return jsonify({'error': 'Token refresh failed'}), 500

# @api_auth_bp.route('/profile', methods=['GET'])
# @token_required
# def get_profile():
#     """Получение профиля текущего пользователя"""
#     try:
#         user = request.current_user
#         user_type = request.user_type
        
#         profile = {
#             'id': user.id,
#             'email': user.email,
#             'user_type': user_type,
#             'is_active': user.is_active,
#             'created_at': user.created_at.isoformat(),
#             'last_activity': user.last_activity.isoformat() if user.last_activity else None
#         }
        
#         if user_type == 'user':
#             profile.update({
#                 'full_name': user.full_name,
#                 'phone': user.phone,
#                 'city': user.city,
#                 'birth_date': user.birth_date.isoformat() if user.birth_date else None,
#                 'bio': user.bio,
#                 'experience_years': user.experience_years,
#                 'desired_salary_from': user.desired_salary_from,
#                 'desired_salary_to': user.desired_salary_to,
#                 'avatar_path': user.avatar_path,
#                 'resume_file': user.resume_file,
#                 'rating': user.rating,
#                 'rating_count': user.rating_count,
#                 'is_verified': user.is_verified,
#                 'notifications_email': user.notifications_email,
#                 'notifications_sms': user.notifications_sms,
#                 'notifications_telegram': user.notifications_telegram
#             })
#         elif user_type == 'employer':
#             profile.update({
#                 'company_name': user.company_name,
#                 'company_description': user.company_description,
#                 'company_website': user.company_website,
#                 'company_size': user.company_size,
#                 'industry': user.industry,
#                 'contact_person': user.contact_person,
#                 'phone': user.phone,
#                 'city': user.city,
#                 'address': user.address,
#                 'bin_number': user.bin_number,
#                 'is_verified': user.is_verified,
#                 'subscription_tier': user.subscription_tier.value,
#                 'subscription_start': user.subscription_start.isoformat() if user.subscription_start else None,
#                 'subscription_end': user.subscription_end.isoformat() if user.subscription_end else None,
#                 'vacancies_limit': user.vacancies_limit,
#                 'used_vacancies': user.used_vacancies,
#                 'rating': user.rating,
#                 'rating_count': user.rating_count,
#                 'total_hired': user.total_hired
#             })
#         elif user_type == 'admin':
#             profile.update({
#                 'full_name': user.full_name,
#                 'role': user.role
#             })
        
#         return jsonify({
#             'success': True,
#             'user': profile
#         }), 200
        
#     except Exception as e:
#         current_app.logger.error(f"Get profile error: {str(e)}")
#         return jsonify({'error': 'Failed to get profile'}), 500

# @api_auth_bp.route('/logout', methods=['POST'])
# @token_required
# def logout():
#     """Выход из системы (клиент должен удалить токен)"""
#     try:
#         user = request.current_user
#         user_type = request.user_type
        
#         # Логируем выход
#         track_event('logout', 
#                    user_id=user.id if user_type == 'user' else None,
#                    employer_id=user.id if user_type == 'employer' else None)
        
#         return jsonify({
#             'success': True,
#             'message': 'Logged out successfully'
#         }), 200
        
#     except Exception as e:
#         current_app.logger.error(f"Logout error: {str(e)}")
#         return jsonify({'error': 'Logout failed'}), 500

# @api_auth_bp.route('/verify-token', methods=['POST'])
# @token_required
# def verify_token():
#     """Проверка валидности токена"""
#     return jsonify({
#         'success': True,
#         'valid': True,
#         'user_type': request.user_type,
#         'user_id': request.current_user.id
#     }), 200