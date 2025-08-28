import React, { useState } from 'react';
import { Search, MapPin, Clock, Building, ChevronRight, Filter, Star, Briefcase, DollarSign, Calendar, Users } from 'lucide-react';

const JobsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const jobCategories = [
    'Все категории',
    'Продажи',
    'IT и Digital',
    'Логистика',
    'Администрирование',
    'Маркетинг и реклама',
    'Банки и финансы',
    'Образование',
    'Медицина',
    'Строительство',
    'Производство'
  ];

  const cities = [
    'Все города',
    'Петропавловск',
    'Костанай',
    'Актау',
    'Павлодар',
    'Кокшетау',
    'Рудный',
    'Атырау'
  ];

  const salaryRanges = [
    'Любая зарплата',
    'До 150,000 ₸',
    '150,000 - 250,000 ₸',
    '250,000 - 400,000 ₸',
    '400,000 - 600,000 ₸',
    'От 600,000 ₸'
  ];

  const jobTypes = [
    'Все типы',
    'Полная занятость',
    'Частичная занятость',
    'Удаленная работа',
    'Проектная работа',
    'Стажировка'
  ];

  const jobs = [
    {
      id: 1,
      title: 'Продавец-консультант',
      company: 'Kaspi Red',
      logo: '🛍️',
      salary: '150,000 - 200,000 ₸',
      location: 'Петропавловск',
      type: 'Полная занятость',
      description: 'Ищем активного продавца-консультанта в магазин электроники. Опыт приветствуется.',
      requirements: ['Опыт в продажах от 1 года', 'Коммуникабельность', 'Знание казахского языка'],
      postedDate: '2 дня назад',
      isHot: true,
      rating: 4.5,
      applicants: 23
    },
    {
      id: 2,
      title: 'Курьер на личном транспорте',
      company: 'Glovo Kazakhstan',
      logo: '🚗',
      salary: '200,000 - 300,000 ₸',
      location: 'Петропавловск',
      type: 'Свободный график',
      description: 'Доставляй заказы в удобное время и зарабатывай от 200,000 тенге в месяц.',
      requirements: ['Наличие личного транспорта', 'Права категории B', 'Ответственность'],
      postedDate: '1 день назад',
      isHot: true,
      rating: 4.2,
      applicants: 45
    },
    {
      id: 3,
      title: 'Администратор отеля',
      company: 'Hotel Plaza',
      logo: '🏨',
      salary: '180,000 - 220,000 ₸',
      location: 'Петропавловск',
      type: 'Сменный график',
      description: 'Требуется администратор на ресепшн в гостиницу. Работа в дневные и ночные смены.',
      requirements: ['Опыт работы в сфере услуг', 'Знание английского языка', 'Стрессоустойчивость'],
      postedDate: '3 дня назад',
      isHot: false,
      rating: 4.0,
      applicants: 12
    },
    {
      id: 4,
      title: 'SMM-менеджер',
      company: 'Digital Agency KZ',
      logo: '📱',
      salary: '250,000 - 350,000 ₸',
      location: 'Петропавловск',
      type: 'Удаленно',
      description: 'Ведение социальных сетей для клиентов агентства. Креативность и знание трендов обязательно.',
      requirements: ['Портфолио работ', 'Знание Instagram, TikTok', 'Креативное мышление'],
      postedDate: '5 дней назад',
      isHot: false,
      rating: 4.3,
      applicants: 31
    },
    {
      id: 5,
      title: 'Бухгалтер',
      company: 'ТОО "Северные технологии"',
      logo: '📊',
      salary: '200,000 - 280,000 ₸',
      location: 'Петропавловск',
      type: 'Полная занятость',
      description: 'В растущую IT-компанию требуется опытный бухгалтер для ведения учета.',
      requirements: ['Высшее экономическое образование', 'Опыт от 2 лет', 'Знание 1С'],
      postedDate: '1 неделю назад',
      isHot: false,
      rating: 4.1,
      applicants: 18
    },
    {
      id: 6,
      title: 'Водитель категории C',
      company: 'Логистик Плюс',
      logo: '🚛',
      salary: '220,000 - 300,000 ₸',
      location: 'Костанай',
      type: 'Полная занятость',
      description: 'Требуется водитель на грузовой автомобиль для межгородских перевозок.',
      requirements: ['Права категории C', 'Опыт от 3 лет', 'Готовность к командировкам'],
      postedDate: '4 дня назад',
      isHot: true,
      rating: 3.9,
      applicants: 8
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || selectedCity === 'Все города' || job.location === selectedCity;
    const matchesType = !selectedType || selectedType === 'Все типы' || job.type === selectedType;
    
    return matchesSearch && matchesCity && matchesType;
  });

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
              {filteredJobs.length} актуальных вакансий от проверенных работодателей
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
                  <button className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 px-6 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center">
                    <Search className="w-5 h-5 mr-2" />
                    Найти
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
                        <option key={salary} value={salary}>{salary}</option>
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
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
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
                Найдено {filteredJobs.length} вакансий
              </h2>
              <p className="text-gray-400">Отсортировано по релевантности</p>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-400">Сортировать по:</span>
              <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <option>Релевантности</option>
                <option>Дате публикации</option>
                <option>Зарплате (по возрастанию)</option>
                <option>Зарплате (по убыванию)</option>
              </select>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all group cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-xl flex items-center justify-center text-2xl">
                      {job.logo}
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
                          {job.isHot && (
                            <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-full">
                              HOT
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-gray-300 mb-3">
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </span>
                        </div>

                        <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <span key={index} className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs rounded-full">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-yellow-400 mb-2">
                          {job.salary}
                        </div>
                        
                        <div className="flex items-center justify-end gap-4 mb-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {job.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.applicants} откликов
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-2 text-xs text-gray-500 mb-4">
                          <Clock className="w-3 h-3" />
                          {job.postedDate}
                        </div>

                        <button className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all">
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
          <div className="text-center mt-12">
            <button className="bg-white/5 border border-yellow-400/20 text-white px-8 py-3 rounded-lg hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all">
              Показать еще вакансии
            </button>
          </div>
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