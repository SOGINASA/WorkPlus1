import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  Target,
  Users,
  Building2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';

const FinancialSummaryCard = ({ title, amount, change, changeType, period, comparison, icon: Icon, color = "yellow" }) => {
  const colorClasses = {
    yellow: "bg-yellow-500/20 border-yellow-400/30 text-yellow-400",
    green: "bg-green-500/20 border-green-400/30 text-green-400",
    blue: "bg-blue-500/20 border-blue-400/30 text-blue-400",
    red: "bg-red-500/20 border-red-400/30 text-red-400",
    purple: "bg-purple-500/20 border-purple-400/30 text-purple-400"
  };

  const getChangeColor = (type) => {
    return type === 'up' ? 'text-green-400' : 'text-red-400';
  };

  const ChangeIcon = changeType === 'up' ? ArrowUp : ArrowDown;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center ${getChangeColor(changeType)}`}>
          <ChangeIcon className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold text-white mb-2">{amount}</p>
      <p className="text-xs text-gray-400 mb-1">{period}</p>
      {comparison && (
        <p className="text-xs text-gray-500">{comparison}</p>
      )}
    </div>
  );
};

const ReportCard = ({ report, onDownload, onView, onGenerate }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'ready': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'generating': return <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <FileText className="w-8 h-8 text-yellow-400 mr-3" />
          <div>
            <h3 className="font-semibold text-white">{report.name}</h3>
            <p className="text-sm text-gray-400">{report.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(report.status)}
          <span className="text-xs text-gray-400 capitalize">
            {report.status === 'ready' ? 'Готов' : 
             report.status === 'generating' ? 'Генерация' : 
             report.status === 'error' ? 'Ошибка' : 'Ожидание'}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Период:</span>
          <span className="text-gray-300">{report.period}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Последнее обновление:</span>
          <span className="text-gray-300">{report.lastUpdated}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Размер:</span>
          <span className="text-gray-300">{report.size}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onGenerate(report.id)}
          disabled={report.status === 'generating'}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${report.status === 'generating' ? 'animate-spin' : ''}`} />
          Обновить
        </button>
        <button
          onClick={() => onView(report.id)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          Просмотр
        </button>
        <button
          onClick={() => onDownload(report.id)}
          disabled={report.status !== 'ready'}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Скачать
        </button>
      </div>
    </div>
  );
};

const FinancialReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const financialSummary = [
    {
      title: 'Общая выручка',
      amount: '₸5,235,000',
      change: '+12.8%',
      changeType: 'up',
      period: 'за август 2025',
      comparison: 'vs ₸4,640,000 в июле',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      title: 'Операционная прибыль',
      amount: '₸3,890,000',
      change: '+15.3%',
      changeType: 'up',
      period: 'после расходов',
      comparison: 'Маржа: 74.3%',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Расходы',
      amount: '₸1,345,000',
      change: '+8.7%',
      changeType: 'down',
      period: 'операционные расходы',
      comparison: '25.7% от выручки',
      icon: TrendingDown,
      color: 'red'
    },
    {
      title: 'EBITDA',
      amount: '₸4,120,000',
      change: '+18.2%',
      changeType: 'up',
      period: 'до налогов и амортизации',
      comparison: 'Маржа: 78.7%',
      icon: Target,
      color: 'purple'
    }
  ];

  const reports = [
    {
      id: 'profit-loss',
      name: 'Отчет о прибылях и убытках',
      description: 'Подробный P&L с разбивкой по статьям',
      period: 'Август 2025',
      lastUpdated: '30.08.2025 09:15',
      size: '2.4 MB',
      status: 'ready'
    },
    {
      id: 'cash-flow',
      name: 'Отчет о движении денежных средств',
      description: 'Cash Flow по операционной, инвестиционной и финансовой деятельности',
      period: 'Август 2025',
      lastUpdated: '30.08.2025 08:45',
      size: '1.8 MB',
      status: 'ready'
    },
    {
      id: 'balance-sheet',
      name: 'Балансовый отчет',
      description: 'Активы, пассивы и собственный капитал',
      period: 'На 31.08.2025',
      lastUpdated: '29.08.2025 16:30',
      size: '3.2 MB',
      status: 'generating'
    },
    {
      id: 'revenue-analysis',
      name: 'Анализ выручки',
      description: 'Детальный разбор источников дохода',
      period: 'Q3 2025',
      lastUpdated: '28.08.2025 14:20',
      size: '4.1 MB',
      status: 'ready'
    },
    {
      id: 'cost-analysis',
      name: 'Анализ затрат',
      description: 'Структура расходов и оптимизация',
      period: 'Q3 2025',
      lastUpdated: '27.08.2025 11:15',
      size: '2.9 MB',
      status: 'ready'
    },
    {
      id: 'budget-variance',
      name: 'Отклонения от бюджета',
      description: 'Сравнение фактических и плановых показателей',
      period: 'Август 2025',
      lastUpdated: '26.08.2025 15:45',
      size: '1.5 MB',
      status: 'error'
    }
  ];

  const profitLossData = [
    { month: 'Янв', revenue: 3800000, expenses: 1200000, profit: 2600000 },
    { month: 'Фев', revenue: 4200000, expenses: 1250000, profit: 2950000 },
    { month: 'Мар', revenue: 4580000, expenses: 1300000, profit: 3280000 },
    { month: 'Апр', revenue: 4750000, expenses: 1280000, profit: 3470000 },
    { month: 'Май', revenue: 4920000, expenses: 1320000, profit: 3600000 },
    { month: 'Июн', revenue: 5150000, expenses: 1350000, profit: 3800000 },
    { month: 'Июл', revenue: 4640000, expenses: 1290000, profit: 3350000 },
    { month: 'Авг', revenue: 5235000, expenses: 1345000, profit: 3890000 }
  ];

  const expenseBreakdownData = [
    { category: 'Персонал', amount: 658000, percentage: 48.9, color: '#F59E0B' },
    { category: 'Маркетинг', amount: 269000, percentage: 20.0, color: '#22C55E' },
    { category: 'Технологии', amount: 202000, percentage: 15.0, color: '#3B82F6' },
    // { category: 'Офис и аренда', amount: 135000, percentage: 10.0, color: '#8B5CF6' },
    { category: 'Прочие', amount: 81000, percentage: 6.1, color: '#EF4444' }
  ];

  const cashFlowData = [
    { month: 'Янв', operating: 2400000, investing: -150000, financing: -50000, net: 2200000 },
    { month: 'Фев', operating: 2750000, investing: -180000, financing: -60000, net: 2510000 },
    { month: 'Мар', operating: 3100000, investing: -200000, financing: 100000, net: 3000000 },
    { month: 'Апр', operating: 3300000, investing: -120000, financing: -70000, net: 3110000 },
    { month: 'Май', operating: 3450000, investing: -250000, financing: -80000, net: 3120000 },
    { month: 'Июн', operating: 3650000, investing: -300000, financing: 200000, net: 3550000 },
    { month: 'Июл', operating: 3200000, investing: -100000, financing: -90000, net: 3010000 },
    { month: 'Авг', operating: 3720000, investing: -180000, financing: -100000, net: 3440000 }
  ];

  const kpiData = [
    { metric: 'Gross Margin', current: 74.3, target: 75.0, previous: 71.8 },
    { metric: 'EBITDA Margin', current: 78.7, target: 80.0, previous: 76.2 },
    { metric: 'Operating Margin', current: 74.3, target: 75.0, previous: 72.1 },
    { metric: 'ROI', current: 18.4, target: 20.0, previous: 16.8 },
    { metric: 'Revenue Growth', current: 12.8, target: 15.0, previous: 8.5 }
  ];

  const handleDownload = (reportId) => {
    console.log(`Downloading report: ${reportId}`);
  };

  const handleView = (reportId) => {
    console.log(`Viewing report: ${reportId}`);
  };

  const handleGenerate = (reportId) => {
    console.log(`Generating report: ${reportId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Финансовые отчеты</h1>
              <p className="mt-1 text-sm text-gray-300">
                Комплексная финансовая отчетность и анализ
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="month">Месяц</option>
                <option value="quarter">Квартал</option>
                <option value="year">Год</option>
                <option value="custom">Настраиваемый</option>
              </select>
              <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all">
                <Download className="w-4 h-4 mr-2" />
                Экспорт всех
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financialSummary.map((item, index) => (
            <FinancialSummaryCard key={index} {...item} />
          ))}
        </div>

        {/* P&L and Expense Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Прибыли и убытки</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={profitLossData}>
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
                  <Area type="monotone" dataKey="revenue" fill="#3B82F6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="expenses" fill="#EF4444" fillOpacity={0.3} />
                  <Line type="monotone" dataKey="profit" stroke="#F59E0B" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Структура расходов</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdownData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="amount"
                    label={({ category, percentage }) => `${category} ${percentage}%`}
                    labelStyle={{ fill: '#ffffff', fontSize: '12px' }}
                  >
                    {expenseBreakdownData.map((entry, index) => (
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
                    formatter={(value) => [`₸${value.toLocaleString()}`, 'Сумма']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Cash Flow Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Движение денежных средств</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData}>
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
                  <Area type="monotone" dataKey="operating" stackId="1" stroke="#22C55E" fill="#22C55E" />
                  <Area type="monotone" dataKey="investing" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="financing" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                  <Line type="monotone" dataKey="net" stroke="#F59E0B" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* KPI Dashboard */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Ключевые показатели</h3>
            <div className="space-y-6">
              {kpiData.map((kpi, index) => (
                <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{kpi.metric}</span>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={`font-medium ${kpi.current >= kpi.target ? 'text-green-400' : 'text-yellow-400'}`}>
                        {kpi.current}%
                      </span>
                      <span className="text-gray-400">/ {kpi.target}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${kpi.current >= kpi.target ? 'bg-green-400' : 'bg-yellow-400'}`}
                      style={{ width: `${(kpi.current / kpi.target) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Пред. период: {kpi.previous}%</span>
                    <span className={kpi.current > kpi.previous ? 'text-green-400' : 'text-red-400'}>
                      {kpi.current > kpi.previous ? '+' : ''}{(kpi.current - kpi.previous).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Доступные отчеты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <ReportCard
                key={index}
                report={report}
                onDownload={handleDownload}
                onView={handleView}
                onGenerate={handleGenerate}
              />
            ))}
          </div>
        </div>

        {/* Financial Insights */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Финансовые инсайты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                <h4 className="font-medium text-green-400">Положительная динамика</h4>
              </div>
              <p className="text-sm text-gray-300">Выручка растет на 12.8% месяц к месяцу, EBITDA маржа улучшилась до 78.7%</p>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-yellow-400 mr-2" />
                <h4 className="font-medium text-yellow-400">Близко к целевым показателям</h4>
              </div>
              <p className="text-sm text-gray-300">Gross Margin (74.3%) близка к целевой (75%), ROI требует улучшения</p>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-blue-400 mr-2" />
                <h4 className="font-medium text-blue-400">Оптимизация затрат</h4>
              </div>
              <p className="text-sm text-gray-300">48.9% расходов на персонал - в пределах нормы, маркетинг показывает хорошую эффективность</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;