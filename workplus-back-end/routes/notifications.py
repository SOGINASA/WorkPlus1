from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification

notifications_bp = Blueprint("notifications", __name__)

# Получить список уведомлений
@notifications_bp.route("", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()

    query = Notification.query.filter_by(user_id=user_id)

    # фильтр по is_read
    is_read = request.args.get("is_read")
    if is_read is not None:
        query = query.filter_by(is_read=(is_read.lower() == "true"))

    # фильтр по типу
    notif_type = request.args.get("type")
    if notif_type:
        query = query.filter_by(type=notif_type)

    notifications = query.order_by(Notification.created_at.desc()).all()
    return jsonify({"notifications": [n.to_dict() for n in notifications]}), 200


# Отметить уведомление как прочитанное
@notifications_bp.route("/<int:notification_id>/read", methods=["PATCH"])
@jwt_required()
def mark_as_read(notification_id):
    user_id = get_jwt_identity()
    notif = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
    if not notif:
        return jsonify({"error": "Notification not found"}), 404

    notif.is_read = True
    db.session.commit()
    return jsonify({"message": "Notification marked as read"}), 200


# Отметить все как прочитанные
@notifications_bp.route("/mark-all-read", methods=["PATCH"])
@jwt_required()
def mark_all_as_read():
    user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=user_id, is_read=False).update({"is_read": True})
    db.session.commit()
    return jsonify({"message": "All notifications marked as read"}), 200


# Удалить уведомление
@notifications_bp.route("/<int:notification_id>", methods=["DELETE"])
@jwt_required()
def delete_notification(notification_id):
    user_id = get_jwt_identity()
    notif = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
    if not notif:
        return jsonify({"error": "Notification not found"}), 404

    db.session.delete(notif)
    db.session.commit()
    return jsonify({"message": "Notification deleted"}), 200


# 📌 Создать уведомление
@notifications_bp.route("", methods=["POST"])
@jwt_required()
def create_notification():
    """
    Создать новое уведомление.
    Пример запроса:
    {
        "user_id": 2,
        "type": "application_accepted",
        "message": "Ваша заявка принята!",
        "job_id": 10,
        "job_title": "Frontend Developer",
        "company_name": "Tech Corp",
        "chat_id": null,
        "interview_date": "2025-09-06T15:00:00"
    }
    """
    data = request.get_json()

    required_fields = ["user_id", "type", "message"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Поле '{field}' обязательно"}), 400

    notif = Notification(
        user_id=data["user_id"],
        type=data["type"],
        message=data["message"],
        job_id=data.get("job_id"),
        job_title=data.get("job_title"),
        company_name=data.get("company_name"),
        chat_id=data.get("chat_id"),
        interview_date=datetime.fromisoformat(data["interview_date"]) if data.get("interview_date") else None,
    )

    db.session.add(notif)
    db.session.commit()

    return jsonify({"message": "Уведомление создано", "notification": notif.to_dict()}), 201