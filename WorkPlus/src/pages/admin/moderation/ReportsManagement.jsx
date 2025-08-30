// src/pages/admin/moderation/ReportsManagement.jsx
import React, { useState } from 'react';
import { 
  AlertTriangle, Eye, MessageSquare, User, Building, Calendar,
  Filter, Search, MoreVertical, Shield, Ban, CheckCircle, Clock,
  FileText, ExternalLink, Phone, Mail
} from 'lucide-react';

const ReportsManagement = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  // Данные жалоб
  const reports = [
    {
      id: 1,
      type: 'vacancy',
      title: 'Жалоба на вакансию "Менеджер по продажам"',
      reporter: {
        name: 'Анна Смирнова',
        id: 'user_123',
        email: 'anna.smirnova@example.com',
        phone: '+7 701 234 5678'
      },
      target: {
        name: 'ТОО "БизнесГрупп"',
        id: 'emp_456',
        vacancyTitle: 'Менеджер по продажам',
        vacancyId: 'vac_789'
      },
      reason: 'Мошенничество',
      description: 'Требуют предоплату за обучение материалам. Подозрительные условия работы. Обещают высокую зарплату, но просят внести залог.',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-15 12:30',
      evidence: ['screenshot1.jpg', 'conversation.txt'],
      assignedTo: null,
      tags: ['мошенничество', 'предоплата', 'подозрительно']
    },
    {
      id: 2,
      type: 'profile',
      title: 'Жалоба на профиль пользователя',
      reporter: {
        name: 'Игорь Петров',
        id: 'user_789',
        email: 'igor.petrov@example.com',
        phone: '+7 702 345 6789'
      },
      target: {
        name: 'Мария Иванова',
        id: 'user_321'
      },
      reason: 'Неуместное поведение',
      description: 'Отправляет неуместные сообщения в чате. Использует нецензурную лексику при общении с работодателями.',
      status: 'in_review',
      priority: 'medium',
      createdAt: '2024-01-15 10:15',
      evidence: ['chat_log.txt'],
      assignedTo: 'Модератор #1',
      tags: ['поведение', 'чат', 'нарушение правил']
    },
    {
      id: 3,
      type: 'employer',
      title: 'Жалоба на работодателя',
      reporter: {
        name: 'Сергей Козлов',
        id: 'user_555',
        email: 'sergey.kozlov@example.com',
        phone: '+7 703 456 7890'
      },
      target: {
        name: 'ИП "Торговый дом"',
        id: 'emp_777'
      },
      reason: 'Невыплата зарплаты',
      description: 'Работодатель не выплачивает обещанную зарплату уже 2 месяца. Игнорирует сообщения и звонки.',
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-01-14 16:20',
      evidence: ['contract.pdf', 'bank_statement.pdf'],
      resolution: 'Работодатель заблокирован до выяснения обстоятельств',
      assignedTo: 'Модератор #2',
      tags: ['зарплата', 'невыплата', 'договор']
    }
  ];

  // Опции фильтрации по статусу
  const statusOptions = [
    { value: 'all', label: 'Все', count: 15 },
    { value: 'pending', label: 'На рассмотрении', count: 8 },
    { value: 'in_review', label: 'В работе', count: 4 },
    { value: 'resolved', label: 'Решено', count: 3 }
  ];

  // Опции фильтрации по приоритету
  const priorityOptions = [
    { value: 'all', label: 'Любой приоритет' },
    { value: 'high', label: 'Высокий' },
    { value: 'medium', label: 'Средний' },
    { value: 'low', label: 'Низкий' }
  ];

  // Цвета статусов
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    in_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  // Цвета приоритетов
  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400'
  };

  // Иконки типов жалоб
  const typeIcons = {
    vacancy: <Building className="w-4 h-4" />,
    profile: <User className="w-4 h-4" />,
    employer: <Building className="w-4 h-4" />
  };

  // Обработчики действий
  const handleTakeInWork = (id) => {
    console.log('Взять в работу:', id);
    // API вызов для назначения жалобы на модератора
  };

  const handleBlock = (id) => {
    console.log('Заблокировать пользователя/работодателя:', id);
    // API вызов для блокировки
  };

  const handleResolve = (id) => {
    console.log('Решить жалобу:', id);
    // API вызов для решения жалобы
  };

  const handleContact = (id) => {
    console.log('Связаться с пользователем:', id);
    // Открыть модальное окно для связи
  };

  // Фильтрация данных
  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    const matchesSearch = searchQuery === '' ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.target.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Управление жалобами</h1>
        <p className="text-gray-400">Рассмотрение жалоб пользователей и принятие мер</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-red-400 text-2xl font-bold">8</p>
              <p className="text-gray-400 text-sm">Новые жалобы</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 text-2xl font-bold">4</p>
              <p className="text-gray-400 text-sm">В работе</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-green-400 text-2xl font-bold">12</p>
              <p className="text-gray-400 text-sm">Решено за неделю</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-400 text-2xl font-bold">2.5</p>
              <p className="text-gray-400 text-sm">Ср. время решения (дня)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Фильтры по статусу */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  statusFilter === option.value
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 flex-1">
            {/* Фильтр по приоритету */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {priorityOptions.map(option => (
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
                placeholder="Поиск жалоб..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Список жалоб */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {typeIcons[report.type]}
                    <span className="text-sm text-gray-400">
                      {report.type === 'vacancy' ? 'Вакансия' : 
                       report.type === 'profile' ? 'Профиль' : 'Работодатель'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs border ${statusColors[report.status]}`}>
                    {report.status === 'pending' ? 'На рассмотрении' :
                     report.status === 'in_review' ? 'В работе' : 'Решено'}
                  </div>
                  <span className={`text-xs ${priorityColors[report.priority]}`}>
                    ● {report.priority === 'high' ? 'Высокий' : 
                        report.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                  </span>
                </div>

                {/* Основная информация */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Жалобщик:</p>
                    <p className="text-white">{report.reporter.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <Mail className="w-3 h-3" />
                      {report.reporter.email}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">На кого жалоба:</p>
                    <p className="text-white">{report.target.name}</p>
                    {report.target.vacancyTitle && (
                      <p className="text-xs text-gray-400 mt-1">
                        Вакансия: {report.target.vacancyTitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Причина:</p>
                    <p className="text-red-400">{report.reason}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Дата подачи:</p>
                    <p className="text-white">{report.createdAt}</p>
                  </div>
                </div>

                {/* Назначенный модератор */}
                {report.assignedTo && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-1">Назначен на:</p>
                    <p className="text-blue-400">{report.assignedTo}</p>
                  </div>
                )}

                {/* Описание */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">Описание:</p>
                  <p className="text-gray-300">{report.description}</p>
                </div>

                {/* Теги */}
                {report.tags && report.tags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Теги:</p>
                    <div className="flex flex-wrap gap-2">
                      {report.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Доказательства */}
                {report.evidence && report.evidence.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Прикрепленные файлы:</p>
                    <div className="flex flex-wrap gap-2">
                      {report.evidence.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 px-2 py-1 bg-gray-800 rounded text-xs">
                          <FileText className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400">{file}</span>
                          <button className="text-gray-400 hover:text-white">
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Решение (если есть) */}
                {report.resolution && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium mb-1">Решение:</p>
                    <p className="text-green-300 text-sm">{report.resolution}</p>
                  </div>
                )}
              </div>

              <div className="ml-4">
                <button 
                  onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Действия */}
            {report.status !== 'resolved' && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                {report.status === 'pending' && (
                  <button 
                    onClick={() => handleTakeInWork(report.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Взять в работу
                  </button>
                )}
                
                <button 
                  onClick={() => handleBlock(report.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  Заблокировать
                </button>
                
                <button 
                  onClick={() => handleResolve(report.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Решить
                </button>
                
                <button 
                  onClick={() => handleContact(report.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Связаться
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <Phone className="w-4 h-4" />
                  Позвонить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Пагинация */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          Показано 1-{Math.min(10, filteredReports.length)} из {filteredReports.length} жалоб
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

export default ReportsManagement;