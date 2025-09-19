import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Building, TrendingUp, ChevronRight, MapPin, Clock, Award, Loader } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Астана');
  const [popularJobs, setPopularJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const stats = [
    { number: '2,500+', label: 'Активных вакансий' },
    { number: '15,000+', label: 'Зарегистрированных кандидатов' },
    { number: '850+', label: 'Компаний-партнеров' },
    { number: '7 дней', label: 'Средний срок закрытия' }
  ];

  const features = [
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Мультиканальная дистрибуция',
      description: 'Ваша вакансия попадает на сайт + Instagram + Threads + TikTok + Telegram одновременно'
    },
    {
      icon: <Award className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Скоринг кандидатов',
      description: 'Мини-тесты и проверки помогают найти подходящих сотрудников быстрее'
    },
    {
      icon: <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Быстрое закрытие вакансий',
      description: 'Массовые роли закрываем за 7-10 дней, офисные — за 20 дней'
    },
    {
      icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Аналитика и отчеты',
      description: 'Подробная статистика по откликам, просмотрам и конверсии ваших вакансий'
    }
  ];

  const jobTypeLabels = {
    'full_time': 'Полная занятость',
    'part_time': 'Частичная занятость',
    'remote': 'Удаленная работа',
    'contract': 'Проектная работа',
    'internship': 'Стажировка'
  };

  // Загрузка популярных вакансий
  const fetchPopularJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        per_page: '4',
        sort: 'views_desc',
        order: 'desc'
      });

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/jobs/?${queryParams}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке вакансий');
      }

      const data = await response.json();
      setPopularJobs(data.jobs || []);
    } catch (err) {
      setError(err.message);
      setPopularJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем вакансии при монтировании компонента
  useEffect(() => {
    fetchPopularJobs();
  }, []);

  // Функция для перехода на страницу поиска
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    
    if (selectedCity && selectedCity !== 'Все города') {
      params.append('city', selectedCity);
    }
    
    navigate(`/jobs?${params.toString()}`);
  };

  // Функция для перехода на страницу деталей вакансии
  const handleJobClick = (jobId) => {
    navigate(`/jobdetail?id=${jobId}`);
  };

  // Функция для получения отображаемого названия типа занятости
  const getEmploymentTypeLabel = (type) => {
    return jobTypeLabels[type] || type;
  };

  // Функция для форматирования зарплаты
  const formatSalary = (job) => {
    if (job.salary_display) {
      return job.salary_display;
    }
    
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ₸`;
    }
    
    if (job.salary_min) {
      return `от ${job.salary_min.toLocaleString()} ₸`;
    }
    
    return 'По договоренности';
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4 md:mb-6">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-xs md:text-sm font-medium">Петропавловск и регионы Казахстана</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Найдите работу в
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Северном Казахстане
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              WorkPlus.kz — HR-экосистема с мультиканальной дистрибуцией. 
              Закрываем вакансии быстрее и дешевле традиционных площадок.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8 md:mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Должность или компания</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Например: продавец, курьер, менеджер..."
                      className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Город</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
                  >
                    <option value="Астана">Астана</option>
                    <option value="Петропавловск">Петропавловск</option>
                    <option value="Костанай">Костанай</option>
                    <option value="Актау">Актау</option>
                    <option value="Павлодар">Павлодар</option>
                    <option value="Все города">Все города</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleSearch}
                className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 md:py-3 px-6 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center text-sm md:text-base"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Найти работу
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Jobs */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Популярные вакансии в 
              <span className="text-yellow-400"> Казахстане</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg">Актуальные предложения от проверенных работодателей</p>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Jobs Grid */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
                {popularJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all group cursor-pointer"
                    onClick={() => handleJobClick(job.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors truncate">
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
                        <p className="text-gray-300 text-sm md:text-base truncate">
                          {job.company?.name || 'Компания'}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-yellow-400 font-bold text-base md:text-lg">
                          {formatSalary(job)}
                        </div>
                        <div className="text-gray-400 text-xs md:text-sm">
                          {getEmploymentTypeLabel(job.employment_type)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        <span className="text-xs md:text-sm">
                          {job.city}
                          {job.remote_work && ' (Удаленно)'}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              {/* No Jobs Found */}
              {popularJobs.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-white mb-2">Популярные вакансии не найдены</h3>
                  <p className="text-gray-400">Попробуйте зайти позже</p>
                </div>
              )}
            </>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate('/jobs')}
              className="bg-white/5 border border-yellow-400/20 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all text-sm md:text-base inline-block"
            >
              Посмотреть все вакансии
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Почему выбирают 
              <span className="text-yellow-400"> WorkPlus.kz</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Мы используем современные технологии и соцсети для быстрого и эффективного подбора персонала
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Generator CTA */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4">
                  <Award className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-yellow-400 text-sm font-medium">Генератор резюме</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  Создайте профессиональное резюме за 5 минут
                </h2>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Наш ИИ-помощник поможет составить идеальное резюме, которое привлечет внимание работодателей. 
                  Автоматически подберет ключевые навыки под вашу специальность.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-300">Профессиональные шаблоны</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-300">ИИ-подсказки</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-300">Экспорт в PDF</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-300">Адаптация под вакансию</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Увеличьте шансы на 3x</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Качественное резюме повышает вероятность получения приглашения на собеседование в 3 раза
                  </p>
                  <div className="inline-flex items-center px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full mb-4">
                    <span className="text-yellow-400 text-xs font-medium">Премиум-функция</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/resume-gen')}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Создать резюме
                </button>
                <p className="text-gray-400 text-xs mt-2">
                  Стоимость: от 500 ₸
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Готовы найти идеальных сотрудников?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
            Начните размещать вакансии уже сегодня и получите первые отклики в течение 24 часов
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center text-sm md:text-base">
              <Building className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Разместить вакансию
            </button>
            <button className="border border-yellow-400/40 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:bg-yellow-400/10 transition-all text-sm md:text-base">
              Узнать больше
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;