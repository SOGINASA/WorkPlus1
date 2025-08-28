import os
import re
import hashlib
from datetime import datetime
from flask import current_app, url_for
from werkzeug.utils import secure_filename
import requests

def allowed_file(filename, allowed_extensions):
    """Проверка разрешенного формата файла"""
    if not filename:
        return False
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def save_uploaded_file(file, upload_type='general'):
    """Сохранение загруженного файла"""
    if not file or file.filename == '':
        return None
    
    # Определяем папку для сохранения
    folders = {
        'avatar': 'avatars',
        'resume': 'resumes', 
        'company_doc': 'company_docs',
        'vacancy_image': 'vacancy_images',
        'general': 'general'
    }
    
    folder = folders.get(upload_type, 'general')
    upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], folder)
    os.makedirs(upload_path, exist_ok=True)
    
    # Генерируем безопасное имя файла
    filename = secure_filename(file.filename)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    name, ext = os.path.splitext(filename)
    new_filename = f"{timestamp}_{name[:50]}{ext}"
    
    file_path = os.path.join(upload_path, new_filename)
    file.save(file_path)
    
    # Возвращаем относительный путь для БД
    return f"{folder}/{new_filename}"

def generate_file_hash(file_content):
    """Генерация хеша файла для проверки дубликатов"""
    return hashlib.md5(file_content).hexdigest()

def format_salary(salary_from, salary_to, currency='KZT'):
    """Форматирование зарплаты для отображения"""
    currency_symbols = {
        'KZT': '₸',
        'USD': '$',
        'EUR': '€'
    }
    
    symbol = currency_symbols.get(currency, currency)
    
    if salary_from and salary_to:
        if salary_from == salary_to:
            return f"{salary_from:,} {symbol}".replace(',', ' ')
        else:
            return f"{salary_from:,} - {salary_to:,} {symbol}".replace(',', ' ')
    elif salary_from:
        return f"от {salary_from:,} {symbol}".replace(',', ' ')
    elif salary_to:
        return f"до {salary_to:,} {symbol}".replace(',', ' ')
    else:
        return "По договоренности"

def validate_phone(phone):
    """Валидация номера телефона (казахстанский формат)"""
    # Убираем все символы кроме цифр и +
    clean_phone = re.sub(r'[^\d+]', '', phone)
    
    # Проверяем различные форматы казахстанских номеров
    patterns = [
        r'^\+7[0-9]{10}$',  # +7XXXXXXXXXX
        r'^7[0-9]{10}$',    # 7XXXXXXXXXX
        r'^8[0-9]{10}$',    # 8XXXXXXXXXX
    ]
    
    for pattern in patterns:
        if re.match(pattern, clean_phone):
            # Приводим к единому формату +7XXXXXXXXXX
            if clean_phone.startswith('8'):
                return '+7' + clean_phone[1:]
            elif clean_phone.startswith('7'):
                return '+' + clean_phone
            else:
                return clean_phone
    
    return None

def validate_email(email):
    """Валидация email адреса"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_iin(iin):
    """Валидация ИИН (Индивидуальный идентификационный номер Казахстана)"""
    if not iin or len(iin) != 12:
        return False
    
    if not iin.isdigit():
        return False
    
    # Проверка контрольного разряда
    weights1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    weights2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2]
    
    def calculate_checksum(digits, weights):
        return sum(int(d) * w for d, w in zip(digits[:11], weights)) % 11
    
    checksum1 = calculate_checksum(iin, weights1)
    
    if checksum1 < 10:
        return int(iin[11]) == checksum1
    else:
        checksum2 = calculate_checksum(iin, weights2)
        if checksum2 < 10:
            return int(iin[11]) == checksum2
        else:
            return int(iin[11]) == 0

def validate_bin(bin_number):
    """Валидация БИН (Бизнес-идентификационный номер)"""
    if not bin_number or len(bin_number) != 12:
        return False
    
    if not bin_number.isdigit():
        return False
    
    # Упрощенная проверка БИН (в реальности алгоритм сложнее)
    return True

def send_notification(user_id=None, employer_id=None, title='', message='', 
                     notification_type='system', related_vacancy_id=None, 
                     related_application_id=None, send_email=False, send_sms=False, 
                     send_telegram=False):
    """Отправка уведомления пользователю"""
    try:
        from db_models import Notification, db
        
        notification = Notification(
            user_id=user_id,
            employer_id=employer_id,
            title=title,
            message=message,
            notification_type=notification_type,
            related_vacancy_id=related_vacancy_id,
            related_application_id=related_application_id
        )
        
        db.session.add(notification)
        
        # Отправка по различным каналам
        if send_email:
            # TODO: Реализовать отправку email
            notification.sent_email = True
            
        if send_sms:
            # TODO: Реализовать отправку SMS
            notification.sent_sms = True
            
        if send_telegram:
            # TODO: Реализовать отправку в Telegram
            notification.sent_telegram = True
        
        db.session.commit()
        return True
        
    except Exception as e:
        if current_app:
            current_app.logger.error(f"Error sending notification: {str(e)}")
        db.session.rollback()
        return False

def send_email(to_email, subject, template, **kwargs):
    """Отправка email уведомлений"""
    try:
        from flask_mail import Message
        from extensions import mail
        
        msg = Message(
            subject=subject,
            recipients=[to_email],
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        
        # Рендеринг HTML шаблона
        from flask import render_template
        msg.html = render_template(f'emails/{template}.html', **kwargs)
        
        mail.send(msg)
        return True
        
    except Exception as e:
        current_app.logger.error(f"Error sending email: {str(e)}")
        return False

def send_sms(phone, message):
    """Отправка SMS через API провайдера"""
    try:
        api_url = current_app.config.get('SMS_API_URL')
        api_key = current_app.config.get('SMS_API_KEY')
        sender = current_app.config.get('SMS_SENDER', 'WorkPlus')
        
        if not api_url or not api_key:
            current_app.logger.warning("SMS API not configured")
            return False
        
        # Пример запроса (нужно адаптировать под конкретного провайдера)
        data = {
            'api_key': api_key,
            'from': sender,
            'to': phone,
            'text': message
        }
        
        response = requests.post(api_url, data=data, timeout=10)
        return response.status_code == 200
        
    except Exception as e:
        current_app.logger.error(f"Error sending SMS: {str(e)}")
        return False

def send_telegram_message(chat_id, message):
    """Отправка сообщения в Telegram"""
    try:
        bot_token = current_app.config.get('TELEGRAM_BOT_TOKEN')
        
        if not bot_token:
            return False
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        data = {
            'chat_id': chat_id,
            'text': message,
            'parse_mode': 'HTML'
        }
        
        response = requests.post(url, data=data, timeout=10)
        return response.status_code == 200
        
    except Exception as e:
        current_app.logger.error(f"Error sending Telegram message: {str(e)}")
        return False

def create_social_media_post(vacancy):
    """Создание поста в социальных сетях"""
    try:
        from db_models import SocialMediaPost, db
        from config import Constants
        
        # Формируем текст поста
        post_text = f"""
🔥 ВАКАНСИЯ: {vacancy.title}

💰 Зарплата: {format_salary(vacancy.salary_from, vacancy.salary_to)}
📍 Город: {vacancy.city}
💼 Занятость: {dict(Constants.EMPLOYMENT_TYPES).get(vacancy.employment_type, vacancy.employment_type)}

{vacancy.description[:200]}{'...' if len(vacancy.description) > 200 else ''}

Подробности и отклик: {url_for('public.vacancy_detail', vacancy_id=vacancy.id, _external=True)}

#работа #вакансия #{vacancy.city.lower()} #workplus
        """.strip()
        
        # Создаем записи для постинга в разные соцсети
        platforms = ['instagram', 'telegram', 'tiktok']
        
        for platform in platforms:
            social_post = SocialMediaPost(
                vacancy_id=vacancy.id,
                platform=platform,
                caption=post_text,
                hashtags=f"#работа #вакансия #{vacancy.city.lower()} #workplus"
            )
            db.session.add(social_post)
        
        db.session.commit()
        
        # TODO: Реализовать фактическую публикацию в API социальных сетей
        
        return True
        
    except Exception as e:
        if current_app:
            current_app.logger.error(f"Error creating social media post: {str(e)}")
        db.session.rollback()
        return False

def track_event(event_type, user_id=None, employer_id=None, vacancy_id=None, metadata=None):
    """Трекинг событий для аналитики"""
    try:
        from flask import request
        from db_models import AnalyticsEvent, db
        
        event = AnalyticsEvent(
            event_type=event_type,
            user_id=user_id,
            employer_id=employer_id,
            vacancy_id=vacancy_id,
            event_data=str(metadata) if metadata else None,  # Изменили metadata на event_data
            ip_address=request.remote_addr if request else None,
            user_agent=request.user_agent.string if request else None,
            referrer=request.referrer if request else None
        )
        
        db.session.add(event)
        db.session.commit()
        
    except Exception as e:
        if current_app:
            current_app.logger.error(f"Error tracking event: {str(e)}")
        db.session.rollback()

def calculate_matching_score(vacancy, user):
    """Расчет совместимости вакансии и кандидата"""
    score = 0
    
    # Совпадение по городу (25 баллов)
    if vacancy.city.lower() == user.city.lower():
        score += 25
    
    # Проверка опыта (30 баллов)
    if user.experience_years >= vacancy.experience_required:
        if user.experience_years == vacancy.experience_required:
            score += 30
        elif user.experience_years <= vacancy.experience_required + 2:
            score += 25
        else:
            score += 20
    elif user.experience_years >= vacancy.experience_required - 1:
        score += 15
    
    # Совпадение навыков (35 баллов)
    if vacancy.required_skills and user.skills:
        vacancy_skill_ids = {vs.skill_id for vs in vacancy.required_skills}
        user_skill_ids = {us.skill_id for us in user.skills}
        
        if vacancy_skill_ids:
            matching_skills = len(vacancy_skill_ids & user_skill_ids)
            skill_percentage = matching_skills / len(vacancy_skill_ids)
            score += min(35, int(skill_percentage * 35))
    
    # Соответствие зарплатным ожиданиям (10 баллов)
    if (vacancy.salary_from and user.desired_salary_from and 
        vacancy.salary_from >= user.desired_salary_from * 0.8):
        score += 10
    elif vacancy.salary_to and user.desired_salary_to and vacancy.salary_to <= user.desired_salary_to * 1.2:
        score += 5
    
    return min(100, score)

def generate_vacancy_slug(title):
    """Генерация slug для вакансии"""
    import unicodedata
    
    # Транслитерация кириллицы
    translit_map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    
    slug = title.lower()
    
    # Транслитерация
    for cyrillic, latin in translit_map.items():
        slug = slug.replace(cyrillic, latin)
    
    # Удаляем все кроме букв, цифр и дефисов
    slug = re.sub(r'[^a-z0-9-]', '-', slug)
    # Убираем множественные дефисы
    slug = re.sub(r'-+', '-', slug)
    # Убираем дефисы в начале и конце
    slug = slug.strip('-')
    
    return slug[:100]  # Ограничиваем длину

def format_relative_time(dt):
    """Форматирование относительного времени"""
    if not dt:
        return ''
    
    now = datetime.now()
    diff = now - dt
    
    if diff.days > 30:
        return dt.strftime('%d.%m.%Y')
    elif diff.days > 0:
        return f"{diff.days} дн. назад"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} ч. назад"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} мин. назад"
    else:
        return "только что"

def generate_api_key():
    """Генерация API ключа для партнеров"""
    import secrets
    return secrets.token_urlsafe(32)

def sanitize_html(text):
    """Очистка HTML от потенциально опасных тегов"""
    import bleach
    
    allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li']
    allowed_attributes = {}
    
    return bleach.clean(text, tags=allowed_tags, attributes=allowed_attributes)

def compress_image(image_path, max_size=(800, 600), quality=85):
    """Сжатие изображения"""
    try:
        from PIL import Image
        
        with Image.open(image_path) as img:
            # Конвертируем в RGB если нужно
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Изменяем размер сохраняя пропорции
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Сохраняем с оптимизацией
            img.save(image_path, 'JPEG', quality=quality, optimize=True)
            
        return True
        
    except Exception as e:
        current_app.logger.error(f"Error compressing image: {str(e)}")
        return False

def get_user_location_from_ip(ip_address):
    """Определение города пользователя по IP"""
    try:
        # В продакшене можно использовать сервисы геолокации
        # Пока возвращаем заглушку
        return {'city': 'Алматы', 'region': 'Алматы', 'country': 'KZ'}
        
    except Exception:
        return {'city': 'Алматы', 'region': 'Алматы', 'country': 'KZ'}

def paginate_query(query, page=1, per_page=20):
    """Универсальная пагинация запросов"""
    return query.paginate(
        page=page,
        per_page=per_page,
        error_out=False,
        max_per_page=100
    )

def create_search_filters(request_args):
    """Создание фильтров для поиска из параметров запроса"""
    filters = {}
    
    # Текстовый поиск
    if request_args.get('q'):
        filters['query'] = request_args.get('q').strip()
    
    # Город
    if request_args.get('city'):
        filters['city'] = request_args.get('city')
    
    # Зарплата
    if request_args.get('salary_from'):
        try:
            filters['salary_from'] = int(request_args.get('salary_from'))
        except (ValueError, TypeError):
            pass
    
    if request_args.get('salary_to'):
        try:
            filters['salary_to'] = int(request_args.get('salary_to'))
        except (ValueError, TypeError):
            pass
    
    # Опыт работы
    if request_args.get('experience'):
        try:
            filters['experience'] = int(request_args.get('experience'))
        except (ValueError, TypeError):
            pass
    
    # Тип занятости
    if request_args.get('employment_type'):
        filters['employment_type'] = request_args.get('employment_type')
    
    # Категория
    if request_args.get('category'):
        try:
            filters['category_id'] = int(request_args.get('category'))
        except (ValueError, TypeError):
            pass
    
    # Навыки
    if request_args.getlist('skills'):
        try:
            filters['skill_ids'] = [int(s) for s in request_args.getlist('skills') if s.isdigit()]
        except (ValueError, TypeError):
            pass
    
    # Удаленная работа
    if request_args.get('remote_work'):
        filters['remote_work'] = request_args.get('remote_work').lower() == 'true'
    
    return filters

def build_breadcrumbs(path_items):
    """Построение хлебных крошек для навигации"""
    breadcrumbs = [{'name': 'Главная', 'url': url_for('index')}]
    
    for item in path_items:
        breadcrumbs.append({
            'name': item.get('name', ''),
            'url': item.get('url', '#')
        })
    
    return breadcrumbs