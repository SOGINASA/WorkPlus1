from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config
from models import db, User, Job, Company, JobApplication
from flask_jwt_extended.exceptions import JWTExtendedException
from werkzeug.exceptions import HTTPException

# Инициализация расширений
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=['http://localhost:3000','https://workplus-one.vercel.app'],
        allow_headers=['Content-Type', 'Authorization'],
        methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

    # Инициализация расширений
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Регистрация blueprints
    from routes.auth import auth_bp
    # from routes.admin_auth import admin_auth_bp
    from routes.jobs import jobs_bp
    # from routes.companies import companies_bp
    # from routes.applications import applications_bp
    # from routes.users import users_bp
    # from routes.analytics import analytics_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    # app.register_blueprint(admin_auth_bp, url_prefix='/api/admin/auth')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    # app.register_blueprint(companies_bp, url_prefix='/api/companies')
    # app.register_blueprint(applications_bp, url_prefix='/api/applications')
    # app.register_blueprint(users_bp, url_prefix='/api/users')
    # app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

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
                'companies': '/api/companies',
                'applications': '/api/applications',
                'users': '/api/users',
                'admin': '/api/admin'
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

def seed_admins():
    """Создание тестовых администраторов"""
    if User.query.filter_by(user_type='admin').first():
        # print(User.query.filter_by(user_type='admin'))
        print("Тестовые администраторы уже существуют")
        return


    # Обычный администратор
    admin = User(
        name='Администратор Аддминистратович',
        email='hr@workplus.kz',
        user_type='admin'
    )
    admin.set_password('admin123')
    db.session.add(admin)

    try:
        db.session.commit()
        print("Тестовые администраторы созданы:")
        print("- hr@workplus.kz / admin123 (админ)")
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка при создании админов: {e}")

def seed_test_data():
    """Создание тестовых данных"""
    try:
        # Проверяем есть ли уже данные
        if Company.query.count() > 0:
            print("Тестовые данные уже существуют")
            return

        # Создаем тестовую компанию
        company = Company(
            name='ТОО "Казахстан Девелопмент"',
            description='Крупная строительная компания с 15-летним опытом работы в Казахстане',
            industry='Строительство',
            city='Алматы',
            website='https://kz-dev.kz',
            phone='+7 727 123 4567',
            email='info@kz-dev.kz',
            size='51-100',
            is_verified=True
        )
        db.session.add(company)
        db.session.flush()  # Получаем ID компании

        # Создаем тестового пользователя-работодателя
        employer = User(
            email='employer@kz-dev.kz',
            name='Анна Иванова',
            phone='+7 727 123 4567',
            user_type='employer',
            company_id=company.id,
            is_verified=True
        )
        employer.set_password('employer123')
        db.session.add(employer)

        # Создаем тестового пользователя-соискателя
        candidate = User(
            email='candidate@gmail.com',
            name='Алексей Петров',
            phone='+7 701 234 5678',
            user_type='candidate',
            city='Алматы',
            is_verified=True
        )
        candidate.set_password('candidate123')
        db.session.add(candidate)
        db.session.flush()

        # Создаем тестовые вакансии
        jobs_data = [
            {
                'title': 'Frontend разработчик (React)',
                'description': '''Мы ищем опытного Frontend разработчика для работы над современными веб-приложениями.

Обязанности:
• Разработка пользовательских интерфейсов на React
• Интеграция с REST API
• Оптимизация производительности приложений
• Код-ревью и менторинг

Требования:
• Опыт работы с React 3+ года
• Знание TypeScript, Redux, Next.js
• Опыт работы с Tailwind CSS
• Понимание современных инструментов разработки''',
                'category': 'IT',
                'employment_type': 'full_time',
                'experience_level': 'middle',
                'salary_min': 800000,
                'salary_max': 1200000,
                'city': 'Алматы',
                'remote_work': True,
                'skills': 'React,TypeScript,Redux,Tailwind CSS,Git'
            },
            {
                'title': 'Менеджер по продажам',
                'description': '''Приглашаем активного менеджера по продажам в команду лидеров рынка.

Обязанности:
• Поиск и привлечение новых клиентов
• Ведение переговоров и заключение сделок
• Работа с существующей клиентской базой
• Достижение KPI по продажам

Требования:
• Опыт в продажах от 2 лет
• Коммуникативные навыки
• Знание казахского и русского языков
• Готовность к командировкам''',
                'category': 'Продажи',
                'employment_type': 'full_time',
                'experience_level': 'middle',
                'salary_min': 300000,
                'salary_max': 500000,
                'city': 'Алматы',
                'remote_work': False,
                'skills': 'Продажи,CRM,Переговоры,B2B'
            },
            {
                'title': 'Официант/Официантка',
                'description': '''Кафе "Арман" приглашает официантов для работы в дружной команде.

Обязанности:
• Обслуживание клиентов
• Прием заказов
• Подача блюд
• Поддержание чистоты зала

Требования:
• Опыт работы приветствуется
• Коммуникабельность
• Аккуратность
• График работы 2/2''',
                'category': 'Общепит',
                'employment_type': 'part_time',
                'experience_level': 'junior',
                'salary_min': 150000,
                'salary_max': 200000,
                'city': 'Алматы',
                'remote_work': False,
                'skills': 'Клиентский сервис,Работа в команде'
            }
        ]

        for job_data in jobs_data:
            job = Job(
                company_id=company.id,
                posted_by=employer.id,
                **job_data
            )
            db.session.add(job)

        # Создаем тестовый отклик
        db.session.flush()
        first_job = Job.query.first()

        application = JobApplication(
            job_id=first_job.id,
            candidate_id=candidate.id,
            cover_letter='Здравствуйте! Меня заинтересовала ваша вакансия Frontend разработчика. У меня есть опыт работы с React и TypeScript. Буду рад обсудить детали.',
            status='pending'
        )
        db.session.add(application)

        db.session.commit()
        print("✅ Тестовые данные созданы:")
        print("- Компания: ТОО Казахстан Девелопмент")
        print("- Работодатель: employer@kz-dev.kz / employer123")
        print("- Соискатель: candidate@gmail.com / candidate123")
        print("- 3 тестовые вакансии")
        print("- 1 тестовый отклик")

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка при создании тестовых данных: {e}")

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
    seed_admins()
    seed_test_data()
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
        seed_admins()
        seed_test_data()
    app.run(debug=True, host="0.0.0.0", port=5000)