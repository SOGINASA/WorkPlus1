import React, { useState } from 'react';
import { Search, Building2, MoreHorizontal, Eye, Edit, Ban, CheckCircle, TrendingUp, Users, MapPin, Calendar, Phone, Mail, Star, Briefcase, Filter, Download } from 'lucide-react';

const EmployerList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEmployers, setSelectedEmployers] = useState([]);

  const subscriptions = [
    { value: 'all', label: 'Все тарифы' },
    { value: 'free', label: 'Free' },
    { value: 'start', label: 'Start' },
    { value: 'growth', label: 'Growth' },
    { value: 'pro', label: 'Pro' }
  ];

  const statuses = [
    { value: 'all', label: 'Все статусы' },
    { value: 'active', label: 'Активные' },
    { value: 'blocked', label: 'Заблокированные' },
    { value: 'pending', label: 'На модерации' }
  ];

  const employers = [
    {
      id: 1,
      companyName: 'Tech Solutions KZ',
      contactPerson: 'Анна Смирнова',
      email: 'hr@techsolutions.kz',
      phone: '+7 701 123 45 67',
      location: 'Петропавловск',
      subscription: 'pro',
      status: 'active',
      registeredDate: '15 ноя 2024',
      lastActivity: '2 часа назад',
      activeJobs: 8,
      totalJobs: 23,
      totalHires: 15,
      rating: 4.8,
      monthlySpent: 285000,
      industry: 'IT и разработка'
    },
    {
      id: 2,
      companyName: 'Retail Group Kazakhstan',
      contactPerson: 'Максим Петров',
      email: 'jobs@retailgroup.kz',
      phone: '+7 702 234 56 78',
      location: 'Костанай',
      subscription: 'growth',
      status: 'active',
      registeredDate: '20 окт 2024',
      lastActivity: '1 день назад',
      activeJobs: 12,
      totalJobs: 45,
      totalHires: 38,
      rating: 4.5,
      monthlySpent: 125000,
      industry: 'Розничная торговля'
    },
    {
      id: 3,
      companyName: 'Строительная компания "Север"',
      contactPerson: 'Елена Козлова',
      email: 'hr@sever-build.kz',
      phone: '+7 717 345 67 89',
      location: 'Петропавловск',
      subscription: 'start',
      status: 'active',
      registeredDate: '5 дек 2024',
      lastActivity: '3 часа назад',
      activeJobs: 5,
      totalJobs: 8,
      totalHires: 6,
      rating: 4.2,
      monthlySpent: 45000,
      industry: 'Строительство'
    },
    {
      id: 4,
      companyName: 'Кафе "Центральное"',
      contactPerson: 'Ольга Иванова',
      email: 'admin@central-cafe.kz',
      phone: '+7 703 456 78 90',
      location: 'Актау',
      subscription: 'free',
      status: 'blocked',
      registeredDate: '12 дек 2024',
      lastActivity: '5 дней назад',
      activeJobs: 0,
      totalJobs: 3,
      totalHires: 1,
      rating: 3.8,
      monthlySpent: 0,
      industry: 'Ресторанный бизнес'
    },
    {
      id: 5,
      companyName: 'ТОО "Логистика Плюс"',
      contactPerson: 'Дмитрий Волков',
      email: 'hr@logplus.kz',
      phone: '+7 704 567 89 01',
      location: 'Павлодар',
      subscription: 'growth',
      status: 'pending',
      registeredDate: '18 дек 2024',
      lastActivity: '12 часов назад',
      activeJobs: 3,
      totalJobs: 3,
      totalHires: 0,
      rating: 0,
      monthlySpent: 0,
      industry: 'Логистика и транспорт'
    }
  ];

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case 'free':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'start':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'growth':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'pro':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getSubscriptionLabel = (subscription) => {
    const labels = {
      free: 'Free',
      start: 'Start',
      growth: 'Growth',
      pro: 'Pro'
    };
    return labels[subscription] || subscription;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'blocked':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'blocked':
        return 'Заблокирован';
      case 'pending':
        return 'На модерации';
      default:
        return status;
    }
  };

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubscription = selectedSubscription === 'all' || employer.subscription === selectedSubscription;
    const matchesStatus = selectedStatus === 'all' || employer.status === selectedStatus;
    
    return matchesSearch && matchesSubscription && matchesStatus;
  });

  const toggleEmployerSelection = (employerId) => {
    setSelectedEmployers(prev => 
      prev.includes(employerId) 
        ? prev.filter(id => id !== employerId)
        : [...prev, employerId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmployers.length === filteredEmployers.length) {
      setSelectedEmployers([]);
    } else {
      setSelectedEmployers(filteredEmployers.map(emp => emp.id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Работодатели</h1>
          <p className="text-gray-400">Управление компаниями и работодателями</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-gray-300 hover:bg-white/10 transition-all text-sm">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm">
            <Building2 className="w-4 h-4 mr-2" />
            Добавить работодателя
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">186</span>
          </div>
          <p className="text-sm text-gray-400">Всего работодателей</p>
          <div className="flex items-center mt-2 text-green-400 text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% за месяц
          </div>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">154</span>
          </div>
          <p className="text-sm text-gray-400">Активных</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">847</span>
          </div>
          <p className="text-sm text-gray-400">Активных вакансий</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">2,156</span>
          </div>
          <p className="text-sm text-gray-400">Всего найми</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию, контактному лицу или email..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <div>
            <select
              value={selectedSubscription}
              onChange={(e) => setSelectedSubscription(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              {subscriptions.map(sub => (
                <option key={sub.value} value={sub.value}>{sub.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedEmployers.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 text-sm">
                Выбрано {selectedEmployers.length} работодателей
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30 transition-all">
                  Активировать
                </button>
                <button className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30 transition-all">
                  Заблокировать
                </button>
                <button className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition-all">
                  Отправить уведомление
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Employers Table */}
      <div className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedEmployers.length === filteredEmployers.length && filteredEmployers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">Компания</th>
                <th className="text-left p-4 text-gray-300 font-medium">Тариф</th>
                <th className="text-left p-4 text-gray-300 font-medium">Статус</th>
                <th className="text-left p-4 text-gray-300 font-medium">Вакансии</th>
                <th className="text-left p-4 text-gray-300 font-medium">Статистика</th>
                <th className="text-left p-4 text-gray-300 font-medium">Доходы</th>
                <th className="text-left p-4 text-gray-300 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredEmployers.map((employer) => (
                <tr key={employer.id} className="hover:bg-white/5 transition-all">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployers.includes(employer.id)}
                      onChange={() => toggleEmployerSelection(employer.id)}
                      className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-black" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-medium truncate">{employer.companyName}</div>
                        <div className="text-gray-400 text-sm">{employer.contactPerson}</div>
                        <div className="text-gray-500 text-xs">{employer.industry}</div>
                        <div className="flex items-center mt-1 space-x-3">
                          <div className="flex items-center text-gray-400 text-xs">
                            <Mail className="w-3 h-3 mr-1" />
                            {employer.email}
                          </div>
                          <div className="flex items-center text-gray-400 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {employer.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getSubscriptionColor(employer.subscription)}`}>
                      {getSubscriptionLabel(employer.subscription)}
                    </span>
                    <div className="text-gray-400 text-xs mt-1">
                      с {employer.registeredDate}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(employer.status)}`}>
                      {getStatusLabel(employer.status)}
                    </span>
                    <div className="text-gray-400 text-xs mt-1">
                      {employer.lastActivity}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 font-medium">{employer.activeJobs}</span>
                        <span className="text-gray-400 text-sm">активных</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300">{employer.totalJobs}</span>
                        <span className="text-gray-400 text-sm">всего</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400 font-medium">{employer.totalHires}</span>
                        <span className="text-gray-400 text-sm">найми</span>
                      </div>
                      {employer.rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-yellow-400 text-sm">{employer.rating}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="text-green-400 font-medium">
                        {employer.monthlySpent.toLocaleString()} ₸
                      </div>
                      <div className="text-gray-400 text-xs">
                        в месяц
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all">
                        <Ban className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Показано {filteredEmployers.length} из {employers.length} работодателей
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-white/5 border border-gray-700 rounded text-gray-300 hover:bg-white/10 transition-all text-sm">
                Назад
              </button>
              <button className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/40 rounded text-yellow-400 text-sm">
                1
              </button>
              <button className="px-3 py-1 bg-white/5 border border-gray-700 rounded text-gray-300 hover:bg-white/10 transition-all text-sm">
                2
              </button>
              <button className="px-3 py-1 bg-white/5 border border-gray-700 rounded text-gray-300 hover:bg-white/10 transition-all text-sm">
                Далее
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerList;