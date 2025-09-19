import React, { useState, useEffect } from 'react';
import {
  Search, Building2, MoreHorizontal, Eye, Edit, Ban, CheckCircle, TrendingUp,
  Users, MapPin, Mail, Star, Briefcase, Download
} from 'lucide-react';
import { getEmployers, toggleEmployerBlock } from '../../../components/api/EmployerService';

const EmployerList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEmployers, setSelectedEmployers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // 📡 Загрузка работодателей
  useEffect(() => {
    loadEmployers();
  }, [searchQuery, selectedSubscription, selectedStatus]);

  const loadEmployers = async () => {
    try {
      setLoading(true);
      const data = await getEmployers({
        search: searchQuery,
        subscription: selectedSubscription,
        status: selectedStatus,
      });
      setEmployers(data);
    } catch (error) {
      console.error("Ошибка загрузки работодателей:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Блокировка / разблокировка
  const handleToggleBlock = async (id) => {
    try {
      const updated = await toggleEmployerBlock(id);
      setEmployers(prev =>
        prev.map(emp =>
          emp.id === updated.id ? { ...emp, status: updated.is_active ? "active" : "blocked" } : emp
        )
      );
    } catch (error) {
      console.error("Ошибка изменения статуса:", error);
    }
  };

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
    const labels = { free: 'Free', start: 'Start', growth: 'Growth', pro: 'Pro' };
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

  const toggleEmployerSelection = (employerId) => {
    setSelectedEmployers(prev =>
      prev.includes(employerId)
        ? prev.filter(id => id !== employerId)
        : [...prev, employerId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmployers.length === employers.length) {
      setSelectedEmployers([]);
    } else {
      setSelectedEmployers(employers.map(emp => emp.id));
    }
  };

  if (loading) {
    return <div className="text-white p-6">Загрузка...</div>;
  }

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
                    checked={selectedEmployers.length === employers.length && employers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">Компания</th>
                <th className="text-left p-4 text-gray-300 font-medium">Тариф</th>
                <th className="text-left p-4 text-gray-300 font-medium">Статус</th>
                <th className="text-left p-4 text-gray-300 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {employers.map((employer) => (
                <tr key={employer.id} className="hover:bg-white/5 transition-all">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployers.includes(employer.id)}
                      onChange={() => toggleEmployerSelection(employer.id)}
                      className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                    />
                  </td>
                  <td className="p-4 text-white">{employer.companyName}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getSubscriptionColor(employer.subscription)}`}>
                      {getSubscriptionLabel(employer.subscription)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(employer.status)}`}>
                      {getStatusLabel(employer.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" onClick={(e) => {
                            window.location.href=`/admin/users/profiles?id=${employer.id}`;
                          }}>
                            <Eye className="w-4 h-4" />
                          </button>
                      <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleBlock(employer.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerList;