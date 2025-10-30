import React, { useEffect, useState } from "react";
import { apiRequest } from "../../components/api/AuthUtils";
import {
  Calendar,
  Clock,
  User,
  Check,
  X,
  Trash2,
  Plus,
  Hourglass,
  BookOpen,
  Edit,
  Eye,
  Filter,
  Search,
  Star,
  TrendingUp,
  AlertCircle,
  Tag,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    image: "",
    read_time: "",
    is_featured: false,
  });

  const fetchPosts = async () => {
    try {
      const res = await apiRequest("/api/blog/admin/posts", { method: "GET" });
      if (!res.ok) throw new Error("Ошибка API");
      const data = await res.json();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      console.error("Ошибка загрузки статей:", err);
    }
  };

  const createPost = async () => {
    if (!form.title || !form.content) {
      alert("Заполните обязательные поля: заголовок и текст");
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
      await fetchPosts();
      setForm({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "",
        image: "",
        read_time: "",
        is_featured: false,
      });
      setShowForm(false);
      alert("Статья успешно создана!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании статьи");
    } finally {
      setLoading(false);
    }
  };

  const approvePost = async (id) => {
    const res = await apiRequest(`/api/blog/admin/posts/${id}/approve`, {
      method: "PUT",
    });
    if (res.ok) {
      fetchPosts();
      alert("Статья одобрена!");
    }
  };

  const rejectPost = async (id) => {
    const res = await apiRequest(`/api/blog/admin/posts/${id}/reject`, {
      method: "PUT",
    });
    if (res.ok) {
      fetchPosts();
      alert("Статья отклонена");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту статью?")) return;
    
    const res = await apiRequest(`/api/blog/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchPosts();
      alert("Статья удалена");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Фильтрация
  useEffect(() => {
    let filtered = posts;

    // Фильтр по статусу
    if (filterStatus === "pending") {
      filtered = filtered.filter(p => p.is_approved === null);
    } else if (filterStatus === "approved") {
      filtered = filtered.filter(p => p.is_approved === true);
    } else if (filterStatus === "rejected") {
      filtered = filtered.filter(p => p.is_approved === false);
    }

    // Поиск
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, filterStatus, searchQuery]);

  const pendingCount = posts.filter(p => p.is_approved === null).length;
  const approvedCount = posts.filter(p => p.is_approved === true).length;
  const rejectedCount = posts.filter(p => p.is_approved === false).length;

  const getStatusBadge = (post) => {
    if (post.is_approved === null) {
      return (
        <span className="flex items-center px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-xs font-medium">
          <Hourglass className="w-3 h-3 mr-1.5" />
          На модерации
        </span>
      );
    }
    if (post.is_approved === true) {
      return (
        <span className="flex items-center px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
          <Check className="w-3 h-3 mr-1.5" />
          Опубликована
        </span>
      );
    }
    return (
      <span className="flex items-center px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-medium">
        <X className="w-3 h-3 mr-1.5" />
        Отклонена
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="inline-flex items-center px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4">
                <BookOpen className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-yellow-400 text-sm font-medium">Панель администратора</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                Управление статьями
              </h1>
              <p className="text-lg text-gray-300">
                Модерация и создание контента для блога
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Create Form */}
      {showForm && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white/2">
          <div className="max-w-7xl mx-auto">
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

              <div className="space-y-6">
                {/* Title & Excerpt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Заголовок *
                    </label>
                    <input
                      type="text"
                      placeholder="Заголовок статьи"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Краткое описание
                    </label>
                    <input
                      type="text"
                      placeholder="Краткое описание для превью"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      value={form.excerpt}
                      onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category & Read Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Статус
                    </label>
                    <label className="flex items-center px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-yellow-400/30 transition-all">
                      <input
                        type="checkbox"
                        checked={form.is_featured}
                        onChange={(e) =>
                          setForm({ ...form, is_featured: e.target.checked })
                        }
                        className="w-5 h-5 text-yellow-400 border-gray-600 rounded focus:ring-yellow-400 focus:ring-offset-gray-800"
                      />
                      <Star className="w-4 h-4 text-yellow-400 mx-2" />
                      <span className="text-white">Featured</span>
                    </label>
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
                    rows={10}
                    placeholder="Содержание статьи..."
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
                        Создание...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Создать и опубликовать
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

      {/* Filter & Search */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск по заголовку, автору..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                >
                  <option value="all">Все статьи</option>
                  <option value="pending">На модерации</option>
                  <option value="approved">Опубликованные</option>
                  <option value="rejected">Отклоненные</option>
                </select>
              </div>
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery || filterStatus !== 'all' ? 'Статьи не найдены' : 'Нет статей'}
              </h3>
              <p className="text-gray-400">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Попробуйте изменить параметры поиска или фильтрации'
                  : 'Создайте первую статью для блога'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
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
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg md:text-xl font-bold text-white">
                              {post.title}
                            </h3>
                            {post.is_featured && (
                              <Star className="w-5 h-5 text-yellow-400 fill-current flex-shrink-0" />
                            )}
                          </div>
                          {post.excerpt && (
                            <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-3">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {post.author || 'Аноним'}
                        </span>
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
                        {post.category && (
                          <span className="px-2 py-1 bg-white/5 border border-gray-700 rounded text-gray-300">
                            {post.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(post)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:min-w-[200px]">
                      {/* Moderation buttons */}
                      {post.is_approved === null && (
                        <>
                          <button
                            onClick={() => approvePost(post.id)}
                            className="flex-1 lg:w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Одобрить
                          </button>
                          <button
                            onClick={() => rejectPost(post.id)}
                            className="flex-1 lg:w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Отклонить
                          </button>
                        </>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 lg:w-full">
                        {post.is_approved && (
                          <Link
                            to={`/blog/${post.id}`}
                            className="flex-1 p-2 bg-white/5 border border-gray-700 rounded-lg text-gray-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all flex items-center justify-center"
                            title="Просмотр"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          className="flex-1 p-2 bg-white/5 border border-gray-700 rounded-lg text-gray-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all flex items-center justify-center"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="flex-1 p-2 bg-white/5 border border-gray-700 rounded-lg text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all flex items-center justify-center"
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

export default AdminBlogPage;