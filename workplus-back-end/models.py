from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json

db = SQLAlchemy()

class User(db.Model):
    """Модель пользователя (соискатель или работодатель)"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Основная информация
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    city = db.Column(db.String(50))
    user_type = db.Column(db.String(20), nullable=False)  # candidate, employer
    
    # Профиль соискателя
    birth_date = db.Column(db.Date)
    gender = db.Column(db.String(10))
    education_level = db.Column(db.String(50))
    experience_years = db.Column(db.Integer)
    skills = db.Column(db.Text)  # JSON список навыков
    resume_url = db.Column(db.String(255))
    portfolio_url = db.Column(db.String(255))
    telegram_username = db.Column(db.String(50))
    
    # Связь с компанией (для работодателей)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'))
    position = db.Column(db.String(100))
    
    # Настройки
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    email_notifications = db.Column(db.Boolean, default=True)
    sms_notifications = db.Column(db.Boolean, default=True)
    
    # Служебная информация
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    verification_token = db.Column(db.String(100))
    reset_token = db.Column(db.String(100))
    reset_token_expires = db.Column(db.DateTime)
    
    # Связи
    company = db.relationship('Company', backref='employees')
    applications = db.relationship('JobApplication', backref='candidate', lazy='dynamic')
    posted_jobs = db.relationship('Job', backref='poster', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def get_skills_list(self):
        """Получить список навыков из JSON строки"""
        if self.skills:
            try:
                import json
                # Если skills уже список строк (старые данные), возвращаем как есть
                if isinstance(self.skills, list):
                    return self.skills
                # Если skills - JSON строка, парсим её
                return json.loads(self.skills)
            except (json.JSONDecodeError, TypeError):
                # Если не удалось распарсить как JSON, возвращаем как простую строку разделенную запятыми
                if isinstance(self.skills, str):
                    return [skill.strip() for skill in self.skills.split(',') if skill.strip()]
                return []
        return []

    def set_skills_list(self, skills_list):
        """Установить список навыков как JSON строку"""
        if skills_list:
            import json
            if isinstance(skills_list, list):
                # Если передан список, сохраняем как JSON
                self.skills = json.dumps(skills_list, ensure_ascii=False)
            elif isinstance(skills_list, str):
                # Если передана строка, разбиваем по запятым и сохраняем как JSON
                skills_array = [skill.strip() for skill in skills_list.split(',') if skill.strip()]
                self.skills = json.dumps(skills_array, ensure_ascii=False)
            else:
                self.skills = None
        else:
            self.skills = None
    
    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'email': self.email if include_sensitive else None,
            'name': self.name,
            'phone': self.phone if include_sensitive else None,
            'city': self.city,
            'user_type': self.user_type,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
        
        if self.user_type == 'candidate':
            data.update({
                'birth_date': self.birth_date.isoformat() if self.birth_date else None,
                'gender': self.gender,
                'education_level': self.education_level,
                'experience_years': self.experience_years,
                'skills': self.get_skills_list(),
                'resume_url': self.resume_url,
                'portfolio_url': self.portfolio_url,
                'telegram_username': self.telegram_username
            })
        
        if self.user_type == 'employer':
            data.update({
                'company_id': self.company_id,
                'position': self.position,
                'company': self.company.to_dict() if self.company else None
            })
        
        return data

class Company(db.Model):
    """Модель компании"""
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    
    # Контактная информация
    website = db.Column(db.String(255))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))
    city = db.Column(db.String(50))
    
    # О компании
    industry = db.Column(db.String(100))
    size = db.Column(db.String(20))  # 1-10, 11-50, 51-100, 101-500, 500+
    founded_year = db.Column(db.Integer)
    logo_url = db.Column(db.String(255))
    
    # Социальные сети
    instagram = db.Column(db.String(100))
    facebook = db.Column(db.String(100))
    linkedin = db.Column(db.String(100))
    telegram = db.Column(db.String(100))
    
    # Статус
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    rating = db.Column(db.Float, default=0.0)
    
    # Служебная информация
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Связи
    jobs = db.relationship('Job', backref='company', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'website': self.website,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'industry': self.industry,
            'size': self.size,
            'founded_year': self.founded_year,
            'logo_url': self.logo_url,
            'social_media': {
                'instagram': self.instagram,
                'facebook': self.facebook,
                'linkedin': self.linkedin,
                'telegram': self.telegram
            },
            'is_verified': self.is_verified,
            'rating': self.rating,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'jobs_count': self.jobs.filter_by(is_active=True).count()
        }

class Job(db.Model):
    """Модель вакансии"""
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    posted_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Основная информация
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    responsibilities = db.Column(db.Text)
    benefits = db.Column(db.Text)
    
    # Категоризация
    category = db.Column(db.String(50), nullable=False)
    employment_type = db.Column(db.String(20), nullable=False)  # full_time, part_time, contract, internship
    experience_level = db.Column(db.String(20))  # junior, middle, senior
    
    # Зарплата
    salary_min = db.Column(db.Integer)
    salary_max = db.Column(db.Integer)
    salary_currency = db.Column(db.String(5), default='KZT')
    salary_period = db.Column(db.String(10), default='month')  # hour, month, year
    
    # Местоположение
    city = db.Column(db.String(50))
    address = db.Column(db.String(255))
    remote_work = db.Column(db.Boolean, default=False)
    relocation = db.Column(db.Boolean, default=False)
    
    # Навыки и требования
    skills = db.Column(db.Text)  # JSON список навыков
    languages = db.Column(db.Text)  # JSON список языков
    education_required = db.Column(db.String(50))
    
    # Статус и настройки
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    is_urgent = db.Column(db.Boolean, default=False)
    auto_close_date = db.Column(db.Date)
    
    # Социальные сети публикации
    publish_to_instagram = db.Column(db.Boolean, default=False)
    publish_to_telegram = db.Column(db.Boolean, default=False)
    publish_to_facebook = db.Column(db.Boolean, default=False)
    publish_to_linkedin = db.Column(db.Boolean, default=False)
    published_urls = db.Column(db.Text)  # JSON со ссылками на посты
    
    # Статистика
    views_count = db.Column(db.Integer, default=0)
    applications_count = db.Column(db.Integer, default=0)
    
    # Служебная информация
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = db.Column(db.DateTime)
    expires_at = db.Column(db.DateTime)
    
    # Связи
    applications = db.relationship('JobApplication', backref='job', lazy='dynamic')
    
    def get_skills_list(self):
        """Получить список навыков"""
        if self.skills:
            try:
                return self.skills
            except:
                return []
        return []
    
    def set_skills_list(self, skills_list):
        """Установить список навыков"""
        self.skills = skills_list
    
    def get_languages_list(self):
        """Получить список языков"""
        if self.languages:
            try:
                return json.loads(self.languages)
            except:
                return []
        return []
    
    def set_languages_list(self, languages_list):
        """Установить список языков"""
        self.languages = json.dumps(languages_list)
    
    def get_published_urls(self):
        """Получить ссылки на публикации"""
        if self.published_urls:
            try:
                return json.loads(self.published_urls)
            except:
                return {}
        return {}
    
    def set_published_urls(self, urls_dict):
        """Установить ссылки на публикации"""
        self.published_urls = json.dumps(urls_dict)
    
    def get_salary_range(self):
        """Получить диапазон зарплаты в читаемом виде"""
        if self.salary_min and self.salary_max:
            return f"{self.salary_min:,} - {self.salary_max:,} {self.salary_currency}"
        elif self.salary_min:
            return f"от {self.salary_min:,} {self.salary_currency}"
        elif self.salary_max:
            return f"до {self.salary_max:,} {self.salary_currency}"
        return "По договоренности"
    
    def to_dict(self, include_applications=False):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'requirements': self.requirements,
            'responsibilities': self.responsibilities,
            'benefits': self.benefits,
            'category': self.category,
            'employment_type': self.employment_type,
            'experience_level': self.experience_level,
            'salary': {
                'min': self.salary_min,
                'max': self.salary_max,
                'currency': self.salary_currency,
                'period': self.salary_period,
                'display': self.get_salary_range()
            },
            'location': {
                'city': self.city,
                'address': self.address,
                'remote_work': self.remote_work,
                'relocation': self.relocation
            },
            'skills': self.get_skills_list(),
            'languages': self.get_languages_list(),
            'education_required': self.education_required,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'is_urgent': self.is_urgent,
            'auto_close_date': self.auto_close_date.isoformat() if self.auto_close_date else None,
            'social_publishing': {
                'instagram': self.publish_to_instagram,
                'telegram': self.publish_to_telegram,
                'facebook': self.publish_to_facebook,
                'linkedin': self.publish_to_linkedin,
                'published_urls': self.get_published_urls()
            },
            'stats': {
                'views': self.views_count,
                'applications': self.applications_count
            },
            'company': self.company.to_dict() if self.company else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        }
        
        if include_applications:
            data['applications'] = [app.to_dict() for app in self.applications.all()]
        
        return data

class JobApplication(db.Model):
    """Модель отклика на вакансию"""
    __tablename__ = 'job_applications'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Отклик
    cover_letter = db.Column(db.Text)
    resume_url = db.Column(db.String(255))
    portfolio_url = db.Column(db.String(255))
    expected_salary = db.Column(db.Integer)
    
    # Статус
    status = db.Column(db.String(20), default='pending')  # pending, viewed, interview, rejected, hired
    
    # Скоринг
    score = db.Column(db.Float, default=0.0)
    auto_score = db.Column(db.Float)  # Автоматический скор на основе навыков
    hr_score = db.Column(db.Float)    # Оценка HR
    
    # Заметки HR
    hr_notes = db.Column(db.Text)
    interview_date = db.Column(db.DateTime)
    interview_notes = db.Column(db.Text)
    
    # Служебная информация
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    viewed_at = db.Column(db.DateTime)
    responded_at = db.Column(db.DateTime)
    
    def to_dict(self, include_candidate=True):
        data = {
            'id': self.id,
            'job_id': self.job_id,
            'cover_letter': self.cover_letter,
            'resume_url': self.resume_url,
            'portfolio_url': self.portfolio_url,
            'expected_salary': self.expected_salary,
            'status': self.status,
            'score': self.score,
            'auto_score': self.auto_score,
            'hr_score': self.hr_score,
            'hr_notes': self.hr_notes,
            'interview_date': self.interview_date.isoformat() if self.interview_date else None,
            'interview_notes': self.interview_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'viewed_at': self.viewed_at.isoformat() if self.viewed_at else None,
            'responded_at': self.responded_at.isoformat() if self.responded_at else None
        }
        
        if include_candidate and self.candidate:
            data['candidate'] = self.candidate.to_dict()
        
        return data

class Admin(db.Model):
    """Модель администратора"""
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), default='admin')  # super_admin, admin, moderator
    
    # Статус
    is_active = db.Column(db.Boolean, default=True)
    
    # Служебная информация
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    created_by = db.Column(db.Integer, db.ForeignKey('admins.id'))
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class Settings(db.Model):
    """Модель настроек системы"""
    __tablename__ = 'settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text)
    value_type = db.Column(db.String(20), default='string')  # string, number, boolean, json
    category = db.Column(db.String(50), default='general')
    description = db.Column(db.String(255))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @staticmethod
    def get_setting(key, default=None):
        """Получить значение настройки"""
        setting = Settings.query.filter_by(key=key).first()
        if not setting:
            return default
        
        if setting.value_type == 'boolean':
            return setting.value.lower() in ('true', '1', 'yes')
        elif setting.value_type == 'number':
            try:
                return float(setting.value)
            except:
                return default
        elif setting.value_type == 'json':
            try:
                return json.loads(setting.value)
            except:
                return default
        
        return setting.value
    
    @staticmethod
    def update_setting(key, value, value_type='string', category='general', description=None):
        """Обновить настройку"""
        setting = Settings.query.filter_by(key=key).first()
        
        if setting:
            setting.value = str(value)
            setting.value_type = value_type
            setting.updated_at = datetime.utcnow()
        else:
            setting = Settings(
                key=key,
                value=str(value),
                value_type=value_type,
                category=category,
                description=description
            )
            db.session.add(setting)
        
        db.session.commit()
        return setting
    
    @staticmethod
    def get_settings_dict(category=None):
        """Получить словарь всех настроек"""
        query = Settings.query
        if category:
            query = query.filter_by(category=category)
        
        settings = query.all()
        result = {}
        
        for setting in settings:
            if setting.value_type == 'boolean':
                result[setting.key] = setting.value.lower() in ('true', '1', 'yes')
            elif setting.value_type == 'number':
                try:
                    result[setting.key] = float(setting.value)
                except:
                    result[setting.key] = setting.value
            elif setting.value_type == 'json':
                try:
                    result[setting.key] = json.loads(setting.value)
                except:
                    result[setting.key] = setting.value
            else:
                result[setting.key] = setting.value
        
        return result
    
    @staticmethod
    def init_default_settings():
        """Инициализация настроек по умолчанию"""
        default_settings = [
            # Основные настройки
            ('site_name', 'WorkPlus.kz', 'string', 'general', 'Название сайта'),
            ('site_description', 'HR-экосистема с мультиканальной дистрибуцией для Казахстана', 'string', 'general', 'Описание сайта'),
            ('admin_email', 'admin@workplus.kz', 'string', 'general', 'Email администратора'),
            ('support_email', 'support@workplus.kz', 'string', 'general', 'Email поддержки'),
            
            # Настройки размещения вакансий
            ('free_jobs_limit', '3', 'number', 'jobs', 'Лимит бесплатных вакансий в месяц'),
            ('job_auto_close_days', '30', 'number', 'jobs', 'Автозакрытие вакансий через N дней'),
            ('featured_job_price', '15000', 'number', 'pricing', 'Цена размещения в топе (тенге)'),
            ('urgent_job_price', '10000', 'number', 'pricing', 'Цена срочной вакансии (тенге)'),
            
            # Социальные сети
            ('instagram_enabled', 'true', 'boolean', 'social', 'Публикация в Instagram'),
            ('telegram_enabled', 'true', 'boolean', 'social', 'Публикация в Telegram'),
            ('facebook_enabled', 'false', 'boolean', 'social', 'Публикация в Facebook'),
            ('linkedin_enabled', 'false', 'boolean', 'social', 'Публикация в LinkedIn'),
            
            # Модерация
            ('auto_approve_companies', 'false', 'boolean', 'moderation', 'Автоодобрение компаний'),
            ('auto_approve_jobs', 'false', 'boolean', 'moderation', 'Автоодобрение вакансий'),
            ('require_phone_verification', 'true', 'boolean', 'verification', 'Требовать верификацию телефона'),
            
            # Уведомления
            ('email_notifications', 'true', 'boolean', 'notifications', 'Email уведомления'),
            ('sms_notifications', 'false', 'boolean', 'notifications', 'SMS уведомления'),
            ('telegram_notifications', 'true', 'boolean', 'notifications', 'Telegram уведомления'),
            
            # Тарифные планы
            ('tariff_start_price', '25000', 'number', 'pricing', 'Тариф Start (тенге/мес)'),
            ('tariff_growth_price', '150000', 'number', 'pricing', 'Тариф Growth (тенге/мес)'),
            ('tariff_pro_price', '400000', 'number', 'pricing', 'Тариф Pro (тенге/мес)'),
            
            # Скоринг
            ('scoring_enabled', 'true', 'boolean', 'scoring', 'Включить скоринг кандидатов'),
            ('auto_scoring_threshold', '0.7', 'number', 'scoring', 'Порог автоскоринга'),
        ]
        
        for key, value, value_type, category, description in default_settings:
            existing = Settings.query.filter_by(key=key).first()
            if not existing:
                setting = Settings(
                    key=key,
                    value=value,
                    value_type=value_type,
                    category=category,
                    description=description
                )
                db.session.add(setting)
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Ошибка инициализации настроек: {e}")

class SocialPost(db.Model):
    """Модель публикаций в социальных сетях"""
    __tablename__ = 'social_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    platform = db.Column(db.String(20), nullable=False)  # instagram, telegram, facebook, linkedin
    post_id = db.Column(db.String(100))  # ID поста в соцсети
    post_url = db.Column(db.String(255))
    
    # Контент
    caption = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    hashtags = db.Column(db.Text)
    
    # Статус
    status = db.Column(db.String(20), default='pending')  # pending, published, failed, deleted
    error_message = db.Column(db.Text)
    
    # Статистика
    views_count = db.Column(db.Integer, default=0)
    likes_count = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    shares_count = db.Column(db.Integer, default=0)
    
    # Служебная информация
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    published_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Связи
    job = db.relationship('Job', backref='social_posts')
    
    def to_dict(self):
        return {
            'id': self.id,
            'job_id': self.job_id,
            'platform': self.platform,
            'post_id': self.post_id,
            'post_url': self.post_url,
            'caption': self.caption,
            'image_url': self.image_url,
            'hashtags': self.hashtags,
            'status': self.status,
            'error_message': self.error_message,
            'stats': {
                'views': self.views_count,
                'likes': self.likes_count,
                'comments': self.comments_count,
                'shares': self.shares_count
            },
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'published_at': self.published_at.isoformat() if self.published_at else None
        }

class Analytics(db.Model):
    """Модель аналитики"""
    __tablename__ = 'analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    metric_type = db.Column(db.String(50), nullable=False)  # job_views, applications, registrations
    entity_id = db.Column(db.Integer)  # ID вакансии, компании и т.д.
    entity_type = db.Column(db.String(20))  # job, company, user
    value = db.Column(db.Integer, default=0)
    
    # Дополнительные данные
    meta_data = db.Column(db.Text)  # JSON с дополнительной информацией
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    @staticmethod
    def track_metric(metric_type, entity_id=None, entity_type=None, value=1, meta_data=None):
        """Трек метрики"""
        try:
            today = datetime.utcnow().date()
            
            # Ищем существующую запись за сегодня
            existing = Analytics.query.filter_by(
                date=today,
                metric_type=metric_type,
                entity_id=entity_id,
                entity_type=entity_type
            ).first()
            
            if existing:
                existing.value += value
                if meta_data:
                    existing.meta_data = json.dumps(meta_data)
            else:
                new_metric = Analytics(
                    date=today,
                    metric_type=metric_type,
                    entity_id=entity_id,
                    entity_type=entity_type,
                    value=value,
                    meta_data=json.dumps(meta_data) if meta_data else None
                )
                db.session.add(new_metric)
            
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Ошибка трекинга метрики: {e}")
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'metric_type': self.metric_type,
            'entity_id': self.entity_id,
            'entity_type': self.entity_type,
            'value': self.value,
            'meta_data': json.loads(self.meta_data) if self.meta_data else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }