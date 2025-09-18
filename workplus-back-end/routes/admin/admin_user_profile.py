# backend/routes/user_profile.py
import datetime
from flask import Blueprint, jsonify, request
from sqlalchemy import desc, func
from models import Company, JobApplication, ProfileView, db, User, get_candidate_profile_dict, Job

user_profile_bp = Blueprint("user_profile_bp", __name__, url_prefix="/api/admin/user_profile")

# Получить профиль пользователя
@user_profile_bp.route("/<int:user_id>", methods=["GET"])
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404

    # базовые поля
    base = user.to_dict(include_sensitive=True) if hasattr(user, "to_dict") else {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": getattr(user, "phone", None),
        "city": getattr(user, "city", None),
        "user_type": user.user_type,
        "is_active": getattr(user, "is_active", True),
        "created_at": user.created_at.isoformat() if getattr(user, "created_at", None) else None,
    }

    result = dict(base)
    result["violations"] = []  # если модели нет — отдадим пустой список

    if user.user_type == "candidate":
        # профиль кандидата (см. фикс выше)
        from models import get_candidate_profile_dict
        cand = get_candidate_profile_dict(user)
        result["candidate_profile"] = cand

        # Активность
        apps = (db.session.query(JobApplication)
            .filter(JobApplication.candidate_id == user.id)   # ✅ корректное поле
            .order_by(JobApplication.created_at.desc())
            .limit(10).all())

        views = (db.session.query(ProfileView)
            .filter(ProfileView.candidate_id == user.id)     # ✅ корректное поле
            .order_by(ProfileView.viewed_at.desc())
            .limit(10).all())


        result["activity"] = [
            *[{
                "date": a.created_at.isoformat() if a.created_at else None,
                "type": "application",
                "title": getattr(a, "job", {}).title if getattr(a, "job", None) else "Отклик",
                "subtitle": getattr(getattr(a, "job", None), "company", {}).name if getattr(getattr(a, "job", None), "company", None) else "",
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
                    JobApplication.candidate_id == user.id,  # правильное поле
                    JobApplication.created_at >= datetime.datetime.utcnow() - datetime.timedelta(days=30)  # кросс-БД вариант
                )
                .count()
        })

    elif user.user_type == "employer":
        # Компания
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

        # Вакансии
        jobs = Job.query.filter_by(company_id=company.id).order_by(desc(Job.created_at)).all() if company else []
        result["jobs"] = [j.to_dict() if hasattr(j, "to_dict") else {
            "id": j.id, "title": j.title, "employment_type": getattr(j, "employment_type", None),
            "status": getattr(j, "status", None), "created_at": j.created_at.isoformat() if j.created_at else None
        } for j in jobs]

        # Активность: публикации, отклики
        recent_apps = (db.session.query(JobApplication)
               .join(Job, JobApplication.job_id == Job.id)
               .filter(Job.company_id == company.id)
               .order_by(JobApplication.created_at.desc())
               .limit(10).all())


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

        # Статистика
        active_jobs = [j for j in jobs if getattr(j, "status", "active") == "active"]
        result["stats"] = {
            "activeJobs": len(active_jobs),
            "totalJobs": len(jobs),
            "applicationsReceived": len(recent_apps),
            # можно добавить доп. метрики, если есть поля
        }

    else:
        # admin — простая заглушка, чтобы вкладки не были пустыми
        result["activity"] = []
        result["stats"] = {}

    # Нарушения — если модели нет, оставляем пусто (UI сам покажет "Нарушений нет")
    result["violations"] = result.get("violations", [])

    return jsonify(result)


@user_profile_bp.route("/<int:user_id>", methods=["PUT"])
def update_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404

    data = request.json or {}
    # безопасные поля
    for key in ["name", "phone", "city"]:
        if key in data:
            setattr(user, key, data[key])

    db.session.commit()
    return jsonify({
        "id": user.id,
        "name": user.name,
        "phone": getattr(user, "phone", None),
        "city": getattr(user, "city", None),
    })


# ✅ Обновить профиль кандидата
@user_profile_bp.route("/<int:user_id>/candidate", methods=["PUT"])
def update_candidate_profile(user_id):
    user = User.query.get(user_id)
    if not user or user.user_type != "candidate":
        return jsonify({"error": "Кандидат не найден"}), 404

    profile = user.candidate_profile
    if not profile:
        return jsonify({"error": "Профиль кандидата отсутствует"}), 404

    data = request.json or {}
    if "desired_position" in data:
        profile.desired_position = data["desired_position"]
    if "salary_from" in data:
        profile.salary_from = data["salary_from"]
    if "salary_to" in data:
        profile.salary_to = data["salary_to"]
    if "about" in data:
        profile.about = data["about"]

    db.session.commit()
    return jsonify(profile.to_dict())


# ✅ Обновить компанию работодателя
@user_profile_bp.route("/<int:user_id>/employer", methods=["PUT"])
def update_employer_profile(user_id):
    user = User.query.get(user_id)
    if not user or user.user_type != "employer":
        return jsonify({"error": "Работодатель не найден"}), 404

    company = user.company
    if not company:
        return jsonify({"error": "Компания не найдена"}), 404

    data = request.json or {}
    if "name" in data:
        company.name = data["name"]
    if "description" in data:
        company.description = data["description"]
    if "industry" in data:
        company.industry = data["industry"]

    db.session.commit()
    return jsonify(company.to_dict())
