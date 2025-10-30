import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../components/api/AuthUtils";
import { Calendar, Clock, User, ArrowLeft, Tag, BookOpen, Share2, Eye, Heart, MessageCircle, Bookmark } from "lucide-react";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt || post?.title,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка статьи...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Статья не найдена</h2>
          <p className="text-gray-400 mb-6">Возможно, она была удалена или не существует</p>
          <Link
            to="/blog"
            className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к блогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-lg border-b border-yellow-400/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center text-gray-300 hover:text-yellow-400 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Назад к блогу
            </Link>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLiked(!liked)}
                className={`p-2 rounded-lg transition-all ${
                  liked 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-red-400'
                }`}
                title="Нравится"
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-lg transition-all ${
                  bookmarked 
                    ? 'bg-yellow-400/20 text-yellow-400' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-yellow-400'
                }`}
                title="Сохранить"
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white/5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-yellow-400 transition-all"
                title="Поделиться"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Category Badge */}
          {post.category && (
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-sm font-medium">
                <Tag className="w-4 h-4 mr-2" />
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/20 rounded-full flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{post.author}</div>
                <div className="text-xs text-gray-400">Автор</div>
              </div>
            </div>

            <div className="flex items-center text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {new Date(post.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div className="flex items-center text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{post.read_time || '5 мин'} чтения</span>
            </div>

            {post.views && (
              <div className="flex items-center text-gray-400">
                <Eye className="w-4 h-4 mr-2" />
                <span className="text-sm">{post.views} просмотров</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="relative rounded-2xl overflow-hidden border border-yellow-400/20 mb-12">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-2xl p-6 md:p-10">
            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div 
                className="text-gray-300 leading-relaxed"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.75'
                }}
              >
                {post.content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-6 first:mt-0">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-yellow-400/10">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-yellow-400" />
                  Теги статьи
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-gray-300 text-sm hover:border-yellow-400/40 hover:text-yellow-400 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Author Card */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-black" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-2">Об авторе</h4>
                <p className="text-lg font-medium text-yellow-400 mb-2">{post.author}</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {post.author_bio || 'Эксперт в области HR и подбора персонала. Делится практическим опытом и актуальными трендами рынка труда.'}
                </p>
              </div>
            </div>
          </div>

          {/* Social Share */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">Понравилась статья?</span>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    liked 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-white/5 text-gray-400 border border-gray-700 hover:border-red-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">Нравится</span>
                </button>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Поделиться</span>
              </button>
            </div>
          </div>

          {/* Comments Section Placeholder */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-yellow-400" />
                Комментарии
              </h3>
              <span className="text-sm text-gray-400">0 комментариев</span>
            </div>
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Будьте первым, кто оставит комментарий</p>
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all">
                Оставить комментарий
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-2xl p-6 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-yellow-400/20 rounded-full mb-6">
              <BookOpen className="w-8 h-8 text-yellow-400" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Хотите опубликовать свою статью?
            </h3>
            
            <p className="text-gray-300 mb-8 text-base md:text-lg max-w-2xl mx-auto">
              Поделитесь экспертизой и опытом с сообществом WorkPlus.kz. 
              Мы поможем вашему контенту достичь тысяч HR-специалистов и работодателей.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/blog/create"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Предложить статью
              </Link>
              <Link
                to="/contact"
                className="border border-yellow-400/40 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:bg-yellow-400/10 transition-all flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Связаться с редакцией
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">10K+</div>
                <div className="text-sm text-gray-400">Читателей ежемесячно</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">200+</div>
                <div className="text-sm text-gray-400">Опубликованных статей</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">50+</div>
                <div className="text-sm text-gray-400">Экспертов-авторов</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SinglePost;