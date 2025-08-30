import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  Target,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  CreditCard,
  Banknote,
  Building2
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
  ResponsiveContainer, 
  ComposedChart 
} from 'recharts';

const RevenueCard = ({ title, amount, growth, growthType, period, icon: Icon, color = "yellow" }) => {
  const colorClasses = {
    yellow: "bg-yellow-500/20 border-yellow-400/30 text-yellow-400",
    green: "bg-green-500/20 border-green-400/30 text-green-400",
    blue: "bg-blue-500/20 border-blue-400/30 text-blue-400",
    purple: "bg-purple-500/20 border-purple-400/30 text-purple-400"
  };

  const getGrowthColor = (type) => {
    return type === 'up' ? 'text-green-400' : 'text-red-400';
  };

  const GrowthIcon = growthType === 'up' ? ArrowUp : ArrowDown;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center ${getGrowthColor(growthType)}`}>
          <GrowthIcon className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{growth}</span>
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold text-white mb-1">{amount}</p>
      <p className="text-xs text-gray-400">{period}</p>
    </div>
  );
};

const RevenueStreamCard = ({ stream }) => {
  return (
    <div className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-3`} style={{ backgroundColor: stream.color }}></div>
          <h3 className="font-semibold text-white">{stream.name}</h3>
        </div>
        <div className={`flex items-center ${stream.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {stream.growth > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
          <span className="text-sm font-medium">{Math.abs(stream.growth)}%</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Выручка:</span>
          <span className="text-lg font-bold text-white">₸{stream.revenue.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Доля:</span>
          <span className="text-yellow-400 font-medium">{stream.percentage}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Клиенты:</span>
          <span className="text-green-400 font-medium">{stream.customers}</span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
          <div 
            className="h-2 rounded-full"
            style={{ 
              width: `${stream.percentage}%`, 
              backgroundColor: stream.color 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const Revenue = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('overview');

  // Revenue data
  const monthlyRevenueData = [
    { month: 'Янв', revenue: 2800000, subscriptions: 1800000, services: 800000, ads: 200000 },
    { month: 'Фев', revenue: 3100000, subscriptions: 2000000, services: 900000, ads: 200000 },
    { month: 'Мар', revenue: 3500000, subscriptions: 2300000, services: 950000, ads: 250000 },
    { month: 'Апр', revenue: 3800000, subscriptions: 2500000, services: 1050000, ads: 250000 },
    { month: 'Май', revenue: 4200000, subscriptions: 2800000, services: 1150000, ads: 250000 },
    { month: 'Июн', revenue: 4600000, subscriptions: 3100000, services: 1250000, ads: 250000 },
    { month: 'Июл', revenue: 4900000, subscriptions: 3300000, services: 1350000, ads: 250000 },
    { month: 'Авг', revenue: 5250000, subscriptions: 3600000, services: 1400000, ads: 250000 }
  ];

  const revenueStreams = [
    {
      name: 'Подписки',
      revenue: 3600000,
      percentage: 68.6,
      growth: 15.2,
      customers: 847,
      color: '#F59E0B'
    },
    {
      name: 'Услуги под ключ',
      revenue: 1400000,
      percentage: 26.7,
      growth: 22.1,
      customers: 156,
      color: '#22C55E'
    },
    {
      name: 'Реклама',
      revenue: 250000,
      percentage: 4.7,
      growth: -5.3,
      customers: 89,
      color: '#3B82F6'
    }
  ];

  const subscriptionData = [
    { tier: 'Free', users: 2847, revenue: 0, conversion: 12.5 },
    { tier: 'Start', users: 456, revenue: 684000, conversion: 23.8 },
    { tier: 'Growth', users: 289, revenue: 1734000, conversion: 34.2 },
    { tier: 'Pro', users: 102, revenue: 1182000, conversion: 45.6 }
  ];

  const regionalRevenueData = [
    { region: 'Алматы', revenue: 1890000, percentage: 36.0 },
    { region: 'Нур-Султан', revenue: 1575000, percentage: 30.0 },
    { region: 'Шымкент', revenue: 735000, percentage: 14.0 },
    { region: 'Караганда', revenue: 525000, percentage: 10.0 },
    { region: 'Другие', revenue: 525000, percentage: 10.0 }
  ];

  const revenueMetrics = [
    {
      title: 'MRR (Monthly Recurring Revenue)',
      amount: '₸3,600,000',
      growth: '+15.2%',
      growthType: 'up',
      period: 'за август 2025',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      title: 'Средний чек',
      amount: '₸6,200',
      growth: '+8.1%',
      growthType: 'up',
      period: 'на клиента',
      icon: Target,
      color: 'green'
    },
    {
      title: 'ARPU (Average Revenue Per User)',
      amount: '₸1,450',
      growth: '+12.3%',
      growthType: 'up',
      period: 'в месяц',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Churn Rate',
      amount: '4.2%',
      growth: '-0.8%',
      growthType: 'up',
      period: 'месячный отток',
      icon: TrendingDown,
      color: 'purple'
    }
  ];

  const yearOverYearData = [
    { period: 'Q1 2024', current: 9400000, previous: 7200000 },
    { period: 'Q2 2024', current: 12800000, previous: 9800000 },
    { period: 'Q3 2024', current: 14750000, previous: 11200000 },
    { period: 'Q1 2025', current: 10500000, previous: 9400000 },
    { period: 'Q2 2025', current: 14200000, previous: 12800000 },
    { period: 'Q3 2025', current: 15800000, previous: 14750000 }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Доходы</h1>
              <p className="mt-1 text-sm text-gray-300">
                Анализ выручки и источников дохода
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
        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {revenueMetrics.map((metric, index) => (
            <RevenueCard
              key={index}
              title={metric.title}
              amount={metric.amount}
              growth={metric.growth}
              growthType={metric.growthType}
              period={metric.period}
              icon={metric.icon}
              color={metric.color}
            />
          ))}
        </div>

        {/* Revenue Trends Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 sm:mb-0">Динамика доходов</h3>
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-gray-300">Общая выручка</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-gray-300">Подписки</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-gray-300">Услуги</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `₸${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value) => [`₸${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Area type="monotone" dataKey="subscriptions" stackId="2" stroke="#22C55E" fill="#22C55E" fillOpacity={0.8} />
                <Area type="monotone" dataKey="services" stackId="3" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Источники дохода</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {revenueStreams.map((stream, index) => (
                  <RevenueStreamCard key={index} stream={stream} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Распределение по регионам</h3>
            <div className="space-y-4">
              {regionalRevenueData.map((region, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{region.region}</p>
                    <p className="text-sm text-gray-400">{region.percentage}% от общего</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-400">₸{(region.revenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscription Analysis & Year-over-Year */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscription Tiers */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Анализ подписок</h3>
            <div className="space-y-4">
              {subscriptionData.map((tier, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{tier.tier}</span>
                      <span className="text-sm text-gray-400">{tier.users} пользователей</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full"
                        style={{ width: `${(tier.users / 3694) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-400">₸{tier.revenue.toLocaleString()}</span>
                      <span className="text-green-400">{tier.conversion}% конверсия</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Year-over-Year Comparison */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Сравнение год к году</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearOverYearData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="period" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `₸${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value) => [`₸${value.toLocaleString()}`, '']}
                  />
                  <Bar dataKey="previous" fill="#6B7280" name="Прошлый год" />
                  <Bar dataKey="current" fill="#F59E0B" name="Текущий год" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;