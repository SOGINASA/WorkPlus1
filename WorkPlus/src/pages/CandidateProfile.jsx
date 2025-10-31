// src/pages/CandidateProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import * as CandidateService from "../components/api/CandidateService";
import { getUserFromStorage } from "../components/api/AuthUtils";
import { 
  User, Building, Mail, Phone, MapPin, Briefcase, Camera, 
  Edit3, Save, X, Plus, Trash2, Award, Calendar, DollarSign,
  Star, Filter, FileText, Download, Globe, TrendingUp, BookOpen, MessageSquare
} from 'lucide-react';

// ——— helpers ———
const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0]?.[0] || "";
  const last = parts[1]?.[0] || "";
  return (first + last).toUpperCase();
};

const fmtDate = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('ru-RU');
  } catch {
    return iso;
  }
};

const statusBadge = (status) => {
  switch (status) {
    case "new":
      return "bg-yellow-400/10 text-yellow-400 border-yellow-400/30";
    case "approved":
      return "bg-green-400/10 text-green-400 border-green-400/30";
    case "rejected":
      return "bg-red-400/10 text-red-400 border-red-400/30";
    case "interview":
      return "bg-blue-400/10 text-blue-400 border-blue-400/30";
    case "viewed":
      return "bg-purple-400/10 text-purple-400 border-purple-400/30";
    case "hired":
      return "bg-green-400/10 text-green-400 border-green-400/30";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/30";
  }
};

const statusText = (status) => {
  switch (status) {
    case "new":
      return "Рассматривается";
    case "approved":
      return "Одобрено";
    case "rejected":
      return "Отклонено";
    case "interview":
      return "Собеседование";
    case "viewed":
      return "Просмотрено";
    case "hired":
      return "Вы приняты";
    default:
      return "Статус не указан";
  }
};

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  city: "",
  birthDate: "",
  avatar: null,
  currentPosition: "",
  desiredPosition: "",
  salary_from: "",
  salary_to: "",
  experience_years: "",
  workSchedule: "full-time",
  skills: [],
  education: [],
  workExperience: [],
  about: "",
  isPublic: true,
  emailNotifications: true,
  smsNotifications: false,
  jobAlerts: true,
  telegram_username: "",
  portfolio_url: "",
};

export default function CandidateProfile() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState(emptyProfile);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [myApplications, setMyApplications] = useState([]);
  const [appsPagination, setAppsPagination] = useState(null);
  const [appsFilter, setAppsFilter] = useState("");

  const [activeTab, setActiveTab] = useState('personal');

  const initials = useMemo(() => getInitials(profileData.name), [profileData.name]);

  // --------- LOAD DATA ----------
  const loadApplications = async (page = 1, perPage = 20, status = appsFilter) => {
    const appsRes = await CandidateService.getApplications({ page, perPage, status });
    const apps = (appsRes.applications || []).map((a) => ({
      id: a.id,
      vacancyTitle: a.vacancy_title,
      companyName: a.company_name,
      appliedDate: a.applied_date,
      status: a.status,
      salary: a.salary,
      location: a.location,
      response: a.response,
      responseDate: a.response_date,
      companyLogo: a.company_logo || null,
      priority: a.priority || null,
      jobId: a.job_id,
    }));
    setMyApplications(apps);
    setAppsPagination(appsRes.pagination || null);
  };

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await CandidateService.getProfile();
      console.log("profile loaded:", profile);

      setProfileData((prev) => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        city: profile.city || "",
        birthDate: profile.birth_date || "",
        avatar: profile.avatar || null,
        currentPosition: profile.current_position || "",
        desiredPosition: profile.desired_position || "",
        salary_from: profile.salary_from ?? "",
        salary_to: profile.salary_to ?? "",
        experience_years: profile.experience_years ?? "",
        workSchedule: profile.work_schedule || "full-time",
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        education: Array.isArray(profile.education) ? profile.education : [],
        workExperience: Array.isArray(profile.work_experience) ? profile.work_experience : [],
        about: profile.about || "",
        isPublic: profile.is_public !== false,
        emailNotifications: profile.email_notifications !== false,
        smsNotifications: !!profile.sms_notifications,
        jobAlerts: profile.job_alerts !== false,
        telegram_username: profile.telegram_username || "",
        portfolio_url: profile.portfolio_url || "",
      }));

      await loadApplications(1, 20, appsFilter);
    } catch (e) {
      setError(e?.message || "Не удалось загрузить данные профиля");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await loadApplications(1, 20, appsFilter);
      } catch (e) {
        setError(e?.message || "Не удалось загрузить отклики");
      }
    })();
  }, [appsFilter]);

  // ---------- EDIT / SAVE ----------
  const startEditing = () => {
    setOriginalData({ ...profileData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalData) {
      setProfileData({ ...originalData });
    }
    setIsEditing(false);
    setOriginalData(null);
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        city: profileData.city,
        birth_date: profileData.birthDate || null,
        current_position: profileData.currentPosition,
        desired_position: profileData.desiredPosition,
        salary_from: profileData.salary_from ? Number(profileData.salary_from) : null,
        salary_to: profileData.salary_to ? Number(profileData.salary_to) : null,
        experience_years: profileData.experience_years ? Number(profileData.experience_years) : null,
        work_schedule: profileData.workSchedule,
        skills: profileData.skills,
        education: profileData.education,
        work_experience: profileData.workExperience,
        about: profileData.about,
        is_public: !!profileData.isPublic,
        email_notifications: !!profileData.emailNotifications,
        sms_notifications: !!profileData.smsNotifications,
        job_alerts: !!profileData.jobAlerts,
        telegram_username: profileData.telegram_username,
        portfolio_url: profileData.portfolio_url,
      };

      await CandidateService.updateProfile(payload);
      setIsEditing(false);
      setOriginalData(null);
      await loadAll();
    } catch (e) {
      setError(e?.message || "Не удалось сохранить профиль");
    } finally {
      setSaving(false);
    }
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
    const userId = getUserFromStorage().id;
    const profileUrl = `${window.location.origin}/candidate-profile/${userId}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      alert('Ссылка на профиль скопирована в буфер обмена');
    }).catch(() => {
      prompt('Скопируйте ссылку на профиль:', profileUrl);
    });
  };

  const withdrawApplication = async (applicationId) => {
    const application = myApplications.find((app) => app.id === applicationId);
    if (!application) return;
    if (!confirm(`Отозвать заявку на вакансию "${application.vacancyTitle}" в компании "${application.companyName}"?`)) return;
    try {
      await CandidateService.withdrawApplication(applicationId);
      setMyApplications((prev) => prev.filter((app) => app.id !== applicationId));
      alert("Заявка отозвана");
    } catch (e) {
      alert(e?.message || "Не удалось отозвать заявку");
    }
  };

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

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: '',
      specialty: '',
      start_year: '',
      end_year: '',
      degree: 'Высшее',
      is_current: false
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

  const addWorkExperience = () => {
    const newWork = {
      id: Date.now(),
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false
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

  const tabs = [
    { id: 'personal', name: 'Профиль', icon: <User className="w-4 h-4" /> },
    { id: 'applications', name: 'Мои отклики', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'settings', name: 'Настройки', icon: <FileText className="w-4 h-4" /> }
  ];

  const profileStats = [
    { label: 'Просмотры резюме', value: '234', trend: '+12%' },
    { label: 'Мои отклики', value: myApplications.length.toString(), trend: `+${myApplications.filter(app => app.status === 'new').length}` },
    { label: 'Рейтинг', value: '4.8', trend: <Star className="w-4 h-4 text-yellow-400 fill-current" /> }
  ];

  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pt-24">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mb-6 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-yellow-300">
            Загрузка профиля...
          </div>
        )}

        {/* Header with Profile Info */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-2xl p-6 md:p-8 shadow-2xl hover:border-yellow-400/30 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start mb-6 lg:mb-0">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-black font-bold text-2xl md:text-3xl overflow-hidden">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      initials
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
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-yellow-400/50 transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-black" />
                      </label>
                    </>
                  )}
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {profileData.name || 'Имя не указано'}
                  </h1>
                  {/* <p className="text-xl text-gray-300 mb-2">{profileData.currentPosition || 'Должность не указана'}</p> */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    {profileData.city && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-yellow-400" />
                        {profileData.city}
                      </div>
                    )}
                    {profileData.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-yellow-400" />
                        {profileData.email}
                      </div>
                    )}
                    {profileData.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-yellow-400" />
                        {profileData.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={startEditing}
                      className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-xl font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Редактировать
                    </button>
                    <button
                      onClick={shareProfile}
                      className="px-4 py-2.5 bg-white/10 border border-yellow-400/20 text-white rounded-xl font-medium hover:border-yellow-400/40 transition-all flex items-center"
                    >
                      <Globe className="w-4 h-4 mr-2 text-yellow-400" />
                      Поделиться
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-xl font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center disabled:opacity-60"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2.5 bg-white/10 border border-red-500/30 text-white rounded-xl font-medium hover:border-red-500/40 transition-all flex items-center"
                    >
                      <X className="w-4 h-4 mr-2 text-red-400" />
                      Отмена
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {profileStats.map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-yellow-400">{stat.value}</p>
                </div>
                <div className="text-green-400 text-sm flex items-center">
                  {typeof stat.trend === 'string' ? (
                    <>
                      <TrendingUp className="w-4 h-4 mr-1" />
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
        <div className="flex flex-wrap border-b border-yellow-400/20 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium flex items-center transition-all ${
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
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-yellow-400" />
                  </div>
                  <span className="text-white">
                    Личная информация
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">ФИО</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Иванов Иван Иванович"
                      />
                    ) : (
                      <p className="text-white text-lg font-medium">{profileData.name || '—'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="+7 (777) 123-45-67"
                      />
                    ) : (
                      <p className="text-white text-lg font-medium">{profileData.phone || '—'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Город</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Алматы"
                      />
                    ) : (
                      <p className="text-white text-lg font-medium">{profileData.city || '—'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Telegram</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="telegram_username"
                        value={profileData.telegram_username}
                        onChange={(e) => handleInputChange('telegram_username', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="@username"
                      />
                    ) : (
                      <p className="text-white text-lg font-medium">
                        {profileData.telegram_username ? `@${profileData.telegram_username.replace('@', '')}` : '—'}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Портфолио</label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="portfolio_url"
                        value={profileData.portfolio_url}
                        onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="https://myportfolio.com"
                      />
                    ) : (
                      <p className="text-white text-lg font-medium">
                        {profileData.portfolio_url ? (
                          <a href={profileData.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                            {profileData.portfolio_url}
                          </a>
                        ) : '—'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Опыт работы (лет)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="experience_years"
                        value={profileData.experience_years}
                        onChange={(e) => handleInputChange('experience_years', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="5"
                        min="0"
                      />
                    ) : (
                      <p className="text-white text-lg font-medium">
                        {profileData.experience_years ? `${profileData.experience_years} лет` : '—'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Желаемая зарплата</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="salary_to"
                        value={profileData.salary_to}
                        onChange={(e) => handleInputChange('salary_to', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="500000"
                      />
                    ) : (
                      <p className="text-green-400 text-lg font-medium">
                        {profileData.salary_to ? `${parseInt(profileData.salary_to).toLocaleString()} ₸` : '—'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold flex items-center">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-3">
                      <Award className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-white">
                      Навыки
                    </span>
                  </h3>
                  {isEditing && (
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-xl text-sm hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <div key={index} className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-2 flex items-center group hover:border-yellow-400/40 transition-all">
                        <span className="text-yellow-400 font-medium">{skill}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-3 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">Навыки не добавлены</p>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold flex items-center">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-3">
                      <BookOpen className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-white">
                      Образование
                    </span>
                  </h3>
                  {isEditing && (
                    <button
                      onClick={addEducation}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-xl text-sm hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {profileData.education && profileData.education.length > 0 ? (
                    profileData.education.map((edu) => (
                      <div key={edu.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-yellow-400/20 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {isEditing ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={edu.institution || ''}
                                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                  placeholder="Учебное заведение"
                                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <input
                                  type="text"
                                  value={edu.specialty || ''}
                                  onChange={(e) => updateEducation(edu.id, 'specialty', e.target.value)}
                                  placeholder="Специальность"
                                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  <input
                                    type="number"
                                    value={edu.start_year || ''}
                                    onChange={(e) => updateEducation(edu.id, 'start_year', e.target.value)}
                                    placeholder="Год начала"
                                    className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                  />
                                  <input
                                    type="number"
                                    value={edu.end_year || ''}
                                    onChange={(e) => updateEducation(edu.id, 'end_year', e.target.value)}
                                    placeholder="Год окончания"
                                    className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                  />
                                </div>
                                <select
                                  value={edu.degree || 'Высшее'}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                  <option value="Среднее">Среднее</option>
                                  <option value="Среднее специальное">Среднее специальное</option>
                                  <option value="Высшее">Высшее</option>
                                  <option value="Магистратура">Магистратура</option>
                                  <option value="Аспирантура">Аспирантура</option>
                                </select>
                              </div>
                            ) : (
                              <>
                                <h4 className="text-xl font-semibold text-white mb-2">{edu.institution || '—'}</h4>
                                <p className="text-gray-300 mb-3">{edu.specialty || '—'}</p>
                                <div className="flex items-center text-sm text-gray-400">
                                  <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                                  {edu.start_year || '—'} — {edu.end_year || 'наст. время'} • {edu.degree || '—'}
                                </div>
                              </>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => removeEducation(edu.id)}
                              className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">Образование не добавлено</p>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold flex items-center">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-3">
                      <Briefcase className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-white">
                      Опыт работы
                    </span>
                  </h3>
                  {isEditing && (
                    <button
                      onClick={addWorkExperience}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-xl text-sm hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {profileData.workExperience && profileData.workExperience.length > 0 ? (
                    profileData.workExperience.map((work) => (
                      <div key={work.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-yellow-400/20 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {isEditing ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={work.company || ''}
                                  onChange={(e) => updateWorkExperience(work.id, 'company', e.target.value)}
                                  placeholder="Компания"
                                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <input
                                  type="text"
                                  value={work.position || ''}
                                  onChange={(e) => updateWorkExperience(work.id, 'position', e.target.value)}
                                  placeholder="Должность"
                                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  <input
                                    type="date"
                                    value={work.start_date || ''}
                                    onChange={(e) => updateWorkExperience(work.id, 'start_date', e.target.value)}
                                    className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                  />
                                  <input
                                    type="date"
                                    value={work.end_date || ''}
                                    onChange={(e) => updateWorkExperience(work.id, 'end_date', e.target.value)}
                                    className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                  />
                                </div>
                                <textarea
                                  value={work.description || ''}
                                  onChange={(e) => updateWorkExperience(work.id, 'description', e.target.value)}
                                  placeholder="Описание обязанностей"
                                  rows={3}
                                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                              </div>
                            ) : (
                              <>
                                <h4 className="text-xl font-semibold text-white mb-2">{work.position || '—'}</h4>
                                <p className="text-gray-300 flex items-center mb-3">
                                  <Building className="w-4 h-4 mr-2 text-yellow-400" />
                                  {work.company || '—'}
                                </p>
                                <div className="flex items-center text-sm text-gray-400 mb-3">
                                  <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                                  {work.start_date ? fmtDate(work.start_date) : '—'} — {work.end_date ? fmtDate(work.end_date) : 'наст. время'}
                                </div>
                                {work.description && (
                                  <p className="text-gray-300 text-sm leading-relaxed">{work.description}</p>
                                )}
                              </>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => removeWorkExperience(work.id)}
                              className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">Опыт работы не добавлен</p>
                  )}
                </div>
              </div>

              {/* About */}
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
                <h3 className="text-2xl font-semibold mb-4 text-white">О себе</h3>
                {isEditing ? (
                  <textarea
                    value={profileData.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                    rows={4}
                    placeholder="Расскажите о себе, своих достижениях и целях"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                ) : (
                  <p className="text-gray-300 leading-relaxed">{profileData.about || 'Информация не заполнена'}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'applications' && (
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold mb-4 sm:mb-0">
                  <span className="text-white">
                    Мои отклики
                  </span>
                  <span className="text-gray-400"> ({myApplications.length})</span>
                </h3>
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-yellow-400" />
                  <select
                    value={appsFilter}
                    onChange={(e) => setAppsFilter(e.target.value)}
                    className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Все статусы</option>
                    <option value="new">Рассматривается</option>
                    <option value="interview">Собеседование</option>
                    <option value="approved">Одобрено</option>
                    <option value="rejected">Отклонено</option>
                    <option value="viewed">Просмотрено</option>
                    <option value="hired">Приняты</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {myApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-yellow-400" />
                    </div>
                    <p className="text-gray-400 text-lg">
                      {appsFilter ? `Нет откликов с статусом "${statusText(appsFilter)}"` : 'У вас пока нет откликов на вакансии'}
                    </p>
                  </div>
                ) : (
                  myApplications.map((application) => (
                    <div key={application.id} className="bg-white/5 border border-yellow-400/10 rounded-xl p-5 hover:border-yellow-400/30 transition-all group">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                                {application.vacancyTitle}
                              </h4>
                              <p className="text-gray-300 flex items-center mb-3">
                                <Building className="w-4 h-4 mr-2 text-yellow-400" />
                                {application.companyName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${statusBadge(application.status)}`}>
                                {statusText(application.status)}
                              </span>
                              {application.status === 'new' && (
                                <button
                                  onClick={() => withdrawApplication(application.id)}
                                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                  title="Отозвать заявку"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                            {application.salary && (
                              <span className="flex items-center px-3 py-1.5 bg-yellow-400/10 rounded-lg">
                                <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                                <span className="text-green-400 font-medium">{application.salary} ₸</span>
                              </span>
                            )}
                            {application.location && (
                              <span className="flex items-center px-3 py-1.5 bg-yellow-400/10 rounded-lg">
                                <MapPin className="w-4 h-4 mr-1 text-yellow-400" />
                                {application.location}
                              </span>
                            )}
                            <span className="flex items-center px-3 py-1.5 bg-yellow-400/10 rounded-lg">
                              <Calendar className="w-4 h-4 mr-1 text-yellow-400" />
                              {fmtDate(application.appliedDate)}
                            </span>
                          </div>

                          {application.response && (
                            <div className="bg-blue-400/10 border border-blue-400/20 rounded-xl p-4">
                              <div className="flex items-center mb-2">
                                <MessageSquare className="w-4 h-4 mr-2 text-blue-400" />
                                <span className="text-sm text-gray-300">
                                  Ответ от {fmtDate(application.responseDate)}
                                </span>
                              </div>
                              <p className="text-white text-sm leading-relaxed">{application.response}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {appsPagination && (appsPagination.has_prev || appsPagination.has_next) && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    disabled={!appsPagination.has_prev}
                    onClick={() => loadApplications(appsPagination.page - 1, 20, appsFilter)}
                    className="px-4 py-2 bg-white/10 border border-yellow-400/20 text-white rounded-xl font-medium hover:border-yellow-400/40 transition-all disabled:opacity-50"
                  >
                    ← Назад
                  </button>
                  <div className="text-gray-400">
                    Стр. {appsPagination.page} из {appsPagination.pages}
                  </div>
                  <button
                    disabled={!appsPagination.has_next}
                    onClick={() => loadApplications(appsPagination.page + 1, 20, appsFilter)}
                    className="px-4 py-2 bg-white/10 border border-yellow-400/20 text-white rounded-xl font-medium hover:border-yellow-400/40 transition-all disabled:opacity-50"
                  >
                    Вперёд →
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-6 text-white">
                Настройки профиля
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Приватность</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-5 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-yellow-400/20 transition-all">
                      <div>
                        <p className="text-white font-medium mb-1">Публичный профиль</p>
                        <p className="text-gray-400 text-sm">Разрешить работодателям находить моё резюме</p>
                      </div>
                      <button
                        onClick={() => handleInputChange('isPublic', !profileData.isPublic)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          profileData.isPublic ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
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
                    <div className="flex items-center justify-between p-5 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-yellow-400/20 transition-all">
                      <div>
                        <p className="text-white font-medium mb-1">Email уведомления</p>
                        <p className="text-gray-400 text-sm">Получать уведомления на email</p>
                      </div>
                      <button
                        onClick={() => handleInputChange('emailNotifications', !profileData.emailNotifications)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          profileData.emailNotifications ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            profileData.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-yellow-400/20 transition-all">
                      <div>
                        <p className="text-white font-medium mb-1">SMS уведомления</p>
                        <p className="text-gray-400 text-sm">Получать уведомления по SMS</p>
                      </div>
                      <button
                        onClick={() => handleInputChange('smsNotifications', !profileData.smsNotifications)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          profileData.smsNotifications ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            profileData.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-yellow-400/20 transition-all">
                      <div>
                        <p className="text-white font-medium mb-1">Уведомления о вакансиях</p>
                        <p className="text-gray-400 text-sm">Получать подходящие вакансии</p>
                      </div>
                      <button
                        onClick={() => handleInputChange('jobAlerts', !profileData.jobAlerts)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          profileData.jobAlerts ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            profileData.jobAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-yellow-400/20 pt-6">
                  <h4 className="text-lg font-medium text-white mb-4">Действия с аккаунтом</h4>
                  <button 
                    onClick={() => {
                      if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
                        alert('Функция удаления аккаунта будет реализована в следующих версиях');
                      }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить аккаунт
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}