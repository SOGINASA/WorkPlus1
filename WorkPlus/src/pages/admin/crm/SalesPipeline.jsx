import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  DollarSign,
  Calendar,
  User,
  Building2,
  TrendingUp,
  ArrowRight,
  Eye,
  Edit3,
  Phone,
  Mail,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  X
} from 'lucide-react';

const NewDealModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    value: '',
    owner: '',
    closeDate: '',
    priority: 'medium',
    probability: 20,
    contact: {
      phone: '',
      email: ''
    },
    stage: 'lead'
  });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDeal = {
      ...formData,
      id: Date.now(),
      lastUpdate: new Date().toISOString().split('T')[0]
    };
    onSubmit(newDeal);
    setFormData({
      title: '',
      company: '',
      value: '',
      owner: '',
      closeDate: '',
      priority: 'medium',
      probability: 20,
      contact: {
        phone: '',
        email: ''
      },
      stage: 'lead'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-yellow-400/20 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Новая сделка</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название сделки *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Например: Kaspi Bank - HR система"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Компания *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Название компании"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Стоимость *
              </label>
              <input
                type="text"
                required
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="₸500,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ответственный
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Имя менеджера"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Дата закрытия
              </label>
              <input
                type="date"
                value={formData.closeDate}
                onChange={(e) => handleInputChange('closeDate', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Приоритет
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Вероятность (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleInputChange('probability', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Этап
              </label>
              <select
                value={formData.stage}
                onChange={(e) => handleInputChange('stage', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="lead">Лиды</option>
                <option value="qualified">Квалифицированы</option>
                <option value="proposal">Предложение</option>
                <option value="negotiation">Переговоры</option>
                <option value="closed">Закрыто</option>
                <option value="lost">Проиграно</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Телефон контакта
            </label>
            <input
              type="tel"
              value={formData.contact.phone}
              onChange={(e) => handleInputChange('contact.phone', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="+7 777 123 4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email контакта
            </label>
            <input
              type="email"
              value={formData.contact.email}
              onChange={(e) => handleInputChange('contact.email', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="contact@company.kz"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all font-medium"
            >
              Создать сделку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DealCard = ({ deal, onDragStart }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getDaysInStage = (lastUpdate) => {
    const today = new Date();
    const updateDate = new Date(lastUpdate);
    const diffTime = Math.abs(today - updateDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div
      className="bg-gray-700/30 rounded-lg p-4 cursor-move hover:bg-gray-700/50 transition-all border border-gray-600/50 hover:border-yellow-400/30"
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-white mb-1">{deal.title}</h4>
          <p className="text-sm text-gray-300">{deal.company}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getPriorityColor(deal.priority) === 'text-red-400' ? 'bg-red-400' : getPriorityColor(deal.priority) === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-white"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-bold text-yellow-400">
          {deal.value}
        </div>
        <div className="text-xs text-gray-400">
          {getDaysInStage(deal.lastUpdate)} дней
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center">
          <User className="w-3 h-3 mr-1" />
          {deal.owner}
        </div>
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {deal.closeDate}
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-600 space-y-2">
          <div className="flex items-center text-xs text-gray-300">
            <Phone className="w-3 h-3 mr-2 text-yellow-400" />
            {deal.contact.phone}
          </div>
          <div className="flex items-center text-xs text-gray-300">
            <Mail className="w-3 h-3 mr-2 text-yellow-400" />
            {deal.contact.email}
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              <button className="p-1 text-blue-400 hover:text-blue-300">
                <Eye className="w-3 h-3" />
              </button>
              <button className="p-1 text-yellow-400 hover:text-yellow-300">
                <Edit3 className="w-3 h-3" />
              </button>
              <button className="p-1 text-green-400 hover:text-green-300">
                <Phone className="w-3 h-3" />
              </button>
            </div>
            <div className={`text-xs font-medium ${getPriorityColor(deal.priority)}`}>
              {deal.probability}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PipelineStage = ({ stage, deals, onDrop, onDragOver, onDragStart, onAddDeal }) => {
  const stageConfig = {
    lead: { 
      title: 'Лиды', 
      color: 'bg-blue-500/20 border-blue-400/30', 
      textColor: 'text-blue-400',
      icon: User
    },
    qualified: { 
      title: 'Квалифицированы', 
      color: 'bg-purple-500/20 border-purple-400/30', 
      textColor: 'text-purple-400',
      icon: Target
    },
    proposal: { 
      title: 'Предложение', 
      color: 'bg-orange-500/20 border-orange-400/30', 
      textColor: 'text-orange-400',
      icon: AlertTriangle
    },
    negotiation: { 
      title: 'Переговоры', 
      color: 'bg-yellow-500/20 border-yellow-400/30', 
      textColor: 'text-yellow-400',
      icon: ArrowRight
    },
    closed: { 
      title: 'Закрыто', 
      color: 'bg-green-500/20 border-green-400/30', 
      textColor: 'text-green-400',
      icon: CheckCircle
    },
    lost: { 
      title: 'Проиграно', 
      color: 'bg-red-500/20 border-red-400/30', 
      textColor: 'text-red-400',
      icon: XCircle
    }
  };

  const config = stageConfig[stage];
  const Icon = config.icon;
  const totalValue = deals.reduce((sum, deal) => sum + parseFloat(deal.value.replace(/[₸,]/g, '')), 0);

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 min-h-[600px]"
      onDrop={(e) => onDrop(e, stage)}
      onDragOver={onDragOver}
    >
      <div className={`flex items-center justify-between p-3 rounded-lg border ${config.color} mb-4`}>
        <div className="flex items-center">
          <Icon className={`w-5 h-5 mr-2 ${config.textColor}`} />
          <h3 className={`font-semibold ${config.textColor}`}>{config.title}</h3>
          <span className="ml-2 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
            {deals.length}
          </span>
        </div>
        <div className={`text-sm font-medium ${config.textColor}`}>
          ₸{totalValue.toLocaleString()}
        </div>
      </div>

      <div className="space-y-3">
        {deals.map(deal => (
          <DealCard
            key={deal.id}
            deal={deal}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      <button 
        className="w-full mt-4 p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-yellow-400/40 hover:text-yellow-400 transition-all"
        onClick={onAddDeal}
      >
        <Plus className="w-4 h-4 mx-auto mb-1" />
        <div className="text-xs">Добавить сделку</div>
      </button>
    </div>
  );
};

const SalesPipeline = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [deals, setDeals] = useState({
    lead: [
      {
        id: 1,
        title: 'Kaspi Bank - HR система',
        company: 'Kaspi Bank',
        value: '₸500,000',
        owner: 'Алия К.',
        closeDate: '15.09.2025',
        priority: 'high',
        probability: 20,
        lastUpdate: '2025-08-25',
        contact: {
          phone: '+7 777 123 4567',
          email: 'aliya@kaspi.kz'
        }
      },
      {
        id: 2,
        title: 'Retail Chain - Рекрутинг',
        company: 'Retail Chain KZ',
        value: '₸180,000',
        owner: 'Мадина Т.',
        closeDate: '20.09.2025',
        priority: 'low',
        probability: 15,
        lastUpdate: '2025-08-28',
        contact: {
          phone: '+7 778 333 5678',
          email: 'madina@retail.kz'
        }
      }
    ],
    qualified: [
      {
        id: 3,
        title: 'TechStartup - Полный пакет',
        company: 'TechStartup KZ',
        value: '₸1,200,000',
        owner: 'Данияр А.',
        closeDate: '10.09.2025',
        priority: 'high',
        probability: 40,
        lastUpdate: '2025-08-20',
        contact: {
          phone: '+7 701 987 6543',
          email: 'daniyal@techstartup.kz'
        }
      }
    ],
    proposal: [
      {
        id: 4,
        title: 'Beeline - Операционный найм',
        company: 'Beeline Kazakhstan',
        value: '₸350,000',
        owner: 'Светлана К.',
        closeDate: '05.09.2025',
        priority: 'medium',
        probability: 60,
        lastUpdate: '2025-08-22',
        contact: {
          phone: '+7 747 555 1234',
          email: 'svetlana@beeline.kz'
        }
      }
    ],
    negotiation: [
      {
        id: 5,
        title: 'FinTech - IT рекрутинг',
        company: 'FinTech Solutions',
        value: '₸800,000',
        owner: 'Арман С.',
        closeDate: '01.09.2025',
        priority: 'high',
        probability: 75,
        lastUpdate: '2025-08-25',
        contact: {
          phone: '+7 705 444 7890',
          email: 'arman@fintech.kz'
        }
      }
    ],
    closed: [
      {
        id: 6,
        title: 'Government Agency - Тендер',
        company: 'Government Agency',
        value: '₸950,000',
        owner: 'Ержан М.',
        closeDate: '29.08.2025',
        priority: 'medium',
        probability: 100,
        lastUpdate: '2025-08-10',
        contact: {
          phone: '+7 777 111 2222',
          email: 'erzhan@gov.kz'
        }
      }
    ],
    lost: []
  });

  const handleNewDeal = (newDeal) => {
    setDeals(prev => ({
      ...prev,
      [newDeal.stage]: [...prev[newDeal.stage], newDeal]
    }));
    setIsNewDealModalOpen(false);
  };

  const handleDragStart = (e, deal) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(deal));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const deal = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Remove deal from current stage
    const newDeals = { ...deals };
    Object.keys(newDeals).forEach(stage => {
      newDeals[stage] = newDeals[stage].filter(d => d.id !== deal.id);
    });
    
    // Add deal to target stage
    newDeals[targetStage].push({
      ...deal,
      lastUpdate: new Date().toISOString().split('T')[0]
    });
    
    setDeals(newDeals);
  };

  // Calculate pipeline metrics
  const totalDeals = Object.values(deals).flat().length;
  const totalValue = Object.values(deals).flat().reduce((sum, deal) => 
    sum + parseFloat(deal.value.replace(/[₸,]/g, '')), 0
  );
  const avgDealSize = totalValue / totalDeals || 0;
  const conversionRate = deals.closed.length / totalDeals * 100 || 0;

  const pipelineStats = [
    {
      title: 'Общая стоимость',
      value: `₸${totalValue.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      title: 'Всего сделок',
      value: totalDeals.toString(),
      change: '+8.3%',
      icon: BarChart3,
      color: 'blue'
    },
    {
      title: 'Средний чек',
      value: `₸${Math.round(avgDealSize).toLocaleString()}`,
      change: '+5.7%',
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Конверсия',
      value: `${conversionRate.toFixed(1)}%`,
      change: '+2.1%',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Воронка продаж</h1>
              <p className="mt-1 text-sm text-gray-300">
                Управление сделками и отслеживание прогресса
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="week">Эта неделя</option>
                <option value="month">Этот месяц</option>
                <option value="quarter">Квартал</option>
                <option value="year">Год</option>
              </select>
              <button 
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
                onClick={() => setIsNewDealModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Новая сделка
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pipeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {pipelineStats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-500/20 border-blue-400/30 text-blue-400",
              green: "bg-green-500/20 border-green-400/30 text-green-400",
              yellow: "bg-yellow-500/20 border-yellow-400/30 text-yellow-400",
              purple: "bg-purple-500/20 border-purple-400/30 text-purple-400"
            };

            return (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-sm font-medium text-green-400">{stat.change}</span>
                      <span className="text-sm text-gray-400 ml-1">за месяц</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pipeline Search & Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск сделок..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-gray-300 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Board */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 overflow-x-auto">
          <PipelineStage
            stage="lead"
            deals={deals.lead}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onAddDeal={() => setIsNewDealModalOpen(true)}
          />
          <PipelineStage
            stage="qualified"
            deals={deals.qualified}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onAddDeal={() => setIsNewDealModalOpen(true)}
          />
          <PipelineStage
            stage="proposal"
            deals={deals.proposal}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onAddDeal={() => setIsNewDealModalOpen(true)}
          />
          <PipelineStage
            stage="negotiation"
            deals={deals.negotiation}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onAddDeal={() => setIsNewDealModalOpen(true)}
          />
          <PipelineStage
            stage="closed"
            deals={deals.closed}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onAddDeal={() => setIsNewDealModalOpen(true)}
          />
          <PipelineStage
            stage="lost"
            deals={deals.lost}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onAddDeal={() => setIsNewDealModalOpen(true)}
          />
        </div>

        {/* Pipeline Summary */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Прогноз по этапам</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Object.entries(deals).map(([stage, stageDeals]) => {
              const stageNames = {
                lead: 'Лиды',
                qualified: 'Квалифицированы',
                proposal: 'Предложения',
                negotiation: 'Переговоры',
                closed: 'Закрыто',
                lost: 'Проиграно'
              };
              
              const stageValue = stageDeals.reduce((sum, deal) => 
                sum + parseFloat(deal.value.replace(/[₸,]/g, '')), 0
              );

              return (
                <div key={stage} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {stageDeals.length}
                  </div>
                  <div className="text-sm text-yellow-400 mb-2">
                    ₸{stageValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {stageNames[stage]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Deal Modal */}
      <NewDealModal
        isOpen={isNewDealModalOpen}
        onClose={() => setIsNewDealModalOpen(false)}
        onSubmit={handleNewDeal}
      />
    </div>
  );
};

export default SalesPipeline;