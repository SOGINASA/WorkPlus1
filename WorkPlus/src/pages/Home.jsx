import React, { useState } from 'react';
import { Search, Users, Building, TrendingUp, ChevronRight, MapPin, Clock, Award } from 'lucide-react';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Петропавловск');

  const stats = [
    { number: '2,500+', label: 'Активных вакансий' },
    { number: '15,000+', label: 'Зарегистрированных кандидатов' },
    { number: '850+', label: 'Компаний-партнеров' },
    { number: '7 дней', label: 'Средний срок закрытия' }
  ];

  const popularJobs = [
    { title: 'Продавец-консультант', company: 'Kaspi Red', salary: '150,000 ₸', location: 'Петропавловск', type: 'Полная занятость' },
    { title: 'Курьер', company: 'Glovo Kazakhstan', salary: '200,000 ₸', location: 'Петропавловск', type: 'Свободный график' },
    { title: 'Администратор', company: 'Hotel Plaza', salary: '180,000 ₸', location: 'Петропавловск', type: 'Сменный график' },
    { title: 'SMM-менеджер', company: 'Digital Agency', salary: '250,000 ₸', location: 'Петропавловск', type: 'Удаленно' }
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
                    <option value="Петропавловск">Петропавловск</option>
                    <option value="Костанай">Костанай</option>
                    <option value="Актау">Актау</option>
                    <option value="Павлодар">Павлодар</option>
                    <option value="Все города">Все города</option>
                  </select>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 md:py-3 px-6 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center text-sm md:text-base">
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
              <span className="text-yellow-400"> Петропавловске</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg">Актуальные предложения от проверенных работодателей</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {popularJobs.map((job, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors truncate">
                      {job.title}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base truncate">{job.company}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-yellow-400 font-bold text-base md:text-lg">{job.salary}</div>
                    <div className="text-gray-400 text-xs md:text-sm">{job.type}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="text-xs md:text-sm">{job.location}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-white/5 border border-yellow-400/20 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all text-sm md:text-base">
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