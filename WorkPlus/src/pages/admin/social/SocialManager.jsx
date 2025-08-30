import React, { useState } from 'react';
import { 
  Instagram, 
  MessageCircle, 
  Music4, 
  Send, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  BarChart3,
  Plus,
  Settings,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

const SocialManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      connected: true,
      followers: '12.5K',
      engagement: '4.2%',
      posts: 234,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      name: 'Threads',
      icon: MessageCircle,
      connected: true,
      followers: '3.2K',
      engagement: '6.8%',
      posts: 89,
      color: 'bg-black'
    },
    {
      name: 'TikTok',
      icon: Music4,
      connected: false,
      followers: '0',
      engagement: '0%',
      posts: 0,
      color: 'bg-black'
    },
    {
      name: 'Telegram',
      icon: Send,
      connected: true,
      followers: '8.7K',
      engagement: '12.3%',
      posts: 156,
      color: 'bg-blue-500'
    }
  ];

  const recentPosts = [
    {
      id: 1,
      platform: 'Instagram',
      content: 'Топ-5 вопросов на собеседовании для продавца',
      views: 2340,
      likes: 189,
      comments: 23,
      shares: 12,
      status: 'published',
      publishedAt: '2 часа назад'
    },
    {
      id: 2,
      platform: 'Threads',
      content: 'Как правильно составить резюме в 2024 году?',
      views: 1250,
      likes: 97,
      comments: 15,
      shares: 8,
      status: 'scheduled',
      publishedAt: 'через 3 часа'
    },
    {
      id: 3,
      platform: 'Telegram',
      content: 'Срочно! Требуются курьеры в Алматы. ЗП от 180,000 тенге',
      views: 3200,
      likes: 45,
      comments: 67,
      shares: 89,
      status: 'published',
      publishedAt: '1 день назад'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Управление соцсетями</h1>
            <p className="text-gray-300">Мультиканальная дистрибуция вакансий и контента</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition-colors font-medium">
              <Plus className="w-4 h-4" />
              Создать пост
            </button>
            <button className="bg-white/5 border border-yellow-400/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all">
              <Calendar className="w-4 h-4" />
              Планировщик
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'overview', label: 'Обзор' },
            { id: 'platforms', label: 'Платформы' },
            { id: 'posts', label: 'Публикации' },
            { id: 'analytics', label: 'Аналитика' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-yellow-400 text-yellow-400' 
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="px-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Общий охват</p>
                    <p className="text-2xl font-bold text-white">24.4K</p>
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +12% за неделю
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Вовлечение</p>
                    <p className="text-2xl font-bold text-white">6.8%</p>
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +0.3% за неделю
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-red-400" />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Подписчики</p>
                    <p className="text-2xl font-bold text-white">24.4K</p>
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +185 за неделю
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Переходы на сайт</p>
                    <p className="text-2xl font-bold text-white">1.2K</p>
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +23% за неделю
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Social Platforms Grid */}
          <div className="px-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.name} className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${platform.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        platform.connected ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {platform.connected ? 'Подключен' : 'Не подключен'}
                      </div>
                    </div>
                    <h3 className="font-semibold text-white mb-2">{platform.name}</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-300">Подписчики: <span className="font-medium text-yellow-400">{platform.followers}</span></p>
                      <p className="text-sm text-gray-300">Вовлечение: <span className="font-medium text-yellow-400">{platform.engagement}</span></p>
                      <p className="text-sm text-gray-300">Посты: <span className="font-medium text-yellow-400">{platform.posts}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="px-6">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Последние публикации</h2>
              </div>
              <div className="divide-y divide-gray-700">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-full text-sm font-medium">
                          {post.platform}
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${
                          post.status === 'published' ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {post.status === 'published' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {post.status === 'published' ? 'Опубликовано' : 'Запланировано'}
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{post.publishedAt}</span>
                    </div>
                    
                    <p className="text-white mb-3">{post.content}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {post.shares}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'platforms' && (
        <div className="px-6">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Управление платформами</h2>
            <p className="text-gray-300 mb-4">Настройте подключения к социальным сетям для мультиканальной дистрибуции</p>
            
            <div className="space-y-4">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.name} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${platform.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{platform.name}</h3>
                        <p className="text-sm text-gray-300">
                          {platform.connected ? `${platform.followers} подписчиков` : 'Не подключен'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        platform.connected ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {platform.connected ? 'Активен' : 'Отключен'}
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-200">
                        <Settings className="w-5 h-5" />
                      </button>
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        platform.connected 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                          : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/30'
                      }`}>
                        {platform.connected ? 'Отключить' : 'Подключить'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="px-6">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Все публикации</h2>
                <div className="flex gap-2">
                  <select className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white">
                    <option value="">Все платформы</option>
                    <option value="instagram">Instagram</option>
                    <option value="threads">Threads</option>
                    <option value="telegram">Telegram</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white">
                    <option value="">Все статусы</option>
                    <option value="published">Опубликовано</option>
                    <option value="scheduled">Запланировано</option>
                    <option value="draft">Черновик</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-700">
              {recentPosts.concat(recentPosts).map((post, index) => (
                <div key={`${post.id}-${index}`} className="p-6 hover:bg-white/5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-full text-sm font-medium">
                          {post.platform}
                        </span>
                        <div className={`flex items-center gap-1 text-xs ${
                          post.status === 'published' ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {post.status === 'published' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {post.status === 'published' ? 'Опубликовано' : 'Запланировано'}
                        </div>
                        <span className="text-sm text-gray-400">{post.publishedAt}</span>
                      </div>
                      
                      <p className="text-white mb-3">{post.content}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {post.comments}
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          {post.shares}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-200">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-700">
              <button className="w-full py-2 text-yellow-400 hover:text-yellow-300 font-medium">
                Показать больше публикаций
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="px-6 space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Подробная аналитика</h2>
            <p className="text-gray-300 mb-6">Глубокий анализ эффективности социальных сетей</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-700 rounded-lg p-4 bg-white/5">
                <h3 className="font-semibold text-white mb-2">Рост подписчиков</h3>
                <div className="h-48 bg-gray-800/50 rounded flex items-center justify-center">
                  <p className="text-gray-400">График роста подписчиков</p>
                </div>
              </div>
              
              <div className="border border-gray-700 rounded-lg p-4 bg-white/5">
                <h3 className="font-semibold text-white mb-2">Вовлеченность по платформам</h3>
                <div className="h-48 bg-gray-800/50 rounded flex items-center justify-center">
                  <p className="text-gray-400">Сравнение платформ</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Лучшие публикации за неделю</h3>
            <div className="space-y-4">
              {recentPosts.slice(0, 3).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium text-white truncate max-w-md">{post.content}</p>
                    <p className="text-sm text-gray-300">{post.platform} • {post.publishedAt}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialManager;