from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
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
    user_type = db.Column(db.String(20), nullable=False)  # candidate, employer, admin
    
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
    posted_jobs = db.relationship(
        'Job',
        foreign_keys='Job.posted_by',
        back_populates='poster',
        cascade='all, delete-orphan',
        lazy='dynamic'
    )

    moderated_jobs = db.relationship(
        'Job',
        foreign_keys='Job.moderated_by_id',
        back_populates='moderator',
        lazy='dynamic'
    )
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def get_skills_list(self):
        if self.skills:
            try:
                if isinstance(self.skills, list):
                    return self.skills
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
    
    # Контактное лицо
    contact_name = db.Column(db.String(200))  # ФИО контактного лица
    contact_position = db.Column(db.String(100))  # Должность контактного лица
    contact_phone = db.Column(db.String(20))  # Телефон контактного лица
    contact_email = db.Column(db.String(120))  # Email контактного лица
    
    # Социальные сети
    instagram = db.Column(db.String(100))
    facebook = db.Column(db.String(100))
    linkedin = db.Column(db.String(100))
    telegram = db.Column(db.String(100))
    
    # Настройки
    is_public = db.Column(db.Boolean, default=True)  # Публичный профиль
    email_notifications = db.Column(db.Boolean, default=True)  # Email уведомления
    sms_notifications = db.Column(db.Boolean, default=True)  # SMS уведомления
    auto_reply = db.Column(db.Boolean, default=True)  # Автоответ
    
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
            'contact_person': {
                'name': self.contact_name,
                'position': self.contact_position,
                'phone': self.contact_phone,
                'email': self.contact_email
            },
            'social_media': {
                'instagram': self.instagram,
                'facebook': self.facebook,
                'linkedin': self.linkedin,
                'telegram': self.telegram
            },
            'settings': {
                'is_public': self.is_public,
                'email_notifications': self.email_notifications,
                'sms_notifications': self.sms_notifications,
                'auto_reply': self.auto_reply
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

    #модерация
    moderation_status = db.Column(db.String(20), default="pending")  # pending|approved|rejected
    moderation_comment = db.Column(db.Text, nullable=True)
    moderated_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    moderated_at = db.Column(db.DateTime, nullable=True)
    
    # Связи
    applications = db.relationship('JobApplication', backref='job', lazy='dynamic')

    poster = db.relationship(
        'User',
        foreign_keys=[posted_by],
        back_populates='posted_jobs'
    )
    moderator = db.relationship(
        'User',
        foreign_keys=[moderated_by_id],
        back_populates='moderated_jobs'
    )
    
    def get_skills_list(self):
        """Получить список навыков"""
        if self.skills:
            try:
                return self.skills
            except:
                return []
        return []
    
    def set_skills_list(self, skills_list):
        if skills_list:
            import json
            if isinstance(skills_list, list):
                self.skills = json.dumps(skills_list, ensure_ascii=False)
            elif isinstance(skills_list, str):
                skills_array = [skill.strip() for skill in skills_list.split(',') if skill.strip()]
                self.skills = json.dumps(skills_array, ensure_ascii=False)
            else:
                self.skills = None
        else:
            self.skills = None
    
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
        # Парсим JSON поля
        def parse_json_field(field_value):
            if not field_value:
                return []
            if isinstance(field_value, str):
                try:
                    return json.loads(field_value)
                except:
                    # Если не JSON, то разбиваем по строкам
                    return [line.strip() for line in field_value.split('\n') if line.strip()]
            return field_value if isinstance(field_value, list) else []
        
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'requirements': parse_json_field(self.requirements),
            'responsibilities': parse_json_field(self.responsibilities),
            'benefits': parse_json_field(self.benefits),
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
            'moderation': {
                'status': self.moderation_status,
                'moderator': self.moderator.to_dict() if self.moderator else None,
                'comment': self.moderation_comment,
                'moderated_at': self.moderated_at.isoformat() if self.moderated_at else None
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
    status = db.Column(db.String(20), default='new')  # new, approved, rejected
    
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
    def track_metric(metric_type, entity_id=None, entity_type=None, value=1, meta_data=None, metric_date=None):
        """Трек метрики"""
        try:
            day = metric_date or datetime.utcnow().date()

            existing = Analytics.query.filter_by(
                date=day,
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
                    date=day,
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

class CandidateProfile(db.Model):
    """Расширенный профиль кандидата"""
    __tablename__ = 'candidate_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # Личная информация
    birth_date = db.Column(db.Date)
    current_position = db.Column(db.String(200))
    desired_position = db.Column(db.String(200))
    
    # Зарплатные ожидания
    salary_from = db.Column(db.Integer)
    salary_to = db.Column(db.Integer)
    salary_currency = db.Column(db.String(3), default='KZT')
    
    # Опыт работы
    experience_years = db.Column(db.Integer, default=0)
    work_schedule = db.Column(db.String(50), default='full_time')  # full_time, part_time, remote, hybrid
    
    # Описание
    about = db.Column(db.Text)
    
    # Настройки приватности
    is_public = db.Column(db.Boolean, default=True)
    show_contacts = db.Column(db.Boolean, default=True)
    
    # Настройки уведомлений
    email_notifications = db.Column(db.Boolean, default=True)
    sms_notifications = db.Column(db.Boolean, default=False)
    job_alerts = db.Column(db.Boolean, default=True)
    
    # Файлы
    resume_file = db.Column(db.String(255))
    
    # Метаданные
    profile_views = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Связи
    user = db.relationship('User', backref=db.backref('candidate_profile', uselist=False))
    skills = db.relationship('Skill', backref='candidate_profile', lazy='dynamic', cascade='all, delete-orphan')
    education = db.relationship('Education', backref='candidate_profile', lazy='dynamic', cascade='all, delete-orphan')
    work_experience = db.relationship('WorkExperience', backref='candidate_profile', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'current_position': self.current_position,
            'desired_position': self.desired_position,
            'salary_from': self.salary_from,
            'salary_to': self.salary_to,
            'salary_currency': self.salary_currency,
            'experience_years': self.experience_years,
            'work_schedule': self.work_schedule,
            'about': self.about,
            'is_public': self.is_public,
            'show_contacts': self.show_contacts,
            'email_notifications': self.email_notifications,
            'sms_notifications': self.sms_notifications,
            'job_alerts': self.job_alerts,
            'resume_file': self.resume_file,
            'profile_views': self.profile_views,
            'last_updated': self.last_updated.isoformat(),
            'created_at': self.created_at.isoformat()
        }

class Skill(db.Model):
    """Навыки кандидата"""
    __tablename__ = 'candidate_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_profile_id = db.Column(db.Integer, db.ForeignKey('candidate_profiles.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.String(50))  # beginner, intermediate, advanced, expert
    years_experience = db.Column(db.Integer)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'level': self.level,
            'years_experience': self.years_experience,
            'is_verified': self.is_verified
        }

class Education(db.Model):
    """Образование кандидата"""
    __tablename__ = 'candidate_education'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_profile_id = db.Column(db.Integer, db.ForeignKey('candidate_profiles.id'), nullable=False)
    
    institution = db.Column(db.String(200), nullable=False)
    specialty = db.Column(db.String(200))
    degree = db.Column(db.String(100))  # Среднее, Среднее специальное, Высшее, Магистратура, Аспирантура
    
    start_year = db.Column(db.Integer)
    end_year = db.Column(db.Integer)
    is_current = db.Column(db.Boolean, default=False)
    
    gpa = db.Column(db.Float)
    description = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'institution': self.institution,
            'specialty': self.specialty,
            'degree': self.degree,
            'start_year': self.start_year,
            'end_year': self.end_year,
            'is_current': self.is_current,
            'gpa': self.gpa,
            'description': self.description,
            'period': f"{self.start_year or ''}-{self.end_year or 'по н.в.' if self.is_current else ''}"
        }

class WorkExperience(db.Model):
    """Опыт работы кандидата"""
    __tablename__ = 'candidate_work_experience'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_profile_id = db.Column(db.Integer, db.ForeignKey('candidate_profiles.id'), nullable=False)
    
    company_name = db.Column(db.String(200), nullable=False)
    position = db.Column(db.String(200), nullable=False)
    
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    is_current = db.Column(db.Boolean, default=False)
    
    description = db.Column(db.Text)
    achievements = db.Column(db.Text)
    
    # Дополнительная информация
    industry = db.Column(db.String(100))
    company_size = db.Column(db.String(50))
    employment_type = db.Column(db.String(50))  # full_time, part_time, contract, internship
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'company_name': self.company_name,
            'position': self.position,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'is_current': self.is_current,
            'description': self.description,
            'achievements': self.achievements,
            'industry': self.industry,
            'company_size': self.company_size,
            'employment_type': self.employment_type,
            'period': f"{self.start_date.strftime('%m.%Y') if self.start_date else ''}-{self.end_date.strftime('%m.%Y') if self.end_date else 'по н.в.' if self.is_current else ''}"
        }

class ResumeResponse(db.Model):
    """Отклики работодателей на резюме кандидатов"""
    __tablename__ = 'resume_responses'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    employer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'))  # Может быть null если общий отклик
    
    position_offered = db.Column(db.String(200), nullable=False)
    salary_from = db.Column(db.Integer)
    salary_to = db.Column(db.Integer)
    salary_currency = db.Column(db.String(3), default='KZT')
    
    message = db.Column(db.Text, nullable=False)
    contact_person = db.Column(db.String(200))
    contact_phone = db.Column(db.String(20))
    contact_email = db.Column(db.String(120))
    
    status = db.Column(db.String(50), default='new')  # new, viewed, accepted, declined, interview
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    viewed_at = db.Column(db.DateTime)
    responded_at = db.Column(db.DateTime)
    
    # Связи
    candidate = db.relationship('User', foreign_keys=[candidate_id], backref='resume_responses_received')
    employer = db.relationship('User', foreign_keys=[employer_id], backref='resume_responses_sent')
    company = db.relationship('Company', backref='resume_responses')
    job = db.relationship('Job', backref='resume_responses')
    
    def to_dict(self):
        return {
            'id': self.id,
            'company_name': self.company.name if self.company else None,
            'company_id': self.company_id,
            'position': self.position_offered,
            'salary': f"{self.salary_from}-{self.salary_to}" if self.salary_from else None,
            'location': self.company.city if self.company else None,
            'message': self.message,
            'contact_person': self.contact_person,
            'phone': self.contact_phone,
            'email': self.contact_email,
            'status': self.status,
            'contact_date': self.created_at.isoformat(),
            'company_rating': self.company.rating if self.company else None
        }

class ProfileView(db.Model):
    """Просмотры профилей кандидатов"""
    __tablename__ = 'profile_views'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    viewer_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # Может быть null для анонимных просмотров
    viewer_company_id = db.Column(db.Integer, db.ForeignKey('companies.id'))
    
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    referrer = db.Column(db.String(500))
    
    viewed_at = db.Column(db.DateTime, default=datetime.utcnow)
    session_duration = db.Column(db.Integer)  # в секундах
    
    # Связи
    candidate = db.relationship('User', foreign_keys=[candidate_id], backref='profile_views')
    viewer = db.relationship('User', foreign_keys=[viewer_id], backref='viewed_profiles')
    company = db.relationship('Company', backref='profile_views')
    
    def to_dict(self):
        return {
            'id': self.id,
            'viewer_company': self.company.name if self.company else 'Анонимный просмотр',
            'viewed_at': self.viewed_at.isoformat(),
            'session_duration': self.session_duration
        }

class SavedCandidate(db.Model):
    """Сохраненные кандидаты работодателями"""
    __tablename__ = 'saved_candidates'
    
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    notes = db.Column(db.Text)
    rating = db.Column(db.Integer)  # 1-5 звезд
    tags = db.Column(db.String(500))  # Теги через запятую
    
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_contacted = db.Column(db.DateTime)
    
    # Связи
    employer = db.relationship('User', foreign_keys=[employer_id], backref='saved_candidates')
    candidate = db.relationship('User', foreign_keys=[candidate_id], backref='saved_by_employers')
    
    # Уникальность
    __table_args__ = (db.UniqueConstraint('employer_id', 'candidate_id', name='unique_saved_candidate'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'candidate_id': self.candidate_id,
            'candidate_name': f"{self.candidate.first_name} {self.candidate.last_name}",
            'notes': self.notes,
            'rating': self.rating,
            'tags': self.tags.split(',') if self.tags else [],
            'saved_at': self.saved_at.isoformat(),
            'last_contacted': self.last_contacted.isoformat() if self.last_contacted else None
        }

# Добавляем новые поля в существующую модель User, если их нет
def extend_user_model():
    """Расширяем модель User дополнительными полями"""
    # Эти поля должны быть добавлены в основную модель User через миграции
    pass

# Дополнительные методы для User модели (можно добавить через monkey patching или наследование)
def get_candidate_profile_dict(user):
    if user.user_type != 'candidate':
        return None

    profile = user.candidate_profile
    if not profile:
        return None

    try:
        recent_views = user.profile_views.order_by(ProfileView.viewed_at.desc()).limit(10).all()
    except AttributeError:
        recent_views = (
            ProfileView.query
            .filter_by(candidate_id=user.id)
            .order_by(ProfileView.viewed_at.desc())
            .limit(10)
            .all()
        )

    # applications и resume_responses_received могут быть либо Query, либо List
    def safe_count(rel):
        if rel is None:
            return 0
        try:
            return rel.count()  # для lazy="dynamic" (AppenderQuery)
        except Exception:
            return len(rel)     # для обычных списков


    return {
        'profile': profile.to_dict(),
        'skills': [s.to_dict() for s in profile.skills],
        'education': [e.to_dict() for e in profile.education],
        'work_experience': [w.to_dict() for w in profile.work_experience],
        'recent_views': [v.to_dict() for v in recent_views],
        'applications_count': safe_count(user.applications),
    'responses_count': safe_count(user.resume_responses_received),
    }


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    type = db.Column(db.String(50), nullable=False)  # application_accepted, interview_scheduled и т.д.
    message = db.Column(db.String(255), nullable=False)

    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=True)
    job_title = db.Column(db.String(255), nullable=True)
    company_name = db.Column(db.String(255), nullable=True)
    chat_id = db.Column(db.Integer, nullable=True)
    interview_date = db.Column(db.DateTime, nullable=True)

    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "message": self.message,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat(),
            "job_id": self.job_id,
            "job_title": self.job_title,
            "company_name": self.company_name,
            "chat_id": self.chat_id,
            "interview_date": self.interview_date.isoformat() if self.interview_date else None,
        }
    
class SavedJob(db.Model):
    """Модель сохраненных вакансий"""
    __tablename__ = 'saved_jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Уникальная комбинация пользователь-вакансия
    __table_args__ = (db.UniqueConstraint('user_id', 'job_id'),)

class Contact(db.Model):
    __tablename__ = 'contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'company': self.company,
            'message': self.message,
            'created_at': self.created_at.isoformat()
        }
    
class Resume(db.Model):
    __tablename__ = "resumes"
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(50))
    city = db.Column(db.String(100))
    date_of_birth = db.Column(db.String(20))
    photo = db.Column(db.String(255))  # путь/URL до фото
    
    position = db.Column(db.String(100))
    salary = db.Column(db.String(50))
    work_format = db.Column(db.String(50))
    ready_to_relocate = db.Column(db.Boolean, default=False)
    
    summary = db.Column(db.Text)

    # связи
    experience = db.relationship("ResumeExperience", backref="resume", cascade="all, delete-orphan")
    education = db.relationship("ResumeEducation", backref="resume", cascade="all, delete-orphan")
    skills = db.relationship("ResumeSkill", backref="resume", cascade="all, delete-orphan")
    languages = db.relationship("ResumeLanguage", backref="resume", cascade="all, delete-orphan")
    courses = db.relationship("ResumeCourse", backref="resume", cascade="all, delete-orphan")


class ResumeExperience(db.Model):
    __tablename__ = "resume_experience"
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id"))
    company = db.Column(db.String(120))
    position = db.Column(db.String(120))
    start_date = db.Column(db.String(20))
    end_date = db.Column(db.String(20))
    current = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text)



class ResumeSkill(db.Model):
    __tablename__ = "resume_skills"
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id"))
    name = db.Column(db.String(100))


class ResumeEducation(db.Model):
    __tablename__ = "resume_education"
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id"))
    institution = db.Column(db.String(120))
    degree = db.Column(db.String(120))
    field = db.Column(db.String(120))
    start_year = db.Column(db.String(10))
    end_year = db.Column(db.String(10))
    current = db.Column(db.Boolean, default=False)



class ResumeLanguage(db.Model):
    __tablename__ = "resume_languages"
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id"))
    name = db.Column(db.String(100))
    level = db.Column(db.String(50))



class ResumeCourse(db.Model):
    __tablename__ = "resume_courses"
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id"))
    name = db.Column(db.String(120))
    organization = db.Column(db.String(120))
    year = db.Column(db.String(10))
    certificate = db.Column(db.String(120))

class JobTemplate(db.Model):
    """Шаблон вакансии (для админов)"""
    __tablename__ = 'job_templates'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    responsibilities = db.Column(db.Text)
    conditions = db.Column(db.Text)

    category = db.Column(db.String(50), nullable=False)
    salary_min = db.Column(db.Integer)
    salary_max = db.Column(db.Integer)
    salary_currency = db.Column(db.String(5), default="KZT")

    tags = db.Column(db.Text)  # JSON список тегов

    usage_count = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)
    success_rate = db.Column(db.Integer, default=0)

    status = db.Column(db.String(20), default="active")  # active/draft
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_tags(self):
        import json
        if self.tags:
            try:
                return json.loads(self.tags)
            except:
                return [t.strip() for t in self.tags.split(",")]
        return []

    def set_tags(self, tags_list):
        import json
        self.tags = json.dumps(tags_list, ensure_ascii=False) if tags_list else None

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "requirements": self.requirements.split("\n") if self.requirements else [],
            "responsibilities": self.responsibilities.split("\n") if self.responsibilities else [],
            "conditions": self.conditions.split("\n") if self.conditions else [],
            "category": self.category,
            "salary": {
                "min": self.salary_min,
                "max": self.salary_max,
                "currency": self.salary_currency
            },
            "tags": self.get_tags(),
            "usageCount": self.usage_count,
            "rating": self.rating,
            "successRate": self.success_rate,
            "status": self.status,
            "lastUpdated": self.last_updated.isoformat() if self.last_updated else None,
        }

class BlogPost(db.Model):
    __tablename__ = 'blog_posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    excerpt = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)

    category_id = db.Column(db.Integer, db.ForeignKey("blog_categories.id"))
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    is_approved = db.Column(db.Boolean, nullable=True, default=None)  
    is_active = db.Column(db.Boolean, default=True)

    image_url = db.Column(db.String(255))
    read_time = db.Column(db.String(20))
    is_featured = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # связи
    author = db.relationship("User", backref="blog_posts")
    category = db.relationship("BlogCategory", backref="posts")
    tags = db.relationship("BlogTag", secondary="blog_post_tags", back_populates="posts")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "excerpt": self.excerpt,
            "content": self.content,
            "author": self.author.name if self.author else None,
            "category": self.category.name if self.category else None,
            "tags": [t.name for t in self.tags],
            "image": self.image_url,
            "read_time": self.read_time,
            "is_featured": self.is_featured,
            "created_at": self.created_at.isoformat(),
            "is_approved": self.is_approved
        }

class BlogCategory(db.Model):
    __tablename__ = "blog_categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

blog_post_tags = db.Table(
    "blog_post_tags",
    db.Column("post_id", db.Integer, db.ForeignKey("blog_posts.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("blog_tags.id"), primary_key=True)
)

class BlogTag(db.Model):
    __tablename__ = "blog_tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    posts = db.relationship("BlogPost", secondary=blog_post_tags, back_populates="tags")
