import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase, 
  Award, Languages, FileText, Save, Eye, ChevronLeft, ChevronRight, 
  Plus, X, Upload, Check, AlertCircle, Star, Globe
} from 'lucide-react';

const CreateResumePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState({
    // Личная информация
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    dateOfBirth: '',
    photo: null,
    
    // Профессиональная информация
    position: '',
    salary: '',
    workFormat: '',
    readyToRelocate: false,
    
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
    
    // Курсы и сертификаты
    courses: []
  });

  const totalSteps = 6;

  const cities = [
    'Петропавловск', 'Костанай', 'Актау', 'Павлодар', 
    'Кокшетау', 'Рудный', 'Атырау', 'Уральск', 'Семей'
  ];

  const workFormats = [
    'В офисе',
    'Удаленно',
    'Гибридный формат',
    'Готов к командировкам'
  ];

  const educationLevels = [
    'Среднее',
    'Среднее специальное',
    'Неоконченное высшее',
    'Высшее',
    'Магистратура',
    'Аспирантура/PhD'
  ];

  const languageLevels = [
    'Базовый',
    'Разговорный',
    'Свободно',
    'Родной'
  ];

  const popularSkills = [
    'Microsoft Office', 'Excel', 'PowerPoint', 'Word',
    'Продажи', 'Переговоры', 'Клиентский сервис', 'CRM',
    'Английский язык', 'Казахский язык', 'Русский язык',
    '1С:Предприятие', 'Бухгалтерский учет', 'Налогообложение',
    'HTML/CSS', 'JavaScript', 'React', 'Python',
    'Фотография', 'Дизайн', 'Adobe Photoshop', 'Figma'
  ];

  const updateResumeData = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayItem = (field, item) => {
    setResumeData(prev => ({
      ...prev,
      [field]: [...prev[field], item]
    }));
  };

  const removeArrayItem = (field, index) => {
    setResumeData(prev => ({
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

  const saveResume = () => {
    console.log('Saving resume:', resumeData);
    alert('Резюме успешно сохранено!');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Личная информация</h2>
              <p className="text-gray-300">Расскажите о себе основную информацию</p>
            </div>

            {/* Photo Upload */}
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {resumeData.photo ? (
                  <img src={resumeData.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <button className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400/30 transition-all">
                <Upload className="w-4 h-4 mr-2 inline" />
                Загрузить фото
              </button>
              <p className="text-gray-400 text-sm mt-2">JPG, PNG до 5MB</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Имя <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.firstName}
                  onChange={(e) => updateResumeData('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Фамилия <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.lastName}
                  onChange={(e) => updateResumeData('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Введите вашу фамилию"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => updateResumeData('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Телефон <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={resumeData.phone}
                  onChange={(e) => updateResumeData('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="+7 (___) ___-__-__"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Город <span className="text-red-400">*</span>
                </label>
                <select
                  value={resumeData.city}
                  onChange={(e) => updateResumeData('city', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                >
                  <option value="">Выберите город</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Дата рождения
                </label>
                <input
                  type="date"
                  value={resumeData.dateOfBirth}
                  onChange={(e) => updateResumeData('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Профессиональная информация</h2>
              <p className="text-gray-300">Укажите желаемую должность и условия работы</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Желаемая должность <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.position}
                  onChange={(e) => updateResumeData('position', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Например: Менеджер по продажам"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Желаемая зарплата
                  </label>
                  <input
                    type="text"
                    value={resumeData.salary}
                    onChange={(e) => updateResumeData('salary', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Например: 300,000 ₸"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Формат работы
                  </label>
                  <select
                    value={resumeData.workFormat}
                    onChange={(e) => updateResumeData('workFormat', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="">Выберите формат</option>
                    {workFormats.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="readyToRelocate"
                  checked={resumeData.readyToRelocate}
                  onChange={(e) => updateResumeData('readyToRelocate', e.target.checked)}
                  className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                />
                <label htmlFor="readyToRelocate" className="ml-2 text-white">
                  Готов к переезду в другой город
                </label>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  О себе
                </label>
                <textarea
                  rows={6}
                  value={resumeData.summary}
                  onChange={(e) => updateResumeData('summary', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Расскажите о своих сильных сторонах, достижениях и целях. Это поможет работодателям лучше понять вас..."
                />
                <p className="text-gray-400 text-sm mt-2">
                  Рекомендуем написать 3-5 предложений о вашем опыте и целях
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return <ExperienceStep 
          experience={resumeData.experience}
          addExperience={addArrayItem}
          removeExperience={removeArrayItem}
        />;

      case 4:
        return <EducationStep 
          education={resumeData.education}
          addEducation={addArrayItem}
          removeEducation={removeArrayItem}
          educationLevels={educationLevels}
        />;

      case 5:
        return <SkillsStep 
          skills={resumeData.skills}
          languages={resumeData.languages}
          courses={resumeData.courses}
          popularSkills={popularSkills}
          languageLevels={languageLevels}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
        />;

      case 6:
        return <PreviewStep resumeData={resumeData} />;

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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Создание резюме</h1>
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
            <span className={currentStep >= 1 ? 'text-yellow-400' : ''}>Личные данные</span>
            <span className={currentStep >= 2 ? 'text-yellow-400' : ''}>Профессия</span>
            <span className={currentStep >= 3 ? 'text-yellow-400' : ''}>Опыт</span>
            <span className={currentStep >= 4 ? 'text-yellow-400' : ''}>Образование</span>
            <span className={currentStep >= 5 ? 'text-yellow-400' : ''}>Навыки</span>
            <span className={currentStep >= 6 ? 'text-yellow-400' : ''}>Предпросмотр</span>
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
              onClick={saveResume}
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
                onClick={saveResume}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
              >
                <Check className="w-5 h-5 mr-2" />
                Опубликовать резюме
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Experience Step Component
const ExperienceStep = ({ experience, addExperience, removeExperience }) => {
  const [newExp, setNewExp] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleAddExperience = () => {
    if (newExp.company && newExp.position && newExp.startDate) {
      addExperience('experience', { ...newExp });
      setNewExp({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Опыт работы</h2>
        <p className="text-gray-300">Добавьте информацию о местах работы</p>
      </div>

      {/* Existing Experience */}
      {experience.map((exp, index) => (
        <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-white font-semibold text-lg">{exp.position}</h3>
              <p className="text-yellow-400">{exp.company}</p>
              <p className="text-gray-400 text-sm">
                {exp.startDate} - {exp.current ? 'настоящее время' : exp.endDate}
              </p>
            </div>
            <button
              onClick={() => removeExperience('experience', index)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {exp.description && (
            <p className="text-gray-300 text-sm">{exp.description}</p>
          )}
        </div>
      ))}

      {/* Add New Experience */}
      <div className="bg-gray-800/30 rounded-lg p-6 border-2 border-dashed border-gray-600">
        <h3 className="text-white font-semibold mb-4">Добавить место работы</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-white font-medium mb-2">
              Компания <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newExp.company}
              onChange={(e) => setNewExp({...newExp, company: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Название компании"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Должность <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newExp.position}
              onChange={(e) => setNewExp({...newExp, position: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Ваша должность"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Начало работы <span className="text-red-400">*</span>
            </label>
            <input
              type="month"
              value={newExp.startDate}
              onChange={(e) => setNewExp({...newExp, startDate: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Окончание работы
            </label>
            <input
              type="month"
              value={newExp.endDate}
              onChange={(e) => setNewExp({...newExp, endDate: e.target.value})}
              disabled={newExp.current}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newExp.current}
              onChange={(e) => setNewExp({...newExp, current: e.target.checked, endDate: ''})}
              className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
            />
            <span className="ml-2 text-white">Работаю в настоящее время</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-white font-medium mb-2">
            Описание обязанностей
          </label>
          <textarea
            rows={4}
            value={newExp.description}
            onChange={(e) => setNewExp({...newExp, description: e.target.value})}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Опишите ваши основные обязанности и достижения..."
          />
        </div>

        <button
          onClick={handleAddExperience}
          className="flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </button>
      </div>

      {experience.length === 0 && (
        <div className="text-center py-8">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Добавьте ваш первый опыт работы</p>
        </div>
      )}
    </div>
  );
};

// Education Step Component  
const EducationStep = ({ education, addEducation, removeEducation, educationLevels }) => {
  const [newEdu, setNewEdu] = useState({
    institution: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    current: false
  });

  const handleAddEducation = () => {
    if (newEdu.institution && newEdu.degree && newEdu.startYear) {
      addEducation('education', { ...newEdu });
      setNewEdu({
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        current: false
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Образование</h2>
        <p className="text-gray-300">Укажите информацию об образовании</p>
      </div>

      {/* Existing Education */}
      {education.map((edu, index) => (
        <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-white font-semibold text-lg">{edu.institution}</h3>
              <p className="text-yellow-400">{edu.degree}</p>
              {edu.field && <p className="text-gray-300">{edu.field}</p>}
              <p className="text-gray-400 text-sm">
                {edu.startYear} - {edu.current ? 'настоящее время' : edu.endYear}
              </p>
            </div>
            <button
              onClick={() => removeEducation('education', index)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {/* Add New Education */}
      <div className="bg-gray-800/30 rounded-lg p-6 border-2 border-dashed border-gray-600">
        <h3 className="text-white font-semibold mb-4">Добавить образование</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              Учебное заведение <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newEdu.institution}
              onChange={(e) => setNewEdu({...newEdu, institution: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Название учебного заведения"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Уровень образования <span className="text-red-400">*</span>
              </label>
              <select
                value={newEdu.degree}
                onChange={(e) => setNewEdu({...newEdu, degree: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Выберите уровень</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Специальность
              </label>
              <input
                type="text"
                value={newEdu.field}
                onChange={(e) => setNewEdu({...newEdu, field: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Например: Экономика, Информатика"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Год поступления <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={newEdu.startYear}
                onChange={(e) => setNewEdu({...newEdu, startYear: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="2020"
                min="1950"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Год окончания
              </label>
              <input
                type="number"
                value={newEdu.endYear}
                onChange={(e) => setNewEdu({...newEdu, endYear: e.target.value})}
                disabled={newEdu.current}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                placeholder="2024"
                min="1950"
                max={new Date().getFullYear() + 10}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newEdu.current}
                onChange={(e) => setNewEdu({...newEdu, current: e.target.checked, endYear: ''})}
                className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
              />
              <span className="ml-2 text-white">Учусь в настоящее время</span>
            </label>
          </div>

          <button
            onClick={handleAddEducation}
            className="flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </button>
        </div>
      </div>

      {education.length === 0 && (
        <div className="text-center py-8">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Добавьте информацию об образовании</p>
        </div>
      )}
    </div>
  );
};

// Skills Step Component
const SkillsStep = ({ skills, languages, courses, popularSkills, languageLevels, addArrayItem, removeArrayItem }) => {
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState({ name: '', level: '' });
  const [newCourse, setNewCourse] = useState({ name: '', organization: '', year: '', certificate: '' });

  const handleAddSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      addArrayItem('skills', skill);
      setNewSkill('');
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.name && newLanguage.level) {
      addArrayItem('languages', { ...newLanguage });
      setNewLanguage({ name: '', level: '' });
    }
  };

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.organization) {
      addArrayItem('courses', { ...newCourse });
      setNewCourse({ name: '', organization: '', year: '', certificate: '' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Навыки и дополнительная информация</h2>
        <p className="text-gray-300">Укажите ваши навыки, знание языков и курсы</p>
      </div>

      {/* Skills Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Ключевые навыки</h3>
        
        {/* Current Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, index) => (
              <span key={index} className="flex items-center px-3 py-1 bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 rounded-full text-sm">
                {skill}
                <button
                  onClick={() => removeArrayItem('skills', index)}
                  className="ml-2 text-yellow-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add Custom Skill */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(newSkill)}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Введите навык..."
          />
          <button
            onClick={() => handleAddSkill(newSkill)}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Skills */}
        <div>
          <p className="text-gray-400 text-sm mb-3">Популярные навыки:</p>
          <div className="flex flex-wrap gap-2">
            {popularSkills.filter(skill => !skills.includes(skill)).map((skill) => (
              <button
                key={skill}
                onClick={() => handleAddSkill(skill)}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-yellow-400/20 hover:text-yellow-400 transition-all"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Знание языков</h3>
        
        {/* Current Languages */}
        {languages.length > 0 && (
          <div className="space-y-2 mb-4">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <span className="text-white font-medium">{lang.name}</span>
                  <span className="text-gray-400 text-sm ml-2">— {lang.level}</span>
                </div>
                <button
                  onClick={() => removeArrayItem('languages', index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Language */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={newLanguage.name}
              onChange={(e) => setNewLanguage({...newLanguage, name: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Название языка"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={newLanguage.level}
              onChange={(e) => setNewLanguage({...newLanguage, level: e.target.value})}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Уровень</option>
              {languageLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <button
              onClick={handleAddLanguage}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Курсы и сертификаты</h3>
        
        {/* Current Courses */}
        {courses.length > 0 && (
          <div className="space-y-3 mb-4">
            {courses.map((course, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-medium">{course.name}</h4>
                    <p className="text-gray-400 text-sm">{course.organization}</p>
                    {course.year && <p className="text-gray-500 text-sm">{course.year}</p>}
                    {course.certificate && <p className="text-yellow-400 text-sm">Сертификат: {course.certificate}</p>}
                  </div>
                  <button
                    onClick={() => removeArrayItem('courses', index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Course */}
        <div className="space-y-4 p-4 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Название курса"
              />
            </div>
            <div>
              <input
                type="text"
                value={newCourse.organization}
                onChange={(e) => setNewCourse({...newCourse, organization: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Организация"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={newCourse.year}
                onChange={(e) => setNewCourse({...newCourse, year: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Год (необязательно)"
                min="1990"
                max={new Date().getFullYear()}
              />
            </div>
            <div>
              <input
                type="text"
                value={newCourse.certificate}
                onChange={(e) => setNewCourse({...newCourse, certificate: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="№ сертификата (необязательно)"
              />
            </div>
          </div>
          
          <button
            onClick={handleAddCourse}
            className="flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить курс
          </button>
        </div>
      </div>
    </div>
  );
};

// Preview Step Component
const PreviewStep = ({ resumeData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Предпросмотр резюме</h2>
        <p className="text-gray-300">Проверьте все данные перед публикацией</p>
      </div>

      <div className="bg-white text-black rounded-lg p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            {resumeData.photo ? (
              <img src={resumeData.photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="w-12 h-12 text-gray-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {resumeData.firstName} {resumeData.lastName}
          </h1>
          <p className="text-xl text-gray-600 mb-4">{resumeData.position}</p>
          
          <div className="flex justify-center items-center gap-6 text-gray-600 text-sm">
            {resumeData.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {resumeData.email}
              </span>
            )}
            {resumeData.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {resumeData.phone}
              </span>
            )}
            {resumeData.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {resumeData.city}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">О себе</h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {/* Professional Info */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Профессиональная информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumeData.salary && (
              <div>
                <span className="font-medium text-gray-600">Желаемая зарплата:</span>
                <span className="ml-2 text-gray-800">{resumeData.salary}</span>
              </div>
            )}
            {resumeData.workFormat && (
              <div>
                <span className="font-medium text-gray-600">Формат работы:</span>
                <span className="ml-2 text-gray-800">{resumeData.workFormat}</span>
              </div>
            )}
          </div>
        </div>

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Опыт работы</h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-gray-300 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                  <p className="text-gray-600 font-medium">{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-2">
                    {exp.startDate} - {exp.current ? 'настоящее время' : exp.endDate}
                  </p>
                  {exp.description && <p className="text-gray-700">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Образование</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-gray-300 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800">{edu.institution}</h3>
                  <p className="text-gray-600">{edu.degree}</p>
                  {edu.field && <p className="text-gray-600">{edu.field}</p>}
                  <p className="text-gray-500 text-sm">
                    {edu.startYear} - {edu.current ? 'настоящее время' : edu.endYear}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Навыки</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {resumeData.languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Языки</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {resumeData.languages.map((lang, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-800">{lang.name}</span>
                  <span className="text-gray-600">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses */}
        {resumeData.courses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Курсы и сертификаты</h2>
            <div className="space-y-2">
              {resumeData.courses.map((course, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-800">{course.name}</h4>
                  <p className="text-gray-600 text-sm">{course.organization}</p>
                  {course.year && <p className="text-gray-500 text-sm">{course.year}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <button className="flex items-center px-6 py-3 bg-white/10 text-white border border-gray-600 rounded-lg hover:bg-white/15 transition-all">
          <Eye className="w-5 h-5 mr-2" />
          Предпросмотр
        </button>
        <button className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">
          <FileText className="w-5 h-5 mr-2" />
          Скачать PDF
        </button>
      </div>
    </div>
  );
};

export default CreateResumePage;