from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Company, User, Job
from sqlalchemy import desc, func

companies_bp = Blueprint('companies', __name__)

@companies_bp.route('/', methods=['GET'])
@jwt_required(optional=True)
def get_companies():
    """Получить список компаний"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        search = request.args.get('search', '').strip()
        industry = request.args.get('industry')
        city = request.args.get('city')
        verified_only = request.args.get('verified_only', type=bool)
        
        # Получаем текущего пользователя если авторизован
        current_user_id = None
        try:
            current_user_id = int(get_jwt_identity()) if get_jwt_identity() else None
        except:
            pass
        
        # Базовый запрос
        query = Company.query.filter(Company.is_active == True)
        
        # Фильтры
        if search:
            query = query.filter(Company.name.ilike(f'%{search}%'))
        
        if industry:
            query = query.filter(Company.industry == industry)
        
        if city:
            query = query.filter(Company.city == city)
        
        if verified_only:
            query = query.filter(Company.is_verified == True)
        
        # Сортировка
        sort_by = request.args.get('sort', 'name')
        if sort_by == 'rating':
            query = query.order_by(desc(Company.rating), Company.name)
        elif sort_by == 'jobs_count':
            query = query.join(Job).group_by(Company.id).order_by(desc(func.count(Job.id)), Company.name)
        else:  # name
            query = query.order_by(Company.name)
        
        # Пагинация
        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        # Формируем ответ
        companies_data = []
        for company in pagination.items:
            company_dict = company.to_dict()
            
            # Добавляем количество активных вакансий
            active_jobs_count = Job.query.filter_by(
                company_id=company.id, 
                is_active=True
            ).count()
            company_dict['active_jobs_count'] = active_jobs_count
            
            # Для авторизованных работодателей показываем связь с их компанией
            if current_user_id:
                user = User.query.get(current_user_id)
                if user and user.user_type == 'employer':
                    company_dict['is_my_company'] = (user.company_id == company.id)
            
            companies_data.append(company_dict)
        
        return jsonify({
            'companies': companies_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_prev': pagination.has_prev,
                'has_next': pagination.has_next
            }
        })
    
    except Exception as e:
        print(f"Ошибка получения компаний: {e}")
        return jsonify({'error': 'Ошибка при получении списка компаний'}), 500

@companies_bp.route('/<int:company_id>', methods=['GET'])
def get_company_detail(company_id):
    """Получить детали компании"""
    try:
        company = Company.query.filter_by(id=company_id, is_active=True).first()
        
        if not company:
            return jsonify({'error': 'Компания не найдена'}), 404
        
        # Получаем статистику
        active_jobs = Job.query.filter_by(
            company_id=company_id, 
            is_active=True
        ).count()
        
        total_jobs = Job.query.filter_by(company_id=company_id).count()
        
        # Последние вакансии
        recent_jobs = Job.query.filter_by(
            company_id=company_id, 
            is_active=True
        ).order_by(desc(Job.created_at)).limit(5).all()
        
        company_data = company.to_dict()
        company_data['stats'] = {
            'active_jobs': active_jobs,
            'total_jobs': total_jobs
        }
        company_data['recent_jobs'] = [
            {
                'id': job.id,
                'title': job.title,
                'category': job.category,
                'city': job.city,
                'salary_display': job.get_salary_range(),
                'created_at': job.created_at.isoformat(),
                'applications_count': job.applications_count
            }
            for job in recent_jobs
        ]
        
        return jsonify(company_data)
    
    except Exception as e:
        print(f"Ошибка получения компании: {e}")
        return jsonify({'error': 'Ошибка при получении данных компании'}), 500

@companies_bp.route('/', methods=['POST'])
@jwt_required()
def create_company():
    """Создать компанию"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404
        
        # Проверяем, что у пользователя еще нет компании
        if user.company_id:
            return jsonify({'error': 'У пользователя уже есть компания'}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400
        
        # Проверяем обязательные поля
        if not data.get('name'):
            return jsonify({'error': 'Название компании обязательно'}), 400
        
        # Проверяем уникальность названия
        existing_company = Company.query.filter_by(name=data['name']).first()
        if existing_company:
            return jsonify({'error': 'Компания с таким названием уже существует'}), 400
        
        # Создаем компанию
        company = Company(
            name=data['name'],
            description=data.get('description'),
            website=data.get('website'),
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address'),
            city=data.get('city'),
            industry=data.get('industry'),
            size=data.get('size'),
            founded_year=data.get('founded_year'),
            instagram=data.get('instagram'),
            facebook=data.get('facebook'),
            linkedin=data.get('linkedin'),
            telegram=data.get('telegram')
        )
        
        db.session.add(company)
        db.session.flush()  # Получаем ID компании
        
        # Привязываем пользователя к компании
        user.company_id = company.id
        user.position = data.get('user_position', 'Руководитель')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Компания успешно создана',
            'company': company.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка создания компании: {e}")
        return jsonify({'error': 'Ошибка при создании компании'}), 500

@companies_bp.route('/<int:company_id>', methods=['PUT'])
@jwt_required()
def update_company(company_id):
    """Обновить компанию"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404
        
        company = Company.query.get(company_id)
        if not company:
            return jsonify({'error': 'Компания не найдена'}), 404
        
        # Проверяем права на редактирование
        if user.company_id != company_id and user.user_type != 'admin':
            return jsonify({'error': 'Нет прав на редактирование этой компании'}), 403
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400
        
        # Обновляемые поля
        updateable_fields = [
            'name', 'description', 'website', 'email', 'phone', 
            'address', 'city', 'industry', 'size', 'founded_year',
            'instagram', 'facebook', 'linkedin', 'telegram'
        ]
        
        for field in updateable_fields:
            if field in data:
                setattr(company, field, data[field])
        
        company.updated_at = db.func.now()
        db.session.commit()
        
        return jsonify({
            'message': 'Компания успешно обновлена',
            'company': company.to_dict()
        })
    
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка обновления компании: {e}")
        return jsonify({'error': 'Ошибка при обновлении компании'}), 500

@companies_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_company():
    """Получить мою компанию"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404
        
        if not user.company_id:
            return jsonify({'error': 'У пользователя нет компании'}), 404
        
        company = Company.query.get(user.company_id)
        if not company:
            return jsonify({'error': 'Компания не найдена'}), 404
        
        # Расширенная информация для собственной компании
        company_data = company.to_dict()
        
        # Статистика
        total_jobs = Job.query.filter_by(company_id=company.id).count()
        active_jobs = Job.query.filter_by(company_id=company.id, is_active=True).count()
        total_applications = db.session.query(db.func.sum(Job.applications_count))\
            .filter_by(company_id=company.id).scalar() or 0
        
        company_data['stats'] = {
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'total_applications': total_applications
        }
        
        # Сотрудники
        employees = User.query.filter_by(company_id=company.id).all()
        company_data['employees'] = [
            {
                'id': emp.id,
                'name': emp.name,
                'email': emp.email,
                'position': emp.position,
                'is_verified': emp.is_verified
            }
            for emp in employees
        ]
        
        return jsonify(company_data)
    
    except Exception as e:
        print(f"Ошибка получения моей компании: {e}")
        return jsonify({'error': 'Ошибка при получении данных компании'}), 500

@companies_bp.route('/industries', methods=['GET'])
def get_industries():
    """Получить список отраслей"""
    try:
        industries = db.session.query(
            Company.industry,
            func.count(Company.id).label('count')
        ).filter(
            Company.is_active == True,
            Company.industry.isnot(None)
        ).group_by(Company.industry)\
         .order_by(func.count(Company.id).desc())\
         .all()
        
        return jsonify({
            'industries': [
                {'name': industry, 'count': count}
                for industry, count in industries
            ]
        })
    
    except Exception as e:
        print(f"Ошибка получения отраслей: {e}")
        return jsonify({'error': 'Ошибка при получении списка отраслей'}), 500

@companies_bp.route('/<int:company_id>/jobs', methods=['GET'])
def get_company_jobs(company_id):
    """Получить вакансии компании"""
    try:
        company = Company.query.filter_by(id=company_id, is_active=True).first()
        if not company:
            return jsonify({'error': 'Компания не найдена'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        query = Job.query.filter_by(company_id=company_id, is_active=True)
        query = query.order_by(desc(Job.created_at))
        
        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'jobs': [job.to_dict() for job in pagination.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            },
            'company': {
                'id': company.id,
                'name': company.name,
                'logo_url': company.logo_url
            }
        })
    
    except Exception as e:
        print(f"Ошибка получения вакансий компании: {e}")
        return jsonify({'error': 'Ошибка при получении вакансий компании'}), 500