import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  RefreshCw, 
  Wand2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Building
} from 'lucide-react';

const ResumeGeneratorPage = () => {
  const [inputText, setInputText] = useState('');
  const [generatedResume, setGeneratedResume] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);

  // Здесь будет интеграция с AI моделью
  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setGenerationStatus('error');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('loading');

    try {
      // Здесь подключите вашу AI модель
      // const response = await yourAIModel.generate(inputText);
      
      // Имитация работы AI для демонстрации
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResume = `**РЕЗЮМЕ**

**Имя:** ${inputText.includes('меня зовут') ? inputText.split('меня зовут')[1].split(' ')[1] : 'Кандидат'}

**ПРОФЕССИОНАЛЬНАЯ ЦЕЛЬ**
${inputText.slice(0, 150)}...

**ОПЫТ РАБОТЫ**
• 2021-2024: Специалист в области развития бизнеса
• 2019-2021: Аналитик данных
• 2017-2019: Стажер отдела продаж

**ОБРАЗОВАНИЕ**
• Высшее техническое образование
• Курсы повышения квалификации

**НАВЫКИ**
• Аналитическое мышление
• Работа с данными
• Командная работа
• Коммуникативные навыки

**ДОСТИЖЕНИЯ**
• Увеличение продаж на 25%
• Успешная реализация 3 проектов
• Получение сертификации специалиста`;

      setGeneratedResume(mockResume);
      setGenerationStatus('success');
    } catch (error) {
      setGenerationStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResume);
    // Здесь можно добавить уведомление об успешном копировании
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedResume], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const features = [
    {
      icon: <Wand2 className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'AI-генерация',
      description: 'Умный алгоритм создает профессиональное резюме на основе ваших данных'
    },
    {
      icon: <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Быстро',
      description: 'Создание резюме займет всего несколько минут'
    },
    {
      icon: <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Качественно',
      description: 'Профессиональная структура, соответствующая стандартам HR'
    },
    {
      icon: <FileText className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
      title: 'Готово к отправке',
      description: 'Результат сразу готов для отправки работодателям'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4 md:mb-6">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-xs md:text-sm font-medium">AI-генератор резюме WorkPlus.kz</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Создайте профессиональное
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                резюме с помощью AI
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              Наш умный генератор поможет создать привлекательное резюме, которое заметят работодатели. 
              Просто опишите свой опыт, а мы сделаем остальное.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Почему выбирают наш 
              <span className="text-yellow-400"> AI-генератор</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Современные технологии для создания идеального резюме
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
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

      {/* Main Generator Interface */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Расскажите о себе</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Опишите свой опыт, навыки и достижения
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Например: Меня зовут Александр Иванов. Я работаю в сфере продаж уже 5 лет. Имею опыт работы с крупными клиентами, увеличил продажи на 30% в прошлом году. Владею английским языком, умею работать с CRM-системами..."
                    className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                    disabled={isGenerating}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">
                      {inputText.length}/2000 символов
                    </span>
                    {inputText.length > 100 && (
                      <div className="flex items-center text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Достаточно информации
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-1" />
                      Опыт работы
                    </label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                      <option>Без опыта</option>
                      <option>1-3 года</option>
                      <option>3-5 лет</option>
                      <option>5+ лет</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <GraduationCap className="w-4 h-4 inline mr-1" />
                      Образование
                    </label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                      <option>Среднее</option>
                      <option>Среднее специальное</option>
                      <option>Высшее</option>
                      <option>Магистратура</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Star className="w-4 h-4 inline mr-1" />
                      Уровень
                    </label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                      <option>Стажер</option>
                      <option>Специалист</option>
                      <option>Старший специалист</option>
                      <option>Руководитель</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !inputText.trim()}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 px-6 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Генерируем резюме...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Создать резюме
                    </>
                  )}
                </button>

                {generationStatus === 'error' && (
                  <div className="flex items-center text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Пожалуйста, заполните информацию о себе
                  </div>
                )}
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 hover:border-yellow-400/30 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-yellow-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Ваше резюме</h2>
                </div>
                {generatedResume && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg hover:bg-yellow-400/20 transition-colors"
                      title="Копировать"
                    >
                      <Copy className="w-4 h-4 text-yellow-400" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg hover:bg-yellow-400/20 transition-colors"
                      title="Скачать"
                    >
                      <Download className="w-4 h-4 text-yellow-400" />
                    </button>
                    <button
                      onClick={() => setGeneratedResume('')}
                      className="p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg hover:bg-yellow-400/20 transition-colors"
                      title="Очистить"
                    >
                      <RefreshCw className="w-4 h-4 text-yellow-400" />
                    </button>
                  </div>
                )}
              </div>

              <div className="h-[500px] overflow-y-auto">
                {!generatedResume && !isGenerating && (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg mb-2">Здесь появится ваше резюме</p>
                      <p className="text-gray-500 text-sm">Заполните информацию слева и нажмите "Создать резюме"</p>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <Loader2 className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin" />
                      <p className="text-yellow-400 text-lg mb-2">Генерируем ваше резюме</p>
                      <p className="text-gray-400 text-sm">Это займет несколько секунд...</p>
                    </div>
                  </div>
                )}

                {generatedResume && (
                  <div className="bg-white/10 border border-gray-600 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                      {generatedResume}
                    </pre>
                  </div>
                )}
              </div>

              {generationStatus === 'success' && generatedResume && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Резюме успешно создано! Вы можете скопировать или скачать его.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-8 hover:border-yellow-400/30 transition-all">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">
              Советы для создания эффективного 
              <span className="text-yellow-400"> резюме</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all">
                  <User className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">Личная информация</h4>
                <ul className="text-sm md:text-base text-gray-300 space-y-1 leading-relaxed">
                  <li>• Укажите полное имя</li>
                  <li>• Добавьте контактные данные</li>
                  <li>• Можете указать профессиональное фото</li>
                </ul>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all">
                  <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">Опыт работы</h4>
                <ul className="text-sm md:text-base text-gray-300 space-y-1 leading-relaxed">
                  <li>• Перечислите места работы в хронологическом порядке</li>
                  <li>• Опишите ключевые достижения</li>
                  <li>• Используйте цифры и факты</li>
                </ul>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all">
                  <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">Навыки</h4>
                <ul className="text-sm md:text-base text-gray-300 space-y-1 leading-relaxed">
                  <li>• Укажите релевантные навыки</li>
                  <li>• Разделите на технические и мягкие навыки</li>
                  <li>• Подтвердите примерами</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Готовы найти работу мечты?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
            Создайте профессиональное резюме и разместите его на WorkPlus.kz
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/jobs" 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center text-sm md:text-base"
            >
              <Building className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Найти вакансии
            </a>
            <a 
              href="/resume-dashboard" 
              className="border border-yellow-400/40 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:bg-yellow-400/10 transition-all text-sm md:text-base"
            >
              Управление резюме
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeGeneratorPage;