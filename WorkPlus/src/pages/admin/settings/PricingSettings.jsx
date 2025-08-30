import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  Star,
  Users,
  Briefcase,
  Target,
  Clock,
  Shield,
  Zap,
  Crown,
  Gift
} from 'lucide-react';

const PricingTierCard = ({ tier, onEdit, onDelete, isPopular = false }) => {
  const getTierIcon = (tierName) => {
    switch(tierName.toLowerCase()) {
      case 'free': return <Gift className="w-6 h-6 text-gray-400" />;
      case 'start': return <Zap className="w-6 h-6 text-blue-400" />;
      case 'growth': return <Target className="w-6 h-6 text-green-400" />;
      case 'pro': return <Crown className="w-6 h-6 text-purple-400" />;
      default: return <Star className="w-6 h-6 text-yellow-400" />;
    }
  };

  const getTierColor = (tierName) => {
    switch(tierName.toLowerCase()) {
      case 'free': return 'border-gray-400/30';
      case 'start': return 'border-blue-400/30';
      case 'growth': return 'border-green-400/30';
      case 'pro': return 'border-purple-400/30';
      default: return 'border-yellow-400/30';
    }
  };

  return (
    <div className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 hover:border-yellow-400/40 transition-all ${
      isPopular ? 'ring-1 ring-yellow-400/40' : getTierColor(tier.name)
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-medium">
            Популярный
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getTierIcon(tier.name)}
          <h3 className="text-xl font-bold text-white ml-3">{tier.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(tier)}
            className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          {tier.name !== 'Free' && (
            <button
              onClick={() => onDelete(tier.id)}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-white mb-2">
          {tier.price === 0 ? 'Бесплатно' : `₸${tier.price.toLocaleString()}`}
        </div>
        {tier.price > 0 && (
          <div className="text-sm text-gray-400">
            {tier.billing === 'monthly' ? 'в месяц' : 'в год'}
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {tier.features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
            <span className="text-sm text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">{tier.stats.users}</div>
          <div className="text-xs text-gray-400">Подписчиков</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{tier.stats.revenue}</div>
          <div className="text-xs text-gray-400">MRR</div>
        </div>
      </div>
    </div>
  );
};

const TierEditModal = ({ tier, isOpen, onClose, onSave }) => {
  const [editingTier, setEditingTier] = useState(tier || {
    name: '',
    price: 0,
    billing: 'monthly',
    features: [],
    limits: {
      jobs: 0,
      users: 0,
      support: 'basic'
    }
  });

  const [newFeature, setNewFeature] = useState('');

  const handleSave = () => {
    onSave(editingTier);
    onClose();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setEditingTier(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setEditingTier(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-yellow-400/20 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">
          {tier ? 'Редактировать тариф' : 'Новый тариф'}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название</label>
              <input
                type="text"
                value={editingTier.name}
                onChange={(e) => setEditingTier(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Например: Growth"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Цена</label>
              <input
                type="number"
                value={editingTier.price}
                onChange={(e) => setEditingTier(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Период оплаты</label>
            <select
              value={editingTier.billing}
              onChange={(e) => setEditingTier(prev => ({ ...prev, billing: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
            >
              <option value="monthly">Ежемесячно</option>
              <option value="yearly">Ежегодно</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Функции</label>
            <div className="space-y-2 mb-3">
              {editingTier.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-white">{feature}</span>
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Добавить функцию"
              />
              <button
                onClick={addFeature}
                className="px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Лимит вакансий</label>
              <input
                type="number"
                value={editingTier.limits?.jobs || 0}
                onChange={(e) => setEditingTier(prev => ({
                  ...prev,
                  limits: { ...prev.limits, jobs: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="0 = безлимит"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Лимит пользователей</label>
              <input
                type="number"
                value={editingTier.limits?.users || 0}
                onChange={(e) => setEditingTier(prev => ({
                  ...prev,
                  limits: { ...prev.limits, users: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="0 = безлимит"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Уровень поддержки</label>
              <select
                value={editingTier.limits?.support || 'basic'}
                onChange={(e) => setEditingTier(prev => ({
                  ...prev,
                  limits: { ...prev.limits, support: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="basic">Базовая</option>
                <option value="priority">Приоритетная</option>
                <option value="premium">Премиум</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

const PricingSettings = () => {
  const [tiers, setTiers] = useState([
    {
      id: 1,
      name: 'Free',
      price: 0,
      billing: 'monthly',
      features: [
        '1 активная вакансия',
        'Базовый поиск кандидатов',
        'Email поддержка',
        'Стандартные шаблоны'
      ],
      limits: { jobs: 1, users: 1, support: 'basic' },
      stats: { users: 2847, revenue: '₸0' }
    },
    {
      id: 2,
      name: 'Start',
      price: 15000,
      billing: 'monthly',
      features: [
        '5 активных вакансий',
        'Базовый SMM постинг',
        'Приоритетная поддержка',
        'Статистика по откликам',
        'Экспорт данных'
      ],
      limits: { jobs: 5, users: 3, support: 'priority' },
      stats: { users: 456, revenue: '₸684K' }
    },
    {
      id: 3,
      name: 'Growth',
      price: 90000,
      billing: 'monthly',
      features: [
        '15 активных вакансий',
        'Мультиканальная дистрибуция',
        'ATS интеграция',
        'Детальная аналитика',
        'Кастомные шаблоны',
        'API доступ'
      ],
      limits: { jobs: 15, users: 10, support: 'priority' },
      stats: { users: 289, revenue: '₸2.6M' }
    },
    {
      id: 4,
      name: 'Pro',
      price: 250000,
      billing: 'monthly',
      features: [
        'Безлимит вакансий',
        'Полная автоматизация',
        'White-label решение',
        'Персональный менеджер',
        'Кастомная интеграция',
        'Премиум поддержка 24/7'
      ],
      limits: { jobs: 0, users: 0, support: 'premium' },
      stats: { users: 102, revenue: '₸2.55M' }
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleEditTier = (tier) => {
    setEditingTier(tier);
    setIsModalOpen(true);
  };

  const handleCreateTier = () => {
    setEditingTier(null);
    setIsModalOpen(true);
  };

  const handleSaveTier = (tierData) => {
    if (editingTier) {
      setTiers(prev => prev.map(tier => 
        tier.id === editingTier.id ? { ...tier, ...tierData } : tier
      ));
    } else {
      const newTier = {
        ...tierData,
        id: Date.now(),
        stats: { users: 0, revenue: '₸0' }
      };
      setTiers(prev => [...prev, newTier]);
    }
  };

  const handleDeleteTier = (tierId) => {
    setTiers(prev => prev.filter(tier => tier.id !== tierId));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
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

  const totalRevenue = tiers.reduce((sum, tier) => {
    const revenue = parseFloat(tier.stats.revenue.replace(/[₸KM,]/g, '')) * 
                   (tier.stats.revenue.includes('K') ? 1000 : tier.stats.revenue.includes('M') ? 1000000 : 1);
    return sum + revenue;
  }, 0);

  const totalUsers = tiers.reduce((sum, tier) => sum + tier.stats.users, 0);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Настройки тарифов</h1>
              <p className="mt-1 text-sm text-gray-300">
                Управление тарифными планами и ценообразованием
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
              <button
                onClick={handleCreateTier}
                className="flex items-center px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Новый тариф
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Сохранение...' : 'Сохранить все'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">₸{(totalRevenue / 1000000).toFixed(1)}M</h3>
                <p className="text-sm text-gray-400">Общий MRR</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{totalUsers.toLocaleString()}</h3>
                <p className="text-sm text-gray-400">Всего подписчиков</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{tiers.length}</h3>
                <p className="text-sm text-gray-400">Активных тарифов</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Тарифные планы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <PricingTierCard
                key={tier.id}
                tier={tier}
                onEdit={handleEditTier}
                onDelete={handleDeleteTier}
                isPopular={tier.name === 'Growth'}
              />
            ))}
          </div>
        </div>

        {/* Pricing Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Распределение подписчиков</h3>
            <div className="space-y-4">
              {tiers.map((tier, index) => {
                const percentage = (tier.stats.users / totalUsers) * 100;
                return (
                  <div key={tier.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        tier.name === 'Free' ? 'bg-gray-400' :
                        tier.name === 'Start' ? 'bg-blue-400' :
                        tier.name === 'Growth' ? 'bg-green-400' :
                        'bg-purple-400'
                      }`}></div>
                      <span className="text-white font-medium">{tier.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            tier.name === 'Free' ? 'bg-gray-400' :
                            tier.name === 'Start' ? 'bg-blue-400' :
                            tier.name === 'Growth' ? 'bg-green-400' :
                            'bg-purple-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400 w-12">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Ключевые инсайты</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-green-400 mr-2" />
                  <h4 className="font-medium text-green-400">Высокая конверсия</h4>
                </div>
                <p className="text-sm text-gray-300">Growth план показывает лучшее соотношение цена/качество</p>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                  <h4 className="font-medium text-yellow-400">Возможность роста</h4>
                </div>
                <p className="text-sm text-gray-300">77% пользователей на Free плане - потенциал для апгрейда</p>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="font-medium text-blue-400">Premium сегмент</h4>
                </div>
                <p className="text-sm text-gray-300">Pro план генерирует наибольший ARPU - ₸25,000 на пользователя</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <TierEditModal
        tier={editingTier}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTier}
      />
    </div>
  );
};

export default PricingSettings;