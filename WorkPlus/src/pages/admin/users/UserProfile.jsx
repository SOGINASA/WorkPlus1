import React, { useState } from 'react';
import { ArrowLeft, User, Building2, Mail, Phone, MapPin, Calendar, Star, Briefcase, Eye, Edit, Ban, CheckCircle, XCircle, Clock, TrendingUp, Users, Award, AlertTriangle, MessageSquare } from 'lucide-react';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Пример данных пользователя
  const userProfile = {
    id: 1,
    type: 'employer', // employer, candidate, admin
    name: 'Анна Смирнова',
    email: 'anna.smirnova@techsolutions.kz',
    phone: '+7 701 123 45 67',
    avatar: null,
    status: 'active',
    registeredDate: '15 ноября 2024',
    lastActivity: '2 часа назад',
    rating: 4.8,
    
    // Для работодателя
    company: {
      name: 'Tech Solutions KZ',
      industry: 'IT и разработка',
      size: '50-100 сотрудников',
      website: 'https://techsolutions.kz',
      description: 'Лидирующая IT-компания в сфере разработки корпоративных решений'
    },
    location: 'Петропавловск',
    subscription: 'pro',
    
    // Статистика
    stats: {
      activeJobs: 8,
      totalJobs: 23,
      totalHires: 15,
      monthlySpent: 285000,
      avgTimeToHire: 12,
      candidateRating: 4.8
    },
    
    // Активность
    recentActivity: [
      { date: '20 дек 2024', action: 'Разместил вакансию "Senior React Developer"', type: 'job_post' },
      { date: '19 дек 2024', action: 'Отправил оффер кандидату Максим Петров', type: 'offer_sent' },
      { date: '18 дек 2024', action: 'Провел интервью с Еленой Козловой', type: 'interview' },
      { date: '17 дек 2024', action: 'Обновил тарифный план на Pro', type: 'subscription' }
    ],
    
    // Нарушения
    violations: [
      { date: '15 дек 2024', type: 'warning', description: 'Неполное описание вакансии', status: 'resolved' },
      { date: '10 дек 2024', type: 'complaint', description: 'Жалоба на несоответствие условий', status: 'pending' }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: <User className="w-4 h-4" /> },
    { id: 'activity', label: 'Активность', icon: <Clock className="w-4 h-4" /> },
    { id: 'stats', label: 'Статистика', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'violations', label: 'Нарушения', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'settings', label: 'Настройки', icon: <Edit className="w-4 h-4" /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'blocked':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case 'free':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'start':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'growth':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'pro':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Профиль пользователя</h1>
            <p className="text-gray-400">Детальная информация и управление</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-gray-300 hover:bg-white/10 transition-all text-sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Отправить сообщение
          </button>
          <button className="flex items-center px-4 py-2 bg-red-600/20 border border-red-600/40 rounded-lg text-red-400 hover:bg-red-600/30 transition-all text-sm">
            <Ban className="w-4 h-4 mr-2" />
            Заблокировать
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm">
            <Edit className="w-4 h-4 mr-2" />
            Редактировать
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white/5 border border-gray-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-2xl">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(userProfile.status)}`}>
                {userProfile.status === 'active' ? 'Активен' : userProfile.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getSubscriptionColor(userProfile.subscription)}`}>
                {userProfile.subscription.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-300 text-sm">
                  <Mail className="w-4 h-4 mr-3 text-gray-500" />
                  {userProfile.email}
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Phone className="w-4 h-4 mr-3 text-gray-500" />
                  {userProfile.phone}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                  {userProfile.location}
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                  Регистрация: {userProfile.registeredDate}
                </div>
              </div>
            </div>
            
            {userProfile.company && (
              <div className="bg-white/5 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Building2 className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">{userProfile.company.name}</h3>
                </div>
                <p className="text-gray-300 text-sm mb-2">{userProfile.company.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span>{userProfile.company.industry}</span>
                  <span>{userProfile.company.size}</span>
                  {userProfile.company.website && (
                    <a href={userProfile.company.website} className="text-yellow-400 hover:text-yellow-300">
                      {userProfile.company.website}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="text-right space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-xl font-bold text-white">{userProfile.rating}</span>
            </div>
            <p className="text-gray-400 text-sm">Рейтинг</p>
            <p className="text-gray-500 text-xs">Онлайн: {userProfile.lastActivity}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{userProfile.stats.activeJobs}</span>
          </div>
          <p className="text-sm text-gray-400">Активных вакансий</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{userProfile.stats.totalHires}</span>
          </div>
          <p className="text-sm text-gray-400">Всего найми</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{userProfile.stats.avgTimeToHire}</span>
          </div>
          <p className="text-sm text-gray-400">Дней до найма</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{userProfile.stats.monthlySpent.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-400">₸ в месяц</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Основная информация</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">ID пользователя</span>
                      <span className="text-white">#{userProfile.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Тип аккаунта</span>
                      <span className="text-white">Работодатель</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Дата регистрации</span>
                      <span className="text-white">{userProfile.registeredDate}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Последняя активность</span>
                      <span className="text-white">{userProfile.lastActivity}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Подписка и платежи</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Тарифный план</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSubscriptionColor(userProfile.subscription)}`}>
                        {userProfile.subscription.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Месячные расходы</span>
                      <span className="text-green-400 font-medium">{userProfile.stats.monthlySpent.toLocaleString()} ₸</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Всего размещено</span>
                      <span className="text-white">{userProfile.stats.totalJobs} вакансий</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Недавняя активность</h3>
              {userProfile.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 border border-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activity.type === 'job_post' ? 'bg-blue-400/10 text-blue-400' :
                    activity.type === 'offer_sent' ? 'bg-green-400/10 text-green-400' :
                    activity.type === 'interview' ? 'bg-purple-400/10 text-purple-400' :
                    'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {activity.type.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Подробная статистика</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Эффективность найма</h4>
                  <div className="text-2xl font-bold text-green-400 mb-1">85%</div>
                  <p className="text-gray-400 text-sm">Успешных закрытий</p>
                </div>
                
                <div className="bg-white/5 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Время отклика</h4>
                  <div className="text-2xl font-bold text-blue-400 mb-1">2.5ч</div>
                  <p className="text-gray-400 text-sm">Среднее время</p>
                </div>
                
                <div className="bg-white/5 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Рейтинг кандидатов</h4>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">4.8</div>
                  <p className="text-gray-400 text-sm">Средняя оценка</p>
                </div>
              </div>
            </div>
          )}

          {/* Violations Tab */}
          {activeTab === 'violations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Нарушения и жалобы</h3>
              {userProfile.violations.length > 0 ? (
                userProfile.violations.map((violation, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 border border-gray-700 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      violation.type === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          violation.type === 'warning' 
                            ? 'bg-yellow-400/10 text-yellow-400' 
                            : 'bg-red-400/10 text-red-400'
                        }`}>
                          {violation.type === 'warning' ? 'Предупреждение' : 'Жалоба'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          violation.status === 'resolved' 
                            ? 'bg-green-400/10 text-green-400' 
                            : 'bg-yellow-400/10 text-yellow-400'
                        }`}>
                          {violation.status === 'resolved' ? 'Решено' : 'В обработке'}
                        </span>
                      </div>
                      <p className="text-white">{violation.description}</p>
                      <p className="text-gray-400 text-sm">{violation.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">Нарушений не найдено</h4>
                  <p className="text-gray-400">Пользователь соблюдает все правила платформы</p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Управление аккаунтом</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Статус аккаунта</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-green-600/10 border border-green-600/20 rounded-lg text-green-400 hover:bg-green-600/20 transition-all">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5" />
                        <span>Активировать аккаунт</span>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg text-yellow-400 hover:bg-yellow-600/20 transition-all">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5" />
                        <span>Временно заблокировать</span>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400 hover:bg-red-600/20 transition-all">
                      <div className="flex items-center space-x-3">
                        <XCircle className="w-5 h-5" />
                        <span>Заблокировать навсегда</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Дополнительные действия</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg text-blue-400 hover:bg-blue-600/20 transition-all">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5" />
                        <span>Отправить уведомление</span>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-purple-600/10 border border-purple-600/20 rounded-lg text-purple-400 hover:bg-purple-600/20 transition-all">
                      <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5" />
                        <span>Изменить тарифный план</span>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-gray-700 rounded-lg text-gray-300 hover:bg-white/10 transition-all">
                      <div className="flex items-center space-x-3">
                        <Edit className="w-5 h-5" />
                        <span>Редактировать данные</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Admin Notes */}
              <div>
                <h4 className="text-white font-medium mb-4">Заметки администратора</h4>
                <textarea
                  className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                  placeholder="Добавьте заметки о пользователе для других администраторов..."
                ></textarea>
                <div className="flex justify-end mt-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm">
                    Сохранить заметку
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;