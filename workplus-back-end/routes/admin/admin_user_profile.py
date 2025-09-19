import datetime
from flask import Blueprint, jsonify, request
from sqlalchemy import desc
from models import (
    Company, JobApplication, ProfileView, db, User, Job,
)

user_profile_bp = Blueprint("user_profile_bp", __name__)

# ---------- GET: профиль ----------
@user_profile_bp.route("/<int:user_id>", methods=["GET"])
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404

    base = {
        "id": user.id,
        "name": user.name,
        "email": getattr(user, "email", None),
        "phone": getattr(user, "phone", None),
        "city": getattr(user, "city", None),
        "user_type": user.user_type,
        "is_active": getattr(user, "is_active", True),
        "created_at": user.created_at.isoformat() if getattr(user, "created_at", None) else None,
    }

    result = dict(base)
    result["violations"] = []  # пока без реальной модели

    if user.user_type == "candidate":
        # краткий слепок кандидатского профиля, если есть отношения/метод
        cand = getattr(user, "candidate_profile", None)
        result["candidate_profile"] = cand.to_dict() if cand and hasattr(cand, "to_dict") else {}

        # Активность кандидата
        apps = (db.session.query(JobApplication)
                .filter(JobApplication.candidate_id == user.id)
                .order_by(JobApplication.created_at.desc())
                .limit(10).all())

        views = (db.session.query(ProfileView)
                 .filter(ProfileView.candidate_id == user.id)
                 .order_by(ProfileView.viewed_at.desc())
                 .limit(10).all())

        result["activity"] = [
            *[{
                "date": a.created_at.isoformat() if a.created_at else None,
                "type": "application",
                "title": getattr(getattr(a, "job", None), "title", "Отклик"),
                "subtitle": getattr(getattr(getattr(a, "job", None), "company", None), "name", ""),
            } for a in apps],
            *[{
                "date": v.viewed_at.isoformat() if v.viewed_at else None,
                "type": "profile_view",
                "title": "Просмотр профиля",
                "subtitle": getattr(getattr(v, "viewer", None), "name", "Неизвестный"),
            } for v in views],
        ]

        result.setdefault("stats", {})
        result["stats"].update({
            "applications_last_30d": db.session.query(JobApplication)
                .filter(
                    JobApplication.candidate_id == user.id,
                    JobApplication.created_at >= datetime.datetime.utcnow() - datetime.timedelta(days=30)
                ).count()
        })

    elif user.user_type == "employer":
        company = user.company
        result["company"] = company.to_dict() if company and hasattr(company, "to_dict") else (
            {
                "id": company.id,
                "name": company.name,
                "description": getattr(company, "description", ""),
                "industry": getattr(company, "industry", ""),
                "size": getattr(company, "size", ""),
                "website": getattr(company, "website", ""),
            } if company else None
        )

        jobs = Job.query.filter_by(company_id=company.id).order_by(desc(Job.created_at)).all() if company else []
        result["jobs"] = [j.to_dict() if hasattr(j, "to_dict") else {
            "id": j.id, "title": j.title, "employment_type": getattr(j, "employment_type", None),
            "status": getattr(j, "status", None),
            "created_at": j.created_at.isoformat() if j.created_at else None
        } for j in jobs]

        recent_apps = (db.session.query(JobApplication)
                       .join(Job, JobApplication.job_id == Job.id)
                       .filter(Job.company_id == (company.id if company else None))
                       .order_by(JobApplication.created_at.desc())
                       .limit(10).all()) if company else []

        result["activity"] = [
            *[{
                "date": j.created_at.isoformat() if j.created_at else None,
                "type": "job_post",
                "title": f'Публикация вакансии "{j.title}"',
                "subtitle": result["company"]["name"] if result.get("company") else "",
            } for j in jobs[:10]],
            *[{
                "date": a.created_at.isoformat() if a.created_at else None,
                "type": "application_received",
                "title": f'Отклик на "{getattr(a.job, "title", "вакансию")}"',
                "subtitle": getattr(a.candidate, "name", "Кандидат"),
            } for a in recent_apps],
        ]

        active_jobs = [j for j in jobs if getattr(j, "status", "active") == "active"]
        result["stats"] = {
            "activeJobs": len(active_jobs),
            "totalJobs": len(jobs),
            "applicationsReceived": len(recent_apps),
        }
    else:
        result["activity"] = []
        result["stats"] = {}

    return jsonify(result)

# ---------- PUT: базовые поля пользователя ----------
@user_profile_bp.route("/<int:user_id>", methods=["PUT"])
def update_user_profile(user_id):
    print("penis")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404

    data = request.json or {}
    print(data)
    for key in ["name", "phone", "city"]:
        if key in data:
            setattr(user, key, data[key])
    
    if "city" in data:
        user.city = data["city"]

    db.session.commit()
    return jsonify({
        "id": user.id,
        "name": user.name,
        "phone": getattr(user, "phone", None),
        "city": getattr(user, "city", None),
    })

# ---------- PUT: профиль кандидата ----------
@user_profile_bp.route("/<int:user_id>/candidate", methods=["PUT"])
def update_candidate_profile(user_id):
    user = User.query.get(user_id)
    if not user or user.user_type != "candidate":
        return jsonify({"error": "Кандидат не найден"}), 404

    profile = getattr(user, "candidate_profile", None)
    if not profile:
        return jsonify({"error": "Профиль кандидата отсутствует"}), 404

    data = request.json or {}
    for key in ["desired_position", "salary_from", "salary_to", "about"]:
        if key in data:
            setattr(profile, key, data[key])

    db.session.commit()
    return jsonify(profile.to_dict() if hasattr(profile, "to_dict") else {
        "desired_position": getattr(profile, "desired_position", None),
        "salary_from": getattr(profile, "salary_from", None),
        "salary_to": getattr(profile, "salary_to", None),
        "about": getattr(profile, "about", None),
    })

# ---------- PUT: работодатель/компания ----------
@user_profile_bp.route("/<int:user_id>/employer", methods=["PUT"])
def update_employer_profile(user_id):
    user = User.query.get(user_id)
    if not user or user.user_type != "employer":
        return jsonify({"error": "Работодатель не найден"}), 404

    company = user.company
    if not company:
        return jsonify({"error": "Компания не найдена"}), 404

    data = request.json or {}
    print(data)

    # поля компании
    for key in ["name", "description", "industry", "size", "website"]:
        if key in data:
            setattr(company, key, data[key])

    # контактные/город владельца аккаунта
    for key in ["city", "phone", "email"]:
        if key in data:
            setattr(user, key, data[key])

    if "city" in data:
        user.city = data["city"]

    db.session.commit()
    return jsonify(company.to_dict() if hasattr(company, "to_dict") else {
        "id": company.id,
        "name": company.name,
        "description": getattr(company, "description", ""),
        "industry": getattr(company, "industry", ""),
        "size": getattr(company, "size", ""),
        "website": getattr(company, "website", ""),
    })

# ---------- PATCH: статус (блок/разблок) ----------
@user_profile_bp.route("/<int:user_id>/status", methods=["PATCH"])
def update_user_status(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404

    data = request.json or {}
    status = data.get("status")  # "active" / "blocked"
    if status not in ("active", "blocked"):
        return jsonify({"error": "Некорректный статус"}), 400

    user.is_active = (status == "active")
    db.session.commit()
    return jsonify({"id": user.id, "is_active": user.is_active})
