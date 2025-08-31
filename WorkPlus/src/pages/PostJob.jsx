import React, { useState } from 'react';
import { 
  Building, MapPin, DollarSign, Clock, Users, FileText, 
  Save, Eye, ChevronLeft, ChevronRight, Plus, X, Upload, 
  Check, AlertCircle, Star, Briefcase, Calendar, Award
} from 'lucide-react';

const PostJobPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState({
    // Основная информация
    title: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    salaryType: 'month', // month, hour, project
    employmentType: '',
    workSchedule: '',
    experience: '',
    
    // Описание вакансии
    description: '',
    responsibilities: [],
    requirements: [],
    conditions: [],
    
    // Дополнительная информация
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    companyDescription: '',
    companySize: '',
    companyWebsite: '',
    
    // Настройки публикации
    isUrgent: false,
    highlightJob: false,
    autoRenew: false,
    expiryDays: 30
  });

  const totalSteps = 4;

  const cities = [
    'Астана',
    'Алматы',
    'Петропавловск',
    'Костанай',
    'Актау',
    'Павлодар',
    'Кокшетау',
    'Рудный',
    'Атырау'
  ];

  const employmentTypes = [
    'Полная занятость',
    'Частичная занятость', 
    'Проектная работа',
    'Стажировка',
    'Удаленная работа'
  ];

  const workSchedules = [
    'Полный день',
    'Сменный график',
    'Гибкий график',
    'Удаленно',
    'Вахтовый метод'
  ];

  const experienceLevels = [
    'Без опыта',
    '1-3 года',
    '3-6 лет',
    '6+ лет'
  ];

  const companySizes = [
    '1-10 сотрудников',
    '11-50 сотрудников',
    '51-200 сотрудников',
    '201-1000 сотрудников',
    '1000+ сотрудников'
  ];

  const updateJobData = (field, value) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayItem = (field, item) => {
    if (item.trim()) {
      setJobData(prev => ({
        ...prev,
        [field]: [...prev[field], item.trim()]
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveJob = () => {
    console.log('Saving job:', jobData);
    alert('Вакансия успешно сохранена!');
  };

  const publishJob = () => {
    console.log('Publishing job:', jobData);
    alert('Вакансия успешно опубликована!');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep 
          jobData={jobData} 
          updateJobData={updateJobData}
          cities={cities}
          employmentTypes={employmentTypes}
          workSchedules={workSchedules}
          experienceLevels={experienceLevels}
        />;
      case 2:
        return <JobDescriptionStep 
          jobData={jobData} 
          updateJobData={updateJobData}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
        />;
      case 3:
        return <CompanyInfoStep 
          jobData={jobData} 
          updateJobData={updateJobData}
          companySizes={companySizes}
        />;
      case 4:
        return <PublishSettingsStep 
          jobData={jobData} 
          updateJobData={updateJobData}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Размещение вакансии</h1>
            <span className="text-gray-400">Шаг {currentStep} из {totalSteps}</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span className={currentStep >= 1 ? 'text-yellow-400' : ''}>Основная информация</span>
            <span className={currentStep >= 2 ? 'text-yellow-400' : ''}>Описание вакансии</span>
            <span className={currentStep >= 3 ? 'text-yellow-400' : ''}>О компании</span>
            <span className={currentStep >= 4 ? 'text-yellow-400' : ''}>Публикация</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 md:p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg transition-all ${
              currentStep === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/15 border border-gray-600'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Назад
          </button>

          <div className="flex gap-4">
            <button
              onClick={saveJob}
              className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              <Save className="w-5 h-5 mr-2" />
              Сохранить
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
              >
                Далее
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={publishJob}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
              >
                <Check className="w-5 h-5 mr-2" />
                Опубликовать вакансию
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 1: Basic Information
const BasicInfoStep = ({ jobData, updateJobData, cities, employmentTypes, workSchedules, experienceLevels }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Основная информация о вакансии</h2>
        <p className="text-gray-300">Укажите ключевые параметры вакансии</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-2">
            Название вакансии <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={jobData.title}
            onChange={(e) => updateJobData('title', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Например: Менеджер по продажам"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Компания <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={jobData.company}
              onChange={(e) => updateJobData('company', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Название компании"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Город <span className="text-red-400">*</span>
            </label>
            <select
              value={jobData.location}
              onChange={(e) => updateJobData('location', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="">Выберите город</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-white font-medium mb-2">Зарплата</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="number"
                value={jobData.salaryMin}
                onChange={(e) => updateJobData('salaryMin', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="От"
              />
            </div>
            <div>
              <input
                type="number"
                value={jobData.salaryMax}
                onChange={(e) => updateJobData('salaryMax', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="До"
              />
            </div>
            <div>
              <select
                value={jobData.salaryType}
                onChange={(e) => updateJobData('salaryType', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="month">в месяц</option>
                <option value="hour">в час</option>
                <option value="project">за проект</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Тип занятости <span className="text-red-400">*</span>
            </label>
            <select
              value={jobData.employmentType}
              onChange={(e) => updateJobData('employmentType', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="">Выберите тип занятости</option>
              {employmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              График работы
            </label>
            <select
              value={jobData.workSchedule}
              onChange={(e) => updateJobData('workSchedule', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="">Выберите график</option>
              {workSchedules.map(schedule => (
                <option key={schedule} value={schedule}>{schedule}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            Требуемый опыт
          </label>
          <select
            value={jobData.experience}
            onChange={(e) => updateJobData('experience', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            <option value="">Выберите уровень опыта</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Step 2: Job Description
const JobDescriptionStep = ({ jobData, updateJobData, addArrayItem, removeArrayItem }) => {
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const handleAddResponsibility = () => {
    addArrayItem('responsibilities', newResponsibility);
    setNewResponsibility('');
  };

  const handleAddRequirement = () => {
    addArrayItem('requirements', newRequirement);
    setNewRequirement('');
  };

  const handleAddCondition = () => {
    addArrayItem('conditions', newCondition);
    setNewCondition('');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Описание вакансии</h2>
        <p className="text-gray-300">Детально опишите вакансию для привлечения подходящих кандидатов</p>
      </div>

      {/* General Description */}
      <div>
        <label className="block text-white font-medium mb-2">
          Общее описание вакансии
        </label>
        <textarea
          rows={6}
          value={jobData.description}
          onChange={(e) => updateJobData('description', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          placeholder="Расскажите о вакансии: чем будет заниматься сотрудник, какие цели и задачи стоят перед позицией..."
        />
      </div>

      {/* Responsibilities */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Обязанности</h3>
        
        {/* Current Responsibilities */}
        {jobData.responsibilities.length > 0 && (
          <div className="space-y-2 mb-4">
            {jobData.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300 flex-1">{responsibility}</span>
                <button
                  onClick={() => removeArrayItem('responsibilities', index)}
                  className="text-red-400 hover:text-red-300 transition-colors ml-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Responsibility */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newResponsibility}
            onChange={(e) => setNewResponsibility(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddResponsibility()}
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Добавьте обязанность..."
          />
          <button
            onClick={handleAddResponsibility}
            className="px-4 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Требования</h3>
        
        {/* Current Requirements */}
        {jobData.requirements.length > 0 && (
          <div className="space-y-2 mb-4">
            {jobData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300 flex-1">{requirement}</span>
                <button
                  onClick={() => removeArrayItem('requirements', index)}
                  className="text-red-400 hover:text-red-300 transition-colors ml-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Requirement */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Добавьте требование..."
          />
          <button
            onClick={handleAddRequirement}
            className="px-4 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conditions */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Условия работы</h3>
        
        {/* Current Conditions */}
        {jobData.conditions.length > 0 && (
          <div className="space-y-2 mb-4">
            {jobData.conditions.map((condition, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300 flex-1">{condition}</span>
                <button
                  onClick={() => removeArrayItem('conditions', index)}
                  className="text-red-400 hover:text-red-300 transition-colors ml-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Condition */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Добавьте условие..."
          />
          <button
            onClick={handleAddCondition}
            className="px-4 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Company Information
const CompanyInfoStep = ({ jobData, updateJobData, companySizes }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Информация о компании</h2>
        <p className="text-gray-300">Расскажите о вашей компании и контактной информации</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-2">
            О компании
          </label>
          <textarea
            rows={4}
            value={jobData.companyDescription}
            onChange={(e) => updateJobData('companyDescription', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Краткое описание компании, сфера деятельности, достижения..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Размер компании
            </label>
            <select
              value={jobData.companySize}
              onChange={(e) => updateJobData('companySize', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="">Выберите размер</option>
              {companySizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Веб-сайт компании
            </label>
            <input
              type="url"
              value={jobData.companyWebsite}
              onChange={(e) => updateJobData('companyWebsite', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Контактная информация</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Контактное лицо <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={jobData.contactPerson}
                onChange={(e) => updateJobData('contactPerson', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="ФИО"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Телефон <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={jobData.contactPhone}
                onChange={(e) => updateJobData('contactPhone', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="+7 (___) ___-__-__"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={jobData.contactEmail}
                onChange={(e) => updateJobData('contactEmail', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="contact@company.com"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Publish Settings
const PublishSettingsStep = ({ jobData, updateJobData }) => {
  const calculatePrice = () => {
    let basePrice = 15000; // Base price in tenge
    if (jobData.isUrgent) basePrice += 5000;
    if (jobData.highlightJob) basePrice += 8000;
    if (jobData.autoRenew) basePrice += 3000;
    return basePrice;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Настройки публикации</h2>
        <p className="text-gray-300">Выберите дополнительные опции для вашей вакансии</p>
      </div>

      <div className="space-y-6">
        {/* Job Preview */}
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Предпросмотр вакансии</h3>
          
          <div className="bg-white/5 rounded-lg p-4 border border-yellow-400/20">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-xl font-semibold text-white">{jobData.title || 'Название вакансии'}</h4>
                <p className="text-yellow-400">{jobData.company || 'Название компании'}</p>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {jobData.location || 'Город'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold">
                  {jobData.salaryMin && jobData.salaryMax 
                    ? `${jobData.salaryMin} - ${jobData.salaryMax} ₸`
                    : 'Зарплата не указана'
                  }
                </div>
                <div className="text-gray-400 text-sm">{jobData.employmentType}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Publishing Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Дополнительные опции</h3>
          
          <div className="space-y-4">
            <label className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-600 hover:border-yellow-400/30 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={jobData.isUrgent}
                onChange={(e) => updateJobData('isUrgent', e.target.checked)}
                className="w-5 h-5 text-yellow-400 bg-gray-800 border-gray-600 rounded mt-1 focus:ring-yellow-400"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-white font-medium">Срочная вакансия</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">+5,000 ₸</span>
                </div>
                <p className="text-gray-400 text-sm">Вакансия будет отмечена как срочная и поднята в топ результатов поиска</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-600 hover:border-yellow-400/30 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={jobData.highlightJob}
                onChange={(e) => updateJobData('highlightJob', e.target.checked)}
                className="w-5 h-5 text-yellow-400 bg-gray-800 border-gray-600 rounded mt-1 focus:ring-yellow-400"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Выделить вакансию</span>
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">+8,000 ₸</span>
                </div>
                <p className="text-gray-400 text-sm">Вакансия будет выделена цветом и привлечет больше внимания</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-600 hover:border-yellow-400/30 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={jobData.autoRenew}
                onChange={(e) => updateJobData('autoRenew', e.target.checked)}
                className="w-5 h-5 text-yellow-400 bg-gray-800 border-gray-600 rounded mt-1 focus:ring-yellow-400"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Автопродление</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">+3,000 ₸</span>
                </div>
                <p className="text-gray-400 text-sm">Вакансия автоматически продлится через 30 дней</p>
              </div>
            </label>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-white font-medium mb-2">
            Срок размещения
          </label>
          <select
            value={jobData.expiryDays}
            onChange={(e) => updateJobData('expiryDays', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            <option value={7}>7 дней</option>
            <option value={14}>14 дней</option>
            <option value={30}>30 дней</option>
            <option value={60}>60 дней</option>
          </select>
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Итоговая стоимость</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Базовое размещение ({jobData.expiryDays} дней)</span>
              <span>15,000 ₸</span>
            </div>
            
            {jobData.isUrgent && (
              <div className="flex justify-between text-gray-300">
                <span>Срочная вакансия</span>
                <span>+5,000 ₸</span>
              </div>
            )}
            
            {jobData.highlightJob && (
              <div className="flex justify-between text-gray-300">
                <span>Выделение</span>
                <span>+8,000 ₸</span>
              </div>
            )}
            
            {jobData.autoRenew && (
              <div className="flex justify-between text-gray-300">
                <span>Автопродление</span>
                <span>+3,000 ₸</span>
              </div>
            )}
            
            <div className="border-t border-gray-600 pt-3">
              <div className="flex justify-between text-white text-xl font-bold">
                <span>Итого:</span>
                <span className="text-yellow-400">{calculatePrice().toLocaleString()} ₸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Check */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Перед публикацией убедитесь:</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-green-400" />
              <span>Название вакансии четко описывает позицию</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-green-400" />
              <span>Указаны основные требования и обязанности</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-green-400" />
              <span>Контактная информация актуальна</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-green-400" />
              <span>Информация о компании заполнена</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-1" />
            <div>
              <h4 className="text-white font-medium mb-2">Информация об оплате</h4>
              <p className="text-gray-300 text-sm">
                После публикации вакансии вам будет выставлен счет на оплату. 
                Вакансия останется активной в течение 3 дней без оплаты, 
                после чего будет автоматически снята с публикации.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;