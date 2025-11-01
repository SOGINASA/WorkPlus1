// src/pages/ApplicationsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Building, MapPin, DollarSign, Calendar, Clock, 
  Search, Filter, Eye, MessageSquare, X, CheckCircle, 
  AlertCircle, FileText, Users, TrendingUp, Star,
  ChevronLeft, ChevronRight, Award, Settings
} from 'lucide-react';
import * as CandidateService from '../components/api/CandidateService';

// ==================== HELPERS ====================
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
    case "pending":
      return "bg-yellow-400/10 text-yellow-400 border-yellow-400/30";
    case "approved":
    case "accepted":
    case "hired":
      return "bg-green-400/10 text-green-400 border-green-400/30";
    case "rejected":
      return "bg-red-400/10 text-red-400 border-red-400/30";
    case "interview":
      return "bg-blue-400/10 text-blue-400 border-blue-400/30";
    case "viewed":
      return "bg-purple-400/10 text-purple-400 border-purple-400/30";
    case "withdrawn":
      return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/30";
  }
};

const statusText = (status) => {
  switch (status) {
    case "new":
    case "pending":
      return "Рассматривается";
    case "approved":
    case "accepted":
      return "Одобрено";
    case "rejected":
      return "Отклонено";
    case "interview":
      return "Собеседование";
    case "viewed":
      return "Просмотрено";
    case "hired":
      return "Вы приняты";
    case "withdrawn":
      return "Отозван";
    default:
      return "Статус не указан";
  }
};

const ApplicationsDashboard = () => {
  // ==================== STATE ====================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Мои отклики на вакансии
  const [myApplications, setMyApplications] = useState([]);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [applicationsPagination, setApplicationsPagination] = useState(null);

  // ==================== ЗАГРУЗКА ДАННЫХ ====================
  useEffect(() => {
    loadMyApplications();
  }, [activeTab, applicationsPage]);

  const loadMyApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const appsRes = await CandidateService.getApplications({
        page: applicationsPage,
        perPage: 20,
        status: activeTab !== 'all' ? activeTab : undefined
      });

      // Маппинг полей из API
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
      setApplicationsPagination(appsRes.pagination || null);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  // ==================== ОБРАБОТЧИКИ ====================
  const handleWithdrawApplication = async (applicationId) => {
    if (!confirm('Вы уверены, что хотите отозвать отклик?')) return;

    try {
      await CandidateService.withdrawApplication(applicationId);
      await loadMyApplications();
    } catch (err) {
      alert(err.message || 'Ошибка при отзыве отклика');
    }
  };

  // ==================== СТАТИСТИКА ====================
  const stats = {
    total: myApplications.length,
    new: myApplications.filter(a => a.status === 'new').length,
    interview: myApplications.filter(a => a.status === 'interview').length,
    accepted: myApplications.filter(a => a.status === 'approved' || a.status === 'hired').length,
  };

  // ==================== ФИЛЬТРАЦИЯ ====================
  const filteredApplications = myApplications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  // ==================== РЕНДЕР ====================
  if (loading && myApplications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error && myApplications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white text-center mb-2">Ошибка</h3>
          <p className="text-gray-400 text-center">{error}</p>
          <button 
            onClick={loadMyApplications}
            className="mt-4 w-full px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section with gradient background */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Мои отклики</h1>
              <p className="text-gray-300">Отслеживайте статус своих откликов на вакансии</p>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              <button 
                onClick={() => window.location.href = '/jobs'}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
              >
                <Search className="w-4 h-4 mr-2" />
                Найти вакансии
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-400/20 border border-yellow-400/30 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-2xl font-bold text-yellow-400">{stats.total}</span>
              </div>
              <h3 className="text-white font-medium">Всего откликов</h3>
              <p className="text-gray-400 text-sm">За все время</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-400/20 border border-blue-400/30 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-400">{stats.new}</span>
              </div>
              <h3 className="text-white font-medium">На рассмотрении</h3>
              <p className="text-gray-400 text-sm">Ожидают ответа</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-400/20 border border-purple-400/30 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-400">{stats.interview}</span>
              </div>
              <h3 className="text-white font-medium">Собеседования</h3>
              <p className="text-gray-400 text-sm">Приглашены на интервью</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-400/20 border border-green-400/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-400">{stats.accepted}</span>
              </div>
              <h3 className="text-white font-medium">Одобрено</h3>
              <p className="text-gray-400 text-sm">Успешные отклики</p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'Все', count: myApplications.length },
              { key: 'new', label: 'Рассматривается', count: myApplications.filter(a => a.status === 'new').length },
              { key: 'viewed', label: 'Просмотрено', count: myApplications.filter(a => a.status === 'viewed').length },
              { key: 'interview', label: 'Собеседование', count: myApplications.filter(a => a.status === 'interview').length },
              { key: 'approved', label: 'Одобрено', count: myApplications.filter(a => a.status === 'approved').length },
              { key: 'rejected', label: 'Отклонено', count: myApplications.filter(a => a.status === 'rejected').length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setApplicationsPage(1);
                }}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-yellow-400 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-yellow-400/20 border border-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Откликов не найдено</h3>
              <p className="text-gray-400 mb-6">
                {activeTab !== 'all'
                  ? `Нет откликов с таким статусом`
                  : 'Начните откликаться на вакансии, чтобы они появились здесь'}
              </p>
              <a
                href="/jobs"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
              >
                <Search className="w-5 h-5 mr-2" />
                Найти вакансии
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all group"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                      {/* Левая часть - Информация о вакансии */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
                                {application.vacancyTitle}
                              </h3>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                              <span className="flex items-center gap-1">
                                <Building className="w-4 h-4 text-yellow-400" />
                                <span className="text-gray-300">{application.companyName}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${statusBadge(application.status)}`}>
                              <CheckCircle className="w-3 h-3 inline-block mr-1" />
                              {statusText(application.status)}
                            </span>
                          </div>
                        </div>

                        {/* Детали */}
                        <div className="space-y-2 mb-4">
                          <div className="flex flex-wrap gap-4 text-sm">
                            {application.salary && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 font-medium">{application.salary} ₸</span>
                              </div>
                            )}
                            {application.location && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-gray-300">
                                <MapPin className="w-4 h-4 text-yellow-400" />
                                {application.location}
                              </div>
                            )}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-gray-300">
                              <Calendar className="w-4 h-4 text-yellow-400" />
                              {fmtDate(application.appliedDate)}
                            </div>
                          </div>
                        </div>

                        {/* Ответ работодателя */}
                        {application.response && (
                          <div className="bg-blue-400/10 border border-blue-400/20 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <MessageSquare className="w-4 h-4 mr-2 text-blue-400" />
                              <span className="text-sm text-gray-300">
                                Ответ от {fmtDate(application.responseDate)}
                              </span>
                            </div>
                            <p className="text-white text-sm">{application.response}</p>
                          </div>
                        )}
                      </div>

                      {/* Правая часть - Действия */}
                      {application.status === 'new' && (
                        <div className="mt-4 lg:mt-0 lg:ml-6">
                          <button
                            onClick={() => handleWithdrawApplication(application.id)}
                            className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm flex items-center"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Отозвать
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Пагинация */}
          {applicationsPagination && applicationsPagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setApplicationsPage(p => Math.max(1, p - 1))}
                disabled={!applicationsPagination.has_prev}
                className="px-4 py-2 bg-white/5 border border-yellow-400/20 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-gray-300 px-4">
                Страница {applicationsPage} из {applicationsPagination.pages}
              </span>

              <button
                onClick={() => setApplicationsPage(p => p + 1)}
                disabled={!applicationsPagination.has_next}
                className="px-4 py-2 bg-white/5 border border-yellow-400/20 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ApplicationsDashboard;