import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Clock,
  Bell,
  Shield,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Camera,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Upload,
  Edit3,
  Trash2,
  Plus,
  X
} from 'lucide-react';

const SettingSection = ({ title, description, children, icon: Icon }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-6">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="w-6 h-6 text-yellow-400 mr-3" />}
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
};

const ToggleSwitch = ({ enabled, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          enabled ? 'bg-yellow-400' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text", placeholder, required = false, description }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
      />
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  );
};

const SelectField = ({ label, value, onChange, options, required = false, description }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  );
};

const SocialMediaCard = ({ platform, username, connected, onConnect, onDisconnect, onEdit }) => {
  const getPlatformIcon = (platform) => {
    // In a real app, you'd use actual social media icons
    return <Globe className="w-5 h-5" />;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: 'from-pink-400 to-purple-600',
      telegram: 'from-blue-400 to-blue-600',
      tiktok: 'from-gray-800 to-black',
      threads: 'from-blue-400 to-purple-600',
      default: 'from-gray-600 to-gray-800'
    };
    return colors[platform.toLowerCase()] || colors.default;
  };

  return (
    <div className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getPlatformColor(platform)} mr-3`}>
            {getPlatformIcon(platform)}
          </div>
          <div>
            <h4 className="font-medium text-white capitalize">{platform}</h4>
            <p className="text-sm text-gray-400">
              {connected ? `@${username}` : 'Не подключено'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {connected ? (
            <>
              <span className="px-2 py-1 bg-green-500/20 border border-green-400/30 text-green-400 text-xs rounded-full">
                Подключено
              </span>
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={onDisconnect}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onConnect}
              className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-xs rounded-lg hover:bg-yellow-400/30 transition-colors"
            >
              Подключить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    // Company Information
    companyName: 'WorkPlus Kazakhstan',
    companyDescription: 'HR-экосистема с мультиканальной дистрибуцией для быстрого и эффективного подбора персонала',
    website: 'https://workplus.kz',
    email: 'info@workplus.kz',
    phone: '+7 777 123 4567',
    address: 'г. Петропавловск, ул. Конституции Казахстана, 25',
    
    // Platform Settings
    timezone: 'Asia/Almaty',
    language: 'ru',
    currency: 'KZT',
    dateFormat: 'DD.MM.YYYY',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    
    // Privacy & Security
    profileVisibility: 'public',
    dataRetention: '24',
    twoFactorAuth: true,
    sessionTimeout: '120',
    
    // Social Media
    autoPosting: true,
    crossPosting: true,
    socialAnalytics: true
  });

  const [socialAccounts] = useState([
    { platform: 'instagram', username: 'workplus_kz', connected: true },
    { platform: 'telegram', username: 'workplus_kz_channel', connected: true },
    { platform: 'tiktok', username: '', connected: false },
    { platform: 'threads', username: 'workplus_kz', connected: true }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const timezoneOptions = [
    { value: 'Asia/Almaty', label: 'Алматы (GMT+6)' },
    { value: 'Asia/Aqtobe', label: 'Актобе (GMT+5)' },
    { value: 'Asia/Atyrau', label: 'Атырау (GMT+5)' },
    { value: 'UTC', label: 'UTC (GMT+0)' }
  ];

  const languageOptions = [
    { value: 'ru', label: 'Русский' },
    { value: 'kk', label: 'Қазақ тілі' },
    { value: 'en', label: 'English' }
  ];

  const currencyOptions = [
    { value: 'KZT', label: 'Тенге (₸)' },
    { value: 'USD', label: 'Доллар США ($)' },
    { value: 'EUR', label: 'Евро (€)' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Общие настройки</h1>
              <p className="mt-1 text-sm text-gray-300">
                Основные параметры платформы и профиля компании
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              {saveStatus && (
                <div className={`flex items-center px-3 py-1 rounded-lg text-sm ${
                  saveStatus === 'success' 
                    ? 'bg-green-500/20 border border-green-400/30 text-green-400'
                    : 'bg-red-500/20 border border-red-400/30 text-red-400'
                }`}>
                  {saveStatus === 'success' ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-2" />
                  )}
                  {saveStatus === 'success' ? 'Сохранено' : 'Ошибка сохранения'}
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Information */}
        <SettingSection
          title="Информация о компании"
          description="Основные данные вашей организации"
          icon={Building2}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Название компании"
              value={settings.companyName}
              onChange={(value) => updateSetting('companyName', value)}
              required
            />
            <InputField
              label="Веб-сайт"
              value={settings.website}
              onChange={(value) => updateSetting('website', value)}
              type="url"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание компании
            </label>
            <textarea
              value={settings.companyDescription}
              onChange={(e) => updateSetting('companyDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Email"
              value={settings.email}
              onChange={(value) => updateSetting('email', value)}
              type="email"
              required
            />
            <InputField
              label="Телефон"
              value={settings.phone}
              onChange={(value) => updateSetting('phone', value)}
              type="tel"
            />
          </div>

          <InputField
            label="Адрес"
            value={settings.address}
            onChange={(value) => updateSetting('address', value)}
          />
        </SettingSection>

        {/* Platform Settings */}
        <SettingSection
          title="Настройки платформы"
          description="Региональные параметры и локализация"
          icon={Globe}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Часовой пояс"
              value={settings.timezone}
              onChange={(value) => updateSetting('timezone', value)}
              options={timezoneOptions}
              required
            />
            <SelectField
              label="Язык интерфейса"
              value={settings.language}
              onChange={(value) => updateSetting('language', value)}
              options={languageOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Валюта"
              value={settings.currency}
              onChange={(value) => updateSetting('currency', value)}
              options={currencyOptions}
              required
            />
            <InputField
              label="Формат даты"
              value={settings.dateFormat}
              onChange={(value) => updateSetting('dateFormat', value)}
              description="Например: DD.MM.YYYY или MM/DD/YYYY"
            />
          </div>
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection
          title="Уведомления"
          description="Настройте способы получения уведомлений"
          icon={Bell}
        >
          <div className="space-y-2">
            <ToggleSwitch
              enabled={settings.emailNotifications}
              onChange={(value) => updateSetting('emailNotifications', value)}
              label="Email уведомления"
              description="Получать важные уведомления на электронную почту"
            />
            <ToggleSwitch
              enabled={settings.smsNotifications}
              onChange={(value) => updateSetting('smsNotifications', value)}
              label="SMS уведомления"
              description="Получать критические уведомления по SMS"
            />
            <ToggleSwitch
              enabled={settings.pushNotifications}
              onChange={(value) => updateSetting('pushNotifications', value)}
              label="Push уведомления"
              description="Получать уведомления в браузере"
            />
            <ToggleSwitch
              enabled={settings.marketingEmails}
              onChange={(value) => updateSetting('marketingEmails', value)}
              label="Маркетинговые рассылки"
              description="Получать информацию о новых функциях и акциях"
            />
          </div>
        </SettingSection>

        {/* Privacy & Security */}
        <SettingSection
          title="Конфиденциальность и безопасность"
          description="Настройки защиты данных и приватности"
          icon={Shield}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <SelectField
              label="Видимость профиля"
              value={settings.profileVisibility}
              onChange={(value) => updateSetting('profileVisibility', value)}
              options={[
                { value: 'public', label: 'Публичный' },
                { value: 'private', label: 'Приватный' },
                { value: 'contacts', label: 'Только для контактов' }
              ]}
            />
            <InputField
              label="Время хранения данных (месяцы)"
              value={settings.dataRetention}
              onChange={(value) => updateSetting('dataRetention', value)}
              type="number"
              description="Автоматическое удаление неактивных данных"
            />
          </div>

          <div className="space-y-2 mb-4">
            <ToggleSwitch
              enabled={settings.twoFactorAuth}
              onChange={(value) => updateSetting('twoFactorAuth', value)}
              label="Двухфакторная аутентификация"
              description="Дополнительный уровень защиты вашего аккаунта"
            />
          </div>

          <InputField
            label="Таймаут сессии (минуты)"
            value={settings.sessionTimeout}
            onChange={(value) => updateSetting('sessionTimeout', value)}
            type="number"
            description="Автоматический выход при неактивности"
          />
        </SettingSection>

        {/* Social Media Integration */}
        <SettingSection
          title="Интеграция с социальными сетями"
          description="Управление подключенными аккаунтами"
          icon={Globe}
        >
          <div className="space-y-2 mb-6">
            <ToggleSwitch
              enabled={settings.autoPosting}
              onChange={(value) => updateSetting('autoPosting', value)}
              label="Автоматическая публикация"
              description="Автоматически публиковать вакансии в подключенные соцсети"
            />
            <ToggleSwitch
              enabled={settings.crossPosting}
              onChange={(value) => updateSetting('crossPosting', value)}
              label="Кросс-постинг"
              description="Публиковать одну вакансию во все подключенные соцсети"
            />
            <ToggleSwitch
              enabled={settings.socialAnalytics}
              onChange={(value) => updateSetting('socialAnalytics', value)}
              label="Социальная аналитика"
              description="Собирать статистику по публикациям в соцсетях"
            />
          </div>

          <h4 className="text-sm font-medium text-gray-300 mb-4">Подключенные аккаунты</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialAccounts.map((account, index) => (
              <SocialMediaCard
                key={index}
                platform={account.platform}
                username={account.username}
                connected={account.connected}
                onConnect={() => console.log(`Connect ${account.platform}`)}
                onDisconnect={() => console.log(`Disconnect ${account.platform}`)}
                onEdit={() => console.log(`Edit ${account.platform}`)}
              />
            ))}
          </div>
        </SettingSection>
      </div>
    </div>
  );
};

export default GeneralSettings;