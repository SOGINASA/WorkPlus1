// src/pages/admin/moderation/ContentModeration.jsx
import React, { useState } from 'react';
import { 
  Image, FileText, MessageSquare, Eye, Trash2, CheckCircle, XCircle,
  Filter, Search, Calendar, User, AlertTriangle, Download, MoreVertical,
  Play, Pause, Volume2, VolumeX, ZoomIn, RotateCcw
} from 'lucide-react';

const ContentModeration = () => {
  const [contentType, setContentType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);

  // Данные контента для модерации
  const contentItems = [
    {
      id: 1,
      type: 'image',
      title: 'Аватар пользователя',
      author: 'Алексей Иванов',
      authorId: 'user_123',
      content: {
        url: '/api/images/avatar_123.jpg',
        filename: 'avatar.jpg',
        size: '245 KB',
        dimensions: '512x512',
        format: 'JPEG'
      },
      uploadedAt: '2024-01-15 14:30',
      status: 'pending',
      flags: ['Неподходящее изображение', 'Возможное нарушение'],
      reports: 2,
      aiScore: 0.75,
      tags: ['профиль', 'аватар', 'пользователь']
    },
    {
      id: 2,
      type: 'text',
      title: 'Описание вакансии: Менеджер по продажам',
      author: 'ТОО "БизнесГрупп"',
      authorId: 'emp_456',
      content: {
        text: 'Требуется менеджер по продажам. Высокая зарплата гарантирована! Звоните прямо сейчас! Деньги сразу! Никаких вложений!',
        wordCount: 16,
        language: 'ru',
        sentiment: 'suspicious'
      },
      uploadedAt: '2024-01-15 13:15',
      status: 'pending',
      flags: ['Подозрительный текст', 'Возможный спам', 'Слишком много восклицательных знаков'],
      reports: 1,
      aiScore: 0.92,
      tags: ['вакансия', 'текст', 'подозрительно']
    },
    {
      id: 3,
      type: 'video',
      title: 'Видео-презентация компании',
      author: 'ИП "Рекламное агентство"',
      authorId: 'emp_789',
      content: {
        url: '/api/videos/company_promo.mp4',
        filename: 'company_promo.mp4',
        size: '15.2 MB',
        duration: '2:34',
        format: 'MP4',
        resolution: '1920x1080'
      },
      uploadedAt: '2024-01-15 12:45',
      status: 'pending',
      flags: ['Требует проверки аудио'],
      reports: 0,
      aiScore: 0.45,
      tags: ['видео', 'презентация', 'компания']
    },
    {
      id: 4,
      type: 'comment',
      title: 'Комментарий к вакансии',
      author: 'Мария Петрова',
      authorId: 'user_321',
      content: {
        text: 'Отличная компания, работаю уже 2 года. Рекомендую всем!',
        wordCount: 8,
        parentType: 'vacancy',
        parentId: 'vac_123',
        parentTitle: 'Разработчик Python'
      },
      uploadedAt: '2024-01-15 12:00',
      status: 'approved',
      flags: [],
      reports: 0,
      aiScore: 0.15,
      tags: ['комментарий', 'отзыв', 'положительный']
    },
    {
      id: 5,
      type: 'document',
      title: 'Портфолио дизайнера',
      author: 'Анна Сидорова',
      authorId: 'user_654',
      content: {
        filename: 'portfolio.pdf',
        size: '2.1 MB',
        pages: 15,
        format: 'PDF',
        hasImages: true,
        hasText: true
      },
      uploadedAt: '2024-01-15 11:45',
      status: 'pending',
      flags: ['Требует проверки содержимого'],
      reports: 0,
      aiScore: 0.25,
      tags: ['документ', 'портфолио', 'дизайн']
    }
  ];

  // Опции типов контента
  const contentTypeOptions = [
    { value: 'all', label: 'Весь контент', count: 45, icon: <FileText className="w-4 h-4" /> },
    { value: 'image', label: 'Изображения', count: 18, icon: <Image className="w-4 h-4" /> },
    { value: 'text', label: 'Тексты', count: 22, icon: <FileText className="w-4 h-4" /> },
    { value: 'video', label: 'Видео', count: 3, icon: <Play className="w-4 h-4" /> },
    { value: 'comment', label: 'Комментарии', count: 5, icon: <MessageSquare className="w-4 h-4" /> },
    { value: 'document', label: 'Документы', count: 7, icon: <FileText className="w-4 h-4" /> }
  ];

  // Опции статусов
  const statusOptions = [
    { value: 'all', label: 'Все' },
    { value: 'pending', label: 'На модерации' },
    { value: 'approved', label: 'Одобрено' },
    { value: 'rejected', label: 'Отклонено' },
    { value: 'flagged', label: 'Помечено' }
  ];

  // Цвета статусов
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    flagged: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  };

  // Иконки типов контента
  const typeIcons = {
    image: <Image className="w-4 h-4 text-blue-400" />,
    text: <FileText className="w-4 h-4 text-green-400" />,
    video: <Play className="w-4 h-4 text-purple-400" />,
    comment: <MessageSquare className="w-4 h-4 text-orange-400" />,
    document: <FileText className="w-4 h-4 text-cyan-400" />
  };

  // Обработчики действий
  const handleApprove = (id) => {
    console.log('Одобрить контент:', id);
    // API вызов для одобрения
  };

  const handleReject = (id) => {
    console.log('Отклонить контент:', id);
    // API вызов для отклонения
  };

  const handleFlag = (id) => {
    console.log('Пометить контент:', id);
    // API вызов для пометки
  };

  const handleDelete = (id) => {
    console.log('Удалить контент:', id);
    // API вызов для удаления
  };

  const handleViewFull = (id) => {
    console.log('Полный просмотр:', id);
    setSelectedContent(selectedContent === id ? null : id);
  };

  const handleDownload = (id) => {
    console.log('Скачать файл:', id);
    // Логика скачивания
  };

  // Фильтрация данных
  const filteredItems = contentItems.filter(item => {
    const matchesType = contentType === 'all' || item.type === contentType;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // Получение цвета AI скора
  const getAiScoreColor = (score) => {
    if (score >= 0.8) return 'text-red-400';
    if (score >= 0.5) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Модерация контента</h1>
        <p className="text-gray-400">Проверка изображений, текстов и других материалов пользователей</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-400 text-2xl font-bold">32</p>
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
              <p className="text-green-400 text-2xl font-bold">184</p>
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
              <p className="text-red-400 text-2xl font-bold">23</p>
              <p className="text-gray-400 text-sm">Отклонено</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-400 text-2xl font-bold">91%</p>
              <p className="text-gray-400 text-sm">Точность AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Фильтры по типу контента */}
          <div className="flex flex-wrap gap-2">
            {contentTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setContentType(option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  contentType === option.value
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {option.icon}
                {option.label} ({option.count})
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 flex-1">
            {/* Фильтр по статусу */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {/* Поиск */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по автору, тегам..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Элементы контента */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Превью контента */}
              <div className="lg:w-64 flex-shrink-0">
                {item.type === 'image' && (
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="bg-gray-700 rounded-lg h-32 flex items-center justify-center mb-2">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm">{item.content.filename}</p>
                    <p className="text-gray-500 text-xs">{item.content.size}</p>
                    <p className="text-gray-500 text-xs">{item.content.dimensions}</p>
                  </div>
                )}
                
                {item.type === 'text' && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-300 text-sm line-clamp-4 mb-2">
                      {item.content.text}
                    </p>
                    <p className="text-gray-500 text-xs">{item.content.wordCount} слов</p>
                    <p className="text-gray-500 text-xs">Язык: {item.content.language}</p>
                  </div>
                )}

                {item.type === 'video' && (
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="bg-gray-700 rounded-lg h-32 flex items-center justify-center mb-2">
                      <Play className="w-12 h-12 text-purple-400" />
                    </div>
                    <p className="text-gray-400 text-sm">{item.content.filename}</p>
                    <p className="text-gray-500 text-xs">{item.content.size}</p>
                    <p className="text-gray-500 text-xs">Длительность: {item.content.duration}</p>
                  </div>
                )}
                
                {item.type === 'comment' && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <MessageSquare className="w-6 h-6 text-orange-400 mb-2" />
                    <p className="text-gray-300 text-sm mb-2">{item.content.text}</p>
                    <p className="text-gray-500 text-xs">К: {item.content.parentTitle}</p>
                  </div>
                )}
                
                {item.type === 'document' && (
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <FileText className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">{item.content.filename}</p>
                    <p className="text-gray-500 text-xs">{item.content.size}</p>
                    <p className="text-gray-500 text-xs">{item.content.pages} страниц</p>
                  </div>
                )}
              </div>

              {/* Информация о контенте */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {typeIcons[item.type]}
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs border ${statusColors[item.status]}`}>
                    {item.status === 'pending' ? 'На модерации' :
                     item.status === 'approved' ? 'Одобрено' : 
                     item.status === 'rejected' ? 'Отклонено' : 'Помечено'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Автор:</p>
                    <p className="text-white">{item.author}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Загружено:</p>
                    <p className="text-white">{item.uploadedAt}</p>
                  </div>
                  {item.reports > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Жалобы:</p>
                      <p className="text-red-400">{item.reports} шт.</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">AI оценка:</p>
                    <p className={`${getAiScoreColor(item.aiScore)} font-medium`}>
                      {Math.round(item.aiScore * 100)}%
                    </p>
                  </div>
                </div>

                {/* Теги */}
                {item.tags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Теги:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Флаги проблем */}
                {item.flags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Флаги модерации:</p>
                    <div className="flex flex-wrap gap-2">
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
                  </div>
                )}
              </div>

              {/* Действия */}
              <div className="flex flex-col gap-2 lg:w-48">
                {item.status === 'pending' && (
                  <>
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
                      onClick={() => handleFlag(item.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Пометить
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => handleViewFull(item.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {selectedContent === item.id ? 'Скрыть' : 'Просмотр'}
                </button>
                
                {(item.type === 'document' || item.type === 'image' || item.type === 'video') && (
                  <button 
                    onClick={() => handleDownload(item.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Скачать
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </button>
                
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Развернутый просмотр */}
            {selectedContent === item.id && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Детальный просмотр</h4>
                  
                  {item.type === 'text' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Полный текст:</p>
                        <div className="bg-gray-900 rounded p-3 text-gray-300">
                          {item.content.text}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Слов:</p>
                          <p className="text-white">{item.content.wordCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Язык:</p>
                          <p className="text-white">{item.content.language}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Настроение:</p>
                          <p className={`${item.content.sentiment === 'suspicious' ? 'text-red-400' : 'text-green-400'}`}>
                            {item.content.sentiment === 'suspicious' ? 'Подозрительное' : 'Нормальное'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'image' && (
                    <div className="space-y-3">
                      <div className="bg-gray-900 rounded-lg h-64 flex items-center justify-center">
                        <Image className="w-16 h-16 text-gray-500" />
                        <p className="text-gray-500 ml-2">Превью изображения</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Размер:</p>
                          <p className="text-white">{item.content.size}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Разрешение:</p>
                          <p className="text-white">{item.content.dimensions}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Формат:</p>
                          <p className="text-white">{item.content.format}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">AI анализ:</p>
                          <p className={`${getAiScoreColor(item.aiScore)}`}>
                            {item.aiScore >= 0.8 ? 'Высокий риск' : 
                             item.aiScore >= 0.5 ? 'Средний риск' : 'Низкий риск'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'video' && (
                    <div className="space-y-3">
                      <div className="bg-gray-900 rounded-lg h-48 flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                          <p className="text-gray-500">Превью видео</p>
                          <p className="text-gray-600 text-sm">{item.content.duration}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Размер файла:</p>
                          <p className="text-white">{item.content.size}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Разрешение:</p>
                          <p className="text-white">{item.content.resolution}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Формат:</p>
                          <p className="text-white">{item.content.format}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Длительность:</p>
                          <p className="text-white">{item.content.duration}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'document' && (
                    <div className="space-y-3">
                      <div className="bg-gray-900 rounded-lg p-6 text-center">
                        <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-2" />
                        <p className="text-white">{item.content.filename}</p>
                        <p className="text-gray-400 text-sm">Документ PDF</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Размер:</p>
                          <p className="text-white">{item.content.size}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Страниц:</p>
                          <p className="text-white">{item.content.pages}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Содержит изображения:</p>
                          <p className="text-white">{item.content.hasImages ? 'Да' : 'Нет'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Содержит текст:</p>
                          <p className="text-white">{item.content.hasText ? 'Да' : 'Нет'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'comment' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Комментарий:</p>
                        <div className="bg-gray-900 rounded p-3 text-gray-300">
                          {item.content.text}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Относится к:</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-blue-400">{item.content.parentType === 'vacancy' ? 'Вакансия' : 'Резюме'}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-white">{item.content.parentTitle}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* История модерации */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-2">История действий:</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{item.uploadedAt} - Контент загружен</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{item.uploadedAt} - Добавлен в очередь модерации</span>
                      </div>
                      {item.reports > 0 && (
                        <div className="flex items-center gap-2 text-red-400">
                          <MessageSquare className="w-3 h-3" />
                          <span>Получено жалоб: {item.reports}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Пустое состояние */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Контент не найден</h3>
          <p className="text-gray-400">Попробуйте изменить фильтры или поисковый запрос</p>
        </div>
      )}

      {/* Пагинация */}
      {filteredItems.length > 0 && (
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
              3
            </button>
            <button className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded hover:bg-white/20 transition-colors">
              Далее
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;