import os
from datetime import timedelta

class Config:
    """Базовая конфигурация приложения"""
    
    # Основные настройки Flask
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'workplus-secret-key-2024-kazakhstan'
    
    # Настройки базы данных
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///workplus.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_timeout': 20,
        'pool_recycle': -1,
        'pool_pre_ping': True
    }
    
    # Настройки приложения
    DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5000))
    
    # Настройки безопасности
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 3600  # 1 час
    
    # Настройки сессий
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False').lower() == 'true'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # Настройки загрузки файлов
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB максимальный размер файла
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static', 'uploads')
    
    # Разрешенные форматы файлов
    ALLOWED_AVATAR_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    ALLOWED_RESUME_EXTENSIONS = {'pdf', 'doc', 'docx'}
    ALLOWED_DOCUMENT_EXTENSIONS = {'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'}
    
    # Настройки почты
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@workplus.kz')
    
    # Настройки SMS (например, через SMS.ru или местного провайдера)
    SMS_API_URL = os.environ.get('SMS_API_URL')
    SMS_API_KEY = os.environ.get('SMS_API_KEY')
    SMS_SENDER = os.environ.get('SMS_SENDER', 'WorkPlus')
    
    # Настройки Telegram Bot
    TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
    TELEGRAM_WEBHOOK_URL = os.environ.get('TELEGRAM_WEBHOOK_URL')
    
    # Настройки социальных сетей для автопостинга
    INSTAGRAM_ACCESS_TOKEN = os.environ.get('INSTAGRAM_ACCESS_TOKEN')
    TELEGRAM_CHANNEL_TOKEN = os.environ.get('TELEGRAM_CHANNEL_TOKEN')
    TIKTOK_API_KEY = os.environ.get('TIKTOK_API_KEY')
    
    # Настройки платежных систем
    # Kaspi.kz
    KASPI_MERCHANT_ID = os.environ.get('KASPI_MERCHANT_ID')
    KASPI_SECRET_KEY = os.environ.get('KASPI_SECRET_KEY')
    KASPI_CALLBACK_URL = os.environ.get('KASPI_CALLBACK_URL')
    
    # Другие платежные системы
    PAYBOX_MERCHANT_ID = os.environ.get('PAYBOX_MERCHANT_ID')
    PAYBOX_SECRET_KEY = os.environ.get('PAYBOX_SECRET_KEY')
    
    # Настройки интеграций
    # enbek.kz API (если будет доступно)
    ENBEK_API_URL = os.environ.get('ENBEK_API_URL')
    ENBEK_API_KEY = os.environ.get('ENBEK_API_KEY')
    
    # Настройки кеширования
    CACHE_TYPE = os.environ.get('CACHE_TYPE', 'simple')
    CACHE_DEFAULT_TIMEOUT = int(os.environ.get('CACHE_DEFAULT_TIMEOUT', 300))
    
    # Настройки Redis (для продакшена)
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    
    # Настройки логирования
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.environ.get('LOG_FILE', 'workplus.log')
    
    # Настройки CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
    # Настройки аналитики
    GOOGLE_ANALYTICS_ID = os.environ.get('GOOGLE_ANALYTICS_ID')
    YANDEX_METRICA_ID = os.environ.get('YANDEX_METRICA_ID')
    
    # Настройки тарифных планов (цены в тенге)
    SUBSCRIPTION_PRICES = {
        'start': 25000,      # 25,000 тенге/месяц
        'growth': 120000,    # 120,000 тенге/месяц  
        'pro': 350000        # 350,000 тенге/месяц
    }
    
    # Лимиты по тарифам
    SUBSCRIPTION_LIMITS = {
        'free': {
            'vacancies': 1,
            'applications_view': 5,
            'social_posting': False,
            'analytics': False,
            'priority_support': False
        },
        'start': {
            'vacancies': 5,
            'applications_view': 50,
            'social_posting': True,
            'analytics': False,
            'priority_support': False
        },
        'growth': {
            'vacancies': 15,
            'applications_view': 200,
            'social_posting': True,
            'analytics': True,
            'priority_support': False
        },
        'pro': {
            'vacancies': -1,  # Безлимит
            'applications_view': -1,  # Безлимит
            'social_posting': True,
            'analytics': True,
            'priority_support': True
        }
    }
    
    # Настройки поиска и рекомендаций
    ELASTICSEARCH_URL = os.environ.get('ELASTICSEARCH_URL')
    SEARCH_RESULTS_PER_PAGE = 20
    RECOMMENDATIONS_COUNT = 10
    
    # Настройки уведомлений
    NOTIFICATION_SETTINGS = {
        'new_application': {
            'email': True,
            'sms': False,
            'telegram': True,
            'delay_minutes': 0
        },
        'interview_reminder': {
            'email': True,
            'sms': True,
            'telegram': True,
            'delay_minutes': 60  # За час до интервью
        },
        'subscription_expiry': {
            'email': True,
            'sms': False,
            'telegram': False,
            'delay_days': [7, 3, 1]  # За 7, 3 и 1 день до истечения
        }
    }
    
    # Настройки модерации контента
    MODERATION_SETTINGS = {
        'auto_publish_verified_employers': True,
        'require_phone_verification': True,
        'require_email_verification': True,
        'ban_suspicious_domains': True,
        'max_daily_applications': 50,  # Лимит откликов в день для одного пользователя
    }
    
    # API лимиты
    API_RATE_LIMITS = {
        'default': '100/hour',
        'search': '500/hour',
        'applications': '50/hour',
        'auth': '20/hour'
    }

class DevelopmentConfig(Config):
    """Конфигурация для разработки"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///workplus_dev.db'
    WTF_CSRF_ENABLED = False
    MAIL_SUPPRESS_SEND = True  # Не отправлять реальные письма в dev
    
class ProductionConfig(Config):
    """Конфигурация для продакшена"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://user:pass@localhost/workplus_prod'
    SESSION_COOKIE_SECURE = True
    WTF_CSRF_ENABLED = True
    
    # Дополнительные настройки безопасности для продакшена
    PREFERRED_URL_SCHEME = 'https'
    
class TestingConfig(Config):
    """Конфигурация для тестирования"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///workplus_test.db'
    WTF_CSRF_ENABLED = False
    MAIL_SUPPRESS_SEND = True

# Словарь конфигураций
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Получить конфигурацию на основе переменной окружения"""
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, config['default'])

# Константы приложения
class Constants:
    """Константы приложения"""
    
    # Статусы вакансий
    VACANCY_STATUSES = [
        ('draft', 'Черновик'),
        ('active', 'Активна'),
        ('paused', 'Приостановлена'),
        ('closed', 'Закрыта'),
        ('filled', 'Закрыта (найден кандидат)')
    ]
    
    # Статусы откликов
    APPLICATION_STATUSES = [
        ('new', 'Новый'),
        ('viewed', 'Просмотрен'),
        ('screening', 'Скрининг'),
        ('interview_scheduled', 'Интервью назначено'),
        ('interviewed', 'Прошел интервью'),
        ('offer_sent', 'Отправлено предложение'),
        ('hired', 'Принят на работу'),
        ('rejected', 'Отклонен')
    ]
    
    # Типы занятости
    EMPLOYMENT_TYPES = [
        ('full_time', 'Полная занятость'),
        ('part_time', 'Частичная занятость'),
        ('contract', 'Контракт'),
        ('internship', 'Стажировка'),
        ('freelance', 'Фриланс')
    ]
    
    # Уровни опыта
    EXPERIENCE_LEVELS = [
        (0, 'Без опыта'),
        (1, 'До 1 года'),
        (2, '1-3 года'),
        (3, '3-5 лет'),
        (5, '5+ лет')
    ]
    
    # Размеры компаний
    COMPANY_SIZES = [
        ('1-10', '1-10 сотрудников'),
        ('11-50', '11-50 сотрудников'),
        ('51-200', '51-200 сотрудников'),
        ('201-500', '201-500 сотрудников'),
        ('500+', 'Более 500 сотрудников')
    ]
    
    # Отрасли
    INDUSTRIES = [
        'Информационные технологии',
        'Торговля и продажи',
        'Финансы и банки',
        'Производство',
        'Строительство',
        'Медицина и фармацевтика',
        'Образование',
        'Транспорт и логистика',
        'Нефть и газ',
        'Горнодобывающая промышленность',
        'Сельское хозяйство',
        'Туризм и гостиничное дело',
        'Реклама и маркетинг',
        'Консалтинг',
        'Другое'
    ]
    
    # Социальные сети для постинга
    SOCIAL_PLATFORMS = [
        ('instagram', 'Instagram'),
        ('telegram', 'Telegram'),
        ('tiktok', 'TikTok'),
        ('vk', 'ВКонтакте'),
        ('facebook', 'Facebook')
    ]
    
    # Причины жалоб
    REPORT_REASONS = [
        ('fraud', 'Мошенничество'),
        ('inappropriate', 'Неприемлемый контент'),
        ('spam', 'Спам'),
        ('fake_vacancy', 'Фиктивная вакансия'),
        ('discrimination', 'Дискриминация'),
        ('other', 'Другое')
    ]