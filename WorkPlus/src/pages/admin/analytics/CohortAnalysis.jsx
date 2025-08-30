import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Eye,
  BarChart3,
  Activity,
  Clock,
  Target,
  Percent,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const CohortHeatmap = ({ data, metric }) => {
  const getIntensityColor = (value, maxValue) => {
    const intensity = value / maxValue;
    if (intensity >= 0.8) return 'bg-green-500';
    if (intensity >= 0.6) return 'bg-green-400';
    if (intensity >= 0.4) return 'bg-yellow-400';
    if (intensity >= 0.2) return 'bg-orange-400';
    if (intensity > 0) return 'bg-red-400';
    return 'bg-gray-700';
  };

  const maxValue = Math.max(...data.flatMap(cohort => cohort.periods.map(p => p[metric])));

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Когортная карта - {metric === 'retention' ? 'Удержание' : metric === 'revenue' ? 'Выручка' : 'Активность'}
      </h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header */}
          <div className="flex mb-2">
            <div className="w-32 p-2 text-xs font-medium text-gray-400">Когорта</div>
            <div className="w-20 p-2 text-xs font-medium text-gray-400 text-center">Размер</div>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-16 p-2 text-xs font-medium text-gray-400 text-center">
                {i === 0 ? 'М0' : `М${i}`}
              </div>
            ))}
          </div>
          
          {/* Cohort Rows */}
          {data.map((cohort, index) => (
            <div key={index} className="flex mb-1">
              <div className="w-32 p-2 text-sm text-white bg-gray-700/50 rounded-l">
                {cohort.month}
              </div>
              <div className="w-20 p-2 text-sm text-center text-yellow-400 bg-gray-700/50">
                {cohort.size}
              </div>
              {cohort.periods.map((period, periodIndex) => (
                <div
                  key={periodIndex}
                  className={`w-16 p-2 text-xs text-center text-white ${getIntensityColor(period[metric], maxValue)} ${periodIndex === cohort.periods.length - 1 ? 'rounded-r' : ''}`}
                  title={`${period[metric]}${metric === 'retention' || metric === 'activity' ? '%' : '₸'}`}
                >
                  {period[metric] > 0 ? (
                    metric === 'revenue' ? 
                    `₸${period[metric]}` : 
                    `${period[metric]}%`
                  ) : '-'}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-6 space-x-4">
        <span className="text-xs text-gray-400">Низкий</span>
        <div className="flex space-x-1">
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <div className="w-4 h-4 bg-green-500 rounded"></div>
        </div>
        <span className="text-xs text-gray-400">Высокий</span>
      </div>
    </div>
  );
};

const CohortAnalysis = () => {
  const [selectedMetric, setSelectedMetric] = useState('retention');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCohortType, setSelectedCohortType] = useState('registration');

  // Sample cohort data
  const cohortData = [
    {
      month: 'Июл 2025',
      size: 1500,
      periods: [
        { retention: 100, revenue: 0, activity: 100 },
        { retention: 45, revenue: 150000, activity: 52 },
        { retention: 32, revenue: 280000, activity: 38 },
        { retention: 28, revenue: 320000, activity: 34 },
        { retention: 25, revenue: 350000, activity: 31 },
        { retention: 23, revenue: 380000, activity: 29 },
        { retention: 22, revenue: 400000, activity: 27 },
        { retention: 21, revenue: 420000, activity: 26 },
        { retention: 20, revenue: 440000, activity: 25 },
        { retention: 19, revenue: 460000, activity: 24 },
        { retention: 18, revenue: 480000, activity: 23 },
        { retention: 17, revenue: 500000, activity: 22 }
      ]
    },
    {
      month: 'Июн 2025',
      size: 1800,
      periods: [
        { retention: 100, revenue: 0, activity: 100 },
        { retention: 48, revenue: 180000, activity: 55 },
        { retention: 35, revenue: 350000, activity: 42 },
        { retention: 31, revenue: 410000, activity: 38 },
        { retention: 28, revenue: 450000, activity: 35 },
        { retention: 26, revenue: 480000, activity: 33 },
        { retention: 25, revenue: 510000, activity: 31 },
        { retention: 24, revenue: 540000, activity: 30 },
        { retention: 23, revenue: 570000, activity: 29 },
        { retention: 22, revenue: 600000, activity: 28 },
        { retention: 21, revenue: 630000, activity: 27 },
        { retention: 20, revenue: 660000, activity: 26 }
      ]
    },
    {
      month: 'Май 2025',
      size: 2200,
      periods: [
        { retention: 100, revenue: 0, activity: 100 },
        { retention: 52, revenue: 220000, activity: 58 },
        { retention: 38, revenue: 440000, activity: 45 },
        { retention: 34, revenue: 520000, activity: 41 },
        { retention: 31, revenue: 580000, activity: 38 },
        { retention: 29, revenue: 620000, activity: 36 },
        { retention: 28, revenue: 660000, activity: 34 },
        { retention: 27, revenue: 700000, activity: 33 },
        { retention: 26, revenue: 740000, activity: 32 },
        { retention: 25, revenue: 780000, activity: 31 },
        { retention: 24, revenue: 820000, activity: 30 },
        { retention: 23, revenue: 860000, activity: 29 }
      ]
    },
    {
      month: 'Апр 2025',
      size: 1900,
      periods: [
        { retention: 100, revenue: 0, activity: 100 },
        { retention: 46, revenue: 190000, activity: 53 },
        { retention: 33, revenue: 380000, activity: 40 },
        { retention: 29, revenue: 450000, activity: 36 },
        { retention: 26, revenue: 500000, activity: 33 },
        { retention: 24, revenue: 540000, activity: 31 },
        { retention: 23, revenue: 580000, activity: 29 },
        { retention: 22, revenue: 620000, activity: 28 },
        { retention: 21, revenue: 660000, activity: 27 },
        { retention: 20, revenue: 700000, activity: 26 },
        { retention: 19, revenue: 740000, activity: 25 },
        { retention: 18, revenue: 780000, activity: 24 }
      ]
    },
    {
      month: 'Мар 2025',
      size: 1700,
      periods: [
        { retention: 100, revenue: 0, activity: 100 },
        { retention: 43, revenue: 170000, activity: 50 },
        { retention: 30, revenue: 340000, activity: 37 },
        { retention: 26, revenue: 400000, activity: 33 },
        { retention: 23, revenue: 440000, activity: 30 },
        { retention: 21, revenue: 480000, activity: 28 },
        { retention: 20, revenue: 520000, activity: 26 },
        { retention: 19, revenue: 560000, activity: 25 },
        { retention: 18, revenue: 600000, activity: 24 },
        { retention: 17, revenue: 640000, activity: 23 },
        { retention: 15, revenue: 720000, activity: 21 }
      ]
    }
  ];

  // Retention trends for line chart
  const retentionTrends = [
    { period: 'М1', 'Мар 2025': 43, 'Апр 2025': 46, 'Май 2025': 52, 'Июн 2025': 48, 'Июл 2025': 45 },
    { period: 'М2', 'Мар 2025': 30, 'Апр 2025': 33, 'Май 2025': 38, 'Июн 2025': 35, 'Июл 2025': 32 },
    { period: 'М3', 'Мар 2025': 26, 'Апр 2025': 29, 'Май 2025': 34, 'Июн 2025': 31, 'Июл 2025': 28 },
    { period: 'М6', 'Мар 2025': 21, 'Апр 2025': 24, 'Май 2025': 29, 'Июн 2025': 26, 'Июл 2025': 23 },
    { period: 'М12', 'Мар 2025': 15, 'Апр 2025': 18, 'Май 2025': 23, 'Июн 2025': 20, 'Июл 2025': 17 }
  ];

  const ltv_data = [
    { cohort: 'Мар 2025', ltv_1m: 150, ltv_3m: 420, ltv_6m: 680, ltv_12m: 720 },
    { cohort: 'Апр 2025', ltv_1m: 180, ltv_3m: 480, ltv_6m: 740, ltv_12m: 780 },
    { cohort: 'Май 2025', ltv_1m: 200, ltv_3m: 520, ltv_6m: 820, ltv_12m: 860 },
    { cohort: 'Июн 2025', ltv_1m: 195, ltv_3m: 510, ltv_6m: 630, ltv_12m: 660 },
    { cohort: 'Июл 2025', ltv_1m: 190, ltv_3m: 480, ltv_6m: 500, ltv_12m: 500 }
  ];

  const cohortInsights = [
    {
      title: 'Средний retention 30 дней',
      value: '47.6%',
      change: '+3.2%',
      trend: 'up',
      description: 'Улучшение на 3.2% по сравнению с прошлым периодом'
    },
    {
      title: 'LTV за 12 месяцев',
      value: '₸765,000',
      change: '+8.1%',
      trend: 'up',
      description: 'Рост среднего LTV на 8.1%'
    },
    {
      title: 'Лучшая когорта',
      value: 'Май 2025',
      change: '23% retention в М12',
      trend: 'neutral',
      description: 'Наивысшие показатели удержания'
    },
    {
      title: 'Время до первого платежа',
      value: '12.3 дня',
      change: '-2.1 дня',
      trend: 'up',
      description: 'Ускорение конверсии в платящих'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Когортный анализ</h1>
              <p className="mt-1 text-sm text-gray-300">
                Анализ удержания и поведения пользователей по когортам
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select
                value={selectedCohortType}
                onChange={(e) => setSelectedCohortType(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="registration">По регистрации</option>
                <option value="first_job">По первой вакансии</option>
                <option value="payment">По первому платежу</option>
              </select>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="retention">Удержание</option>
                <option value="revenue">Выручка</option>
                <option value="activity">Активность</option>
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
        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cohortInsights.map((insight, index) => {
            const colorClasses = {
              up: "text-green-400",
              down: "text-red-400",
              neutral: "text-gray-400"
            };

            return (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-300">{insight.title}</h3>
                  {insight.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-400" />}
                  {insight.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-xl font-bold text-white mb-1">{insight.value}</p>
                <p className={`text-sm font-medium ${colorClasses[insight.trend]} mb-2`}>
                  {insight.change}
                </p>
                <p className="text-xs text-gray-400">{insight.description}</p>
              </div>
            );
          })}
        </div>

        {/* Cohort Heatmap */}
        <div className="mb-8">
          <CohortHeatmap data={cohortData} metric={selectedMetric} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Retention Trends */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Тренды удержания</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="period" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Line type="monotone" dataKey="Мар 2025" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Апр 2025" stroke="#F97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="Май 2025" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="Июн 2025" stroke="#22C55E" strokeWidth={2} />
                  <Line type="monotone" dataKey="Июл 2025" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LTV by Cohort */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">LTV по когортам (тыс. ₸)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ltv_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="cohort" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Area type="monotone" dataKey="ltv_12m" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="ltv_6m" stackId="2" stroke="#22C55E" fill="#22C55E" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="ltv_3m" stackId="3" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="ltv_1m" stackId="4" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Cohort Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Performing Cohorts */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Лучшие когорты</h3>
            <div className="space-y-4">
              {cohortData.slice(0, 3).map((cohort, index) => {
                const retention30 = cohort.periods[1]?.retention || 0;
                const ltv = cohort.periods[11]?.revenue || 0;
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{cohort.month}</p>
                      <p className="text-sm text-gray-400">{cohort.size} пользователей</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">{retention30}%</p>
                      <p className="text-xs text-gray-400">₸{ltv.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Retention Milestones */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Ключевые этапы</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <p className="font-medium text-white">День 1</p>
                    <p className="text-sm text-gray-400">Первое посещение</p>
                  </div>
                </div>
                <span className="text-blue-400 font-semibold">100%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-purple-400 mr-3" />
                  <div>
                    <p className="font-medium text-white">День 30</p>
                    <p className="text-sm text-gray-400">Месячная активность</p>
                  </div>
                </div>
                <span className="text-purple-400 font-semibold">47.6%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-yellow-400 mr-3" />
                  <div>
                    <p className="font-medium text-white">День 90</p>
                    <p className="text-sm text-gray-400">Долгосрочные пользователи</p>
                  </div>
                </div>
                <span className="text-yellow-400 font-semibold">33.2%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-green-400 mr-3" />
                  <div>
                    <p className="font-medium text-white">День 365</p>
                    <p className="text-sm text-gray-400">Годовое удержание</p>
                  </div>
                </div>
                <span className="text-green-400 font-semibold">19.6%</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Рекомендации</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
                <h4 className="font-medium text-green-400 mb-2">Улучшение onboarding</h4>
                <p className="text-sm text-gray-300">Снижение оттока в первые 7 дней на 15% увеличит 30-дневное удержание</p>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">Персонализация</h4>
                <p className="text-sm text-gray-300">Когорты с персонализированным контентом показывают +25% LTV</p>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                <h4 className="font-medium text-yellow-400 mb-2">Ремаркетинг</h4>
                <p className="text-sm text-gray-300">Запуск кампаний на 21-28 день может вернуть 12% пользователей</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortAnalysis;