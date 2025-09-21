# routes/admin/admin_job_analytics.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Analytics, Job, JobApplication
from datetime import datetime, timedelta
from sqlalchemy import func

job_analytics_bp = Blueprint("job_analytics", __name__)

# ================= Вспомогательная функция =================
def get_date_range(range_type, start_date=None, end_date=None):
    today = datetime.utcnow().date()

    if range_type == "yesterday":
        return today - timedelta(days=1), today - timedelta(days=1)
    elif range_type == "today":
        return today, today
    elif range_type == "7d":
        return today - timedelta(days=7), today
    elif range_type == "30d":
        return today - timedelta(days=30), today
    elif range_type == "90d":
        return today - timedelta(days=90), today
    elif range_type == "1y":
        return today - timedelta(days=365), today
    elif range_type == "custom" and start_date and end_date:
        return datetime.strptime(start_date, "%Y-%m-%d").date(), datetime.strptime(end_date, "%Y-%m-%d").date()
    return today - timedelta(days=30), today  # по умолчанию 30 дней


# ================== СВОДКА ==================
@job_analytics_bp.route("/summary", methods=["GET"])
@jwt_required()
def get_summary():
    range_type = request.args.get("range", "30d")
    start_date, end_date = get_date_range(
        range_type,
        request.args.get("start_date"),
        request.args.get("end_date")
    )

    # просмотры
    views = db.session.query(func.sum(Analytics.value)).filter(
        Analytics.metric_type == "job_views",
        Analytics.date >= start_date,
        Analytics.date <= end_date
    ).scalar() or 0

    # отклики
    applications = db.session.query(func.sum(Analytics.value)).filter(
        Analytics.metric_type == "applications",
        Analytics.date >= start_date,
        Analytics.date <= end_date
    ).scalar() or 0

    conversion = round((applications / views * 100), 2) if views > 0 else 0

    # среднее время до отклика
    avg_response_time = db.session.query(func.avg(
        func.extract("epoch", JobApplication.responded_at - JobApplication.created_at) / 3600
    )).filter(
        JobApplication.created_at >= start_date,
        JobApplication.created_at <= end_date,
        JobApplication.responded_at.isnot(None)
    ).scalar() or 0

    return jsonify({
        "range": range_type,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "views": views,
        "applications": applications,
        "conversion": conversion,
        "avg_response_time": round(avg_response_time, 2)
    })


# ================== ДИНАМИКА ==================
@job_analytics_bp.route("/views", methods=["GET"])
@jwt_required()
def get_views_data():
    range_type = request.args.get("range", "30d")
    start_date, end_date = get_date_range(
        range_type,
        request.args.get("start_date"),
        request.args.get("end_date")
    )

    metrics = db.session.query(Analytics).filter(
        Analytics.date >= start_date,
        Analytics.date <= end_date,
        Analytics.metric_type.in_(["job_views", "applications"])
    ).all()

    result = {}
    for m in metrics:
        day = m.date.isoformat()
        if day not in result:
            result[day] = {"views": 0, "applications": 0}
        if m.metric_type == "job_views":
            result[day]["views"] += m.value
        elif m.metric_type == "applications":
            result[day]["applications"] += m.value

    # превращаем в массив
    data = [{"date": d, **vals} for d, vals in result.items()]
    return jsonify(data)


# ================== КАТЕГОРИИ ==================
@job_analytics_bp.route("/categories", methods=["GET"])
@jwt_required()
def get_categories():
    range_type = request.args.get("range", "30d")
    start_date, end_date = get_date_range(
        range_type,
        request.args.get("start_date"),
        request.args.get("end_date")
    )

    # Считаем по всем вакансиям, даже если метрик нет
    jobs = db.session.query(
        Job.category,
        func.count(Job.id).label("jobs_count"),
        func.coalesce(func.sum(Job.applications_count), 0).label("applications_count"),
        func.coalesce(func.sum(Job.views_count), 0).label("views_count")
    ).filter(
        Job.created_at <= end_date,
        Job.is_active == True
    ).group_by(Job.category).all()

    result = []
    for category, jobs_count, apps_count, views_count in jobs:
        result.append({
            "name": category or "Без категории",
            "jobs": jobs_count,
            "applications": apps_count,
            "views": views_count
        })
    return jsonify(result)


# ================== ГОРОДА ==================
@job_analytics_bp.route("/locations", methods=["GET"])
@jwt_required()
def get_locations():
    range_type = request.args.get("range", "30d")
    start_date, end_date = get_date_range(
        range_type,
        request.args.get("start_date"),
        request.args.get("end_date")
    )

    locations = db.session.query(
        Job.city,
        func.count(Job.id).label("jobs_count"),
        func.coalesce(func.sum(Job.applications_count), 0).label("applications_count"),
        func.coalesce(func.avg(Job.views_count), 0).label("avg_views")
    ).filter(
        Job.created_at <= end_date,
        Job.is_active == True
    ).group_by(Job.city).all()

    result = []
    for city, jobs_count, apps_count, avg_views in locations:
        result.append({
            "city": city or "Без города",
            "jobs": jobs_count,
            "applications": apps_count,
            "avgViews": round(avg_views or 0, 1)
        })
    return jsonify(result)


# ================== ТОП ВАКАНСИЙ ==================
@job_analytics_bp.route("/top_jobs", methods=["GET"])
@jwt_required()
def get_top_jobs():
    range_type = request.args.get("range", "30d")
    start_date, end_date = get_date_range(
        range_type,
        request.args.get("start_date"),
        request.args.get("end_date")
    )

    jobs = db.session.query(Job).filter(
        Job.created_at <= end_date,
        Job.is_active == True
    ).order_by(Job.applications_count.desc()).limit(5).all()

    result = []
    for job in jobs:
        conversion = round((job.applications_count / job.views_count * 100), 2) if job.views_count > 0 else 0
        result.append({
            "id": job.id,
            "title": job.title,
            "company": job.company.name if job.company else None,
            "views": job.views_count or 0,
            "applications": job.applications_count or 0,
            "conversionRate": conversion,
            "category": job.category,
            "city": job.city
        })
    return jsonify(result)
