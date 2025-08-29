import React, { useState } from 'react';
import { 
  User, Building, Mail, Phone, MapPin, Briefcase, Upload, Camera, 
  Edit3, Save, X, Plus, Trash2, Award, Calendar, DollarSign,
  Star, ChevronDown, FileText, Eye, Download
} from 'lucide-react';

const ProfileForm = () => {
  const [userType] = useState('candidate'); // This would come from auth context
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
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
    smsNotifications: false
  });

  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saving profile:', profileData);
    // Here you would typically send the data to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Here you would typically revert changes
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      handleInputChange('skills', [...profileData.skills, newSkill.trim()]);
      setNewSkill('');
      setShowSkillInput(false);
    }
  };

  const removeSkill = (skillToRemove) => {
    handleInputChange('skills', profileData.skills.filter(skill => skill !== skillToRemove));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: '',
      specialty: '',
      period: '',
      type: ''
    };
    handleInputChange('education', [...profileData.education, newEducation]);
    setIsEditing(true);
  };

  const updateEducation = (id, field, value) => {
    const updated = profileData.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    handleInputChange('education', updated);
  };

  const removeEducation = (id) => {
    handleInputChange('education', profileData.education.filter(edu => edu.id !== id));
  };

  const addWorkExperience = () => {
    const newWork = {
      id: Date.now(),
      company: '',
      position: '',
      period: '',
      description: ''
    };
    handleInputChange('workExperience', [...profileData.workExperience, newWork]);
    setIsEditing(true);
  };

  const updateWorkExperience = (id, field, value) => {
    const updated = profileData.workExperience.map(work => 
      work.id === id ? { ...work, [field]: value } : work
    );
    handleInputChange('workExperience', updated);
  };

  const removeWorkExperience = (id) => {
    handleInputChange('workExperience', profileData.workExperience.filter(work => work.id !== id));
  };

  const tabs = [
    { id: 'personal', name: 'Личные данные', icon: <User className="w-4 h-4" /> },
    { id: 'professional', name: 'Карьера', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'experience', name: 'Опыт работы', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', name: 'Настройки', icon: <FileText className="w-4 h-4" /> }
  ];

  const profileStats = [
    { label: 'Просмотры профиля', value: '234', trend: '+12%' },
    { label: 'Отклики на вакансии', value: '8', trend: '+3' },
    { label: 'Приглашения', value: '5', trend: '+2' },
    { label: 'Рейтинг', value: '4.8', trend: <Star className="w-4 h-4 text-yellow-400 fill-current" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-8">
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xl md:text-2xl">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black hover:bg-yellow-500 transition-colors">
                  <Camera className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-gray-300 text-sm md:text-base">{profileData.currentPosition}</p>
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
                  <Eye className="w-4 h-4 mr-2" />
                  Предпросмотр
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
                {profileStats.map((stat, index) => (
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

            {/* Profile Completion */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Заполненность профиля</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">85%</span>
                  <span className="text-yellow-400">Почти готово!</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-gray-400 text-xs">
                  Добавьте фото и еще 2 навыка для 100% заполнения
                </p>
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
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Личная информация</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Фамилия</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                      />
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">Дата рождения</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                        <input
                          type="date"
                          value={profileData.birthDate}
                          onChange={(e) => handleInputChange('birthDate', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">О себе</label>
                    <textarea
                      value={profileData.about}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 resize-none text-sm md:text-base"
                      placeholder="Расскажите о себе, своих качествах и достижениях..."
                    />
                  </div>
                </div>
              )}

              {/* Professional Information Tab */}
              {activeTab === 'professional' && (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Карьерная информация</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Текущая должность</label>
                      <input
                        type="text"
                        value={profileData.currentPosition}
                        onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Желаемая должность</label>
                      <input
                        type="text"
                        value={profileData.desiredPosition}
                        onChange={(e) => handleInputChange('desiredPosition', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Зарплата от (₸)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                        <input
                          type="number"
                          value={profileData.salaryFrom}
                          onChange={(e) => handleInputChange('salaryFrom', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Зарплата до (₸)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                        <input
                          type="number"
                          value={profileData.salaryTo}
                          onChange={(e) => handleInputChange('salaryTo', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Опыт работы (лет)</label>
                      <select
                        value={profileData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                      >
                        <option value="0">Без опыта</option>
                        <option value="1">1 год</option>
                        <option value="2">2 года</option>
                        <option value="3">3 года</option>
                        <option value="5">5+ лет</option>
                        <option value="10">10+ лет</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">График работы</label>
                      <select
                        value={profileData.workSchedule}
                        onChange={(e) => handleInputChange('workSchedule', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-60 text-sm md:text-base"
                      >
                        <option value="full-time">Полная занятость</option>
                        <option value="part-time">Неполная занятость</option>
                        <option value="remote">Удаленная работа</option>
                        <option value="flexible">Гибкий график</option>
                      </select>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-300">Навыки</label>
                      {isEditing && (
                        <button
                          onClick={() => setShowSkillInput(!showSkillInput)}
                          className="flex items-center text-yellow-400 hover:text-yellow-300 text-sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Добавить навык
                        </button>
                      )}
                    </div>
                    
                    {showSkillInput && (
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          placeholder="Введите навык"
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                        />
                        <button
                          onClick={addSkill}
                          className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors text-sm"
                        >
                          Добавить
                        </button>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-sm"
                        >
                          <span>{skill}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-yellow-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-semibold text-white">Опыт работы и образование</h2>
                  </div>

                  {/* Work Experience */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Опыт работы</h3>
                      {isEditing && (
                        <button
                          onClick={addWorkExperience}
                          className="flex items-center text-yellow-400 hover:text-yellow-300 text-sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Добавить место работы
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {profileData.workExperience.map((work) => (
                        <div key={work.id} className="bg-white/5 border border-gray-700 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                              type="text"
                              value={work.company}
                              onChange={(e) => updateWorkExperience(work.id, 'company', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Название компании"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 text-sm"
                            />
                            <input
                              type="text"
                              value={work.position}
                              onChange={(e) => updateWorkExperience(work.id, 'position', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Должность"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 text-sm"
                            />
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <input
                              type="text"
                              value={work.period}
                              onChange={(e) => updateWorkExperience(work.id, 'period', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Период работы (например: 2020-2023)"
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 text-sm"
                            />
                            {isEditing && (
                              <button
                                onClick={() => removeWorkExperience(work.id)}
                                className="ml-3 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <textarea
                            value={work.description}
                            onChange={(e) => updateWorkExperience(work.id, 'description', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Описание обязанностей и достижений"
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 resize-none text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Образование</h3>
                      {isEditing && (
                        <button
                          onClick={addEducation}
                          className="flex items-center text-yellow-400 hover:text-yellow-300 text-sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Добавить образование
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {profileData.education.map((edu) => (
                        <div key={edu.id} className="bg-white/5 border border-gray-700 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Учебное заведение"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 text-sm"
                            />
                            <input
                              type="text"
                              value={edu.specialty}
                              onChange={(e) => updateEducation(edu.id, 'specialty', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Специальность"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={edu.period}
                              onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Годы обучения (например: 2010-2013)"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 text-sm"
                            />
                            <div className="flex items-center">
                              <select
                                value={edu.type}
                                onChange={(e) => updateEducation(edu.id, 'type', e.target.value)}
                                disabled={!isEditing}
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 text-sm"
                              >
                                <option value="">Выберите тип образования</option>
                                <option value="Среднее">Среднее</option>
                                <option value="Среднее специальное">Среднее специальное</option>
                                <option value="Высшее">Высшее</option>
                                <option value="Магистратура">Магистратура</option>
                                <option value="Докторантура">Докторантура</option>
                              </select>
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Настройки профиля</h2>
                  
                  {/* Privacy Settings */}
                  <div className="bg-white/5 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Приватность</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Публичный профиль</p>
                          <p className="text-gray-400 text-sm">Ваш профиль будет виден работодателям</p>
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
                          <p className="text-gray-400 text-sm">Получать уведомления о новых вакансиях на email</p>
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
                          <p className="text-gray-400 text-sm">Получать SMS о срочных предложениях работы</p>
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
                    </div>
                  </div>

                  {/* Resume Actions */}
                  <div className="bg-white/5 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Действия с резюме</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex items-center justify-center px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all font-medium">
                        <Download className="w-4 h-4 mr-2" />
                        Скачать резюме PDF
                      </button>
                      <button className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
                        <Upload className="w-4 h-4 mr-2" />
                        Загрузить резюме
                      </button>
                      <button className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить профиль
                      </button>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="bg-white/5 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Информация об аккаунте</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Дата регистрации:</span>
                        <span className="text-white">15 марта 2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Последнее обновление:</span>
                        <span className="text-white">2 дня назад</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ID пользователя:</span>
                        <span className="text-white">#WP2023001234</span>
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

export default ProfileForm;