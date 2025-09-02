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
  const [originalData, setOriginalData] = useState(null);
  
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
  const [myApplications, setMyApplications] = useState([
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
  const [resumeResponses, setResumeResponses] = useState([
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

  // Функции управления профилем
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startEditing = () => {
    setOriginalData({...profileData});
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    setOriginalData(null);
    alert('Профиль успешно сохранен!');
    console.log('Saving profile:', profileData);
  };

  const handleCancel = () => {
    if (originalData) {
      setProfileData(originalData);
    }
    setIsEditing(false);
    setOriginalData(null);
  };

  const uploadPhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert('Размер файла не должен превышать 5 МБ');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${profileData.firstName}-${profileData.lastName}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      alert('Ссылка на профиль скопирована в буфер обмена');
    }).catch(() => {
      prompt('Скопируйте ссылку на профиль:', profileUrl);
    });
  };

  const downloadResume = () => {
    const resumeData = {
      name: `${profileData.firstName} ${profileData.lastName}`,
      position: profileData.desiredPosition,
      contact: {
        email: profileData.email,
        phone: profileData.phone,
        city: profileData.city
      },
      about: profileData.about,
      skills: profileData.skills,
      experience: profileData.workExperience,
      education: profileData.education
    };
    
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `resume-${profileData.firstName}-${profileData.lastName}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Функции управления навыками
  const addSkill = () => {
    const newSkill = prompt('Введите новый навык:');
    if (newSkill && newSkill.trim()) {
      const trimmedSkill = newSkill.trim();
      if (!profileData.skills.includes(trimmedSkill)) {
        setProfileData(prev => ({
          ...prev,
          skills: [...prev.skills, trimmedSkill]
        }));
      } else {
        alert('Этот навык уже добавлен');
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    if (confirm(`Удалить навык "${skillToRemove}"?`)) {
      setProfileData(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
    }
  };

  // Функции управления образованием
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: 'Новое учебное заведение',
      specialty: '',
      period: '',
      type: 'Среднее специальное'
    };
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const removeEducation = (id) => {
    if (confirm('Удалить запись об образовании?')) {
      setProfileData(prev => ({
        ...prev,
        education: prev.education.filter(edu => edu.id !== id)
      }));
    }
  };

  const updateEducation = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Функции управления опытом работы
  const addWorkExperience = () => {
    const newWork = {
      id: Date.now(),
      company: 'Новая компания',
      position: '',
      period: '',
      description: ''
    };
    setProfileData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newWork]
    }));
  };

  const removeWorkExperience = (id) => {
    if (confirm('Удалить запись об опыте работы?')) {
      setProfileData(prev => ({
        ...prev,
        workExperience: prev.workExperience.filter(work => work.id !== id)
      }));
    }
  };

  const updateWorkExperience = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(work => 
        work.id === id ? { ...work, [field]: value } : work
      )
    }));
  };

  // Функции для работы с откликами на резюме
  const handleResponseAction = (responseId, action) => {
    const response = resumeResponses.find(r => r.id === responseId);
    if (!response) return;

    const actionText = action === 'accept' ? 'принять' : 'отклонить';
    const confirmMessage = `Вы действительно хотите ${actionText} предложение от "${response.companyName}"?`;
    
    if (confirm(confirmMessage)) {
      const newStatus = action === 'accept' ? 'accepted' : 'declined';
      
      setResumeResponses(prev => prev.map(r => 
        r.id === responseId ? { ...r, status: newStatus } : r
      ));
      
      alert(`Предложение ${action === 'accept' ? 'принято' : 'отклонено'}!`);
    }
  };

  const withdrawApplication = (applicationId) => {
    const application = myApplications.find(app => app.id === applicationId);
    if (!application) return;

    if (confirm(`Отозвать заявку на вакансию "${application.vacancyTitle}" в компании "${application.companyName}"?`)) {
      setMyApplications(prev => prev.filter(app => app.id !== applicationId));
      alert('Заявка отозвана');
    }
  };

  // Вспомогательные функции
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
    { label: 'Мои отклики', value: myApplications.length.toString(), trend: `+${myApplications.filter(app => app.status === 'new').length}` },
    { label: 'Отклики на резюме', value: resumeResponses.length.toString(), trend: `+${resumeResponses.filter(r => r.status === 'new').length}` },
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
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xl md:text-2xl overflow-hidden">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  `${profileData.firstName[0]}${profileData.lastName[0]}`
                )}
              </div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadPhoto}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3 h-3 md:w-4 md:h-4 text-black" />
                  </label>
                </>
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
              <>
                <button
                  onClick={startEditing}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Редактировать
                </button>
                <button
                  onClick={shareProfile}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors flex items-center"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Поделиться
                </button>
                <button
                  onClick={downloadResume}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Скачать резюме
                </button>
              </>
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

              {/* Skills */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-400" />
                    Навыки
                  </h3>
                  {isEditing && (
                    <button
                      onClick={addSkill}
                      className="px-3 py-1 bg-yellow-400 text-black rounded-lg text-sm hover:bg-yellow-300 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <div key={index} className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-3 py-1 flex items-center">
                      <span className="text-yellow-400 text-sm">{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  {profileData.skills.length === 0 && (
                    <p className="text-gray-400 text-sm">Навыки не добавлены</p>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-yellow-400" />
                    Образование
                  </h3>
                  {isEditing && (
                    <button
                      onClick={addEducation}
                      className="px-3 py-1 bg-yellow-400 text-black rounded-lg text-sm hover:bg-yellow-300 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {profileData.education.map((edu) => (
                    <div key={edu.id} className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                placeholder="Учебное заведение"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              />
                              <input
                                type="text"
                                value={edu.specialty}
                                onChange={(e) => updateEducation(edu.id, 'specialty', e.target.value)}
                                placeholder="Специальность"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={edu.period}
                                  onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                                  placeholder="Период обучения"
                                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <select
                                  value={edu.type}
                                  onChange={(e) => updateEducation(edu.id, 'type', e.target.value)}
                                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                  <option value="Среднее">Среднее</option>
                                  <option value="Среднее специальное">Среднее специальное</option>
                                  <option value="Высшее">Высшее</option>
                                  <option value="Магистратура">Магистратура</option>
                                  <option value="Аспирантура">Аспирантура</option>
                                </select>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h4 className="text-lg font-semibold text-white">{edu.institution}</h4>
                              <p className="text-gray-300">{edu.specialty}</p>
                              <div className="flex items-center text-sm text-gray-400 mt-2">
                                <Calendar className="w-4 h-4 mr-1" />
                                {edu.period} • {edu.type}
                              </div>
                            </>
                          )}
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="ml-3 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {profileData.education.length === 0 && (
                    <p className="text-gray-400 text-sm">Образование не добавлено</p>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-yellow-400" />
                    Опыт работы
                  </h3>
                  {isEditing && (
                    <button
                      onClick={addWorkExperience}
                      className="px-3 py-1 bg-yellow-400 text-black rounded-lg text-sm hover:bg-yellow-300 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {profileData.workExperience.map((work) => (
                    <div key={work.id} className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={work.company}
                                onChange={(e) => updateWorkExperience(work.id, 'company', e.target.value)}
                                placeholder="Компания"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              />
                              <input
                                type="text"
                                value={work.position}
                                onChange={(e) => updateWorkExperience(work.id, 'position', e.target.value)}
                                placeholder="Должность"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              />
                              <input
                                type="text"
                                value={work.period}
                                onChange={(e) => updateWorkExperience(work.id, 'period', e.target.value)}
                                placeholder="Период работы"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              />
                              <textarea
                                value={work.description}
                                onChange={(e) => updateWorkExperience(work.id, 'description', e.target.value)}
                                placeholder="Описание обязанностей"
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              />
                            </div>
                          ) : (
                            <>
                              <h4 className="text-lg font-semibold text-white">{work.position}</h4>
                              <p className="text-gray-300 flex items-center">
                                <Building className="w-4 h-4 mr-2 text-gray-400" />
                                {work.company}
                              </p>
                              <div className="flex items-center text-sm text-gray-400 mt-2 mb-3">
                                <Calendar className="w-4 h-4 mr-1" />
                                {work.period}
                              </div>
                              <p className="text-gray-300 text-sm">{work.description}</p>
                            </>
                          )}
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeWorkExperience(work.id)}
                            className="ml-3 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {profileData.workExperience.length === 0 && (
                    <p className="text-gray-400 text-sm">Опыт работы не добавлен</p>
                  )}
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
                    placeholder="Расскажите о себе, своих достижениях и целях"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                ) : (
                  <p className="text-gray-300">{profileData.about || 'Информация не заполнена'}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'applications' && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white mb-4 sm:mb-0">Мои отклики ({myApplications.length})</h3>
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
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">
                      {responsesFilter === 'all' 
                        ? 'У вас пока нет откликов на вакансии' 
                        : `Нет откликов с статусом "${getApplicationStatusText(responsesFilter)}"`
                      }
                    </p>
                  </div>
                ) : (
                  filteredApplications.map((application) => (
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
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getApplicationStatusColor(application.status)}`}>
                                {getApplicationStatusText(application.status)}
                              </span>
                              {application.status === 'new' && (
                                <button
                                  onClick={() => withdrawApplication(application.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                  title="Отозвать заявку"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
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
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'responses' && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Отклики на мое резюме ({resumeResponses.length})</h3>
              
              <div className="space-y-4">
                {resumeResponses.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">Пока нет откликов на ваше резюме</p>
                    <p className="text-gray-500 text-sm mt-2">Убедитесь, что ваш профиль публичный и заполнен полностью</p>
                  </div>
                ) : (
                  resumeResponses.map((response) => (
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
                              <a href={`tel:${response.phone}`} className="text-yellow-400 hover:text-yellow-300">
                                {response.phone}
                              </a>
                            </div>
                          </div>

                          {response.status === 'new' && (
                            <div className="flex flex-wrap gap-2">
                              <button 
                                onClick={() => handleResponseAction(response.id, 'accept')}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-400 transition-colors flex items-center"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Принять
                              </button>
                              <button 
                                onClick={() => handleResponseAction(response.id, 'decline')}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-400 transition-colors flex items-center"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Отклонить
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
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
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
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

                    <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
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

                    <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
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

                <div className="border-t border-gray-700 pt-6">
                  <h4 className="text-lg font-medium text-white mb-4">Действия с аккаунтом</h4>
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
                          alert('Функция удаления аккаунта будет реализована в следующих версиях');
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить аккаунт
                    </button>
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