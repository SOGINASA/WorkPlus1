// src/components/api/constants.js

// Типы пользователей
export const USER_TYPES = {
  EMPLOYER: 'employer',
  CANDIDATE: 'candidate', 
  ADMIN: 'admin'
};

// Статусы заявок
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  VIEWED: 'viewed',
  INTERVIEW: 'interview',
  REJECTED: 'rejected',
  HIRED: 'hired'
};

// Типы занятости
export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship'
};

// Уровни опыта
export const EXPERIENCE_LEVELS = {
  JUNIOR: 'junior',
  MIDDLE: 'middle', 
  SENIOR: 'senior'
};

// Категории вакансий
export const JOB_CATEGORIES = {
  SALES: 'sales',
  MARKETING: 'marketing',
  IT: 'it',
  FINANCE: 'finance',
  HR: 'hr',
  OPERATIONS: 'operations',
  CUSTOMER_SERVICE: 'customer_service',
  ADMIN: 'admin',
  OTHER: 'other'
};

// Уровни образования
export const EDUCATION_LEVELS = {
  SCHOOL: 'school',
  COLLEGE: 'college',
  BACHELOR: 'bachelor',
  MASTER: 'master',
  PHD: 'phd'
};

// Размеры компаний
export const COMPANY_SIZES = {
  STARTUP: '1-10',
  SMALL: '11-50', 
  MEDIUM: '51-100',
  LARGE: '101-500',
  ENTERPRISE: '500+'
};

// Валюты
export const CURRENCIES = {
  KZT: 'KZT',
  USD: 'USD',
  EUR: 'EUR',
  RUB: 'RUB'
};

// Периоды зарплат
export const SALARY_PERIODS = {
  HOUR: 'hour',
  MONTH: 'month',
  YEAR: 'year'
};

// Социальные сети
export const SOCIAL_PLATFORMS = {
  INSTAGRAM: 'instagram',
  TELEGRAM: 'telegram',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
  TIKTOK: 'tiktok',
  VK: 'vk'
};

// Города Казахстана
export const KAZAKHSTAN_CITIES = [
  'Алматы',
  'Нур-Султан',
  'Шымкент',
  'Караганда',
  'Актобе',
  'Тараз',
  'Павлодар',
  'Усть-Каменогорск',
  'Семей',
  'Атырау',
  'Костанай',
  'Петропавловск',
  'Орал',
  'Темиртау',
  'Актау',
  'Кокшетау',
  'Талдыкорган',
  'Экибастуз',
  'Рудный',
  'Жезказган',
  'Туркестан'
];

// Переводы для UI
export const TRANSLATIONS = {
  USER_TYPES: {
    [USER_TYPES.EMPLOYER]: 'Работодатель',
    [USER_TYPES.CANDIDATE]: 'Соискатель',
    [USER_TYPES.ADMIN]: 'Администратор'
  },
  
  APPLICATION_STATUS: {
    [APPLICATION_STATUS.PENDING]: 'Ожидает рассмотрения',
    [APPLICATION_STATUS.VIEWED]: 'Просмотрена',
    [APPLICATION_STATUS.INTERVIEW]: 'Собеседование',
    [APPLICATION_STATUS.REJECTED]: 'Отклонена',
    [APPLICATION_STATUS.HIRED]: 'Принят'
  },
  
  EMPLOYMENT_TYPES: {
    [EMPLOYMENT_TYPES.FULL_TIME]: 'Полная занятость',
    [EMPLOYMENT_TYPES.PART_TIME]: 'Частичная занятость',
    [EMPLOYMENT_TYPES.CONTRACT]: 'По договору',
    [EMPLOYMENT_TYPES.INTERNSHIP]: 'Стажировка'
  },
  
  EXPERIENCE_LEVELS: {
    [EXPERIENCE_LEVELS.JUNIOR]: 'Junior (0-2 года)',
    [EXPERIENCE_LEVELS.MIDDLE]: 'Middle (2-5 лет)',
    [EXPERIENCE_LEVELS.SENIOR]: 'Senior (5+ лет)'
  },
  
  JOB_CATEGORIES: {
    [JOB_CATEGORIES.SALES]: 'Продажи',
    [JOB_CATEGORIES.MARKETING]: 'Маркетинг',
    [JOB_CATEGORIES.IT]: 'IT',
    [JOB_CATEGORIES.FINANCE]: 'Финансы',
    [JOB_CATEGORIES.HR]: 'HR',
    [JOB_CATEGORIES.OPERATIONS]: 'Операционная деятельность',
    [JOB_CATEGORIES.CUSTOMER_SERVICE]: 'Служба поддержки',
    [JOB_CATEGORIES.ADMIN]: 'Администрирование',
    [JOB_CATEGORIES.OTHER]: 'Другое'
  }}