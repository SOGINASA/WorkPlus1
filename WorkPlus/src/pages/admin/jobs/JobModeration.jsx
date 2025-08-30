import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  MessageCircle,
  Flag,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  User,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';

const JobModeration = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [moderationComment, setModerationComment] = useState('');

  // Мокк данные вакансий на модерации
  const pendingJobs = [
    {
      id: 1,
      title: 'Продавец в магазин электроники',
      company: 'ТОО "ТехноМир"',
      employer: {
        name: 'Алексей Петров',
        phone: '+7 701 123 4567',
        email: 'a.petrov@tehnomir.kz',
        rating: 4.2,
        totalJobs: 12
      },
      location: 'Алматы, мкр. Самал-2',
      salary: '150,000 - 200,000 ₸',
      type: 'Полная занятость',
      description: 'Требуется продавец-консультант в магазин электроники. Опыт работы приветствуется, но не обязателен. Обучение на рабочем месте.',
      requirements: [
        'Коммуникабельность',
        'Желание работать с людьми',
        'Базовые знания электроники (приветствуется)',
        'Ответственность'
      ],
      conditions: [
        'Официальное трудоустройство',
        'График работы: 6/1',
        'Обеденный перерыв 1 час',
        'Бесплатное обучение'
      ],
      created: '2024-08-30T10:30:00',
      priority: 'normal',
      flags: [],
      category: 'Продажи'
    },
    {
      id: 2,
      title: 'Курьер на личном транспорте СРОЧНО!!!',
      company: 'Delivery Fast',
      employer: {
        name: 'Мария Иванова',
        phone: '+7 705 987 6543',
        email: 'maria@deliveryfast.kz',
        rating: 3.8,
        totalJobs: 5
      },
      location: 'Нур-Султан',
      salary: '120,000 - 180,000 ₸ + премии',
      type: 'Полная занятость',
      description: 'СРОЧНО ТРЕБУЕТСЯ КУРЬЕР!!! Работа на своем авто или мотоцикле. Высокие заработки! Гибкий график! Звонить прямо сейчас!',
      requirements: [
        'Личный транспорт (авто/мото)',
        'Права категории В или А',
        'Знание города',
        'Опыт работы курьером от 1 года'
      ],
      conditions: [
        'Сдельная оплата',
        'Ежедневные выплаты',
        'Бонусы за количество заказов',
        'Топливо за счет компании'
      ],
      created: '2024-08-30T08:15:00',
      priority: 'high',
      flags: [
        { type: 'caps', message: 'Использование CAPS LOCK' },
        { type: 'spam', message: 'Множественные восклицательные знаки' }
      ],
      category: 'Логистика'
    },
    {
      id: 3,
      title: 'SMM-специалист (удаленно)',
      company: 'Digital Marketing Pro',
      employer: {
        name: 'Асем Нуржанова',
        phone: '+7 708 555 1234',
        email: 'asem@digitalmarket.pro',
        rating: 4.7,
        totalJobs: 8
      },
      location: 'Удаленная работа',
      salary: '250,000 - 350,000 ₸',
      type: 'Полная занятость',
      description: 'Ищем креативного SMM-специалиста для ведения социальных сетей клиентов агентства. Работа полностью удаленная с гибким графиком.',
      requirements: [
        'Опыт работы в SMM от 2 лет',
        'Знание инструментов аналитики',
        'Портфолио работ',
        'Креативность и ответственность'
      ],
      conditions: [
        'Полностью удаленная работа',
        'Гибкий график',
        'Современные инструменты',
        'Возможность профессионального роста'
      ],
      created: '2024-08-29T16:45:00',
      priority: 'normal',
      flags: [],
      category: 'Маркетинг'
    }
  ];

  const getPriorityBadge = (priority) => {
    const config = {
      high: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Высокий' },
      normal: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Обычный' },
      low: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Низкий' }
    };
    
    const { bg, text, label } = config[priority];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} border border-current/20`}>
        {label}
      </span>
    );
  };

  const handleApprove = (jobId) => {
    alert(`Вакансия ${jobId} одобрена`);
  };

  const handleReject = (jobId) => {
    if (!moderationComment.trim()) {
      alert('Укажите причину отклонения');
      return;
    }
    alert(`Вакансия ${jobId} отклонена. Причина: ${moderationComment}`);
    setModerationComment('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Модерация вакансий</h1>
          <p className="text-gray-300">Проверка и одобрение вакансий перед публикацией</p>
        </div>
      </div>

      {/* Статистика очереди */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-300">В очереди</p>
              <p className="text-2xl font-bold text-white">{pendingJobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center">
              <Flag className="w-6 h-6 text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-300">С флагами</p>
              <p className="text-2xl font-bold text-white">
                {pendingJobs.filter(job => job.flags.length > 0).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-300">Одобрено сегодня</p>
              <p className="text-2xl font-bold text-white">15</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-300">Отклонено сегодня</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список вакансий */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg">
            <div className="p-4 border-b border-gray-700/50">
              <h2 className="text-lg font-semibold text-white">Очередь модерации</h2>
            </div>
            <div className="divide-y divide-gray-700/50">
              {pendingJobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${selectedJob?.id === job.id ? 'bg-yellow-400/10 border-r-2 border-yellow-400' : ''}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm">{job.title}</h3>
                      <p className="text-sm text-gray-300 mb-2">{job.company}</p>
                    </div>
                    {getPriorityBadge(job.priority)}
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {formatDate(job.created)}
                    </span>
                    {job.flags.length > 0 && (
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-400 ml-1">{job.flags.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Детали выбранной вакансии */}
        <div className="lg:col-span-2">
          {selectedJob ? (
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg">
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedJob.title}</h2>
                    <p className="text-gray-300 mt-1">{selectedJob.company}</p>
                  </div>
                  {selectedJob.flags.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                        <span className="text-sm font-medium text-red-300">Найдены проблемы</span>
                      </div>
                      {selectedJob.flags.map((flag, index) => (
                        <p key={index} className="text-sm text-red-300">• {flag.message}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* Основная информация */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3">Основная информация</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">{selectedJob.location}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">{selectedJob.salary}</span>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">{selectedJob.type}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">{formatDate(selectedJob.created)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-3">Информация о работодателе</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">{selectedJob.employer.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">{selectedJob.employer.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">{selectedJob.employer.email}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-300">
                        <span>Рейтинг: {selectedJob.employer.rating}/5</span>
                        <span>Вакансий: {selectedJob.employer.totalJobs}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Описание вакансии */}
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3">Описание</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Требования */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3">Требования</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-3">Условия работы</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {selectedJob.conditions.map((condition, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Комментарий модератора */}
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3">Комментарий модератора</h3>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    rows={3}
                    placeholder="Укажите причину отклонения или дополнительные комментарии..."
                    value={moderationComment}
                    onChange={(e) => setModerationComment(e.target.value)}
                  />
                </div>

                {/* Действия */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                      <Eye className="w-4 h-4 mr-1" />
                      Предпросмотр
                    </button>
                    <button className="flex items-center text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Профиль работодателя
                    </button>
                    <button className="flex items-center text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Связаться
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleReject(selectedJob.id)}
                      className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Отклонить
                    </button>
                    <button
                      onClick={() => handleApprove(selectedJob.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Одобрить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Выберите вакансию для проверки</h3>
              <p className="text-gray-300">Выберите вакансию из списка слева для детального просмотра и модерации</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobModeration;