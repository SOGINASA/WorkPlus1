from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, BlogPost, BlogCategory, BlogTag, User

blog_bp = Blueprint("blog", __name__, url_prefix="/api/blog")


# 🔹 Получить опубликованные статьи
@blog_bp.route("/posts", methods=["GET"])
def get_posts():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 6, type=int)
    category = request.args.get("category")
    search = request.args.get("search")

    query = BlogPost.query.filter_by(is_approved=True, is_active=True)

    if category:
        query = query.join(BlogCategory).filter(BlogCategory.name == category)

    if search:
        query = query.filter(BlogPost.title.ilike(f"%{search}%"))

    posts = query.order_by(BlogPost.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "items": [p.to_dict() for p in posts.items],
        "page": posts.page,
        "pages": posts.pages,
        "total": posts.total,
    })


# 🔹 Получить конкретную статью
@blog_bp.route("/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    if not post.is_active or post.is_approved is not True:
        return jsonify({"error": "Статья ещё не опубликована"}), 403
    return jsonify(post.to_dict())


# 🔹 Создать статью (юзер → на модерацию)
@blog_bp.route("/posts", methods=["POST"])
@jwt_required()
def create_post():
    data = request.json
    user_id = int(get_jwt_identity())

    post = BlogPost(
        title=data.get("title"),
        excerpt=data.get("excerpt"),
        content=data.get("content"),
        category_id=data.get("category_id"),
        author_id=user_id,
        image_url=data.get("image"),
        read_time=data.get("read_time"),
        is_featured=data.get("is_featured", False),
        is_active=True,
        is_approved=None,  # ждёт модерации
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201


# 🔹 Обновить статью (только автор или админ)
@blog_bp.route("/posts/<int:post_id>", methods=["PUT"])
@jwt_required()
def update_post(post_id):
    data = request.json
    user_id = int(get_jwt_identity())
    post = BlogPost.query.get_or_404(post_id)

    if post.author_id != user_id:
        user = User.query.get(user_id)
        if not user or user.user_type != "admin":
            return jsonify({"error": "Нет прав на редактирование"}), 403

    post.title = data.get("title", post.title)
    post.excerpt = data.get("excerpt", post.excerpt)
    post.content = data.get("content", post.content)
    post.category_id = data.get("category_id", post.category_id)
    post.image_url = data.get("image", post.image_url)
    post.read_time = data.get("read_time", post.read_time)
    post.is_featured = data.get("is_featured", post.is_featured)
    post.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify(post.to_dict())


# 🔹 Удалить статью (только автор или админ)
@blog_bp.route("/posts/<int:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    user_id = int(get_jwt_identity())
    post = BlogPost.query.get_or_404(post_id)

    if post.author_id != user_id:
        user = User.query.get(user_id)
        if not user or user.user_type != "admin":
            return jsonify({"error": "Нет прав на удаление"}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Статья удалена"})


# 🔹 Статьи текущего пользователя
@blog_bp.route("/my-posts", methods=["GET"])
@jwt_required()
def my_posts():
    user_id = int(get_jwt_identity())
    posts = BlogPost.query.filter_by(author_id=user_id).order_by(BlogPost.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts])


# 🔹 Все статьи (для админа/модерации)
@blog_bp.route("/admin/posts", methods=["GET"])
@jwt_required()
def admin_posts():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.user_type != "admin":
        return jsonify({"error": "Доступ запрещён"}), 403

    posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts])


# 🔹 Одобрить статью
@blog_bp.route("/admin/posts/<int:post_id>/approve", methods=["PUT"])
@jwt_required()
def approve_post(post_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.user_type != "admin":
        return jsonify({"error": "Доступ запрещён"}), 403

    post = BlogPost.query.get_or_404(post_id)
    post.is_approved = True
    post.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Статья одобрена"})


# 🔹 Отклонить статью
@blog_bp.route("/admin/posts/<int:post_id>/reject", methods=["PUT"])
@jwt_required()
def reject_post(post_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.user_type != "admin":
        return jsonify({"error": "Доступ запрещён"}), 403

    post = BlogPost.query.get_or_404(post_id)
    post.is_approved = False
    post.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Статья отклонена"})


# 🔹 Категории
@blog_bp.route("/categories", methods=["GET"])
def get_categories():
    cats = BlogCategory.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in cats])


# 🔹 Теги
@blog_bp.route("/tags", methods=["GET"])
def get_tags():
    tags = BlogTag.query.all()
    return jsonify([{"id": t.id, "name": t.name} for t in tags])
