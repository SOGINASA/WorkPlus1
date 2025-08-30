import React, { useState } from 'react';
import { Search, Filter, Users, Building2, User, MoreHorizontal, Eye, Edit, Trash2, Ban, CheckCircle, XCircle, Calendar, Mail, Phone, MapPin, Download } from 'lucide-react';

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const roles = [
    { value: 'all', label: 'Все роли' },
    { value: 'employer', label: 'Работодатели' },
    { value: 'candidate', label: 'Соискатели' },
    { value: 'admin', label: 'Администраторы' }
  ];

  const statuses = [
    { value: 'all', label: 'Все статусы' },
    { value: 'active', label: 'Активные' },
    { value: 'blocked', label: 'Заблокированные' },
    { value: 'pending', label: 'На модерации' }
  ];

  const users = [
    {
      id: 1,
      name: 'Анна Смирнова',
      email: 'anna@example.com',
      phone: '+7 701 123 45 67',
      role: 'employer',
      status: 'active',
      company: 'Tech Solutions KZ',
      location: 'Петропавловск',
      registeredDate: '15 дек 2024',
      lastActivity: '2 часа назад',
      jobsPosted: 12,
      avatar: null
    },
    {
      id: 2,
      name: 'Максим Петров',
      email: 'maksim@example.com',
      phone: '+7 702 234 56 78',
      role: 'candidate',
      status: 'active',
      company: null,
      location: 'Костанай',
      registeredDate: '12 дек 2024',
      lastActivity: '1 день назад',
      jobsPosted: 0,
      avatar: null
    },
    {
      id: 3,
      name: 'Елена Козлова',
      email: 'elena@workplus.kz',
      phone: '+7 717 345 67 89',
      role: 'admin',
      status: 'active',
      company: 'WorkPlus.kz',
      location: 'Петропавловск',
      registeredDate: '1 дек 2024',
      lastActivity: '30 мин назад',
      jobsPosted: 0,
      avatar: null
    },
    {
      id: 4,
      name: 'ТОО "Retail Group"',
      email: 'hr@retailgroup.kz',
      phone: '+7 703 456 78 90',
      role: 'employer',
      status: 'blocked',
      company: 'Retail Group',
      location: 'Актау',
      registeredDate: '10 дек 2024',
      lastActivity: '3 дня назад',
      jobsPosted: 8,
      avatar: null
    },
    {
      id: 5,
      name: 'Дмитрий Волков',
      email: 'dmitry@example.com',
      phone: '+7 704 567 89 01',
      role: 'candidate',
      status: 'pending',
      company: null,
      location: 'Павлодар',
      registeredDate: '14 дек 2024',
      lastActivity: '5 часов назад',
      jobsPosted: 0,
      avatar: null
    }
  ];

  const getRoleIcon = (role) => {
    switch (role) {
      case 'employer':
        return <Building2 className="w-4 h-4" />;
      case 'candidate':
        return <User className="w-4 h-4" />;
      case 'admin':
        return <Users className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'employer':
        return 'Работодатель';
      case 'candidate':
        return 'Соискатель';
      case 'admin':
        return 'Администратор';
      default:
        return role;
    }
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Пользователи</h1>
          <p className="text-gray-400">Управление всеми пользователями системы</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-gray-300 hover:bg-white/10 transition-all text-sm">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm">
            <Users className="w-4 h-4 mr-2" />
            Добавить пользователя
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">2,847</span>
          </div>
          <p className="text-sm text-gray-400">Всего пользователей</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">186</span>
          </div>
          <p className="text-sm text-gray-400">Работодателей</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <User className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">2,654</span>
          </div>
          <p className="text-sm text-gray-400">Соискателей</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">2,698</span>
          </div>
          <p className="text-sm text-gray-400">Активных</p>
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
                placeholder="Поиск по имени, email или компании..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
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

        {selectedUsers.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 text-sm">
                Выбrano {selectedUsers.length} пользователей
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30 transition-all">
                  Активировать
                </button>
                <button className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30 transition-all">
                  Заблокировать
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">Пользователь</th>
                <th className="text-left p-4 text-gray-300 font-medium">Роль</th>
                <th className="text-left p-4 text-gray-300 font-medium">Статус</th>
                <th className="text-left p-4 text-gray-300 font-medium">Контакты</th>
                <th className="text-left p-4 text-gray-300 font-medium">Активность</th>
                <th className="text-left p-4 text-gray-300 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-all">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-black font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                        {user.company && (
                          <div className="text-gray-500 text-xs">{user.company}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 text-gray-300">
                      {getRoleIcon(user.role)}
                      <span className="text-sm">{getRoleLabel(user.role)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-gray-300 text-sm">
                        <Phone className="w-3 h-3 mr-2 text-gray-500" />
                        {user.phone}
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="w-3 h-3 mr-2 text-gray-500" />
                        {user.location}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="text-gray-300 text-sm">
                        Рег: {user.registeredDate}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Активен: {user.lastActivity}
                      </div>
                      {user.role === 'employer' && (
                        <div className="text-yellow-400 text-xs">
                          {user.jobsPosted} вакансий
                        </div>
                      )}
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
              Показано {filteredUsers.length} из {users.length} пользователей
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

export default UserList;