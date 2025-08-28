from flask import Flask, render_template, request, jsonify
import os
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime
import logging

from db_models import db, init_database
from config import Config

# Импорт API маршрутов
from routes.api import api_bp
from routes.employer import employer_bp
from routes.user import user_bp

# Создание папок для загрузки файлов
UPLOAD_FOLDER = os.path.join('static', 'uploads')
AVATAR_FOLDER = os.path.join(UPLOAD_FOLDER, 'avatars')
RESUME_FOLDER = os.path.join(UPLOAD_FOLDER, 'resumes')
COMPANY_DOCS_FOLDER = os.path.join(UPLOAD_FOLDER, 'company_docs')
VACANCY_IMAGES_FOLDER = os.path.join(UPLOAD_FOLDER, 'vacancy_images')

def create_upload_folders():
    """Создание необходимых папок для загрузки файлов"""
    folders = [
        UPLOAD_FOLDER,
        AVATAR_FOLDER, 
        RESUME_FOLDER,
        COMPANY_DOCS_FOLDER,
        VACANCY_IMAGES_FOLDER
    ]
    
    for folder in folders:
        os.makedirs(folder, exist_ok=True)

def create_app():
    """Фабрика приложений Flask для REST API"""
    app = Flask(__name__)
    
    # Конфигурация
    app.config.from_object(Config)
    
    # CORS для фронтенда
    CORS(app, 
         origins=app.config.get('CORS_ORIGINS', ['http://localhost:3000']),
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # Инициализация расширений
    db.init_app(app)
    migrate = Migrate(app, db)
    
    # Настройка логирования
    if not app.debug:
        logging.basicConfig(level=logging.INFO)
        handler = logging.FileHandler('workplus.log')
        handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s %(name)s %(message)s'
        ))
        app.logger.addHandler(handler)

    # Главная страница - информация об API
    @app.route('/')
    def index():
        """Информация об API"""
        return jsonify({
            'name': 'WorkPlus.kz API',
            'version': '1.0.0',
            'description': 'REST API for WorkPlus.kz HR platform',
            'endpoints': {
                'auth': {
                    'login': 'POST /api/auth/login',
                    'register_user': 'POST /api/auth/register/user',
                    'register_employer': 'POST /api/auth/register/employer',
                    'refresh': 'POST /api/auth/refresh',
                    'profile': 'GET /api/auth/profile',
                    'logout': 'POST /api/auth/logout',
                    'verify_token': 'POST /api/auth/verify-token'
                },
                'public': {
                    'vacancies': 'GET /api/vacancies',
                    'vacancy_detail': 'GET /api/vacancies/{id}',
                    'stats': 'GET /api/stats',
                    'categories': 'GET /api/categories',
                    'skills': 'GET /api/skills',
                    'cities': 'GET /api/cities',
                    'constants': 'GET /api/constants'
                },
                'user': {
                    'dashboard': 'GET /api/user/dashboard',
                    'applications': 'GET/POST /api/user/applications',
                    'profile': 'PUT /api/user/profile',
                    'skills': 'GET/PUT /api/user/skills',
                    'search': 'GET /api/user/search',
                    'tests': 'GET /api/user/tests',
                    'notifications': 'GET /api/user/notifications'
                },
                'employer': {
                    'dashboard': 'GET /api/employer/dashboard',
                    'vacancies': 'GET/POST /api/employer/vacancies',
                    'vacancy_detail': 'GET /api/employer/vacancies/{id}',
                    'applications': 'GET /api/employer/vacancies/{id}/applications',
                    'update_status': 'PUT /api/employer/applications/{id}/status',
                    'analytics': 'GET /api/employer/analytics'
                }
            },
            'authentication': 'Bearer JWT Token required for protected endpoints',
            'timestamp': datetime.now().isoformat(),
            'docs': 'Visit https://docs.workplus.kz for detailed documentation'
        })

    @app.route('/health')
    def health_check():
        """Проверка состояния сервиса"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0.0',
            'database': 'connected'
        })

    # Обработчики ошибок для API
    @app.errorhandler(404)
    def not_found_error(error):
        """Обработчик ошибки 404"""
        return jsonify({
            'error': 'Endpoint not found',
            'message': 'The requested endpoint does not exist',
            'available_endpoints': '/api/'
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        """Обработчик ошибки 500"""
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'message': 'Something went wrong on our end'
        }), 500

    @app.errorhandler(403)
    def forbidden_error(error):
        """Обработчик ошибки 403"""
        return jsonify({
            'error': 'Access forbidden',
            'message': 'You do not have permission to access this resource'
        }), 403

    @app.errorhandler(401)
    def unauthorized_error(error):
        """Обработчик ошибки 401"""
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication required'
        }), 401

    @app.errorhandler(400)
    def bad_request_error(error):
        """Обработчик ошибки 400"""
        return jsonify({
            'error': 'Bad request',
            'message': 'Invalid request data'
        }), 400

    @app.errorhandler(422)
    def validation_error(error):
        """Обработчик ошибки валидации"""
        return jsonify({
            'error': 'Validation error',
            'message': 'Request data validation failed'
        }), 422

    # Обработчик CORS preflight запросов
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = jsonify({'status': 'ok'})
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            return response

    # Middleware для логирования запросов
    @app.after_request
    def log_request(response):
        if not app.debug:
            app.logger.info(
                f'{request.remote_addr} - {request.method} {request.path} - {response.status_code}'
            )
        return response

    # Middleware для добавления заголовков безопасности
    @app.after_request
    def security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        return response

    # Регистрация API маршрутов
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(employer_bp, url_prefix='/api/employer')  
    app.register_blueprint(user_bp, url_prefix='/api/user')

    # Catch-all для неопределенных маршрутов
    @app.route('/<path:path>')
    def catch_all(path):
        return jsonify({
            'error': 'Endpoint not found',
            'message': f'The endpoint /{path} does not exist',
            'suggestion': 'Check /api/ for available endpoints'
        }), 404

    return app

# Создание экземпляра приложения
app = create_app()

if __name__ == '__main__':
    # Создание папок для загрузки файлов
    create_upload_folders()
    
    # Инициализация БД при первом запуске (только в dev режиме)
    if app.config.get('DEBUG'):
        with app.app_context():
            try:
                # Проверяем, инициализирована ли БД
                db.engine.execute('SELECT 1 FROM vacancy_categories LIMIT 1')
                print("✅ Database already initialized")
            except Exception:
                print("🔄 Initializing database...")
                init_database()
                print("✅ Database initialized successfully")
    
    # Запуск приложения
    print(f"""
🚀 WorkPlus.kz API Server Starting...

📡 Server: http://{app.config.get('HOST', '0.0.0.0')}:{app.config.get('PORT', 5000)}
📖 API Docs: http://localhost:{app.config.get('PORT', 5000)}/
🔍 Health Check: http://localhost:{app.config.get('PORT', 5000)}/health

🔐 Test Accounts:
   👨‍💼 Employer: test@workplus.kz / password123
   👤 User: user1@example.com / password123
   👑 Admin: admin@workplus.kz / workplus2024

📝 Example API calls:
   curl -X POST http://localhost:5000/api/auth/login \\
     -H "Content-Type: application/json" \\
     -d '{{"email":"test@workplus.kz","password":"password123","user_type":"employer"}}'

   curl http://localhost:5000/api/vacancies

   curl http://localhost:5000/api/stats
    """)
    
    app.run(
        debug=app.config.get('DEBUG', False),
        host=app.config.get('HOST', '0.0.0.0'),
        port=app.config.get('PORT', 5000)
    )
from flask import Flask, redirect, request, jsonify
import os
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime, timedelta
import logging

from db_models import db, User, Employer, Admin, init_database
from config import Config

# Импорт API маршрутов
from routes.api import api_bp

# Создание папок для загрузки файлов
UPLOAD_FOLDER = os.path.join('static', 'uploads')
AVATAR_FOLDER = os.path.join(UPLOAD_FOLDER, 'avatars')
RESUME_FOLDER = os.path.join(UPLOAD_FOLDER, 'resumes')
COMPANY_DOCS_FOLDER = os.path.join(UPLOAD_FOLDER, 'company_docs')
VACANCY_IMAGES_FOLDER = os.path.join(UPLOAD_FOLDER, 'vacancy_images')

def create_upload_folders():
    """Создание необходимых папок для загрузки файлов"""
    folders = [
        UPLOAD_FOLDER,
        AVATAR_FOLDER, 
        RESUME_FOLDER,
        COMPANY_DOCS_FOLDER,
        VACANCY_IMAGES_FOLDER
    ]
    
    for folder in folders:
        os.makedirs(folder, exist_ok=True)

def create_app():
    """Фабрика приложений Flask для REST API"""
    app = Flask(__name__)
    
    # Конфигурация
    app.config.from_object(Config)
    
    # CORS для фронтенда
    CORS(app, 
         origins=app.config.get('CORS_ORIGINS', ['http://localhost:3000']),
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # Инициализация расширений
    db.init_app(app)
    migrate = Migrate(app, db)
    
    # Настройка логирования
    if not app.debug:
        logging.basicConfig(level=logging.INFO)
        handler = logging.FileHandler('workplus.log')
        handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s %(name)s %(message)s'
        ))
        app.logger.addHandler(handler)

    # Главная страница - информация об API
    @app.route('/')
    def index():
        """Информация об API"""
        return jsonify({
            'name': 'WorkPlus.kz API',
            'version': '1.0.0',
            'description': 'REST API for WorkPlus.kz HR platform',
            'endpoints': {
                'auth': {
                    'login': 'POST /api/auth/login',
                    'register_user': 'POST /api/auth/register/user',
                    'register_employer': 'POST /api/auth/register/employer',
                    'refresh': 'POST /api/auth/refresh',
                    'profile': 'GET /api/auth/profile',
                    'logout': 'POST /api/auth/logout'
                },
                'public': {
                    'vacancies': 'GET /api/vacancies',
                    'vacancy_detail': 'GET /api/vacancies/{id}',
                    'stats': 'GET /api/stats',
                    'categories': 'GET /api/categories',
                    'skills': 'GET /api/skills',
                    'cities': 'GET /api/cities',
                    'constants': 'GET /api/constants'
                },
                'user': {
                    'applications': 'GET/POST /api/user/applications',
                    'profile': 'PUT /api/user/profile',
                    'skills': 'GET/PUT /api/user/skills'
                },
                'employer': {
                    'vacancies': 'GET/POST /api/employer/vacancies',
                    'applications': 'GET /api/employer/vacancies/{id}/applications',
                    'update_status': 'PUT /api/employer/applications/{id}/status'
                }
            },
            'authentication': 'Bearer JWT Token required for protected endpoints',
            'timestamp': datetime.now().isoformat()
        })

    @app.route('/health')
    def health_check():
        """Проверка состояния сервиса"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0.0'
        })

    # Обработчики ошибок для API
    @app.errorhandler(404)
    def not_found_error(error):
        """Обработчик ошибки 404"""
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        """Обработчик ошибки 500"""
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    @app.errorhandler(403)
    def forbidden_error(error):
        """Обработчик ошибки 403"""
        return jsonify({'error': 'Access forbidden'}), 403

    @app.errorhandler(401)
    def unauthorized_error(error):
        """Обработчик ошибки 401"""
        return jsonify({'error': 'Unauthorized'}), 401

    @app.errorhandler(400)
    def bad_request_error(error):
        """Обработчик ошибки 400"""
        return jsonify({'error': 'Bad request'}), 400

    # Обработчик CORS preflight запросов
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = jsonify({'status': 'ok'})
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            return response

    # Middleware для логирования запросов
    @app.after_request
    def log_request(response):
        if not app.debug:
            app.logger.info(
                f'{request.remote_addr} - {request.method} {request.path} - {response.status_code}'
            )
        return response

    # Регистрация API маршрутов
    app.register_blueprint(api_bp, url_prefix='/api')

    # Инициализация базы данных при первом запуске
    with app.app_context():
        try:
            # Проверяем подключение к БД
            db.engine.execute('SELECT 1')
            app.logger.info("Database connection successful")
        except Exception as e:
            app.logger.error(f"Database connection failed: {str(e)}")

    return app

# Создание экземпляра приложения
app = create_app()

if __name__ == '__main__':
    # Создание папок для загрузки файлов
    create_upload_folders()
    
    # Запуск приложения
    app.run(
        debug=app.config.get('DEBUG', False),
        host=app.config.get('HOST', '0.0.0.0'),
        port=app.config.get('PORT', 5000)
    )
from flask import Flask, redirect, session, request, jsonify
import os
from flask_login import LoginManager, current_user
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime, timedelta
import logging

from db_models import db, User, Employer, Admin, init_database
from config import Config

# Импорт маршрутов
from routes.auth import auth_bp
from routes.user import user_bp  
from routes.employer import employer_bp
# from routes.admin import admin_bp  # Создать отдельно
# from routes.api import api_bp      # Создать отдельно  
# from routes.public import public_bp # Создать отдельно

# Создание папок для загрузки файлов
UPLOAD_FOLDER = os.path.join('static', 'uploads')
AVATAR_FOLDER = os.path.join(UPLOAD_FOLDER, 'avatars')
RESUME_FOLDER = os.path.join(UPLOAD_FOLDER, 'resumes')
COMPANY_DOCS_FOLDER = os.path.join(UPLOAD_FOLDER, 'company_docs')
VACANCY_IMAGES_FOLDER = os.path.join(UPLOAD_FOLDER, 'vacancy_images')

def create_upload_folders():
    """Создание необходимых папок для загрузки файлов"""
    folders = [
        UPLOAD_FOLDER,
        AVATAR_FOLDER, 
        RESUME_FOLDER,
        COMPANY_DOCS_FOLDER,
        VACANCY_IMAGES_FOLDER
    ]
    
    for folder in folders:
        os.makedirs(folder, exist_ok=True)

def create_app():
    """Фабрика приложений Flask"""
    app = Flask(__name__)
    
    # Конфигурация
    app.config.from_object(Config)
    
    # CORS для API
    CORS(app, origins=app.config.get('CORS_ORIGINS', ['http://localhost:3000']))
    
    # Инициализация расширений
    db.init_app(app)
    migrate = Migrate(app, db)
    
    # Настройка логирования
    if not app.debug:
        logging.basicConfig(level=logging.INFO)
        handler = logging.FileHandler('workplus.log')
        handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s %(name)s %(message)s'
        ))
        app.logger.addHandler(handler)
    
    # Настройка Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Для доступа к этой странице необходимо войти в систему'
    login_manager.login_message_category = 'info'

    @login_manager.user_loader
    def load_user(user_id):
        """Загрузка пользователя для Flask-Login"""
        if not user_id:
            return None
        
        try:
            # Определяем тип пользователя по префиксу
            if user_id.startswith('user:'):
                user_id = user_id.replace('user:', '')
                return User.query.get(int(user_id))
            elif user_id.startswith('employer:'):
                user_id = user_id.replace('employer:', '')
                return Employer.query.get(int(user_id))
            elif user_id.startswith('admin:'):
                user_id = user_id.replace('admin:', '')
                return Admin.query.get(int(user_id))
            else:
                # Попытка определить тип автоматически (для обратной совместимости)
                user = User.query.get(int(user_id))
                if user:
                    return user
                employer = Employer.query.get(int(user_id))
                if employer:
                    return employer
                admin = Admin.query.get(int(user_id))
                return admin
                
        except (ValueError, TypeError):
            return None

    # Контекстные процессоры для шаблонов
    @app.context_processor
    def inject_user():
        """Добавляем информацию о текущем пользователе в контекст шаблонов"""
        user_type = None
        if current_user.is_authenticated:
            if isinstance(current_user, Admin):
                user_type = 'admin'
            elif isinstance(current_user, Employer):
                user_type = 'employer'
            elif isinstance(current_user, User):
                user_type = 'user'
        
        return {
            'current_user_type': user_type,
            'now': datetime.now()
        }

    # Глобальные маршруты
    @app.route('/')
    def index():
        """Главная страница - редирект в зависимости от типа пользователя"""
        if not current_user.is_authenticated:
            return redirect('/public/')
        
        if isinstance(current_user, Admin):
            return redirect('/admin/dashboard')
        elif isinstance(current_user, Employer):
            return redirect('/employer/dashboard')
        else:
            return redirect('/user/dashboard')

    @app.route('/health')
    def health_check():
        """Проверка состояния сервиса"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0.0'
        })

    @app.route('/api/stats')
    def public_stats():
        """Публичная статистика для главной страницы"""
        from sqlalchemy import func
        from db_models import Vacancy, Application, VacancyStatus
        
        try:
            # Статистика вакансий
            total_vacancies = db.session.query(func.count(Vacancy.id)).filter(
                Vacancy.status == VacancyStatus.ACTIVE
            ).scalar() or 0
            
            # Статистика откликов за последний месяц
            month_ago = datetime.now() - timedelta(days=30)
            monthly_applications = db.session.query(func.count(Application.id)).filter(
                Application.created_at >= month_ago
            ).scalar() or 0
            
            # Статистика работодателей
            active_employers = db.session.query(func.count(Employer.id)).filter(
                Employer.is_active == True
            ).scalar() or 0
            
            # Популярные города
            popular_cities = db.session.query(
                Vacancy.city,
                func.count(Vacancy.id).label('count')
            ).filter(
                Vacancy.status == VacancyStatus.ACTIVE
            ).group_by(
                Vacancy.city
            ).order_by(
                func.count(Vacancy.id).desc()
            ).limit(5).all()
            
            return jsonify({
                'total_vacancies': total_vacancies,
                'monthly_applications': monthly_applications,
                'active_employers': active_employers,
                'popular_cities': [{'city': city, 'count': count} for city, count in popular_cities]
            })
            
        except Exception as e:
            app.logger.error(f"Error getting public stats: {str(e)}")
            return jsonify({
                'total_vacancies': 0,
                'monthly_applications': 0,
                'active_employers': 0,
                'popular_cities': []
            })

    # Обработчики ошибок
    @app.errorhandler(404)
    def not_found_error(error):
        """Обработчик ошибки 404"""
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Endpoint not found'}), 404
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        """Обработчик ошибки 500"""
        db.session.rollback()
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Internal server error'}), 500
        return render_template('errors/500.html'), 500

    @app.errorhandler(403)
    def forbidden_error(error):
        """Обработчик ошибки 403"""
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Access forbidden'}), 403
        return render_template('errors/403.html'), 403

    # Before request handlers
    @app.before_request
    def update_last_activity():
        """Обновление времени последней активности пользователя"""
        if current_user.is_authenticated:
            current_user.last_activity = datetime.now()
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                app.logger.error(f"Error updating last activity: {str(e)}")

    @app.before_request
    def check_subscription():
        """Проверка активности подписки для работодателей"""
        if (current_user.is_authenticated and 
            isinstance(current_user, Employer) and
            request.endpoint and 
            request.endpoint.startswith('employer.')):
            
            # Проверяем активность подписки
            if (current_user.subscription_end and 
                current_user.subscription_end < datetime.now()):
                # Подписка истекла - переводим на бесплатный тариф
                from db_models import SubscriptionTier
                current_user.subscription_tier = SubscriptionTier.FREE
                current_user.vacancies_limit = 1
                try:
                    db.session.commit()
                except Exception:
                    db.session.rollback()

    # Регистрация Blueprint'ов
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(employer_bp, url_prefix='/employer')
    # app.register_blueprint(admin_bp, url_prefix='/admin')    # Создать отдельно
    # app.register_blueprint(api_bp, url_prefix='/api')        # Создать отдельно
    # app.register_blueprint(public_bp, url_prefix='/public')  # Создать отдельно

    # Инициализация базы данных при первом запуске
    @app.before_first_request
    def initialize_database():
        """Инициализация БД при первом запуске"""
        try:
            init_database()
            app.logger.info("Database initialized successfully")
        except Exception as e:
            app.logger.error(f"Error initializing database: {str(e)}")

    return app

# Создание экземпляра приложения
app = create_app()

if __name__ == '__main__':
    # Создание папок для загрузки файлов
    create_upload_folders()
    
    # Запуск приложения
    app.run(
        debug=app.config.get('DEBUG', False),
        host=app.config.get('HOST', '0.0.0.0'),
        port=app.config.get('PORT', 5000)
    )