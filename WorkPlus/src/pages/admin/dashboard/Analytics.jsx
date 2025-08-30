import React, { useState } from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  Eye,
  UserCheck,
  Clock,
  Download,
  MapPin,
  Smartphone,
  Monitor,
  Share2
} from 'lucide-react';

const MetricCard = ({ title, value, change, changeType, icon: Icon, color = "blue", description }) => {
  const colorClasses = {
    blue: "bg-blue-500/20 border-blue-400/30 text-blue-400",
    green: "bg-green-500/20 border-green-400/30 text-green-400",
    yellow: "bg-yellow-500/20 border-yellow-400/30 text-yellow-400",
    red: "bg-red-500/20 border-red-400/30 text-red-400",
    purple: "bg-purple-500/20 border-purple-400/30 text-purple-400"
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-300">{title}</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 mb-2">{description}</p>
          )}
          {change && (
            <div className="flex items-center">
              <TrendingUp className={`w-4 h-4 mr-1 ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-sm font-medium ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {change}
              </span>
              <span className="text-xs text-gray-400 ml-1">за неделю</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data for charts
  const visitorsData = [
    { date: '01.03', visitors: 2400, applications: 240, vacancies: 80 },
    { date: '02.03', visitors: 2610, applications: 290, vacancies: 95 },
    { date: '03.03', visitors: 2950, applications: 320, vacancies: 110 },
    { date: '04.03', visitors: 3200, applications: 280, vacancies: 85 },
    { date: '05.03', visitors: 2800, applications: 350, vacancies: 125 },
    { date: '06.03', visitors: 3500, applications: 410, vacancies: 140 },
    { date: '07.03', visitors: 3100, applications: 380, vacancies: 120 }
  ];

  const categoryData = [
    { name: 'IT/Программирование', value: 35, color: '#F59E0B' },
    { name: 'Продажи', value: 25, color: '#10B981' },
    { name: 'Маркетинг', value: 15, color: '#3B82F6' },
    { name: 'Логистика', value: 12, color: '#EF4444' },
    { name: 'Другие', value: 13, color: '#8B5CF6' }
  ];

  const regionData = [
    { region: 'Алматы', jobs: 450, percent: 32 },
    { region: 'Нур-Султан', jobs: 380, percent: 27 },
    { region: 'Шымкент', jobs: 220, percent: 16 },
    { region: 'Караганда', jobs: 180, percent: 13 },
    { region: 'Актау', jobs: 90, percent: 6 },
    { region: 'Другие', jobs: 80, percent: 6 }
  ];

  const deviceData = [
    { device: 'Мобильные', users: 8450, percent: 68 },
    { device: 'Десктоп', users: 3200, percent: 26 },
    { device: 'Планшет', users: 750, percent: 6 }
  ];

  const socialData = [
    { platform: 'Instagram', posts: 45, reach: 125000, engagement: 5.2 },
    { platform: 'Telegram', posts: 38, reach: 89000, engagement: 8.7 },
    { platform: 'TikTok', posts: 22, reach: 67000, engagement: 12.3 },
    { platform: 'Threads', posts: 15, reach: 34000, engagement: 6.8 }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Аналитика</h1>
              <p className="mt-1 text-sm text-gray-300">
                Детальная статистика и метрики платформы
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="7d">7 дней</option>
                <option value="30d">30 дней</option>
                <option value="90d">90 дней</option>
                <option value="1y">1 год</option>
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Посетители"
            value="21,450"
            change="+15.3%"
            changeType="up"
            icon={Users}
            color="blue"
            description="Уникальных пользователей"
          />
          <MetricCard
            title="Просмотры страниц"
            value="89,230"
            change="+8.7%"
            changeType="up"
            icon={Eye}
            color="green"
            description="Всего просмотров"
          />
          <MetricCard
            title="Отклики на вакансии"
            value="2,847"
            change="+22.1%"
            changeType="up"
            icon={UserCheck}
            color="yellow"
            description="Общее количество"
          />
          <MetricCard
            title="Время на сайте"
            value="4:23"
            change="+5.8%"
            changeType="up"
            icon={Clock}
            color="purple"
            description="Среднее время сессии"
          />
        </div>

        {/* Traffic Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Трафик и активность</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Посетители</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Отклики</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Вакансии</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Area type="monotone" dataKey="visitors" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Area type="monotone" dataKey="applications" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                <Area type="monotone" dataKey="vacancies" stackId="3" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Categories Pie Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Категории вакансий</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
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

          {/* Regional Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">География вакансий</h3>
            <div className="space-y-4">
              {regionData.map((region, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-yellow-400 mr-3" />
                    <span className="text-sm font-medium text-white">{region.region}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" 
                        style={{ width: `${region.percent}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-300 w-12">{region.jobs}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Device & Social Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Device Analytics */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Устройства пользователей</h3>
            <div className="space-y-4">
              {deviceData.map((device, index) => {
                const Icon = device.device === 'Мобильные' ? Smartphone : Monitor;
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 text-yellow-400 mr-3" />
                      <span className="font-medium text-white">{device.device}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{device.users.toLocaleString()}</p>
                      <p className="text-sm text-gray-300">{device.percent}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social Media Performance */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Эффективность соцсетей</h3>
            <div className="space-y-4">
              {socialData.map((social, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center">
                    <Share2 className="w-5 h-5 text-yellow-400 mr-3" />
                    <div>
                      <p className="font-medium text-white">{social.platform}</p>
                      <p className="text-sm text-gray-300">{social.posts} постов</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{social.reach.toLocaleString()}</p>
                    <p className="text-sm text-green-400">{social.engagement}% вовлечение</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
