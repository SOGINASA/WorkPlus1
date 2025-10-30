import React, { useState, useEffect } from "react";
import { apiRequest } from "../components/api/AuthUtils";
import { Calendar, Clock, Check, X, Hourglass, Plus, BookOpen, Edit, Trash2, Eye, AlertCircle, FileText, Tag, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

const UserBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    image: "",
    read_time: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchMyPosts = async () => {
    try {
      const res = await apiRequest("/api/blog/my-posts", { method: "GET" });
      if (!res.ok) throw new Error("Ошибка API");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Ошибка загрузки статей:", err);
    }
  };

  const createPost = async () => {
    if (!form.title || !form.content) {
      alert("Заполните обязательные поля: заголовок и текст статьи");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(t => t),
        }),
      });
      if (!res.ok) throw new Error("Ошибка при создании статьи");
      
      await fetchMyPosts();
      setForm({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "",
        image: "",
        read_time: "",
      });
      setShowForm(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Ошибка при отправке статьи. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const getStatusBadge = (post) => {
    if (post.is_approved === null) {
      return (
        <div className="flex items-center px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-sm">
          <Hourglass className="w-4 h-4 mr-2" />
          На модерации
        </div>
      );
    }
    if (post.is_approved === true) {
      return (
        <div className="flex items-center px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm">
          <Check className="w-4 h-4 mr-2" />
          Опубликована
        </div>
      );
    }
    return (
      <div className="flex items-center px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm">
        <X className="w-4 h-4 mr-2" />
        Отклонена
      </div>
    );
  };

  const pendingCount = posts.filter(p => p.is_approved === null).length;
  const approvedCount = posts.filter(p => p.is_approved === true).length;
  const rejectedCount = posts.filter(p => p.is_approved === false).length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="inline-flex items-center px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4">
                <BookOpen className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-yellow-400 text-sm font-medium">Управление контентом</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                Мои статьи
              </h1>
              <p className="text-lg text-gray-300">
                Создавайте и управляйте своими публикациями
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-4 md:mt-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Создать статью
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">{posts.length}</div>
                  <div className="text-sm text-gray-400">Всего статей</div>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
                  <div className="text-sm text-gray-400">На модерации</div>
                </div>
                <Hourglass className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-400">{approvedCount}</div>
                  <div className="text-sm text-gray-400">Опубликовано</div>
                </div>
                <Check className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-400">{rejectedCount}</div>
                  <div className="text-sm text-gray-400">Отклонено</div>
                </div>
                <X className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {submitSuccess && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center">
            <Check className="w-5 h-5 text-green-400 mr-3" />
            <span className="text-green-400 font-medium">Статья успешно отправлена на модерацию!</span>
          </div>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white/2">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Edit className="w-6 h-6 mr-2 text-yellow-400" />
                  Создать новую статью
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">Перед отправкой убедитесь:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-300/80">
                    <li>Статья содержит уникальный и полезный контент</li>
                    <li>Текст проверен на грамматические ошибки</li>
                    <li>Заголовок привлекательный и информативный</li>
                    <li>Добавлены релевантные теги</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Заголовок статьи *
                  </label>
                  <input
                    type="text"
                    placeholder="Например: 10 советов по эффективному найму сотрудников"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Краткое описание
                  </label>
                  <input
                    type="text"
                    placeholder="Краткое описание статьи для превью"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  />
                </div>

                {/* Category & Read Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Категория
                    </label>
                    <input
                      type="text"
                      placeholder="HR, Рекрутинг, Карьера"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Время чтения
                    </label>
                    <input
                      type="text"
                      placeholder="5 мин"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      value={form.read_time}
                      onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-yellow-400" />
                    Теги
                  </label>
                  <input
                    type="text"
                    placeholder="hr, найм, собеседование (через запятую)"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2 text-yellow-400" />
                    Ссылка на изображение
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Текст статьи *
                  </label>
                  <textarea
                    rows={12}
                    placeholder="Напишите содержание статьи..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {form.content.length} символов
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={createPost}
                    disabled={loading || !form.title || !form.content}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Отправить на модерацию
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-white/5 transition-all"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts List */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Все мои статьи</h2>
          
          {posts.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">У вас пока нет статей</h3>
              <p className="text-gray-400 mb-6">Создайте свою первую статью и поделитесь знаниями с сообществом</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Создать первую статью
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4 mb-3">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-24 h-24 object-cover rounded-lg border border-yellow-400/20 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                        {post.category && (
                          <span className="px-2 py-1 bg-white/5 border border-gray-700 rounded text-gray-300">
                            {post.category}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.created_at).toLocaleDateString('ru-RU')}
                        </span>
                        {post.read_time && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.read_time}
                          </span>
                        )}
                        {post.views && (
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views} просмотров
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded text-yellow-400 text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-2 py-1 text-gray-500 text-xs">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-3 lg:items-end">
                      {getStatusBadge(post)}
                      
                      <div className="flex gap-2">
                        {post.is_approved && (
                          <Link
                            to={`/blog/${post.id}`}
                            className="p-2 bg-white/5 border border-gray-700 rounded-lg text-gray-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all"
                            title="Просмотр"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          className="p-2 bg-white/5 border border-gray-700 rounded-lg text-gray-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-white/5 border border-gray-700 rounded-lg text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserBlogPage;