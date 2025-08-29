import React, { useState } from 'react';
import { 
  Search, MapPin, Clock, Star, Eye, Download, Filter, Users, 
  ChevronRight, Calendar, Briefcase, GraduationCap, Phone, Mail,
  Award, TrendingUp, User, Building, DollarSign, Heart, Shield
} from 'lucide-react';

const ResumesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' или 'list'

  const specializations = [
    'Все специальности',
    'Продажи',
    'IT и разработка',
    'Маркетинг',
    'Логистика',
    'Администрирование',
    'Бухгалтерия и финансы',
    'Образование',
    'Медицина',
    'Строительство',
    'Производство',
    'Дизайн',
    'Журналистика'
  ];

  const cities = [
    'Все города',
    'Петропавловск',
    'Костанай',
    'Актау',
    'Павлодар',
    'Кокшетау',
    'Рудный',
    'Атырау',
    'Уральск',
    'Семей'
  ];

  const experienceLevels = [
    'Любой опыт',
    'Без опыта',
    '1-3 года',
    '3-6 лет',
    '6+ лет'
  ];

  const salaryRanges = [
    'Любая зарплата',
    'До 150,000 ₸',
    '150,000 - 250,000 ₸',
    '250,000 - 400,000 ₸',
    '400,000 - 600,000 ₸',
    'От 600,000 ₸'
  ];

  const ageRanges = [
    'Любой возраст',
    '18-25 лет',
    '26-35 лет',
    '36-45 лет',
    '46+ лет'
  ];

  const resumes = [
    {
      id: 1,
      name: 'Анна Смирнова',
      avatar: '👩‍💼',
      position: 'Менеджер по продажам',
      age: 28,
      city: 'Петропавловск',
      experience: '5 лет',
      desiredSalary: '300,000 ₸',
      lastActivity: '2 часа назад',
      isOnline: true,
      rating: 4.8,
      views: 234,
      responses: 15,
      education: 'Высшее экономическое',
      skills: ['Продажи', 'CRM', 'Переговоры', 'Английский язык'],
      workExperience: [
        { company: 'ТОО "КазТорг"', position: 'Старший менеджер по продажам', period: '2021-2024' },
        { company: 'Kaspi Red', position: 'Продавец-консультант', period: '2019-2021' }
      ],
      summary: 'Опытный менеджер по продажам с 5-летним стажем. Превышение планов продаж на 120%. Опыт работы с крупными клиентами.',
      isVerified: true,
      isPremium: true,
      languages: ['Казахский', 'Русский', 'Английский']
    },
    {
      id: 2,
      name: 'Максим Козлов',
      avatar: '👨‍💻',
      position: 'Frontend разработчик',
      age: 25,
      city: 'Костанай',
      experience: '3 года',
      desiredSalary: '450,000 ₸',
      lastActivity: '1 день назад',
      isOnline: false,
      rating: 4.9,
      views: 189,
      responses: 23,
      education: 'Высшее техническое',
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Node.js', 'Git'],
      workExperience: [
        { company: 'IT Solutions KZ', position: 'Frontend Developer', period: '2022-2024' },
        { company: 'WebStudio', position: 'Junior Developer', period: '2021-2022' }
      ],
      summary: 'Разработчик с опытом создания современных веб-приложений. Участвовал в 15+ проектах различной сложности.',
      isVerified: true,
      isPremium: false,
      languages: ['Казахский', 'Русский', 'Английский']
    },
    {
      id: 3,
      name: 'Елена Жанболатова',
      avatar: '👩‍⚕️',
      position: 'Медицинская сестра',
      age: 32,
      city: 'Петропавловск',
      experience: '8 лет',
      desiredSalary: '220,000 ₸',
      lastActivity: '3 дня назад',
      isOnline: false,
      rating: 4.7,
      views: 156,
      responses: 8,
      education: 'Среднее медицинское',
      skills: ['Неотложная помощь', 'Работа с пациентами', 'Медицинские процедуры', 'Документооборот'],
      workExperience: [
        { company: 'Городская больница №1', position: 'Старшая медсестра', period: '2020-2024' },
        { company: 'Поликлиника №3', position: 'Медсестра', period: '2016-2020' }
      ],
      summary: 'Опытная медицинская сестра с большим стажем работы в стационаре и поликлинике. Ответственная, внимательная.',
      isVerified: true,
      isPremium: false,
      languages: ['Казахский', 'Русский']
    },
    {
      id: 4,
      name: 'Давид Ким',
      avatar: '👨‍🔧',
      position: 'Автомеханик',
      age: 29,
      city: 'Актау',
      experience: '6 лет',
      desiredSalary: '280,000 ₸',
      lastActivity: '5 часов назад',
      isOnline: true,
      rating: 4.6,
      views: 98,
      responses: 12,
      education: 'Среднее техническое',
      skills: ['Диагностика авто', 'Ремонт двигателей', 'Электрика', 'Слесарные работы'],
      workExperience: [
        { company: 'АвтоСервис "Мастер"', position: 'Ведущий механик', period: '2021-2024' },
        { company: 'СТО "Автодом"', position: 'Автомеханик', period: '2018-2021' }
      ],
      summary: 'Квалифицированный автомеханик с опытом работы с различными марками авто. Быстрая и качественная диагностика.',
      isVerified: false,
      isPremium: false,
      languages: ['Казахский', 'Русский', 'Корейский']
    },
    {
      id: 5,
      name: 'Айгуль Нурбекова',
      avatar: '👩‍🏫',
      position: 'Учитель английского языка',
      age: 26,
      city: 'Павлодар',
      experience: '4 года',
      desiredSalary: '200,000 ₸',
      lastActivity: '1 час назад',
      isOnline: true,
      rating: 4.9,
      views: 145,
      responses: 7,
      education: 'Высшее педагогическое',
      skills: ['Английский язык', 'Методика преподавания', 'IELTS', 'Детская психология'],
      workExperience: [
        { company: 'Лингвистическая школа "Полиглот"', position: 'Преподаватель', period: '2022-2024' },
        { company: 'Средняя школа №45', position: 'Учитель английского', period: '2020-2022' }
      ],
      summary: 'Опытный преподаватель английского языка. Готовлю к международным экзаменам. Индивидуальный подход к каждому ученику.',
      isVerified: true,
      isPremium: true,
      languages: ['Казахский', 'Русский', 'Английский']
    },
    {
      id: 6,
      name: 'Арман Токтаров',
      avatar: '👨‍💼',
      position: 'Логист',
      age: 31,
      city: 'Костанай',
      experience: '7 лет',
      desiredSalary: '350,000 ₸',
      lastActivity: '2 дня назад',
      isOnline: false,
      rating: 4.5,
      views: 78,
      responses: 9,
      education: 'Высшее экономическое',
      skills: ['Складская логистика', '1С:Предприятие', 'Управление персоналом', 'Оптимизация процессов'],
      workExperience: [
        { company: 'ТОО "КазЛогистика"', position: 'Руководитель отдела логистики', period: '2020-2024' },
        { company: 'Магнум', position: 'Логист', period: '2017-2020' }
      ],
      summary: 'Руководитель с большим опытом в сфере логистики и управления складскими процессами. Оптимизация затрат на 25%.',
      isVerified: true,
      isPremium: false,
      languages: ['Казахский', 'Русский']
    }
  ];

  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resume.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resume.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCity = !selectedCity || selectedCity === 'Все города' || resume.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-400/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Найдите лучших кандидатов в 
              <span className="text-yellow-400"> Северном Казахстане</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              {filteredResumes.length} актуальных резюме от квалифицированных специалистов
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
                      placeholder="Должность, навыки или имя кандидата..."
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Специальность</label>
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Опыт работы</label>
                    <select
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      {experienceLevels.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Возраст</label>
                    <select
                      value={selectedAge}
                      onChange={(e) => setSelectedAge(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      {ageRanges.map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Найдено {filteredResumes.length} резюме
              </h2>
              <p className="text-gray-400">Отсортировано по активности</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Вид:</span>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'cards' 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </button>
              </div>

              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-400">Сортировать:</span>
                <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option>По активности</option>
                  <option>По рейтингу</option>
                  <option>По опыту</option>
                  <option>По зарплате</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resumes Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={viewMode === 'cards' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredResumes.map((resume) => (
              <div key={resume.id} className={`bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl hover:border-yellow-400/30 transition-all group cursor-pointer ${
                viewMode === 'cards' ? 'p-6' : 'p-4 md:p-6'
              }`}>
                {viewMode === 'cards' ? (
                  // Card View
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-full flex items-center justify-center text-2xl">
                          {resume.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors truncate">
                              {resume.name}
                            </h3>
                            {resume.isVerified && (
                              <Shield className="w-4 h-4 text-green-400" />
                            )}
                            {resume.isPremium && (
                              <Star className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <p className="text-yellow-400 font-medium text-sm truncate">{resume.position}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                            <span>{resume.age} лет</span>
                            <span>•</span>
                            <span>{resume.city}</span>
                            {resume.isOnline && (
                              <>
                                <span>•</span>
                                <span className="text-green-400">онлайн</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {resume.summary}
                    </p>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                        {resume.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                            +{resume.skills.length - 4} еще
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Опыт</div>
                        <div className="text-white text-sm font-medium">{resume.experience}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Зарплата</div>
                        <div className="text-white text-sm font-medium">{resume.desiredSalary}</div>
                      </div>
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {resume.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          {resume.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {resume.lastActivity}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-xs">
                          Написать
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Candidate Info */}
                    <div className="flex items-center gap-4 flex-grow min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {resume.avatar}
                      </div>
                      
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors truncate">
                            {resume.name}
                          </h3>
                          {resume.isVerified && <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />}
                          {resume.isPremium && <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
                          {resume.isOnline && (
                            <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        
                        <p className="text-yellow-400 font-medium mb-2">{resume.position}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                          <span>{resume.age} лет</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {resume.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {resume.experience}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {resume.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400 mb-1">
                          {resume.desiredSalary}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            {resume.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {resume.views}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{resume.lastActivity}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all">
                          Написать
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-white/5 border border-yellow-400/20 text-white px-8 py-3 rounded-lg hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all">
              Показать еще резюме
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Статистика по резюме
            </h2>
            <p className="text-gray-300 text-lg">
              Актуальные данные по поиску персонала в регионе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400/20 border border-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">15,847</div>
              <div className="text-gray-300">Активных резюме</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400/20 border border-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">2,340</div>
              <div className="text-gray-300">Новых за месяц</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400/20 border border-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">4.7</div>
              <div className="text-gray-300">Средний рейтинг</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400/20 border border-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">12 часов</div>
              <div className="text-gray-300">Среднее время отклика</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Specializations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Популярные специальности
            </h2>
            <p className="text-gray-300 text-lg">
              Самые востребованные направления в Северном Казахстане
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Продажи', count: 2847, icon: '💼' },
              { name: 'IT и разработка', count: 1234, icon: '💻' },
              { name: 'Логистика', count: 987, icon: '🚛' },
              { name: 'Медицина', count: 756, icon: '⚕️' },
              { name: 'Образование', count: 645, icon: '📚' },
              { name: 'Строительство', count: 534, icon: '🏗️' },
              { name: 'Финансы', count: 423, icon: '💰' },
              { name: 'Маркетинг', count: 312, icon: '📊' },
              { name: 'Дизайн', count: 198, icon: '🎨' },
              { name: 'Производство', count: 156, icon: '⚙️' }
            ].map((spec, index) => (
              <div key={index} className="bg-white/5 border border-yellow-400/10 rounded-xl p-4 text-center hover:border-yellow-400/30 transition-all cursor-pointer group">
                <div className="text-2xl mb-3">{spec.icon}</div>
                <div className="text-white font-semibold mb-2 group-hover:text-yellow-400 transition-colors text-sm">
                  {spec.name}
                </div>
                <div className="text-yellow-400 font-bold text-lg">{spec.count}</div>
                <div className="text-gray-400 text-xs">резюме</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Разместите вакансию и найдите лучших кандидатов
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Получите доступ к базе из 15,000+ проверенных резюме специалистов из Северного Казахстана
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center">
              <Building className="w-5 h-5 mr-2" />
              Разместить вакансию
            </button>
            <button className="border border-yellow-400/40 text-white px-8 py-4 rounded-lg font-medium hover:bg-yellow-400/10 transition-all">
              Посмотреть тарифы
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Resumes;