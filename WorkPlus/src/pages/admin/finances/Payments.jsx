import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Filter,
  Download,
  Search,
  Eye,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Calendar,
  Building2,
  Smartphone,
  Globe
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { bg: 'bg-green-500/20', border: 'border-green-400/30', text: 'text-green-400', label: 'Завершен' },
    pending: { bg: 'bg-yellow-500/20', border: 'border-yellow-400/30', text: 'text-yellow-400', label: 'Ожидание' },
    failed: { bg: 'bg-red-500/20', border: 'border-red-400/30', text: 'text-red-400', label: 'Отклонен' },
    refunded: { bg: 'bg-purple-500/20', border: 'border-purple-400/30', text: 'text-purple-400', label: 'Возврат' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.border} ${config.text}`}>
      {config.label}
    </span>
  );
};

const PaymentMethodCard = ({ method }) => {
  const getMethodIcon = (type) => {
    switch(type) {
      case 'card': return <CreditCard className="w-5 h-5 text-blue-400" />;
      case 'bank': return <Building2 className="w-5 h-5 text-green-400" />;
      case 'mobile': return <Smartphone className="w-5 h-5 text-purple-400" />;
      case 'cash': return <Banknote className="w-5 h-5 text-yellow-400" />;
      default: return <Globe className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getMethodIcon(method.type)}
          <h3 className="font-semibold text-white ml-3">{method.name}</h3>
        </div>
        <div className={`flex items-center ${method.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {method.growth > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
          <span className="text-sm font-medium">{Math.abs(method.growth)}%</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Объем:</span>
          <span className="text-lg font-bold text-white">₸{method.volume.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Доля:</span>
          <span className="text-yellow-400 font-medium">{method.percentage}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Транзакции:</span>
          <span className="text-green-400 font-medium">{method.transactions}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Success Rate:</span>
          <span className={`font-medium ${method.successRate > 95 ? 'text-green-400' : method.successRate > 90 ? 'text-yellow-400' : 'text-red-400'}`}>
            {method.successRate}%
          </span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"
            style={{ width: `${method.percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const RecentTransactionRow = ({ transaction, index }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'refunded': return <RefreshCw className="w-4 h-4 text-purple-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <tr className="border-b border-gray-700/50 hover:bg-gray-700/20">
      <td className="py-3 px-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm mr-3">
            #{index + 1}
          </div>
          <div>
            <p className="font-medium text-white">{transaction.id}</p>
            <p className="text-sm text-gray-400">{transaction.customer}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="font-bold text-white">₸{transaction.amount.toLocaleString()}</span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-300">{transaction.method}</td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          {getStatusIcon(transaction.status)}
          <PaymentStatusBadge status={transaction.status} />
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-300">{transaction.date}</td>
      <td className="py-3 px-4">
        <button className="text-yellow-400 hover:text-yellow-300">
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

const Payments = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const paymentMethods = [
    {
      name: 'Kaspi Pay',
      type: 'mobile',
      volume: 2890000,
      percentage: 55.2,
      transactions: 1247,
      successRate: 98.5,
      growth: 18.3
    },
    {
      name: 'Банковские карты',
      type: 'card',
      volume: 1680000,
      percentage: 32.1,
      transactions: 845,
      successRate: 96.8,
      growth: 12.7
    },
    {
      name: 'Банковский перевод',
      type: 'bank',
      volume: 520000,
      percentage: 9.9,
      transactions: 156,
      successRate: 99.2,
      growth: -3.2
    },
    {
      name: 'Другие',
      type: 'cash',
      volume: 145000,
      percentage: 2.8,
      transactions: 78,
      successRate: 94.1,
      growth: 5.6
    }
  ];

  const paymentTrends = [
    { month: 'Янв', total: 3850000, kaspi: 2120000, cards: 1230000, bank: 420000, other: 80000, success: 96.2 },
    { month: 'Фев', total: 4200000, kaspi: 2310000, cards: 1350000, bank: 445000, other: 95000, success: 96.8 },
    { month: 'Мар', total: 4580000, kaspi: 2520000, cards: 1470000, bank: 480000, other: 110000, success: 97.1 },
    { month: 'Апр', total: 4750000, kaspi: 2620000, cards: 1520000, bank: 495000, other: 115000, success: 97.3 },
    { month: 'Май', total: 4920000, kaspi: 2710000, cards: 1580000, bank: 510000, other: 120000, success: 97.5 },
    { month: 'Июн', total: 5150000, kaspi: 2840000, cards: 1650000, bank: 520000, other: 140000, success: 97.8 },
    { month: 'Июл', total: 5320000, kaspi: 2930000, cards: 1710000, bank: 535000, other: 145000, success: 97.2 },
    { month: 'Авг', total: 5235000, kaspi: 2890000, cards: 1680000, bank: 520000, other: 145000, success: 97.6 }
  ];

  const recentTransactions = [
    {
      id: 'TXN-2025-08-001247',
      customer: 'Kaspi Bank Ltd.',
      amount: 250000,
      method: 'Kaspi Pay',
      status: 'completed',
      date: '30.08.2025 14:23'
    },
    {
      id: 'TXN-2025-08-001246',
      customer: 'TechStartup KZ',
      amount: 90000,
      method: 'Банковская карта',
      status: 'completed',
      date: '30.08.2025 11:15'
    },
    {
      id: 'TXN-2025-08-001245',
      customer: 'Beeline Kazakhstan',
      amount: 150000,
      method: 'Kaspi Pay',
      status: 'pending',
      date: '30.08.2025 09:45'
    },
    {
      id: 'TXN-2025-08-001244',
      customer: 'FinTech Solutions',
      amount: 180000,
      method: 'Банковский перевод',
      status: 'completed',
      date: '29.08.2025 16:30'
    },
    {
      id: 'TXN-2025-08-001243',
      customer: 'Retail Chain KZ',
      amount: 15000,
      method: 'Банковская карта',
      status: 'failed',
      date: '29.08.2025 13:20'
    },
    {
      id: 'TXN-2025-08-001242',
      customer: 'Government Agency',
      amount: 320000,
      method: 'Банковский перевод',
      status: 'completed',
      date: '29.08.2025 10:10'
    }
  ];

  const paymentStats = [
    {
      title: 'Общий объем',
      amount: '₸5,235,000',
      change: '+12.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      title: 'Успешных платежей',
      amount: '97.6%',
      change: '+0.4%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Средний чек',
      amount: '₸2,348',
      change: '+5.2%',
      trend: 'up',
      icon: CreditCard,
      color: 'blue'
    },
    {
      title: 'Возвратов',
      amount: '1.8%',
      change: '-0.3%',
      trend: 'up',
      icon: RefreshCw,
      color: 'purple'
    }
  ];

  const failureReasons = [
    { reason: 'Недостаточно средств', count: 45, percentage: 38.5 },
    { reason: 'Технический сбой', count: 28, percentage: 23.9 },
    { reason: 'Неверные данные карты', count: 22, percentage: 18.8 },
    { reason: 'Превышен лимит', count: 15, percentage: 12.8 },
    { reason: 'Заблокированная карта', count: 7, percentage: 6.0 }
  ];

  const weeklyVolume = [
    { week: 'Нед 1', volume: 1250000, transactions: 532 },
    { week: 'Нед 2', volume: 1380000, transactions: 589 },
    { week: 'Нед 3', volume: 1420000, transactions: 612 },
    { week: 'Нед 4', volume: 1185000, transactions: 498 }
  ];

  const filteredTransactions = recentTransactions.filter(transaction => {
    const matchesSearch = transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Платежи</h1>
              <p className="mt-1 text-sm text-gray-300">
                Мониторинг транзакций и платежных методов
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
        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {paymentStats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              yellow: "bg-yellow-500/20 border-yellow-400/30 text-yellow-400",
              green: "bg-green-500/20 border-green-400/30 text-green-400",
              blue: "bg-blue-500/20 border-blue-400/30 text-blue-400",
              purple: "bg-purple-500/20 border-purple-400/30 text-purple-400"
            };

            return (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg border ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">{stat.title}</h3>
                <p className="text-2xl font-bold text-white">{stat.amount}</p>
              </div>
            );
          })}
        </div>

        {/* Payment Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Динамика платежей</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={paymentTrends}>
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
                  <Area type="monotone" dataKey="total" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Success Rate по месяцам</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paymentTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[95, 100]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value) => [`${value}%`, 'Success Rate']}
                  />
                  <Line type="monotone" dataKey="success" stroke="#22C55E" strokeWidth={3} dot={{ fill: '#22C55E', strokeWidth: 2, r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Платежные методы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentMethods.map((method, index) => (
              <PaymentMethodCard key={index} method={method} />
            ))}
          </div>
        </div>

        {/* Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Failure Reasons */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Причины отклонений</h3>
            <div className="space-y-4">
              {failureReasons.map((reason, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-white">{reason.reason}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full"
                        style={{ width: `${reason.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-bold text-red-400">{reason.count}</p>
                    <p className="text-sm text-gray-400">{reason.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Volume */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Недельная динамика</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `₸${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value, name) => [
                      name === 'volume' ? `₸${value.toLocaleString()}` : value,
                      name === 'volume' ? 'Объем' : 'Транзакции'
                    ]}
                  />
                  <Bar dataKey="volume" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 sm:mb-0">Последние транзакции</h3>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск транзакций..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400 w-full sm:w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="all">Все статусы</option>
                <option value="completed">Завершены</option>
                <option value="pending">Ожидание</option>
                <option value="failed">Отклонены</option>
                <option value="refunded">Возвраты</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Транзакция</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Сумма</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Метод</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Статус</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Дата</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <RecentTransactionRow key={transaction.id} transaction={transaction} index={index} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Транзакции не найдены</h3>
              <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;