from flask import Blueprint, request, jsonify, current_app, send_from_directory, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
from sqlalchemy import desc, func
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid

from models import (
    db,
    User,
    Company,
    Job,
    JobApplication,
    CandidateProfile,
    WorkExperience,
    Education,
    Skill,
)

# === Blueprint с префиксом и отключённой строгой косой чертой ===
profile_bp = Blueprint(
    "profile",
    __name__,
    url_prefix="/api/profile",
    strict_slashes=False
)

# Разрешаем CORS для фронта (localhost:3000)
CORS(
    profile_bp,
    resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
    supports_credentials=True,
)

# ===== Файлы =====
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "pdf", "doc", "docx"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def allowed_file(filename: str, file_type: str = "image") -> bool:
    if not filename or "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    if file_type == "image":
        return ext in {"png", "jpg", "jpeg", "gif"}
    if file_type == "document":
        return ext in {"pdf", "doc", "docx"}
    return ext in ALLOWED_EXTENSIONS


# Позволяем preflight (OPTIONS) без редиректов и ошибок
@profile_bp.route("", methods=["GET", "PUT", "OPTIONS"])
@profile_bp.route("/", methods=["GET", "PUT", "OPTIONS"])
@jwt_required()
def profile_handler():
    if request.method == "OPTIONS":
        return "", 200
    if request.method == "GET":
        return get_profile()
    if request.method == "PUT":
        return update_profile()


# ==========================
# Профиль — получить
# ==========================
@profile_bp.route("/", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Пользователь не найден"}), 404

        # Разбиваем name на first/last для совместимости с фронтом
        first_name, last_name = _split_name(user.name)

        profile = {
            "id": user.id,
            "email": user.email,
            "first_name": first_name,
            "last_name": last_name,
            "phone": user.phone,
            "city": user.city,
            "user_type": user.user_type,
            # Аватары отключены — возвращаем None
            "avatar": None,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "last_login": user.last_login.isoformat() if user.last_login else None,
        }

        if user.user_type == "candidate":
            cp = CandidateProfile.query.filter_by(user_id=user_id).first()
            if cp:
                profile.update(
                    {
                        "birth_date": cp.birth_date.isoformat() if cp.birth_date else None,
                        "current_position": cp.current_position,
                        "desired_position": cp.desired_position,
                        "salary_from": cp.salary_from,
                        "salary_to": cp.salary_to,
                        "experience_years": cp.experience_years,
                        "work_schedule": cp.work_schedule,
                        "about": cp.about,
                        "is_public": cp.is_public,
                        "email_notifications": cp.email_notifications,
                        "sms_notifications": cp.sms_notifications,
                        "job_alerts": cp.job_alerts,
                        "resume_file": cp.resume_file,
                        # Списки
                        "skills": [s.name for s in cp.skills.order_by(Skill.name.asc()).all()],
                        "education": [
                            {
                                "institution": e.institution,
                                "specialty": e.specialty,
                                "degree": e.degree,
                                "start_year": e.start_year,
                                "end_year": e.end_year,
                                "is_current": e.is_current,
                                "gpa": e.gpa,
                                "description": e.description,
                            }
                            for e in cp.education.order_by(desc(Education.end_year)).all()
                        ],
                        "work_experience": [
                            {
                                "company": w.company_name,
                                "position": w.position,
                                "start_date": w.start_date.isoformat() if w.start_date else None,
                                "end_date": w.end_date.isoformat() if w.end_date else None,
                                "description": w.description,
                                "is_current": w.is_current,
                            }
                            for w in cp.work_experience.order_by(desc(WorkExperience.start_date)).all()
                        ],
                    }
                )
        return jsonify(profile), 200
    except Exception as e:
        current_app.logger.exception(f"get_profile error: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500


# ==========================
# Профиль — обновить
# ==========================
@profile_bp.route("/", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Пользователь не найден"}), 404

        data = request.get_json(silent=True) or {}

        # Обновляем имя (first + last) и контакты
        fname = (data.get("firstName") or data.get("first_name") or "").strip()
        lname = (data.get("lastName") or data.get("last_name") or "").strip()
        full_name = (fname + " " + lname).strip() or user.name
        user.name = full_name
        user.phone = data.get("phone", user.phone)
        user.city = data.get("city", user.city)

        # Кандидатский профиль
        if user.user_type == "candidate":
            cp = CandidateProfile.query.filter_by(user_id=user_id).first()
            if not cp:
                cp = CandidateProfile(user_id=user_id)
                db.session.add(cp)
                db.session.flush()

            # Маппинг полей из фронта -> БД
            cp.birth_date = _parse_date(data.get("birthDate")) or cp.birth_date
            cp.current_position = data.get("currentPosition", cp.current_position)
            cp.desired_position = data.get("desiredPosition", cp.desired_position)
            cp.salary_from = _to_int_or_none(data.get("salaryFrom"))
            cp.salary_to = _to_int_or_none(data.get("salaryTo"))
            cp.experience_years = _to_int_or_default(data.get("experience"), cp.experience_years or 0)
            # Нормализуем формат расписания
            ws = data.get("workSchedule") or cp.work_schedule
            if ws in ("full-time", "full_time"):
                cp.work_schedule = "full_time"
            elif ws in ("part-time", "part_time"):
                cp.work_schedule = "part_time"
            else:
                cp.work_schedule = ws
            cp.about = data.get("about", cp.about)
            cp.is_public = bool(data.get("isPublic", cp.is_public))
            cp.email_notifications = bool(data.get("emailNotifications", cp.email_notifications))
            cp.sms_notifications = bool(data.get("smsNotifications", cp.sms_notifications))
            cp.job_alerts = bool(data.get("jobAlerts", cp.job_alerts))

            # Навыки — перезаписываем
            if isinstance(data.get("skills"), list):
                Skill.query.filter_by(candidate_profile_id=cp.id).delete()
                for raw in data["skills"]:
                    name = (raw or "").strip()
                    if name:
                        db.session.add(Skill(candidate_profile_id=cp.id, name=name))

            # Образование — перезаписываем
            if isinstance(data.get("education"), list):
                Education.query.filter_by(candidate_profile_id=cp.id).delete()
                for item in data["education"]:
                    if not isinstance(item, dict):
                        continue
                    db.session.add(
                        Education(
                            candidate_profile_id=cp.id,
                            institution=item.get("institution", ""),
                            specialty=item.get("specialty", ""),
                            degree=item.get("type") or item.get("degree", ""),
                            start_year=_to_int_or_none(item.get("start_year") or item.get("startYear")),
                            end_year=_to_int_or_none(item.get("end_year") or item.get("endYear")),
                            is_current=bool(item.get("is_current") or item.get("isCurrent") or False),
                            gpa=_to_float_or_none(item.get("gpa")),
                            description=item.get("description"),
                        )
                    )

            # Опыт работы — перезаписываем
            if isinstance(data.get("workExperience"), list):
                WorkExperience.query.filter_by(candidate_profile_id=cp.id).delete()
                for item in data["workExperience"]:
                    if not isinstance(item, dict):
                        continue
                    db.session.add(
                        WorkExperience(
                            candidate_profile_id=cp.id,
                            company_name=item.get("company", ""),
                            position=item.get("position", ""),
                            start_date=_parse_date(item.get("start_date") or item.get("startDate")),
                            end_date=_parse_date(item.get("end_date") or item.get("endDate")),
                            description=item.get("description"),
                            is_current=bool(item.get("is_current") or item.get("isCurrent") or False),
                        )
                    )

        db.session.commit()
        return jsonify({"message": "Профиль успешно обновлён"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception(f"update_profile error: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500


# ==========================
# Резюме — загрузка и скачивание
# ==========================
@profile_bp.route("/resume", methods=["POST"])
@jwt_required()
def upload_resume():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.user_type != "candidate":
            return jsonify({"error": "Доступ только для кандидатов"}), 403

        if "resume" not in request.files:
            return jsonify({"error": "Файл не предоставлен"}), 400
        file = request.files["resume"]
        if not file or file.filename == "":
            return jsonify({"error": "Файл не выбран"}), 400
        if not allowed_file(file.filename, "document"):
            return jsonify({"error": "Недопустимый тип файла. Разрешены: pdf, doc, docx"}), 400

        # Размер
        file.seek(0, os.SEEK_END)
        if file.tell() > MAX_FILE_SIZE:
            return jsonify({"error": "Размер файла превышает 5 МБ"}), 400
        file.seek(0)

        cp = CandidateProfile.query.filter_by(user_id=user_id).first()
        if not cp:
            cp = CandidateProfile(user_id=user_id)
            db.session.add(cp)
            db.session.flush()

        filename = f"resume_{user_id}_{uuid.uuid4().hex}_{secure_filename(file.filename)}"
        upload_dir = os.path.join(current_app.config.get("UPLOAD_FOLDER", "uploads"), "resumes")
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, filename)
        file.save(file_path)

        # Удалим старое
        if cp.resume_file:
            old = os.path.join(upload_dir, cp.resume_file)
            if os.path.exists(old):
                try:
                    os.remove(old)
                except OSError:
                    pass

        cp.resume_file = filename
        db.session.commit()
        return jsonify({"message": "Резюме успешно загружено", "resume_file": filename}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception(f"upload_resume error: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500


@profile_bp.route("/download-resume", methods=["GET"])
@jwt_required()
def download_resume():
    try:
        user_id = int(get_jwt_identity())
        cp = CandidateProfile.query.filter_by(user_id=user_id).first()
        if not cp or not cp.resume_file:
            return jsonify({"error": "Резюме не загружено"}), 404
        upload_dir = os.path.join(current_app.config.get("UPLOAD_FOLDER", "uploads"), "resumes")
        return send_from_directory(upload_dir, cp.resume_file, as_attachment=True)
    except Exception as e:
        current_app.logger.exception(f"download_resume error: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500


# ==========================
# Мои отклики на вакансии
# ==========================
@profile_bp.route("/applications", methods=["GET"])
@jwt_required()
def get_my_applications():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.user_type != "candidate":
            return jsonify({"error": "Доступ только для кандидатов"}), 403

        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 20, type=int), 100)
        status_filter = request.args.get("status")

        query = JobApplication.query.filter_by(candidate_id=user_id).join(Job).join(Company)
        if status_filter:
            query = query.filter(JobApplication.status == status_filter)
        query = query.order_by(desc(JobApplication.created_at))

        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        items = []
        for app in pagination.items:
            items.append(
                {
                    "id": app.id,
                    "job_id": app.job_id,
                    "vacancy_title": app.job.title if app.job else None,
                    "company_name": app.job.company.name if app.job and app.job.company else None,
                    "company_id": app.job.company.id if app.job and app.job.company else None,
                    "status": app.status,
                    "applied_date": app.created_at.isoformat() if app.created_at else None,
                    "response_date": app.responded_at.isoformat() if app.responded_at else None,
                    "response": app.hr_notes,
                    "salary": _salary_display(app.job),
                    "location": app.job.city if app.job else None,
                    "cover_letter": app.cover_letter,
                }
            )

        return (
            jsonify(
                {
                    "applications": items,
                    "pagination": {
                        "page": page,
                        "pages": pagination.pages,
                        "per_page": per_page,
                        "total": pagination.total,
                        "has_prev": pagination.has_prev,
                        "has_next": pagination.has_next,
                    },
                }
            ),
            200,
        )
    except Exception as e:
        current_app.logger.exception(f"get_my_applications error: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500


@profile_bp.route("/applications/<int:application_id>", methods=["DELETE"])
@jwt_required()
def withdraw_application(application_id: int):
    try:
        user_id = int(get_jwt_identity())
        app = JobApplication.query.filter_by(id=application_id, candidate_id=user_id).first()
        if not app:
            return jsonify({"error": "Заявка не найдена"}), 404
        if app.status in {"hired", "rejected"}:
            return jsonify({"error": "Нельзя отозвать заявку с текущим статусом"}), 400
        db.session.delete(app)
        db.session.commit()
        return jsonify({"message": "Заявка успешно отозвана"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception(f"withdraw_application error: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500


# ==========================
# Отклики компаний на резюме (агрегация по JobApplication)
# ==========================
@profile_bp.route("/resume-responses", methods=["GET"])
@jwt_required()
def get_resume_responses():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.user_type != "candidate":
            return jsonify({"error": "Доступ только для кандидатов"}), 403

        # Берём все заявки, по которым есть реакция
        query = (
            JobApplication.query.filter(JobApplication.candidate_id == user_id)
            .join(Job)
            .join(Company)
            .filter(
                (JobApplication.responded_at.isnot(None))
                | (JobApplication.status.in_(["viewed", "interview", "hired"]))
            )
            .order_by(desc(JobApplication.responded_at), desc(JobApplication.viewed_at), desc(JobApplication.created_at))
        )

        responses = []
        for app in query.all():
            company = app.job.company if app.job else None
            when = app.responded_at or app.viewed_at or app.created_at
            responses.append(
                {
                    "id": app.id,
                    "company_name": company.name if company else None,
                    "company_id": company.id if company else None,
                    "company_rating": getattr(company, "rating", None) if company else None,
                    "position": app.job.title if app.job else None,
                    "status": app.status,
                    "message": app.hr_notes,
                    "date": when.isoformat() if when else None,
                }
            )

        return jsonify({"responses": responses}), 200
    except Exception as e:
        current_app.logger.exception(f"get_resume_responses error: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500


# ==========================
# Статистика профиля
# ==========================
@profile_bp.route("/statistics", methods=["GET"])
@jwt_required()
def get_profile_statistics():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.user_type != "candidate":
            return jsonify({"error": "Доступ только для кандидатов"}), 403

        cp = CandidateProfile.query.filter_by(user_id=user_id).first()
        applications_q = JobApplication.query.filter_by(candidate_id=user_id)

        applications_sent = applications_q.count()
        responses_received = applications_q.filter(JobApplication.responded_at.isnot(None)).count()
        profile_views = cp.profile_views if cp else 0
        avg_hr_score = (
            db.session.query(func.avg(JobApplication.hr_score))
            .filter(JobApplication.candidate_id == user_id, JobApplication.hr_score.isnot(None))
            .scalar()
        )

        return (
            jsonify(
                {
                    "profileViews": int(profile_views or 0),
                    "applicationsSent": int(applications_sent or 0),
                    "responsesReceived": int(responses_received or 0),
                    "rating": float(avg_hr_score or 0.0),
                }
            ),
            200,
        )
    except Exception as e:
        current_app.logger.exception(f"get_profile_statistics error: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500


# ==========================
# Экспорт данных профиля
# ==========================
@profile_bp.route("/export-data", methods=["GET"])
@jwt_required()
def export_profile_data():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Пользователь не найден"}), 404

        cp = CandidateProfile.query.filter_by(user_id=user_id).first()
        applications = (
            JobApplication.query.filter_by(candidate_id=user_id).order_by(desc(JobApplication.created_at)).all()
        )

        payload = {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "phone": user.phone,
                "city": user.city,
                "user_type": user.user_type,
                "created_at": user.created_at.isoformat() if user.created_at else None,
            },
            "candidate_profile": cp.to_dict() if cp else None,
            "applications": [a.to_dict(include_candidate=False) for a in applications],
        }

        # Отдаём JSON-файл скачиванием
        from io import BytesIO
        import json as _json

        buf = BytesIO(_json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8"))
        buf.seek(0)
        filename = f"profile_export_{user_id}.json"
        return send_file(
            buf,
            mimetype="application/json; charset=utf-8",
            as_attachment=True,
            download_name=filename,
        )
    except Exception as e:
        current_app.logger.exception(f"export_profile_data error: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500


# ==========================
# Аватары отключены — заглушки
# ==========================
@profile_bp.route("/avatar", methods=["POST"])
@jwt_required()
def upload_avatar_disabled():
    return jsonify({"error": "Загрузка аватаров отключена. Используются инициалы."}), 400


@profile_bp.route("/avatar/<path:filename>", methods=["GET"])
def get_avatar_disabled(filename):
    return jsonify({"error": "Аватары отключены"}), 404


# ===== Хелперы =====

def _split_name(name: str):
    name = (name or "").strip()
    if not name:
        return "", ""
    parts = name.split(" ", 1)
    return (parts[0], parts[1] if len(parts) > 1 else "")


def _parse_date(val):
    if not val:
        return None
    try:
        # поддержка ISO-строк с Z
        if isinstance(val, str) and val.endswith("Z"):
            val = val.replace("Z", "+00:00")
        return datetime.fromisoformat(val).date() if isinstance(val, str) else val
    except Exception:
        return None


def _to_int_or_none(v):
    try:
        return int(v) if v not in (None, "", []) else None
    except Exception:
        return None


def _to_float_or_none(v):
    try:
        return float(v) if v not in (None, "", []) else None
    except Exception:
        return None


def _to_int_or_default(v, default=0):
    iv = _to_int_or_none(v)
    return iv if iv is not None else default


def _salary_display(job: Job | None):
    if not job:
        return None
    try:
        if job.salary_min and job.salary_max:
            return f"{job.salary_min}-{job.salary_max}"
        if job.salary_min:
            return f"{job.salary_min}+"
        if job.salary_max:
            return f"до {job.salary_max}"
        return None
    except Exception:
        return None
