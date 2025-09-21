from routes.auth import auth_bp
from routes.jobs import jobs_bp
from routes.employer import employer_bp
from routes.companies import companies_bp  
from routes.profile import profile_bp
from routes.notifications import notifications_bp
from routes.contact import contact_bp
from routes.resumes import resume_bp
from routes.admin.admin_users import admin_users_bp
from routes.admin.admin_user_list import admin_user_list_bp
from routes.admin.admin_employer_list import admin_employer_bp
from routes.admin.admin_user_profile import user_profile_bp
from routes.admin.admin_jobs import admin_jobs_bp
from routes.admin.admin_job_analytics import job_analytics_bp

__all__ = [
    "auth_bp",
    "jobs_bp",
    "employer_bp",
    "companies_bp",
    "notifications_bp",
    "profile_bp",
    "contact_bp",
    "resume_bp",
    "admin_users_bp",
    "admin_user_list_bp",
    "admin_employer_bp",
    "user_profile_bp",
    "admin_jobs_bp",
    "job_analytics_bp",
]
