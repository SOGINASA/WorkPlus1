import React, { useState, useEffect } from "react";
import { apiRequest } from "../components/api/AuthUtils";
import { Calendar, Clock, Check, X, Hourglass, Plus } from "lucide-react";

const UserBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    image: "",
    read_time: "",
  });

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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Мои статьи</h1>

      {/* --- Форма создания --- */}
      <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-semibold mb-4">Предложить статью</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Заголовок"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Краткое описание"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
          <input
            placeholder="Категория"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Теги (через запятую)"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <input
            placeholder="Ссылка на изображение"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white col-span-2"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <textarea
            placeholder="Текст статьи"
            rows={5}
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white col-span-2"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <input
            placeholder="Время чтения (например, 5 мин)"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={form.read_time}
            onChange={(e) => setForm({ ...form, read_time: e.target.value })}
          />
        </div>
        <button
          onClick={createPost}
          className="mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Отправить на модерацию
        </button>
      </div>

      {/* --- Список моих статей --- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Мои статьи</h2>
        {posts.length === 0 ? (
          <p className="text-gray-400">У вас пока нет статей</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-white">{post.title}</h3>
                <p className="text-gray-300 text-sm mb-2">{post.excerpt}</p>
                <div className="text-xs text-gray-400 flex items-center space-x-4 mb-2">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />{" "}
                    {post.created_at.slice(0, 10)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {post.read_time || "—"}
                  </span>
                </div>
                {/* Статус */}
                {post.is_approved === null && (
                  <div className="flex items-center text-yellow-400 text-sm">
                    <Hourglass className="w-4 h-4 mr-2" /> На модерации
                  </div>
                )}
                {post.is_approved === true && (
                  <div className="flex items-center text-green-400 text-sm">
                    <Check className="w-4 h-4 mr-2" /> Опубликована
                  </div>
                )}
                {post.is_approved === false && (
                  <div className="flex items-center text-red-400 text-sm">
                    <X className="w-4 h-4 mr-2" /> Отклонена
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBlogPage;
