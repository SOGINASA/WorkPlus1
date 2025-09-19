import React from 'react';
import { 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  Target, 
  Shield, 
  Users,
  Clock,
  Star,
  Award,
  ArrowRight,
  MapPin,
  Building,
  Sparkles,
  MessageSquare,
  BarChart3,
  Layers,
  Globe,
  Smartphone
} from 'lucide-react';

const AdvantagesPage = () => {

  const mainAdvantages = [
    {
      icon: <Layers className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Мультиканальная публикация',
      description: 'Одна вакансия автоматически публикуется на сайте + Instagram + Threads + TikTok + Telegram + VK. Это снижает стоимость привлечения и ускоряет заполнение вакансий.'
    },
    {
      icon: <Target className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Скоринг и быстрая проверка',
      description: 'Мини-тесты, чек-листы и верификация данных помогают отфильтровать подходящих кандидатов. Рейтинг работодателей и соискателей повышает доверие.'
    },
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Контент-машина и комьюнити',
      description: 'Полезные гайды, кейсы и истории успеха создают высокое вовлечение. Локальные паблики по городам повышают конверсию массовых ролей.'
    },
    {
      icon: <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Сервисы "под ключ"',
      description: 'Исходящий сорсинг + таргетированная реклама + первичный скрининг = закрываем вакансии быстро. Массовые роли за 7-10 дней, офисные за 20 дней.'
    }
  ];

  const comparisonData = [
    {
      feature: 'Мультиканальная дистрибуция',
      workplus: true,
      competitors: 'Частично'
    },
    {
      feature: 'Публикация в соцсетях (Instagram, TikTok, Threads)',
      workplus: true,
      competitors: 'Нет'
    },
    {
      feature: 'Скоринг и тестирование кандидатов',
      workplus: true,
      competitors: 'Базово'
    },
    {
      feature: 'Локальные комьюнити по городам',
      workplus: true,
      competitors: 'Нет'
    },
    {
      feature: 'Контент-маркетинг и образовательные материалы',
      workplus: true,
      competitors: 'Редко'
    },
    {
      feature: 'Подбор "под ключ" с гарантией результата',
      workplus: true,
      competitors: 'Частично'
    }
  ];

  const metrics = [
    {
      icon: <Clock className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />,
      number: '7-10 дней',
      description: 'Средний срок закрытия массовых вакансий'
    },
    {
      icon: <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />,
      number: '50%+',
      description: 'Доля откликов из социальных сетей'
    },
    {
      icon: <Target className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />,
      number: '20-40%',
      description: 'Снижение стоимости закрытия по сравнению с hh.kz'
    },
    {
      icon: <Users className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />,
      number: '25-35%',
      description: 'Конверсия "отклик → интервью" благодаря скорингу'
    }
  ];

  const socialChannels = [
    { name: 'Instagram', users: '75%', description: 'активных пользователей в Казахстане' },
    { name: 'TikTok', users: '15.7M', description: 'активных пользователей соцсетей' },
    { name: 'Telegram', users: 'Высокий', description: 'охват и вовлеченность' },
    { name: 'Threads', users: '275M', description: 'пользователей глобально' }
  ];

  return (
    <div className="bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4 md:mb-6">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-xs md:text-sm font-medium">Почему WorkPlus.kz?</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Мы делаем найм
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                проще и быстрее
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              WorkPlus.kz — это HR-экосистема с мультиканальной дистрибуцией, которая закрывает массовые и офисные роли быстрее и дешевле классических джоб-бордов благодаря интеграции с социальными сетями и умным скорингу кандидатов.
            </p>
          </div>
        </div>
      </section>

      {/* Main Advantages */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Наши ключевые
              <span className="text-yellow-400"> преимущества</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Технологии и подходы, которые делают WorkPlus.kz эффективнее традиционных площадок
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {mainAdvantages.map((advantage, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 md:p-8 hover:border-yellow-400/30 transition-all group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mb-6 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all">
                  {advantage.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                  {advantage.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Reach */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Мощь социальных сетей
              <span className="text-yellow-400"> в Казахстане</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Высокое цифровое проникновение дает нам доступ к миллионам потенциальных кандидатов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialChannels.map((channel, index) => (
              <div key={index} className="text-center bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{channel.name}</h3>
                <div className="text-2xl font-bold text-yellow-400 mb-1">{channel.users}</div>
                <p className="text-gray-400 text-sm">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              WorkPlus.kz против
              <span className="text-yellow-400"> конкурентов</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg">
              Сравнение возможностей с hh.kz, rabota.kz и другими классическими площадками
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left p-4 md:p-6 text-white font-semibold text-sm md:text-base">Возможности</th>
                    <th className="text-center p-4 md:p-6 min-w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-sm md:text-base">WorkPlus.kz</span>
                      </div>
                    </th>
                    <th className="text-center p-4 md:p-6 text-gray-400 text-sm md:text-base">Другие платформы</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-700/30 last:border-b-0">
                      <td className="p-4 md:p-6 text-gray-300 text-sm md:text-base">{row.feature}</td>
                      <td className="p-4 md:p-6 text-center">
                        {row.workplus ? (
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-gray-500 text-sm">Нет</span>
                        )}
                      </td>
                      <td className="p-4 md:p-6 text-center text-gray-500 text-sm md:text-base">{row.competitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Результаты, которые
              <span className="text-yellow-400"> говорят сами за себя</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg">
              Конкретные показатели эффективности нашей HR-экосистемы
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  {metric.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{metric.number}</div>
                <div className="text-gray-400 text-sm md:text-base leading-relaxed">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Context */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Почему именно
              <span className="text-yellow-400"> сейчас?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Высокая цифровизация</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                75% населения Казахстана активно использует социальные сети, что дает нам огромную аудиторию для поиска кандидатов
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
              <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Растущее недоверие</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Кандидаты устали от неконкретных вакансий. Они хотят честные условия и быстрый отклик — это наша сильная сторона
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
              <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Новые платформы</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Рост Threads и коротких видео дает дешевый органический охват для HR-контента и вакансий
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Готовы попробовать лучшую HR-платформу?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
            Присоединяйтесь к растущему сообществу работодателей, которые закрывают вакансии быстрее и эффективнее
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center text-sm md:text-base cursor-pointer"
            >
              Начать сейчас
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </button>
            <button 
              onClick={() => window.location.href = '/jobs'}
              className="border border-yellow-400/40 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:bg-yellow-400/10 transition-all text-sm md:text-base cursor-pointer"
            >
              Посмотреть вакансии
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdvantagesPage;