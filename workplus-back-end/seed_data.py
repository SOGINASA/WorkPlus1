from models import *
from datetime import datetime, date, timedelta
import json
import random

def seed_admins():
    """Создание тестовых администраторов"""
    if User.query.filter_by(user_type='admin').first():
        print("Тестовые администраторы уже существуют")
        return

    # Суперадмин
    super_admin = User(
        name='Суперадмин Админович',
        email='super@workplus.kz',
        user_type='admin',
        city='Петропавловск',
        is_verified=True,
        is_active=True
    )
    super_admin.set_password('super123')
    db.session.add(super_admin)

    # Обычный администратор
    admin = User(
        name='Администратор Модераторович',
        email='admin@workplus.kz',
        user_type='admin',
        city='Алматы',
        is_verified=True,
        is_active=True
    )
    admin.set_password('admin123')
    db.session.add(admin)

    try:
        db.session.commit()
        print("✅ Тестовые администраторы созданы:")
        print("- super@workplus.kz / super123 (суперадмин)")
        print("- admin@workplus.kz / admin123 (админ)")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Ошибка при создании админов: {e}")

def seed_companies():
    """Создание тестовых компаний"""
    if Company.query.count() > 0:
        print("Тестовые компании уже существуют")
        return

    companies_data = [
        {
            'name': 'ТОО "Цифровые Решения КЗ"',
            'description': 'Ведущая IT-компания Казахстана, специализирующаяся на разработке веб-приложений и мобильных решений. Более 8 лет успешной работы.',
            'industry': 'Информационные технологии',
            'city': 'Алматы',
            'size': '51-100',
            'founded_year': 2016,
            'website': 'https://digital-kz.com',
            'email': 'hr@digital-kz.com',
            'phone': '+7 727 123 4567',
            'address': 'ул. Абая, 150/230, офис 45',
            'contact_name': 'Айжан Серикова',
            'contact_position': 'HR менеджер',
            'contact_phone': '+7 701 234 5678',
            'contact_email': 'aitzan@digital-kz.com',
            'instagram': 'digital_kz',
            'telegram': 'digital_kz_jobs',
            'is_verified': True,
            'is_public': True,
            'rating': 4.5
        },
        {
            'name': 'ТОО "АлматыРетейл"',
            'description': 'Сеть супермаркетов "Дастархан" - крупнейшая розничная сеть Южного Казахстана. Развиваем отечественную торговлю и создаем рабочие места.',
            'industry': 'Розничная торговля',
            'city': 'Алматы',
            'size': '500+',
            'founded_year': 2010,
            'website': 'https://dasarkhan.kz',
            'email': 'jobs@dasarkhan.kz',
            'phone': '+7 727 789 0123',
            'address': 'пр. Назарбаева, 223',
            'contact_name': 'Марат Жанузаков',
            'contact_position': 'Руководитель отдела персонала',
            'contact_phone': '+7 705 987 6543',
            'contact_email': 'marat.z@dasarkhan.kz',
            'instagram': 'dasarkhan_kz',
            'facebook': 'DasarkhanKZ',
            'is_verified': True,
            'is_public': True,
            'rating': 4.2
        },
        {
            'name': 'ИП "КафеУют"',
            'description': 'Уютное семейное кафе в центре Петропавловска. Домашняя кухня, приятная атмосфера, дружный коллектив.',
            'industry': 'Общепит',
            'city': 'Петропавловск',
            'size': '11-50',
            'founded_year': 2020,
            'website': 'https://cafeuyut.kz',
            'email': 'info@cafeuyut.kz',
            'phone': '+7 7152 45 67 89',
            'address': 'ул. Конституции, 35',
            'contact_name': 'Гульнара Айтбаева',
            'contact_position': 'Управляющая',
            'contact_phone': '+7 777 123 4567',
            'contact_email': 'gulnara@cafeuyut.kz',
            'instagram': 'cafe_uyut_ptf',
            'is_verified': True,
            'is_public': True,
            'rating': 4.7
        },
        {
            'name': 'ТОО "КостанайСтрой"',
            'description': 'Строительная компания полного цикла. Строим жилые комплексы, торговые центры, промышленные объекты по всему Северному Казахстану.',
            'industry': 'Строительство',
            'city': 'Костанай',
            'size': '101-500',
            'founded_year': 2012,
            'website': 'https://kostanaystroi.kz',
            'email': 'hr@kostanaystroi.kz',
            'phone': '+7 7142 55 66 77',
            'address': 'ул. Байтурсынова, 124А',
            'contact_name': 'Владимир Сидоров',
            'contact_position': 'Специалист по кадрам',
            'contact_phone': '+7 707 888 9999',
            'contact_email': 'vladimir.s@kostanaystroi.kz',
            'telegram': 'kostanaystroi_jobs',
            'is_verified': True,
            'is_public': True,
            'rating': 4.0
        },
        {
            'name': 'ТОО "АктауНефтеГаз"',
            'description': 'Нефтегазовая компания, работающая на Каспийском шельфе. Современное оборудование, высокие стандарты безопасности.',
            'industry': 'Нефть и газ',
            'city': 'Актау',
            'size': '101-500',
            'founded_year': 2008,
            'website': 'https://aktau-oil.kz',
            'email': 'careers@aktau-oil.kz',
            'phone': '+7 7292 40 50 60',
            'address': 'мкр. Промышленный, 15',
            'contact_name': 'Жанна Омарова',
            'contact_position': 'HR директор',
            'contact_phone': '+7 701 555 7777',
            'contact_email': 'zhanna.o@aktau-oil.kz',
            'linkedin': 'aktau-neftegas',
            'is_verified': True,
            'is_public': True,
            'rating': 4.3
        }
    ]

    for company_data in companies_data:
        company = Company(**company_data)
        db.session.add(company)

    try:
        db.session.commit()
        print(f"✅ Создано {len(companies_data)} тестовых компаний")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Ошибка при создании компаний: {e}")

def seed_users():
    """Создание тестовых пользователей"""
    if User.query.filter_by(user_type='employer').first():
        print("Тестовые пользователи уже существуют")
        return

    companies = Company.query.all()
    if not companies:
        print("❌ Сначала создайте компании")
        return

    # Работодатели
    employers_data = [
        {
            'name': 'Айжан Серикова',
            'email': 'aitzhan@digital-kz.com',
            'phone': '+7 701 234 5678',
            'city': 'Алматы',
            'user_type': 'employer',
            'company_id': companies[0].id,
            'position': 'HR менеджер',
            'password': 'employer123'
        },
        {
            'name': 'Марат Жанузаков',
            'email': 'marat.z@dasarkhan.kz',
            'phone': '+7 705 987 6543',
            'city': 'Алматы',
            'user_type': 'employer',
            'company_id': companies[1].id,
            'position': 'Руководитель отдела персонала',
            'password': 'employer123'
        },
        {
            'name': 'Гульнара Айтбаева',
            'email': 'gulnara@cafeuyut.kz',
            'phone': '+7 777 123 4567',
            'city': 'Петропавловск',
            'user_type': 'employer',
            'company_id': companies[2].id,
            'position': 'Управляющая',
            'password': 'employer123'
        }
    ]

    # Соискатели
    candidates_data = [
        {
            'name': 'Данияр Аскаров',
            'email': 'daniyar.askarov@gmail.com',
            'phone': '+7 707 111 2233',
            'city': 'Алматы',
            'user_type': 'candidate',
            'birth_date': date(1995, 3, 15),
            'gender': 'male',
            'education_level': 'Высшее',
            'experience_years': 5,
            'password': 'candidate123'
        },
        {
            'name': 'Асель Нурланова',
            'email': 'assel.nurlanova@mail.ru',
            'phone': '+7 701 444 5566',
            'city': 'Алматы',
            'user_type': 'candidate',
            'birth_date': date(1992, 7, 22),
            'gender': 'female',
            'education_level': 'Высшее',
            'experience_years': 3,
            'password': 'candidate123'
        },
        {
            'name': 'Ерлан Молдагалиев',
            'email': 'erlan.m@yandex.kz',
            'phone': '+7 775 777 8899',
            'city': 'Петропавловск',
            'user_type': 'candidate',
            'birth_date': date(2000, 11, 8),
            'gender': 'male',
            'education_level': 'Среднее специальное',
            'experience_years': 1,
            'password': 'candidate123'
        },
        {
            'name': 'Динара Жумабекова',
            'email': 'dinara.zh@gmail.com',
            'phone': '+7 702 333 4455',
            'city': 'Костанай',
            'user_type': 'candidate',
            'birth_date': date(1988, 5, 12),
            'gender': 'female',
            'education_level': 'Высшее',
            'experience_years': 8,
            'password': 'candidate123'
        },
        {
            'name': 'Бауржан Смагулов',
            'email': 'baurzhan.s@mail.kz',
            'phone': '+7 708 666 7788',
            'city': 'Актау',
            'user_type': 'candidate',
            'birth_date': date(1990, 1, 25),
            'gender': 'male',
            'education_level': 'Высшее',
            'experience_years': 6,
            'password': 'candidate123'
        }
    ]

    # Создаем работодателей
    for employer_data in employers_data:
        password = employer_data.pop('password')
        user = User(**employer_data)
        user.set_password(password)
        user.is_verified = True
        user.is_active = True
        db.session.add(user)

    # Создаем соискателей
    for candidate_data in candidates_data:
        password = candidate_data.pop('password')
        user = User(**candidate_data)
        user.set_password(password)
        user.is_verified = True
        user.is_active = True
        db.session.add(user)

    try:
        db.session.commit()
        print(f"✅ Создано {len(employers_data)} работодателей и {len(candidates_data)} соискателей")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Ошибка при создании пользователей: {e}")

def seed_jobs():
    """Создание тестовых вакансий"""
    if Job.query.count() > 0:
        print("Тестовые вакансии уже существуют")
        return

    companies = Company.query.all()
    employers = User.query.filter_by(user_type='employer').all()
    
    if not companies or not employers:
        print("❌ Сначала создайте компании и пользователей")
        return

    jobs_data = [
        # IT вакансии
        {
            'title': 'Frontend разработчик (React/Vue)',
            'description': 'Ищем опытного Frontend разработчика для работы над современными веб-приложениями.\n\nОбязанности:\n• Разработка пользовательских интерфейсов на React/Vue\n• Интеграция с REST API и GraphQL\n• Оптимизация производительности приложений\n• Код-ревью и менторинг джунов\n• Участие в техническом планировании\n\nТребования:\n• Опыт работы с React/Vue 3+ года\n• Знание TypeScript, Redux/Vuex\n• Опыт работы с современными инструментами сборки\n• Понимание принципов UX/UI',
            'requirements': ['React/Vue 3+ года', 'TypeScript', 'Redux/Vuex', 'REST API', 'Git'],
            'responsibilities': ['Разработка UI', 'Интеграция API', 'Код-ревью', 'Менторинг'],
            'benefits': ['ДМС', 'Гибкий график', 'Удаленная работа', 'Обучение', 'Корпоративы'],
            'category': 'IT',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 800000,
            'salary_max': 1200000,
            'city': 'Алматы',
            'remote_work': True,
            'skills': json.dumps(['React', 'Vue.js', 'TypeScript', 'Redux', 'Vuex', 'REST API', 'Git'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Русский', 'level': 'native'}, {'name': 'Английский', 'level': 'intermediate'}], ensure_ascii=False),
            'education_required': 'Высшее',
            'company_id': companies[0].id,
            'posted_by': employers[0].id,
            'is_featured': True,
            'publish_to_instagram': True,
            'publish_to_telegram': True
        },
        {
            'title': 'Backend разработчик (Python/Django)',
            'description': 'Приглашаем Backend разработчика для развития нашей платформы.\n\nОбязанности:\n• Разработка серверной логики на Python/Django\n• Проектирование и оптимизация баз данных\n• Интеграция с внешними API\n• Написание тестов и документации\n• Деплой и мониторинг приложений\n\nТребования:\n• Опыт с Python/Django 2+ года\n• Знание PostgreSQL, Redis\n• Опыт работы с Docker, CI/CD\n• Понимание принципов REST API',
            'requirements': ['Python/Django 2+ года', 'PostgreSQL', 'Redis', 'Docker', 'REST API'],
            'responsibilities': ['Backend разработка', 'Проектирование БД', 'API интеграция', 'Тестирование'],
            'benefits': ['ДМС', 'Гибкий график', 'Удаленная работа', 'Курсы'],
            'category': 'IT',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 700000,
            'salary_max': 1000000,
            'city': 'Алматы',
            'remote_work': True,
            'skills': json.dumps(['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker', 'REST API'], ensure_ascii=False),
            'education_required': 'Высшее',
            'company_id': companies[0].id,
            'posted_by': employers[0].id
        },
        
        # Продажи и торговля
        {
            'title': 'Продавец-консультант',
            'description': 'Сеть магазинов "Дастархан" приглашает продавцов-консультантов.\n\nОбязанности:\n• Консультирование покупателей\n• Работа с кассой\n• Выкладка товара\n• Контроль остатков\n• Поддержание порядка в торговом зале\n\nТребования:\n• Опыт в торговле приветствуется\n• Коммуникабельность\n• Ответственность\n• Знание казахского и русского языков',
            'requirements': ['Опыт в торговле желателен', 'Коммуникабельность', 'Знание языков'],
            'responsibilities': ['Консультирование', 'Работа с кассой', 'Выкладка товара'],
            'benefits': ['Официальное трудоустройство', 'Соцпакет', 'Скидки сотрудникам'],
            'category': 'Продажи',
            'employment_type': 'full_time',
            'experience_level': 'junior',
            'salary_min': 180000,
            'salary_max': 220000,
            'city': 'Алматы',
            'skills': json.dumps(['Продажи', 'Касса', 'Клиентский сервис'], ensure_ascii=False),
            'company_id': companies[1].id,
            'posted_by': employers[1].id,
            'is_urgent': True
        },
        {
            'title': 'Менеджер по продажам (B2B)',
            'description': 'Ищем активного менеджера для работы с корпоративными клиентами.\n\nОбязанности:\n• Поиск и привлечение корпоративных клиентов\n• Ведение переговоров\n• Подготовка коммерческих предложений\n• Контроль дебиторской задолженности\n• Участие в выставках и презентациях\n\nТребования:\n• Опыт в B2B продажах от 2 лет\n• Навыки переговоров\n• Знание CRM систем\n• Готовность к командировкам',
            'requirements': ['B2B продажи 2+ года', 'Переговоры', 'CRM', 'Командировки'],
            'responsibilities': ['Поиск клиентов', 'Переговоры', 'КП', 'Контроль дебиторки'],
            'benefits': ['Высокий доход', 'Автомобиль', 'ДМС', 'Командировки оплачиваются'],
            'category': 'Продажи',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 300000,
            'salary_max': 600000,
            'city': 'Алматы',
            'skills': json.dumps(['B2B продажи', 'Переговоры', 'CRM', 'Презентации'], ensure_ascii=False),
            'company_id': companies[1].id,
            'posted_by': employers[1].id
        },
        
        # Общепит
        {
            'title': 'Официант/Официантка',
            'description': 'Кафе "Уют" приглашает официантов в дружную команду.\n\nОбязанности:\n• Встреча и размещение гостей\n• Прием заказов\n• Подача блюд и напитков\n• Расчет с клиентами\n• Поддержание чистоты зала\n\nТребования:\n• Опыт работы официантом желателен\n• Приятная внешность\n• Коммуникабельность\n• Стрессоустойчивость\n• График работы 2/2',
            'requirements': ['Опыт желателен', 'Коммуникабельность', 'Стрессоустойчивость'],
            'responsibilities': ['Обслуживание гостей', 'Прием заказов', 'Подача блюд', 'Расчеты'],
            'benefits': ['Чаевые', 'Питание', 'Дружный коллектив', 'Гибкий график'],
            'category': 'Общепит',
            'employment_type': 'part_time',
            'experience_level': 'junior',
            'salary_min': 150000,
            'salary_max': 200000,
            'city': 'Петропавловск',
            'skills': json.dumps(['Клиентский сервис', 'Работа в команде'], ensure_ascii=False),
            'company_id': companies[2].id,
            'posted_by': employers[2].id
        },
        {
            'title': 'Повар-универсал',
            'description': 'Требуется повар-универсал в кафе семейного типа.\n\nОбязанности:\n• Приготовление горячих и холодных блюд\n• Контроль качества продуктов\n• Соблюдение технологий приготовления\n• Поддержание чистоты на кухне\n• Составление заявок на продукты\n\nТребования:\n• Опыт работы поваром от 2 лет\n• Знание казахской и европейской кухни\n• Санитарная книжка\n• Ответственность и аккуратность',
            'requirements': ['Опыт повара 2+ года', 'Санкнижка', 'Знание кухонь'],
            'responsibilities': ['Приготовление блюд', 'Контроль качества', 'Заявки на продукты'],
            'benefits': ['Питание', 'Соцпакет', 'Стабильная работа'],
            'category': 'Общепит',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 220000,
            'salary_max': 280000,
            'city': 'Петропавловск',
            'skills': json.dumps(['Кулинария', 'Санитарные нормы', 'Планирование'], ensure_ascii=False),
            'education_required': 'Среднее специальное',
            'company_id': companies[2].id,
            'posted_by': employers[2].id
        },
        
        # Строительство
        {
            'title': 'Прораб',
            'description': 'Строительная компания ищет опытного прораба.\n\nОбязанности:\n• Контроль качества строительных работ\n• Координация работы бригад\n• Контроль соблюдения сроков\n• Ведение документации\n• Обеспечение техники безопасности\n\nТребования:\n• Опыт работы прорабом от 5 лет\n• Строительное образование\n• Знание СНиП и ГОСТов\n• Навыки управления персоналом\n• Готовность к разъездам',
            'requirements': ['Опыт прораба 5+ лет', 'Строительное образование', 'СНиП', 'Управление'],
            'responsibilities': ['Контроль качества', 'Координация бригад', 'Документооборот', 'ТБ'],
            'benefits': ['Высокая зарплата', 'Автомобиль', 'ДМС', 'Премии за объекты'],
            'category': 'Строительство',
            'employment_type': 'full_time',
            'experience_level': 'senior',
            'salary_min': 500000,
            'salary_max': 700000,
            'city': 'Костанай',
            'skills': json.dumps(['Строительство', 'СНиП', 'Управление персоналом', 'Документооборот'], ensure_ascii=False),
            'education_required': 'Высшее',
            'company_id': companies[3].id,
            'posted_by': employers[0].id  # Используем первого работодателя
        }
    ]

    for job_data in jobs_data:
        # Преобразуем списки в JSON строки для requirements, responsibilities, benefits
        for field in ['requirements', 'responsibilities', 'benefits']:
            if field in job_data and isinstance(job_data[field], list):
                job_data[field] = json.dumps(job_data[field], ensure_ascii=False)
        
        job = Job(**job_data)
        job.created_at = datetime.utcnow()
        job.published_at = datetime.utcnow()
        job.expires_at = datetime.utcnow() + timedelta(days=30)
        db.session.add(job)

    try:
        db.session.commit()
        print(f"✅ Создано {len(jobs_data)} тестовых вакансий")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Ошибка при создании вакансий: {e}")

def seed_applications():
    """Создание тестовых откликов"""
    if JobApplication.query.count() > 0:
        print("Тестовые отклики уже существуют")
        return

    jobs = Job.query.all()
    candidates = User.query.filter_by(user_type='candidate').all()
    
    if not jobs or not candidates:
        print("❌ Сначала создайте вакансии и кандидатов")
        return

    applications_data = []
    
    # Создаем несколько откликов на разные вакансии
    for i, job in enumerate(jobs[:5]):  # Первые 5 вакансий
        for j, candidate in enumerate(candidates[:3]):  # Первые 3 кандидата
            if random.random() > 0.3:  # 70% вероятность отклика
                status_options = ['pending', 'viewed', 'interview', 'rejected', 'hired']
                application = {
                    'job_id': job.id,
                    'candidate_id': candidate.id,
                    'cover_letter': f'Здравствуйте! Меня заинтересовала ваша вакансия "{job.title}". У меня есть соответствующий опыт и навыки. Готов обсудить детали сотрудничества.',
                    'expected_salary': random.randint(job.salary_min or 200000, (job.salary_max or 500000) + 100000),
                    'status': random.choice(status_options),
                    'auto_score': round(random.uniform(0.5, 0.95), 2),
                    'score': round(random.uniform(0.3, 0.9), 2)
                }
                applications_data.append(application)

    for app_data in applications_data:
        application = JobApplication(**app_data)
        application.created_at = datetime.utcnow() - timedelta(days=random.randint(1, 15))
        db.session.add(application)

    try:
        db.session.commit()
        print(f"✅ Создано {len(applications_data)} тестовых откликов")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Ошибка при создании откликов: {e}")

def seed_candidate_profiles():
    """Создание расширенных профилей кандидатов"""
    candidates = User.query.filter_by(user_type='candidate').all()
    
    if not candidates:
        print("❌ Сначала создайте кандидатов")
        return

    if CandidateProfile.query.count() > 0:
        print("Профили кандидатов уже существуют")
        return

    profiles_data = [
        {
            'user_id': candidates[0].id,  # Данияр Аскаров
            'current_position': 'Frontend разработчик',
            'desired_position': 'Senior Frontend разработчик',
            'salary_from': 800000,
            'salary_to': 1200000,
            'about': 'Опытный Frontend разработчик с 5-летним стажем. Специализируюсь на React, Vue.js и современных технологиях веб-разработки. Имею опыт ведения проектов и менторинга младших разработчиков.',
            'work_schedule': 'remote',
            'skills': [
                {'name': 'React', 'level': 'advanced', 'years_experience': 4},
                {'name': 'Vue.js', 'level': 'advanced', 'years_experience': 3},
                {'name': 'TypeScript', 'level': 'intermediate', 'years_experience': 3},
                {'name': 'Node.js', 'level': 'intermediate', 'years_experience': 2},
                {'name': 'Docker', 'level': 'beginner', 'years_experience': 1}
            ],
            'education': [
                {
                    'institution': 'КазНТУ им. К.И. Сатпаева',
                    'specialty': 'Информационные системы',
                    'degree': 'Бакалавр',
                    'start_year': 2013,
                    'end_year': 2017
                }
            ],
            'work_experience': [
                {
                    'company_name': 'ТОО "WebStudio KZ"',
                    'position': 'Frontend разработчик',
                    'start_date': date(2019, 6, 1),
                    'end_date': date(2024, 3, 1),
                    'is_current': False,
                    'description': 'Разработка интерфейсов для корпоративных сайтов и веб-приложений',
                    'employment_type': 'full_time'
                },
                {
                    'company_name': 'ТОО "Цифровые Решения КЗ"',
                    'position': 'Senior Frontend разработчик',
                    'start_date': date(2024, 3, 15),
                    'is_current': True,
                    'description': 'Ведущий разработчик в команде, менторинг джунов, архитектурные решения',
                    'employment_type': 'full_time'
                }
            ]
        },
        {
            'user_id': candidates[1].id,  # Асель Нурланова
            'current_position': 'Менеджер по продажам',
            'desired_position': 'Руководитель отдела продаж',
            'salary_from': 400000,
            'salary_to': 600000,
            'about': 'Целеустремленный менеджер по продажам с 3-летним опытом в B2B сегменте. Показываю стабильный рост продаж, умею работать с крупными клиентами.',
            'work_schedule': 'full_time',
            'skills': [
                {'name': 'B2B продажи', 'level': 'advanced', 'years_experience': 3},
                {'name': 'CRM системы', 'level': 'intermediate', 'years_experience': 2},
                {'name': 'Переговоры', 'level': 'advanced', 'years_experience': 3},
                {'name': 'Презентации', 'level': 'intermediate', 'years_experience': 2}
            ],
            'education': [
                {
                    'institution': 'КазЭУ им. Т. Рыскулова',
                    'specialty': 'Маркетинг',
                    'degree': 'Бакалавр',
                    'start_year': 2014,
                    'end_year': 2018
                }
            ],
            'work_experience': [
                {
                    'company_name': 'ТОО "ТехноМир"',
                    'position': 'Менеджер по продажам',
                    'start_date': date(2021, 2, 1),
                    'is_current': True,
                    'description': 'Продажи IT оборудования корпоративным клиентам',
                    'employment_type': 'full_time'
                }
            ]
        },
        {
            'user_id': candidates[2].id,  # Ерлан Молдагалиев
            'current_position': 'Официант',
            'desired_position': 'Администратор ресторана',
            'salary_from': 200000,
            'salary_to': 300000,
            'about': 'Молодой и энергичный работник сферы обслуживания. Быстро обучаюсь, ответственно отношусь к работе, стремлюсь к карьерному росту.',
            'work_schedule': 'full_time',
            'skills': [
                {'name': 'Клиентский сервис', 'level': 'intermediate', 'years_experience': 1},
                {'name': 'Работа в команде', 'level': 'advanced', 'years_experience': 1},
                {'name': 'Стрессоустойчивость', 'level': 'intermediate', 'years_experience': 1}
            ],
            'education': [
                {
                    'institution': 'Петропавловский колледж сервиса',
                    'specialty': 'Организация обслуживания в общественном питании',
                    'degree': 'Среднее специальное',
                    'start_year': 2018,
                    'end_year': 2022
                }
            ],
            'work_experience': [
                {
                    'company_name': 'Кафе "Березка"',
                    'position': 'Официант',
                    'start_date': date(2023, 1, 15),
                    'is_current': True,
                    'description': 'Обслуживание клиентов, прием заказов, работа с кассой',
                    'employment_type': 'full_time'
                }
            ]
        }
    ]

    for profile_data in profiles_data:
        skills_data = profile_data.pop('skills', [])
        education_data = profile_data.pop('education', [])
        experience_data = profile_data.pop('work_experience', [])
        
        # Создаем профиль
        profile = CandidateProfile(**profile_data)
        db.session.add(profile)
        db.session.flush()  # Получаем ID профиля
        
        # Добавляем навыки
        for skill_data in skills_data:
            skill = Skill(candidate_profile_id=profile.id, **skill_data)
            db.session.add(skill)
        
        # Добавляем образование
        for edu_data in education_data:
            education = Education(candidate_profile_id=profile.id, **edu_data)
            db.session.add(education)
        
        # Добавляем опыт работы
        for exp_data in experience_data:
            experience = WorkExperience(candidate_profile_id=profile.id, **exp_data)
            db.session.add(experience)

    try:
        db.session.commit()
        print(f"✅ Создано {len(profiles_data)} расширенных профилей кандидатов")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Ошибка при создании профилей: {e}")

def seed_settings():
    """Инициализация настроек системы"""
    if Settings.query.count() > 0:
        print("Настройки уже существуют")
        return

    try:
        Settings.init_default_settings()
        print("✅ Настройки системы инициализированы")
    except Exception as e:
        print(f"❌ Ошибка при инициализации настроек: {e}")

def seed_notifications():
    """Создание тестовых уведомлений"""
    if Notification.query.count() > 0:
        print("Тестовые уведомления уже существуют")
        return

    candidates = User.query.filter_by(user_type='candidate').all()
    jobs = Job.query.all()
    
    if not candidates or not jobs:
        print("❌ Сначала создайте кандидатов и вакансии")
        return

    notifications_data = [
        {
            'user_id': candidates[0].id,
            'type': 'application_viewed',
            'message': 'Работодатель просмотрел ваш отклик на вакансию "Frontend разработчик"',
            'job_id': jobs[0].id,
            'job_title': jobs[0].title,
            'company_name': jobs[0].company.name
        },
        {
            'user_id': candidates[0].id,
            'type': 'interview_scheduled',
            'message': 'Назначено собеседование на вакансию "Frontend разработчик"',
            'job_id': jobs[0].id,
            'job_title': jobs[0].title,
            'company_name': jobs[0].company.name,
            'interview_date': datetime.utcnow() + timedelta(days=3)
        },
        {
            'user_id': candidates[1].id,
            'type': 'new_job_match',
            'message': 'Найдена подходящая вакансия "Менеджер по продажам (B2B)"',
            'job_id': jobs[3].id if len(jobs) > 3 else jobs[0].id,
            'job_title': jobs[3].title if len(jobs) > 3 else jobs[0].title,
            'company_name': jobs[3].company.name if len(jobs) > 3 else jobs[0].company.name
        }
    ]

    for notif_data in notifications_data:
        notification = Notification(**notif_data)
        notification.created_at = datetime.utcnow() - timedelta(hours=random.randint(1, 24))
        db.session.add(notification)

    try:
        db.session.commit()
        print(f"✅ Создано {len(notifications_data)} тестовых уведомлений")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Ошибка при создании уведомлений: {e}")

def seed_analytics():
    """Создание тестовых данных аналитики"""
    if Analytics.query.count() > 0:
        print("Данные аналитики уже существуют")
        return

    jobs = Job.query.all()
    companies = Company.query.all()
    
    if not jobs or not companies:
        print("❌ Сначала создайте вакансии и компании")
        return

    # Создаем данные за последние 30 дней
    for i in range(30):
        target_date = date.today() - timedelta(days=i)
        
        # Просмотры вакансий
        for job in jobs[:3]:  # Первые 3 вакансии
            views = random.randint(5, 50)
            Analytics.track_metric('job_views', job.id, 'job', views)
        
        # Регистрации пользователей
        registrations = random.randint(1, 10)
        Analytics.track_metric('registrations', value=registrations)
        
        # Отклики на вакансии
        applications = random.randint(2, 15)
        Analytics.track_metric('applications', value=applications)

    try:
        print("✅ Созданы тестовые данные аналитики за 30 дней")
    except Exception as e:
        print(f"❌ Ошибка при создании аналитики: {e}")

def seed_social_posts():
    """Создание тестовых постов в соцсетях"""
    if SocialPost.query.count() > 0:
        print("Тестовые посты уже существуют")
        return

    featured_jobs = Job.query.filter_by(is_featured=True).all()
    
    if not featured_jobs:
        print("❌ Нет вакансий для постинга в соцсети")
        return

    platforms = ['instagram', 'telegram', 'facebook']
    
    for job in featured_jobs[:2]:  # Первые 2 топовые вакансии
        for platform in platforms:
            post = SocialPost(
                job_id=job.id,
                platform=platform,
                caption=f"🔥 Горячая вакансия!\n\n{job.title}\nКомпания: {job.company.name}\nЗарплата: {job.get_salary_range()}\nГород: {job.city}\n\n#работа #вакансия #{job.city.lower()} #workplus",
                status='published',
                views_count=random.randint(100, 1000),
                likes_count=random.randint(5, 50),
                comments_count=random.randint(0, 10),
                published_at=datetime.utcnow() - timedelta(days=random.randint(1, 7))
            )
            db.session.add(post)

    try:
        db.session.commit()
        print("✅ Созданы тестовые посты в соцсетях")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Ошибка при создании постов: {e}")

def seed_resumes():
    """Создание тестовых резюме"""
    if Resume.query.count() > 0:
        print("Тестовые резюме уже существуют")
        return

    resumes_data = [
        {
            'first_name': 'Айдар',
            'last_name': 'Жумабеков',
            'email': 'aidar.zhumab@gmail.com',
            'phone': '+7 701 555 7777',
            'city': 'Алматы',
            'date_of_birth': '1993-08-15',
            'position': 'Python разработчик',
            'salary': '900,000 - 1,300,000 тенге',
            'work_format': 'Удаленно',
            'ready_to_relocate': False,
            'summary': 'Опытный Python разработчик с 4-летним стажем. Специализируюсь на Django, FastAPI, работе с базами данных и API.',
            'experience': [
                {
                    'company': 'ТОО "DevKZ"',
                    'position': 'Python разработчик',
                    'start_date': '2020-03',
                    'end_date': '2024-02',
                    'current': False,
                    'description': 'Разработка веб-приложений на Django, API интеграции, оптимизация баз данных'
                }
            ],
            'education': [
                {
                    'institution': 'КазНТУ',
                    'degree': 'Бакалавр',
                    'field': 'Программная инженерия',
                    'start_year': '2015',
                    'end_year': '2019',
                    'current': False
                }
            ],
            'skills': [
                {'name': 'Python'}, {'name': 'Django'}, {'name': 'PostgreSQL'}, 
                {'name': 'Redis'}, {'name': 'Docker'}, {'name': 'Git'}
            ],
            'languages': [
                {'name': 'Русский', 'level': 'Родной'},
                {'name': 'Английский', 'level': 'B2'},
                {'name': 'Казахский', 'level': 'B1'}
            ]
        },
        {
            'first_name': 'Салтанат',
            'last_name': 'Оразбаева',
            'email': 'saltanat.o@mail.ru',
            'phone': '+7 702 444 8888',
            'city': 'Костанай',
            'date_of_birth': '1987-03-22',
            'position': 'Главный бухгалтер',
            'salary': '400,000 - 600,000 тенге',
            'work_format': 'В офисе',
            'ready_to_relocate': True,
            'summary': 'Опытный главный бухгалтер с 12-летним стажем. Ведение полного цикла бухгалтерского и налогового учета.',
            'experience': [
                {
                    'company': 'ТОО "СтройИнвест"',
                    'position': 'Главный бухгалтер',
                    'start_date': '2018-01',
                    'current': True,
                    'description': 'Ведение учета строительной компании, налоговое планирование, управление финансами'
                }
            ],
            'education': [
                {
                    'institution': 'КГУ им. А. Байтурсынова',
                    'degree': 'Бакалавр',
                    'field': 'Учет и аудит',
                    'start_year': '2005',
                    'end_year': '2009',
                    'current': False
                }
            ],
            'skills': [
                {'name': '1С:Бухгалтерия'}, {'name': 'Налоговый учет'}, 
                {'name': 'Финансовый анализ'}, {'name': 'Excel'}
            ],
            'languages': [
                {'name': 'Русский', 'level': 'Родной'},
                {'name': 'Казахский', 'level': 'Свободно'}
            ]
        }
    ]

    for resume_data in resumes_data:
        experience_data = resume_data.pop('experience', [])
        education_data = resume_data.pop('education', [])
        skills_data = resume_data.pop('skills', [])
        languages_data = resume_data.pop('languages', [])
        
        # Создаем резюме
        resume = Resume(**resume_data)
        db.session.add(resume)
        db.session.flush()
        
        # Добавляем опыт
        for exp in experience_data:
            experience = ResumeExperience(resume_id=resume.id, **exp)
            db.session.add(experience)
        
        # Добавляем образование
        for edu in education_data:
            education = ResumeEducation(resume_id=resume.id, **edu)
            db.session.add(education)
        
        # Добавляем навыки
        for skill in skills_data:
            resume_skill = ResumeSkill(resume_id=resume.id, **skill)
            db.session.add(resume_skill)
        
        # Добавляем языки
        for lang in languages_data:
            language = ResumeLanguage(resume_id=resume.id, **lang)
            db.session.add(language)

    try:
        db.session.commit()
        print(f"✅ Создано {len(resumes_data)} тестовых резюме")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Ошибка при создании резюме: {e}")

def seed_all():
    """Запуск всех функций создания тестовых данных"""
    print("🚀 Начинаем создание тестовых данных для WorkPlus.kz...")
    print("=" * 60)
    
    # Порядок важен из-за внешних ключей
    seed_admins()
    seed_companies()
    seed_users()
    seed_jobs()
    seed_applications()
    seed_candidate_profiles()
    seed_settings()
    seed_notifications()
    seed_analytics()
    seed_social_posts()
    seed_resumes()
    
    print("=" * 60)
    print("✅ Создание тестовых данных завершено!")
    print("\n📊 Доступные аккаунты:")
    print("👨‍💼 Администраторы:")
    print("   - super@workplus.kz / super123")
    print("   - admin@workplus.kz / admin123")
    print("👔 Работодатели:")
    print("   - aitzhan@digital-kz.com / employer123")
    print("   - marat.z@dasarkhan.kz / employer123")
    print("   - gulnara@cafeuyut.kz / employer123")
    print("👤 Кандидаты:")
    print("   - daniyar.askarov@gmail.com / candidate123")
    print("   - assel.nurlanova@mail.ru / candidate123")
    print("   - erlan.m@yandex.kz / candidate123")
    print("   - dinara.zh@gmail.com / candidate123")
    print("   - baurzhan.s@mail.kz / candidate123")

if __name__ == "__main__":
    # Импортируем Flask app и создаем контекст
    from app import app
    with app.app_context():
        seed_all()