import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Filter,
  Tag,
} from "lucide-react";
import { apiRequest } from "../components/api/AuthUtils";

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все статьи");

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);

  // 🔹 Загрузка категорий и тегов
  const fetchCategoriesAndTags = async () => {
    try {
      const resCats = await apiRequest("/api/blog/categories", { method: "GET" });
      if (resCats.ok) {
        const cats = await resCats.json();
        setCategories([{ id: 0, name: "Все статьи" }, ...cats]);
      }

      const resTags = await apiRequest("/api/blog/tags", { method: "GET" });
      if (resTags.ok) {
        const tg = await resTags.json();
        setTags(tg);
      }
    } catch (err) {
      console.error("Ошибка загрузки категорий/тегов:", err);
    }
  };

  // 🔹 Загрузка статей
  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        category: selectedCategory !== "Все статьи" ? selectedCategory : "",
        page: 1,
        per_page: 10,
      });

      const res = await apiRequest(`/api/blog/posts?${params.toString()}`, { method: "GET" });
      if (!res.ok) throw new Error("Ошибка API");

      const data = await res.json();
      setPosts(data.items);

      // featured = либо первый с флагом, либо просто первый пост
      const feat = data.items.find((p) => p.is_featured) || data.items[0];
      setFeaturedPost(feat || null);
    } catch (err) {
      console.error("Ошибка загрузки статей:", err);
    }
  };

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [searchQuery, selectedCategory]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-sm font-medium">HR-блог WorkPlus.kz</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Экспертные статьи о{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                найме и карьере
              </span>
            </h1>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Поиск */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Поиск по статьям
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Введите ключевые слова..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Категории */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 border border-yellow-400/20 rounded-2xl overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="inline-flex items-center px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full mb-4">
                  <TrendingUp className="w-3 h-3 text-yellow-400 mr-2" />
                  <span className="text-yellow-400 text-xs font-medium">Популярное</span>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">{featuredPost.title}</h2>
                <p className="text-gray-300 mb-6">{featuredPost.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {featuredPost.created_at?.slice(0, 10)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {featuredPost.read_time || "—"}
                  </div>
                </div>
                <a href={`/blog/post/${featuredPost.id}`} className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium">
                  Читать статью
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <a href={`/blog/post/${post.id}`}
                key={post.id}
                className="bg-white/5 border border-yellow-400/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-xs font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center text-gray-400 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.read_time || "—"}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{post.title}</h3>
                <p className="text-gray-300 mb-4 text-sm">{post.excerpt}</p>
                <div className="flex items-center text-xs text-gray-400">
                  <User className="w-3 h-3 mr-1" />
                  {post.author}
                  <Calendar className="w-3 h-3 ml-4 mr-1" />
                  {post.created_at?.slice(0, 10)}
                </div>
              </a >
            ))}
          </div>
        </div>
      </section>

      {/* Sidebar: Popular Tags */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/5 border border-yellow-400/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <Tag className="w-5 h-5 mr-2 text-yellow-400" /> Популярные теги
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                className="px-3 py-1.5 bg-white/5 border border-gray-700 rounded-full text-gray-300 text-sm hover:border-yellow-400/40 hover:text-yellow-400"
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
