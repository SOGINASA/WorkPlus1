import React, { useState } from 'react';
import { 
  MapPin, Clock, Building, Users, Star, Share2, Heart, 
  ChevronLeft, Briefcase, DollarSign, Calendar, CheckCircle, 
  AlertCircle, Phone, Mail, Globe, Facebook, Instagram, 
  Send, Upload, Eye, Bookmark
} from 'lucide-react';

const JobDetailPage = () => {
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    phone: '',
    email: '',
    resumeFile: null
  });

  // Моковые данные вакансии (в реальном приложении будут загружаться по ID из URL)
  const job = {
    id: 1,
    title: 'Продавец-консультант',
    company: 'Kaspi Red',
    logo: '🛍️',
    salary: '150,000 - 200,000 ₸',
    salaryMin: 150000,
    salaryMax: 200000,
    location: 'Петропавловск',
    address: 'ТРЦ "Керуен", 1-й этаж',
    type: 'Полная занятость',
    schedule: 'Сменный график 2/2',
    experience: 'От 1 года',
    education: 'Среднее специальное',
    description: `
      Kaspi Red - крупнейшая розничная сеть Казахстана, ищет активного и коммуникабельного продавца-консультанта в магазин электроники и бытовой техники.
      
      Мы предлагаем стабильную работу в дружном коллективе, возможности карьерного роста и достойную заработную плату.
    `,
    responsibilities: [
      'Консультирование покупателей по ассортименту товаров',
      'Помощь в выборе техники согласно потребностям клиента',
      'Оформление продаж и работа с кассой',
      'Поддержание порядка в торговом зале',
      'Участие в инвентаризации товара',
      'Соблюдение стандартов обслуживания компании'
    ],
    requirements: [
      'Опыт работы в продажах от 1 года',
      'Коммуникабельность и клиентоориентированность',
      'Знание казахского и русского языков',
      'Ответственность и пунктуальность',
      'Базовые знания работы с ПК',
      'Готовность работать в сменном графике'
    ],
    conditions: [
      'Официальное трудоустройство',
      'Заработная плата 150,000 - 200,000 тенге',
      'Премии за выполнение плана продаж',
      'Корпоративные скидки на товары',
      'Обучение за счет компании',
      'Дружный коллектив и комфортные условия работы'
    ],
    postedDate: '2 дня назад',
    expiryDate: '2024-02-15',
    isHot: true,
    rating: 4.5,
    applicants: 23,
    views: 156,
    companyInfo: {
      name: 'Kaspi Red',
      logo: '🛍️',
      description: 'Крупнейшая розничная сеть электроники и бытовой техники в Казахстане. Более 120 магазинов по всей стране.',
      employees: '5000+',
      founded: '2012',
      website: 'kaspi.kz',
      phone: '+7 (727) 244-44-44',
      email: 'hr@kaspi.kz',
      address: 'г. Алматы, ул. Наурызбай батыра, 180',
      socialMedia: {
        facebook: 'facebook.com/kaspikz',
        instagram: 'instagram.com/kaspi.kz'
      },
      vacanciesCount: 15,
      rating: 4.5,
      reviews: 234
    }
  };

  const handleApply = () => {
    setIsApplying(true);
  };

  const handleSubmitApplication = () => {
    // Логика отправки заявки
    console.log('Отправка заявки:', applicationData);
    alert('Ваш отклик успешно отправлен!');
    setIsApplying(false);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const similarJobs = [
    { id: 2, title: 'Продавец-кассир', company: 'Sulpak', salary: '140,000 - 180,000 ₸', location: 'Петропавловск' },
    { id: 3, title: 'Консультант по продажам', company: 'Technodom', salary: '160,000 - 220,000 ₸', location: 'Петропавловск' },
    { id: 4, title: 'Менеджер по продажам', company: 'DNS', salary: '200,000 - 300,000 ₸', location: 'Петропавловск' }
  ];

  return (
    <div>
      {/* Navigation */}
      <div className="bg-white/5 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Назад к поиску вакансий
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-xl flex items-center justify-center text-3xl md:text-4xl flex-shrink-0">
                  {job.logo}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">{job.title}</h1>
                        {job.isHot && (
                          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-full">
                            HOT
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-300 mb-4">
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

                      <div className="text-3xl font-bold text-yellow-400 mb-4">
                        {job.salary}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={handleSave}
                        className={`p-2 rounded-lg border transition-all ${
                          isSaved 
                            ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-400' 
                            : 'border-gray-600 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-400'
                        }`}
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={handleShare}
                          className="p-2 rounded-lg border border-gray-600 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-400 transition-all"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        
                        {showShareMenu && (
                          <div className="absolute top-12 right-0 bg-gray-800 border border-gray-700 rounded-lg p-4 min-w-[200px] z-10">
                            <p className="text-white text-sm mb-3">Поделиться вакансией:</p>
                            <div className="flex gap-2">
                              <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                <Facebook className="w-4 h-4 text-white" />
                              </button>
                              <button className="p-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors">
                                <Instagram className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {job.views} просмотров
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.applicants} откликов
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Опубликовано {job.postedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      До {job.expiryDate}
                    </span>
                  </div>

                  <button 
                    onClick={handleApply}
                    className="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Откликнуться на вакансию
                  </button>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-8">
              {/* Description */}
              <section className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Описание вакансии</h2>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </section>

              {/* Responsibilities */}
              <section className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Обязанности</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Requirements */}
              <section className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Требования</h2>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Conditions */}
              <section className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Условия работы</h2>
                <ul className="space-y-3">
                  {job.conditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      {condition}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Детали вакансии</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Зарплата</div>
                  <div className="text-white font-semibold">{job.salary}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">График работы</div>
                  <div className="text-white font-semibold">{job.schedule}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Опыт работы</div>
                  <div className="text-white font-semibold">{job.experience}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Образование</div>
                  <div className="text-white font-semibold">{job.education}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Адрес</div>
                  <div className="text-white font-semibold">{job.address}</div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">О компании</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-lg flex items-center justify-center text-xl">
                  {job.companyInfo.logo}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{job.companyInfo.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {job.companyInfo.rating} ({job.companyInfo.reviews} отзывов)
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {job.companyInfo.description}
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Сотрудники:</span>
                  <span className="text-white">{job.companyInfo.employees}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Основана:</span>
                  <span className="text-white">{job.companyInfo.founded}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Вакансий:</span>
                  <span className="text-white">{job.companyInfo.vacanciesCount}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <a href={`https://${job.companyInfo.website}`} className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm">
                  <Globe className="w-4 h-4" />
                  {job.companyInfo.website}
                </a>
                <a href={`tel:${job.companyInfo.phone}`} className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm">
                  <Phone className="w-4 h-4" />
                  {job.companyInfo.phone}
                </a>
                <a href={`mailto:${job.companyInfo.email}`} className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  {job.companyInfo.email}
                </a>
              </div>

              <button className="w-full bg-white/10 border border-gray-600 text-white py-2 px-4 rounded-lg hover:bg-white/15 transition-all text-sm">
                Все вакансии компании
              </button>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Похожие вакансии</h3>
              <div className="space-y-4">
                {similarJobs.map((similarJob) => (
                  <div key={similarJob.id} className="p-4 bg-white/5 rounded-lg border border-gray-700 hover:border-yellow-400/30 transition-all cursor-pointer">
                    <h4 className="text-white font-semibold mb-2 text-sm">{similarJob.title}</h4>
                    <div className="text-gray-400 text-xs mb-2">{similarJob.company}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-semibold text-sm">{similarJob.salary}</span>
                      <span className="text-gray-500 text-xs">{similarJob.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isApplying && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-yellow-400/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Отклик на вакансию</h2>
                <button 
                  onClick={() => setIsApplying(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold">{job.title}</h3>
                <p className="text-gray-300 text-sm">{job.company} • {job.location}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Телефон <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={applicationData.email}
                    onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Резюме</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 mb-2">Загрузите ваше резюме</p>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                    <button type="button" className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm">
                      Выбрать файл
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Сопроводительное письмо</label>
                  <textarea
                    rows={6}
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Расскажите, почему вы подходите для этой позиции..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitApplication}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all"
                  >
                    Отправить отклик
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;