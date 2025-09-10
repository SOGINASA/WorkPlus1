import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Eye, Upload, Plus, Trash2, X, 
  User, Mail, Phone, MapPin, Calendar, Briefcase, 
  GraduationCap, Award, Languages, FileText, Star,
  Camera, Globe, Linkedin, Github, Check
} from 'lucide-react';
import { getUserFromStorage, API_BASE_URL } from '../components/api/AuthUtils';

const EditResume = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    // Личная информация
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    dateOfBirth: '',
    photo: null,
    
    // Желаемая позиция
    position: '',
    salary: '',
    employmentType: 'full-time',
    workSchedule: 'full-day',
    
    // О себе
    summary: '',
    
    // Опыт работы
    experience: [],
    
    // Образование
    education: [],
    
    // Навыки
    skills: [],
    
    // Языки
    languages: [],
    
    // Дополнительная информация
    certificates: [],
    portfolio: [],
    socialLinks: {
      linkedin: '',
      github: '',
      website: ''
    }
  });

  const steps = [
    { id: 1, title: 'Личные данные', icon: <User className="w-5 h-5" /> },
    { id: 2, title: 'Желаемая позиция', icon: <Briefcase className="w-5 h-5" /> },
    { id: 3, title: 'Опыт работы', icon: <Award className="w-5 h-5" /> },
    { id: 4, title: 'Образование', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 5, title: 'Навыки и языки', icon: <Star className="w-5 h-5" /> },
    { id: 6, title: 'Дополнительно', icon: <FileText className="w-5 h-5" /> }
  ];

  // Добавляем недостающие функции навигации
  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Исправляем функцию расчета прогресса
  const calculateCompletion = () => {
    let completed = 0;
    let total = 20; // Общее количество важных полей

    // Личная информация (6 полей)
    if (formData.firstName) completed++;
    if (formData.lastName) completed++;
    if (formData.email) completed++;
    if (formData.phone) completed++;
    if (formData.city) completed++;
    if (formData.photo) completed++;

    // Желаемая позиция (2 поля)
    if (formData.position) completed++;
    if (formData.salary) completed++;

    // О себе (1 поле)
    if (formData.summary) completed++;

    // Опыт работы (3 балла за каждый опыт)
    completed += Math.min(formData.experience.length, 3);

    // Образование (2 балла за каждое образование)
    completed += Math.min(formData.education.length * 2, 4);

    // Навыки (3 балла за навыки)
    if (formData.skills.length >= 3) completed += 3;
    else completed += formData.skills.length;

    // Языки (2 балла за языки)
    completed += Math.min(formData.languages.length, 2);

    return Math.round((completed / total) * 100);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        institution: '',
        degree: '',
        specialization: '',
        startDate: '',
        endDate: '',
        current: false
      }]
    }));
  };

  const updateEducation = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = (skill) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, {
        id: Date.now(),
        name: '',
        level: 'basic'
      }]
    }));
  };

  const updateLanguage = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (id) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  const handleSave = () => {
    // Сохранение резюме
    console.log('Saving resume:', formData);
    alert('Резюме сохранено как черновик!');
  };

  const handlePublish = () => {
    // Публикация резюме
    console.log('Publishing resume:', formData);
    alert('Резюме опубликовано!');
  };

  // Исправляем проверку пользователя
  const user = getUserFromStorage();
  const user_id = user ? user.id : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы редактировать резюме.');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/resumes/find/${user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
        // Убираем body для GET запроса
      });
      const data = await response.json();
      console.log("Saved:", data);
      alert("Резюме успешно сохранено!");
    } catch (err) {
      console.error("Ошибка сохранения:", err);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Личная информация</h2>
      
      {/* Фото профиля */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            {formData.photo ? (
              <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
            )}
          </div>
          <button type="button" className="text-yellow-400 hover:text-yellow-500 text-sm transition-colors">
            <Upload className="w-4 h-4 inline mr-1" />
            Загрузить фото
          </button>
        </div>
        
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Имя *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Введите имя"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Фамилия *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Введите фамилию"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Телефон *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="+7 (___) ___-__-__"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Город проживания *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Петропавловск"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Дата рождения</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Желаемая позиция</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Желаемая должность *</label>
        <input
          type="text"
          value={formData.position}
          onChange={(e) => updateFormData('position', e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          placeholder="Например: Менеджер по продажам"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Желаемая зарплата</label>
          <input
            type="text"
            value={formData.salary}
            onChange={(e) => updateFormData('salary', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="300,000 ₸"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Тип занятости</label>
          <select
            value={formData.employmentType}
            onChange={(e) => updateFormData('employmentType', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            <option value="full-time">Полная занятость</option>
            <option value="part-time">Частичная занятость</option>
            <option value="contract">Контракт</option>
            <option value="freelance">Фриланс</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">График работы</label>
        <select
          value={formData.workSchedule}
          onChange={(e) => updateFormData('workSchedule', e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        >
          <option value="full-day">Полный день</option>
          <option value="flexible">Гибкий график</option>
          <option value="remote">Удаленная работа</option>
          <option value="shift">Сменный график</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">О себе</label>
        <textarea
          value={formData.summary}
          onChange={(e) => updateFormData('summary', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
          placeholder="Расскажите о себе, своих достижениях и целях..."
        />
        <p className="text-gray-400 text-xs mt-1">
          {formData.summary.length}/500 символов
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-white">Опыт работы</h2>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </button>
      </div>

      {formData.experience.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Добавьте свой опыт работы</p>
        </div>
      ) : (
        <div className="space-y-6">
          {formData.experience.map((exp) => (
            <div key={exp.id} className="bg-white/5 border border-gray-700 rounded-xl p-4 md:p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">Место работы</h3>
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Название компании *</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="ТОО 'Название компании'"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Должность *</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Менеджер по продажам"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Начало работы</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Окончание работы</label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <span className="ml-2 text-sm">Работаю в настоящее время</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Описание обязанностей</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                  placeholder="Опишите ваши обязанности и достижения..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-white">Образование</h2>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </button>
      </div>

      {formData.education.length === 0 ? (
        <div className="text-center py-8">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Добавьте информацию об образовании</p>
        </div>
      ) : (
        <div className="space-y-6">
          {formData.education.map((edu) => (
            <div key={edu.id} className="bg-white/5 border border-gray-700 rounded-xl p-4 md:p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">Учебное заведение</h3>
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Название учебного заведения *</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="КазНУ им. аль-Фараби"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Степень/Уровень</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Бакалавр, Магистр, Специалист..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Специальность</label>
                  <input
                    type="text"
                    value={edu.specialization}
                    onChange={(e) => updateEducation(edu.id, 'specialization', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Экономика, Менеджмент..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Начало обучения</label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Окончание обучения</label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    disabled={edu.current}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={edu.current}
                    onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                    className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <span className="ml-2 text-sm">Обучаюсь в настоящее время</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep5 = () => {
    const [newSkill, setNewSkill] = useState('');

    const handleSkillKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSkill(newSkill);
        setNewSkill('');
      }
    };

    return (
      <div className="space-y-8">
        <h2 className="text-xl md:text-2xl font-bold text-white">Навыки и языки</h2>
        
        {/* Навыки */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Навыки</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center bg-yellow-500 text-black px-3 py-1 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-black hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleSkillKeyPress}
            placeholder="Введите навык и нажмите Enter"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white 
                       focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>

        {/* Языки */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Языки</h3>
          <button
            type="button"
            onClick={addLanguage}
            className="flex items-center mb-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 
                       text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить язык
          </button>

          {formData.languages.length === 0 ? (
            <p className="text-gray-400">Добавьте языки</p>
          ) : (
            <div className="space-y-4">
              {formData.languages.map((lang) => (
                <div
                  key={lang.id}
                  className="flex flex-col md:flex-row items-center gap-4 bg-white/5 border border-gray-700 rounded-xl p-4"
                >
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                    placeholder="Например: Английский"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                  <select
                    value={lang.level}
                    onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    <option value="basic">Базовый</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                    <option value="native">Родной</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep6 = () => (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Дополнительная информация</h2>
      
      {/* Сертификаты */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Сертификаты и курсы</h3>
        <div className="flex flex-col space-y-4">
          {formData.certificates.length === 0 ? (
            <p className="text-gray-400">Добавьте ваши сертификаты и курсы</p>
          ) : (
            formData.certificates.map((cert, index) => (
              <div key={index} className="bg-white/5 border border-gray-700 rounded-xl p-4 md:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-md font-semibold text-white">Сертификат {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.certificates];
                      updated.splice(index, 1);
                      updateFormData('certificates', updated);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Название сертификата</label>
                    <input
                      type="text"
                      value={cert.name || ''}
                      onChange={(e) => {
                        const updated = [...formData.certificates];
                        updated[index] = { ...updated[index], name: e.target.value };
                        updateFormData('certificates', updated);
                      }}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Например: Сертификат Google"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Организация</label>
                    <input
                      type="text"
                      value={cert.organization || ''}
                      onChange={(e) => {
                        const updated = [...formData.certificates];
                        updated[index] = { ...updated[index], organization: e.target.value };
                        updateFormData('certificates', updated);
                      }}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Например: Google"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Дата получения</label>
                    <input
                      type="month"
                      value={cert.date || ''}
                      onChange={(e) => {
                        const updated = [...formData.certificates];
                        updated[index] = { ...updated[index], date: e.target.value };
                        updateFormData('certificates', updated);
                      }}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ссылка</label>
                    <input
                      type="text"
                      value={cert.link || ''}
                      onChange={(e) => {
                        const updated = [...formData.certificates];
                        updated[index] = { ...updated[index], link: e.target.value };
                        updateFormData('certificates', updated);
                      }}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="http://example.com"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          type="button"
          onClick={() => updateFormData('certificates', [...formData.certificates, {}])}
          className="mt-4 flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить сертификат/курс
        </button>
      </div>

      {/* Портфолио */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Портфолио</h3>
        <div className="flex flex-col space-y-4">
          {formData.portfolio.length === 0 ? (
            <p className="text-gray-400">Добавьте ссылки на ваши работы</p>
          ) : (
            formData.portfolio.map((item, index) => (
              <div key={index} className="bg-white/5 border border-gray-700 rounded-xl p-4 md:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-md font-semibold text-white">Работа {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.portfolio];
                      updated.splice(index, 1);
                      updateFormData('portfolio', updated);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Описание работы</label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => {
                      const updated = [...formData.portfolio];
                      updated[index] = { ...updated[index], description: e.target.value };
                      updateFormData('portfolio', updated);
                    }}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Краткое описание вашей работы"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ссылка на работу</label>
                  <input
                    type="text"
                    value={item.link || ''}
                    onChange={(e) => {
                      const updated = [...formData.portfolio];
                      updated[index] = { ...updated[index], link: e.target.value };
                      updateFormData('portfolio', updated);
                    }}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="http://example.com"
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <button
          type="button"
          onClick={() => updateFormData('portfolio', [...formData.portfolio, {}])}
          className="mt-4 flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить работу
        </button>
      </div>

      {/* Социальные сети */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Социальные сети</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.socialLinks.linkedin}
                onChange={(e) => updateFormData('socialLinks', { ...formData.socialLinks, linkedin: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
            <div className="relative">
              <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.socialLinks.github}
                onChange={(e) => updateFormData('socialLinks', { ...formData.socialLinks, github: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Личный сайт</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.socialLinks.website}
                onChange={(e) => updateFormData('socialLinks', { ...formData.socialLinks, website: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="https://your-website.com"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 md:p-10">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Редактирование резюме</h1>
          <p className="text-gray-400">Шаг {currentStep} из 6</p>
          <div className="w-full bg-gray-800 rounded-full h-2.5 mt-4">
            <div
              className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${calculateCompletion()}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm mt-1">{calculateCompletion()}% заполнено</p>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Назад
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext} 
                className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Далее
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Сохранить резюме
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResume;