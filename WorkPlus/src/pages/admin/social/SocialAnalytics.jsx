import React, { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  Filter,
  Download,
  Instagram,
  MessageCircle,
  Send,
  Music4,
  Clock,
  Target,
  Zap,
  Award,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const SocialAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  
  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'threads', name: 'Threads', icon: MessageCircle, color: 'bg-black' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-blue-500' },
    { id: 'tiktok', name: 'TikTok', icon: Music4, color: 'bg-black' }
  ];

  const overviewMetrics = [
    {
      title: 'Общий охват',
      value: '127.8K',
      change: '+18.2%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-400'
    },
    {
      title: 'Новые подписчики',
      value: '+1,247',
      change: '+23.1%',
      trend: 'up',
      icon: Users,
      color: 'text-green-400'
    },
    {
      title: 'Взаимодействия',
      value: '8,934',
      change: '+15.7%',
      trend: 'up',
      icon: Heart,
      color: 'text-red-400'
    },
    {
      title: 'Переходы на сайт',
      value: '2,156',
      change: '-5.3%',
      trend: 'down',
      icon: Target,
      color: 'text-orange-400'
    }
  ];

  const platformMetrics = [
    {
      platform: 'Instagram',
      icon: Instagram,
      followers: '12.5K',
      growth: '+185',
      engagement: '4.2%',
      reach: '45.6K',
      posts: 23,
      bestTime: '18:00-20:00',
      color: 'from-purple-500 to-pink-500'
    },
    {
      platform: 'Threads',
      icon: MessageCircle,
      followers: '3.2K',
      growth: '+89',
      engagement: '6.8%',
      reach: '18.3K',
      posts: 15,
      bestTime: '12:00-14:00',
      color: 'from-gray-700 to-black'
    },
    {
      platform: 'Telegram',
      icon: Send,
      followers: '8.7K',
      growth: '+234',
      engagement: '12.3%',
      reach: '32.1K',
      posts: 18,
      bestTime: '09:00-11:00',
      color: 'from-blue-400 to-blue-600'
    },
    {
      platform: 'TikTok',
      icon: Music4,
      followers: '756',
      growth: '+45',
      engagement: '8.9%',
      reach: '5.2K',
      posts: 5,
      bestTime: '19:00-21:00',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const topPosts = [
    {
      id: 1,
      title: 'Топ-5 ошибок на собеседовании',
      platform: 'Instagram',
      publishedAt: '2 дня назад',
      reach: 15600,
      engagement: 892,
      clicks: 234,
      saves: 156,
      shares: 89,
      type: 'carousel'
    },
    {
      id: 2,
      title: 'Срочно! Вакансии курьеров в Алматы',
      platform: 'Telegram',
      publishedAt: '1 день назад',
      reach: 8900,
      engagement: 445,
      clicks: 189,
      saves: 23,
      shares: 67,
      type: 'text'
    },
    {
      id: 3,
      title: 'Как составить резюме за 10 минут?',
      platform: 'Threads',
      publishedAt: '3 дня назад',
      reach: 5600,
      engagement: 234,
      clicks: 78,
      saves: 45,
      shares: 34,
      type: 'text'
    }
  ];

  const audienceInsights = {
    demographics: {
      age: [
        { range: '18-24', percentage: 28, count: '3.2K' },
        { range: '25-34', percentage: 42, count: '4.8K' },
        { range: '35-44', percentage: 23, count: '2.6K' },
        { range: '45+', percentage: 7, count: '0.8K' }
      ],
      gender: {
        male: 45,
        female: 55
      },
      locations: [
        { city: 'Алматы', percentage: 34 },
        { city: 'Нур-Султан', percentage: 28 },
        { city: 'Шымкент', percentage: 15 },
        { city: 'Караганда', percentage: 12 },
        { city: 'Другие', percentage: 11 }
      ]
    },
    interests: [
      { category: 'Карьера', percentage: 78 },
      { category: 'Образование', percentage: 65 },
      { category: 'Бизнес', percentage: 52 },
      { category: 'Технологии', percentage: 43 },
      { category: 'Финансы', percentage: 38 }
    ]
  };

  const getPlatformIcon = (platformName) => {
    const platform = platforms.find(p => p.name === platformName);
    return platform ? platform.icon : Instagram;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Header */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4 md:mb-6">
              <BarChart3 className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-xs md:text-sm font-medium">Мультиканальная аналитика</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Аналитика
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                соцсетей
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Подробная статистика эффективности контента и ROI по всем каналам продвижения вакансий
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white/5 border border-yellow-400/20 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all">
                <Download className="w-4 h-4" />
                Экспорт данных
              </button>
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:from-yellow-500 hover:to-yellow-700 transition-all font-medium">
                <BarChart3 className="w-4 h-4" />
                Создать отчет
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-300 mr-2">Период:</label>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="7d">Последние 7 дней</option>
                    <option value="30d">Последние 30 дней</option>
                    <option value="90d">Последние 3 месяца</option>
                    <option value="1y">Последний год</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-300 mr-2">Платформа:</label>
                  <select 
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="all">Все платформы</option>
                    <option value="instagram">Instagram</option>
                    <option value="threads">Threads</option>
                    <option value="telegram">Telegram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Metrics */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewMetrics.map((metric, index) => {
              const Icon = metric.icon;
              const TrendIcon = metric.trend === 'up' ? ArrowUp : ArrowDown;
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gray-800/50`}>
                      <Icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendIcon className="w-3 h-3" />
                      {metric.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                    <p className="text-sm text-gray-300">{metric.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Platform Performance */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg">
                <div className="p-6 border-b border-gray-700/50">
                  <h2 className="text-xl font-semibold text-white">Производительность по платформам</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {platformMetrics.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <div key={platform.platform} className="bg-white/5 border border-gray-700/50 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${platform.color}`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">{platform.platform}</h3>
                                <p className="text-sm text-gray-400">Лучшее время: {platform.bestTime}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white">{platform.followers}</p>
                              <p className="text-sm text-green-400">+{platform.growth}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Охват</p>
                              <p className="font-semibold text-white">{platform.reach}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Вовлечение</p>
                              <p className="font-semibold text-white">{platform.engagement}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Посты</p>
                              <p className="font-semibold text-white">{platform.posts}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Рост</p>
                              <p className="font-semibold text-green-400">+{platform.growth}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Posts */}
            <div>
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg">
                <div className="p-6 border-b border-gray-700/50">
                  <h2 className="text-xl font-semibold text-white">Топ публикации</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {topPosts.map((post, index) => {
                      const Icon = getPlatformIcon(post.platform);
                      return (
                        <div key={post.id} className="bg-white/5 border border-gray-700/50 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                              #{index + 1}
                            </div>
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">{post.platform}</span>
                          </div>
                          
                          <h3 className="font-medium text-white mb-2">{post.title}</h3>
                          <p className="text-xs text-gray-400 mb-3">{post.publishedAt}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-gray-400">Охват</p>
                              <p className="font-semibold text-white">{post.reach.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Вовлечения</p>
                              <p className="font-semibold text-white">{post.engagement}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Переходы</p>
                              <p className="font-semibold text-white">{post.clicks}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Репосты</p>
                              <p className="font-semibold text-white">{post.shares}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Performance */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-white">Анализ контента</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Content Types Performance */}
                <div>
                  <h3 className="font-semibold text-white mb-4">По типу контента</h3>
                  <div className="space-y-3">
                    {[
                      { type: 'Карусель', posts: 12, engagement: '5.8%', color: 'bg-blue-500' },
                      { type: 'Видео', posts: 8, engagement: '7.2%', color: 'bg-purple-500' },
                      { type: 'Текст', posts: 18, engagement: '4.1%', color: 'bg-green-500' },
                      { type: 'Изображение', posts: 15, engagement: '3.9%', color: 'bg-orange-500' }
                    ].map(item => (
                      <div key={item.type} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="font-medium text-white">{item.type}</span>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-semibold text-white">{item.engagement}</p>
                          <p className="text-gray-400">{item.posts} постов</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Times */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Лучшее время публикации</h3>
                  <div className="space-y-3">
                    {[
                      { time: '09:00-11:00', engagement: '6.8%', platform: 'Telegram' },
                      { time: '12:00-14:00', engagement: '6.2%', platform: 'Threads' },
                      { time: '18:00-20:00', engagement: '5.9%', platform: 'Instagram' },
                      { time: '19:00-21:00', engagement: '5.4%', platform: 'TikTok' }
                    ].map(item => (
                      <div key={item.time} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                        <div>
                          <p className="font-medium text-white">{item.time}</p>
                          <p className="text-sm text-gray-400">{item.platform}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-400">{item.engagement}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hashtag Performance */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Топ хештеги</h3>
                  <div className="space-y-3">
                    {[
                      { tag: '#работа', usage: 45, engagement: '5.2%' },
                      { tag: '#вакансии', usage: 38, engagement: '4.9%' },
                      { tag: '#карьера', usage: 32, engagement: '4.6%' },
                      { tag: '#найм', usage: 28, engagement: '4.3%' }
                    ].map(item => (
                      <div key={item.tag} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                        <div>
                          <p className="font-medium text-white">{item.tag}</p>
                          <p className="text-sm text-gray-400">{item.usage} использований</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-yellow-400">{item.engagement}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audience Insights */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Demographics */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">Демография аудитории</h2>
              </div>
              <div className="p-6">
                {/* Age Distribution */}
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3">По возрасту</h3>
                  <div className="space-y-3">
                    {audienceInsights.demographics.age.map(ageGroup => (
                      <div key={ageGroup.range} className="flex items-center gap-3">
                        <span className="w-16 text-sm font-medium text-white">{ageGroup.range}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full h-2 transition-all"
                            style={{ width: `${ageGroup.percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-sm text-gray-300">{ageGroup.percentage}%</span>
                        <span className="w-16 text-sm text-gray-400">{ageGroup.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender Distribution */}
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3">По полу</h3>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-pink-500/20 border border-pink-500/30 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-pink-400">{audienceInsights.demographics.gender.female}%</p>
                      <p className="text-sm text-gray-300">Женщины</p>
                    </div>
                    <div className="flex-1 bg-blue-500/20 border border-blue-500/30 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-400">{audienceInsights.demographics.gender.male}%</p>
                      <p className="text-sm text-gray-300">Мужчины</p>
                    </div>
                  </div>
                </div>

                {/* Top Locations */}
                <div>
                  <h3 className="font-semibold text-white mb-3">География</h3>
                  <div className="space-y-2">
                    {audienceInsights.demographics.locations.map(location => (
                      <div key={location.city} className="flex items-center justify-between p-2 hover:bg-white/5 rounded transition-all">
                        <span className="font-medium text-white">{location.city}</span>
                        <span className="text-gray-400">{location.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interests & Engagement Patterns */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">Интересы и активность</h2>
              </div>
              <div className="p-6">
                {/* Interest Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3">Интересы аудитории</h3>
                  <div className="space-y-3">
                    {audienceInsights.interests.map(interest => (
                      <div key={interest.category} className="flex items-center gap-3">
                        <span className="flex-1 font-medium text-white">{interest.category}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-600 rounded-full h-2 transition-all"
                            style={{ width: `${interest.percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-sm text-gray-400">{interest.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Patterns */}
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3">Активность по дням</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
                      const activity = [85, 90, 88, 92, 78, 65, 70][index];
                      return (
                        <div key={day} className="text-center">
                          <div className="bg-gray-700 rounded-full h-16 w-8 mx-auto mb-2 flex items-end">
                            <div 
                              className="bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-full w-full transition-all"
                              style={{ height: `${activity}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400">{day}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Insights */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Ключевые инсайты</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">Пик активности</span>
                      </div>
                      <p className="text-sm text-blue-200">Четверг 12:00-14:00 показывает лучшую вовлеченность</p>
                    </div>
                    
                    <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-300">Рост аудитории</span>
                      </div>
                      <p className="text-sm text-green-200">+23% новых подписчиков за последнюю неделю</p>
                    </div>
                    
                    <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-medium text-orange-300">Лучший контент</span>
                      </div>
                      <p className="text-sm text-orange-200">Карусели с советами показывают +40% вовлеченности</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Competitor Comparison */}
          <section className="py-8 md:py-12">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Сравнение с <span className="text-yellow-400">конкурентами</span>
              </h2>
              <p className="text-gray-300">Анализ эффективности относительно других HR-платформ в Казахстане</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Competitor Table */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-700/50">
                    <h3 className="text-xl font-semibold text-white">Показатели по платформам</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700/50">
                          <th className="text-left py-4 px-6 font-semibold text-gray-300">Платформа</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-300">Подписчики</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-300">Охват</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-300">Вовлеченность</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-300">Посты/нед</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-300">Тренд</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        <tr className="bg-yellow-400/10 border border-yellow-400/20">
                          <td className="py-4 px-6 font-medium text-yellow-400">WorkPlus.kz (мы)</td>
                          <td className="py-4 px-4 text-white">24.4K</td>
                          <td className="py-4 px-4 text-white">32.1K</td>
                          <td className="py-4 px-4 text-white">6.8%</td>
                          <td className="py-4 px-4 text-white">15</td>
                          <td className="py-4 px-4">
                            <span className="flex items-center gap-1 text-green-400 bg-green-400/20 px-2 py-1 rounded-full text-xs">
                              <TrendingUp className="w-3 h-3" />
                              +18%
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-all">
                          <td className="py-4 px-6 font-medium text-white">hh.kz</td>
                          <td className="py-4 px-4 text-gray-300">45.2K</td>
                          <td className="py-4 px-4 text-gray-300">28.3K</td>
                          <td className="py-4 px-4 text-gray-300">3.2%</td>
                          <td className="py-4 px-4 text-gray-300">8</td>
                          <td className="py-4 px-4">
                            <span className="flex items-center gap-1 text-blue-400 bg-blue-400/20 px-2 py-1 rounded-full text-xs">
                              <TrendingUp className="w-3 h-3" />
                              +5%
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-all">
                          <td className="py-4 px-6 font-medium text-white">enbek.kz</td>
                          <td className="py-4 px-4 text-gray-300">18.7K</td>
                          <td className="py-4 px-4 text-gray-300">12.1K</td>
                          <td className="py-4 px-4 text-gray-300">2.1%</td>
                          <td className="py-4 px-4 text-gray-300">4</td>
                          <td className="py-4 px-4">
                            <span className="flex items-center gap-1 text-red-400 bg-red-400/20 px-2 py-1 rounded-full text-xs">
                              <TrendingDown className="w-3 h-3" />
                              -2%
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ROI Metrics */}
              <div>
                <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-700/50">
                    <h3 className="text-xl font-semibold text-white">ROI по каналам</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {[
                        { 
                          channel: 'Instagram', 
                          cost: '45,000 ₸', 
                          conversions: 89, 
                          roi: '340%',
                          color: 'from-purple-500 to-pink-500'
                        },
                        { 
                          channel: 'Telegram', 
                          cost: '23,000 ₸', 
                          conversions: 156, 
                          roi: '520%',
                          color: 'from-blue-400 to-blue-600'
                        },
                        { 
                          channel: 'Threads', 
                          cost: '12,000 ₸', 
                          conversions: 67, 
                          roi: '280%',
                          color: 'from-gray-600 to-gray-800'
                        },
                        { 
                          channel: 'TikTok', 
                          cost: '8,000 ₸', 
                          conversions: 34, 
                          roi: '190%',
                          color: 'from-red-500 to-pink-600'
                        }
                      ].map(item => (
                        <div key={item.channel} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-gray-700/50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-white">{item.channel}</h4>
                            <span className="text-green-400 font-bold text-lg">{item.roi}</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Затраты:</span>
                              <span className="text-gray-300">{item.cost}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Конверсии:</span>
                              <span className="text-white font-medium">{item.conversions}</span>
                            </div>
                          </div>
                          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                              style={{ width: `${Math.min(parseInt(item.roi), 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SocialAnalytics;