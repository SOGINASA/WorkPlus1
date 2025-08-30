import React, { useState } from 'react';
import {
  Plug,
  Settings,
  Database,
  Globe,
  Smartphone,
  CreditCard,
  Mail,
  MessageCircle,
  FileText,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Edit3,
  Trash2,
  Plus,
  Key,
  Code,
  Server,
  Cloud,
  Link,
  Activity,
  Clock,
  Save,
  AlertCircle
} from 'lucide-react';

const IntegrationCard = ({ 
  integration, 
  onConnect, 
  onDisconnect, 
  onEdit, 
  onTest, 
  onViewLogs 
}) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'connected': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending': return <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'connected': return 'bg-green-500/20 border-green-400/30 text-green-400';
      case 'error': return 'bg-red-500/20 border-red-400/30 text-red-400';
      case 'pending': return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-400';
      default: return 'bg-gray-500/20 border-gray-400/30 text-gray-400';
    }
  };

  const getIntegrationIcon = (type) => {
    const iconMap = {
      payment: CreditCard,
      sms: Smartphone,
      email: Mail,
      social: MessageCircle,
      storage: Database,
      analytics: Activity,
      crm: FileText,
      government: Shield,
      api: Code,
      cloud: Cloud
    };
    const IconComponent = iconMap[type] || Plug;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-3 bg-gray-700/50 rounded-lg mr-4">
            {getIntegrationIcon(integration.type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{integration.description}</p>
          </div>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm border ${getStatusColor(integration.status)}`}>
          {getStatusIcon(integration.status)}
          <span className="ml-2 capitalize">{integration.status === 'connected' ? 'Подключено' : 
            integration.status === 'error' ? 'Ошибка' : 
            integration.status === 'pending' ? 'Подключение...' : 'Не подключено'}</span>
        </div>
      </div>

      {integration.status === 'connected' && integration.lastSync && (
        <div className="text-xs text-gray-400 mb-4">
          Последняя синхронизация: {integration.lastSync}
        </div>
      )}

      {integration.status === 'error' && integration.errorMessage && (
        <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-sm text-red-300">{integration.errorMessage}</span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {integration.status === 'connected' ? (
          <>
            <button
              onClick={() => onTest(integration)}
              className="flex items-center px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-400 text-sm rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              <Zap className="w-4 h-4 mr-1" />
              Тест
            </button>
            <button
              onClick={() => onEdit(integration)}
              className="flex items-center px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 text-yellow-400 text-sm rounded-lg hover:bg-yellow-500/30 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Настроить
            </button>
            <button
              onClick={() => onViewLogs(integration)}
              className="flex items-center px-3 py-1 bg-gray-500/20 border border-gray-400/30 text-gray-400 text-sm rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              <Eye className="w-4 h-4 mr-1" />
              Логи
            </button>
            <button
              onClick={() => onDisconnect(integration)}
              className="flex items-center px-3 py-1 bg-red-500/20 border border-red-400/30 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Отключить
            </button>
          </>
        ) : (
          <button
            onClick={() => onConnect(integration)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
          >
            <Plug className="w-4 h-4 mr-2" />
            Подключить
          </button>
        )}
      </div>
    </div>
  );
};

const APIKeyCard = ({ apiKey, onEdit, onDelete, onToggle, onCopy }) => {
  const [showKey, setShowKey] = useState(false);

  const maskedKey = apiKey.key.substring(0, 8) + '...' + apiKey.key.slice(-4);

  return (
    <div className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-white">{apiKey.name}</h4>
          <p className="text-sm text-gray-400">{apiKey.description}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs ${
          apiKey.active 
            ? 'bg-green-500/20 border border-green-400/30 text-green-400'
            : 'bg-gray-500/20 border border-gray-400/30 text-gray-400'
        }`}>
          {apiKey.active ? 'Активен' : 'Отключен'}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 p-2 bg-gray-800/50 rounded-lg">
        <code className="text-sm text-gray-300 font-mono">
          {showKey ? apiKey.key : maskedKey}
        </code>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowKey(!showKey)}
            className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onCopy(apiKey.key)}
            className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <span>Создан: {apiKey.created}</span>
        <span>Использован: {apiKey.lastUsed}</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onToggle(apiKey)}
          className={`flex items-center px-2 py-1 text-xs rounded-lg transition-colors ${
            apiKey.active
              ? 'bg-red-500/20 border border-red-400/30 text-red-400 hover:bg-red-500/30'
              : 'bg-green-500/20 border border-green-400/30 text-green-400 hover:bg-green-500/30'
          }`}
        >
          {apiKey.active ? 'Отключить' : 'Активировать'}
        </button>
        <button
          onClick={() => onEdit(apiKey)}
          className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
        >
          <Edit3 className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete(apiKey)}
          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

const IntegrationModal = ({ integration, isOpen, onClose, onSave }) => {
  const [config, setConfig] = useState(integration?.config || {});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResult({ success: true, message: 'Подключение успешно!' });
    } catch (error) {
      setTestResult({ success: false, message: 'Ошибка подключения' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-yellow-400/20 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">
          Настройка интеграции: {integration?.name}
        </h2>

        <div className="space-y-4 mb-6">
          {integration?.configFields?.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {field.type === 'password' ? (
                <input
                  type="password"
                  value={config[field.key] || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder={field.placeholder}
                />
              ) : field.type === 'select' ? (
                <select
                  value={config[field.key] || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="">Выберите...</option>
                  {field.options?.map((option, i) => (
                    <option key={i} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={config[field.key] || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder={field.placeholder}
                />
              )}
              {field.description && (
                <p className="text-xs text-gray-400 mt-1">{field.description}</p>
              )}
            </div>
          ))}
        </div>

        {testResult && (
          <div className={`p-3 rounded-lg mb-4 ${
            testResult.success 
              ? 'bg-green-500/20 border border-green-400/30'
              : 'bg-red-500/20 border border-red-400/30'
          }`}>
            <div className="flex items-center">
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 mr-2" />
              )}
              <span className={`text-sm ${testResult.success ? 'text-green-300' : 'text-red-300'}`}>
                {testResult.message}
              </span>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            className="flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            {isTestingConnection ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isTestingConnection ? 'Тестирование...' : 'Тест подключения'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave({ ...integration, config })}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

const IntegrationSettings = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Kaspi.kz API',
      description: 'Интеграция с платежной системой Kaspi',
      type: 'payment',
      status: 'connected',
      lastSync: '2 минуты назад',
      config: { apiKey: 'ksp_live_123...', environment: 'production' },
      configFields: [
        { key: 'apiKey', label: 'API Ключ', type: 'password', required: true },
        { key: 'environment', label: 'Окружение', type: 'select', options: [
          { value: 'test', label: 'Тестовое' },
          { value: 'production', label: 'Продакшен' }
        ]}
      ]
    },
    {
      id: 2,
      name: 'enbek.kz Integration',
      description: 'Синхронизация с гос. биржей труда',
      type: 'government',
      status: 'connected',
      lastSync: '15 минут назад',
      config: { clientId: 'enbek_123', clientSecret: 'secret_456' },
      configFields: [
        { key: 'clientId', label: 'Client ID', type: 'text', required: true },
        { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true }
      ]
    },
    {
      id: 3,
      name: 'SMS.kz',
      description: 'Сервис отправки SMS уведомлений',
      type: 'sms',
      status: 'error',
      errorMessage: 'Недостаточно средств на балансе',
      config: { login: 'workplus', password: 'pass123' },
      configFields: [
        { key: 'login', label: 'Логин', type: 'text', required: true },
        { key: 'password', label: 'Пароль', type: 'password', required: true }
      ]
    },
    {
      id: 4,
      name: 'Telegram Bot API',
      description: 'Бот для уведомлений в Telegram',
      type: 'social',
      status: 'connected',
      lastSync: '1 час назад',
      config: { botToken: '123456789:ABC...' },
      configFields: [
        { key: 'botToken', label: 'Bot Token', type: 'password', required: true, 
          description: 'Получите токен у @BotFather' }
      ]
    },
    {
      id: 5,
      name: 'Google Analytics',
      description: 'Веб-аналитика и отслеживание событий',
      type: 'analytics',
      status: 'disconnected'
    },
    {
      id: 6,
      name: 'Amazon S3',
      description: 'Облачное хранилище для файлов',
      type: 'cloud',
      status: 'disconnected'
    }
  ]);

  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API',
      description: 'Основной API ключ для продакшена',
      key: 'wrkpls_live_1234567890abcdef1234567890abcdef',
      active: true,
      created: '15.01.2025',
      lastUsed: '2 часа назад'
    },
    {
      id: 2,
      name: 'Development API',
      description: 'Ключ для разработки и тестирования',
      key: 'wrkpls_test_abcdef1234567890abcdef1234567890',
      active: true,
      created: '10.01.2025',
      lastUsed: '1 день назад'
    },
    {
      id: 3,
      name: 'Partner Integration',
      description: 'Для партнерской интеграции',
      key: 'wrkpls_partner_9876543210fedcba9876543210fedcba',
      active: false,
      created: '05.01.2025',
      lastUsed: 'Никогда'
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleConnect = (integration) => {
    setSelectedIntegration(integration);
    setIsModalOpen(true);
  };

  const handleSave = async (integrationData) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => prev.map(int => 
        int.id === integrationData.id 
          ? { ...int, status: 'connected', config: integrationData.config }
          : int
      ));
      
      setSaveStatus('success');
      setIsModalOpen(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = (integration) => {
    setIntegrations(prev => prev.map(int => 
      int.id === integration.id 
        ? { ...int, status: 'disconnected', config: {}, lastSync: null }
        : int
    ));
  };

  const handleTest = async (integration) => {
    console.log('Testing integration:', integration.name);
  };

  const handleViewLogs = (integration) => {
    console.log('Viewing logs for:', integration.name);
  };

  const handleCopyApiKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy API key:', err);
    }
  };

  const connectedIntegrations = integrations.filter(int => int.status === 'connected').length;
  const totalIntegrations = integrations.length;
  const activeApiKeys = apiKeys.filter(key => key.active).length;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Интеграции</h1>
              <p className="mt-1 text-sm text-gray-300">
                Подключение к внешним сервисам и API
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
                  {saveStatus === 'success' ? 'Сохранено' : 'Ошибка'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center">
              <Plug className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{connectedIntegrations}</h3>
                <p className="text-sm text-gray-400">Активных интеграций</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center">
              <Server className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{totalIntegrations}</h3>
                <p className="text-sm text-gray-400">Всего доступно</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center">
              <Key className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{activeApiKeys}</h3>
                <p className="text-sm text-gray-400">API ключей</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Integrations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Доступные интеграции</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onEdit={handleConnect}
                onTest={handleTest}
                onViewLogs={handleViewLogs}
              />
            ))}
          </div>
        </div>

        {/* API Keys Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">API Ключи</h2>
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Создать ключ
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiKeys.map((apiKey) => (
              <APIKeyCard
                key={apiKey.id}
                apiKey={apiKey}
                onEdit={() => console.log('Edit API key')}
                onDelete={() => console.log('Delete API key')}
                onToggle={() => console.log('Toggle API key')}
                onCopy={handleCopyApiKey}
              />
            ))}
          </div>
        </div>

        {/* Webhook Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <div className="flex items-center mb-6">
            <Link className="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-white">Webhook настройки</h3>
              <p className="text-sm text-gray-400 mt-1">
                Endpoints для получения уведомлений о событиях
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Job Status Updates</span>
                <span className="px-2 py-1 bg-green-500/20 border border-green-400/30 text-green-400 text-xs rounded-full">
                  Активен
                </span>
              </div>
              <div className="text-sm text-gray-400 mb-2">
                URL: https://api.workplus.kz/webhooks/job-status
              </div>
              <div className="text-xs text-gray-400">
                Получение уведомлений при изменении статуса вакансий
              </div>
            </div>

            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Payment Notifications</span>
                <span className="px-2 py-1 bg-green-500/20 border border-green-400/30 text-green-400 text-xs rounded-full">
                  Активен
                </span>
              </div>
              <div className="text-sm text-gray-400 mb-2">
                URL: https://api.workplus.kz/webhooks/payments
              </div>
              <div className="text-xs text-gray-400">
                Уведомления об успешных и неуспешных платежах
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button className="flex items-center px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Добавить webhook
            </button>
            <button className="px-3 py-1 bg-gray-700/50 border border-gray-600/50 text-gray-400 text-sm rounded-lg hover:bg-gray-700 transition-colors">
              Тест всех webhooks
            </button>
          </div>
        </div>

        {/* Integration Logs */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Activity className="w-6 h-6 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-white">Логи интеграций</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Последние события и ошибки интеграций
                </p>
              </div>
            </div>
            <button className="flex items-center px-3 py-1 bg-gray-700/50 border border-gray-600/50 text-gray-400 text-sm rounded-lg hover:bg-gray-700 transition-colors">
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {[
              {
                integration: 'Kaspi.kz API',
                message: 'Успешная обработка платежа #12345',
                type: 'success',
                timestamp: '2 минуты назад'
              },
              {
                integration: 'Telegram Bot API',
                message: 'Отправлено уведомление о новой вакансии',
                type: 'info',
                timestamp: '15 минут назад'
              },
              {
                integration: 'SMS.kz',
                message: 'Ошибка: недостаточно средств на балансе',
                type: 'error',
                timestamp: '1 час назад'
              },
              {
                integration: 'enbek.kz Integration',
                message: 'Синхронизирована 1 вакансия',
                type: 'success',
                timestamp: '2 часа назад'
              },
              {
                integration: 'Kaspi.kz API',
                message: 'Тайм-аут при обработке запроса',
                type: 'warning',
                timestamp: '3 часа назад'
              },
              {
                integration: 'Google Analytics',
                message: 'Превышен лимит API запросов',
                type: 'warning',
                timestamp: '4 часа назад'
              }
            ].map((log, index) => {
              const getLogIcon = (type) => {
                switch(type) {
                  case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
                  case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
                  case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
                  case 'info': return <Activity className="w-4 h-4 text-blue-400" />;
                  default: return <Clock className="w-4 h-4 text-gray-400" />;
                }
              };

              const getLogColor = (type) => {
                switch(type) {
                  case 'success': return 'bg-green-500/10 border-green-400/20';
                  case 'error': return 'bg-red-500/10 border-red-400/20';
                  case 'warning': return 'bg-yellow-500/10 border-yellow-400/20';
                  case 'info': return 'bg-blue-500/10 border-blue-400/20';
                  default: return 'bg-gray-500/10 border-gray-400/20';
                }
              };

              return (
                <div key={index} className={`flex items-center p-3 border rounded-lg ${getLogColor(log.type)}`}>
                  <div className="flex items-center mr-4">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{log.integration}</span>
                      <span className="text-xs text-gray-400">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300">{log.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Health */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-white">Состояние интеграций</h3>
              <p className="text-sm text-gray-400 mt-1">
                Мониторинг производительности и доступности
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'Kaspi.kz API',
                status: 'healthy',
                uptime: '99.9%',
                responseTime: '120ms',
                requests: '1.2K'
              },
              {
                name: 'enbek.kz',
                status: 'healthy', 
                uptime: '98.5%',
                responseTime: '450ms',
                requests: '89'
              },
              {
                name: 'SMS.kz',
                status: 'degraded',
                uptime: '95.2%',
                responseTime: '800ms',
                requests: '234'
              },
              {
                name: 'Telegram Bot',
                status: 'healthy',
                uptime: '100%',
                responseTime: '95ms',
                requests: '567'
              }
            ].map((health, index) => {
              const getStatusColor = (status) => {
                switch(status) {
                  case 'healthy': return 'text-green-400';
                  case 'degraded': return 'text-yellow-400';
                  case 'down': return 'text-red-400';
                  default: return 'text-gray-400';
                }
              };

              const getStatusDot = (status) => {
                switch(status) {
                  case 'healthy': return 'bg-green-400';
                  case 'degraded': return 'bg-yellow-400';
                  case 'down': return 'bg-red-400';
                  default: return 'bg-gray-400';
                }
              };

              return (
                <div key={index} className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-white truncate">{health.name}</h4>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(health.status)}`}></div>
                      <span className={`text-xs capitalize ${getStatusColor(health.status)}`}>
                        {health.status === 'healthy' ? 'Работает' : 
                         health.status === 'degraded' ? 'Проблемы' : 'Недоступно'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Uptime</span>
                      <span className="text-xs text-white">{health.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Время ответа</span>
                      <span className="text-xs text-white">{health.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Запросов/день</span>
                      <span className="text-xs text-white">{health.requests}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Integration Modal */}
      <IntegrationModal
        integration={selectedIntegration}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default IntegrationSettings;