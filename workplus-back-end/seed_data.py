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

    # Создаем кандидатов и профили
    for candidate_data in candidates_data:
        password = candidate_data.pop('password')
        user = User(**candidate_data)
        user.set_password(password)
        user.is_verified = True
        user.is_active = True
        db.session.add(user)
        db.session.flush()

        profile = CandidateProfile(user_id=user.id)
        db.session.add(profile)

    db.session.commit()
    print(f"✅ Создано {len(employers_data)} работодателей и {len(candidates_data)} соискателей")

def seed_jobs():
    """Создание тестовых вакансий (под новую модель Job)"""
    if Job.query.count() > 0:
        print("⚠️ Тестовые вакансии уже существуют")
        return

    companies = Company.query.all()
    employers = User.query.filter_by(user_type='employer').all()
    
    if not companies or not employers:
        print("❌ Сначала создайте компании и пользователей")
        return

    jobs_data = [
        {
            'title': 'Backend разработчик (Python/FastAPI)',
            'description': 'Разработка и поддержка REST API, оптимизация БД, интеграции с внешними сервисами.',
            'requirements': ['Python 3+', 'FastAPI/Django REST', 'PostgreSQL', 'Docker'],
            'responsibilities': ['Проектирование API', 'Оптимизация запросов', 'Написание тестов', 'Код-ревью'],
            'benefits': ['ДМС', 'Оплата конференций', 'Удалённый формат'],
            'category': 'IT',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 850000,
            'salary_max': 1300000,
            'salary_currency': 'KZT',
            'salary_period': 'month',
            'city': 'Алматы',
            'address': 'ул. Сейфуллина, 500',
            'remote_work': True,
            'relocation': False,
            'skills': json.dumps(['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'CI/CD'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Русский', 'level': 'fluent'}, {'name': 'Английский', 'level': 'intermediate'}], ensure_ascii=False),
            'education_required': 'Высшее',
            'company_id': companies[0].id,
            'posted_by': employers[0].id,
            'is_featured': True,
            'publish_to_instagram': True,
            'publish_to_telegram': True,
            'publish_to_linkedin': True,
            'moderation_status': 'approved'
        },
        {
            'title': 'Аналитик данных (SQL/Power BI)',
            'description': 'Подготовка отчётов, визуализация метрик, анализ продуктовых и финансовых показателей.',
            'requirements': ['SQL', 'Power BI или Tableau', 'Excel/Google Sheets', 'Статистика'],
            'responsibilities': ['Построение дашбордов', 'A/B-аналитика', 'Подготовка инсайтов для бизнеса'],
            'benefits': ['Гибридный график', 'Корпоративное обучение', 'Годовой бонус'],
            'category': 'Аналитика',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 600000,
            'salary_max': 900000,
            'salary_currency': 'KZT',
            'salary_period': 'month',
            'city': 'Астана',
            'address': 'пр. Туран, 37',
            'remote_work': True,
            'relocation': False,
            'skills': json.dumps(['SQL', 'Power BI', 'Tableau', 'A/B Testing', 'ETL'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Русский', 'level': 'fluent'}, {'name': 'Казахский', 'level': 'intermediate'}], ensure_ascii=False),
            'education_required': 'Высшее (экономика/математика/IT)',
            'company_id': companies[1].id,
            'posted_by': employers[1].id,
            'is_urgent': True,
            'publish_to_instagram': False,
            'publish_to_telegram': True,
            'publish_to_facebook': True,
            'moderation_status': 'approved'
        },
        {
            'title': 'iOS разработчик (SwiftUI)',
            'description': 'Разработка мобильного приложения, интеграция с API, участие в релизах.',
            'requirements': ['Swift/SwiftUI', 'MVVM', 'REST/JSON', 'Xcode'],
            'responsibilities': ['Верстка экранов', 'Интеграция сетевого слоя', 'Юнит-тесты', 'Code Review'],
            'benefits': ['Удалёнка', 'Техника за счёт компании', 'Оплата курсов'],
            'category': 'IT',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 900000,
            'salary_max': 1400000,
            'salary_currency': 'KZT',
            'salary_period': 'month',
            'city': 'Алматы',
            'address': 'БЦ Нурлы Тау',
            'remote_work': True,
            'relocation': False,
            'skills': json.dumps(['Swift', 'SwiftUI', 'Combine', 'REST', 'Unit Tests'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Русский', 'level': 'fluent'}, {'name': 'Английский', 'level': 'intermediate'}], ensure_ascii=False),
            'education_required': 'Высшее',
            'company_id': companies[0].id,
            'posted_by': employers[0].id,
            'publish_to_telegram': True,
            'publish_to_linkedin': True,
            'moderation_status': 'approved'
        },
        {
            'title': 'DevOps инженер (Kubernetes/CI-CD)',
            'description': 'Поддержка инфраструктуры, автоматизация деплоя, мониторинг и отказоустойчивость.',
            'requirements': ['Linux', 'Docker', 'Kubernetes', 'CI/CD (GitHub Actions/GitLab CI)', 'Terraform'],
            'responsibilities': ['Настройка пайплайнов', 'Мониторинг (Prometheus/Grafana)', 'Оптимизация расходов'],
            'benefits': ['ДМС', 'Удалёнка/гибрид', 'Компенсация сертификаций'],
            'category': 'IT',
            'employment_type': 'full_time',
            'experience_level': 'senior',
            'salary_min': 1100000,
            'salary_max': 1700000,
            'salary_currency': 'KZT',
            'salary_period': 'month',
            'city': 'Астана',
            'address': 'ул. Кунаева, 12',
            'remote_work': True,
            'relocation': True,
            'skills': json.dumps(['Kubernetes', 'Helm', 'Terraform', 'Docker', 'CI/CD'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Русский', 'level': 'fluent'}, {'name': 'Английский', 'level': 'upper-intermediate'}], ensure_ascii=False),
            'education_required': 'Высшее (IT)',
            'company_id': companies[4].id,
            'posted_by': employers[2].id,
            'is_featured': True,
            'publish_to_linkedin': True,
            'moderation_status': 'approved'
        },
        {
            'title': 'Бухгалтер (полный цикл)',
            'description': 'Ведение бухгалтерского и налогового учета, отчётность, работа с контрагентами.',
            'requirements': ['Опыт от 3 лет', '1С:Бухгалтерия', 'Знание НК РК'],
            'responsibilities': ['Первичка', 'Зарплата/кадры', 'Сдача отчетности'],
            'benefits': ['Официальное трудоустройство', 'Премии по результатам', 'Гибкий график'],
            'category': 'Финансы/Бухгалтерия',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 400000,
            'salary_max': 600000,
            'salary_currency': 'KZT',
            'salary_period': 'month',
            'city': 'Костанай',
            'address': 'ул. Байтурсынова, 124А',
            'remote_work': False,
            'relocation': False,
            'skills': json.dumps(['1С', 'Налоговый учет', 'Первичная документация'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Казахский', 'level': 'fluent'}, {'name': 'Русский', 'level': 'fluent'}], ensure_ascii=False),
            'education_required': 'Высшее (бухучёт/аудит)',
            'company_id': companies[3].id,
            'posted_by': employers[2].id,
            'publish_to_facebook': True,
            'moderation_status': 'approved'
        },
        {
            'title': 'HR менеджер (IT-рекрутинг)',
            'description': 'Поиск и подбор разработчиков, ведение полного цикла рекрутинга, онбординг.',
            'requirements': ['IT-рекрутинг 2+ года', 'Лайаут вакансий', 'Работа с ATS/CRM'],
            'responsibilities': ['Сорсинг', 'Интервью', 'Офферы', 'Аналитика найма'],
            'benefits': ['Гибрид', 'Бонусы за найм', 'Корпоративные мероприятия'],
            'category': 'HR',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 500000,
            'salary_max': 800000,
            'salary_currency': 'KZT',
            'salary_period': 'month',
            'city': 'Алматы',
            'address': 'ул. Абая, 150/230',
            'remote_work': True,
            'relocation': False,
            'skills': json.dumps(['Sourcing', 'Interviewing', 'ATS', 'Employer Branding'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Русский', 'level': 'fluent'}, {'name': 'Английский', 'level': 'intermediate'}], ensure_ascii=False),
            'education_required': 'Высшее',
            'company_id': companies[0].id,
            'posted_by': employers[0].id,
            'is_urgent': True,
            'publish_to_instagram': True,
            'publish_to_telegram': True,
            'moderation_status': 'approved'
        },
        {
            'title': 'Инженер-механик (Промышленное оборудование)',
            'description': 'Обслуживание и ремонт производственного оборудования, плановое ТО.',
            'requirements': ['Опыт от 2 лет', 'Чтение чертежей', 'Знание техники безопасности'],
            'responsibilities': ['Диагностика поломок', 'Ремонт/замена узлов', 'Ведение отчётности'],
            'benefits': ['Соцпакет', 'Спецодежда', 'Служебный транспорт'],
            'category': 'Производство',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 350000,
            'salary_max': 500000,
            'salary_currency': 'KZT',
            'salary_period': 'month',
            'city': 'Караганда',
            'address': 'пр. Бухар-жырау, 50',
            'remote_work': False,
            'relocation': True,
            'skills': json.dumps(['Механика', 'ТОиР', 'Чертежи', 'Охрана труда'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Русский', 'level': 'fluent'}], ensure_ascii=False),
            'education_required': 'Среднее специальное/Высшее',
            'company_id': companies[3].id,
            'posted_by': employers[2].id,
            'moderation_status': 'approved'
        },
        {
            'title': 'Медсестра (сменный график)',
            'description': 'Уход за пациентами, ведение процедур, контроль показателей.',
            'requirements': ['Среднее мед. образование', 'Опыт от 1 года', 'Аккуратность'],
            'responsibilities': ['Взятие анализов', 'Инъекции', 'Документация'],
            'benefits': ['Официальное оформление', 'Соцпакет', 'Сменный график'],
            'category': 'Медицина',
            'employment_type': 'full_time',
            'experience_level': 'junior',
            'salary_min': 280000,
            'salary_max': 380000,
            'salary_currency': 'KZT',
            'salary_period': 'month',
            'city': 'Шымкент',
            'address': 'ул. Байтурсынова, 10',
            'remote_work': False,
            'relocation': False,
            'skills': json.dumps(['Процедуры', 'Асептика', 'Документооборот'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Казахский', 'level': 'fluent'}, {'name': 'Русский', 'level': 'fluent'}], ensure_ascii=False),
            'education_required': 'Среднее специальное (мед.)',
            'company_id': companies[1].id,
            'posted_by': employers[1].id,
            'moderation_status': 'approved'
        },
        {
            'title': 'Учитель математики (7–11 классы)',
            'description': 'Преподавание школьной программы, подготовка к олимпиадам и ЕНТ.',
            'requirements': ['Пед. образование', 'Опыт преподавания от 2 лет', 'Уверенный Excel/GeoGebra'],
            'responsibilities': ['Проведение уроков', 'Проверка работ', 'Индивидуальные занятия'],
            'benefits': ['Методическая поддержка', 'Повышение квалификации', 'Стабильная ставка'],
            'category': 'Образование',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 300000,
            'salary_max': 450000,
            'salary_currency': 'KZT',
            'salary_period': 'month',
            'city': 'Петропавловск',
            'address': 'ул. Конституции, 35',
            'remote_work': False,
            'relocation': False,
            'skills': json.dumps(['Методика', 'Подготовка к ЕНТ', 'Олимпиадная математика'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Русский', 'level': 'fluent'}, {'name': 'Казахский', 'level': 'intermediate'}], ensure_ascii=False),
            'education_required': 'Высшее (педагогика/математика)',
            'company_id': companies[2].id,
            'posted_by': employers[2].id,
            'moderation_status': 'approved'
        },
        {
            'title': 'Android разработчик (Kotlin)',
            'description': 'Разработка и поддержка мобильного приложения, работа с Jetpack и Room.',
            'requirements': ['Kotlin', 'Android SDK', 'Jetpack (Compose/Navigation)', 'REST/JSON'],
            'responsibilities': ['Новые фичи', 'Рефакторинг', 'Юнит/инструм. тесты', 'Публикации релизов'],
            'benefits': ['Удалёнка', 'Гибкий график', 'Оплата конференций'],
            'category': 'IT',
            'employment_type': 'full_time',
            'experience_level': 'middle',
            'salary_min': 900000,
            'salary_max': 1400000,
            'salary_currency': 'KZT',
            'salary_period': 'month',
            'city': 'Актау',
            'address': 'мкр. Промышленный, 15',
            'remote_work': True,
            'relocation': True,
            'skills': json.dumps(['Kotlin', 'Jetpack', 'Room', 'Retrofit', 'Coroutines'], ensure_ascii=False),
            'languages': json.dumps([{'name': 'Русский', 'level': 'fluent'}, {'name': 'Английский', 'level': 'intermediate'}], ensure_ascii=False),
            'education_required': 'Высшее',
            'company_id': companies[4].id,
            'posted_by': employers[2].id,
            'is_featured': False,
            'publish_to_linkedin': True,
            'moderation_status': 'approved'
        }
    ]



    for job_data in jobs_data:
        # JSON-поля для requirements, responsibilities, benefits
        for field in ['requirements', 'responsibilities', 'benefits']:
            if field in job_data and isinstance(job_data[field], list):
                job_data[field] = json.dumps(job_data[field], ensure_ascii=False)

        job = Job(**job_data)
        job.created_at = datetime.utcnow()
        job.updated_at = datetime.utcnow()
        job.published_at = datetime.utcnow()
        job.expires_at = datetime.utcnow() + timedelta(days=30)
        job.auto_close_date = (datetime.utcnow() + timedelta(days=30)).date()
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
                status_options = ['new', 'approved', 'rejected']
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

    for user in candidates:
        profile = CandidateProfile.query.filter_by(user_id=user.id).first()
        if not profile:
            continue

        if user.email == 'daniyar.askarov@gmail.com':
            profile.desired_position = 'Senior Frontend разработчик'
            profile.about = 'Опытный разработчик с 5-летним стажем. React, Vue.js, TypeScript.'
            profile.salary_from = 800000
            profile.salary_to = 1200000
            profile.work_schedule = 'remote'

            db.session.add_all([
                Skill(candidate_profile_id=profile.id, name='React'),
                Skill(candidate_profile_id=profile.id, name='TypeScript'),
                Skill(candidate_profile_id=profile.id, name='Vue.js')
            ])
            db.session.add(Education(
                candidate_profile_id=profile.id,
                institution='КазНТУ им. Сатпаева',
                specialty='Информационные системы',
                degree='Бакалавр',
                start_year=2013,
                end_year=2017
            ))
            db.session.add(WorkExperience(
                candidate_profile_id=profile.id,
                company_name='ТОО "WebStudio KZ"',
                position='Frontend разработчик',
                start_date=date(2019, 6, 1),
                end_date=date(2024, 3, 1),
                description='Разработка интерфейсов для веб-приложений'
            ))

        elif user.email == 'assel.nurlanova@mail.ru':
            profile.desired_position = 'Руководитель отдела продаж'
            profile.about = '3 года опыта в B2B-продажах. Работаю с корпоративными клиентами.'
            profile.salary_from = 400000
            profile.salary_to = 600000
            profile.work_schedule = 'full_time'

            db.session.add_all([
                Skill(candidate_profile_id=profile.id, name='B2B продажи'),
                Skill(candidate_profile_id=profile.id, name='CRM системы'),
                Skill(candidate_profile_id=profile.id, name='Переговоры')
            ])
            db.session.add(Education(
                candidate_profile_id=profile.id,
                institution='КазЭУ им. Рыскулова',
                specialty='Маркетинг',
                degree='Бакалавр',
                start_year=2014,
                end_year=2018
            ))
            db.session.add(WorkExperience(
                candidate_profile_id=profile.id,
                company_name='ТОО "ТехноМир"',
                position='Менеджер по продажам',
                start_date=date(2021, 2, 1),
                description='Продажи IT-оборудования корпоративным клиентам'
            ))

    db.session.commit()
    print("✅ Расширенные профили кандидатов созданы")

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
        print("📊 Данные аналитики уже существуют")
        return

    jobs = Job.query.all()
    companies = Company.query.all()
    
    if not jobs or not companies:
        print("❌ Сначала создайте вакансии и компании")
        return

    # Создаем данные за последние 30 дней
    for i in range(30):
        target_date = date.today() - timedelta(days=i)

        # Просмотры и отклики по вакансиям
        for job in jobs[:5]:  # первые 5 вакансий
            views = random.randint(10, 100)
            Analytics.track_metric(
                metric_type="job_views",
                entity_id=job.id,
                entity_type="job",
                value=views,
                metric_date=target_date
            )

            applications = random.randint(2, 20)
            Analytics.track_metric(
                metric_type="applications",
                entity_id=job.id,
                entity_type="job",
                value=applications,
                metric_date=target_date
            )

        # Регистрации пользователей (общая метрика)
        registrations = random.randint(1, 10)
        Analytics.track_metric(
            metric_type="registrations",
            value=registrations,
            entity_type="user",
            metric_date=target_date
        )

        # Активность компаний (например, публикации)
        for company in companies[:3]:
            posts = random.randint(0, 3)
            if posts > 0:
                Analytics.track_metric(
                    metric_type="company_posts",
                    entity_id=company.id,
                    entity_type="company",
                    value=posts,
                    metric_date=target_date
                )

    try:
        print("✅ Созданы тестовые данные аналитики за последние 30 дней")
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

def seed_job_templates():
    """Создание базовых шаблонов вакансий"""
    if JobTemplate.query.count() > 0:
        print("ℹ️ Шаблоны вакансий уже существуют")
        return

    templates = [
        JobTemplate(
            title="Продавец-консультант в магазин электроники",
            description="Универсальный шаблон для вакансий продавца-консультанта в магазинах электроники и бытовой техники",
            requirements="\n".join([
                "Коммуникабельность и грамотная речь",
                "Опыт работы в продажах приветствуется",
                "Знание ассортимента электроники будет плюсом"
            ]),
            responsibilities="\n".join([
                "Консультирование клиентов",
                "Продажа товаров и аксессуаров",
                "Оформление заказов и документации"
            ]),
            conditions="\n".join([
                "Стабильная зарплата + бонусы",
                "График 5/2 или 2/2",
                "Скидки на продукцию компании"
            ]),
            category="Продажи",
            salary_min=150000,
            salary_max=250000,
            salary_currency="KZT",
            tags='["продажи", "электроника", "консультант"]',
            usage_count=0,
            rating=4.8,
            success_rate=78,
            status="active",
            last_updated=datetime.utcnow()
        ),
        JobTemplate(
            title="Курьер на личном транспорте",
            description="Готовый шаблон для найма курьеров с личным автомобилем или мотоциклом",
            requirements="\n".join([
                "Личный транспорт в исправном состоянии",
                "Водительские права категории B",
                "Ответственность и пунктуальность"
            ]),
            responsibilities="\n".join([
                "Доставка заказов клиентам в срок",
                "Соблюдение правил дорожного движения",
                "Поддержание связи с диспетчером"
            ]),
            conditions="\n".join([
                "Сдельная оплата + бонусы",
                "Гибкий график",
                "Компенсация топлива"
            ]),
            category="Логистика",
            salary_min=120000,
            salary_max=200000,
            salary_currency="KZT",
            tags='["курьер", "доставка", "личный транспорт"]',
            usage_count=0,
            rating=4.6,
            success_rate=85,
            status="active",
            last_updated=datetime.utcnow()
        ),
        JobTemplate(
            title="Официант в ресторан",
            description="Типовой шаблон для найма официантов в рестораны и кафе",
            requirements="\n".join([
                "Опыт работы официантом приветствуется",
                "Коммуникабельность",
                "Опрятный внешний вид"
            ]),
            responsibilities="\n".join([
                "Обслуживание гостей",
                "Принятие заказов",
                "Консультирование по меню"
            ]),
            conditions="\n".join([
                "Официальное трудоустройство",
                "График 2/2 или 6/1",
                "Чаевые остаются у официанта"
            ]),
            category="Сервис",
            salary_min=120000,
            salary_max=180000,
            salary_currency="KZT",
            tags='["официант", "ресторан", "сервис"]',
            usage_count=0,
            rating=4.5,
            success_rate=72,
            status="active",
            last_updated=datetime.utcnow()
        )
    ]

    db.session.bulk_save_objects(templates)
    db.session.commit()
    print("✅ Базовые шаблоны вакансий созданы")

def seed_blog_posts():
    # Проверим, есть ли уже посты
    if BlogPost.query.count() > 0:
        print("✅ Посты блога уже существуют")
        return

    # Создаем категории
    categories = ["IT", "Маркетинг", "Карьера", "Образование"]
    category_objs = []
    for c in categories:
        cat = BlogCategory(name=c)
        db.session.add(cat)
        category_objs.append(cat)

    # Создаем теги
    tags = ["python", "react", "sql", "soft-skills", "frontend", "backend"]
    tag_objs = []
    for t in tags:
        tg = BlogTag(name=t)
        db.session.add(tg)
        tag_objs.append(tg)

    db.session.commit()

    # Найдем любого пользователя-автора
    author = User.query.filter_by(user_type="employer").first() or \
             User.query.filter_by(user_type="admin").first() or \
             User.query.first()

    if not author:
        print("❌ Нет пользователей для назначения автором постов")
        return

    # Демо статьи
    demo_posts = [
        {
            "title": "Как освоить Python за 3 месяца",
            "excerpt": "Пошаговый план изучения Python с нуля для начинающих.",
            "content": "Python — это универсальный язык программирования, который отлично подходит для веба, анализа данных и автоматизации...",
            "category": "IT",
            "tags": ["python", "backend"],
            "image": "https://picsum.photos/800/400?random=1",
            "read_time": "5 мин",
            "is_featured": True
        },
        {
            "title": "ТОП-5 советов для успешного собеседования",
            "excerpt": "Как правильно подготовиться к интервью и произвести впечатление.",
            "content": "Собеседование — это не только проверка ваших знаний, но и возможность показать soft-skills...",
            "category": "Карьера",
            "tags": ["soft-skills"],
            "image": "https://picsum.photos/800/400?random=2",
            "read_time": "7 мин",
            "is_featured": False
        },
        {
            "title": "Почему стоит изучать React",
            "excerpt": "React стал стандартом в разработке интерфейсов. Вот почему он так популярен.",
            "content": "React — это библиотека JavaScript, созданная Facebook. Она упрощает создание UI и позволяет делать приложения быстрее...",
            "category": "IT",
            "tags": ["react", "frontend"],
            "image": "https://picsum.photos/800/400?random=3",
            "read_time": "6 мин",
            "is_featured": False
        },
        {
            "title": "Как построить карьеру в маркетинге",
            "excerpt": "Маркетинг — одна из самых востребованных сфер. Разберем ключевые шаги.",
            "content": "Карьерный путь маркетолога может включать digital, контент-маркетинг, SEO и многое другое...",
            "category": "Маркетинг",
            "tags": ["soft-skills"],
            "image": "https://picsum.photos/800/400?random=4",
            "read_time": "8 мин",
            "is_featured": False
        },
    ]

    # Создаем посты
    for p in demo_posts:
        category = BlogCategory.query.filter_by(name=p["category"]).first()
        post_tags = BlogTag.query.filter(BlogTag.name.in_(p["tags"])).all()

        post = BlogPost(
            title=p["title"],
            excerpt=p["excerpt"],
            content=p["content"],
            category=category,
            author_id=author.id,
            image_url=p["image"],
            read_time=p["read_time"],
            is_featured=p["is_featured"],
            created_at=datetime.utcnow()
        )
        post.tags = post_tags

        db.session.add(post)

    db.session.commit()
    print("✅ Демо посты успешно добавлены")


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
    seed_job_templates()
    seed_blog_posts()
    
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