import React, { useState, useEffect } from 'react';
import { Briefcase, Building, MapPin, Clock, DollarSign, FileText, Users, ArrowRight, AlertCircle, Check, X } from 'lucide-react';
import { useAuth } from '../components/api/AuthUtils';
import JobApiService from '../components/api/JobApiService';

const CreateJobPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    company_id: '',
    category: '',
    employment_type: 'full_time',
    experience_level: 'middle',
    city: '',
    address: '',
    remote_work: false,
    salary_min: '',
    salary_max: '',
    salary_currency: 'KZT',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    skills: '',
    languages: '',
    education_required: 'bachelor',
    publish_to_instagram: false,
    publish_to_telegram: false,
    publish_to_facebook: false,
    publish_to_linkedin: false,
    is_urgent: false,
    is_featured: false
  });

  const [companies, setCompanies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Проверка авторизации и загрузка данных
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setError('Необходима авторизация');
        setLoading(false);
        return;
      }
      
      if (user.user_type !== 'employer') {
        setError('Создавать вакансии могут только работодатели');
        setLoading(false);
        return;
      }
      
      // Устанавливаем company_id из профиля пользователя
      setFormData(prev => ({
        ...prev,
        company_id: user.company_id || ''
      }));
      
      loadCompanies();
    }
  }, [user, authLoading]);

  const loadCompanies = async () => {
    try {
      const data = await JobApiService.getCompanies();
      setCompanies(data.companies || []);
    } catch (err) {
      console.error('Ошибка загрузки компаний:', err);
      // Не показываем ошибку пользователю, просто логируем
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Подготовка данных для отправки
      const submitData = {
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        languages: formData.languages ? formData.languages.split(',').map(l => l.trim()) : []
      };

      const result = await JobApiService.createJob(submitData);

      setSuccess('Вакансия успешно создана! Переход на страницу управления...');
      
      // Очищаем форму
      setFormData({
        title: '',
        company_id: user.company_id || '',
        category: '',
        employment_type: 'full_time',
        experience_level: 'middle',
        city: '',
        address: '',
        remote_work: false,
        salary_min: '',
        salary_max: '',
        salary_currency: 'KZT',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        skills: '',
        languages: '',
        education_required: 'bachelor',
        publish_to_instagram: false,
        publish_to_telegram: false,
        publish_to_facebook: false,
        publish_to_linkedin: false,
        is_urgent: false,
        is_featured: false
      });

      // Перенаправляем на страницу управления вакансиями через 3 секунды
      setTimeout(() => {
        window.location.href = '/jobs';
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Показываем загрузку авторизации
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Доступ запрещен</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Войти в систему
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>

        <div className="max-w-4xl mx-auto relative text-center">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-6">
            <Briefcase className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-yellow-400 text-sm font-medium">Создание вакансии</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Разместите свою вакансию на{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              WorkPlus.kz
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Заполните форму и начните получать отклики кандидатов уже в течение суток
          </p>
        </div>
      </section>

      {/* Уведомления */}
      {success && (
        <div className="max-w-3xl mx-auto px-4 mb-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center">
            <Check className="w-5 h-5 text-green-400 mr-3" />
            <span className="text-green-300">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-3xl mx-auto px-4 mb-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Form Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-10">
          <div className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Название вакансии <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Например: Менеджер по продажам"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Компания <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                >
                  <option value="">Выберите компанию</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Категория <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
              >
                <option value="">Выберите категорию</option>
                <option value="sales">Продажи</option>
                <option value="marketing">Маркетинг</option>
                <option value="it">IT</option>
                <option value="finance">Финансы</option>
                <option value="hr">HR</option>
                <option value="operations">Операционная деятельность</option>
                <option value="customer_service">Служба поддержки</option>
                <option value="admin">Администрирование</option>
                <option value="other">Другое</option>
              </select>
            </div>

            {/* Location and Remote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Город</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Например: Петропавловск"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Удаленная работа</label>
                <div className="flex items-center h-12">
                  <input
                    type="checkbox"
                    name="remote_work"
                    checked={formData.remote_work}
                    onChange={handleChange}
                    className="h-4 w-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <span className="ml-2 text-gray-300">Возможна удаленная работа</span>
                </div>
              </div>
            </div>

            {/* Employment Type and Experience Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Тип занятости</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                  >
                    <option value="full_time">Полная занятость</option>
                    <option value="part_time">Частичная занятость</option>
                    <option value="contract">По договору</option>
                    <option value="internship">Стажировка</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Уровень опыта</label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                >
                  <option value="junior">Junior (0-2 года)</option>
                  <option value="middle">Middle (2-5 лет)</option>
                  <option value="senior">Senior (5+ лет)</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Зарплатная вилка</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="salary_min"
                    value={formData.salary_min}
                    onChange={handleChange}
                    placeholder="От (₸)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="salary_max"
                    value={formData.salary_max}
                    onChange={handleChange}
                    placeholder="До (₸)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Описание вакансии <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Опишите вакансию, условия работы и то, что ждет кандидата"
                  rows="4"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base resize-none"
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Требования к кандидату</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Например: опыт работы от 1 года, знание Excel, коммуникабельность"
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base resize-none"
                />
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Обязанности</label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="Перечислите основные обязанности на этой позиции"
                rows="3"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base resize-none"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ключевые навыки</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Например: Excel, CRM, переговоры (через запятую)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
              />
            </div>

            {/* Social Media Publishing */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Публикация в соцсетях</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="publish_to_instagram"
                    checked={formData.publish_to_instagram}
                    onChange={handleChange}
                    className="h-4 w-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <span className="ml-2 text-gray-300">Instagram</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="publish_to_telegram"
                    checked={formData.publish_to_telegram}
                    onChange={handleChange}
                    className="h-4 w-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <span className="ml-2 text-gray-300">Telegram</span>
                </label>
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Дополнительные опции</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_urgent"
                    checked={formData.is_urgent}
                    onChange={handleChange}
                    className="h-4 w-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <span className="ml-2 text-gray-300">Срочная вакансия (+10,000 ₸)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <span className="ml-2 text-gray-300">Разместить в топе (+15,000 ₸)</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 px-6 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Создание вакансии...' : 'Создать вакансию'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateJobPage;