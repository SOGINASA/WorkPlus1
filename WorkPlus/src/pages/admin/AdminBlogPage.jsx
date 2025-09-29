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
} from "lucide-react";

const AdminBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category_id: "",
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
    } catch (err) {
      console.error("Ошибка загрузки статей:", err);
    }
  };

  const createPost = async () => {
    try {
      const res = await apiRequest("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()),
        }),
      });
      if (!res.ok) throw new Error("Ошибка при создании статьи");
      await fetchPosts();
      setForm({
        title: "",
        excerpt: "",
        content: "",
        category_id: "",
        tags: "",
        image: "",
        read_time: "",
        is_featured: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const approvePost = async (id) => {
    const res = await apiRequest(`/api/blog/admin/posts/${id}/approve`, {
      method: "PUT",
    });
    if (res.ok) fetchPosts();
  };

  const rejectPost = async (id) => {
    const res = await apiRequest(`/api/blog/admin/posts/${id}/reject`, {
      method: "PUT",
    });
    if (res.ok) fetchPosts();
  };

  const deletePost = async (id) => {
    const res = await apiRequest(`/api/blog/posts/${id}`, { method: "DELETE" });
    if (res.ok) fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Заголовок */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-6">
          <BookOpen className="w-4 h-4 text-yellow-400 mr-2" />
          <span className="text-yellow-400 text-sm font-medium">
            Панель администратора блога
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Управление{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            статьями
          </span>
        </h1>
      </div>

      {/* --- Форма создания --- */}
      <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-white">Создать статью</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Заголовок"
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Краткое описание"
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
          <input
            placeholder="Категория (id)"
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          />
          <input
            placeholder="Теги (через запятую)"
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <input
            placeholder="Ссылка на изображение"
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white col-span-2"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <textarea
            placeholder="Текст статьи"
            rows={5}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white col-span-2"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <input
            placeholder="Время чтения (например, 5 мин)"
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            value={form.read_time}
            onChange={(e) => setForm({ ...form, read_time: e.target.value })}
          />
          <label className="flex items-center text-gray-300 space-x-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) =>
                setForm({ ...form, is_featured: e.target.checked })
              }
            />
            <span>Featured</span>
          </label>
        </div>
        <button
          onClick={createPost}
          className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Создать
        </button>
      </div>

      {/* --- Список статей --- */}
      <h2 className="text-2xl font-semibold mb-6 text-white">Все статьи</h2>
      {posts.length === 0 ? (
        <p className="text-gray-400">Нет статей</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 flex justify-between items-start hover:border-yellow-400/30 transition-all"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{post.title}</h3>
                <p className="text-gray-300 text-sm mb-2">{post.excerpt}</p>
                <div className="text-xs text-gray-400 flex items-center space-x-4 mb-2">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" /> {post.author}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />{" "}
                    {post.created_at?.slice(0, 10)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {post.read_time || "—"}
                  </span>
                </div>

                {/* Статус + кнопки */}
                {post.is_approved === null && (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center text-yellow-400 text-sm">
                      <Hourglass className="w-4 h-4 mr-1" /> На модерации
                    </span>
                    <button
                      onClick={() => approvePost(post.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
                    >
                      <Check className="w-4 h-4 mr-1" /> Одобрить
                    </button>
                    <button
                      onClick={() => rejectPost(post.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
                    >
                      <X className="w-4 h-4 mr-1" /> Отклонить
                    </button>
                  </div>
                )}
                {post.is_approved === true && (
                  <span className="flex items-center text-green-400 text-sm mt-2">
                    <Check className="w-4 h-4 mr-1" /> Опубликована
                  </span>
                )}
                {post.is_approved === false && (
                  <span className="flex items-center text-red-400 text-sm mt-2">
                    <X className="w-4 h-4 mr-1" /> Отклонена
                  </span>
                )}
              </div>

              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlogPage;
