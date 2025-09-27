import React, { useState, useEffect } from 'react';
import { Briefcase, Building, MapPin, Clock, DollarSign, FileText, Users, Check, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../components/api/AuthUtils';
import { createJob } from '../../../components/api/JobService';

const JobTemplates = () => {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    company_id: '',
    title: '',
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
    is_urgent: false,
    is_featured: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загружаем список компаний
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await apiRequest('/api/job-templates/companies', { method: 'GET' });
        if (res && res.ok) {
          const data = await res.json();
          setCompanies(data);
        }
      } catch (err) {
        console.error('Ошибка загрузки компаний:', err);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? parseInt(form.salary_min) : null,
        salary_max: form.salary_max ? parseInt(form.salary_max) : null,
        requirements: form.requirements || "",
        responsibilities: form.responsibilities || "",
        benefits: form.benefits || "",
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()) : [],
        languages: form.languages ? form.languages.split(',').map((l) => l.trim()) : [],
      };

      await createJob(payload);
      setSuccess('Вакансия успешно создана ✅');

      setForm({
        company_id: '',
        title: '',
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
        is_urgent: false,
        is_featured: false,
      });
    } catch (err) {
      setError(err.message || 'Ошибка при создании вакансии');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-6">
            <Briefcase className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-yellow-400 text-sm font-medium">Создание вакансии</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Разместите вакансию на{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              WorkPlus.kz
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Заполните форму, и кандидаты смогут откликаться уже сегодня
          </p>
        </div>
      </section>

      {/* Alerts */}
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

      {/* Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Компания *</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="company_id"
                  value={form.company_id}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="">Выберите компанию</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название вакансии *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Менеджер по продажам"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Категория *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="">Выберите категорию</option>
                <option value="sales">Продажи</option>
                <option value="marketing">Маркетинг</option>
                <option value="it">IT</option>
                <option value="finance">Финансы</option>
                <option value="service">Сервис</option>
                <option value="logistics">Логистика</option>
                <option value="hr">HR</option>
                <option value="operations">Операционная деятельность</option>
                <option value="customer_service">Поддержка клиентов</option>
                <option value="other">Другое</option>
              </select>
            </div>

            {/* Employment + Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Тип занятости</label>
                <select
                  name="employment_type"
                  value={form.employment_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="full_time">Полная занятость</option>
                  <option value="part_time">Частичная занятость</option>
                  <option value="contract">По договору</option>
                  <option value="internship">Стажировка</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Опыт</label>
                <select
                  name="experience_level"
                  value={form.experience_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="junior">Junior (0-2 года)</option>
                  <option value="middle">Middle (2-5 лет)</option>
                  <option value="senior">Senior (5+ лет)</option>
                </select>
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Зарплата</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="salary_min"
                  value={form.salary_min}
                  onChange={handleChange}
                  placeholder="От (₸)"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
                <input
                  type="number"
                  name="salary_max"
                  value={form.salary_max}
                  onChange={handleChange}
                  placeholder="До (₸)"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Город</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Петропавловск"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Описание *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Опишите вакансию и условия работы"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Требования</label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows="3"
                placeholder="Каждое требование с новой строки"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Обязанности</label>
              <textarea
                name="responsibilities"
                value={form.responsibilities}
                onChange={handleChange}
                rows="3"
                placeholder="Каждое с новой строки"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Условия / бонусы</label>
              <textarea
                name="benefits"
                value={form.benefits}
                onChange={handleChange}
                rows="3"
                placeholder="Каждое с новой строки"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 px-6 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
              >
                {isSubmitting ? 'Создание...' : 'Создать вакансию'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default JobTemplates;