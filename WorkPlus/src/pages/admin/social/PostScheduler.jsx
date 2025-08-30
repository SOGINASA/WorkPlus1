import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Instagram, 
  MessageCircle, 
  Send, 
  Music4,
  Save,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Image,
  Video,
  Link,
  Hash,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
  CheckCircle
} from 'lucide-react';

const PostScheduler = () => {
  const [view, setView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  
  const scheduledPosts = [
    {
      id: 1,
      title: 'Топ-5 навыков для продавца в 2024',
      content: 'Какие навыки нужны продавцу в современном мире? Разбираем самые важные компетенции...',
      platforms: ['instagram', 'threads'],
      scheduledDate: '2024-03-15',
      scheduledTime: '10:00',
      status: 'scheduled',
      type: 'image',
      engagement: { views: 0, likes: 0, comments: 0 }
    },
    {
      id: 2,
      title: 'Вакансия: Курьер в Алматы',
      content: 'Требуется курьер для доставки еды. ЗП от 180,000 тенге + чаевые. График свободный...',
      platforms: ['telegram', 'instagram'],
      scheduledDate: '2024-03-15',
      scheduledTime: '14:30',
      status: 'scheduled',
      type: 'text',
      engagement: { views: 0, likes: 0, comments: 0 }
    },
    {
      id: 3,
      title: 'Как подготовиться к собеседованию',
      content: 'Полезные советы для успешного прохождения собеседования. Что спросить у работодателя?',
      platforms: ['threads', 'telegram'],
      scheduledDate: '2024-03-16',
      scheduledTime: '09:00',
      status: 'draft',
      type: 'video',
      engagement: { views: 0, likes: 0, comments: 0 }
    },
    {
      id: 4,
      title: 'Массовый найм: 50 продавцов',
      content: 'Крупная сеть магазинов ищет продавцов-консультантов. Обучение за счет компании...',
      platforms: ['instagram', 'telegram'],
      scheduledDate: '2024-03-14',
      scheduledTime: '15:00',
      status: 'published',
      type: 'image',
      engagement: { views: 2340, likes: 189, comments: 23 }
    }
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500' },
    { id: 'threads', name: 'Threads', icon: MessageCircle, color: 'from-gray-700 to-black' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'from-blue-400 to-blue-600' },
    { id: 'tiktok', name: 'TikTok', icon: Music4, color: 'from-red-500 to-pink-500' }
  ];

  const getPlatformIcon = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.icon : Instagram;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'scheduled': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'draft': return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'published': return 'Опубликовано';
      case 'scheduled': return 'Запланировано';
      case 'draft': return 'Черновик';
      default: return 'Неизвестно';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'text': return Edit3;
      default: return Edit3;
    }
  };

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Header */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4 md:mb-6">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-xs md:text-sm font-medium">Мультиканальное планирование</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Планировщик
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                публикаций
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Планируйте и управляйте контентом для всех социальных сетей из единого места
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:from-yellow-500 hover:to-yellow-700 transition-all font-medium"
              >
                <Plus className="w-4 h-4" />
                Создать пост
              </button>
              <button className="bg-white/5 border border-yellow-400/20 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all">
                <Calendar className="w-4 h-4" />
                Календарь контента
              </button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-2">
              <div className="flex">
                {[
                  { id: 'calendar', label: 'Календарь', icon: Calendar },
                  { id: 'list', label: 'Список', icon: Clock }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setView(tab.id)}
                    className={`flex-1 px-4 py-3 font-medium rounded-xl flex items-center justify-center gap-2 transition-all ${
                      view === tab.id 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Calendar Header */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <h2 className="text-xl font-semibold text-white">Март 2024</h2>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-gray-600 rounded-lg hover:bg-white/10 transition-all">
                      <Filter className="w-4 h-4" />
                      Фильтр
                    </button>
                    <div className="flex gap-2">
                      {platforms.map(platform => {
                        const Icon = platform.icon;
                        return (
                          <button
                            key={platform.id}
                            className={`p-2 rounded-lg bg-gradient-to-r ${platform.color} opacity-75 hover:opacity-100 transition-all`}
                            title={platform.name}
                          >
                            <Icon className="w-4 h-4 text-white" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Days of week header */}
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {Array.from({ length: 35 }, (_, index) => {
                    const dayNumber = index - 4;
                    const isCurrentMonth = dayNumber >= 1 && dayNumber <= 31;
                    const dateStr = `2024-03-${dayNumber.toString().padStart(2, '0')}`;
                    const dayPosts = scheduledPosts.filter(post => post.scheduledDate === dateStr);
                    
                    return (
                      <div 
                        key={index}
                        className={`min-h-20 p-1 border border-gray-700/50 rounded ${
                          isCurrentMonth ? 'bg-white/5' : 'bg-gray-800/50'
                        } hover:bg-white/10 transition-all`}
                      >
                        <div className={`text-sm ${isCurrentMonth ? 'text-white' : 'text-gray-600'}`}>
                          {isCurrentMonth ? dayNumber : ''}
                        </div>
                        <div className="space-y-1 mt-1">
                          {dayPosts.slice(0, 2).map(post => (
                            <div
                              key={post.id}
                              className={`text-xs p-1 rounded truncate border cursor-pointer ${getStatusColor(post.status)}`}
                              title={post.title}
                            >
                              {post.scheduledTime} {post.title.slice(0, 15)}...
                            </div>
                          ))}
                          {dayPosts.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{dayPosts.length - 2} еще
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Today's Posts */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white">Сегодняшние публикации</h3>
              </div>
              <div className="p-6">
                {scheduledPosts
                  .filter(post => post.scheduledDate === '2024-03-15')
                  .map(post => (
                    <div key={post.id} className="flex items-center gap-4 p-4 bg-white/5 border border-gray-700/50 rounded-lg mb-3 last:mb-0 hover:bg-white/10 transition-all">
                      <div className="flex-shrink-0">
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{post.scheduledTime}</span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(post.status)}`}>
                            {getStatusText(post.status)}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">{post.title}</p>
                        <div className="flex items-center gap-2">
                          {post.platforms.map(platformId => {
                            const Icon = getPlatformIcon(platformId);
                            const platform = platforms.find(p => p.id === platformId);
                            return (
                              <div key={platformId} className={`p-1 rounded bg-gradient-to-r ${platform?.color || 'from-gray-500 to-gray-600'}`}>
                                <Icon className="w-3 h-3 text-white" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Поиск по заголовку или содержанию..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <select className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                    <option value="">Все статусы</option>
                    <option value="published">Опубликовано</option>
                    <option value="scheduled">Запланировано</option>
                    <option value="draft">Черновик</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                    <option value="">Все платформы</option>
                    <option value="instagram">Instagram</option>
                    <option value="threads">Threads</option>
                    <option value="telegram">Telegram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                    <option value="">Все типы</option>
                    <option value="text">Текст</option>
                    <option value="image">Изображение</option>
                    <option value="video">Видео</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white">Все публикации ({scheduledPosts.length})</h3>
              </div>
              <div className="divide-y divide-gray-700/50">
                {scheduledPosts.map(post => {
                  const TypeIcon = getTypeIcon(post.type);
                  return (
                    <div key={post.id} className="p-6 hover:bg-white/5 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <TypeIcon className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-white">{post.title}</span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(post.status)}`}>
                              {getStatusText(post.status)}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 mb-3 line-clamp-2">{post.content}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(post.scheduledDate).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.scheduledTime}
                            </div>
                            <div className="flex items-center gap-2">
                              {post.platforms.map(platformId => {
                                const Icon = getPlatformIcon(platformId);
                                const platform = platforms.find(p => p.id === platformId);
                                return (
                                  <div key={platformId} className={`p-1 rounded bg-gradient-to-r ${platform?.color || 'from-gray-500 to-gray-600'}`}>
                                    <Icon className="w-3 h-3 text-white" />
                                  </div>
                                );
                              })}
                            </div>
                            {post.status === 'published' && (
                              <div className="flex items-center gap-3 text-green-400">
                                <span>{post.engagement.views} просмотров</span>
                                <span>{post.engagement.likes} лайков</span>
                                <span>{post.engagement.comments} комментариев</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors" title="Просмотр">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors" title="Редактировать">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-400 transition-colors" title="Копировать">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Удалить">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Создать публикацию</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Platforms Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Выберите платформы для публикации
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map(platform => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    return (
                      <label 
                        key={platform.id} 
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-yellow-400/50 bg-yellow-400/10' 
                            : 'border-gray-600 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          className="rounded bg-gray-700 border-gray-600 text-yellow-400 focus:ring-yellow-400"
                          checked={isSelected}
                          onChange={() => handlePlatformToggle(platform.id)}
                        />
                        <div className={`p-2 rounded bg-gradient-to-r ${platform.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-white">{platform.name}</span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-yellow-400 ml-auto" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Post Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Заголовок
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-400"
                  placeholder="Введите заголовок публикации..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Содержание
                </label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-400 resize-none"
                  placeholder="Напишите текст публикации..."
                />
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Медиа
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-white/5 hover:bg-white/10 transition-all">
                  <div className="flex justify-center gap-4 mb-3">
                    <Image className="w-8 h-8 text-gray-400" />
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-300">Перетащите файлы сюда или нажмите для выбора</p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG, MP4 до 50MB</p>
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Дата публикации
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Время публикации
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Теги
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="flex-1 px-3 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-400"
                    placeholder="работа, вакансии, карьера..."
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['работа', 'вакансии', 'карьера', 'найм'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-3 text-gray-300 bg-white/5 border border-gray-600 rounded-lg hover:bg-white/10 transition-all"
              >
                Отмена
              </button>
              <button className="px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2">
                <Save className="w-4 h-4" />
                Сохранить как черновик
              </button>
              <button className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center gap-2 font-medium">
                <Calendar className="w-4 h-4" />
                Запланировать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostScheduler;