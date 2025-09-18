// src/pages/admin/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { getUser, updateUser, updateCandidateProfile, updateEmployerProfile } from "../../../components/api/UserService";
import { ArrowLeft, User, Building2, Mail, Phone, MapPin, Calendar, Star, Briefcase, Edit, Ban, CheckCircle, XCircle, Clock, TrendingUp, Users, Award, AlertTriangle, MessageSquare } from 'lucide-react';

const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);          // весь объект, который вернул API
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});    // для редактирования

  // безопасные геттеры
  const candidate = user?.candidate_profile || null;
  const company = user?.company || null;
  const jobs = user?.jobs || [];
  const activity = user?.activity || [];
  const stats = user?.stats || {};
  const violations = user?.violations || [];

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const data = await getUser(userId);
        setUser(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          city: data.city || "",
        });
      } catch (e) {
        console.error("Ошибка загрузки профиля:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      let updated;
      if (user.user_type === "candidate") {
        updated = await updateCandidateProfile(userId, formData);
        setUser(prev => ({ ...prev, candidate_profile: { ...(prev.candidate_profile || {}), ...updated } }));
      } else if (user.user_type === "employer") {
        updated = await updateEmployerProfile(userId, formData);
        setUser(prev => ({ ...prev, company: { ...(prev.company || {}), ...updated } }));
      } else {
        updated = await updateUser(userId, formData);
        setUser(prev => ({ ...prev, ...updated }));
      }
      setIsEditing(false);
    } catch (e) {
      console.error("Ошибка сохранения:", e);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case true:
      case "active":
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case false:
      case "blocked":
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (!userId) return <div className="p-6 text-red-400">❌ ID пользователя не передан</div>;
  if (loading) return <div className="p-6 text-white">Загрузка...</div>;
  if (!user) return <div className="p-6 text-red-400">❌ Пользователь не найден</div>;

  // быстрые вычисления для карточек статистики при отсутствии значений
  const computedStats = (() => {
    if (user.user_type === 'employer') {
      const activeJobs = jobs.filter(j => (j.status || 'active') === 'active').length;
      return {
        activeJobs: stats.activeJobs ?? activeJobs,
        totalJobs: stats.totalJobs ?? jobs.length,
        totalHires: stats.totalHires ?? 0,
        avgTimeToHire: stats.avgTimeToHire ?? 0,
        monthlySpent: stats.monthlySpent ?? 0,
      };
    } else if (user.user_type === 'candidate') {
      const apps = candidate?.applications?.length || 0;
      const views = candidate?.stats?.views_total || 0;
      return {
        activeJobs: 0,
        totalJobs: 0,
        totalHires: apps,  // условно показываем кол-во откликов
        avgTimeToHire: 0,
        monthlySpent: views, // просто показатель активности профиля
      };
    }
    return { activeJobs: 0, totalJobs: 0, totalHires: 0, avgTimeToHire: 0, monthlySpent: 0 };
  })();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => window.history.back()} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
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
          <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm">
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
              {user.name?.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.is_active)}`}>
                {user.is_active ? 'Активен' : 'Заблокирован'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-300 text-sm">
                  <Mail className="w-4 h-4 mr-3 text-gray-500" />
                  {user.email}
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Phone className="w-4 h-4 mr-3 text-gray-500" />
                  {user.phone || '—'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                  {user.city || '—'}
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                  Регистрация: {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                </div>
              </div>
            </div>
            
            {company && (
              <div className="bg-white/5 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Building2 className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                </div>
                <p className="text-gray-300 text-sm mb-2">{company.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span>{company.industry}</span>
                  <span>{company.size}</span>
                  {company.website && (
                    <a href={company.website} className="text-yellow-400 hover:text-yellow-300" target="_blank" rel="noreferrer">
                      {company.website}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="text-right space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-xl font-bold text-white">{(stats.candidateRating || 0).toFixed ? (stats.candidateRating || 0).toFixed(1) : (stats.candidateRating || 0)}</span>
            </div>
            <p className="text-gray-400 text-sm">Рейтинг</p>
            {/* Можно вывести lastActivity, если начнёшь его считать на бэке */}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{computedStats.activeJobs}</span>
          </div>
          <p className="text-sm text-gray-400">Активных вакансий</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{computedStats.totalHires}</span>
          </div>
          <p className="text-sm text-gray-400">{user.user_type === 'employer' ? 'Всего наймов' : 'Откликов'}</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{computedStats.avgTimeToHire}</span>
          </div>
          <p className="text-sm text-gray-400">Дней до найма</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">
              {Number(computedStats.monthlySpent || 0).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-400">{user.user_type === 'employer' ? '₸ в месяц' : 'Просмотров профиля'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Обзор', icon: <User className="w-4 h-4" /> },
              { id: 'activity', label: 'Активность', icon: <Clock className="w-4 h-4" /> },
              { id: 'stats', label: 'Статистика', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'violations', label: 'Нарушения', icon: <AlertTriangle className="w-4 h-4" /> },
              { id: 'settings', label: 'Настройки', icon: <Edit className="w-4 h-4" /> }
            ].map(tab => (
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
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {user.user_type === 'candidate' && candidate && (
                <>
                  <h3 className="text-lg font-semibold text-white">Навыки</h3>
                  <ul className="flex flex-wrap gap-2">
                    {(candidate.skills || []).map((s, i) => (
                      <li key={i} className="px-3 py-1 bg-gray-700 rounded">{s.name || s}</li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-semibold text-white mt-6">Опыт работы</h3>
                  {(candidate.work_experience || []).map((exp, i) => (
                    <div key={i} className="p-3 bg-gray-800 rounded-lg text-gray-300">
                      <b>{exp.company_name}</b> — {exp.position} ({exp.period})
                    </div>
                  ))}

                  <h3 className="text-lg font-semibold text-white mt-6">Образование</h3>
                  {(candidate.education || []).map((edu, i) => (
                    <div key={i} className="p-3 bg-gray-800 rounded-lg text-gray-300">
                      <b>{edu.institution}</b> — {edu.degree} ({edu.period})
                    </div>
                  ))}
                </>
              )}

              {user.user_type === 'employer' && company && (
                <>
                  <h3 className="text-lg font-semibold text-white">Вакансии</h3>
                  {jobs.length ? jobs.map(job => (
                    <div key={job.id} className="p-3 bg-gray-800 rounded-lg text-gray-300 mb-2">
                      <b>{job.title}</b> — {job.employment_type || '—'} ({job.status || 'active'})
                    </div>
                  )) : <p className="text-gray-400">Нет активных вакансий</p>}
                </>
              )}
            </div>
          )}

          {/* Activity */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Недавняя активность</h3>
              {activity.length ? activity.map((a, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 bg-white/5 border border-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white">{a.title}</p>
                    {a.subtitle ? <p className="text-gray-400 text-sm">{a.subtitle}</p> : null}
                    <p className="text-gray-500 text-xs mt-1">{a.date ? new Date(a.date).toLocaleString() : ''}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    a.type === 'job_post' ? 'bg-blue-400/10 text-blue-400' :
                    a.type === 'application' ? 'bg-green-400/10 text-green-400' :
                    a.type === 'application_received' ? 'bg-purple-400/10 text-purple-400' :
                    'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {a.type}
                  </span>
                </div>
              )) : (
                <p className="text-gray-400">Пока нет активности</p>
              )}
            </div>
          )}

          {/* Stats */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Подробная статистика</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Эффективность</h4>
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {user.user_type === 'employer' ? `${Math.min(100, (computedStats.totalHires || 0) * 5)}%` : `${Math.min(100, (candidate?.applications?.length || 0) * 10)}%`}
                  </div>
                  <p className="text-gray-400 text-sm">условный показатель</p>
                </div>
                
                <div className="bg-white/5 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Отклики / Найм</h4>
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {user.user_type === 'employer' ? (computedStats.totalHires || 0) : (candidate?.applications?.length || 0)}
                  </div>
                  <p className="text-gray-400 text-sm">{user.user_type === 'employer' ? 'наймов всего' : 'откликов всего'}</p>
                </div>
                
                <div className="bg-white/5 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Просмотры профиля</h4>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {candidate?.stats?.views_total || 0}
                  </div>
                  <p className="text-gray-400 text-sm">всего просмотров</p>
                </div>
              </div>
            </div>
          )}

          {/* Violations */}
          {activeTab === 'violations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Нарушения и жалобы</h3>
              {violations.length ? violations.map((v, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 bg-white/5 border border-gray-700 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-1 ${v.type === 'warning' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.type === 'warning' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-400/10 text-red-400'}`}>
                        {v.type === 'warning' ? 'Предупреждение' : 'Жалоба'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${v.status === 'resolved' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                        {v.status === 'resolved' ? 'Решено' : 'В обработке'}
                      </span>
                    </div>
                    <p className="text-white">{v.description}</p>
                    <p className="text-gray-400 text-sm">{v.date ? new Date(v.date).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">Нарушений не найдено</h4>
                  <p className="text-gray-400">Пользователь соблюдает правила платформы</p>
                </div>
              )}
            </div>
          )}

          {/* Settings (с подписями к полям) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Управление аккаунтом</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Редактирование профиля</h4>
                  <div className="space-y-3">
                    <label className="block text-sm text-gray-400">
                      Имя
                      <input name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <label className="block text-sm text-gray-400">
                      Телефон
                      <input name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <label className="block text-sm text-gray-400">
                      Город
                      <input name="city" value={formData.city} onChange={handleChange} className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <div className="flex justify-end">
                      <button onClick={handleSave} className="px-4 py-2 bg-green-600 rounded-lg flex items-center text-white">
                        <CheckCircle className="w-4 h-4 mr-2" /> Сохранить
                      </button>
                    </div>
                  </div>
                </div>

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
              </div>

              {/* Заметки админа оставил без изменений стиля */}
              <div>
                <h4 className="text-white font-medium mb-4">Заметки администратора</h4>
                <textarea className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none" placeholder="Добавьте заметки о пользователе..."></textarea>
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
