import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import {
  getUser,
  updateUser,
  updateCandidateProfile,
  updateEmployerProfile,
} from "../../../components/api/UserService";
import {
  ArrowLeft, User, Building2, Mail, Phone, MapPin, Calendar,
  Briefcase, Edit, Ban, CheckCircle, Clock, TrendingUp, Users, Award,
  AlertTriangle
} from 'lucide-react';

const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // формы
  const [baseForm, setBaseForm] = useState({ name: "", phone: "", city: "" });
  const [candForm, setCandForm] = useState({ desired_position: "", salary_from: "", salary_to: "", about: "" });
  const [compForm, setCompForm] = useState({ name: "", description: "", industry: "", size: "", website: "", phone: "", email: "", city: "" });

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getUser(userId);
        console.log(data);
        setUser(data);

        setBaseForm({
          name: data.name || "",
          phone: data.phone || "",
          city: data.city || "",
        });

        if (data.user_type === "candidate") {
          const c = data.candidate_profile || {};
          setCandForm({
            desired_position: c.desired_position || "",
            salary_from: c.salary_from || "",
            salary_to: c.salary_to || "",
            about: c.about || "",
          });
        }

        if (data.user_type === "employer") {
          const comp = data.company || {};
          setCompForm({
            name: comp.name || "",
            description: comp.description || "",
            industry: comp.industry || "",
            size: comp.size || "",
            website: comp.website || "",
            phone: data.phone || "",
            email: data.email || "",
            city: data.city || "",
          });
        }
      } catch (e) {
        console.error("Ошибка загрузки профиля:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const toggleStatus = async () => {
    try {
      const next = user.is_active ? "blocked" : "active";
      // можно вызывать профильный /status, но используем уже существующий updateUser
      const updated = await updateUser(user.id, { status: next });
      setUser(prev => ({ ...prev, is_active: (next === "active") }));
    } catch (e) {
      console.error("Ошибка смены статуса:", e);
    }
  };

  const saveBase = async () => {
    try {
      const updated = await updateUser(user.id, baseForm);
      setUser(prev => ({ ...prev, ...updated }));
    } catch (e) {
      console.error("Ошибка сохранения базовых данных:", e);
    }
  };

  const saveCandidate = async () => {
    try {
      const updated = await updateCandidateProfile(user.id, candForm);
      setUser(prev => ({ ...prev, candidate_profile: { ...(prev.candidate_profile || {}), ...updated } }));
    } catch (e) {
      console.error("Ошибка сохранения кандидата:", e);
    }
  };

  const saveEmployer = async () => {
    try {
      const updated = await updateEmployerProfile(user.id, compForm);
      setUser(prev => ({ ...prev, company: { ...(prev.company || {}), ...updated }, ...{
        phone: compForm.phone, email: compForm.email, city: compForm.city
      }}));
    } catch (e) {
      console.error("Ошибка сохранения работодателя:", e);
    }
  };

  const getStatusBadge = (isActive) =>
    `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${isActive
      ? 'text-green-400 bg-green-400/10 border-green-400/20'
      : 'text-red-400 bg-red-400/10 border-red-400/20'}`;

  if (!userId) return <div className="p-6 text-red-400">❌ ID пользователя не передан</div>;
  if (loading) return <div className="p-6 text-white">Загрузка...</div>;
  if (!user) return <div className="p-6 text-red-400">❌ Пользователь не найден</div>;

  const company = user.company || {};
  const jobs = user.jobs || [];
  const stats = user.stats || {};
  const activity = user.activity || [];
  const violations = user.violations || []; // пока пусто

  const computedStats = (() => {
    if (user.user_type === 'employer') {
      const activeJobs = jobs.filter(j => (j.status || 'active') === 'active').length;
      return {
        activeJobs: stats.activeJobs ?? activeJobs,
        totalJobs: stats.totalJobs ?? jobs.length,
        totalHires: stats.applicationsReceived ?? 0,
        avgTimeToHire: 0,
        monthlySpent: 0,
      };
    } else if (user.user_type === 'candidate') {
      return { activeJobs: 0, totalJobs: 0, totalHires: stats.applications_last_30d || 0, avgTimeToHire: 0, monthlySpent: 0 };
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
          <button
            onClick={toggleStatus}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all text-sm
              ${user.is_active ? 'bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30'
                               : 'bg-green-600/20 border border-green-600/40 text-green-400 hover:bg-green-600/30'}`}
          >
            <Ban className="w-4 h-4 mr-2" />
            {user.is_active ? 'Заблокировать' : 'Разблокировать'}
          </button>
          {/* кнопка редактирования убрана: редактирование ниже в табах */}
        </div>
      </div>

      {/* Profile header */}
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
              <span className={getStatusBadge(user.is_active)}>{user.is_active ? 'Активен' : 'Заблокирован'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-300 text-sm"><Mail className="w-4 h-4 mr-3 text-gray-500" />{user.email}</div>
                <div className="flex items-center text-gray-300 text-sm"><Phone className="w-4 h-4 mr-3 text-gray-500" />{user.phone || '—'}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-300 text-sm"><MapPin className="w-4 h-4 mr-3 text-gray-500" />{user.city || '—'}</div>
                <div className="flex items-center text-gray-300 text-sm"><Calendar className="w-4 h-4 mr-3 text-gray-500" />Регистрация: {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</div>
              </div>
            </div>

            {user.user_type === 'employer' && company && (
              <div className="bg-white/5 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Building2 className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                </div>
                <p className="text-gray-300 text-sm mb-2">{company.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span>{company.industry}</span>
                  <span>{company.size}</span>
                  {company.website && <a href={company.website} className="text-yellow-400 hover:text-yellow-300" target="_blank" rel="noreferrer">{company.website}</a>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2"><Briefcase className="w-8 h-8 text-blue-400" /><span className="text-2xl font-bold text-white">{computedStats.activeJobs}</span></div>
          <p className="text-sm text-gray-400">Активных вакансий</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2"><Users className="w-8 h-8 text-green-400" /><span className="text-2xl font-bold text-white">{computedStats.totalHires}</span></div>
          <p className="text-sm text-gray-400">{user.user_type === 'employer' ? 'Откликов получено' : 'Откликов отправлено'}</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2"><Clock className="w-8 h-8 text-purple-400" /><span className="text-2xl font-bold text-white">0</span></div>
          <p className="text-sm text-gray-400">Дней до найма (заглушка)</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2"><Award className="w-8 h-8 text-yellow-400" /><span className="text-2xl font-bold text-white">0</span></div>
          <p className="text-sm text-gray-400">{user.user_type === 'employer' ? '₸ в месяц (заглушка)' : 'Просмотров профиля'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Обзор' },
              { id: 'activity', label: 'Активность' },
              { id: 'settings', label: 'Настройки' },
              { id: 'violations', label: 'Нарушения' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id ? 'border-yellow-400 text-yellow-400'
                                       : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {user.user_type === 'candidate' && (
                <>
                  <h3 className="text-lg font-semibold text-white">Резюме</h3>
                  <p className="text-gray-400 text-sm">Краткие сведения о кандидате отображаются здесь.</p>
                </>
              )}
              {user.user_type === 'employer' && (
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
                  }`}>{a.type}</span>
                </div>
              )) : <p className="text-gray-400">Пока нет активности</p>}
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* БАЗОВЫЕ ПОЛЯ ПОЛЬЗОВАТЕЛЯ */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Базовые данные</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="text-sm text-gray-400">
                    Имя
                    <input name="name" value={baseForm.name} onChange={e=>setBaseForm(f=>({...f, name:e.target.value}))}
                      className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                  </label>
                  <label className="text-sm text-gray-400">
                    Телефон
                    <input name="phone" value={baseForm.phone} onChange={e=>setBaseForm(f=>({...f, phone:e.target.value}))}
                      className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                  </label>
                  <label className="text-sm text-gray-400">
                    Город
                    <input name="city" value={baseForm.city} onChange={e=>setBaseForm(f=>({...f, city:e.target.value}))}
                      className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                  </label>
                </div>
                <div className="flex justify-end">
                  <button onClick={saveBase} className="px-4 py-2 bg-green-600 rounded-lg flex items-center text-white">
                    <CheckCircle className="w-4 h-4 mr-2" /> Сохранить
                  </button>
                </div>
              </div>

              {/* КАНДИДАТ */}
              {user.user_type === 'candidate' && (
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Профиль кандидата</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <label className="text-sm text-gray-400">
                      Желаемая должность
                      <input value={candForm.desired_position} onChange={e=>setCandForm(f=>({...f, desired_position:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <label className="text-sm text-gray-400">
                      Зарплата от
                      <input type="number" value={candForm.salary_from} onChange={e=>setCandForm(f=>({...f, salary_from:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <label className="text-sm text-gray-400">
                      Зарплата до
                      <input type="number" value={candForm.salary_to} onChange={e=>setCandForm(f=>({...f, salary_to:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <label className="text-sm text-gray-400 md:col-span-4">
                      О себе
                      <textarea value={candForm.about} onChange={e=>setCandForm(f=>({...f, about:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white h-24" />
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={saveCandidate} className="px-4 py-2 bg-green-600 rounded-lg flex items-center text-white">
                      <CheckCircle className="w-4 h-4 mr-2" /> Сохранить профиль кандидата
                    </button>
                  </div>
                </div>
              )}

              {/* РАБОТОДАТЕЛЬ */}
              {user.user_type === 'employer' && (
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Данные компании и контакты</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="text-sm text-gray-400">
                      Название компании
                      <input value={compForm.name} onChange={e=>setCompForm(f=>({...f, name:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <label className="text-sm text-gray-400">
                      Отрасль
                      <input value={compForm.industry} onChange={e=>setCompForm(f=>({...f, industry:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <label className="text-sm text-gray-400 md:col-span-2">
                      Описание
                      <textarea value={compForm.description} onChange={e=>setCompForm(f=>({...f, description:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white h-20" />
                    </label>
                    <label className="text-sm text-gray-400">
                      Размер компании
                      <input value={compForm.size} onChange={e=>setCompForm(f=>({...f, size:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <label className="text-sm text-gray-400">
                      Сайт
                      <input value={compForm.website} onChange={e=>setCompForm(f=>({...f, website:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>

                    <label className="text-sm text-gray-400">
                      Email (контакт)
                      <input value={compForm.email} onChange={e=>setCompForm(f=>({...f, email:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <label className="text-sm text-gray-400">
                      Телефон (контакт)
                      <input value={compForm.phone} onChange={e=>setCompForm(f=>({...f, phone:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                    <label className="text-sm text-gray-400">
                      Город (владельца)
                      <input value={compForm.city} onChange={e=>setCompForm(f=>({...f, city:e.target.value}))}
                        className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={saveEmployer} className="px-4 py-2 bg-green-600 rounded-lg flex items-center text-white">
                      <CheckCircle className="w-4 h-4 mr-2" /> Сохранить данные компании
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Violations (пусто, без "заметок админа") */}
          {activeTab === 'violations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Нарушения и жалобы</h3>
              {violations.length
                ? <p className="text-gray-400">Здесь появятся жалобы/предупреждения.</p>
                : <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-white mb-2">Нарушений не найдено</h4>
                    <p className="text-gray-400">Пользователь соблюдает правила платформы</p>
                  </div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
