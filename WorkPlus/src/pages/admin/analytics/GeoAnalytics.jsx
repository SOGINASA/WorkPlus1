import React, { useState } from 'react';
import {
  MapPin,
  Users,
  Briefcase,
  TrendingUp,
  Filter,
  Download,
  BarChart3,
  Activity,
  Clock,
  Target,
  ArrowUp,
  ArrowDown,
  Building2,
  Eye,
  Search,
  Globe
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter } from 'recharts';

const RegionCard = ({ region, isSelected, onClick }) => {
  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-400';
    if (growth < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <ArrowUp className="w-4 h-4" />;
    if (growth < 0) return <ArrowDown className="w-4 h-4" />;
    return null;
  };

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-xl border transition-all ${
        isSelected 
          ? 'bg-yellow-400/10 border-yellow-400/40' 
          : 'bg-gray-800/50 border-yellow-400/20 hover:border-yellow-400/40'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-yellow-400 mr-2" />
          <h3 className="font-semibold text-white">{region.name}</h3>
        </div>
        <div className={`flex items-center ${getGrowthColor(region.growth)}`}>
          {getGrowthIcon(region.growth)}
          <span className="text-sm font-medium ml-1">{Math.abs(region.growth)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="text-xl font-bold text-white">{region.users}</div>
          <div className="text-xs text-gray-400">Пользователи</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-400">{region.jobs}</div>
          <div className="text-xs text-gray-400">Вакансии</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-400">{region.applications}</div>
          <div className="text-xs text-gray-400">Отклики</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400">{region.employers}</div>
          <div className="text-xs text-gray-400">Работодатели</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Конверсия:</span>
          <span className="text-purple-400 font-medium">{region.conversionRate}%</span>
        </div>
      </div>
    </div>
  );
};

const CityRanking = ({ cities, metric }) => {
  const getMetricValue = (city, metric) => {
    switch(metric) {
      case 'users': return city.users;
      case 'jobs': return city.jobs;
      case 'applications': return city.applications;
      case 'growth': return city.growth;
      default: return city.users;
    }
  };

  const sortedCities = [...cities].sort((a, b) => getMetricValue(b, metric) - getMetricValue(a, metric));

  return (
    <div className="space-y-3">
      {sortedCities.slice(0, 10).map((city, index) => (
        <div key={city.name} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm mr-3">
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-white">{city.name}</p>
              <p className="text-sm text-gray-400">{city.region}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-white">{getMetricValue(city, metric).toLocaleString()}</p>
            {metric !== 'growth' && (
              <p className={`text-sm ${city.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {city.growth > 0 ? '+' : ''}{city.growth}%
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const GeoAnalytics = () => {
  const [selectedRegion, setSelectedRegion] = useState('almaty');
  const [selectedMetric, setSelectedMetric] = useState('users');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');

  const regionData = [
    {
      id: 'almaty',
      name: 'Алматы',
      users: 15420,
      jobs: 2850,
      applications: 8900,
      employers: 680,
      conversionRate: 12.8,
      growth: 15.3,
      coordinates: [76.9, 43.25]
    },
    {
      id: 'astana',
      name: 'Нур-Султан',
      users: 12800,
      jobs: 2100,
      applications: 7200,
      employers: 520,
      conversionRate: 11.4,
      growth: 22.1,
      coordinates: [71.43, 51.18]
    },
    {
      id: 'shymkent',
      name: 'Шымкент',
      users: 8500,
      jobs: 1450,
      applications: 4800,
      employers: 320,
      conversionRate: 10.2,
      growth: 8.7,
      coordinates: [69.6, 42.32]
    },
    {
      id: 'karaganda',
      name: 'Караганда',
      users: 6200,
      jobs: 980,
      applications: 3400,
      employers: 245,
      conversionRate: 9.8,
      growth: -2.1,
      coordinates: [73.1, 49.8]
    },
    {
      id: 'aktau',
      name: 'Актау',
      users: 4800,
      jobs: 750,
      applications: 2100,
      employers: 180,
      conversionRate: 13.2,
      growth: 18.9,
      coordinates: [51.15, 43.65]
    },
    {
      id: 'pavlodar',
      name: 'Павлодар',
      users: 3900,
      jobs: 620,
      applications: 1800,
      employers: 150,
      conversionRate: 8.9,
      growth: 5.4,
      coordinates: [76.95, 52.3]
    }
  ];

  const cityData = [
    { name: 'Алматы', region: 'Алматинская', users: 15420, jobs: 2850, applications: 8900, growth: 15.3 },
    { name: 'Нур-Султан', region: 'Акмолинская', users: 12800, jobs: 2100, applications: 7200, growth: 22.1 },
    { name: 'Шымкент', region: 'Туркестанская', users: 8500, jobs: 1450, applications: 4800, growth: 8.7 },
    { name: 'Караганда', region: 'Карагандинская', users: 6200, jobs: 980, applications: 3400, growth: -2.1 },
    { name: 'Актау', region: 'Мангистауская', users: 4800, jobs: 750, applications: 2100, growth: 18.9 },
    { name: 'Павлодар', region: 'Павлодарская', users: 3900, jobs: 620, applications: 1800, growth: 5.4 },
    { name: 'Усть-Каменогорск', region: 'Восточно-Казахстанская', users: 3200, jobs: 480, applications: 1500, growth: 3.8 },
    { name: 'Семей', region: 'Восточно-Казахстанская', users: 2800, jobs: 420, applications: 1200, growth: 7.2 },
    { name: 'Атырау', region: 'Атырауская', users: 2600, jobs: 380, applications: 1100, growth: 12.5 },
    { name: 'Костанай', region: 'Костанайская', users: 2400, jobs: 350, applications: 980, growth: 6.1 }
  ];

  const selectedRegionData = regionData.find(r => r.id === selectedRegion);

  const industryByRegionData = [
    { industry: 'IT/Технологии', almaty: 850, astana: 620, shymkent: 180, karaganda: 95, aktau: 45, pavlodar: 38 },
    { industry: 'Продажи', almaty: 680, astana: 520, shymkent: 420, karaganda: 280, aktau: 190, pavlodar: 150 },
    { industry: 'Производство', almaty: 320, astana: 180, shymkent: 380, karaganda: 450, aktau: 280, pavlodar: 350 },
    { industry: 'Финансы', almaty: 480, astana: 380, shymkent: 120, karaganda: 85, aktau: 95, pavlodar: 45 },
    { industry: 'Образование', almaty: 280, astana: 320, shymkent: 250, karaganda: 180, aktau: 90, pavlodar: 120 },
    { industry: 'Логистика', almaty: 420, astana: 290, shymkent: 320, karaganda: 180, aktau: 220, pavlodar: 160 }
  ];

  const timeSeriesData = [
    { month: 'Янв', almaty: 12000, astana: 9800, shymkent: 7200, karaganda: 5800, aktau: 3900, pavlodar: 3200 },
    { month: 'Фев', almaty: 12500, astana: 10200, shymkent: 7500, karaganda: 5900, aktau: 4100, pavlodar: 3300 },
    { month: 'Мар', almaty: 13200, astana: 10800, shymkent: 7800, karaganda: 6000, aktau: 4300, pavlodar: 3400 },
    { month: 'Апр', almaty: 13800, astana: 11400, shymkent: 8000, karaganda: 6100, aktau: 4500, pavlodar: 3600 },
    { month: 'Май', almaty: 14300, astana: 11900, shymkent: 8200, karaganda: 6150, aktau: 4650, pavlodar: 3750 },
    { month: 'Июн', almaty: 14800, astana: 12300, shymkent: 8350, karaganda: 6180, aktau: 4750, pavlodar: 3850 },
    { month: 'Июл', almaty: 15200, astana: 12600, shymkent: 8450, karaganda: 6180, aktau: 4750, pavlodar: 3850 },
    { month: 'Авг', almaty: 15420, astana: 12800, shymkent: 8500, karaganda: 6200, aktau: 4800, pavlodar: 3900 }
  ];

  const geoStats = [
    {
      title: 'Охват регионов',
      value: '14 областей',
      change: '+2 новых',
      icon: Globe,
      color: 'blue'
    },
    {
      title: 'Топ регион',
      value: 'Алматы',
      change: '15,420 пользователей',
      icon: MapPin,
      color: 'yellow'
    },
    {
      title: 'Быстрорастущий',
      value: 'Нур-Султан',
      change: '+22.1% рост',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Средняя конверсия',
      value: '11.2%',
      change: '+1.8%',
      icon: Target,
      color: 'purple'
    }
  ];

  const filteredCities = cityData.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Гео-аналитика</h1>
              <p className="mt-1 text-sm text-gray-300">
                Анализ активности по регионам и городам Казахстана
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="quarter">Квартал</option>
                <option value="year">Год</option>
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
        {/* Geo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {geoStats.map((stat, index) => {
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
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-green-400">{stat.change}</span>
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

        {/* Region Selection */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Регионы Казахстана</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionData.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                isSelected={selectedRegion === region.id}
                onClick={() => setSelectedRegion(region.id)}
              />
            ))}
          </div>
        </div>

        {/* Regional Analysis */}
        {selectedRegionData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Industry Distribution */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Распределение по отраслям - {selectedRegionData.name}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryByRegionData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="industry" type="category" stroke="#9CA3AF" width={100} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Bar dataKey={selectedRegion} fill="#F59E0B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Time Series */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Динамика активности</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
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
                    <Line 
                      type="monotone" 
                      dataKey={selectedRegion} 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* City Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Рейтинг городов</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="users">По пользователям</option>
                <option value="jobs">По вакансиям</option>
                <option value="applications">По откликам</option>
                <option value="growth">По росту</option>
              </select>
            </div>
            <CityRanking cities={filteredCities} metric={selectedMetric} />
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Поиск городов</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по городу или области..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
            </div>

            {/* Performance Insights */}
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
                <h4 className="font-medium text-green-400 mb-2">Лучшая конверсия</h4>
                <p className="text-sm text-gray-300">Актау показывает конверсию 13.2% - на 18% выше среднего</p>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">Быстрый рост</h4>
                <p className="text-sm text-gray-300">Нур-Султан демонстрирует рост 22.1% месяц к месяцу</p>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                <h4 className="font-medium text-yellow-400 mb-2">Потенциал развития</h4>
                <p className="text-sm text-gray-300">Караганда нуждается в улучшении retention стратегий</p>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
                <h4 className="font-medium text-purple-400 mb-2">Новые возможности</h4>
                <p className="text-sm text-gray-300">Региональные города показывают хороший потенциал для масштабирования</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoAnalytics;