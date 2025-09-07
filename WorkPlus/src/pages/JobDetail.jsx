import React, { useState, useEffect } from 'react';
import { 
  MapPin, Clock, Building, Users, Star, Share2, Heart, 
  ChevronLeft, Briefcase, DollarSign, Calendar, CheckCircle, 
  AlertCircle, Phone, Mail, Globe, Facebook, Instagram, 
  Send, Upload, Eye, Bookmark, Loader2, X, AlertTriangle
} from 'lucide-react';
import { getUserFromStorage } from '../components/api/AuthUtils';

const JobDetailPage = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    phone: '',
    email: '',
    resumeFile: null
  });

  // Получить ID вакансии из URL
  const getJobIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  };

  // Настройка API
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  let isEmployer = false;
  let user_data = getUserFromStorage();
  if (user_data && (user_data.user_type == 'employer' || user_data.user_type == 'admin' )) {
    isEmployer = true;
  }

  // Функции для форматирования данных
  const formatArray = (data) => {
    try {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (typeof data === 'string') {
        // Проверяем, является ли строка JSON
        if (data.trim().startsWith('[') || data.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            // Если не удалось парсить JSON, разбиваем по строкам
            return data.split('\n').filter(item => item.trim());
          }
        } else {
          // Разбиваем по строкам или запятым
          return data.split(/\n|,/).map(item => item.trim()).filter(item => item);
        }
      }
      return [];
    } catch (error) {
      console.error('Error formatting array:', error, data);
      return [];
    }
  };

  // Загрузка данных вакансии
  useEffect(() => {
    const loadJobData = async () => {
      const jobId = getJobIdFromUrl();
      
      if (!jobId) {
        setError('ID вакансии не указан в URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Загружаем вакансию с ID:', jobId);
        console.log('API URL:', `${API_BASE_URL}/api/jobs/${jobId}`);
        
        const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Добавляем JWT токен если есть
            ...(localStorage.getItem('token') && {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
          }
        });

        // Проверяем тип контента ответа
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Сервер вернул неожиданный тип данных. Возможно, backend недоступен.');
        }

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Вакансия не найдена');
          }
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка при загрузке вакансии');
        }

        const jobData = await response.json();
        setJob(jobData);
        setIsSaved(jobData.user_saved || false);
        
      } catch (err) {
        console.error('Ошибка при загрузке вакансии:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadJobData();
  }, []);

  const handleApply = () => {
    // Проверяем авторизацию
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Для подачи заявки необходимо войти в систему');
      // Здесь можно перенаправить на страницу авторизации
      // window.location.href = '/login';
      return;
    }
    setIsApplying(true);
  };

  const handleSubmitApplication = async () => {
    const jobId = getJobIdFromUrl();
    


    try {
      setSubmittingApplication(true);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Для подачи заявки необходимо войти в систему');
      }

      const applicationPayload = {
        cover_letter: applicationData.coverLetter,
        resume_url: applicationData.resumeUrl,
        portfolio_url: applicationData.portfolioUrl,
        expected_salary: applicationData.expectedSalary
      };

      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(applicationPayload)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Сервер вернул неожиданный тип данных');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при отправке отклика');
      }
      
      const result = await response.json();
      alert('Ваш отклик успешно отправлен!');
      setIsApplying(false);
      setJob(prev => ({ 
        ...prev, 
        user_applied: true,
        stats: {
          ...prev.stats,
          applications: (prev.stats?.applications || 0) + 1
        }
      }));
    } catch (err) {
      console.error('Ошибка при отправке заявки:', err);
      alert(`Ошибка: ${err.message}`);
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleSave = async () => {
    const jobId = getJobIdFromUrl();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Для сохранения вакансий необходимо войти в систему');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/save`, {
        method: isSaved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json') && response.ok) {
        setIsSaved(!isSaved);
      } else if (!response.ok) {
        const errorData = await response.json();
        console.warn('Ошибка при сохранении:', errorData.error);
      }
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Ссылка скопирована в буфер обмена');
    setShowShareMenu(false);
  };

  const goBack = () => {
    window.history.back();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} нед. назад`;
    return date.toLocaleDateString('ru-RU');
  };

  const getEmploymentTypeLabel = (type) => {
    const types = {
      'full_time': 'Полная занятость',
      'part_time': 'Частичная занятость',
      'remote': 'Удаленная работа',
      'contract': 'Проектная работа',
      'internship': 'Стажировка'
    };
    return types[type] || type;
  };

  const getExperienceLevelLabel = (level) => {
    const levels = {
      'junior': 'Начинающий',
      'middle': 'Средний',
      'senior': 'Старший'
    };
    return levels[level] || level;
  };

  // Состояния загрузки и ошибок
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Загрузка вакансии...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Ошибка</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Попробовать снова
            </button>
            <button 
              onClick={goBack}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Вернуться назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  // Извлекаем данные из API ответа с безопасной обработкой
  const responsibilities = formatArray(job.responsibilities);
  const requirements = formatArray(job.requirements);
  const benefits = formatArray(job.benefits);
  const relatedJobs = job.related_jobs || [];
  
  // Безопасное извлечение навыков
  let jobSkills = [];
  try {
    const rawSkills = job.skills;
    console.log('Raw skills:', rawSkills, 'Type:', typeof rawSkills);
    
    if (rawSkills) {
      if (Array.isArray(rawSkills)) {
        jobSkills = rawSkills;
      } else if (typeof rawSkills === 'string') {
        jobSkills = formatArray(rawSkills);
      } else {
        jobSkills = [];
      }
    }
  } catch (error) {
    console.error('Error processing skills:', error);
    jobSkills = [];
  }
  
  console.log('Processed skills:', jobSkills);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navigation */}
      <div className="bg-white/5 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={goBack}
            className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Назад к поиску вакансий
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-xl flex items-center justify-center text-3xl md:text-4xl flex-shrink-0">
                  <Building className="w-8 h-8 text-yellow-400" />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">{job.title}</h1>
                        {job.is_urgent && (
                          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-full">
                            СРОЧНО
                          </span>
                        )}
                        {job.is_featured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-medium rounded-full">
                            VIP
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-300 mb-4">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {job.company?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location?.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {getEmploymentTypeLabel(job.employment_type)}
                        </span>
                      </div>

                      <div className="text-3xl font-bold text-yellow-400 mb-4">
                        {job.salary?.display || 'По договоренности'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={handleSave}
                        className={`p-2 rounded-lg border transition-all ${
                          isSaved 
                            ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-400' 
                            : 'border-gray-600 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-400'
                        }`}
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={handleShare}
                          className="p-2 rounded-lg border border-gray-600 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-400 transition-all"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        
                        {showShareMenu && (
                          <div className="absolute top-12 right-0 bg-gray-800 border border-gray-700 rounded-lg p-4 min-w-[200px] z-10">
                            <p className="text-white text-sm mb-3">Поделиться вакансией:</p>
                            <div className="space-y-2">
                              <button 
                                onClick={copyToClipboard}
                                className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300"
                              >
                                Копировать ссылку
                              </button>
                              {job.social_publishing?.published_urls?.telegram && (
                                <a 
                                  href={job.social_publishing.published_urls.telegram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-2 hover:bg-gray-700 rounded text-sm text-gray-300"
                                >
                                  Telegram
                                </a>
                              )}
                              {job.social_publishing?.published_urls?.instagram && (
                                <a 
                                  href={job.social_publishing.published_urls.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-2 hover:bg-gray-700 rounded text-sm text-gray-300"
                                >
                                  Instagram
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {job.stats?.views || 0} просмотров
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.stats?.applications || 0} откликов
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Опубликовано {formatDate(job.published_at || job.created_at)}
                    </span>
                    {job.expires_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        До {new Date(job.expires_at).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>

                  {job.user_applied ? (
                    <div className="bg-green-500/20 border border-green-500/40 text-green-400 px-6 py-3 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Вы уже откликнулись на эту вакансию
                    </div>
                  ) : isEmployer ? (
                    <div className="bg-gray-500/20 border border-gray-500/40 text-gray-400 px-6 py-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Вы не можете откликаться на вакансию, потому что вы работодатель
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      {/* Быстрая подача заявки */}
                      <button 
                        onClick={() => handleSubmitApplication(job.id)}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Быстрый отклик
                      </button>
                      
                      {/* Детальная подача заявки */}
                      {/* <button 
                        onClick={handleApply}
                        className="px-6 py-3 border border-yellow-400/40 text-yellow-400 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all flex items-center justify-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        С резюме
                      </button> */}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-8">
              {/* Description */}
              {job.description && (
                <section className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Описание вакансии</h2>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </div>
                </section>
              )}

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <section className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Обязанности</h2>
                  <ul className="space-y-3">
                    {responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <section className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Требования</h2>
                  <ul className="space-y-3">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <section className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Условия работы</h2>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Skills */}
              {jobSkills && jobSkills.length > 0 && (
                <section className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Необходимые навыки</h2>
                  <div className="flex flex-wrap gap-2">
                    {jobSkills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-yellow-400 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Детали вакансии</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Зарплата</div>
                  <div className="text-white font-semibold">{job.salary?.display || 'По договоренности'}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Тип занятости</div>
                  <div className="text-white font-semibold">{getEmploymentTypeLabel(job.employment_type)}</div>
                </div>
                {job.experience_level && (
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Уровень</div>
                    <div className="text-white font-semibold">{getExperienceLevelLabel(job.experience_level)}</div>
                  </div>
                )}
                {job.education_required && (
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Образование</div>
                    <div className="text-white font-semibold">{job.education_required}</div>
                  </div>
                )}
                {job.location?.address && (
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Адрес</div>
                    <div className="text-white font-semibold">{job.location.address}</div>
                  </div>
                )}
                {job.location?.remote_work && (
                  <div>
                    <div className="text-green-400 text-sm font-semibold">Удаленная работа</div>
                  </div>
                )}
              </div>
            </div>

            {/* Company Info */}
            {job.company && (
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">О компании</h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{job.company.name}</h4>
                    {job.company.rating && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {job.company.rating}
                      </div>
                    )}
                  </div>
                </div>

                {job.company.description && (
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {job.company.description}
                  </p>
                )}

                {job.company.website && (
                  <a 
                    href={`https://${job.company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm mb-4"
                  >
                    <Globe className="w-4 h-4" />
                    {job.company.website}
                  </a>
                )}
              </div>
            )}

            {/* Similar Jobs */}
            {relatedJobs.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Похожие вакансии</h3>
                <div className="space-y-4">
                  {relatedJobs.map((relatedJob) => (
                    <div 
                      key={relatedJob.id} 
                      className="p-4 bg-white/5 rounded-lg border border-gray-700 hover:border-yellow-400/30 transition-all cursor-pointer"
                      onClick={() => window.location.href = `/jobdetail?id=${relatedJob.id}`}
                    >
                      <h4 className="text-white font-semibold mb-2 text-sm">{relatedJob.title}</h4>
                      <div className="text-gray-400 text-xs mb-2">{relatedJob.company}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-400 font-semibold text-sm">{relatedJob.salary_display}</span>
                        <span className="text-gray-500 text-xs">{relatedJob.city}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isApplying && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-yellow-400/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Отклик на вакансию</h2>
                <button 
                  onClick={() => setIsApplying(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold">{job.title}</h3>
                <p className="text-gray-300 text-sm">{job.company?.name} • {job.location?.city}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Телефон <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={applicationData.email}
                    onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Резюме</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 mb-2">Загрузите ваше резюме</p>
                    <input 
                      type="file" 
                      onChange={(e) => setApplicationData({...applicationData, resumeFile: e.target.files[0]})}
                      className="hidden" 
                      accept=".pdf,.doc,.docx" 
                      id="resume-upload"
                    />
                    <label 
                      htmlFor="resume-upload"
                      className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm cursor-pointer"
                    >
                      Выбрать файл
                    </label>
                    {applicationData.resumeFile && (
                      <p className="text-green-400 text-sm mt-2">
                        Выбран файл: {applicationData.resumeFile.name}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Пока что загрузка файлов недоступна. Вы можете указать ссылку на резюме в сопроводительном письме.
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Сопроводительное письмо</label>
                  <textarea
                    rows={6}
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Расскажите, почему вы подходите для этой позиции..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                    disabled={submittingApplication}
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitApplication}
                    disabled={submittingApplication}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submittingApplication ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      'Отправить отклик'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;