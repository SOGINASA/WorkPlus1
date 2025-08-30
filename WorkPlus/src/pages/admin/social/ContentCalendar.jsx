import React, { useState } from 'react';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Instagram,
  MessageCircle,
  Send,
  Music4,
  Image,
  Video,
  FileText,
  Hash,
  Users,
  Target,
  TrendingUp,
  Download,
  Upload
} from 'lucide-react';

const ContentCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 2)); // March 2024
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // month, week, day
  const [showFilters, setShowFilters] = useState(false);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'threads', name: 'Threads', icon: MessageCircle, color: 'bg-black' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-blue-500' },
    { id: 'tiktok', name: 'TikTok', icon: Music4, color: 'bg-black' }
  ];

  const contentTypes = [
    { id: 'image', name: 'Изображение', icon: Image, color: 'text-green-400' },
    { id: 'video', name: 'Видео', icon: Video, color: 'text-purple-400' },
    { id: 'text', name: 'Текст', icon: FileText, color: 'text-blue-400' },
    { id: 'carousel', name: 'Карусель', icon: Hash, color: 'text-orange-400' }
  ];

  const contentEvents = [
    {
      id: 1,
      date: '2024-03-15',
      time: '09:00',
      title: 'Топ-5 навыков для HR-менеджера',
      platforms: ['instagram', 'threads'],
      type: 'carousel',
      status: 'scheduled',
      author: 'Анна К.',
      category: 'Советы',
      tags: ['hr', 'навыки', 'карьера'],
      engagement: { expected: 850, actual: null }
    },
    {
      id: 2,
      date: '2024-03-15',
      time: '14:30',
      title: 'Срочно! Курьеры в Алматы',
      platforms: ['telegram'],
      type: 'text',
      status: 'published',
      author: 'Мария С.',
      category: 'Вакансии',
      tags: ['вакансии', 'курьеры', 'алматы'],
      engagement: { expected: 450, actual: 523 }
    },
    {
      id: 3,
      date: '2024-03-16',
      time: '11:00',
      title: 'Интервью с успешным рекрутером',
      platforms: ['instagram', 'tiktok'],
      type: 'video',
      status: 'draft',
      author: 'Дмитрий П.',
      category: 'Интервью',
      tags: ['интервью', 'рекрутинг', 'опыт'],
      engagement: { expected: 1200, actual: null }
    },
    {
      id: 4,
      date: '2024-03-17',
      time: '16:00',
      title: 'Как составить идеальное резюме?',
      platforms: ['threads', 'telegram'],
      type: 'image',
      status: 'idea',
      author: 'Елена В.',
      category: 'Гайды',
      tags: ['резюме', 'советы', 'карьера'],
      engagement: { expected: 700, actual: null }
    },
    {
      id: 5,
      date: '2024-03-18',
      time: '10:15',
      title: 'Массовый найм: продавцы-консультанты',
      platforms: ['instagram', 'telegram'],
      type: 'carousel',
      status: 'review',
      author: 'Олег Н.',
      category: 'Вакансии',
      tags: ['массовый найм', 'продавцы', 'розница'],
      engagement: { expected: 950, actual: null }
    }
  ];

  const contentCategories = [
    { name: 'Вакансии', color: 'bg-blue-500', count: 12 },
    { name: 'Советы', color: 'bg-green-500', count: 8 },
    { name: 'Гайды', color: 'bg-purple-500', count: 6 },
    { name: 'Интервью', color: 'bg-orange-500', count: 4 },
    { name: 'Новости', color: 'bg-red-500', count: 3 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-900/20 text-green-400 border-green-400/20';
      case 'scheduled': return 'bg-blue-900/20 text-blue-400 border-blue-400/20';
      case 'draft': return 'bg-gray-700 text-gray-300 border-gray-600';
      case 'review': return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/20';
      case 'idea': return 'bg-purple-900/20 text-purple-400 border-purple-400/20';
      default: return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'published': return CheckCircle;
      case 'scheduled': return Clock;
      case 'review': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'published': return 'Опубликовано';
      case 'scheduled': return 'Запланировано';
      case 'draft': return 'Черновик';
      case 'review': return 'На проверке';
      case 'idea': return 'Идея';
      default: return 'Неизвестно';
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 7 : firstDay; // Convert Sunday (0) to 7
  };

  const getEventsForDate = (dateString) => {
    return contentEvents.filter(event => event.date === dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const formatDateString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 1; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-32 p-2 border border-gray-600 bg-gray-800"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = getEventsForDate(dateString);
      const isToday = new Date().toDateString() === new Date(dateString).toDateString();

      days.push(
        <div
          key={day}
          className={`min-h-32 p-2 border border-gray-600 bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors ${
            isToday ? 'ring-2 ring-yellow-400 bg-yellow-400/5' : ''
          }`}
          onClick={() => setSelectedDate(dateString)}
        >
          <div className={`text-sm font-medium mb-2 ${isToday ? 'text-yellow-400' : 'text-white'}`}>
            {day}
          </div>
          
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map(event => {
              const StatusIcon = getStatusIcon(event.status);
              const TypeIcon = contentTypes.find(t => t.id === event.type)?.icon || FileText;
              
              return (
                <div
                  key={event.id}
                  className={`text-xs p-2 rounded border cursor-pointer hover:bg-opacity-80 transition-colors ${getStatusColor(event.status)}`}
                  title={`${event.time} - ${event.title}`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <StatusIcon className="w-3 h-3" />
                    <TypeIcon className="w-3 h-3" />
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="truncate">{event.title}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {event.platforms.slice(0, 2).map(platformId => {
                      const platform = platforms.find(p => p.id === platformId);
                      if (!platform) return null;
                      const Icon = platform.icon;
                      return (
                        <Icon key={platformId} className="w-2 h-2" />
                      );
                    })}
                    {event.platforms.length > 2 && (
                      <span className="text-xs">+{event.platforms.length - 2}</span>
                    )}
                  </div>
                </div>
              );
            })}
            
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-400 text-center py-1">
                +{dayEvents.length - 3} ещё
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const totalEngagement = contentEvents.reduce((sum, event) => {
    return sum + (event.engagement.actual || event.engagement.expected || 0);
  }, 0);

  const publishedCount = contentEvents.filter(e => e.status === 'published').length;
  const scheduledCount = contentEvents.filter(e => e.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Контент-календарь</h1>
            <p className="text-gray-300 mt-1">Планирование и управление контентом для социальных сетей</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </button>
            
            <button className="flex items-center px-4 py-2 text-black bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg hover:from-yellow-500 hover:to-yellow-700 font-medium transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Создать пост
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-lg text-black">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/70 text-sm">Опубликовано</p>
                  <p className="text-2xl font-bold">{publishedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-black/70" />
              </div>
            </div>
            
            <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Запланировано</p>
                  <p className="text-2xl font-bold">{scheduledCount}</p>
                </div>
                <Clock className="w-8 h-8 text-gray-300" />
              </div>
            </div>
            
            <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Вовлеченность</p>
                  <p className="text-2xl font-bold">{totalEngagement.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Платформы</h3>
            <div className="space-y-3">
              {platforms.map(platform => {
                const Icon = platform.icon;
                const platformPosts = contentEvents.filter(event => 
                  event.platforms.includes(platform.id)
                ).length;
                
                return (
                  <div key={platform.id} className="flex items-center justify-between p-3 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${platform.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-white">{platform.name}</span>
                    </div>
                    <span className="text-sm text-gray-300">{platformPosts} постов</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Категории</h3>
            <div className="space-y-2">
              {contentCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-sm text-white">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-300">{category.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Types */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Типы контента</h3>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.map(type => {
                const Icon = type.icon;
                return (
                  <div key={type.id} className="p-3 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors">
                    <Icon className={`w-5 h-5 mb-2 ${type.color}`} />
                    <p className="text-xs font-medium text-white">{type.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-900">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-white">
                {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors">
                День
              </button>
              <button className="px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors">
                Неделя
              </button>
              <button className="px-3 py-1 text-sm bg-yellow-400 text-black rounded font-medium">
                Месяц
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b border-gray-600">
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                <div key={day} className="p-4 text-center font-medium text-white bg-gray-700 border-r border-gray-600 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </div>

          {/* Selected Day Events */}
          {selectedDate && (
            <div className="mt-6 bg-gray-800 rounded-lg border border-gray-600 p-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                События на {new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>

              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-400">Нет событий</p>
              ) : (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map(event => {
                    const StatusIcon = getStatusIcon(event.status);
                    const TypeIcon = contentTypes.find(t => t.id === event.type)?.icon || FileText;
                    return (
                      <div key={event.id} className="p-3 bg-gray-700 border border-gray-600 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4 text-yellow-400" />
                            <TypeIcon className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">{event.time}</span>
                          </div>
                          <div className="flex gap-2 text-gray-400">
                            <Eye className="w-4 h-4 cursor-pointer hover:text-white" />
                            <Edit3 className="w-4 h-4 cursor-pointer hover:text-white" />
                            <Copy className="w-4 h-4 cursor-pointer hover:text-white" />
                            <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-500" />
                          </div>
                        </div>
                        <h4 className="text-white font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-400">Автор: {event.author}</p>
                        <p className="text-sm text-gray-400">Категория: {event.category}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {event.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-600 px-2 py-1 rounded text-gray-300">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;
