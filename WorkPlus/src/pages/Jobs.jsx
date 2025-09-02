import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Building, ChevronRight, Filter, Star, Briefcase, DollarSign, Calendar, Users, Loader } from 'lucide-react';

const JobsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

const [jobCategories, setJobCategories] = useState([]);
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

useEffect(() => {
  async function fetchJobCategories() {
    const res = await fetch(`${API_BASE_URL}/api/jobs/categories`);
    const data = await res.json();

    const categoriesArr = ["Все категории", ...data.categories.map(cat => cat.name)];
    setJobCategories(categoriesArr); // теперь можно юзать
  }

  fetchJobCategories();
}, []);


  const cities = [
    'Все города',
    'Астана',
    'Алматы',
    'Петропавловск',
    'Костанай',
    'Актау',
    'Павлодар',
    'Кокшетау',
    'Рудный',
    'Атырау'
  ];

  const salaryRanges = [
    { label: 'Любая зарплата', min: null, max: null },
    { label: 'До 150,000 ₸', min: null, max: 150000 },
    { label: '150,000 - 250,000 ₸', min: 150000, max: 250000 },
    { label: '250,000 - 400,000 ₸', min: 250000, max: 400000 },
    { label: '400,000 - 600,000 ₸', min: 400000, max: 600000 },
    { label: 'От 600,000 ₸', min: 600000, max: null }
  ];

  const jobTypes = [
    'Все типы',
    'full_time',
    'part_time',
    'remote',
    'contract',
    'internship'
  ];

  const jobTypeLabels = {
    'full_time': 'Полная занятость',
    'part_time': 'Частичная занятость',
    'remote': 'Удаленная работа',
    'contract': 'Проектная работа',
    'internship': 'Стажировка'
  };

  const experienceLevels = {
    'junior': 'Начинающий',
    'middle': 'Средний',
    'senior': 'Старший'
  };

  // Функция для получения вакансий
  const fetchJobs = async (page = 1, params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: '20',
        sort: sortBy,
        order: sortOrder,
        ...params
      });

      // Удаляем пустые параметры
      Object.keys(params).forEach(key => {
        if (!params[key] || params[key] === 'Все города' || params[key] === 'Все категории' || params[key] === 'Все типы') {
          queryParams.delete(key);
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/jobs/?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке вакансий');
      }

      const data = await response.json();
      setJobs(data.jobs || []);
      setPagination(data.pagination || {});
      setFilters(data.filters || {});
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем вакансии при монтировании компонента
  useEffect(() => {
    fetchJobs(1);
  }, [sortBy, sortOrder]);

  // Функция поиска
  const handleSearch = () => {
    const searchParams = {};
    
    if (searchQuery.trim()) {
      searchParams.search = searchQuery.trim();
    }
    if (selectedCity && selectedCity !== 'Все города') {
      searchParams.city = selectedCity;
    }
    if (selectedCategory && selectedCategory !== 'Все категории') {
      searchParams.category = selectedCategory;
    }
    if (selectedType && selectedType !== 'Все типы') {
      searchParams.employment_type = selectedType;
    }

    // Обработка зарплатного диапазона
    const selectedSalaryRange = salaryRanges.find(range => range.label === selectedSalary);
    if (selectedSalaryRange && selectedSalaryRange.min !== null) {
      searchParams.salary_min = selectedSalaryRange.min;
    }
    if (selectedSalaryRange && selectedSalaryRange.max !== null) {
      searchParams.salary_max = selectedSalaryRange.max;
    }

    setCurrentPage(1);
    fetchJobs(1, searchParams);
  };

  // Функция для загрузки следующей страницы
  const handleLoadMore = () => {
    if (pagination.has_next) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      
      const searchParams = {};
      if (searchQuery.trim()) searchParams.search = searchQuery.trim();
      if (selectedCity && selectedCity !== 'Все города') searchParams.city = selectedCity;
      if (selectedCategory && selectedCategory !== 'Все категории') searchParams.category = selectedCategory;
      if (selectedType && selectedType !== 'Все типы') searchParams.employment_type = selectedType;
      
      fetchJobs(nextPage, searchParams);
    }
  };

  // Функция для перехода на страницу деталей вакансии
  const handleJobClick = (jobId) => {
    navigate(`/jobdetail?id=${jobId}`);
  };

  // Функция для подачи заявки на вакансию
  const handleApplyJob = async (e, jobId) => {
    e.stopPropagation(); // Предотвращаем всплытие события клика
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        alert('Для подачи заявки необходимо войти в систему');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при подаче заявки');
      }

      const data = await response.json();
      alert('Заявка успешно подана!');
      
      // Обновляем список вакансий
      fetchJobs(currentPage);
    } catch (err) {
      alert(err.message);
    }
  };

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return '1 день назад';
    if (diffDays < 7) return `${diffDays} дня назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
    return date.toLocaleDateString('ru-RU');
  };

  // Функция для получения отображаемого названия типа занятости
  const getEmploymentTypeLabel = (type) => {
    return jobTypeLabels[type] || type;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-400/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Найдите работу мечты в 
              <span className="text-yellow-400"> Северном Казахстане</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              {pagination.total || 0} актуальных вакансий от проверенных работодателей
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-6xl mx-auto">
            {/* Main Search Bar */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-4 md:p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Должность, компания или навык..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 px-6 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Найти
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white hover:bg-white/15 transition-all"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-4 md:p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      {jobCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Зарплата</label>
                    <select
                      value={selectedSalary}
                      onChange={(e) => setSelectedSalary(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      {salaryRanges.map(salary => (
                        <option key={salary.label} value={salary.label}>{salary.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Тип занятости</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="Все типы">Все типы</option>
                      {Object.entries(jobTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Найдено {pagination.total || 0} вакансий
              </h2>
              <p className="text-gray-400">Отсортировано по {sortBy === 'created_at' ? 'дате' : sortBy === 'salary_min' ? 'зарплате' : 'релевантности'}</p>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-400">Сортировать по:</span>
              <select 
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('_');
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="created_at_desc">Дате публикации (новые)</option>
                <option value="created_at_asc">Дате публикации (старые)</option>
                <option value="salary_min_desc">Зарплате (по убыванию)</option>
                <option value="salary_min_asc">Зарплате (по возрастанию)</option>
                <option value="views_desc">Популярности</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Loading Spinner */}
          {loading && jobs.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
          )}

          {/* Jobs Grid */}
          <div className="space-y-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all group cursor-pointer"
                onClick={() => handleJobClick(job.id)}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-xl flex items-center justify-center text-2xl">
                      {job.company?.logo || '🏢'}
                    </div>
                  </div>

                  {/* Job Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl md:text-2xl font-semibold text-white group-hover:text-yellow-400 transition-colors truncate">
                            {job.title}
                          </h3>
                          {job.is_urgent && (
                            <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-full">
                              СРОЧНО
                            </span>
                          )}
                          {job.is_featured && (
                            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-medium rounded-full">
                              ТОП
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-gray-300 mb-3">
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.company?.name || 'Компания'}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.city}
                            {job.remote_work && ' (Удаленно)'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {getEmploymentTypeLabel(job.employment_type)}
                          </span>
                          {job.salary.min && (
                            <span className="flex items-center gap-1 text-green-400 font-medium">
                              💰 {job.salary.max 
                                ? `${job.salary.min} - ${job.salary.max} ₸`
                                : `от ${job.salary.min} ₸`}
                            </span>
                          )}
                        </div>


                        <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills && job.skills.split(',').slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs rounded-full">
                              {skill.trim()}
                            </span>
                          ))}
                          {job.experience_level && (
                            <span className="px-3 py-1 bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs rounded-full">
                              {experienceLevels[job.experience_level] || job.experience_level}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-yellow-400 mb-2">
                          {job.salary_display || (
                            job.salary_min && job.salary_max 
                              ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ₸`
                              : job.salary_min
                              ? `От ${job.salary_min.toLocaleString()} ₸`
                              : 'По договоренности'
                          )}
                        </div>
                        
                        <div className="flex items-center justify-end gap-4 mb-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.applications_count || 0} откликов
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {job.views_count || 0} просмотров
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-2 text-xs text-gray-500 mb-4">
                          <Clock className="w-3 h-3" />
                          {formatDate(job.created_at)}
                        </div>

                        <button 
                          onClick={(e) => handleApplyJob(e, job.id)}
                          className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
                        >
                          Откликнуться
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 hidden md:block">
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {pagination.has_next && (
            <div className="text-center mt-12">
              <button 
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-white/5 border border-yellow-400/20 text-white px-8 py-3 rounded-lg hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : null}
                Показать еще вакансии
              </button>
            </div>
          )}

          {/* No Jobs Found */}
          {!loading && jobs.length === 0 && !error && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">Вакансии не найдены</h3>
              <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Не нашли подходящую вакансию?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Создайте резюме и работодатели сами найдут вас!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all">
              Создать резюме
            </button>
            <button className="border border-yellow-400/40 text-white px-8 py-4 rounded-lg font-medium hover:bg-yellow-400/10 transition-all">
              Настроить уведомления
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobsPage;