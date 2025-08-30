import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  MapPin, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  Star,
  Filter,
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Legend } from 'recharts';

const JobAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Мокк данные для графиков
  const viewsData = [
    { date: '01.08', views: 1250, applications: 45 },
    { date: '02.08', views: 1180, applications: 52 },
    { date: '03.08', views: 1420, applications: 38 },
    { date: '04.08', views: 1680, applications: 71 },
    { date: '05.08', views: 1350, applications: 49 },
    { date: '06.08', views: 1890, applications: 83 },
    { date: '07.08', views: 2100, applications: 95 },
    { date: '08.08', views: 1950, applications: 67 },
    { date: '09.08', views: 1780, applications: 58 },
    { date: '10.08', views: 2250, applications: 102 }
  ];

  const categoryData = [
    { name: 'Продажи', value: 35, applications: 245, color: '#F59E0B' },
    { name: 'Логистика', value: 25, applications: 189, color: '#10B981' },
    { name: 'Сервис', value: 20, applications: 156, color: '#3B82F6' },
    { name: 'Маркетинг', value: 12, applications: 98, color: '#8B5CF6' },
    { name: 'Финансы', value: 8, applications: 67, color: '#EF4444' }
  ];

  const locationData = [
    { city: 'Алматы', jobs: 145, applications: 892, avgViews: 245 },
    { city: 'Нур-Султан', jobs: 98, applications: 634, avgViews: 189 },
    { city: 'Шымкент', jobs: 67, applications: 423, avgViews: 156 },
    { city: 'Караганда', jobs: 45, applications: 298, avgViews: 134 },
    { city: 'Актобе', jobs: 38, applications: 245, avgViews: 112 }
  ];

  const topJobs = [
    { 
      id: 1, 
      title: 'SMM-менеджер', 
      company: 'Digital Agency Pro', 
      views: 1250, 
      applications: 45, 
      conversionRate: 3.6,
      category: 'Маркетинг'
    },
    { 
      id: 2, 
      title: 'Продавец-консультант', 
      company: 'Магазин Электроника', 
      views: 980, 
      applications: 52, 
      conversionRate: 5.3,
      category: 'Продажи'
    },
    { 
      id: 3, 
      title: 'Курьер', 
      company: 'Delivery Express', 
      views: 856, 
      applications: 38, 
      conversionRate: 4.4,
      category: 'Логистика'
    },
    { 
      id: 4, 
      title: 'Бухгалтер', 
      company: 'ТОО Финанс Групп', 
      views: 745, 
      applications: 29, 
      conversionRate: 3.9,
      category: 'Финансы'
    },
    { 
      id: 5, 
      title: 'Официант', 
      company: 'Ресторан Вкус', 
      views: 623, 
      applications: 34, 
      conversionRate: 5.5,
      category: 'Сервис'
    }
  ];

  const getChangeIndicator = (value, isPositive = true) => {
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? (
          <TrendingUp className="w-4 h-4 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 mr-1" />
        )}
        <span className="text-sm font-medium">{value}%</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
          <div className="mb-4 md:mb-0">
            <div className="inline-flex items-center px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-3">
              <BarChart3 className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-sm font-medium">Аналитика</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Статистика вакансий</h1>
            <p className="text-gray-300 text-sm md:text-base">Анализ просмотров, откликов и конверсии ваших вакансий</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">7 дней</option>
              <option value="30d">30 дней</option>
              <option value="90d">90 дней</option>
              <option value="1y">1 год</option>
            </select>
            
            <button className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center text-sm">
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </button>
          </div>
        </div>

        {/* Основные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">Всего просмотров</p>
                <p className="text-2xl md:text-3xl font-bold text-white">24,580</p>
              </div>
              <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg">
                <Eye className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-3">
              {getChangeIndicator('12.5', true)}
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">Всего откликов</p>
                <p className="text-2xl md:text-3xl font-bold text-white">1,247</p>
              </div>
              <div className="p-2 md:p-3 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              </div>
            </div>
            <div className="mt-3">
              {getChangeIndicator('8.3', true)}
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">Конверсия</p>
                <p className="text-2xl md:text-3xl font-bold text-white">5.07%</p>
              </div>
              <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-3">
              {getChangeIndicator('2.1', false)}
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">Среднее время до отклика</p>
                <p className="text-2xl md:text-3xl font-bold text-white">3.2ч</p>
              </div>
              <div className="p-2 md:p-3 bg-orange-500/20 rounded-lg">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
              </div>
            </div>
            <div className="mt-3">
              {getChangeIndicator('15.4', true)}
            </div>
          </div>
        </div>

        {/* Графики */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
          {/* График просмотров и откликов */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-white">Динамика просмотров и откликов</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-300">Просмотры</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-300">Отклики</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="applications" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Распределение по категориям */}
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Категории вакансий</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <RechartsPieChart data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
          {/* Топ вакансий */}
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-white">Топ-5 вакансий по откликам</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {topJobs.map((job, index) => (
                <div key={job.id} className="p-4 hover:bg-white/5 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="w-6 h-6 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </span>
                        <h4 className="font-medium text-white">{job.title}</h4>
                      </div>
                      <p className="text-sm text-gray-300 ml-9">{job.company}</p>
                      <div className="flex items-center ml-9 mt-2 space-x-4">
                        <span className="flex items-center text-sm text-gray-400">
                          <Eye className="w-4 h-4 mr-1" />
                          {job.views}
                        </span>
                        <span className="flex items-center text-sm text-blue-400 font-medium">
                          <Users className="w-4 h-4 mr-1" />
                          {job.applications}
                        </span>
                        <span className="text-sm text-green-400 font-medium">
                          {job.conversionRate}% конверсия
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Статистика по городам */}
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-white">Статистика по городам</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {locationData.map((location, index) => (
                <div key={location.city} className="p-4 hover:bg-white/5 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="font-medium text-white">{location.city}</span>
                    </div>
                    <span className="text-sm text-gray-400">{location.jobs} вакансий</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Отклики</p>
                      <p className="text-sm font-medium text-blue-400">{location.applications}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Ср. просмотры</p>
                      <p className="text-sm font-medium text-green-400">{location.avgViews}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" 
                        style={{ width: `${(location.applications / 892) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Дополнительная аналитика */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Средний рейтинг вакансий</h3>
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">4.3</p>
              <p className="text-sm text-gray-300">из 5 звезд</p>
              <div className="flex items-center justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Активность по дням</h3>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-2">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
                const activity = [85, 92, 78, 95, 88, 45, 32][index];
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{day}</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${activity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400 w-8">{activity}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Время отклика</h3>
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">0-1 час</span>
                  <span className="font-medium text-white">45%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">1-6 часов</span>
                  <span className="font-medium text-white">30%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">6+ часов</span>
                  <span className="font-medium text-white">25%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAnalytics;