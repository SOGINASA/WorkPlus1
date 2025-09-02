import React, { useState } from 'react';
import { 
  Building, Mail, Phone, MapPin, Globe, Upload, Camera, 
  Edit3, Save, X, Plus, Trash2, Users, Briefcase, Calendar, 
  Star, ChevronDown, FileText, Eye, Download, Filter,
  CheckCircle, XCircle, Clock, User, MessageSquare, Search,
  TrendingUp, Award, Target
} from 'lucide-react';

const EmployerProfile = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [isEditing, setIsEditing] = useState(false);
  const [applicantsFilter, setApplicantsFilter] = useState('all');
  
  const [profileData, setProfileData] = useState({
    // Company Info
    companyName: 'ТОО "Техномир"',
    industry: 'Розничная торговля',
    companySize: '50-100',
    website: 'https://tehnomir.kz',
    email: 'hr@tehnomir.kz',
    phone: '+7 (7152) 55-44-33',
    city: 'Петропавловск',
    address: 'ул. Конституции, 15',
    description: 'Крупнейшая сеть магазинов бытовой техники и электроники в Северном Казахстане. Работаем с 2010 года, имеем 5 филиалов в регионе.',
    logo: null,
    
    // Contact Person
    contactName: 'Светлана Петрова',
    contactPosition: 'HR-менеджер',
    contactPhone: '+7 (701) 123-45-67',
    contactEmail: 's.petrova@tehnomir.kz',
    
    // Settings
    isPublic: true,
    emailNotifications: true,
    smsNotifications: true,
    autoReply: true
  });

  const [vacancies] = useState([
    {
      id: 1,
      title: 'Продавец-консультант',
      department: 'Розничные продажи',
      salary: '180000-220000',
      type: 'full-time',
      status: 'active',
      postedDate: '2024-02-15',
      applicantsCount: 12,
      viewsCount: 156
    },
    {
      id: 2,
      title: 'Кассир',
      department: 'Розничные продажи',
      salary: '150000-180000',
      type: 'full-time',
      status: 'active',
      postedDate: '2024-02-10',
      applicantsCount: 8,
      viewsCount: 98
    },
    {
      id: 3,
      title: 'Менеджер по продажам',
      department: 'Продажи',
      salary: '300000-400000',
      type: 'full-time',
      status: 'paused',
      postedDate: '2024-02-01',
      applicantsCount: 23,
      viewsCount: 234
    }
  ]);

  const [applicants] = useState([
    {
      id: 1,
      name: 'Алексей Иванов',
      position: 'Продавец-консультант',
      vacancyId: 1,
      vacancyTitle: 'Продавец-консультант',
      appliedDate: '2024-02-16',
      status: 'new',
      experience: '3 года',
      salary: '200000',
      phone: '+7 (701) 234-56-78',
      email: 'alexey@example.com',
      rating: 4.5,
      avatar: null,
      skills: ['Продажи', 'Работа с клиентами', '1С'],
      lastActivity: '2 часа назад'
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      position: 'Кассир',
      vacancyId: 2,
      vacancyTitle: 'Кассир',
      appliedDate: '2024-02-15',
      status: 'interview',
      experience: '2 года',
      salary: '170000',
      phone: '+7 (701) 345-67-89',
      email: 'maria@example.com',
      rating: 4.2,
      avatar: null,
      skills: ['Кассовые операции', 'Клиентский сервис'],
      lastActivity: '5 часов назад'
    },
    {
      id: 3,
      name: 'Дмитрий Петров',
      position: 'Менеджер по продажам',
      vacancyId: 3,
      vacancyTitle: 'Менеджер по продажам',
      appliedDate: '2024-02-14',
      status: 'approved',
      experience: '5 лет',
      salary: '350000',
      phone: '+7 (701) 456-78-90',
      email: 'dmitry@example.com',
      rating: 4.8,
      avatar: null,
      skills: ['B2B продажи', 'CRM', 'Переговоры'],
      lastActivity: '1 день назад'
    },
    {
      id: 4,
      name: 'Анна Козлова',
      position: 'Продавец-консультант',
      vacancyId: 1,
      vacancyTitle: 'Продавец-консультант',
      appliedDate: '2024-02-13',
      status: 'rejected',
      experience: '1 год',
      salary: '180000',
      phone: '+7 (701) 567-89-01',
      email: 'anna@example.com',
      rating: 3.8,
      avatar: null,
      skills: ['Продажи', 'Работа с клиентами'],
      lastActivity: '3 дня назад'
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'interview': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'interview': return 'Собеседование';
      case 'approved': return 'Одобрен';
      case 'rejected': return 'Отклонен';
      default: return 'Неизвестно';
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    if (applicantsFilter === 'all') return true;
    return applicant.status === applicantsFilter;
  });

  const tabs = [
    { id: 'company', name: 'Компания', icon: <Building className="w-4 h-4" /> },
    { id: 'vacancies', name: 'Вакансии', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'applicants', name: 'Отклики', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', name: 'Настройки', icon: <FileText className="w-4 h-4" /> }
  ];

  const companyStats = [
    { label: 'Активные вакансии', value: '3', trend: '+1' },
    { label: 'Всего откликов', value: '43', trend: '+8' },
    { label: 'Новые отклики', value: '5', trend: '+2' },
    { label: 'Рейтинг компании', value: '4.6', trend: <Star className="w-4 h-4 text-yellow-400 fill-current" /> }
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
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-black font-bold text-xl md:text-2xl">
                <Building className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black hover:bg-yellow-500 transition-colors">
                  <Camera className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                {profileData.companyName}
              </h1>
              <p className="text-gray-300 text-sm md:text-base">{profileData.industry}</p>
              <div className="flex items-center mt-1 text-gray-400 text-sm">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                {profileData.city}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-all text-sm md:text-base"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Редактировать
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all text-sm md:text-base">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить вакансию
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all text-sm md:text-base"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm md:text-base"
                >
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 md:p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Статистика</h3>
              <div className="space-y-4">
                {companyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">{stat.label}</p>
                      <p className="text-white font-semibold">{stat.value}</p>
                    </div>
                    <div className="text-green-400 text-sm">
                      {typeof stat.trend === 'string' ? stat.trend : stat.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Быстрые действия</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center px-3 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg text-yellow-400 hover:bg-yellow-400/20 transition-all text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Создать вакансию
                </button>
                <button className="w-full flex items-center px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all text-sm">
                  <Search className="w-4 h-4 mr-2" />
                  Поиск кандидатов
                </button>
                <button className="w-full flex items-center px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/20 transition-all text-sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Аналитика
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1 mb-6 bg-white/5 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all text-sm md:text-base ${
                    activeTab === tab.id
                      ? 'bg-yellow-400 text-black font-medium'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2 hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 md:p-6 lg:p-8">
              {/* Company Information Tab */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Информация о компании</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Название компании</label>
                      <input
                        type="text"
                        value={profileData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Отрасль</label>
                      <select
                        value={profileData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                      >
                        <option value="Розничная торговля">Розничная торговля</option>
                        <option value="IT">IT</option>
                        <option value="Образование">Образование</option>
                        <option value="Медицина">Медицина</option>
                        <option value="Производство">Производство</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Размер компании</label>
                      <select
                        value={profileData.companySize}
                        onChange={(e) => handleInputChange('companySize', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                      >
                        <option value="1-10">1-10 сотрудников</option>
                        <option value="11-50">11-50 сотрудников</option>
                        <option value="50-100">50-100 сотрудников</option>
                        <option value="100-500">100-500 сотрудников</option>
                        <option value="500+">500+ сотрудников</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Веб-сайт</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Город</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                        <select
                          value={profileData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        >
                          <option value="Петропавловск">Петропавловск</option>
                          <option value="Костанай">Костанай</option>
                          <option value="Актау">Актау</option>
                          <option value="Павлодар">Павлодар</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Адрес</label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Описание компании</label>
                    <textarea
                      value={profileData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 resize-none text-sm md:text-base"
                      placeholder="Расскажите о вашей компании, миссии и ценностях..."
                    />
                  </div>

                  {/* Contact Person */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Контактное лицо</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">ФИО</label>
                        <input
                          type="text"
                          value={profileData.contactName}
                          onChange={(e) => handleInputChange('contactName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Должность</label>
                        <input
                          type="text"
                          value={profileData.contactPosition}
                          onChange={(e) => handleInputChange('contactPosition', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
                        <input
                          type="tel"
                          value={profileData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                          type="email"
                          value={profileData.contactEmail}
                          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vacancies Tab */}
              {activeTab === 'vacancies' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-semibold text-white">Мои вакансии</h2>
                    <button className="flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all font-medium text-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить вакансию
                    </button>
                  </div>

                  <div className="space-y-4">
                    {vacancies.map((vacancy) => (
                      <div key={vacancy.id} className="bg-white/5 border border-gray-700 rounded-lg p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1 mb-4 lg:mb-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-white">{vacancy.title}</h3>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                vacancy.status === 'active' 
                                  ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                                  : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                              }`}>
                                {vacancy.status === 'active' ? 'Активна' : 'Приостановлена'}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{vacancy.department}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {vacancy.postedDate}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {vacancy.applicantsCount} откликов
                              </span>
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {vacancy.viewsCount} просмотров
                              </span>
                              <span>Зарплата: {vacancy.salary} ₸</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button className="flex items-center justify-center px-3 py-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded hover:bg-yellow-400/20 transition-all text-sm">
                              <Edit3 className="w-4 h-4 mr-1" />
                              Редактировать
                            </button>
                            <button className="flex items-center justify-center px-3 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded hover:bg-blue-500/20 transition-all text-sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Просмотреть
                            </button>
                            {vacancy.status === 'active' ? (
                              <button className="flex items-center justify-center px-3 py-2 bg-gray-500/10 border border-gray-500/30 text-gray-400 rounded hover:bg-gray-500/20 transition-all text-sm">
                                <X className="w-4 h-4 mr-1" />
                                Приостановить
                              </button>
                            ) : (
                              <button className="flex items-center justify-center px-3 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded hover:bg-green-500/20 transition-all text-sm">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Активировать
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applicants Tab */}
              {activeTab === 'applicants' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-white">Отклики на вакансии</h2>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <select
                          value={applicantsFilter}
                          onChange={(e) => setApplicantsFilter(e.target.value)}
                          className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="all">Все отклики</option>
                          <option value="new">Новые</option>
                          <option value="interview">На собеседовании</option>
                          <option value="approved">Одобренные</option>
                          <option value="rejected">Отклоненные</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {filteredApplicants.map((applicant) => (
                      <div key={applicant.id} className="bg-white/5 border border-gray-700 rounded-lg p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Avatar and Basic Info */}
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold">
                              {applicant.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-white">{applicant.name}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(applicant.status)}`}>
                                  {getStatusText(applicant.status)}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm mb-2">{applicant.vacancyTitle}</p>
                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                <span>Опыт: {applicant.experience}</span>
                                <span>Зарплата: {applicant.salary} ₸</span>
                                <span className="flex items-center">
                                  <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                                  {applicant.rating}
                                </span>
                                <span>Подал: {applicant.appliedDate}</span>
                              </div>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 text-sm">
                            <div className="flex items-center text-gray-300">
                              <Phone className="w-3 h-3 mr-1" />
                              {applicant.phone}
                            </div>
                            <div className="flex items-center text-gray-300">
                              <Mail className="w-3 h-3 mr-1" />
                              {applicant.email}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                            <button className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all text-sm font-medium">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Одобрить
                            </button>
                            <button className="flex items-center justify-center px-3 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition-all text-sm font-medium">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Написать
                            </button>
                            <button className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all text-sm font-medium">
                              <XCircle className="w-4 h-4 mr-1" />
                              Отклонить
                            </button>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <p className="text-gray-300 text-sm mb-2">Навыки:</p>
                          <div className="flex flex-wrap gap-2">
                            {applicant.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-yellow-400/10 border border-yellow-400/30 rounded text-yellow-400 text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredApplicants.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">Нет откликов для отображения</p>
                      <p className="text-gray-500 text-sm">Попробуйте изменить фильтр или создать новую вакансию</p>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Настройки аккаунта</h2>
                  
                  {/* Privacy Settings */}
                  <div className="bg-white/5 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Видимость компании</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Публичный профиль</p>
                          <p className="text-gray-400 text-sm">Ваша компания будет видна соискателям</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.isPublic}
                            onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-white/5 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Уведомления</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Email уведомления</p>
                          <p className="text-gray-400 text-sm">Получать уведомления о новых откликах</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.emailNotifications}
                            onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">SMS уведомления</p>
                          <p className="text-gray-400 text-sm">Получать SMS о срочных откликах</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.smsNotifications}
                            onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Автоответ</p>
                          <p className="text-gray-400 text-sm">Автоматически отвечать кандидатам</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.autoReply}
                            onChange={(e) => handleInputChange('autoReply', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-white/5 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Действия с аккаунтом</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex items-center justify-center px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all font-medium">
                        <Download className="w-4 h-4 mr-2" />
                        Экспорт данных
                      </button>
                      <button className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
                        <Upload className="w-4 h-4 mr-2" />
                        Импорт вакансий
                      </button>
                      <button className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить аккаунт
                      </button>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="bg-white/5 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Информация об аккаунте</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Дата регистрации:</span>
                        <span className="text-white">1 февраля 2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Последнее обновление:</span>
                        <span className="text-white">3 дня назад</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">План подписки:</span>
                        <span className="text-white">Growth Plan</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ID компании:</span>
                        <span className="text-white">#WP2023EMP456</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;