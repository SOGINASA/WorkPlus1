import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  Users,
  TrendingUp,
  Star,
  Calendar,
  Tag,
  FileText,
  MoreHorizontal,
  CheckCircle,
  Clock
} from 'lucide-react';

const JobTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Мокк данные шаблонов
  const templates = [
    {
      id: 1,
      title: 'Продавец-консультант в магазин электроники',
      category: 'Продажи',
      description: 'Универсальный шаблон для вакансий продавца-консультанта в магазинах электроники и бытовой техники',
      usageCount: 45,
      successRate: 78,
      rating: 4.8,
      lastUpdated: '2024-08-25',
      status: 'active',
      tags: ['продажи', 'консультант', 'электроника', 'массовый найм'],
      salary: {
        from: 150000,
        to: 250000,
        currency: '₸'
      }
    },
    {
      id: 2,
      title: 'Курьер на личном транспорте',
      category: 'Логистика',
      description: 'Готовый шаблон для найма курьеров с личным автомобилем или мотоциклом',
      usageCount: 38,
      successRate: 85,
      rating: 4.6,
      lastUpdated: '2024-08-28',
      status: 'active',
      tags: ['курьер', 'доставка', 'личный транспорт', 'гибкий график'],
      salary: {
        from: 120000,
        to: 200000,
        currency: '₸'
      },
      requirements: [
        'Личный автомобиль или мотоцикл в хорошем состоянии',
        'Водительские права соответствующей категории',
        'Опыт вождения от 2 лет',
        'Знание города и районов доставки',
        'Ответственность и пунктуальность'
      ],
      responsibilities: [
        'Доставка заказов клиентам в срок',
        'Поддержание связи с диспетчером',
        'Контроль сохранности груза',
        'Ведение отчетности по доставкам'
      ],
      conditions: [
        'Сдельная оплата + премии',
        'Гибкий график работы',
        'Компенсация топлива',
        'Еженедельные выплаты'
      ]
    },
    {
      id: 3,
      title: 'SMM-менеджер (удаленно)',
      category: 'Маркетинг',
      description: 'Шаблон для поиска SMM-специалистов с возможностью удаленной работы',
      usageCount: 23,
      successRate: 62,
      rating: 4.4,
      lastUpdated: '2024-08-20',
      status: 'active',
      tags: ['smm', 'социальные сети', 'удаленно', 'маркетинг'],
      salary: {
        from: 250000,
        to: 400000,
        currency: '₸'
      },
      requirements: [
        'Опыт работы в SMM от 2 лет',
        'Знание основных социальных платформ',
        'Навыки работы с графическими редакторами',
        'Портфолио выполненных проектов',
        'Аналитическое мышление'
      ],
      responsibilities: [
        'Разработка контент-стратегии',
        'Создание и публикация постов',
        'Ведение рекламных кампаний',
        'Анализ эффективности и отчетность'
      ],
      conditions: [
        'Полностью удаленная работа',
        'Гибкий график',
        'Современные инструменты',
        'Возможности роста и обучения'
      ]
    },
    {
      id: 4,
      title: 'Официант в ресторан',
      category: 'Сервис',
      description: 'Типовой шаблон для найма официантов в рестораны и кафе',
      usageCount: 67,
      successRate: 72,
      rating: 4.5,
      lastUpdated: '2024-08-22',
      status: 'active',
      tags: ['официант', 'ресторан', 'сервис', 'гостеприимство'],
      salary: {
        from: 120000,
        to: 180000,
        currency: '₸'
      },
      requirements: [
        'Опыт работы официантом приветствуется',
        'Знание казахского и русского языков',
        'Коммуникабельность и стрессоустойчивость',
        'Опрятный внешний вид',
        'Готовность работать в выходные'
      ],
      responsibilities: [
        'Обслуживание гостей ресторана',
        'Прием заказов и подача блюд',
        'Консультирование по меню',
        'Поддержание чистоты в зале'
      ],
      conditions: [
        'Официальное трудоустройство',
        'График 2/2 или 6/1',
        'Чаевые остаются у официанта',
        'Питание за счет заведения'
      ]
    },
    {
      id: 5,
      title: 'Бухгалтер на первичную документацию',
      category: 'Финансы',
      description: 'Шаблон для поиска бухгалтеров начального уровня',
      usageCount: 19,
      successRate: 68,
      rating: 4.2,
      lastUpdated: '2024-08-18',
      status: 'active',
      tags: ['бухгалтер', 'первичка', 'документооборот', 'офис'],
      salary: {
        from: 200000,
        to: 300000,
        currency: '₸'
      },
      requirements: [
        'Высшее экономическое образование',
        'Знание основ бухгалтерского учета',
        'Опыт работы от 1 года',
        'Знание 1С (желательно)',
        'Внимательность к деталям'
      ],
      responsibilities: [
        'Ведение первичной документации',
        'Обработка входящих документов',
        'Подготовка отчетов',
        'Работа с поставщиками и клиентами'
      ],
      conditions: [
        'Полный рабочий день',
        'Офис в центре города',
        'Дружный коллектив',
        'Возможности профессионального роста'
      ]
    }
  ];

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'Продажи', label: 'Продажи' },
    { value: 'Логистика', label: 'Логистика' },
    { value: 'Маркетинг', label: 'Маркетинг' },
    { value: 'Сервис', label: 'Сервис' },
    { value: 'Финансы', label: 'Финансы' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const config = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle, label: 'Активен' },
      draft: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock, label: 'Черновик' }
    };
    
    const statusConfig = config[status];
    const IconComponent = statusConfig.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {statusConfig.label}
      </span>
    );
  };

  const handleUseTemplate = (template) => {
    alert(`Создание вакансии на основе шаблона: ${template.title}`);
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
          <div className="mb-4 md:mb-0">
            <div className="inline-flex items-center px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-3">
              <FileText className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-sm font-medium">Библиотека шаблонов</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Шаблоны вакансий</h1>
            <p className="text-gray-300 text-sm md:text-base">Готовые шаблоны для быстрого создания эффективных вакансий</p>
          </div>
          
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2.5 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center text-sm">
            <Plus className="w-4 h-4 mr-2" />
            Создать шаблон
          </button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center">
              <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Всего шаблонов</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{templates.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center">
              <div className="p-2 md:p-3 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Всего использований</p>
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center">
              <div className="p-2 md:p-3 bg-yellow-500/20 rounded-lg">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Средний рейтинг</p>
                <p className="text-2xl md:text-3xl font-bold text-white">4.5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center">
              <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">Успешность</p>
                <p className="text-2xl md:text-3xl font-bold text-white">73%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск шаблонов по названию или тегам..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>

            <button className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-all flex items-center text-sm">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </button>
          </div>
        </div>

        {/* Сетка шаблонов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl hover:border-yellow-400/30 hover:bg-white/10 transition-all group">
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">{template.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{template.description}</p>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Теги */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Метрики */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{template.usageCount}</p>
                    <p className="text-xs text-gray-400">использований</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-400">{template.successRate}%</p>
                    <p className="text-xs text-gray-400">успешность</p>
                  </div>
                  <div className="text-center flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <p className="text-lg font-bold text-white">{template.rating}</p>
                  </div>
                </div>

                {/* Зарплата */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Зарплата:</p>
                  <p className="font-medium text-yellow-400">
                    {template.salary.from.toLocaleString()} - {template.salary.to.toLocaleString()} {template.salary.currency}
                  </p>
                </div>

                {/* Статус */}
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(template.status)}
                  <span className="text-xs text-gray-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {template.lastUpdated}
                  </span>
                </div>

                {/* Действия */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-2 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
                  >
                    Использовать
                  </button>
                  <button
                    onClick={() => handlePreview(template)}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-300" />
                  </button>
                  <button className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
                    <Copy className="w-4 h-4 text-gray-300" />
                  </button>
                  <button className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
                    <Edit className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Модальное окно предпросмотра */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-4 md:p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{selectedTemplate.title}</h2>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-4 md:p-6">
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-2">Описание</h3>
                  <p className="text-gray-300">{selectedTemplate.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-2">Зарплата</h3>
                  <p className="text-yellow-400 font-medium">
                    {selectedTemplate.salary.from.toLocaleString()} - {selectedTemplate.salary.to.toLocaleString()} {selectedTemplate.salary.currency}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-2">Требования</h3>
                  <ul className="space-y-2">
                    {selectedTemplate.requirements.map((req, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="w-1 h-1 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-2">Обязанности</h3>
                  <ul className="space-y-2">
                    {selectedTemplate.responsibilities.map((resp, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="w-1 h-1 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-2">Условия работы</h3>
                  <ul className="space-y-2">
                    {selectedTemplate.conditions.map((condition, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="w-1 h-1 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      handleUseTemplate(selectedTemplate);
                      setShowPreview(false);
                    }}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2.5 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
                  >
                    Использовать шаблон
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-all"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTemplates;