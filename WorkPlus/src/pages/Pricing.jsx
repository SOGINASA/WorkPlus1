// src/pages/Pricing.jsx
import React, { useState } from 'react';
import { Check, X, Zap, TrendingUp, Crown, Rocket, Users, Target, MessageCircle, BarChart, Award, Shield, Clock, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // monthly or annual

  // Тарифы для размещения вакансий
  const subscriptionPlans = [
    {
      name: 'Free',
      icon: Users,
      price: 0,
      priceAnnual: 0,
      description: 'Для начала работы и тестирования платформы',
      color: 'gray',
      features: [
        { text: '1 активная вакансия', included: true },
        { text: 'Размещение на сайте', included: true },
        { text: 'Базовая статистика', included: true },
        { text: 'Доступ к базе резюме (ограниченно)', included: true },
        { text: 'Мультиканальное размещение', included: false },
        { text: 'Продвижение в соцсетях', included: false },
        { text: 'Скоринг кандидатов', included: false },
        { text: 'Персональный менеджер', included: false },
        { text: 'ATS-система', included: false },
      ],
      cta: 'Начать бесплатно',
      popular: false,
    },
    {
      name: 'Start',
      icon: Zap,
      price: 19900,
      priceAnnual: 199000,
      description: 'Для малого бизнеса и стартапов',
      color: 'blue',
      features: [
        { text: '3 активные вакансии', included: true },
        { text: 'Размещение на сайте + Instagram', included: true },
        { text: 'Базовое продвижение в соцсетях', included: true },
        { text: 'Расширенная статистика', included: true },
        { text: 'Полный доступ к базе резюме', included: true },
        { text: 'Email-уведомления об откликах', included: true },
        { text: 'Базовый скоринг кандидатов', included: true },
        { text: 'Персональный менеджер', included: false },
        { text: 'ATS-система', included: false },
      ],
      cta: 'Выбрать Start',
      popular: false,
    },
    {
      name: 'Growth',
      icon: TrendingUp,
      price: 89900,
      priceAnnual: 899000,
      description: 'Для растущих компаний с активным наймом',
      color: 'yellow',
      features: [
        { text: '10 активных вакансий', included: true },
        { text: 'Мультиканальное размещение (сайт + все соцсети)', included: true },
        { text: 'Таргетированная реклама (охват 30-50K)', included: true },
        { text: 'Приоритетное размещение', included: true },
        { text: 'Расширенный скоринг + тесты', included: true },
        { text: 'Telegram/WhatsApp уведомления', included: true },
        { text: 'Детальная аналитика и отчеты', included: true },
        { text: 'Email-рассылка по базе кандидатов', included: true },
        { text: 'ATS-система (лайт)', included: true },
      ],
      cta: 'Выбрать Growth',
      popular: true,
    },
    {
      name: 'Pro',
      icon: Crown,
      price: 299000,
      priceAnnual: 2990000,
      description: 'Для крупных компаний и корпораций',
      color: 'purple',
      features: [
        { text: 'Безлимитные вакансии', included: true },
        { text: 'Полное мультиканальное продвижение', included: true },
        { text: 'Масштабные рекламные кампании', included: true },
        { text: 'ТОП размещение на всех площадках', included: true },
        { text: 'Персональный менеджер 24/7', included: true },
        { text: 'Полная ATS-система', included: true },
        { text: 'Кастомная интеграция', included: true },
        { text: 'Видео-интервью платформа', included: true },
        { text: 'Брендирование страницы компании', included: true },
      ],
      cta: 'Связаться с нами',
      popular: false,
    },
  ];

  // Услуги подбора персонала под ключ
  const recruitmentServices = [
    {
      name: 'Массовый найм',
      icon: Users,
      description: 'Быстрое закрытие массовых позиций',
      positions: ['Продавцы', 'Курьеры', 'Официанты', 'Администраторы', 'Водители'],
      price: '100 000 - 250 000 ₸',
      priceNote: 'за позицию',
      deadline: '7-10 дней',
      features: [
        'Размещение вакансии на всех площадках',
        'Таргетированная реклама',
        'Первичный скрининг кандидатов',
        'Организация собеседований',
        'Проверка рекомендаций',
        'Гарантия замены 30 дней',
      ],
      color: 'blue',
    },
    {
      name: 'Офисный персонал',
      icon: Building,
      description: 'Подбор квалифицированных специалистов',
      positions: ['Менеджеры', 'Бухгалтеры', 'Маркетологи', 'HR-специалисты', 'Аналитики'],
      price: '1 оклад',
      priceNote: 'от зарплаты кандидата',
      deadline: '15-20 дней',
      features: [
        'Глубокий поиск и хедхантинг',
        'Комплексная оценка кандидатов',
        'Проверка профессиональных навыков',
        'Множественные интервью',
        'Проверка референсов',
        'Гарантия замены 90 дней',
      ],
      color: 'yellow',
    },
    {
      name: 'IT & Топ-менеджмент',
      icon: Rocket,
      description: 'Эксклюзивный подбор редких специалистов',
      positions: ['Разработчики', 'Директора', 'C-level', 'Руководители отделов', 'Узкие специалисты'],
      price: '1.5 - 2 оклада',
      priceNote: 'от зарплаты кандидата',
      deadline: '20-30 дней',
      features: [
        'Эксклюзивный поиск и Executive Search',
        'Глубокое профессиональное тестирование',
        'Оценка soft skills и лидерских качеств',
        'Проверка достижений и кейсов',
        'Конфиденциальность процесса',
        'Гарантия замены 6 месяцев',
      ],
      color: 'purple',
    },
  ];

  // Дополнительные услуги
  const additionalServices = [
    {
      name: 'Таргетированная реклама',
      icon: Target,
      price: '30 000 - 150 000 ₸',
      description: 'Продвижение вакансии в соцсетях с таргетингом по аудитории',
    },
    {
      name: 'UGC-видео контент',
      icon: MessageCircle,
      price: '50 000 - 100 000 ₸',
      description: 'Создание привлекательных видео о вакансии для соцсетей',
    },
    {
      name: 'Скоринг и тестирование',
      icon: BarChart,
      price: '5 000 - 15 000 ₸',
      description: 'Комплексная оценка кандидатов с использованием тестов',
    },
    {
      name: 'Брендинг работодателя',
      icon: Award,
      price: 'от 200 000 ₸',
      description: 'Создание привлекательного имиджа компании для кандидатов',
    },
  ];

  const handlePlanSelect = (planName) => {
    if (planName === 'Pro') {
      navigate('/contact');
    } else {
      // Здесь можно добавить логику регистрации или перехода на страницу оплаты
      alert(`Вы выбрали тариф ${planName}. Функционал в разработке.`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4 md:mb-6">
              <Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-xs md:text-sm font-medium">Гибкие тарифы для любого бизнеса</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Тарифы и
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                услуги подбора
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              Выберите подходящий тариф или закажите подбор персонала под ключ. 
              Закрываем вакансии быстрее и дешевле традиционных агентств.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-full p-1 inline-flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Ежемесячно
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'annual'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Ежегодно
                <span className="ml-2 text-xs">-17%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Тарифы на
              <span className="text-yellow-400"> размещение вакансий</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Самостоятельно управляйте процессом найма с нашими инструментами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {subscriptionPlans.map((plan, index) => {
              const Icon = plan.icon;
              const price = billingPeriod === 'monthly' ? plan.price : plan.priceAnnual;
              const period = billingPeriod === 'monthly' ? 'мес' : 'год';
              
              return (
                <div
                  key={index}
                  className={`relative bg-white/5 backdrop-blur-sm border rounded-xl p-6 transition-all ${
                    plan.popular
                      ? 'border-yellow-400/40 shadow-xl shadow-yellow-400/10 scale-105'
                      : 'border-yellow-400/10 hover:border-yellow-400/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold rounded-full">
                      ПОПУЛЯРНЫЙ
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-${plan.color}-500/10 border border-${plan.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${plan.color === 'yellow' ? 'yellow-400' : plan.color === 'purple' ? 'purple-400' : plan.color === 'blue' ? 'blue-400' : 'gray-400'}`} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">
                        {price.toLocaleString()}
                      </span>
                      <span className="text-gray-400 ml-2">₸/{period}</span>
                    </div>
                    {billingPeriod === 'annual' && plan.price > 0 && (
                      <p className="text-sm text-yellow-400 mt-1">
                        Экономия {((plan.price * 12 - plan.priceAnnual)).toLocaleString()} ₸
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handlePlanSelect(plan.name)}
                    className={`w-full py-3 rounded-lg font-medium transition-all mb-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700'
                        : 'bg-white/5 border border-yellow-400/20 text-white hover:bg-white/10'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-600 mr-2 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recruitment Services */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Подбор персонала
              <span className="text-yellow-400"> под ключ</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Мы берем на себя весь процесс поиска и находим идеальных кандидатов для вашей компании
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {recruitmentServices.map((service, index) => {
              const Icon = service.icon;
              
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 md:p-8 hover:border-yellow-400/30 transition-all"
                >
                  <div className={`w-14 h-14 bg-${service.color === 'yellow' ? 'yellow' : service.color === 'purple' ? 'purple' : 'blue'}-500/10 border border-${service.color}-500/20 rounded-lg flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 text-${service.color === 'yellow' ? 'yellow-400' : service.color === 'purple' ? 'purple-400' : 'blue-400'}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>

                  <div className="mb-6 pb-6 border-b border-yellow-400/10">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.positions.map((position, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white/5 border border-yellow-400/20 rounded-full text-xs text-gray-300"
                        >
                          {position}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">{service.price}</div>
                        <div className="text-sm text-gray-400">{service.priceNote}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{service.deadline}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
                  >
                    Заказать подбор
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Дополнительные
              <span className="text-yellow-400"> услуги</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Усильте эффективность подбора персонала
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex items-center justify-center mr-3">
                          <Icon className="w-5 h-5 text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{service.name}</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-lg font-bold text-yellow-400 whitespace-nowrap">{service.price}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-2xl p-6 md:p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-yellow-400/20 rounded-full mb-6">
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Нужна помощь в выборе тарифа?
              </h2>
              
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Наши специалисты помогут подобрать оптимальное решение для вашего бизнеса 
                и расскажут о возможностях платформы
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Связаться с нами
                </button>
                <button
                  onClick={() => window.open('https://wa.me/77001234567', '_blank')}
                  className="border border-yellow-400/40 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:bg-yellow-400/10 transition-all flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">24/7</div>
                  <div className="text-sm text-gray-400">Поддержка клиентов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">30 дней</div>
                  <div className="text-sm text-gray-400">Гарантия возврата</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">850+</div>
                  <div className="text-sm text-gray-400">Довольных клиентов</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;