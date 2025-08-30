import React, { useState } from 'react';
import {
  TrendingDown,
  Users,
  Eye,
  UserCheck,
  Phone,
  Calendar,
  CheckCircle,
  Filter,
  Download,
  BarChart3,
  ArrowRight,
  AlertTriangle,
  Target,
  Clock,
  Percent
} from 'lucide-react';
import { FunnelChart, Funnel, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie } from 'recharts';

const FunnelStage = ({ stage, color, isLast = false }) => {
  const getConversionColor = (rate) => {
    if (rate >= 80) return 'text-green-400';
    if (rate >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex items-center">
      <div className="flex-1">
        <div className={`bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <stage.icon className={`w-6 h-6 mr-3 ${color}`} />
              <h3 className="font-semibold text-white">{stage.name}</h3>
            </div>
            <div className={`text-sm font-medium ${getConversionColor(stage.conversionRate)}`}>
              {stage.conversionRate}%
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Пользователи:</span>
              <span className="text-2xl font-bold text-white">{stage.users.toLocaleString()}</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${color === 'text-blue-400' ? 'from-blue-400 to-blue-600' :
                  color === 'text-purple-400' ? 'from-purple-400 to-purple-600' :
                  color === 'text-yellow-400' ? 'from-yellow-400 to-yellow-600' :
                  color === 'text-orange-400' ? 'from-orange-400 to-orange-600' :
                  'from-green-400 to-green-600'}`}
                style={{ width: `${(stage.users / 10000) * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">{stage.avgTime}</div>
                <div className="text-xs text-gray-400">Среднее время</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{stage.dropOff}%</div>
                <div className="text-xs text-gray-400">Отсев</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {!isLast && (
        <div className="flex items-center justify-center w-16">
          <ArrowRight className="w-6 h-6 text-yellow-400" />
        </div>
      )}
    </div>
  );
};

const ConversionFunnels = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedFunnel, setSelectedFunnel] = useState('job_application');

  const funnelData = {
    job_application: [
      {
        name: 'Посетители сайта',
        icon: Users,
        users: 10000,
        conversionRate: 100,
        avgTime: '2:30',
        dropOff: 0
      },
      {
        name: 'Просмотр вакансий',
        icon: Eye,
        users: 6500,
        conversionRate: 65,
        avgTime: '3:45',
        dropOff: 35
      },
      {
        name: 'Клик на вакансию',
        icon: Target,
        users: 3200,
        conversionRate: 49,
        avgTime: '5:20',
        dropOff: 51
      },
      {
        name: 'Начало заявки',
        icon: UserCheck,
        users: 1800,
        conversionRate: 56,
        avgTime: '8:15',
        dropOff: 44
      },
      {
        name: 'Отправка заявки',
        icon: CheckCircle,
        users: 1200,
        conversionRate: 67,
        avgTime: '12:30',
        dropOff: 33
      }
    ],
    employer_registration: [
      {
        name: 'Посещение страницы',
        icon: Users,
        users: 5000,
        conversionRate: 100,
        avgTime: '1:45',
        dropOff: 0
      },
      {
        name: 'Просмотр тарифов',
        icon: Eye,
        users: 2500,
        conversionRate: 50,
        avgTime: '4:20',
        dropOff: 50
      },
      {
        name: 'Начало регистрации',
        icon: UserCheck,
        users: 800,
        conversionRate: 32,
        avgTime: '6:45',
        dropOff: 68
      },
      {
        name: 'Завершение регистрации',
        icon: CheckCircle,
        users: 450,
        conversionRate: 56,
        avgTime: '15:20',
        dropOff: 44
      }
    ]
  };

  const currentFunnel = funnelData[selectedFunnel];

  const timeToConversionData = [
    { time: '0-1ч', users: 450, percentage: 37.5 },
    { time: '1-6ч', users: 320, percentage: 26.7 },
    { time: '6-24ч', users: 210, percentage: 17.5 },
    { time: '1-3д', users: 150, percentage: 12.5 },
    { time: '3-7д', users: 70, percentage: 5.8 }
  ];

  const deviceConversionData = [
    { device: 'Мобильные', total: 6800, converted: 820, rate: 12.1 },
    { device: 'Десктоп', total: 2800, converted: 336, rate: 12.0 },
    { device: 'Планшеты', total: 400, converted: 44, rate: 11.0 }
  ];

  const sourceConversionData = [
    { name: 'Instagram', value: 35, color: '#E1306C' },
    { name: 'Google', value: 28, color: '#4285F4' },
    { name: 'Telegram', value: 18, color: '#0088CC' },
    { name: 'TikTok', value: 12, color: '#000000' },
    { name: 'Прямые', value: 7, color: '#F59E0B' }
  ];

  const weeklyTrendsData = [
    { week: 'Нед 1', visitors: 8500, applications: 980, rate: 11.5 },
    { week: 'Нед 2', visitors: 9200, applications: 1150, rate: 12.5 },
    { week: 'Нед 3', visitors: 10800, applications: 1380, rate: 12.8 },
    { week: 'Нед 4', visitors: 10000, applications: 1200, rate: 12.0 }
  ];

  const funnelStats = [
    {
      title: 'Общая конверсия',
      value: '12.0%',
      change: '+2.3%',
      icon: Percent,
      color: 'green'
    },
    {
      title: 'Среднее время',
      value: '8:45',
      change: '-15%',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Лучший этап',
      value: 'Заявка → Отправка',
      change: '67%',
      icon: Target,
      color: 'yellow'
    },
    {
      title: 'Проблемный этап',
      value: 'Клик → Заявка',
      change: '44% отсев',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Воронки конверсий</h1>
              <p className="mt-1 text-sm text-gray-300">
                Анализ пути пользователей и точек оттока
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select
                value={selectedFunnel}
                onChange={(e) => setSelectedFunnel(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="job_application">Подача заявки</option>
                <option value="employer_registration">Регистрация работодателя</option>
              </select>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="quarter">Квартал</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Funnel Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {funnelStats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-500/20 border-blue-400/30 text-blue-400",
              green: "bg-green-500/20 border-green-400/30 text-green-400",
              yellow: "bg-yellow-500/20 border-yellow-400/30 text-yellow-400",
              red: "bg-red-500/20 border-red-400/30 text-red-400"
            };

            return (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">{stat.title}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${stat.color === 'green' ? 'text-green-400' : stat.color === 'red' ? 'text-red-400' : 'text-gray-400'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${colorClasses[stat.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Funnel */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">
            {selectedFunnel === 'job_application' ? 'Воронка подачи заявок' : 'Воронка регистрации работодателей'}
          </h3>
          
          <div className="space-y-6">
            {currentFunnel.map((stage, index) => (
              <FunnelStage
                key={index}
                stage={stage}
                color={
                  index === 0 ? 'text-blue-400' :
                  index === 1 ? 'text-purple-400' :
                  index === 2 ? 'text-yellow-400' :
                  index === 3 ? 'text-orange-400' :
                  'text-green-400'
                }
                isLast={index === currentFunnel.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Analysis Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Time to Conversion */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Время до конверсии</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeToConversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Bar dataKey="users" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Analysis */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Источники конверсий</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceConversionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelStyle={{ fill: '#ffffff', fontSize: '12px' }}
                  >
                    {sourceConversionData.map((entry, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Device Conversion & Weekly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Device Conversion */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Конверсия по устройствам</h3>
            <div className="space-y-4">
              {deviceConversionData.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{device.device}</p>
                    <p className="text-sm text-gray-400">{device.total.toLocaleString()} посетителей</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-400">{device.rate}%</p>
                    <p className="text-sm text-gray-400">{device.converted} конверсий</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trends */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Тренды по неделям</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnels;