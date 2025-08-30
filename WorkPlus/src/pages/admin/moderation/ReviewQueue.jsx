// src/pages/admin/moderation/ReviewQueue.jsx
import React, { useState } from 'react';
import { 
  Clock, CheckCircle, XCircle, AlertTriangle, Eye, User, Building, 
  Calendar, Filter, Search, ChevronDown, MessageSquare, Flag
} from 'lucide-react';

const ReviewQueue = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Данные очереди модерации
  const queueItems = [
    {
      id: 1,
      type: 'job',
      title: 'Продавец-консультант в магазин электроники',
      author: 'ТОО "ТехноМир"',
      authorType: 'employer',
      submittedAt: '2024-01-15 14:30',
      priority: 'medium',
      status: 'pending',
      flags: ['Зарплата не указана', 'Нет описания обязанностей'],
      content: {
        salary: 'По договоренности',
        description: 'Ищем продавца',
        requirements: 'Опыт работы'
      }
    },
    {
      id: 2,
      type: 'profile',
      title: 'Профиль соискателя: Алексей Иванов',
      author: 'Алексей Иванов',
      authorType: 'candidate',
      submittedAt: '2024-01-15 13:15',
      priority: 'low',
      status: 'pending',
      flags: ['Неполные контактные данные'],
      content: {
        position: 'Менеджер по продажам',
        experience: '3 года',
        location: 'Петропавловск'
      }
    },
    {
      id: 3,
      type: 'report',
      title: 'Жалоба на вакансию: "Менеджер по продажам"',
      author: 'Анна Смирнова',
      authorType: 'candidate',
      submittedAt: '2024-01-15 12:45',
      priority: 'high',
      status: 'pending',
      flags: ['Подозрение на мошенничество', 'Завышенные требования'],
      content: {
        reason: 'Подозрительные условия работы',
        description: 'Требуют предоплату за обучение'
      }
    }
  ];

  // Опции фильтрации
  const filterOptions = [
    { value: 'all', label: 'Все', count: 23 },
    { value: 'jobs', label: 'Вакансии', count: 12 },
    { value: 'profiles', label: 'Профили', count: 7 },
    { value: 'reports', label: 'Жалобы', count: 4 },
  ];

  // Цвета приоритетов
  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  // Иконки типов контента
  const typeIcons = {
    job: <Building className="w-4 h-4" />,
    profile: <User className="w-4 h-4" />,
    report: <Flag className="w-4 h-4" />
  };

  // Обработчики действий
  const handleApprove = (id) => {
    console.log('Одобрить элемент:', id);
    // Здесь будет API вызов для одобрения
  };

  const handleReject = (id) => {
    console.log('Отклонить элемент:', id);
    // Здесь будет API вызов для отклонения
  };

  const handleViewDetails = (id) => {
    console.log('Просмотреть детали:', id);
    // Здесь будет открытие модального окна или переход на страницу деталей
  };

  // Фильтрация данных
  const filteredItems = queueItems.filter(item => {
    const matchesFilter = filter === 'all' || 
      (filter === 'jobs' && item.type === 'job') ||
      (filter === 'profiles' && item.type === 'profile') ||
      (filter === 'reports' && item.type === 'report');
    
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Очередь модерации</h1>
        <p className="text-gray-400">Проверка контента и управление жалобами</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-400 text-2xl font-bold">23</p>
              <p className="text-gray-400 text-sm">На модерации</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-green-400 text-2xl font-bold">147</p>
              <p className="text-gray-400 text-sm">Одобрено сегодня</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-red-400 text-2xl font-bold">12</p>
              <p className="text-gray-400 text-sm">Отклонено</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 text-2xl font-bold">5</p>
              <p className="text-gray-400 text-sm">Требуют внимания</p>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filter === option.value
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или автору..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full lg:w-80"
            />
          </div>
        </div>
      </div>

      {/* Элементы очереди */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                {/* Заголовок и метки */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {typeIcons[item.type]}
                    <span className="text-sm text-gray-400 capitalize">
                      {item.type === 'job' ? 'Вакансия' : 
                       item.type === 'profile' ? 'Профиль' : 'Жалоба'}
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs border ${priorityColors[item.priority]}`}>
                    {item.priority === 'high' ? 'Высокий' : 
                     item.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                
                {/* Информация об авторе и дате */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span>Автор: {item.author}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.submittedAt}
                  </div>
                </div>

                {/* Флаги проблем */}
                {item.flags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.flags.map((flag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs border border-red-500/30"
                      >
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        {flag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Превью контента */}
                <div className="bg-white/5 rounded-lg p-3 text-sm">
                  {item.type === 'job' && (
                    <div className="space-y-1">
                      <p><span className="text-gray-400">Зарплата:</span> {item.content.salary}</p>
                      <p><span className="text-gray-400">Описание:</span> {item.content.description}</p>
                      <p><span className="text-gray-400">Требования:</span> {item.content.requirements}</p>
                    </div>
                  )}
                  {item.type === 'profile' && (
                    <div className="space-y-1">
                      <p><span className="text-gray-400">Должность:</span> {item.content.position}</p>
                      <p><span className="text-gray-400">Опыт:</span> {item.content.experience}</p>
                      <p><span className="text-gray-400">Локация:</span> {item.content.location}</p>
                    </div>
                  )}
                  {item.type === 'report' && (
                    <div className="space-y-1">
                      <p><span className="text-gray-400">Причина:</span> {item.content.reason}</p>
                      <p><span className="text-gray-400">Описание:</span> {item.content.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Действия */}
              <div className="flex flex-col gap-2 lg:w-48">
                <button
                  onClick={() => handleApprove(item.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Одобрить
                </button>
                <button
                  onClick={() => handleReject(item.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Отклонить
                </button>
                <button 
                  onClick={() => handleViewDetails(item.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Подробнее
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Комментарий
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          Показано 1-{Math.min(10, filteredItems.length)} из {filteredItems.length} элементов
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded hover:bg-white/20 transition-colors">
            Назад
          </button>
          <button className="px-3 py-1 bg-yellow-400 text-black rounded">1</button>
          <button className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded hover:bg-white/20 transition-colors">
            2
          </button>
          <button className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded hover:bg-white/20 transition-colors">
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewQueue;