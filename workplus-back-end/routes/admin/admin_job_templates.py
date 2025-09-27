from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, JobTemplate, Job, User, Company

job_templates_bp = Blueprint("job_templates", __name__)


@job_templates_bp.route("/", methods=["GET"])
def get_templates():
    templates = JobTemplate.query.all()
    return jsonify([t.to_dict() for t in templates])


@job_templates_bp.route("/<int:template_id>", methods=["GET"])
def get_template(template_id):
    template = JobTemplate.query.get_or_404(template_id)
    return jsonify(template.to_dict())


@job_templates_bp.route("/", methods=["POST"])
@jwt_required()
def create_template():
    data = request.get_json()
    template = JobTemplate(
        title=data["title"],
        description=data.get("description", ""),
        requirements="\n".join(data.get("requirements", [])),
        responsibilities="\n".join(data.get("responsibilities", [])),
        conditions="\n".join(data.get("conditions", [])),
        category=data.get("category", "Другое"),
        salary_min=data.get("salary", {}).get("min"),
        salary_max=data.get("salary", {}).get("max"),
        salary_currency=data.get("salary", {}).get("currency", "KZT"),
    )
    template.set_tags(data.get("tags", []))
    db.session.add(template)
    db.session.commit()
    return jsonify(template.to_dict()), 201


@job_templates_bp.route("/<int:template_id>", methods=["PUT"])
@jwt_required()
def update_template(template_id):
    template = JobTemplate.query.get_or_404(template_id)
    data = request.get_json()

    template.title = data.get("title", template.title)
    template.description = data.get("description", template.description)
    template.requirements = "\n".join(data.get("requirements", [])) if data.get("requirements") else template.requirements
    template.responsibilities = "\n".join(data.get("responsibilities", [])) if data.get("responsibilities") else template.responsibilities
    template.conditions = "\n".join(data.get("conditions", [])) if data.get("conditions") else template.conditions
    template.category = data.get("category", template.category)
    template.salary_min = data.get("salary", {}).get("min", template.salary_min)
    template.salary_max = data.get("salary", {}).get("max", template.salary_max)
    template.salary_currency = data.get("salary", {}).get("currency", template.salary_currency)
    template.set_tags(data.get("tags", template.get_tags()))

    db.session.commit()
    return jsonify(template.to_dict())


@job_templates_bp.route("/<int:template_id>", methods=["DELETE"])
@jwt_required()
def delete_template(template_id):
    template = JobTemplate.query.get_or_404(template_id)
    db.session.delete(template)
    db.session.commit()
    return jsonify({"message": "Template deleted"})


@job_templates_bp.route("/<int:template_id>/use", methods=["POST"])
@jwt_required()
def use_template(template_id):
    """Создать вакансию на основе шаблона"""
    template = JobTemplate.query.get_or_404(template_id)
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user or user.user_type not in ("admin", "employer"):
        return jsonify({"error": "Недостаточно прав"}), 403

    data = request.get_json() or {}

    new_job = Job(
        title=data.get("title", template.title),
        description=data.get("description", template.description),
        requirements="\n".join(data.get("requirements", [])) if data.get("requirements") else template.requirements,
        responsibilities="\n".join(data.get("responsibilities", [])) if data.get("responsibilities") else template.responsibilities,
        benefits="\n".join(template.get_tags()),  # можно теги как плюсы
        category=template.category,
        employment_type=data.get("employment_type", "full_time"),
        experience_level=data.get("experience_level", "junior"),
        salary_min=template.salary_min,
        salary_max=template.salary_max,
        salary_currency=template.salary_currency,
        city=data.get("city", user.city if user.city else None),
        company_id=user.company_id,
        posted_by=user.id,
    )

    db.session.add(new_job)

    # Увеличиваем счетчик использования шаблона
    template.usage_count += 1

    db.session.commit()
    return jsonify(new_job.to_dict()), 201

@job_templates_bp.route("/companies", methods=["GET"])
@jwt_required()
def list_companies():
    companies = Company.query.filter_by(is_active=True).all()
    return jsonify([c.to_dict() for c in companies])