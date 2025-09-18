from flask import Blueprint, jsonify, request
from models import db, User, Company

admin_employer_bp = Blueprint("admin_employer_bp", __name__)


@admin_employer_bp.route("/", methods=["GET"])
def get_employers():
    """Получить список работодателей"""
    try:
        search = request.args.get("search", "", type=str).lower()
        subscription = request.args.get("subscription", "all", type=str)
        status = request.args.get("status", "all", type=str)

        query = User.query.filter_by(user_type="employer").join(Company)

        # Поиск
        if search:
            query = query.filter(
                (Company.name.ilike(f"%{search}%"))
                | (Company.contact_name.ilike(f"%{search}%"))
                | (Company.contact_email.ilike(f"%{search}%"))
            )

        # Фильтр по статусу
        if status != "all":
            if status == "active":
                query = query.filter(User.is_active.is_(True))
            elif status == "blocked":
                query = query.filter(User.is_active.is_(False))
            elif status == "pending":
                query = query.filter(Company.is_verified.is_(False))

        # ⚡ TODO: Подключить настоящую логику тарифов (сейчас пропустим)
        employers = query.all()

        result = []
        for emp in employers:
            company = emp.company
            result.append({
                "id": emp.id,
                "companyName": company.name if company else None,
                "contactPerson": company.contact_name if company else None,
                "email": company.contact_email if company else emp.email,
                "phone": company.contact_phone if company else emp.phone,
                "location": company.city if company else emp.city,
                "subscription": "free",  # пока заглушка
                "status": "active" if emp.is_active else "blocked",
                "registeredDate": emp.created_at.strftime("%d %b %Y") if emp.created_at else None,
                "lastActivity": emp.last_login.strftime("%d %b %Y") if emp.last_login else None,
                "activeJobs": company.jobs.filter_by(is_active=True).count() if company else 0,
                "totalJobs": company.jobs.count() if company else 0,
                "totalHires": 0,  # можно добавить позже из аналитики
                "rating": company.rating if company else 0,
                "monthlySpent": 0,  # заглушка
                "industry": company.industry if company else None
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_employer_bp.route("/<int:employer_id>/toggle_block", methods=["PATCH"])
def toggle_block_employer(employer_id):
    """Заблокировать / разблокировать работодателя"""
    try:
        employer = User.query.filter_by(id=employer_id, user_type="employer").first()
        if not employer:
            return jsonify({"error": "Работодатель не найден"}), 404

        employer.is_active = not employer.is_active
        db.session.commit()

        return jsonify({
            "message": "Статус изменён",
            "id": employer.id,
            "is_active": employer.is_active
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
