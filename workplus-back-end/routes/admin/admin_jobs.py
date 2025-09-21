from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Job
from datetime import date, datetime

admin_jobs_bp = Blueprint("admin_jobs", __name__)


# Список всех вакансий с фильтрами
@admin_jobs_bp.route("/get_all", methods=["GET"])   
@jwt_required()
def list_jobs():
    """Список вакансий для админки с фильтрами и пагинацией"""
    user_id = int(get_jwt_identity())
    admin = User.query.get(user_id)
    if not admin or admin.user_type != "admin":
        return jsonify({"error": "Доступ только для админов"}), 403

    # параметры
    search = request.args.get("search", "")
    status = request.args.get("status", "all")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))

    query = Job.query

    # фильтрация по статусу модерации
    if status != "all":
        query = query.filter(Job.moderation_status == status)

    # поиск по названию или компании
    if search:
        search_like = f"%{search.lower()}%"
        query = query.filter(
            db.or_(
                db.func.lower(Job.title).like(search_like),
                db.func.lower(Job.description).like(search_like)
            )
        )

    pagination = query.order_by(Job.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    jobs = [job.to_dict() for job in pagination.items]

    return jsonify({
        "jobs": jobs,
        "total": pagination.total,
        "page": page,
        "pages": pagination.pages
    })


# Получить очередь на модерацию
@admin_jobs_bp.route("/pending", methods=["GET"])
@jwt_required()
def list_pending_jobs():
    """Все вакансии в очереди модерации"""
    jobs = Job.query.filter_by(moderation_status="pending").all()
    return jsonify([job.to_dict() for job in jobs])


# Одобрить вакансию
@admin_jobs_bp.route("/<int:job_id>/approve", methods=["PATCH"])
@jwt_required()
def approve_job(job_id):
    """Одобрить вакансию (выставить moderation_status=approved)"""
    user_id = int(get_jwt_identity())
    admin = User.query.get(user_id)
    if not admin or admin.user_type != "admin":
        return jsonify({"error": "Доступ только для админов"}), 403

    job = Job.query.get_or_404(job_id)
    job.moderation_status = "approved"
    job.published_at = datetime.utcnow()
    job.moderated_by = admin.id
    job.moderated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Вакансия одобрена", "job": job.to_dict()})


# Отклонить вакансию
@admin_jobs_bp.route("/<int:job_id>/reject", methods=["PATCH"])
@jwt_required()
def reject_job(job_id):
    """Отклонить вакансию (moderation_status=rejected + comment)"""
    user_id = int(get_jwt_identity())
    admin = User.query.get(user_id)
    if not admin or admin.user_type != "admin":
        return jsonify({"error": "Доступ только для админов"}), 403

    data = request.get_json() or {}
    comment = data.get("comment")
    if not comment:
        return jsonify({"error": "Укажите причину отклонения"}), 400

    job = Job.query.get_or_404(job_id)
    job.moderation_status = "rejected"
    job.moderation_comment = comment
    job.moderated_by = admin.id
    job.moderated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Вакансия отклонена", "job": job.to_dict()})


@admin_jobs_bp.route("/<int:job_id>/delete", methods=["PUT"])
@jwt_required()
def delete_job(job_id):
    """Мягкое удаление вакансии (деактивация)"""
    user_id = int(get_jwt_identity())
    admin = User.query.get(user_id)
    if not admin or admin.user_type != "admin":
        return jsonify({"error": "Доступ только для админов"}), 403

    job = Job.query.get_or_404(job_id)
    job.is_active = False
    job.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Вакансия деактивирована", "job": job.to_dict()})

@admin_jobs_bp.route("/stats", methods=["GET"])
@jwt_required()
def moderation_stats():
    """Статистика по модерации вакансий"""
    user_id = int(get_jwt_identity())
    admin = User.query.get(user_id)
    if not admin or admin.user_type != "admin":
        return jsonify({"error": "Доступ только для админов"}), 403

    today = date.today()
    
    total_pending = Job.query.filter_by(moderation_status="pending").count()
    total_flagged = Job.query.filter(Job.moderation_status=="pending", Job.is_urgent==True).count()  # пример: считаем urgent как "флаги"
    
    approved_today = Job.query.filter(
        Job.moderation_status=="approved",
        db.func.date(Job.moderated_at)==today
    ).count()
    
    rejected_today = Job.query.filter(
        Job.moderation_status=="rejected",
        db.func.date(Job.moderated_at)==today
    ).count()

    return jsonify({
        "pending": total_pending,
        "flagged": total_flagged,
        "approved_today": approved_today,
        "rejected_today": rejected_today
    })


# 📌 Просмотр одной вакансии
@admin_jobs_bp.route("/<int:job_id>", methods=["GET"])
@jwt_required()
def get_job(job_id):
    """Получить детали вакансии"""
    job = Job.query.get_or_404(job_id)
    return jsonify(job.to_dict())