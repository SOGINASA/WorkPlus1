import React, { useState } from 'react';
import { Search, Users, Target, Clock, TrendingUp, CheckCircle, Star, Zap, Shield, Award, ArrowRight, Filter, MapPin, Briefcase, Building, Phone, Mail } from 'lucide-react';

const PremiumSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Астана');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('');

  const cities = ['Астана', 'Алматы', 'Шымкент', 'Актобе', 'Тараз', 'Павлодар', 'Костанай', 'Петропавловск', 'Все города'];
  const categories = ['IT и разработка', 'Финансы и банки', 'Маркетинг и реклама', 'Продажи', 'Менеджмент', 'Консалтинг'];
  const salaryRanges = ['500,000 - 1,000,000 ₸', '1,000,000 - 1,500,000 ₸', '1,500,000 - 2,000,000 ₸', '2,000,000+ ₸'];

  const premiumVacancies = [
    {
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp Kazakhstan',
      salary: '1,200,000 - 2,400,000 ₸',
      location: 'Алматы',
      type: 'Полная занятость',
      experience: '5+ лет',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      premium: true,
      urgent: true
    },
    {
      title: 'Директор по маркетингу',
      company: 'Retail Giant',
      salary: '800,000 - 1,600,000 ₸',
      location: 'Астана',
      type: 'Полная занятость',
      experience: '7+ лет',
      skills: ['Digital Marketing', 'Team Management', 'Strategy'],
      premium: true,
      featured: true
    },
    {
      title: 'Lead Data Scientist',
      company: 'FinTech Solutions',
      salary: '1,000,000 - 2,000,000 ₸',
      location: 'Алматы',
      type: 'Полная занятость',
      experience: '6+ лет',
      skills: ['Python', 'Machine Learning', 'SQL', 'Analytics'],
      premium: true
    },
    {
      title: 'Chief Technology Officer',
      company: 'StartupHub KZ',
      salary: '1,500,000 - 3,000,000 ₸',
      location: 'Астана',
      type: 'Полная занятость',
      experience: '10+ лет',
      skills: ['Leadership', 'Architecture', 'Strategy', 'Innovation'],
      premium: true,
      featured: true
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Зарплаты выше рынка',
      description: 'До 2x от стандартных предложений на рынке труда'
    },
    {
      icon: <Target className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Точный подбор',
      description: 'Находим кандидатов под ваши требования за 48 часов'
    },
    {
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Гарантия качества',
      description: 'Проверенные специалисты с подтвержденным опытом'
    },
    {
      icon: <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Быстрое закрытие',
      description: 'Средний срок закрытия вакансии - 7-14 дней'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Анализ потребности',
      description: 'Детально изучаем ваши требования и корпоративную культуру'
    },
    {
      step: '02',
      title: 'Поиск кандидатов',
      description: 'Используем все каналы: базы, соцсети, хедхантинг'
    },
    {
      step: '03',
      title: 'Скрининг и тестирование',
      description: 'Проводим интервью, технические тесты и проверки'
    },
    {
      step: '04',
      title: 'Презентация кандидатов',
      description: 'Предоставляем топ-3 кандидата с детальными досье'
    }
  ];

  const stats = [
    { number: '95%', label: 'Успешных закрытий' },
    { number: '2x', label: 'Средняя зарплата' },
    { number: '48ч', label: 'Первые кандидаты' },
    { number: '500+', label: 'Закрытых позиций' }
  ];

  const handleSearch = () => {
    console.log('Поиск:', { searchQuery, selectedCity, selectedCategory, selectedSalaryRange });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4 md:mb-6">
              <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-xs md:text-sm font-medium">Премиум поиск талантов</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Найдем топовых специалистов
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                с зарплатой до 2x
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              Эксклюзивный сервис поиска высококвалифицированных кадров под ключ. 
              Гарантируем результат за 7-14 дней.
            </p>
          </div>

          {/* Advanced Search Form */}
          <div className="max-w-5xl mx-auto mb-8 md:mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Должность или навыки</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Например: CTO, Lead Developer, Директор..."
                      className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Город</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base appearance-none"
                    >
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
                  >
                    <option value="">Все категории</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Зарплатная вилка</label>
                  <select
                    value={selectedSalaryRange}
                    onChange={(e) => setSelectedSalaryRange(e.target.value)}
                    className="w-full px-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
                  >
                    <option value="">Любая зарплата</option>
                    {salaryRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 md:py-3 px-6 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center text-sm md:text-base"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Найти премиум вакансии
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

      {/* Benefits Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Почему выбирают наш 
              <span className="text-yellow-400"> премиум сервис</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto">
              Мы специализируемся на поиске топ-талантов с эксклюзивными условиями
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all">
                  {benefit.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">{benefit.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Vacancies */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Эксклюзивные вакансии в 
              <span className="text-yellow-400"> Казахстане</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg">Доступ к закрытым позициям с зарплатами выше рынка</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {premiumVacancies.map((vacancy, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
                        {vacancy.title}
                      </h3>
                      {vacancy.urgent && (
                        <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-full">
                          СРОЧНО
                        </span>
                      )}
                      {vacancy.featured && (
                        <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-medium rounded-full">
                          ТОП
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium rounded-full">
                        PREMIUM
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base">
                      {vacancy.company}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-yellow-400 font-bold text-base md:text-lg">
                      {vacancy.salary}
                    </div>
                    <div className="text-gray-400 text-xs md:text-sm">
                      {vacancy.type}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    {vacancy.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Briefcase className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Опыт: {vacancy.experience}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {vacancy.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-2 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-xs md:text-sm">
                    Премиум позиция
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-white/5 border border-yellow-400/20 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all text-sm md:text-base inline-block">
              Посмотреть все премиум вакансии
            </button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Как мы работаем 
              <span className="text-yellow-400"> под ключ</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto">
              Проверенный процесс поиска топ-специалистов за 4 простых шага
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center group relative">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all">
                  <span className="text-xl md:text-2xl font-bold text-yellow-400">{step.step}</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{step.description}</p>
                
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 transform">
                    <ArrowRight className="w-6 h-6 text-yellow-400/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Готовы найти идеального кандидата?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
            Оставьте заявку, и наш эксперт свяжется с вами в течение часа для бесплатной консультации
          </p>
          
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8 max-w-md mx-auto mb-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full px-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
              />
              <input
                type="tel"
                placeholder="Телефон"
                className="w-full px-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
              />
              <textarea
                placeholder="Какую позицию нужно закрыть?"
                rows={3}
                className="w-full px-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base resize-none"
              />
              <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 md:py-3 px-6 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center text-sm md:text-base">
                <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Получить консультацию
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-400">
            Первая консультация бесплатно. Гарантируем конфиденциальность.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button className="border border-yellow-400/40 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-medium hover:bg-yellow-400/10 transition-all text-sm md:text-base flex items-center justify-center">
              <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              +7 (777) 123-45-67
            </button>
            <button className="border border-yellow-400/40 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-medium hover:bg-yellow-400/10 transition-all text-sm md:text-base flex items-center justify-center">
              <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              premium@workplus.kz
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PremiumSearchPage;