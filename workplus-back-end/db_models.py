import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from enum import Enum

db = SQLAlchemy()

# Enum классы для статусов
class VacancyStatus(Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    CLOSED = "closed"
    FILLED = "filled"

class ApplicationStatus(Enum):
    NEW = "new"
    VIEWED = "viewed"
    SCREENING = "screening"
    INTERVIEW_SCHEDULED = "interview_scheduled"
    INTERVIEWED = "interviewed"
    OFFER_SENT = "offer_sent"
    HIRED = "hired"
    REJECTED = "rejected"

class SubscriptionTier(Enum):
    FREE = "free"
    START = "start"
    GROWTH = "growth"
    PRO = "pro"

# Основные модели пользователей
class User(UserMixin, db.Model):
    """Модель соискателя"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Персональная информация
    full_name = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    birth_date = db.Column(db.Date, nullable=True)
    iin = db.Column(db.String(12), unique=True, nullable=True)  # ИИН для верификации
    
    # Профиль
    avatar_path = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    experience_years = db.Column(db.Integer, default=0)
    desired_salary_from = db.Column(db.Integer, nullable=True)
    desired_salary_to = db.Column(db.Integer, nullable=True)
    resume_file = db.Column(db.String(255), nullable=True)
    
    # Статистика и рейтинг
    rating = db.Column(db.Float, default=0.0)
    rating_count = db.Column(db.Integer, default=0)
    views_count = db.Column(db.Integer, default=0)
    is_verified = db.Column(db.Boolean, default=False)
    
    # Настройки уведомлений
    notifications_email = db.Column(db.Boolean, default=True)
    notifications_sms = db.Column(db.Boolean, default=True)
    notifications_telegram = db.Column(db.Boolean, default=False)
    telegram_chat_id = db.Column(db.String(50), nullable=True)
    
    # Системные поля
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Связи
    skills = db.relationship('UserSkill', back_populates='user', cascade='all, delete-orphan')
    applications = db.relationship('Application', back_populates='user', cascade='all, delete-orphan')
    test_results = db.relationship('UserTestResult', back_populates='user')
    ratings_given = db.relationship('EmployerRating', foreign_keys='EmployerRating.user_id', back_populates='user')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def get_id(self):
        return str(self.id)
    
    def update_rating(self, new_rating):
        """Обновление рейтинга пользователя"""
        if self.rating_count == 0:
            self.rating = new_rating
        else:
            total_rating = self.rating * self.rating_count
            self.rating = (total_rating + new_rating) / (self.rating_count + 1)
        self.rating_count += 1
        db.session.commit()

class Employer(UserMixin, db.Model):
    """Модель работодателя"""
    __tablename__ = 'employers'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Информация о компании
    company_name = db.Column(db.String(200), nullable=False)
    company_description = db.Column(db.Text, nullable=True)
    company_website = db.Column(db.String(200), nullable=True)
    company_size = db.Column(db.String(50), nullable=True)  # 1-10, 11-50, 51-200, 200+
    industry = db.Column(db.String(100), nullable=True)
    
    # Контактная информация
    contact_person = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    address = db.Column(db.Text, nullable=True)
    
    # Верификация и документы
    bin_number = db.Column(db.String(20), unique=True, nullable=True)  # БИН компании
    license_file = db.Column(db.String(255), nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    verification_date = db.Column(db.DateTime, nullable=True)
    
    # Подписка и тарифы
    subscription_tier = db.Column(db.Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    subscription_start = db.Column(db.DateTime, nullable=True)
    subscription_end = db.Column(db.DateTime, nullable=True)
    vacancies_limit = db.Column(db.Integer, default=1)  # Лимит вакансий по тарифу
    used_vacancies = db.Column(db.Integer, default=0)
    
    # Статистика и рейтинг
    rating = db.Column(db.Float, default=0.0)
    rating_count = db.Column(db.Integer, default=0)
    total_hired = db.Column(db.Integer, default=0)
    
    # Соцсети для продвижения
    instagram_account = db.Column(db.String(100), nullable=True)
    telegram_channel = db.Column(db.String(100), nullable=True)
    tiktok_account = db.Column(db.String(100), nullable=True)
    
    # Системные поля
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Связи
    vacancies = db.relationship('Vacancy', back_populates='employer', cascade='all, delete-orphan')
    ratings_received = db.relationship('EmployerRating', back_populates='employer')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def get_id(self):
        return f"employer:{self.id}"
    
    def can_create_vacancy(self):
        """Проверка возможности создания новой вакансии"""
        return self.used_vacancies < self.vacancies_limit
    
    def update_rating(self, new_rating):
        """Обновление рейтинга работодателя"""
        if self.rating_count == 0:
            self.rating = new_rating
        else:
            total_rating = self.rating * self.rating_count
            self.rating = (total_rating + new_rating) / (self.rating_count + 1)
        self.rating_count += 1
        db.session.commit()

class Admin(UserMixin, db.Model):
    """Модель администратора"""
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), default='admin')  # admin, moderator, super_admin
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def get_id(self):
        return f"admin:{self.id}"

# Модели для вакансий и откликов
class Vacancy(db.Model):
    """Модель вакансии"""
    __tablename__ = 'vacancies'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Основная информация
    title = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text, nullable=True)
    responsibilities = db.Column(db.Text, nullable=True)
    benefits = db.Column(db.Text, nullable=True)
    
    # Условия работы
    salary_from = db.Column(db.Integer, nullable=True)
    salary_to = db.Column(db.Integer, nullable=True)
    salary_currency = db.Column(db.String(10), default='KZT')
    employment_type = db.Column(db.String(50), nullable=False)  # full_time, part_time, contract, internship
    schedule = db.Column(db.String(100), nullable=True)  # График работы
    experience_required = db.Column(db.Integer, default=0)  # Опыт в годах
    
    # Локация
    city = db.Column(db.String(50), nullable=False, index=True)
    address = db.Column(db.Text, nullable=True)
    remote_work = db.Column(db.Boolean, default=False)
    
    # Категоризация
    category_id = db.Column(db.Integer, db.ForeignKey('vacancy_categories.id'), nullable=True)
    subcategory = db.Column(db.String(100), nullable=True)
    tags = db.Column(db.Text, nullable=True)  # JSON строка с тегами
    
    # Статус и управление
    status = db.Column(db.Enum(VacancyStatus), default=VacancyStatus.DRAFT)
    priority = db.Column(db.Integer, default=0)  # Для поднятия в поиске
    featured = db.Column(db.Boolean, default=False)  # Премиум размещение
    
    # Статистика
    views_count = db.Column(db.Integer, default=0)
    applications_count = db.Column(db.Integer, default=0)
    hired_count = db.Column(db.Integer, default=0)
    
    # Публикация и продвижение
    published_at = db.Column(db.DateTime, nullable=True)
    expires_at = db.Column(db.DateTime, nullable=True)
    auto_repost = db.Column(db.Boolean, default=False)  # Автоматический репост в соцсети
    social_media_posted = db.Column(db.Boolean, default=False)
    
    # Системные поля
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Связи
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=False)
    employer = db.relationship('Employer', back_populates='vacancies')
    category = db.relationship('VacancyCategory', backref='vacancies')
    applications = db.relationship('Application', back_populates='vacancy', cascade='all, delete-orphan')
    required_skills = db.relationship('VacancySkill', back_populates='vacancy', cascade='all, delete-orphan')
    tests = db.relationship('VacancyTest', back_populates='vacancy', cascade='all, delete-orphan')
    
    def increment_views(self):
        """Увеличение счетчика просмотров"""
        self.views_count += 1
        db.session.commit()
    
    def get_matching_score(self, user):
        """Расчет совместимости вакансии с кандидатом (простая версия)"""
        score = 0
        
        # Совпадение по городу
        if self.city.lower() == user.city.lower():
            score += 20
            
        # Проверка опыта
        if user.experience_years >= self.experience_required:
            score += 30
        elif user.experience_years >= self.experience_required - 1:
            score += 15
            
        # Совпадение навыков (упрощенная логика)
        user_skills = [skill.skill.name.lower() for skill in user.skills]
        vacancy_skills = [skill.skill.name.lower() for skill in self.required_skills]
        
        if vacancy_skills:
            matching_skills = len(set(user_skills) & set(vacancy_skills))
            skill_score = min(50, (matching_skills / len(vacancy_skills)) * 50)
            score += skill_score
            
        return min(100, score)

class VacancyCategory(db.Model):
    """Категории вакансий"""
    __tablename__ = 'vacancy_categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)

class Application(db.Model):
    """Модель отклика на вакансию"""
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Связи
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vacancy_id = db.Column(db.Integer, db.ForeignKey('vacancies.id'), nullable=False)
    user = db.relationship('User', back_populates='applications')
    vacancy = db.relationship('Vacancy', back_populates='applications')
    
    # Статус отклика
    status = db.Column(db.Enum(ApplicationStatus), default=ApplicationStatus.NEW)
    cover_letter = db.Column(db.Text, nullable=True)  # Сопроводительное письмо
    
    # Процесс найма
    viewed_by_employer = db.Column(db.Boolean, default=False)
    viewed_at = db.Column(db.DateTime, nullable=True)
    interview_scheduled_at = db.Column(db.DateTime, nullable=True)
    interview_notes = db.Column(db.Text, nullable=True)
    rejection_reason = db.Column(db.Text, nullable=True)
    
    # Системные поля
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Связи с тестами
    test_results = db.relationship('UserTestResult', back_populates='application')
    
    def mark_as_viewed(self):
        """Отметить отклик как просмотренный"""
        if not self.viewed_by_employer:
            self.viewed_by_employer = True
            self.viewed_at = datetime.datetime.utcnow()
            if self.status == ApplicationStatus.NEW:
                self.status = ApplicationStatus.VIEWED
            db.session.commit()

# Модели для навыков и тестирования
class Skill(db.Model):
    """Справочник навыков"""
    __tablename__ = 'skills'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True, index=True)
    category = db.Column(db.String(50), nullable=True)  # technical, soft, language
    description = db.Column(db.Text, nullable=True)
    is_verified = db.Column(db.Boolean, default=False)  # Проверяется ли тестами
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class UserSkill(db.Model):
    """Навыки пользователя"""
    __tablename__ = 'user_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    level = db.Column(db.Integer, default=1)  # 1-5 уровень владения
    years_experience = db.Column(db.Integer, default=0)
    is_verified = db.Column(db.Boolean, default=False)  # Подтвержден тестом
    verified_at = db.Column(db.DateTime, nullable=True)
    
    # Связи
    user = db.relationship('User', back_populates='skills')
    skill = db.relationship('Skill', backref='user_skills')

class VacancySkill(db.Model):
    """Требуемые навыки для вакансии"""
    __tablename__ = 'vacancy_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    vacancy_id = db.Column(db.Integer, db.ForeignKey('vacancies.id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    required_level = db.Column(db.Integer, default=1)  # Минимальный уровень
    is_required = db.Column(db.Boolean, default=False)  # Обязательный навык
    
    # Связи
    vacancy = db.relationship('Vacancy', back_populates='required_skills')
    skill = db.relationship('Skill', backref='vacancy_requirements')

class Test(db.Model):
    """Тесты для проверки навыков"""
    __tablename__ = 'tests'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=True)
    questions_count = db.Column(db.Integer, default=0)
    time_limit = db.Column(db.Integer, nullable=True)  # В минутах
    passing_score = db.Column(db.Integer, default=70)  # Проходной балл в %
    is_active = db.Column(db.Boolean, default=True)
    created_by = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Связи
    skill = db.relationship('Skill', backref='tests')
    questions = db.relationship('TestQuestion', back_populates='test', cascade='all, delete-orphan')

class TestQuestion(db.Model):
    """Вопросы тестов"""
    __tablename__ = 'test_questions'
    
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(50), default='multiple_choice')  # multiple_choice, single_choice, text
    correct_answers = db.Column(db.Text, nullable=False)  # JSON строка с правильными ответами
    options = db.Column(db.Text, nullable=True)  # JSON строка с вариантами ответов
    points = db.Column(db.Integer, default=1)
    order_number = db.Column(db.Integer, default=0)
    
    # Связи
    test = db.relationship('Test', back_populates='questions')

class VacancyTest(db.Model):
    """Тесты, привязанные к вакансии"""
    __tablename__ = 'vacancy_tests'
    
    id = db.Column(db.Integer, primary_key=True)
    vacancy_id = db.Column(db.Integer, db.ForeignKey('vacancies.id'), nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.id'), nullable=False)
    is_required = db.Column(db.Boolean, default=False)
    min_score = db.Column(db.Integer, default=70)  # Минимальный балл для прохождения
    
    # Связи
    vacancy = db.relationship('Vacancy', back_populates='tests')
    test = db.relationship('Test', backref='vacancy_assignments')

class UserTestResult(db.Model):
    """Результаты тестов пользователей"""
    __tablename__ = 'user_test_results'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.id'), nullable=False)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=True)
    
    score = db.Column(db.Integer, nullable=False)  # Балл в %
    max_score = db.Column(db.Integer, nullable=False)
    answers = db.Column(db.Text, nullable=True)  # JSON с ответами
    time_spent = db.Column(db.Integer, nullable=True)  # В секундах
    is_passed = db.Column(db.Boolean, default=False)
    
    started_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Связи
    user = db.relationship('User', back_populates='test_results')
    test = db.relationship('Test', backref='user_results')
    application = db.relationship('Application', back_populates='test_results')

# Модели для рейтингов и отзывов
class EmployerRating(db.Model):
    """Рейтинги работодателей от соискателей"""
    __tablename__ = 'employer_ratings'
    
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    review_text = db.Column(db.Text, nullable=True)
    is_anonymous = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)  # Проверен модератором
    
    # Категории оценки
    communication_rating = db.Column(db.Integer, nullable=True)
    interview_process_rating = db.Column(db.Integer, nullable=True)
    salary_transparency_rating = db.Column(db.Integer, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    moderated_at = db.Column(db.DateTime, nullable=True)
    
    # Связи
    employer = db.relationship('Employer', back_populates='ratings_received')
    user = db.relationship('User', back_populates='ratings_given')

# Модели для системы уведомлений
class Notification(db.Model):
    """Уведомления пользователей"""
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=True)
    
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    notification_type = db.Column(db.String(50), nullable=False)  # application, interview, system, etc.
    
    # Статус
    is_read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime, nullable=True)
    
    # Каналы отправки
    sent_email = db.Column(db.Boolean, default=False)
    sent_sms = db.Column(db.Boolean, default=False)
    sent_telegram = db.Column(db.Boolean, default=False)
    
    # Связанные объекты (опционально)
    related_vacancy_id = db.Column(db.Integer, db.ForeignKey('vacancies.id'), nullable=True)
    related_application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Связи
    user = db.relationship('User', backref='notifications')
    employer = db.relationship('Employer', backref='notifications')

# Модели для аналитики и статистики
class AnalyticsEvent(db.Model):
    """События для аналитики"""
    __tablename__ = 'analytics_events'
    
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(50), nullable=False, index=True)  # view, apply, hire, etc.
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=True)
    vacancy_id = db.Column(db.Integer, db.ForeignKey('vacancies.id'), nullable=True)
    
    # Метаданные события (переименовали из metadata)
    event_data = db.Column(db.Text, nullable=True)  # JSON с дополнительными данными
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)
    referrer = db.Column(db.String(500), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, index=True)

# Модели для интеграций
class SocialMediaPost(db.Model):
    """Посты в социальных сетях"""
    __tablename__ = 'social_media_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    vacancy_id = db.Column(db.Integer, db.ForeignKey('vacancies.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)  # instagram, telegram, tiktok, etc.
    post_id = db.Column(db.String(200), nullable=True)  # ID поста в соцсети
    post_url = db.Column(db.String(500), nullable=True)
    
    # Содержание
    caption = db.Column(db.Text, nullable=True)
    hashtags = db.Column(db.Text, nullable=True)
    image_path = db.Column(db.String(255), nullable=True)
    
    # Статистика
    views_count = db.Column(db.Integer, default=0)
    likes_count = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    
    # Статус
    is_published = db.Column(db.Boolean, default=False)
    published_at = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Связи
    vacancy = db.relationship('Vacancy', backref='social_posts')

# Служебные функции
def create_default_categories():
    """Создание базовых категорий вакансий"""
    categories = [
        'Массовый найм (продавцы, курьеры, официанты)',
        'Технический персонал',
        'Офисные сотрудники',
        'IT и Digital',
        'Управление и менеджмент',
        'Финансы и бухгалтерия',
        'Маркетинг и реклама',
        'Медицина и фармацевтика',
        'Образование',
        'Логистика и транспорт',
        'Строительство',
        'Производство'
    ]
    
    for i, cat_name in enumerate(categories):
        if not VacancyCategory.query.filter_by(name=cat_name).first():
            category = VacancyCategory(
                name=cat_name,
                sort_order=i
            )
            db.session.add(category)
    
    db.session.commit()

def create_default_skills():
    """Создание базового набора навыков"""
    skills_data = [
        # Технические навыки
        ('Python', 'technical'),
        ('JavaScript', 'technical'),
        ('React', 'technical'),
        ('PHP', 'technical'),
        ('SQL', 'technical'),
        ('HTML/CSS', 'technical'),
        ('Excel', 'technical'),
        ('1C', 'technical'),
        ('Photoshop', 'technical'),
        ('AutoCAD', 'technical'),
        
        # Языковые навыки
        ('Казахский язык', 'language'),
        ('Русский язык', 'language'),
        ('Английский язык', 'language'),
        ('Китайский язык', 'language'),
        
        # Soft skills
        ('Коммуникативность', 'soft'),
        ('Ответственность', 'soft'),
        ('Пунктуальность', 'soft'),
        ('Стрессоустойчивость', 'soft'),
        ('Обучаемость', 'soft'),
        ('Лидерство', 'soft'),
        ('Работа в команде', 'soft'),
        ('Клиентоориентированность', 'soft'),
        ('Аналитическое мышление', 'soft'),
        
        # Специализированные навыки
        ('Водительские права категории B', 'technical'),
        ('Опыт продаж', 'technical'),
        ('Кассовые операции', 'technical'),
        ('Складские операции', 'technical'),
        ('Работа с клиентами', 'soft'),
    ]
    
    for skill_name, category in skills_data:
        if not Skill.query.filter_by(name=skill_name).first():
            skill = Skill(
                name=skill_name,
                category=category
            )
            db.session.add(skill)
    
    db.session.commit()

def create_sample_tests():
    """Создание примеров тестов"""
    # Простой тест на знание русского языка
    russian_skill = Skill.query.filter_by(name='Русский язык').first()
    if russian_skill and not Test.query.filter_by(skill_id=russian_skill.id).first():
        test = Test(
            title='Тест на знание русского языка',
            description='Базовый тест для проверки грамотности',
            skill_id=russian_skill.id,
            questions_count=10,
            time_limit=15,
            passing_score=70
        )
        db.session.add(test)
        db.session.flush()
        
        # Добавляем пример вопроса
        question = TestQuestion(
            test_id=test.id,
            question_text='Выберите правильное написание:',
            question_type='single_choice',
            correct_answers='["Пришёл"]',
            options='["Пришол", "Пришёл", "Прешёл", "Прешол"]',
            points=1,
            order_number=1
        )
        db.session.add(question)
    
    # Тест на стрессоустойчивость
    stress_skill = Skill.query.filter_by(name='Стрессоустойчивость').first()
    if stress_skill and not Test.query.filter_by(skill_id=stress_skill.id).first():
        test = Test(
            title='Тест на стрессоустойчивость',
            description='Психологический тест для оценки устойчивости к стрессу',
            skill_id=stress_skill.id,
            questions_count=15,
            time_limit=20,
            passing_score=60
        )
        db.session.add(test)
        db.session.flush()
        
        question = TestQuestion(
            test_id=test.id,
            question_text='Как вы реагируете на критику?',
            question_type='single_choice',
            correct_answers='["Анализирую и делаю выводы"]',
            options='["Обижаюсь", "Анализирую и делаю выводы", "Игнорирую", "Спорю"]',
            points=1,
            order_number=1
        )
        db.session.add(question)
    
    db.session.commit()

# Модели для подписок и платежей
class Subscription(db.Model):
    """История подписок работодателей"""
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=False)
    tier = db.Column(db.Enum(SubscriptionTier), nullable=False)
    
    # Период подписки
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    
    # Финансовые данные
    price = db.Column(db.Integer, nullable=False)  # Цена в тенге
    currency = db.Column(db.String(10), default='KZT')
    
    # Статус
    is_active = db.Column(db.Boolean, default=True)
    auto_renew = db.Column(db.Boolean, default=False)
    
    # Способ оплаты и транзакции
    payment_method = db.Column(db.String(50), nullable=True)  # kaspi, card, bank_transfer
    transaction_id = db.Column(db.String(100), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Связи
    employer = db.relationship('Employer', backref='subscription_history')

class ServiceOrder(db.Model):
    """Заказы дополнительных услуг"""
    __tablename__ = 'service_orders'
    
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=False)
    
    service_type = db.Column(db.String(50), nullable=False)  # recruitment, promotion, testing
    service_name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Стоимость
    price = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.String(10), default='KZT')
    
    # Статус заказа
    status = db.Column(db.String(50), default='pending')  # pending, in_progress, completed, cancelled
    
    # Связанные объекты
    related_vacancy_id = db.Column(db.Integer, db.ForeignKey('vacancies.id'), nullable=True)
    
    # Результаты выполнения
    results_data = db.Column(db.Text, nullable=True)  # JSON с результатами
    completion_notes = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Связи
    employer = db.relationship('Employer', backref='service_orders')
    vacancy = db.relationship('Vacancy', backref='service_orders')

# Модели для локализации и регионов
class City(db.Model):
    """Справочник городов Казахстана"""
    __tablename__ = 'cities'
    
    id = db.Column(db.Integer, primary_key=True)
    name_ru = db.Column(db.String(100), nullable=False, index=True)
    name_kz = db.Column(db.String(100), nullable=True)
    region = db.Column(db.String(100), nullable=False)
    is_regional_center = db.Column(db.Boolean, default=False)
    population = db.Column(db.Integer, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)

def create_default_cities():
    """Создание справочника городов Казахстана"""
    cities_data = [
        ('Алматы', 'Алматы', 'Алматы', True, 2000000, 1),
        ('Нур-Султан', 'Нұр-Сұлтан', 'Акмолинская', True, 1200000, 2),
        ('Шымкент', 'Шымкент', 'Туркестанская', True, 1000000, 3),
        ('Актобе', 'Ақтөбе', 'Актюбинская', True, 500000, 4),
        ('Тараз', 'Тараз', 'Жамбылская', True, 400000, 5),
        ('Павлодар', 'Павлодар', 'Павлодарская', True, 350000, 6),
        ('Усть-Каменогорск', 'Өскемен', 'Восточно-Казахстанская', True, 330000, 7),
        ('Семей', 'Семей', 'Восточно-Казахстанская', True, 320000, 8),
        ('Костанай', 'Қостанай', 'Костанайская', True, 240000, 9),
        ('Петропавловск', 'Петропавл', 'Северо-Казахстанская', True, 220000, 10),
        ('Актау', 'Ақтау', 'Мангистауская', True, 200000, 11),
        ('Атырау', 'Атырау', 'Атырауская', True, 190000, 12),
        ('Темиртау', 'Теміртау', 'Карагандинская', False, 180000, 13),
        ('Туркестан', 'Түркістан', 'Туркестанская', True, 170000, 14),
        ('Кызылорда', 'Қызылорда', 'Кызылординская', True, 160000, 15),
        ('Уральск', 'Орал', 'Западно-Казахстанская', True, 150000, 16),
        ('Караганда', 'Қарағанды', 'Карагандинская', True, 500000, 4),
    ]
    
    for name_ru, name_kz, region, is_center, population, sort_order in cities_data:
        if not City.query.filter_by(name_ru=name_ru).first():
            city = City(
                name_ru=name_ru,
                name_kz=name_kz,
                region=region,
                is_regional_center=is_center,
                population=population,
                sort_order=sort_order
            )
            db.session.add(city)
    
    db.session.commit()

# Модели для контент-системы
class Article(db.Model):
    """Статьи для блога/гайдов"""
    __tablename__ = 'articles'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), nullable=False, unique=True, index=True)
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.Text, nullable=True)
    
    # SEO
    meta_title = db.Column(db.String(200), nullable=True)
    meta_description = db.Column(db.Text, nullable=True)
    
    # Категоризация
    category = db.Column(db.String(50), nullable=True)  # career_guide, hr_tips, market_analysis
    tags = db.Column(db.Text, nullable=True)  # JSON массив тегов
    
    # Медиа
    featured_image = db.Column(db.String(255), nullable=True)
    
    # Статус публикации
    status = db.Column(db.String(20), default='draft')  # draft, published, archived
    published_at = db.Column(db.DateTime, nullable=True)
    
    # Статистика
    views_count = db.Column(db.Integer, default=0)
    likes_count = db.Column(db.Integer, default=0)
    
    # Автор
    author_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Связи
    author = db.relationship('Admin', backref='articles')

# Модели для партнерств и интеграций
class Partner(db.Model):
    """Партнеры платформы"""
    __tablename__ = 'partners'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # college, course, recruiter, service
    description = db.Column(db.Text, nullable=True)
    
    # Контакты
    website = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    
    # Интеграция
    api_key = db.Column(db.String(100), nullable=True, unique=True)
    webhook_url = db.Column(db.String(500), nullable=True)
    
    # Статус
    is_active = db.Column(db.Boolean, default=True)
    verified_at = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# Модели для системы жалоб и модерации
class Report(db.Model):
    """Жалобы на работодателей/вакансии"""
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Объект жалобы
    reported_employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=True)
    reported_vacancy_id = db.Column(db.Integer, db.ForeignKey('vacancies.id'), nullable=True)
    
    # Содержание жалобы
    reason = db.Column(db.String(100), nullable=False)  # fraud, inappropriate, spam, etc.
    description = db.Column(db.Text, nullable=False)
    evidence = db.Column(db.Text, nullable=True)  # Ссылки на доказательства
    
    # Статус обработки
    status = db.Column(db.String(50), default='pending')  # pending, investigating, resolved, dismissed
    resolution = db.Column(db.Text, nullable=True)
    resolved_by = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    resolved_at = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Связи
    reporter = db.relationship('User', backref='reports_made')
    reported_employer = db.relationship('Employer', backref='reports_received')
    reported_vacancy = db.relationship('Vacancy', backref='reports')
    resolver = db.relationship('Admin', backref='reports_resolved')

# Функция инициализации базы данных
def init_database():
    """Инициализация базы данных с начальными данными"""
    db.create_all()
    
    # Создаем базовые данные
    create_default_categories()
    create_default_skills()
    create_default_cities()
    create_sample_tests()
    
    # Создаем администратора по умолчанию
    if not Admin.query.filter_by(email='admin@workplus.kz').first():
        admin = Admin(
            email='admin@workplus.kz',
            full_name='System Administrator',
            role='super_admin'
        )
        admin.set_password('workplus2024')
        db.session.add(admin)
        db.session.commit()
    
    print("База данных инициализирована успешно!")

if __name__ == '__main__':
    # Для тестирования
    from flask import Flask
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workplus.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    with app.app_context():
        init_database()