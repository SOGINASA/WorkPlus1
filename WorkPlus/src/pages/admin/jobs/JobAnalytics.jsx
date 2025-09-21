// src/pages/admin/JobAnalytics.jsx
import React, { useState, useEffect } from "react";
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
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  getAnalyticsSummary,
  getViewsData,
  getCategories,
  getLocations,
  getTopJobs,
} from "../../../components/api/JobAnalyticsService";

const JobAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [summary, setSummary] = useState(null);
  const [viewsData, setViewsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [topJobs, setTopJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const getChangeIndicator = (value, isPositive = true) => (
    <div
      className={`flex items-center ${isPositive ? "text-green-400" : "text-red-400"}`}
    >
      {isPositive ? (
        <TrendingUp className="w-4 h-4 mr-1" />
      ) : (
        <TrendingDown className="w-4 h-4 mr-1" />
      )}
      <span className="text-sm font-medium">{value}%</span>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const summaryData = await getAnalyticsSummary(timeRange, startDate, endDate);
        setSummary(summaryData);

        const views = await getViewsData(timeRange, startDate, endDate);
        setViewsData(views);

        const categories = await getCategories(timeRange, startDate, endDate);
        console.log("Категории вакансий:", categories);
        setCategoryData(categories);

        const locations = await getLocations(timeRange, startDate, endDate);
        console.log("Локации вакансий:", locations);
        setLocationData(locations);

        const top = await getTopJobs(timeRange, startDate, endDate);
        console.log("Топ вакансий:", top);
        setTopJobs(top);
      } catch (err) {
        console.error("Ошибка загрузки аналитики:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [timeRange, startDate, endDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg">Загрузка аналитики...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
          <div className="mb-4 md:mb-0">
            <div className="inline-flex items-center px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-3">
              <BarChart3 className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-sm font-medium">
                Аналитика
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Статистика вакансий
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Анализ просмотров, откликов и конверсии ваших вакансий
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="today">Сегодня</option>
              <option value="yesterday">Вчера</option>
              <option value="7d">7 дней</option>
              <option value="30d">30 дней</option>
              <option value="90d">90 дней</option>
              <option value="1y">1 год</option>
              <option value="custom">Выбрать период</option>
            </select>

            {timeRange === "custom" && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg text-sm px-2 py-1"
                />
                <input
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg text-sm px-2 py-1"
                />
              </div>
            )}

            <button className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center text-sm">
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </button>
          </div>
        </div>

        {/* Основные метрики */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white/5 border border-yellow-400/10 rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Всего просмотров</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {summary.views}
                  </p>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-yellow-400/10 rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Всего откликов</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {summary.applications}
                  </p>
                </div>
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-yellow-400/10 rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Конверсия</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {summary.conversion}%
                  </p>
                </div>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-yellow-400/10 rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">
                    Среднее время до отклика
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {summary.avg_response_time}ч
                  </p>
                </div>
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Графики */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
          <div className="lg:col-span-2 bg-white/5 border border-yellow-400/10 rounded-xl p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
              Динамика просмотров и откликов
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 border border-yellow-400/10 rounded-xl p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
              Категории вакансий
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  dataKey="jobs"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444"][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Legend wrapperStyle={{ color: "#9CA3AF" }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Топ вакансий и города */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
          {/* Топ вакансий */}
          <div className="bg-white/5 border border-yellow-400/10 rounded-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Топ-5 вакансий по откликам
              </h3>
            </div>
            <div className="divide-y divide-gray-700">
              {topJobs.map((job, index) => (
                <div key={job.id} className="p-4 hover:bg-white/5">
                  <div className="flex items-start justify-between">
                    <div>
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

          {/* Города */}
          <div className="bg-white/5 border border-yellow-400/10 rounded-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Статистика по городам
              </h3>
            </div>
            <div className="divide-y divide-gray-700">
              {locationData.map((loc) => (
                <div key={loc.city} className="p-4 hover:bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="font-medium text-white">{loc.city}</span>
                    </div>
                    <span className="text-sm text-gray-400">{loc.jobs} вакансий</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Отклики</p>
                      <p className="text-sm font-medium text-blue-400">{loc.applications}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Ср. просмотры</p>
                      <p className="text-sm font-medium text-green-400">{loc.avgViews}</p>
                    </div>
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

export default JobAnalytics;
