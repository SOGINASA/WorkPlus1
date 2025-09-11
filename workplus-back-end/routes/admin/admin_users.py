from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
from datetime import date, datetime
from sqlalchemy import or_

admin_users_bp = Blueprint("admin_users", __name__)

# Проверка роли администратора
def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.user_type == "admin"

@admin_users_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    """Получить список пользователей (кандидатов/работодателей) с фильтрацией"""
    try:
        admin_id = int(get_jwt_identity())
        if not is_admin(admin_id):
            return jsonify({"error": "Доступ только для администраторов"}), 403

        # Фильтры
        user_type = request.args.get("type")  # candidate / employer / all
        status = request.args.get("status")  # active / blocked / all
        search = request.args.get("search", "")

        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 20, type=int), 100)

        query = User.query

        if user_type and user_type != "all":
            query = query.filter(User.user_type == user_type)

        if status and status != "all":
            if status == "active":
                query = query.filter(User.is_active.is_(True))
            elif status == "blocked":
                query = query.filter(User.is_active.is_(False))

        if search:
            search = f"%{search.lower()}%"
            query = query.filter(
                or_(
                    User.name.ilike(search),
                    User.email.ilike(search),
                    User.phone.ilike(search),
                )
            )

        query = query.order_by(User.created_at.desc())

        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        def calculate_age(birth_date):
            if not birth_date:
                return None
            today = date.today()
            return (
                today.year
                - birth_date.year
                - ((today.month, today.day) < (birth_date.month, birth_date.day))
            )

        users = []
        for u in pagination.items:
            users.append({
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "phone": u.phone,
                "birth_date": u.birth_date.isoformat() if u.birth_date else None,
                "age": calculate_age(u.birth_date),
                "location": u.city,
                "position": u.position,
                "experience": u.experience_years,
                "salary": getattr(u, "expected_salary", None),  # если поле появится
                "status": "active" if u.is_active else "blocked",
                "registeredDate": u.created_at.isoformat() if u.created_at else None,
                "lastActivity": u.updated_at.isoformat() if u.updated_at else None,
                "rating": getattr(u, "rating", 4.0),
                "skills": u.get_skills_list(),
                "education": u.education_level,
                "user_type": u.user_type,
            })

        return jsonify({
            "users": users,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": pagination.total,
                "pages": pagination.pages,
            },
        })

    except Exception as e:
        print(f"Ошибка получения списка пользователей: {e}")
        return jsonify({"error": "Ошибка при получении пользователей"}), 500



@admin_users_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    """Получить данные одного пользователя"""
    try:
        admin_id = int(get_jwt_identity())
        if not is_admin(admin_id):
            return jsonify({"error": "Доступ только для администраторов"}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Пользователь не найден"}), 404

        return jsonify(user.to_dict())
    except Exception as e:
        print(f"Ошибка получения пользователя: {e}")
        return jsonify({"error": "Ошибка при получении пользователя"}), 500


@admin_users_bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    """Обновить данные пользователя (например статус)"""
    try:
        admin_id = int(get_jwt_identity())
        if not is_admin(admin_id):
            return jsonify({"error": "Доступ только для администраторов"}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Пользователь не найден"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "Нет данных для обновления"}), 400

        if "status" in data:
            user.status = data["status"]

        if "phone" in data:
            user.phone = data["phone"]

        if "email" in data:
            user.email = data["email"]

        if "name" in data:
            user.name = data["name"]

        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({"message": "Пользователь обновлен", "user": user.to_dict()})

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка обновления пользователя: {e}")
        return jsonify({"error": "Ошибка при обновлении пользователя"}), 500


@admin_users_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    """Удалить или заблокировать пользователя"""
    try:
        admin_id = int(get_jwt_identity())
        if not is_admin(admin_id):
            return jsonify({"error": "Доступ только для администраторов"}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Пользователь не найден"}), 404

        # мягкое удаление → блокировка
        user.status = "blocked"
        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({"message": "Пользователь заблокирован", "user": user.to_dict()})

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка удаления пользователя: {e}")
        return jsonify({"error": "Ошибка при удалении пользователя"}), 500