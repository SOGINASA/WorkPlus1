import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../components/api/AuthUtils";
import { Calendar, Clock, User, ArrowLeft, Tag, BookOpen } from "lucide-react";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/api/blog/posts/${id}`, { method: "GET" });
      if (!res || !res.ok) throw new Error("Ошибка API");
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error("Ошибка загрузки статьи:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) {
    return <p className="text-center py-20 text-gray-400">Загрузка...</p>;
  }

  if (!post) {
    return <p className="text-center py-20 text-gray-400">Статья не найдена</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад к блогу
      </Link>

      {/* Hero */}
      <div className="mb-10">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-80 object-cover rounded-2xl border border-yellow-400/20 mb-6"
          />
        )}

        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" /> {post.author}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" /> {post.created_at.slice(0, 10)}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" /> {post.read_time || "—"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none mb-10">
        <p>{post.content}</p>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <Tag className="w-5 h-5 mr-2 text-yellow-400" />
            Теги
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-white/5 border border-gray-700 rounded-full text-gray-300 text-sm hover:border-yellow-400/40 hover:text-yellow-400 transition-all"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/20 rounded-xl p-8 text-center">
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">
          Хотите опубликовать свою статью?
        </h3>
        <p className="text-gray-300 mb-6 text-sm md:text-base">
          Поделитесь экспертизой и опытом с сообществом WorkPlus.kz
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5 mr-2" /> Предложить статью
          </button>
          <button className="border border-yellow-400/40 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-400/10 flex items-center justify-center">
            Связаться с редакцией
          </button>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
