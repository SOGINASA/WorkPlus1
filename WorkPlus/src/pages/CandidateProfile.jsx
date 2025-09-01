import React, { useState } from 'react';
import { 
  User, Building, Mail, Phone, MapPin, Briefcase, Upload, Camera, 
  Edit3, Save, X, Plus, Trash2, Award, Calendar, DollarSign,
  Star, ChevronDown, FileText, Eye, Download, Filter,
  CheckCircle, XCircle, Clock, MessageSquare, Search,
  TrendingUp, Target, Heart, BookOpen, Globe
} from 'lucide-react';

const CandidateProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [responsesFilter, setResponsesFilter] = useState('all');
  
  const [profileData, setProfileData] = useState({
    // Personal Info
    firstName: 'Алексей',
    lastName: 'Иванов',
    email: 'alexey.ivanov@example.com',
    phone: '+7 (701) 234-56-78',
    city: 'Петропавловск',
    birthDate: '1992-05-15',
    avatar: null,
    
    // Professional Info
    currentPosition: 'Продавец-консультант',
    desiredPosition: 'Старший продавец',
    salaryFrom: '180000',
    salaryTo: '250000',
    experience: '3',
    workSchedule: 'full-time',
    
    // Skills & Education
    skills: ['Продажи', 'Работа с клиентами', 'Кассовые операции', '1С'],
    education: [
      {
        id: 1,
        institution: 'Костанайский колледж',
        specialty: 'Коммерция',
        period: '2010-2013',
        type: 'Среднее специальное'
      }
    ],
    
    // Work Experience
    workExperience: [
      {
        id: 1,
        company: 'Магазин "Техномир"',
        position: 'Продавец-консультант',
        period: '2020-2023',
        description: 'Консультирование клиентов по бытовой технике, работа с кассой, оформление документов'
      }
    ],
    
    // About
    about: 'Ответственный и коммуникабельный специалист с опытом работы в розничной торговле. Умею находить подход к любому клиенту и достигать поставленных целей по продажам.',
    
    // Settings
    isPublic: true,
    emailNotifications: true,
    smsNotifications: false,
    jobAlerts: true
  });

  // Мои отклики на вакансии
  const [myApplications] = useState([
    {
      id: 1,
      companyName: 'ТОО "Техномир"',
      vacancyTitle: 'Продавец-консультант',
      appliedDate: '2024-02-16',
      status: 'interview',
      salary: '200000-220000',
      location: 'Петропавловск',
      response: 'Приглашены на собеседование на 20.02.2024 в 14:00',
      responseDate: '2024-02-18',
      companyLogo: null,
      priority: 'high'
    },
    {
      id: 2,
      companyName: 'ИП Сидорова М.А.',
      vacancyTitle: 'Кассир',
      appliedDate: '2024-02-15',
      status: 'new',
      salary: '150000-180000',
      location: 'Петропавловск',
      response: null,
      responseDate: null,
      companyLogo: null,
      priority: 'medium'
    },
    {
      id: 3,
      companyName: 'Сеть магазинов "Арсенал"',
      vacancyTitle: 'Менеджер по продажам',
      appliedDate: '2024-02-14',
      status: 'rejected',
      salary: '300000-350000',
      location: 'Петропавловск',
      response: 'К сожалению, выбран другой кандидат. Спасибо за интерес к нашей компании!',
      responseDate: '2024-02-16',
      companyLogo: null,
      priority: 'high'
    },
    {
      id: 4,
      companyName: 'ТОО "МегаСтрой"',
      vacancyTitle: 'Администратор',
      appliedDate: '2024-02-12',
      status: 'approved',
      salary: '180000-200000',
      location: 'Петропавловск',
      response: 'Поздравляем! Вы приняты на работу. Выход на работу 22.02.2024 в 9:00. Документы принести в первый рабочий день.',
      responseDate: '2024-02-14',
      companyLogo: null,
      priority: 'high'
    }
  ]);

  // Кто откликнулся на мое резюме
  const [resumeResponses] = useState([
    {
      id: 1,
      companyName: 'ТОО "Евразия Трейд"',
      companyLogo: null,
      position: 'Продавец-консультант',
      salary: '190000-230000',
      location: 'Петропавловск',
      contactDate: '2024-02-17',
      status: 'new',
      message: 'Здравствуйте! Ваше резюме заинтересовало нас. Хотели бы пригласить на собеседование по вакансии продавец-консультант.',
      contactPerson: 'Анна Петрова, HR-менеджер',
      phone: '+7 (7152) 44-55-66',
      companyRating: 4.3
    },
    {
      id: 2,
      companyName: 'Торговый центр "Гранд"',
      companyLogo: null,
      position: 'Старший продавец',
      salary: '220000-280000',
      location: 'Петропавловск',
      contactDate: '2024-02-15',
      status: 'interview',
      message: 'Приглашаем вас на собеседование 19.02.2024 в 15:30. Адрес: ул. Жумабека Ташенова, 22.',
      contactPerson: 'Сергей Николаев, Менеджер по персоналу',
      phone: '+7 (7152) 33-44-55',
      companyRating: 4.7
    },
    {
      id: 3,
      companyName: 'ИП Козлов А.В.',
      companyLogo: null,
      position: 'Консультант по продажам',
      salary: '170000-200000',
      location: 'Петропавловск',
      contactDate: '2024-02-13',
      status: 'declined',
      message: 'Спасибо за рассмотрение, но меня не устраивает график работы.',
      contactPerson: 'Алексей Козлов',
      phone: '+7 (701) 111-22-33',
      companyRating: 3.9
    }
  ]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saving profile:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'interview': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getApplicationStatusText = (status) => {
    switch (status) {
      case 'new': return 'Рассматривается';
      case 'interview': return 'Собеседование';
      case 'approved': return 'Принят';
      case 'rejected': return 'Отклонен';
      default: return 'Неизвестно';
    }
  };

  const getResponseStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'interview': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'accepted': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'declined': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getResponseStatusText = (status) => {
    switch (status) {
      case 'new': return 'Новое предложение';
      case 'interview': return 'Назначено собеседование';
      case 'accepted': return 'Принято';
      case 'declined': return 'Отклонено';
      default: return 'Неизвестно';
    }
  };

  const filteredApplications = myApplications.filter(app => {
    if (responsesFilter === 'all') return true;
    return app.status === responsesFilter;
  });

  const tabs = [
    { id: 'personal', name: 'Профиль', icon: <User className="w-4 h-4" /> },
    { id: 'applications', name: 'Мои отклики', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'responses', name: 'Отклики на резюме', icon: <Heart className="w-4 h-4" /> },
    { id: 'settings', name: 'Настройки', icon: <FileText className="w-4 h-4" /> }
  ];

  const profileStats = [
    { label: 'Просмотры резюме', value: '234', trend: '+12%' },
    { label: 'Мои отклики', value: '8', trend: '+3' },
    { label: 'Отклики на резюме', value: '5', trend: '+2' },
    { label: 'Рейтинг', value: '4.8', trend: <Star className="w-4 h-4 text-yellow-400 fill-current" /> }
  ];

  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
      <div className="relative max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-8">
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xl md:text-2xl">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors">
                  <Camera className="w-3 h-3 md:w-4 md:h-4 text-black" />
                </button>
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-gray-300">{profileData.currentPosition}</p>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {profileData.city}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Редактировать
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-400 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {profileStats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="text-green-400 text-sm flex items-center">
                  {typeof stat.trend === 'string' ? (
                    <>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.trend}
                    </>
                  ) : (
                    stat.trend
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-gray-700 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium flex items-center transition-colors ${
                activeTab === tab.id
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'personal' && (
            <>
              {/* Personal Information */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-yellow-400" />
                  Личная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      <p className="text-white">{profileData.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Фамилия</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      <p className="text-white">{profileData.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      <p className="text-white flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {profileData.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      <p className="text-white flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {profileData.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Город</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      <p className="text-white flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {profileData.city}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-yellow-400" />
                  Профессиональная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Текущая должность</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.currentPosition}
                        onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      <p className="text-white">{profileData.currentPosition}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Желаемая должность</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.desiredPosition}
                        onChange={(e) => handleInputChange('desiredPosition', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      <p className="text-white">{profileData.desiredPosition}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Зарплата от</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={profileData.salaryFrom}
                        onChange={(e) => handleInputChange('salaryFrom', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      <p className="text-white flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        {parseInt(profileData.salaryFrom).toLocaleString()} ₸
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Зарплата до</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={profileData.salaryTo}
                        onChange={(e) => handleInputChange('salaryTo', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      <p className="text-white flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        {parseInt(profileData.salaryTo).toLocaleString()} ₸
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">О себе</h3>
                {isEditing ? (
                  <textarea
                    value={profileData.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                ) : (
                  <p className="text-gray-300">{profileData.about}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'applications' && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white mb-4 sm:mb-0">Мои отклики</h3>
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  <select
                    value={responsesFilter}
                    onChange={(e) => setResponsesFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="all">Все статусы</option>
                    <option value="new">Рассматривается</option>
                    <option value="interview">Собеседование</option>
                    <option value="approved">Принят</option>
                    <option value="rejected">Отклонен</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 hover:bg-gray-700/50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-1">{application.vacancyTitle}</h4>
                            <p className="text-gray-300 flex items-center">
                              <Building className="w-4 h-4 mr-2 text-gray-400" />
                              {application.companyName}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getApplicationStatusColor(application.status)}`}>
                            {getApplicationStatusText(application.status)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {application.salary} ₸
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {application.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Подано: {new Date(application.appliedDate).toLocaleDateString('ru-RU')}
                          </span>
                        </div>

                        {application.response && (
                          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 mb-3">
                            <div className="flex items-center mb-2">
                              <MessageSquare className="w-4 h-4 mr-2 text-yellow-400" />
                              <span className="text-sm text-gray-300">
                                Ответ от {new Date(application.responseDate).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                            <p className="text-white text-sm">{application.response}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'responses' && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Отклики на мое резюме</h3>
              
              <div className="space-y-4">
                {resumeResponses.map((response) => (
                  <div key={response.id} className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 hover:bg-gray-700/50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-lg flex items-center justify-center mr-3">
                              <Building className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-1">{response.position}</h4>
                              <p className="text-gray-300 mb-1">{response.companyName}</p>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm text-gray-400">{response.companyRating}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getResponseStatusColor(response.status)}`}>
                            {getResponseStatusText(response.status)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {response.salary} ₸
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {response.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(response.contactDate).toLocaleDateString('ru-RU')}
                          </span>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 mb-3">
                          <p className="text-white text-sm mb-2">{response.message}</p>
                          <div className="flex items-center text-sm text-gray-400">
                            <User className="w-4 h-4 mr-2" />
                            {response.contactPerson}
                            <Phone className="w-4 h-4 ml-4 mr-1" />
                            {response.phone}
                          </div>
                        </div>

                        {response.status === 'new' && (
                          <div className="flex flex-wrap gap-2">
                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-400 transition-colors flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Принять
                            </button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-400 transition-colors flex items-center">
                              <XCircle className="w-4 h-4 mr-2" />
                              Отклонить
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Настройки профиля</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Приватность</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Публичный профиль</p>
                        <p className="text-gray-400 text-sm">Разрешить работодателям находить мое резюме</p>
                      </div>
                      <button
                        onClick={() => handleInputChange('isPublic', !profileData.isPublic)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          profileData.isPublic ? 'bg-yellow-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profileData.isPublic ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Уведомления</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Email уведомления</p>
                        <p className="text-gray-400 text-sm">Получать уведомления на email</p>
                      </div>
                      <button
                        onClick={() => handleInputChange('emailNotifications', !profileData.emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          profileData.emailNotifications ? 'bg-yellow-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profileData.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">SMS уведомления</p>
                        <p className="text-gray-400 text-sm">Получать уведомления по SMS</p>
                      </div>
                      <button
                        onClick={() => handleInputChange('smsNotifications', !profileData.smsNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          profileData.smsNotifications ? 'bg-yellow-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profileData.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Уведомления о вакансиях</p>
                        <p className="text-gray-400 text-sm">Получать подходящие вакансии</p>
                      </div>
                      <button
                        onClick={() => handleInputChange('jobAlerts', !profileData.jobAlerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          profileData.jobAlerts ? 'bg-yellow-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profileData.jobAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;