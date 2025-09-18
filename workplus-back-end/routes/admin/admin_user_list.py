from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Job, Company
from datetime import datetime
from sqlalchemy import or_
import csv
import io

admin_user_list_bp = Blueprint("admin_user_list", __name__)


# Проверка роли администратора
def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.user_type == "admin"


# --- Получение списка пользователей ---
@admin_user_list_bp.route("/", methods=["GET"])
@jwt_required()
def get_users():
    try:
        admin_id = int(get_jwt_identity())
        if not is_admin(admin_id):
            return jsonify({"error": "Доступ только для администраторов"}), 403

        # Фильтры
        role = request.args.get("role", "all")      # employer / candidate / admin / all
        status = request.args.get("status", "all")  # active / blocked / pending / all
        search = request.args.get("search", "")

        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 20, type=int), 100)

        query = User.query

        # Фильтр по роли
        if role != "all":
            query = query.filter(User.user_type == role)

        # Фильтр по статусу
        if status != "all":
            if status == "active":
                query = query.filter(User.is_active.is_(True))
            elif status == "blocked":
                query = query.filter(User.is_active.is_(False))
            elif status == "pending":
                query = query.filter(User.is_verified.is_(False))

        # Поиск по имени, email, компании
        if search:
            search = f"%{search.lower()}%"
            query = query.outerjoin(Company, Company.id == User.company_id).filter(
                or_(
                    User.name.ilike(search),
                    User.email.ilike(search),
                    Company.name.ilike(search),
                )
            )

        query = query.order_by(User.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        users = []
        for u in pagination.items:
            users.append({
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "phone": u.phone,
                "role": u.user_type,
                "status": (
                    "active" if u.is_active else "blocked"
                ) if u.user_type != "admin" else "active",
                "company": u.company.name if u.company else None,
                "location": u.city,
                "registeredDate": u.created_at.isoformat() if u.created_at else None,
                "lastActivity": u.updated_at.isoformat() if u.updated_at else None,
                "jobsPosted": u.posted_jobs.count() if u.user_type == "employer" else 0,
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


# --- Получение статистики ---
@admin_user_list_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    try:
        admin_id = int(get_jwt_identity())
        if not is_admin(admin_id):
            return jsonify({"error": "Доступ только для администраторов"}), 403

        total = User.query.count()
        employers = User.query.filter_by(user_type="employer").count()
        candidates = User.query.filter_by(user_type="candidate").count()
        active = User.query.filter(User.is_active.is_(True)).count()

        return jsonify({
            "total": total,
            "employers": employers,
            "candidates": candidates,
            "active": active,
        })

    except Exception as e:
        print(f"Ошибка статистики: {e}")
        return jsonify({"error": "Ошибка при получении статистики"}), 500


# --- Обновление пользователя ---
@admin_user_list_bp.route("/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    try:
        admin_id = int(get_jwt_identity())
        if not is_admin(admin_id):
            return jsonify({"error": "Доступ только для администраторов"}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Пользователь не найден"}), 404

        data = request.get_json()
        if "status" in data:
            user.is_active = True if data["status"] == "active" else False
        if "name" in data:
            user.name = data["name"]
        if "phone" in data:
            user.phone = data["phone"]
        if "email" in data:
            user.email = data["email"]

        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({"message": "Пользователь обновлен"})

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка обновления: {e}")
        return jsonify({"error": "Ошибка при обновлении пользователя"}), 500


# --- Массовое обновление статуса ---
@admin_user_list_bp.route("/bulk", methods=["PATCH"])
@jwt_required()
def bulk_update_users():
    try:
        admin_id = int(get_jwt_identity())
        if not is_admin(admin_id):
            return jsonify({"error": "Доступ только для администраторов"}), 403

        data = request.get_json()
        ids = data.get("ids", [])
        action = data.get("action")  # activate / block

        if not ids or action not in ["activate", "block"]:
            return jsonify({"error": "Неверные данные"}), 400

        users = User.query.filter(User.id.in_(ids)).all()
        for u in users:
            u.is_active = True if action == "activate" else False
            u.updated_at = datetime.utcnow()

        db.session.commit()
        return jsonify({"message": f"{len(users)} пользователей обновлено"})

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка массового обновления: {e}")
        return jsonify({"error": "Ошибка при массовом обновлении"}), 500


# --- Экспорт CSV ---
@admin_user_list_bp.route("/export", methods=["GET"])
@jwt_required()
def export_users():
    try:
        admin_id = int(get_jwt_identity())
        if not is_admin(admin_id):
            return jsonify({"error": "Доступ только для администраторов"}), 403

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Name", "Email", "Phone", "Role", "Status", "Company", "City"])

        users = User.query.all()
        for u in users:
            writer.writerow([
                u.id,
                u.name,
                u.email,
                u.phone,
                u.user_type,
                "active" if u.is_active else "blocked",
                u.company.name if u.company else "",
                u.city or "",
            ])

        output.seek(0)
        return Response(
            output,
            mimetype="text/csv",
            headers={"Content-Disposition": "attachment; filename=users.csv"},
        )

    except Exception as e:
        print(f"Ошибка экспорта: {e}")
        return jsonify({"error": "Ошибка при экспорте"}), 500
