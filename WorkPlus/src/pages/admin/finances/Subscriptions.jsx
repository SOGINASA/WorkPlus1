import React, { useState } from 'react';
import {
  CreditCard,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  BarChart3,
  Target,
  Clock,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  Star
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const SubscriptionTierCard = ({ tier, isPopular = false }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-400';
      case 'churned': return 'text-red-400';
      case 'trial': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getGrowthColor = (growth) => {
    return growth > 0 ? 'text-green-400' : 'text-red-400';
  };

  const GrowthIcon = tier.growth > 0 ? ArrowUp : ArrowDown;

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 hover:border-yellow-400/40 transition-all relative ${
      isPopular 
        ? 'border-yellow-400/40 ring-1 ring-yellow-400/20' 
        : 'border-yellow-400/20'
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
          <div className={`p-2 rounded-lg ${
            tier.name === 'Free' ? 'bg-gray-500/20 border-gray-400/30' :
            tier.name === 'Start' ? 'bg-blue-500/20 border-blue-400/30' :
            tier.name === 'Growth' ? 'bg-green-500/20 border-green-400/30' :
            'bg-purple-500/20 border-purple-400/30'
          } border`}>
            <CreditCard className={`w-5 h-5 ${
              tier.name === 'Free' ? 'text-gray-400' :
              tier.name === 'Start' ? 'text-blue-400' :
              tier.name === 'Growth' ? 'text-green-400' :
              'text-purple-400'
            }`} />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-white">{tier.name}</h3>
            <p className="text-sm text-gray-400">{tier.price}</p>
          </div>
        </div>
        <div className={`flex items-center ${getGrowthColor(tier.growth)}`}>
          <GrowthIcon className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{Math.abs(tier.growth)}%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-700/30 rounded-lg">
            <div className="text-xl font-bold text-white">{tier.subscribers}</div>
            <div className="text-xs text-gray-400">Подписчики</div>
          </div>
          <div className="text-center p-3 bg-gray-700/30 rounded-lg">
            <div className="text-xl font-bold text-yellow-400">₸{tier.mrr.toLocaleString()}</div>
            <div className="text-xs text-gray-400">MRR</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Конверсия:</span>
            <span className="text-green-400 font-medium">{tier.conversion}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Churn Rate:</span>
            <span className={getStatusColor(tier.churn > 5 ? 'churned' : 'active')}>{tier.churn}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">LTV:</span>
            <span className="text-purple-400 font-medium">₸{tier.ltv.toLocaleString()}</span>
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              tier.name === 'Free' ? 'bg-gray-400' :
              tier.name === 'Start' ? 'bg-blue-400' :
              tier.name === 'Growth' ? 'bg-green-400' :
              'bg-purple-400'
            }`}
            style={{ width: `${(tier.subscribers / 3694) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const SubscriberStatusCard = ({ status, count, percentage, change, icon: Icon, color }) => {
  const colorClasses = {
    green: "bg-green-500/20 border-green-400/30 text-green-400",
    yellow: "bg-yellow-500/20 border-yellow-400/30 text-yellow-400",
    red: "bg-red-500/20 border-red-400/30 text-red-400",
    blue: "bg-blue-500/20 border-blue-400/30 text-blue-400"
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`text-sm font-medium ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-300 mb-2">{status}</h3>
      <p className="text-2xl font-bold text-white mb-1">{count.toLocaleString()}</p>
      <p className="text-xs text-gray-400">{percentage}% от общего числа</p>
    </div>
  );
};

const Subscriptions = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('subscribers');

  const subscriptionTiers = [
    {
      name: 'Free',
      price: 'Бесплатно',
      subscribers: 2847,
      mrr: 0,
      growth: -5.2,
      conversion: 12.5,
      churn: 25.8,
      ltv: 0
    },
    {
      name: 'Start',
      price: '₸15,000/мес',
      subscribers: 456,
      mrr: 684000,
      growth: 18.3,
      conversion: 23.8,
      churn: 8.2,
      ltv: 180000
    },
    {
      name: 'Growth',
      price: '₸90,000/мес',
      subscribers: 289,
      mrr: 2601000,
      growth: 25.7,
      conversion: 34.2,
      churn: 4.1,
      ltv: 1080000
    },
    {
      name: 'Pro',
      price: '₸250,000/мес',
      subscribers: 102,
      mrr: 2550000,
      growth: 31.4,
      conversion: 45.6,
      churn: 2.8,
      ltv: 4500000
    }
  ];

  const subscriberStatuses = [
    {
      status: 'Активные подписчики',
      count: 847,
      percentage: 22.9,
      change: 15.3,
      icon: CheckCircle,
      color: 'green'
    },
    {
      status: 'Пробный период',
      count: 234,
      percentage: 6.3,
      change: 8.7,
      icon: Clock,
      color: 'yellow'
    },
    {
      status: 'Отменившие',
      count: 89,
      percentage: 2.4,
      change: -12.5,
      icon: XCircle,
      color: 'red'
    },
    {
      status: 'Просроченные',
      count: 45,
      percentage: 1.2,
      change: -5.8,
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const subscriptionTrendsData = [
    { month: 'Янв', total: 652, start: 298, growth: 189, pro: 78, free: 2456 },
    { month: 'Фев', total: 698, start: 321, growth: 203, pro: 82, free: 2523 },
    { month: 'Мар', total: 745, start: 347, growth: 218, pro: 87, free: 2589 },
    { month: 'Апр', total: 789, start: 368, growth: 235, pro: 91, free: 2634 },
    { month: 'Май', total: 823, start: 389, growth: 251, pro: 95, free: 2698 },
    { month: 'Июн', total: 865, start: 412, growth: 268, pro: 98, free: 2745 },
    { month: 'Июл', total: 892, start: 434, growth: 278, pro: 100, free: 2789 },
    { month: 'Авг', total: 847, start: 456, growth: 289, pro: 102, free: 2847 }
  ];

  const churnAnalysisData = [
    { tier: 'Free', month1: 45.2, month3: 68.5, month6: 82.1, month12: 91.8 },
    { tier: 'Start', month1: 12.8, month3: 18.4, month6: 24.7, month12: 32.1 },
    { tier: 'Growth', month1: 6.2, month3: 9.8, month6: 14.2, month12: 19.5 },
    { tier: 'Pro', month1: 3.1, month3: 5.4, month6: 8.9, month12: 12.3 }
  ];

  const revenueByTierData = [
    { name: 'Pro', value: 44.3, revenue: 2550000, color: '#8B5CF6' },
    { name: 'Growth', value: 45.2, revenue: 2601000, color: '#22C55E' },
    { name: 'Start', value: 11.9, revenue: 684000, color: '#3B82F6' },
    { name: 'Free', value: 0, revenue: 0, color: '#6B7280' }
  ];

  const cohortRetentionData = [
    { cohort: 'Янв 2025', month0: 100, month1: 78, month3: 65, month6: 52, month12: 38 },
    { cohort: 'Фев 2025', month0: 100, month1: 82, month3: 68, month6: 55, month12: 41 },
    { cohort: 'Мар 2025', month0: 100, month1: 85, month3: 72, month6: 58, month12: 44 },
    { cohort: 'Апр 2025', month0: 100, month1: 87, month3: 75, month6: 61, month12: 0 },
    { cohort: 'Май 2025', month0: 100, month1: 89, month3: 78, month6: 0, month12: 0 },
    { cohort: 'Июн 2025', month0: 100, month1: 91, month3: 0, month6: 0, month12: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Подписки</h1>
              <p className="mt-1 text-sm text-gray-300">
                Управление подписками и анализ удержания
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="quarter">Квартал</option>
                <option value="year">Год</option>
              </select>
              <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Tiers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Тарифные планы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionTiers.map((tier, index) => (
              <SubscriptionTierCard 
                key={index} 
                tier={tier} 
                isPopular={tier.name === 'Growth'} 
              />
            ))}
          </div>
        </div>

        {/* Subscriber Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Статус подписчиков</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriberStatuses.map((status, index) => (
              <SubscriberStatusCard key={index} {...status} />
            ))}
          </div>
        </div>

        {/* Subscription Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Динамика подписок</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={subscriptionTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Area type="monotone" dataKey="pro" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                  <Area type="monotone" dataKey="growth" stackId="1" stroke="#22C55E" fill="#22C55E" />
                  <Area type="monotone" dataKey="start" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Выручка по тарифам</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByTierData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelStyle={{ fill: '#ffffff', fontSize: '12px' }}
                  >
                    {revenueByTierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value, name) => [`₸${revenueByTierData.find(d => d.name === name)?.revenue.toLocaleString()}`, 'Выручка']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Churn Analysis & Cohort Retention */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Анализ оттока</h3>
            <div className="space-y-4">
              {churnAnalysisData.map((tier, index) => (
                <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">{tier.tier}</h4>
                    <div className="text-sm text-gray-400">Кумулятивный churn</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-red-400">{tier.month1}%</div>
                      <div className="text-xs text-gray-400">1 мес</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-400">{tier.month3}%</div>
                      <div className="text-xs text-gray-400">3 мес</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-400">{tier.month6}%</div>
                      <div className="text-xs text-gray-400">6 мес</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400">{tier.month12}%</div>
                      <div className="text-xs text-gray-400">12 мес</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Когортное удержание</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cohortRetentionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="cohort" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value) => [`${value}%`, '']}
                  />
                  <Line type="monotone" dataKey="month1" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="month3" stroke="#22C55E" strokeWidth={2} />
                  <Line type="monotone" dataKey="month6" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="month12" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-gray-300">1 месяц</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-gray-300">3 месяца</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-gray-300">6 месяцев</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                <span className="text-gray-300">12 месяцев</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Ключевые инсайты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
              <div className="flex items-center mb-2">
                <Star className="w-5 h-5 text-green-400 mr-2" />
                <h4 className="font-medium text-green-400">Лучший тариф</h4>
              </div>
              <p className="text-sm text-gray-300">Growth показывает наибольший рост (+25.7%) и низкий churn (4.1%)</p>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                <h4 className="font-medium text-yellow-400">Требует внимания</h4>
              </div>
              <p className="text-sm text-gray-300">Free план показывает отрицательный рост (-5.2%), нужно улучшить onboarding</p>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-blue-400 mr-2" />
                <h4 className="font-medium text-blue-400">Возможность</h4>
              </div>
              <p className="text-sm text-gray-300">Pro план имеет высокий LTV (₸4.5M) - стоит сфокусироваться на его продвижении</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;