import React, { useState, useEffect } from 'react';
import { 
  Building, Mail, Phone, MapPin, Globe, Upload, Camera, 
  Edit3, Save, X, Plus, Trash2, Users, Briefcase, Calendar, 
  Star, ChevronDown, FileText, Eye, Download, Filter,
  CheckCircle, XCircle, Clock, User, MessageSquare, Search,
  TrendingUp, Award, Target, Play, Pause, MoreVertical,
  Send, Bell, Shield, Settings
} from 'lucide-react';
import { API_BASE_URL } from '../components/api/AuthUtils';

const EmployerProfile = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [isEditing, setIsEditing] = useState(false);
  const [applicantsFilter, setApplicantsFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  
  const [profileData, setProfileData] = useState({});
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [vacancies, setVacancies] = useState([]);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employer/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        console.log('Fetched profile data:', data.profile);
        setProfileData(data.profile);
      } catch (error) {
        console.error(error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();

    const fetchVacancies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employer/vacancies`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        console.log('Fetched vacancies:', data.vacancies);
        setVacancies(data.vacancies);
      } catch (error) {
        console.error(error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  const [applicants, setApplicants] = useState([]);
  const [isApplicantsLoading, setIsApplicantsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employer/applicants`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        console.log('Fetched applicants:', data.applicants);
        setApplicants(data.applicants);
      } catch (error) {
        console.error(error);
      } finally {
        setIsApplicantsLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employer/profile`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(profileData),
        });

        if (response.ok) {
          setShowModal(true);
          setModalType('success');
        } else {
          const error = await response.json();
          console.error(error);
          alert(`Ошибка: ${error.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('Ошибка: Не удалось изменить данные профиля');
      }
    })();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleCreateVacancy = () => {
    window.location.href = '/create-job';
  };

  const handleSearchCandidates = () => {
    setShowModal(true);
    setModalType('searchCandidates');
  };

  const handleShowAnalytics = () => {
    setShowModal(true);
    setModalType('analytics');
    window.location.href = '/resume-dashboard';
  };

  const handleEditVacancy = (vacancyId) => {
    setShowModal(true);
    setModalType('editVacancy');
  };

  const handleViewVacancy = (vacancyId) => {
    // setShowModal(true);
    // setModalType('viewVacancy');
    window.location.href = `/jobdetail?id=${vacancyId}`  
  };

  const toggleVacancyStatus = async (vacancyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employer/jobs/${vacancyId}/delete`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setVacancies(prev => prev.map(vacancy => 
      vacancy.id === vacancyId 
        ? { ...vacancy, status: vacancy.status === 'active' ? 'paused' : 'active' }
        : vacancy
    ));
      } else {
        console.error(data.error);
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка: Не удалось изменить статус вакансии');
    }
  };

  const handleApplicantAction = (applicant, action) => {
    setSelectedApplicant(applicant);
    setShowModal(true);
    setModalType(action);

    if (action === 'reject' || action === 'approve') {
      fetch(`${API_BASE_URL}/api/employer/applicant/${applicant.id}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' }),
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
    }
    
    if (action === 'approve' || action === 'reject') {
      setApplicants(prev => prev.map(app => 
        app.id === applicant.id 
          ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' }
          : app
      ));
    }
  };

  const handleExportData = () => {
    const data = {
      profile: profileData,
      vacancies: vacancies,
      applicants: applicants
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employer-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportVacancies = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setShowModal(true);
        setModalType('importSuccess');
      }
    };
    input.click();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
      fetch(`${API_BASE_URL}/api/auth/deactivate`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      }).then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      })
      .catch(err => console.error(err));
      setShowModal(true);
      setModalType('deleteAccount');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedApplicant(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'interview': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'interview': return 'Собеседование';
      case 'approved': return 'Одобрен';
      case 'rejected': return 'Отклонен';
      case 'active': return 'Активна';
      case 'paused': return 'На паузе';
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
    { id: 'settings', name: 'Настройки', icon: <Settings className="w-4 h-4" /> }
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
                <button
                  onClick={handleCreateVacancy}
                  className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all text-sm md:text-base"
                >
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
                <button 
                  onClick={handleCreateVacancy}
                  className="w-full flex items-center px-3 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg text-yellow-400 hover:bg-yellow-400/20 transition-all text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать вакансию
                </button>
                <button 
                  onClick={handleSearchCandidates}
                  className="w-full flex items-center px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all text-sm"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Поиск кандидатов
                </button>
                <button 
                  onClick={handleShowAnalytics}
                  className="w-full flex items-center px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/20 transition-all text-sm"
                >
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-0">Мои вакансии</h2>
                    <div className="flex gap-3">
                      <button
                        onClick={handleImportVacancies}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Импорт
                      </button>
                      <button
                        onClick={handleCreateVacancy}
                        className="flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить вакансию
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {vacancies.map((vacancy) => (
                      <div key={vacancy.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                              <h3 className="text-lg font-semibold text-white mb-2 sm:mb-0">{vacancy.title}</h3>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(vacancy.status)}`}>
                                  {getStatusText(vacancy.status)}
                                </span>
                                <button
                                  onClick={() => toggleVacancyStatus(vacancy.id)}
                                  className="p-1 text-gray-400 hover:text-white transition-colors"
                                >
                                  {vacancy.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300 mb-4">
                              <div>
                                <span className="text-gray-400">Отдел:</span> {vacancy.department}
                              </div>
                              <div>
                                <span className="text-gray-400">Зарплата:</span> {vacancy.salary} ₸
                              </div>
                              <div>
                                <span className="text-gray-400">Опубликовано:</span> {new Date(vacancy.postedDate).toLocaleDateString('ru-RU')}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {vacancy.applicantsCount} откликов
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {vacancy.viewsCount} просмотров
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 lg:mt-0 lg:ml-6">
                            <button
                              onClick={() => handleViewVacancy(vacancy.id)}
                              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Просмотр
                            </button>
                            {/* <button
                              onClick={() => handleEditVacancy(vacancy.id)}
                              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm"
                            >
                              <Edit3 className="w-4 h-4 mr-1" />
                              Изменить
                            </button> */}  
                            {/* TODO : add page for it */}
                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-0">Отклики кандидатов</h2>
                    <div className="flex gap-3">
                      <select
                        value={applicantsFilter}
                        onChange={(e) => setApplicantsFilter(e.target.value)}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="all">Все отклики</option>
                        <option value="new">Новые</option>
                        <option value="approved">Одобренные</option>
                        <option value="rejected">Отклоненные</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredApplicants.map((applicant) => (
                      <div key={applicant.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-semibold mr-4">
                                  {applicant.name.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-white">{applicant.name}</h3>
                                  <p className="text-gray-300 text-sm">{applicant.vacancyTitle}</p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(applicant.status)}`}>
                                {getStatusText(applicant.status)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300 mb-4">
                              <div>
                                <span className="text-gray-400">Опыт:</span> {applicant.experience}
                              </div>
                              <div>
                                <span className="text-gray-400">Желаемая зарплата:</span> {applicant.salary} ₸
                              </div>
                              <div>
                                <span className="text-gray-400">Подал заявку:</span> {new Date(applicant.appliedDate).toLocaleDateString('ru-RU')}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {applicant.skills.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                {applicant.rating}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {applicant.lastActivity}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 lg:mt-0 lg:ml-6">
                            {applicant.status === 'new' && (
                              <>
                                <button
                                  onClick={() => handleApplicantAction(applicant, 'approve')}
                                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Одобрить
                                </button>
                                <button
                                  onClick={() => handleApplicantAction(applicant, 'reject')}
                                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Отклонить
                                </button>
                              </>
                            )}
                            {/* <button
                              onClick={() => handleApplicantAction(applicant, 'message')}
                              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Сообщение
                            </button>
                            <button
                              onClick={() => handleApplicantAction(applicant, 'view')}
                              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Профиль
                            </button> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Настройки аккаунта</h2>
                  
                  {/* Privacy Settings */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Приватность
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Публичный профиль</p>
                          <p className="text-gray-400 text-sm">Разрешить кандидатам видеть информацию о компании</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.isPublic}
                            onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Уведомления
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Email уведомления</p>
                          <p className="text-gray-400 text-sm">Получать уведомления на email о новых откликах</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.emailNotifications}
                            onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">SMS уведомления</p>
                          <p className="text-gray-400 text-sm">Получать SMS о важных событиях</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.smsNotifications}
                            onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Автоответы</p>
                          <p className="text-gray-400 text-sm">Автоматически отвечать кандидатам при получении отклика</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.autoReply}
                            onChange={(e) => handleInputChange('autoReply', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Управление данными
                    </h3>
                    <div className="space-y-4">
                      <button
                        onClick={handleExportData}
                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Экспорт данных
                      </button>
                      <button
                        onClick={handleImportVacancies}
                        className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Импорт вакансий
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
                      <Trash2 className="w-5 h-5 mr-2" />
                      Опасная зона
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Удаление аккаунта приведет к безвозвратной потере всех данных, включая вакансии, отклики и настройки.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить аккаунт
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              {modalType === 'success' && (
                <>
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Успешно сохранено</h3>
                  <p className="text-gray-300 mb-4">Изменения в профиле компании сохранены</p>
                </>
              )}
              
              {modalType === 'createVacancy' && (
                <>
                  <Plus className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Создать вакансию</h3>
                  <p className="text-gray-300 mb-4">Перенаправление на страницу создания вакансии...</p>
                </>
              )}

              {modalType === 'searchCandidates' && (
                <>
                  <Search className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Поиск кандидатов</h3>
                  <p className="text-gray-300 mb-4">Открываем базу кандидатов...</p>
                </>
              )}

              {modalType === 'analytics' && (
                <>
                  <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Аналитика</h3>
                  <p className="text-gray-300 mb-4">Загружаем отчеты и статистику...</p>
                </>
              )}

              {modalType === 'approve' && (
                <>
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Кандидат одобрен</h3>
                  <p className="text-gray-300 mb-4">Уведомление отправлено кандидату</p>
                </>
              )}

              {modalType === 'reject' && (
                <>
                  <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Кандидат отклонен</h3>
                  <p className="text-gray-300 mb-4">Уведомление отправлено кандидату</p>
                </>
              )}

              {modalType === 'message' && (
                <>
                  <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Отправить сообщение</h3>
                  <p className="text-gray-300 mb-4">Открываем чат с кандидатом...</p>
                </>
              )}

              {modalType === 'deleteAccount' && (
                <>
                  <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Аккаунт удален</h3>
                  <p className="text-gray-300 mb-4">Ваш аккаунт был успешно удален</p>
                </>
              )}

              <button
                onClick={closeModal}
                className="w-full px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all font-medium"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerProfile;