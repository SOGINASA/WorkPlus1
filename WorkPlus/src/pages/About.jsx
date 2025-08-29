import React from 'react';
import { Target, Users, TrendingUp, Award, Clock, CheckCircle, ArrowRight, Building2, Globe, Zap } from 'lucide-react';

const AboutPage = () => {
  const achievements = [
    { number: '85%', label: 'Успешных закрытий вакансий' },
    { number: '7 дней', label: 'Средний срок найма' },
    { number: '40%', label: 'Экономия на подборе' },
    { number: '95%', label: 'Удовлетворенность клиентов' }
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Скорость и качество',
      description: 'Мы закрываем массовые роли за 7-10 дней, офисные — за 20 дней, не жертвуя качеством кандидатов'
    },
    {
      icon: <Globe className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Мультиканальность',
      description: 'Ваша вакансия попадает во все популярные каналы: сайт, Instagram, Threads, TikTok, Telegram'
    },
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Комьюнити-подход',
      description: 'Мы не просто площадка, а сообщество HR-специалистов и активных соискателей'
    },
    {
      icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Технологии и инновации',
      description: 'Используем скоринг, ИИ для матчинга и современные инструменты для эффективного подбора'
    }
  ];

  const timeline = [
    {
      period: 'MVP (0-90 дней)',
      title: 'Запуск базового функционала',
      items: [
        'Сайт с мультиканальной публикацией вакансий',
        'Базовый скоринг кандидатов',
        'Telegram-бот для уведомлений',
        'Фокус на массовых ролях в 3-5 городах'
      ]
    },
    {
      period: 'Версия 2.0 (3-6 мес)',
      title: 'Расширение функционала',
      items: [
        'Рейтинговая система работодателей',
        'ATS-лайт для малого бизнеса',
        'Маркетплейс HR-услуг',
        'Вебинары и образовательный контент'
      ]
    },
    {
      period: 'Версия 3.0 (6-12 мес)',
      title: 'Экосистема и партнерства',
      items: [
        'Интеграции с enbek.kz и Kaspi',
        'ИИ-рекомендации вакансий',
        'Франшизная модель по городам',
        'Полная HR-экосистема'
      ]
    }
  ];

  const team = [
    {
      role: 'Основатель и CEO',
      description: 'Опыт в HR-технологиях и развитии соцмедиа. Автор успешных кейсов по Threads маркетингу.'
    },
    {
      role: 'Head of Product',
      description: 'Эксперт по UX/UI и продуктовой аналитике. Опыт создания HR-платформ для казахстанского рынка.'
    },
    {
      role: 'Head of Sales',
      description: 'Специалист по B2B продажам и развитию партнерских отношений с работодателями.'
    },
    {
      role: 'SMM & Community',
      description: 'Контент-стратег с фокусом на HR-тематику. Управляет комьюнити в социальных сетях.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              О проекте
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                WorkPlus.kz
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              HR-экосистема с мультиканальной дистрибуцией, которая закрывает массовые и офисные роли 
              быстрее и дешевле, чем классические джоб-борды, потому что у нас есть сайт + соцсети + скоринг + комьюнити.
            </p>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-20">
            {achievements.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                Наша 
                <span className="text-yellow-400"> миссия</span>
              </h2>
              <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
                Мы создаем современную HR-экосистему, которая решает главные проблемы рынка труда Казахстана: 
                долгий поиск персонала, высокие затраты на подбор и низкое качество откликов.
              </p>
              <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
                Используя силу социальных сетей и современных технологий, мы помогаем работодателям находить 
                подходящих кандидатов в 2-3 раза быстрее, а соискателям — получать релевантные предложения.
              </p>
              
              <div className="flex items-center text-yellow-400">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Более 2,500 успешных подборов за последний год</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
                <Award className="w-8 h-8 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">Для работодателей</h3>
                <p className="text-gray-300">
                  Экономим до 40% бюджета на подбор персонала и сокращаем время закрытия вакансий в 2-3 раза
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
                <TrendingUp className="w-8 h-8 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">Для соискателей</h3>
                <p className="text-gray-300">
                  Предоставляем доступ к проверенным вакансиям с честными условиями и быстрой обратной связью
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Наши 
              <span className="text-yellow-400"> ценности</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Принципы, которые определяют наш подход к развитию платформы и работе с клиентами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 md:p-8 hover:border-yellow-400/30 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all flex-shrink-0">
                    {value.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Дорожная 
              <span className="text-yellow-400"> карта</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              План развития платформы от MVP до полноценной HR-экосистемы
            </p>
          </div>

          <div className="space-y-8 md:space-y-12">
            {timeline.map((phase, index) => (
              <div key={index} className="relative">
                {index < timeline.length - 1 && (
                  <div className="absolute left-4 md:left-6 top-16 bottom-0 w-px bg-gradient-to-b from-yellow-400 to-transparent"></div>
                )}
                
                <div className="flex items-start space-x-4 md:space-x-6">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 md:w-6 md:h-6 text-black" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 md:mb-0">{phase.title}</h3>
                        <span className="inline-flex items-center px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-sm font-medium">
                          {phase.period}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {phase.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start space-x-3">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm md:text-base">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Наша 
              <span className="text-yellow-400"> команда</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Опытные профессионалы с экспертизой в HR-технологиях, продажах и социальных медиа
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 md:p-8 hover:border-yellow-400/30 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">{member.role}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Присоединяйтесь к нашей экосистеме
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
            Станьте частью сообщества успешных работодателей и соискателей в Северном Казахстане
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center text-sm md:text-base">
              <Building2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Начать работу
            </button>
            <button className="border border-yellow-400/40 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:bg-yellow-400/10 transition-all flex items-center justify-center text-sm md:text-base">
              Связаться с нами
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;