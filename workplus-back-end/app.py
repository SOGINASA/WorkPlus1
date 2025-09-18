from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config
from models import db, User, Job, Company, JobApplication
from seed_data import seed_all
from flask_jwt_extended.exceptions import JWTExtendedException
from werkzeug.exceptions import HTTPException

# Инициализация расширений
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:3000", "https://workplus-fork.vercel.app"]
        )

    # Инициализация расширений
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Регистрация blueprints
    from routes import (
        auth_bp,
        jobs_bp,
        employer_bp,
        companies_bp,
        notifications_bp,
        profile_bp,
        contact_bp,
        resume_bp, 
        admin_users_bp,
        admin_user_list_bp,
        admin_employer_bp,
        user_profile_bp
    )



    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(employer_bp, url_prefix='/api/employer')
    app.register_blueprint(companies_bp, url_prefix='/api/companies')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(contact_bp, url_prefix='/api/contact')
    app.register_blueprint(resume_bp, url_prefix='/api/resumes')
    app.register_blueprint(admin_users_bp, url_prefix='/api/admin')
    app.register_blueprint(admin_user_list_bp, url_prefix='/api/admin/user_list')
    app.register_blueprint(admin_employer_bp, url_prefix="/api/admin/employers")
    app.register_blueprint(user_profile_bp, url_prefix="/api/admin/user_profile")

    # Главная страница API
    @app.route('/api')
    def api_info():
        return jsonify({
            'message': 'WorkPlus.kz API',
            'version': '1.0.0',
            'description': 'HR-экосистема с мультиканальной дистрибуцией для Казахстана',
            'endpoints': {
                'auth': '/api/auth',
                'jobs': '/api/jobs',
            },
            'features': [
                'Размещение вакансий',
                'Поиск работы',
                'Мультиканальная публикация',
                'Скоринг кандидатов',
                'Аналитика',
                'Социальные сети интеграция'
            ]
        })

    return app


app = create_app()

# Обработчики ошибок
@app.errorhandler(422)
def handle_unprocessable_entity(err):
    return jsonify({'error': 'Validation error', 'message': str(err)}), 422

@app.errorhandler(JWTExtendedException)
def handle_jwt_error(e):
    return jsonify({'error': 'JWT Error', 'message': str(e)}), 401

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    return jsonify({'error': e.code, 'message': e.description}), e.code

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Токен истек'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'error': 'Недействительный токен'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'error': 'Требуется авторизация'}), 401

# CLI команды
@app.cli.command()
def init_db():
    """Инициализация базы данных с тестовыми данными"""
    print("🚀 Инициализация базы данных...")
    db.create_all()
    seed_all()
    print("✅ База данных инициализирована!")

@app.cli.command()
def create_admin():
    """Создать администратора"""
    email = input("Email администратора: ")
    password = input("Пароль: ")
    name = input("Имя: ")


    if User.query.filter_by(email=email).first():
        print("❌ Пользователь с таким email уже существует")
        return

    admin = User(name=name, email=email, user_type='admin')
    admin.set_password(password)

    db.session.add(admin)
    db.session.commit()

    print(f"✅ Администратор {email} создан")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_all()
    app.run(debug=True, host="0.0.0.0", port=5000)