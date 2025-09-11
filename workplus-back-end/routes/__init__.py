from routes.auth import auth_bp
from routes.jobs import jobs_bp
from routes.employer import employer_bp
from routes.companies import companies_bp  
from routes.profile import profile_bp
from routes.notifications import notifications_bp
from routes.contact import contact_bp
from routes.resumes import resume_bp
from routes.admin.admin_users import admin_users_bp

__all__ = [
    'auth_bp',
    'jobs_bp',
    'employer_bp',
    'companies_bp',
    'profile_bp',
    'notifications_bp',
    'contact_bp',
    'resume_bp'
]
