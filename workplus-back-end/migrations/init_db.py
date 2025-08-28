"""
Скрипт инициализации базы данных WorkPlus.kz
Создает все таблицы и заполняет их начальными данными
"""

from flask import Flask
from flask_migrate import Migrate, init, migrate, upgrade
import os
import sys

# Добавляем корневую директорию проекта в путь
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db_models import ApplicationStatus, db, init_database
from config import get_config

def create_app():
    """Создание приложения для миграций"""
    app = Flask(__name__)
    config_class = get_config()
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate = Migrate(app, db)
    
    return app, migrate

def init_migrations():
    """Инициализация системы миграций"""
    app, migrate = create_app()
    
    with app.app_context():
        # Проверяем, существует ли папка миграций
        if not os.path.exists('migrations'):
            print("Инициализация миграций...")
            init()
            print("✓ Миграции инициализированы")
        
        # Создаем первую миграцию
        print("Создание миграции...")
        migrate('Initial migration')
        print("✓ Миграция создана")
        
        # Применяем миграции
        print("Применение миграций...")
        upgrade()
        print("✓ Миграции применены")
        
        # Заполняем начальными данными
        print("Заполнение начальными данными...")
        init_database()
        print("✓ Начальные данные добавлены")

def create_test_data():
    """Создание тестовых данных для разработки"""
    app, _ = create_app()
    
    with app.app_context():
        from db_models import (
            User, Employer, Vacancy, VacancyCategory, Skill, 
            UserSkill, VacancySkill, Application, Test, TestQuestion,
            SubscriptionTier, VacancyStatus
        )
        from datetime import datetime, timedelta
        import random
        
        print("Создание тестовых данных...")
        
        # Создаем тестового работодателя
        if not Employer.query.filter_by(email='test@workplus.kz').first():
            employer = Employer(
                email='test@workplus.kz',
                phone='+77001234567',
                company_name='ТОО "Тестовая Компания"',
                company_description='Инновационная IT-компания в Казахстане',
                contact_person='Иван Петров',
                city='Алматы',
                industry='Информационные технологии',
                company_size='51-200',
                subscription_tier=SubscriptionTier.GROWTH,
                subscription_start=datetime.now() - timedelta(days=30),
                subscription_end=datetime.now() + timedelta(days=335),
                vacancies_limit=15,
                is_verified=True,
                is_active=True
            )
            employer.set_password('password123')
            db.session.add(employer)
            db.session.flush()
            
            # Создаем тестовые вакансии
            categories = VacancyCategory.query.all()
            skills = Skill.query.all()
            
            vacancy_templates = [
                {
                    'title': 'Python разработчик',
                    'description': 'Ищем опытного Python разработчика для работы над веб-приложениями',
                    'requirements': 'Опыт работы с Python, Django/Flask, PostgreSQL',
                    'salary_from': 300000,
                    'salary_to': 500000,
                    'employment_type': 'full_time',
                    'experience_required': 2
                },
                {
                    'title': 'Frontend разработчик',
                    'description': 'Требуется frontend разработчик для создания современных веб-интерфейсов',
                    'requirements': 'React, TypeScript, HTML5, CSS3, опыт с REST API',
                    'salary_from': 250000,
                    'salary_to': 400000,
                    'employment_type': 'full_time',
                    'experience_required': 1
                },
                {
                    'title': 'Менеджер по продажам',
                    'description': 'Активный менеджер по продажам IT-услуг',
                    'requirements': 'Опыт активных продаж, знание английского языка',
                    'salary_from': 200000,
                    'salary_to': 350000,
                    'employment_type': 'full_time',
                    'experience_required': 1
                },
                {
                    'title': 'Курьер',
                    'description': 'Требуется курьер для доставки документов по городу',
                    'requirements': 'Наличие личного транспорта, пунктуальность',
                    'salary_from': 120000,
                    'salary_to': 180000,
                    'employment_type': 'full_time',
                    'experience_required': 0
                },
                {
                    'title': 'Бухгалтер',
                    'description': 'Ведение бухгалтерского учета, работа с 1С',
                    'requirements': '1С:Бухгалтерия, опыт работы от 2 лет, высшее образование',
                    'salary_from': 180000,
                    'salary_to': 250000,
                    'employment_type': 'full_time',
                    'experience_required': 2
                }
            ]
            
            for i, vacancy_data in enumerate(vacancy_templates):
                vacancy = Vacancy(
                    title=vacancy_data['title'],
                    description=vacancy_data['description'],
                    requirements=vacancy_data['requirements'],
                    salary_from=vacancy_data['salary_from'],
                    salary_to=vacancy_data['salary_to'],
                    employment_type=vacancy_data['employment_type'],
                    experience_required=vacancy_data['experience_required'],
                    city='Алматы',
                    category_id=categories[i % len(categories)].id if categories else None,
                    employer_id=employer.id,
                    status=VacancyStatus.ACTIVE,
                    published_at=datetime.now() - timedelta(days=random.randint(1, 30)),
                    views_count=random.randint(10, 200),
                    applications_count=random.randint(0, 20)
                )
                db.session.add(vacancy)
                db.session.flush()
                
                # Добавляем требуемые навыки для вакансии
                if skills and len(skills) > 3:
                    for skill in random.sample(skills, 3):
                        vacancy_skill = VacancySkill(
                            vacancy_id=vacancy.id,
                            skill_id=skill.id,
                            required_level=random.randint(2, 4),
                            is_required=random.choice([True, False])
                        )
                        db.session.add(vacancy_skill)
        
        # Создаем тестовых пользователей (соискателей)
        user_templates = [
            {
                'email': 'user1@example.com',
                'full_name': 'Анна Смирнова',
                'city': 'Алматы',
                'experience_years': 3,
                'bio': 'Python разработчик с опытом работы в веб-разработке'
            },
            {
                'email': 'user2@example.com', 
                'full_name': 'Максим Иванов',
                'city': 'Нур-Султан',
                'experience_years': 1,
                'bio': 'Junior Frontend разработчик, изучаю React'
            },
            {
                'email': 'user3@example.com',
                'full_name': 'Елена Казакова',
                'city': 'Шымкент',
                'experience_years': 5,
                'bio': 'Опытный бухгалтер, работаю с 1С более 5 лет'
            }
        ]
        
        for user_data in user_templates:
            if not User.query.filter_by(email=user_data['email']).first():
                user = User(
                    email=user_data['email'],
                    phone=f"+7700{random.randint(1000000, 9999999)}",
                    full_name=user_data['full_name'],
                    city=user_data['city'],
                    experience_years=user_data['experience_years'],
                    bio=user_data['bio'],
                    desired_salary_from=random.randint(150000, 300000),
                    desired_salary_to=random.randint(300000, 500000),
                    is_verified=True,
                    is_active=True
                )
                user.set_password('password123')
                db.session.add(user)
                db.session.flush()
                
                # Добавляем навыки пользователю
                if skills and len(skills) > 2:
                    for skill in random.sample(skills, random.randint(2, 5)):
                        user_skill = UserSkill(
                            user_id=user.id,
                            skill_id=skill.id,
                            level=random.randint(2, 5),
                            years_experience=random.randint(0, user.experience_years),
                            is_verified=random.choice([True, False])
                        )
                        db.session.add(user_skill)
                
                # Создаем несколько откликов от каждого пользователя
                vacancies = Vacancy.query.filter_by(status=VacancyStatus.ACTIVE).all()
                if vacancies:
                    for vacancy in random.sample(vacancies, min(3, len(vacancies))):
                        application = Application(
                            user_id=user.id,
                            vacancy_id=vacancy.id,
                            status=random.choice(list(ApplicationStatus)),
                            cover_letter=f"Здравствуйте! Меня заинтересовала ваша вакансия {vacancy.title}. У меня есть подходящий опыт...",
                            created_at=datetime.now() - timedelta(days=random.randint(1, 15))
                        )
                        db.session.add(application)
        
        # Создаем тестовые вопросы для тестов
        tests = Test.query.all()
        for test in tests:
            if not test.questions:
                # Добавляем примеры вопросов для теста русского языка
                if 'русского языка' in test.title.lower():
                    questions_data = [
                        {
                            'text': 'Выберите правильное написание слова:',
                            'type': 'single_choice',
                            'options': '["прийти", "придти", "прити", "прийдти"]',
                            'correct': '["прийти"]'
                        },
                        {
                            'text': 'В каком случае НЕ пишется раздельно?',
                            'type': 'single_choice',
                            'options': '["(не)законченная работа", "(не)решенная задача", "(не)высокий рост", "(не)красивый поступок"]',
                            'correct': '["(не)высокий рост"]'
                        },
                        {
                            'text': 'Укажите предложение без ошибок:',
                            'type': 'single_choice',
                            'options': '["Более лучший вариант", "Самый наилучший способ", "Более хороший вариант", "Наиболее лучший метод"]',
                            'correct': '["Более хороший вариант"]'
                        }
                    ]
                elif 'стрессоустойчивость' in test.title.lower():
                    questions_data = [
                        {
                            'text': 'Как вы обычно реагируете на критику?',
                            'type': 'single_choice', 
                            'options': '["Принимаю к сведению и анализирую", "Обижаюсь и расстраиваюсь", "Игнорирую полностью", "Начинаю спорить и защищаться"]',
                            'correct': '["Принимаю к сведению и анализирую"]'
                        },
                        {
                            'text': 'У вас сжатые сроки на важный проект. Ваши действия:',
                            'type': 'single_choice',
                            'options': '["Составляю четкий план и следую ему", "Паникую и не знаю с чего начать", "Откладываю до последнего момента", "Прошу перенести сроки"]',
                            'correct': '["Составляю четкий план и следую ему"]'
                        }
                    ]
                else:
                    # Общие вопросы для других тестов
                    questions_data = [
                        {
                            'text': f'Тестовый вопрос для {test.title}',
                            'type': 'single_choice',
                            'options': '["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"]',
                            'correct': '["Вариант 1"]'
                        }
                    ]
                
                for i, q_data in enumerate(questions_data):
                    question = TestQuestion(
                        test_id=test.id,
                        question_text=q_data['text'],
                        question_type=q_data['type'],
                        options=q_data['options'],
                        correct_answers=q_data['correct'],
                        points=1,
                        order_number=i + 1
                    )
                    db.session.add(question)
                
                # Обновляем количество вопросов в тесте
                test.questions_count = len(questions_data)
        
        db.session.commit()
        print("✓ Тестовые данные созданы")

def reset_database():
    """Полный сброс базы данных"""
    app, _ = create_app()
    
    with app.app_context():
        print("⚠️  ВНИМАНИЕ: Это удалит ВСЕ данные из базы!")
        confirm = input("Вы уверены? Введите 'YES' для подтверждения: ")
        
        if confirm == 'YES':
            print("Удаление всех таблиц...")
            db.drop_all()
            print("✓ Таблицы удалены")
            
            print("Создание таблиц...")
            db.create_all()
            print("✓ Таблицы созданы")
            
            print("Заполнение начальными данными...")
            init_database()
            print("✓ Начальные данные добавлены")
            
            create_test_data()
        else:
            print("Операция отменена")

def backup_database():
    """Создание резервной копии базы данных"""
    import subprocess
    from datetime import datetime
    
    app, _ = create_app()
    
    with app.app_context():
        db_url = app.config['SQLALCHEMY_DATABASE_URI']
        
        if db_url.startswith('postgresql'):
            # PostgreSQL backup
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_file = f"backup_workplus_{timestamp}.sql"
            
            try:
                # Извлекаем данные подключения из URL
                # postgresql://user:pass@host:port/dbname
                import re
                match = re.match(r'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', db_url)
                if match:
                    user, password, host, port, dbname = match.groups()
                    
                    env = {'PGPASSWORD': password}
                    cmd = [
                        'pg_dump',
                        '-h', host,
                        '-p', port,
                        '-U', user,
                        '-d', dbname,
                        '-f', backup_file
                    ]
                    
                    subprocess.run(cmd, env=env, check=True)
                    print(f"✓ Резервная копия создана: {backup_file}")
                else:
                    print("❌ Не удалось распарсить URL базы данных")
                    
            except subprocess.CalledProcessError as e:
                print(f"❌ Ошибка создания резервной копии: {e}")
        else:
            print("⚠️  Резервное копирование поддерживается только для PostgreSQL")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Использование:")
        print("  python init_db.py init     - Инициализация БД и миграций")
        print("  python init_db.py testdata - Создание тестовых данных")
        print("  python init_db.py reset    - Полный сброс БД")
        print("  python init_db.py backup   - Создание резервной копии")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'init':
        init_migrations()
    elif command == 'testdata':
        create_test_data()
    elif command == 'reset':
        reset_database()
    elif command == 'backup':
        backup_database()
    else:
        print(f"❌ Неизвестная команда: {command}")
        sys.exit(1)