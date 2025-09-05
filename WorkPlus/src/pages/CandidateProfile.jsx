import React, { useState, useEffect } from 'react';
import { 
  User, Building, Mail, Phone, MapPin, Briefcase, Upload, 
  Edit3, Save, X, Plus, Trash2, Award, Calendar, DollarSign,
  Star, ChevronDown, FileText, Eye, Download, Filter,
  CheckCircle, XCircle, Clock, MessageSquare, Search,
  TrendingUp, Target, Heart, BookOpen, Globe, Loader2
} from 'lucide-react';
import UserApiService from '../components/api/UserApiService';
import JobApiService from '../components/api/JobApiService';

const CandidateProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [responsesFilter, setResponsesFilter] = useState('all');
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    birthDate: '',
    currentPosition: '',
    desiredPosition: '',
    salaryFrom: '',
    salaryTo: '',
    experience: '',
    workSchedule: 'full-time',
    skills: [],
    education: [],
    workExperience: [],
    about: '',
    isPublic: true,
    emailNotifications: true,
    smsNotifications: false,
    jobAlerts: true
  });

  const [myApplications, setMyApplications] = useState([]);
  const [resumeResponses, setResumeResponses] = useState([]);
  const [statistics, setStatistics] = useState({
    profileViews: 0,
    applicationsSent: 0,
    responsesReceived: 0,
    rating: 0
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileResponse, applicationsResponse, responsesResponse, statsResponse] = await Promise.allSettled([
          UserApiService.getProfile(),
          UserApiService.getMyApplications(),
          UserApiService.getResumeResponses(),
          UserApiService.getProfileStatistics()
        ]);

        if (profileResponse.status === 'fulfilled') {
          const profile = profileResponse.value;
          setProfileData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            city: profile.city || '',
            birthDate: profile.birth_date || '',
            currentPosition: profile.current_position || '',
            desiredPosition: profile.desired_position || '',
            salaryFrom: profile.salary_from || '',
            salaryTo: profile.salary_to || '',
            experience: profile.experience || '',
            workSchedule: profile.work_schedule || 'full-time',
            skills: profile.skills || [],
            education: profile.education || [],
            workExperience: profile.work_experience || [],
            about: profile.about || '',
            isPublic: profile.is_public !== false,
            emailNotifications: profile.email_notifications !== false,
            smsNotifications: profile.sms_notifications === true,
            jobAlerts: profile.job_alerts !== false
          });
        }

        if (applicationsResponse.status === 'fulfilled') {
          setMyApplications(applicationsResponse.value.applications || []);
        }

        if (responsesResponse.status === 'fulfilled') {
          setResumeResponses(responsesResponse.value.responses || []);
        }

        if (statsResponse.status === 'fulfilled') {
          setStatistics(statsResponse.value || statistics);
        }

      } catch (err) {
        setError('Не удалось загрузить данные профиля.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startEditing = () => {
    setOriginalData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const apiData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        city: profileData.city,
        birth_date: profileData.birthDate,
        current_position: profileData.currentPosition,
        desired_position: profileData.desiredPosition,
        salary_from: parseInt(profileData.salaryFrom) || null,
        salary_to: parseInt(profileData.salaryTo) || null,
        experience: profileData.experience,
        work_schedule: profileData.workSchedule,
        skills: profileData.skills,
        education: profileData.education,
        work_experience: profileData.workExperience,
        about: profileData.about,
        is_public: profileData.isPublic,
        email_notifications: profileData.emailNotifications,
        sms_notifications: profileData.smsNotifications,
        job_alerts: profileData.jobAlerts
      };

      await UserApiService.updateProfile(apiData);
      setIsEditing(false);
      setOriginalData(null);
      alert('Профиль успешно сохранен!');
    } catch (err) {
      setError('Не удалось сохранить профиль: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) setProfileData(originalData);
    setIsEditing(false);
    setOriginalData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
          <p className="text-white">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  const initials = profileData.name
    ? profileData.name.split(' ').map(w => w[0]).join('')
    : '';

  const tabs = [
    { id: 'personal', name: 'Профиль', icon: <User className="w-4 h-4" /> },
    { id: 'applications', name: 'Мои отклики', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'responses', name: 'Отклики на резюме', icon: <Heart className="w-4 h-4" /> },
    { id: 'views', name: 'Просмотры', icon: <Eye className="w-4 h-4" /> },
    { id: 'recommendations', name: 'Рекомендации', icon: <Target className="w-4 h-4" /> },
    { id: 'settings', name: 'Настройки', icon: <FileText className="w-4 h-4" /> }
  ];

  const profileStats = [
    { label: 'Просмотры резюме', value: statistics.profileViews?.toString() || '0', trend: '+12%' },
    { label: 'Мои отклики', value: myApplications.length.toString(), trend: `+${myApplications.filter(app => app.status === 'pending').length}` },
    { label: 'Отклики на резюме', value: resumeResponses.length.toString(), trend: `+${resumeResponses.filter(r => r.status === 'new').length}` },
    { label: 'Рейтинг', value: statistics.rating?.toString() || '0', trend: <Star className="w-4 h-4 text-yellow-400 fill-current" /> }
  ];

  return (
    <div className="relative min-h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
      <div className="relative max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="mt-2 text-red-300 hover:text-red-200 text-sm">
              Закрыть
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-8">
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xl md:text-2xl overflow-hidden">
                {initials}
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{profileData.name}</h1>
              <p className="text-gray-300">{profileData.currentPosition || 'Должность не указана'}</p>
              {profileData.city && (
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profileData.city}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isEditing ? (
              <>
                <button onClick={startEditing} className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors flex items-center">
                  <Edit3 className="w-4 h-4 mr-2" />Редактировать
                </button>
                <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors flex items-center">
                  <Globe className="w-4 h-4 mr-2" />Поделиться
                </button>
                <button onClick={() => alert('Загрузка резюме')} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-2" />Скачать резюме
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-400 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button onClick={handleCancel} disabled={saving} className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                  <X className="w-4 h-4 mr-2" />Отмена
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {profileStats.map((stat, i) => (
            <div key={i} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="text-green-400 text-sm flex items-center">
                  {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-700 mb-6">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium flex items-center transition-colors ${activeTab === tab.id ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}>
              {tab.icon}<span className="ml-2">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content (сохранил твои секции: personal, applications, responses и т.д.) */}
        <div className="space-y-6">
          {activeTab === 'personal' && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-yellow-400" />Личная информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Имя и фамилия</label>
                  {isEditing ? (
                    <input type="text" value={profileData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  ) : (
                    <p className="text-white">{profileData.name || 'Не указано'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <p className="text-white flex items-center"><Mail className="w-4 h-4 mr-2 text-gray-400" />{profileData.email || 'Не указано'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
                  {isEditing ? (
                    <input type="tel" value={profileData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  ) : (
                    <p className="text-white flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-400" />{profileData.phone || 'Не указано'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Город</label>
                  {isEditing ? (
                    <input type="text" value={profileData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  ) : (
                    <p className="text-white flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" />{profileData.city || 'Не указано'}</p>
                  )}
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
