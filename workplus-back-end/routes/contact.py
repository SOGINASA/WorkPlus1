from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, Contact
from sqlalchemy import or_, func, desc
from datetime import datetime, timedelta

contact_bp = Blueprint('contact', __name__)


@contact_bp.route('/', methods=['GET'])
def get_contacts():
    try:
        contacts_list = Contact.query.all()
        return jsonify([contact.to_dict() for contact in contacts_list]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@contact_bp.route('/<int:id>', methods=['GET'])
def get_contact(id):
    try:
        contact = Contact.query.get(id)
        if contact:
            return jsonify(contact.to_dict()), 200
        else:
            return jsonify({'error': 'Contact not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@contact_bp.route('/create', methods=['POST'])
def create_contact():
    try:
        data = request.get_json()

        name = data.get('name')
        email = data.get('email')
        company = data.get('company')
        subject = data.get('subject')
        message = data.get('message')

        contact = Contact(name=name, email=email, company=company, subject=subject, message=message)

        db.session.add(contact)
        db.session.commit()

        return jsonify(contact.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500