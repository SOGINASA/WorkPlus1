// src/pages/Contact.jsx
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Building, Award, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const url = `${API_BASE_URL}/api/contact/create`;
    let request = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    
    alert('Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4 md:mb-6">
              <Mail className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-xs md:text-sm font-medium">Поддержка 24/7</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Свяжитесь с
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                нашей командой
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Готовы помочь вашему бизнесу найти лучших сотрудников или помочь вам найти идеальную работу
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Контактная информация</h2>
                
                <div className="space-y-6">
                  {/* Office */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Офис</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        г. Петропавловск<br />
                        ул. Конституции Казахстана, 35<br />
                        БЦ "Сарыарка", офис 205
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Телефон</h3>
                      <p className="text-gray-300 text-sm">
                        <a href="tel:+77001234567" className="hover:text-yellow-400 transition-colors">
                          +7 (700) 123-45-67
                        </a>
                      </p>
                      <p className="text-gray-300 text-sm">
                        <a href="tel:+77151234567" className="hover:text-yellow-400 transition-colors">
                          +7 (7152) 12-34-67
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Email</h3>
                      <p className="text-gray-300 text-sm">
                        <a href="mailto:info@workplus.kz" className="hover:text-yellow-400 transition-colors">
                          info@workplus.kz
                        </a>
                      </p>
                      <p className="text-gray-300 text-sm">
                        <a href="mailto:support@workplus.kz" className="hover:text-yellow-400 transition-colors">
                          support@workplus.kz
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Часы работы</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Пн-Пт: 9:00 - 18:00<br />
                        Сб: 10:00 - 15:00<br />
                        Вс: выходной
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Быстрая связь</h3>
                <div className="space-y-3">
                  <a 
                    href="https://wa.me/77001234567" 
                    className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all group"
                  >
                    <MessageCircle className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                    <span className="text-green-400 font-medium">WhatsApp</span>
                  </a>
                  <a 
                    href="https://t.me/workpluskz" 
                    className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all group"
                  >
                    <MessageCircle className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-blue-400 font-medium">Telegram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Отправить сообщение</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Имя *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="Ваше имя"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                        Компания
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="Название компании"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                        Тема обращения *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      >
                        <option value="">Выберите тему</option>
                        <option value="partnership">Партнерство</option>
                        <option value="employer">Вопросы работодателя</option>
                        <option value="jobseeker">Вопросы соискателя</option>
                        <option value="technical">Техническая поддержка</option>
                        <option value="other">Другое</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Сообщение *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
                      placeholder="Опишите ваш вопрос или предложение..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold py-3 md:py-4 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Отправить сообщение</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Почему выбирают
              <span className="text-yellow-400"> WorkPlus.kz</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Мы создаем инновационную HR-экосистему для эффективного поиска и подбора персонала
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Мультиканальность</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Размещение вакансий одновременно на сайте и во всех популярных социальных сетях
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all">
                <Building className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Локальная экспертиза</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Глубокое понимание казахстанского рынка труда и региональных особенностей
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:border-yellow-400/40 group-hover:bg-yellow-400/10 transition-all">
                <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Персональная поддержка</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Индивидуальный подход к каждому клиенту и комплексные решения под ключ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Stats */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4">
                  <Award className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-yellow-400 text-sm font-medium">Гарантия качества</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  Быстрый ответ на ваши вопросы
                </h2>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Наша команда поддержки всегда готова помочь вам. Мы отвечаем на все обращения в течение 24 часов и предоставляем персонализированные решения для вашего бизнеса.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Ответ в течение 24 часов</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Персональный менеджер для корпоративных клиентов</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Консультации по подбору персонала</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Техническая поддержка 24/7</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">24ч</div>
                  <div className="text-gray-300 text-sm">Время ответа</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">98%</div>
                  <div className="text-gray-300 text-sm">Удовлетворенность</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">500+</div>
                  <div className="text-gray-300 text-sm">Обращений/месяц</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">24/7</div>
                  <div className="text-gray-300 text-sm">Поддержка</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;