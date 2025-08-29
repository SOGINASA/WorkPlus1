import React, { useState } from 'react';
import { User, Building, Mail, Phone, Lock, Eye, EyeOff, MapPin, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

const RegisterForm = () => {
  const [userType, setUserType] = useState('candidate'); // 'candidate' or 'employer'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: 'Петропавловск',
    position: '',
    companySize: '',
    industry: '',
    agreeTerms: false,
    agreeMarketing: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const cities = [
    'Петропавловск', 'Костанай', 'Актау', 'Павлодар', 'Кокшетау', 
    'Атырау', 'Усть-Каменогорск', 'Семей', 'Актобе', 'Алматы', 'Нур-Султан'
  ];

  const industries = [
    'Розничная торговля', 'Ресторанный бизнес', 'Логистика и доставка',
    'Строительство', 'Производство', 'IT и технологии', 'Банки и финансы',
    'Образование', 'Медицина', 'Услуги', 'Другое'
  ];

  const companySizes = [
    '1-10 сотрудников', '11-50 сотрудников', '51-200 сотрудников', 
    '201-500 сотрудников', '500+ сотрудников'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validation
    if (!formData.email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Некорректный email';
    
    if (!formData.phone) newErrors.phone = 'Телефон обязателен';
    else if (!/^\+7\d{10}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = 'Некорректный формат телефона';
    }
    
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    else if (formData.password.length < 6) newErrors.password = 'Пароль должен содержать минимум 6 символов';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Необходимо согласиться с условиями';

    // Type-specific validation
    if (userType === 'candidate') {
      if (!formData.firstName) newErrors.firstName = 'Имя обязательно';
      if (!formData.lastName) newErrors.lastName = 'Фамилия обязательна';
    } else {
      if (!formData.companyName) newErrors.companyName = 'Название компании обязательно';
      if (!formData.industry) newErrors.industry = 'Выберите сферу деятельности';
      if (!formData.companySize) newErrors.companySize = 'Выберите размер компании';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Registration data:', { userType, ...formData });
      // Here you would typically send the data to your backend
    }
  };

  const benefits = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      text: userType === 'candidate' 
        ? 'Доступ к эксклюзивным вакансиям' 
        : 'Первая вакансия бесплатно'
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      text: userType === 'candidate' 
        ? 'Персональные рекомендации' 
        : 'Быстрые отклики на вакансии'
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      text: userType === 'candidate' 
        ? 'Карьерные консультации' 
        : 'Аналитика и отчеты'
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      text: userType === 'candidate' 
        ? 'Уведомления о новых вакансиях' 
        : 'Мультиканальная дистрибуция'
    }
  ];

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Присоединяйтесь к 
            <span className="text-yellow-400"> WorkPlus.kz</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            Создайте аккаунт и начните поиск работы или найм сотрудников уже сегодня
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Registration Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8">
            {/* User Type Selection */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Регистрация</h2>
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUserType('candidate')}
                  className={`py-2 px-4 rounded-lg font-medium transition-all text-sm md:text-base ${
                    userType === 'candidate'
                      ? 'bg-yellow-400 text-black'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Соискатель
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('employer')}
                  className={`py-2 px-4 rounded-lg font-medium transition-all text-sm md:text-base ${
                    userType === 'employer'
                      ? 'bg-yellow-400 text-black'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Building className="w-4 h-4 inline mr-2" />
                  Работодатель
                </button>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Personal/Company Info */}
              {userType === 'candidate' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Имя *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 md:py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base ${
                        errors.firstName ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Введите имя"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-red-400 text-xs md:text-sm flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Фамилия *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 md:py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base ${
                        errors.lastName ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Введите фамилию"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-red-400 text-xs md:text-sm flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Название компании *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 md:py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base ${
                      errors.companyName ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="ТОО «Название компании»"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-red-400 text-xs md:text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.companyName}
                    </p>
                  )}
                </div>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="example@mail.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-red-400 text-xs md:text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Телефон *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base ${
                        errors.phone ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="+7 (777) 123-45-67"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-red-400 text-xs md:text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Location and Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Город</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
                    >
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {userType === 'candidate' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Желаемая должность</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
                        placeholder="Например: продавец"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Сфера деятельности *</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 md:py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base ${
                        errors.industry ? 'border-red-500' : 'border-gray-700'
                      }`}
                    >
                      <option value="">Выберите сферу</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                    {errors.industry && (
                      <p className="mt-1 text-red-400 text-xs md:text-sm flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.industry}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Company Size for Employers */}
              {userType === 'employer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Размер компании *</label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 md:py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base ${
                      errors.companySize ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="">Выберите размер</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.companySize && (
                    <p className="mt-1 text-red-400 text-xs md:text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.companySize}
                    </p>
                  )}
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Пароль *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-2.5 md:py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base ${
                        errors.password ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Минимум 6 символов"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-red-400 text-xs md:text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Подтвердите пароль *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-2.5 md:py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Повторите пароль"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-red-400 text-xs md:text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-700 bg-gray-800 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-300">
                    Я согласен с{' '}
                    <a href="#" className="text-yellow-400 hover:underline">условиями использования</a>
                    {' '}и{' '}
                    <a href="#" className="text-yellow-400 hover:underline">политикой конфиденциальности</a>
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-red-400 text-xs md:text-sm flex items-center ml-7">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.agreeTerms}
                  </p>
                )}
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-700 bg-gray-800 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-300">
                    Я хочу получать информацию о новых вакансиях и полезные советы по карьере
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 md:py-4 px-6 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm md:text-base"
              >
                Создать аккаунт
              </button>

              <div className="text-center text-sm text-gray-400">
                Уже есть аккаунт?{' '}
                <a href="#" className="text-yellow-400 hover:underline">Войти</a>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/20 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-white">
                {userType === 'candidate' ? 'Преимущества для соискателей' : 'Преимущества для работодателей'}
              </h3>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    {benefit.icon}
                    <span className="ml-3 text-gray-300 text-sm md:text-base">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-lg border border-yellow-400/10">
                <h4 className="font-semibold text-yellow-400 mb-2">
                  {userType === 'candidate' ? '🎯 Быстрый поиск работы' : '⚡ Быстрый найм персонала'}
                </h4>
                <p className="text-sm text-gray-300">
                  {userType === 'candidate' 
                    ? 'Наш алгоритм подберет вакансии, идеально подходящие под ваши навыки и пожелания. Получайте персональные рекомендации каждый день.'
                    : 'Размещайте вакансии на 5+ платформах одновременно. Получайте квалифицированных кандидатов уже в первый день.'
                  }
                </p>
              </div>

              <div className="mt-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">
                  {userType === 'candidate' ? '15,000+' : '850+'}
                </div>
                <div className="text-sm text-gray-300">
                  {userType === 'candidate' ? 'активных соискателей' : 'компаний-партнеров'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;