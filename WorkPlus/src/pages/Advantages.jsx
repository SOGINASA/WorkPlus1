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
  Sparkles,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const AdvantagesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-3xl"></div>
        <div className="relative px-6 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Почему WorkPlus.kz?</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Мы делаем найм
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
                проще и быстрее
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              [МЕСТО ДЛЯ ОСНОВНОГО ОПИСАНИЯ ПРЕИМУЩЕСТВ - здесь можно написать общий текст о том, почему WorkPlus.kz превосходит конкурентов]
            </p>
            
            <div className="flex items-center justify-center animate-bounce">
              <ChevronDown className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Advantages Grid */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Advantage Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-400/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  [ЗАГОЛОВОК ПРЕИМУЩЕСТВА 1]
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  [ОПИСАНИЕ ПЕРВОГО КЛЮЧЕВОГО ПРЕИМУЩЕСТВА - например, скорость размещения, мультиканальность и т.д.]
                </p>
              </div>
            </div>

            {/* Advantage Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-400/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  [ЗАГОЛОВОК ПРЕИМУЩЕСТВА 2]
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  [ОПИСАНИЕ ВТОРОГО КЛЮЧЕВОГО ПРЕИМУЩЕСТВА - например, точность подбора, качество кандидатов]
                </p>
              </div>
            </div>

            {/* Advantage Card 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-400/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  [ЗАГОЛОВОК ПРЕИМУЩЕСТВА 3]
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  [ОПИСАНИЕ ТРЕТЬЕГО КЛЮЧЕВОГО ПРЕИМУЩЕСТВА - например, сообщество, поддержка]
                </p>
              </div>
            </div>

            {/* Advantage Card 4 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-400/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  [ЗАГОЛОВОК ПРЕИМУЩЕСТВА 4]
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  [ОПИСАНИЕ ЧЕТВЕРТОГО КЛЮЧЕВОГО ПРЕИМУЩЕСТВА - например, безопасность, проверка кандидатов]
                </p>
              </div>
            </div>

            {/* Advantage Card 5 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-400/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  [ЗАГОЛОВОК ПРЕИМУЩЕСТВА 5]
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  [ОПИСАНИЕ ПЯТОГО КЛЮЧЕВОГО ПРЕИМУЩЕСТВА - например, экономия времени, автоматизация]
                </p>
              </div>
            </div>

            {/* Advantage Card 6 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-400/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  [ЗАГОЛОВОК ПРЕИМУЩЕСТВА 6]
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  [ОПИСАНИЕ ШЕСТОГО КЛЮЧЕВОГО ПРЕИМУЩЕСТВА - например, эффективность, результативность]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="px-6 py-20 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              WorkPlus.kz vs
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {' '}Конкуренты
              </span>
            </h2>
            <p className="text-xl text-slate-300">
              [МЕСТО ДЛЯ ТЕКСТА О СРАВНЕНИИ - почему мы лучше других платформ]
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left p-6 text-white font-semibold">Возможности</th>
                    <th className="text-center p-6">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">WorkPlus.kz</span>
                      </div>
                    </th>
                    <th className="text-center p-6 text-slate-400">Другие платформы</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700/50">
                    <td className="p-6 text-slate-300">[СРАВНИТЕЛЬНАЯ ХАРАКТЕРИСТИКА 1]</td>
                    <td className="p-6 text-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    </td>
                    <td className="p-6 text-center text-slate-500">Частично</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="p-6 text-slate-300">[СРАВНИТЕЛЬНАЯ ХАРАКТЕРИСТИКА 2]</td>
                    <td className="p-6 text-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    </td>
                    <td className="p-6 text-center text-slate-500">Нет</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="p-6 text-slate-300">[СРАВНИТЕЛЬНАЯ ХАРАКТЕРИСТИКА 3]</td>
                    <td className="p-6 text-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    </td>
                    <td className="p-6 text-center text-slate-500">Базово</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-slate-300">[СРАВНИТЕЛЬНАЯ ХАРАКТЕРИСТИКА 4]</td>
                    <td className="p-6 text-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    </td>
                    <td className="p-6 text-center text-slate-500">Нет</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Результаты, которые
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {' '}говорят сами за себя
              </span>
            </h2>
            <p className="text-xl text-slate-300">
              [МЕСТО ДЛЯ ТЕКСТА О ДОСТИЖЕНИЯХ И РЕЗУЛЬТАТАХ]
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-slate-900" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">[МЕТРИКА 1]</div>
              <div className="text-slate-400">[ОПИСАНИЕ МЕТРИКИ 1]</div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-slate-900" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">[МЕТРИКА 2]</div>
              <div className="text-slate-400">[ОПИСАНИЕ МЕТРИКИ 2]</div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-slate-900" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">[МЕТРИКА 3]</div>
              <div className="text-slate-400">[ОПИСАНИЕ МЕТРИКИ 3]</div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-900" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">[МЕТРИКА 4]</div>
              <div className="text-slate-400">[ОПИСАНИЕ МЕТРИКИ 4]</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-6 py-20 bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Готовы попробовать лучшую HR-платформу?
          </h2>
          <p className="text-xl text-slate-800 mb-8">
            [ПРИЗЫВ К ДЕЙСТВИЮ - текст о том, что пора начать использовать WorkPlus.kz]
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-colors duration-300 inline-flex items-center gap-2 text-lg cursor-pointer"
          >
            Начать сейчас
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvantagesPage;