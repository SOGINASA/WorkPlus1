import React, { useState, useEffect } from 'react';
import { 
  Send, Eye, Trash2, Filter, Clock, Users, MapPin, 
  Calendar, Award, Briefcase, DollarSign, Building,
  CheckCircle, XCircle, AlertCircle, MessageSquare,
  TrendingUp, Search, RefreshCw, ExternalLink, X
} from 'lucide-react';
import * as CandidateService from '../components/api/CandidateApiService';

const ApplicationsDashboard = () => {
  // ========== STATE ==========
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState({
    profileViews: 0,
    applicationsSent: 0,
    responsesReceived: 0,
    rating: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    has_prev: false,
    has_next: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // ========== ЗАГРУЗКА ДАННЫХ ==========
  const loadApplications = async (page = 1, status = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await CandidateService.getApplications({
        page,
        perPage: 20,
        status: status === 'all' ? '' : status
      });

      setApplications(response.applications || []);
      setPagination(response.pagination || {
        page: 1,
        pages: 1,
        total: 0,
        has_prev: false,
        has_next: false
      });
    } catch (err) {
      setError(err.error || 'Не удалось загрузить отклики');
      console.error('Ошибка загрузки откликов:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await CandidateService.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    }
  };

  useEffect(() => {
    loadApplications(1, activeTab);
    loadStatistics();
  }, [activeTab]);

  // ========== ОБРАБОТЧИКИ ==========
  const handleWithdrawApplication = async () => {
    if (!selectedApplication) return;

    try {
      await CandidateService.withdrawApplication(selectedApplication.id);
      setShowWithdrawModal(false);
      setSelectedApplication(null);
      // Перезагружаем список
      await loadApplications(pagination.page, activeTab);
      await loadStatistics();
    } catch (err) {
      alert(err.error || 'Не удалось отозвать отклик');
    }
  };

  const handleRefresh = () => {
    loadApplications(pagination.page, activeTab);
    loadStatistics();
  };

  // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/30', label: 'На рассмотрении' },
      viewed: { bg: 'bg-purple-400/10', text: 'text-purple-400', border: 'border-purple-400/30', label: 'Просмотрено' },
      interview: { bg: 'bg-blue-400/10', text: 'text-blue-400', border: 'border-blue-400/30', label: 'Собеседование' },
      hired: { bg: 'bg-green-400/10', text: 'text-green-400', border: 'border-green-400/30', label: 'Приняты' },
      rejected: { bg: 'bg-red-400/10', text: 'text-red-400', border: 'border-red-400/30', label: 'Отклонено' },
      approved: { bg: 'bg-green-400/10', text: 'text-green-400', border: 'border-green-400/30', label: 'Одобрено' }
    };

    const config = statusConfig[status] || statusConfig.new;
    return (
      <span className={`px-3 py-1.5 rounded-lg border ${config.bg} ${config.text} ${config.border} text-sm font-medium`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Clock className="w-5 h-5" />;
      case 'viewed': return <Eye className="w-5 h-5" />;
      case 'interview': return <Users className="w-5 h-5" />;
      case 'hired': return <CheckCircle className="w-5 h-5" />;
      case 'rejected': return <XCircle className="w-5 h-5" />;
      case 'approved': return <CheckCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Фильтрация по поиску
  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      app.vacancyTitle?.toLowerCase().includes(query) ||
      app.companyName?.toLowerCase().includes(query) ||
      app.location?.toLowerCase().includes(query)
    );
  });

  // ========== ТАБЫ ==========
  const tabs = [
    { id: 'all', label: 'Все отклики', count: statistics.applicationsSent },
    { id: 'new', label: 'На рассмотрении', icon: <Clock className="w-4 h-4" /> },
    { id: 'viewed', label: 'Просмотрено', icon: <Eye className="w-4 h-4" /> },
    { id: 'interview', label: 'Собеседование', icon: <Users className="w-4 h-4" /> },
    { id: 'hired', label: 'Приняты', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'rejected', label: 'Отклонено', icon: <XCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Мои отклики</h1>
              <p className="text-gray-300">Отслеживайте статус ваших откликов на вакансии</p>
            </div>
            
            <button 
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-white/10 border border-gray-600 text-white rounded-lg hover:bg-white/15 transition-all mt-4 md:mt-0"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Всего откликов</span>
                <Send className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{statistics.applicationsSent}</div>
              <div className="flex items-center text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{statistics.responsesReceived} ответов
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6 hover:border-purple-400/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Просмотров профиля</span>
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{statistics.profileViews}</div>
              <div className="text-gray-400 text-sm">За весь период</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl p-6 hover:border-blue-400/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Получено ответов</span>
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{statistics.responsesReceived}</div>
              <div className="text-gray-400 text-sm">
                {statistics.applicationsSent > 0 
                  ? `${Math.round((statistics.responsesReceived / statistics.applicationsSent) * 100)}% откликов` 
                  : '0% откликов'}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-green-400/20 rounded-xl p-6 hover:border-green-400/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Средний балл</span>
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{statistics.rating.toFixed(1)}</div>
              <div className="text-gray-400 text-sm">Оценка HR-специалистов</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по вакансии, компании или городу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                    : 'bg-white/5 border border-gray-700 text-gray-300 hover:bg-white/10'
                }`}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-black/20' : 'bg-yellow-400/20 text-yellow-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Applications List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Загрузка откликов...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-12 text-center">
                <Send className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Откликов пока нет</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery 
                    ? 'По вашему запросу ничего не найдено'
                    : 'Начните откликаться на вакансии, и они появятся здесь'
                  }
                </p>
                <a
                  href="/jobs"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Найти вакансии
                </a>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Company Logo + Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Company Logo */}
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-yellow-400/20">
                        {application.companyLogo ? (
                          <img 
                            src={application.companyLogo} 
                            alt={application.companyName}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <Building className="w-8 h-8 text-yellow-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-1 hover:text-yellow-400 transition-colors">
                              <a href={`/jobs/${application.jobId}`} className="flex items-center gap-2">
                                {application.vacancyTitle}
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </h3>
                            <p className="text-gray-400 flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              {application.companyName}
                            </p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                          {application.salary && (
                            <span className="flex items-center px-3 py-1.5 bg-green-400/10 border border-green-400/20 rounded-lg">
                              <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                              <span className="text-green-400 font-medium">{application.salary} ₸</span>
                            </span>
                          )}
                          {application.location && (
                            <span className="flex items-center px-3 py-1.5 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                              <MapPin className="w-4 h-4 mr-1 text-blue-400" />
                              <span className="text-blue-400">{application.location}</span>
                            </span>
                          )}
                          <span className="flex items-center px-3 py-1.5 bg-purple-400/10 border border-purple-400/20 rounded-lg">
                            <Calendar className="w-4 h-4 mr-1 text-purple-400" />
                            <span className="text-purple-400">{formatDate(application.appliedDate)}</span>
                          </span>
                        </div>

                        {/* Response from employer */}
                        {application.response && (
                          <div className="bg-blue-400/10 border border-blue-400/20 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <MessageSquare className="w-4 h-4 mr-2 text-blue-400" />
                              <span className="text-sm text-gray-300">
                                Ответ от {formatDate(application.responseDate)}
                              </span>
                            </div>
                            <p className="text-white text-sm leading-relaxed">{application.response}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Status + Actions */}
                    <div className="flex flex-col items-end gap-3 lg:ml-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        {getStatusBadge(application.status)}
                      </div>

                      {application.status === 'new' && (
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowWithdrawModal(true);
                          }}
                          className="flex items-center px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Отозвать
                        </button>
                      )}

                      {application.priority && (
                        <span className="flex items-center px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-yellow-400 text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Приоритет
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredApplications.length > 0 && (pagination.has_prev || pagination.has_next) && (
            <div className="mt-8 flex items-center justify-between">
              <button
                disabled={!pagination.has_prev}
                onClick={() => loadApplications(pagination.page - 1, activeTab)}
                className="px-6 py-3 bg-white/10 border border-yellow-400/20 text-white rounded-xl font-medium hover:border-yellow-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Назад
              </button>
              <div className="text-gray-400">
                Страница {pagination.page} из {pagination.pages}
              </div>
              <button
                disabled={!pagination.has_next}
                onClick={() => loadApplications(pagination.page + 1, activeTab)}
                className="px-6 py-3 bg-white/10 border border-yellow-400/20 text-white rounded-xl font-medium hover:border-yellow-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперёд →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Withdraw Modal */}
      {showWithdrawModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-red-400/20 rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 border border-red-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Отозвать отклик?</h3>
              <p className="text-gray-300 mb-2">
                Вы уверены, что хотите отозвать отклик на вакансию:
              </p>
              <p className="text-white font-semibold mb-4">
                "{selectedApplication.vacancyTitle}" в {selectedApplication.companyName}?
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Это действие нельзя будет отменить.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setSelectedApplication(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Отмена
                </button>
                <button
                  onClick={handleWithdrawApplication}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Отозвать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsDashboard;