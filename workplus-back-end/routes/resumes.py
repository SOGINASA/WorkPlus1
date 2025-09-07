# app.py
from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from models import db, Resume, ResumeExperience, ResumeEducation, ResumeSkill, ResumeLanguage, ResumeCourse

resume_bp = Blueprint("resume_bp", __name__)

def resume_to_dict(resume):
    return {
        "id": resume.id,
        "firstName": resume.first_name,
        "lastName": resume.last_name,
        "email": resume.email,
        "phone": resume.phone,
        "city": resume.city,
        "dateOfBirth": resume.date_of_birth,
        "photo": resume.photo,
        "position": resume.position,
        "salary": resume.salary,
        "workFormat": resume.work_format,
        "readyToRelocate": resume.ready_to_relocate,
        "summary": resume.summary,
        "experience": [
            {
                "company": e.company,
                "position": e.position,
                "startDate": e.start_date,
                "endDate": e.end_date,
                "current": e.current,
                "description": e.description,
            }
            for e in resume.experience
        ],
        "education": [
            {
                "institution": ed.institution,
                "degree": ed.degree,
                "field": ed.field,
                "startYear": ed.start_year,
                "endYear": ed.end_year,
                "current": ed.current,
            }
            for ed in resume.education
        ],
        "skills": [s.name for s in resume.skills],
        "languages": [{"name": l.name, "level": l.level} for l in resume.languages],
        "courses": [
            {
                "name": c.name,
                "organization": c.organization,
                "year": c.year,
                "certificate": c.certificate,
            }
            for c in resume.courses
        ],
    }


@resume_bp.route("/create", methods=["POST"])
def create_resume():
    data = request.json
    resume = Resume(
        first_name=data.get("firstName"),
        last_name=data.get("lastName"),
        email=data.get("email"),
        phone=data.get("phone"),
        city=data.get("city"),
        date_of_birth=data.get("dateOfBirth"),
        photo=data.get("photo"),
        position=data.get("position"),
        salary=data.get("salary"),
        work_format=data.get("workFormat"),
        ready_to_relocate=data.get("readyToRelocate"),
        summary=data.get("summary"),
    )

    # add relations
    for exp in data.get("experience", []):
        resume.experience.append(ResumeExperience(**exp))
    for edu in data.get("education", []):
        resume.education.append(ResumeEducation(**edu))
    for skill in data.get("skills", []):
        resume.skills.append(ResumeSkill(name=skill))
    for lang in data.get("languages", []):
        resume.languages.append(ResumeLanguage(**lang))
    for course in data.get("courses", []):
        resume.courses.append(ResumeCourse(**course))

    db.session.add(resume)
    db.session.commit()
    return jsonify(resume_to_dict(resume)), 201


@resume_bp.route("/get", methods=["GET"])
def get_resumes():
    resumes = Resume.query.all()
    return jsonify([resume_to_dict(r) for r in resumes])


@resume_bp.route("/<int:resume_id>", methods=["GET"])
def get_resume(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    return jsonify(resume_to_dict(resume))


@resume_bp.route("/<int:resume_id>", methods=["PUT"])
def update_resume(resume_id):
    data = request.json
    resume = Resume.query.get_or_404(resume_id)

    resume.first_name = data.get("firstName")
    resume.last_name = data.get("lastName")
    resume.email = data.get("email")
    resume.phone = data.get("phone")
    resume.city = data.get("city")
    resume.date_of_birth = data.get("dateOfBirth")
    resume.photo = data.get("photo")
    resume.position = data.get("position")
    resume.salary = data.get("salary")
    resume.work_format = data.get("workFormat")
    resume.ready_to_relocate = data.get("readyToRelocate")
    resume.summary = data.get("summary")

    # Удаляем старые связанные данные и добавляем новые
    resume.experience.clear()
    for exp in data.get("experience", []):
        resume.experience.append(ResumeExperience(**exp))
    resume.education.clear()
    for edu in data.get("education", []):
        resume.education.append(ResumeEducation(**edu))
    resume.skills.clear()
    for skill in data.get("skills", []):
        resume.skills.append(ResumeSkill(name=skill))
    resume.languages.clear()
    for lang in data.get("languages", []):
        resume.languages.append(ResumeLanguage(**lang))
    resume.courses.clear()
    for course in data.get("courses", []):
        resume.courses.append(ResumeCourse(**course))

    db.session.commit()
    return jsonify(resume_to_dict(resume))


@resume_bp.route("/<int:resume_id>", methods=["DELETE"])
def delete_resume(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    db.session.delete(resume)
    db.session.commit()
    return jsonify({"message": "Resume deleted"})

@resume_bp.route("/find/<int:user_id>", methods=["GET"])
def find_resume_by_user(user_id):
    resume = Resume.query.filter_by(user_id=user_id).first()
    if not resume:
        return jsonify({"message": "Resume not found"}), 404
    return jsonify(resume_to_dict(resume))