import React, { useState } from 'react';
import { Search, Calendar, Clock, User, ArrowRight, TrendingUp, Users, Building2, Target, BookOpen, Filter, Tag, Mail, Phone, MapPin, Instagram, MessageCircle, ExternalLink } from 'lucide-react';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все статьи');

  const categories = [
    'Все статьи',
    'HR-советы',
    'Тренды рынка',
    'Кейсы',
    'Гайды для соискателей',
    'Инструменты'
  ];

  const featuredPost = {
    title: 'Как закрыть продавца за 7 дней: пошаговый алгоритм для малого бизнеса',
    excerpt: 'Детальный разбор процесса подбора персонала для розничной торговли. От составления вакансии до успешного найма.',
    category: 'HR-советы',
    readTime: '12 мин',
    date: '15 декабря 2024',
    author: 'Анна Смирнова',
    image: '/api/placeholder/600/300'
  };

  const blogPosts = [
    {
      title: 'Threads для HR: как привлекать кандидатов через новую соцсеть',
      excerpt: 'Практические советы по использованию Threads для размещения вакансий и построения HR-бренда.',
      category: 'Тренды рынка',
      readTime: '8 мин',
      date: '12 декабря 2024',
      author: 'Максим Петров'
    },
    {
      title: 'Скоринг кандидатов: как отсеять неподходящих на этапе отклика',
      excerpt: 'Система оценки соискателей, которая поможет сэкономить время на собеседованиях.',
      category: 'Инструменты',
      readTime: '15 мин',
      date: '10 декабря 2024',
      author: 'Елена Козлова'
    },
    {
      title: 'Кейс: как ресторан в Петропавловске закрыл 5 вакансий за неделю',
      excerpt: 'Разбор успешного кейса подбора персонала для ресторанного бизнеса через мультиканальную стратегию.',
      category: 'Кейсы',
      readTime: '10 мин',
      date: '8 декабря 2024',
      author: 'Дмитрий Волков'
    },
    {
      title: 'Зарплатные ожидания в Северном Казахстане: исследование 2024',
      excerpt: 'Анализ зарплатных предложений и ожиданий соискателей в регионе по различным специальностям.',
      category: 'Тренды рынка',
      readTime: '20 мин',
      date: '5 декабря 2024',
      author: 'Ольга Иванова'
    },
    {
      title: '10 вопросов, которые нельзя задавать на собеседовании',
      excerpt: 'Юридические и этические аспекты проведения интервью. Как избежать дискриминации и конфликтов.',
      category: 'HR-советы',
      readTime: '7 мин',
      date: '3 декабря 2024',
      author: 'Анна Смирнова'
    },
    {
      title: 'Как написать резюме, которое заметят: гайд для соискателей',
      excerpt: 'Практические советы по составлению эффективного резюме с примерами и чек-листом.',
      category: 'Гайды для соискателей',
      readTime: '12 мин',
      date: '1 декабря 2024',
      author: 'Сергей Николаев'
    },
    {
      title: 'SMM в HR: как социальные сети меняют рынок труда',
      excerpt: 'Влияние социальных медиа на процессы найма и поиска работы в Казахстане.',
      category: 'Тренды рынка',
      readTime: '14 мин',
      date: '28 ноября 2024',
      author: 'Максим Петров'
    },
    {
      title: 'Адаптация новых сотрудников: 30-дневный план',
      excerpt: 'Пошаговый план введения в должность, который поможет новичкам быстрее влиться в команду.',
      category: 'HR-советы',
      readTime: '18 мин',
      date: '25 ноября 2024',
      author: 'Елена Козлова'
    }
  ];

  const popularTags = [
    'найм персонала',
    'соцсети в HR',
    'скоринг кандидатов',
    'собеседование',
    'зарплаты Казахстан',
    'резюме',
    'адаптация',
    'мотивация'
  ];

  const filteredPosts = selectedCategory === 'Все статьи' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const searchedPosts = searchQuery 
    ? filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPosts;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4 md:mb-6">
              <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-xs md:text-sm font-medium">HR-блог WorkPlus.kz</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Экспертные статьи о
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                найме и карьере
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              Практические советы, кейсы, тренды и инструменты для эффективного подбора персонала 
              и успешного поиска работы в Казахстане
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-8 md:mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Поиск по статьям</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Введите ключевые слова..."
                      className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base appearance-none"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
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
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl overflow-hidden hover:border-yellow-400/40 transition-all group cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 p-8 md:p-12 flex items-center">
                <div>
                  <div className="inline-flex items-center px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full mb-4">
                    <TrendingUp className="w-3 h-3 text-yellow-400 mr-2" />
                    <span className="text-yellow-400 text-xs font-medium">Популярное</span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-base">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                    <div className="flex items-center text-gray-400">
                      <User className="w-4 h-4 mr-2" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  
                  <button className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
                    Читать статью
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              <div className="h-64 lg:h-auto bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-gray-600">
                  <BookOpen className="w-16 h-16 md:w-20 md:h-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {searchedPosts.map((post, index) => (
                  <article key={index} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all group cursor-pointer">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-xs font-medium">
                          {post.category}
                        </span>
                        <div className="flex items-center text-gray-400 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      
                      <h3 className="text-lg md:text-xl font-semibold mb-3 text-white group-hover:text-yellow-400 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-gray-400 text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center text-gray-400 text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {post.date}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8 md:mt-12">
                <button className="bg-white/5 border border-yellow-400/20 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all text-sm md:text-base">
                  Загрузить еще статьи
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-6 md:space-y-8">
              {/* Popular Tags */}
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-yellow-400" />
                  Популярные теги
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <button
                      key={index}
                      className="px-3 py-1.5 bg-white/5 border border-gray-700 rounded-full text-gray-300 text-sm hover:border-yellow-400/40 hover:text-yellow-400 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Подписка на новости
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Получайте свежие статьи о HR и карьере прямо на почту
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Ваш email"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  />
                  <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 px-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm">
                    Подписаться
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Категории</h3>
                <ul className="space-y-2">
                  {categories.slice(1).map((category, index) => (
                    <li key={index}>
                      <button 
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                          selectedCategory === category 
                            ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' 
                            : 'text-gray-300 hover:text-yellow-400 hover:bg-white/5'
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Хотите делиться экспертизой?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
            Предложите свою статью для публикации в нашем блоге и поделитесь опытом с сообществом
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center text-sm md:text-base">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Предложить статью
            </button>
            <button className="border border-yellow-400/40 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:bg-yellow-400/10 transition-all flex items-center justify-center text-sm md:text-base">
              Связаться с редакцией
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;