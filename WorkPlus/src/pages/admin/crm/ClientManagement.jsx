import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Eye,
  Edit3,
  Trash2,
  MessageCircle,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Target,
  Briefcase
} from 'lucide-react';

const ClientCard = ({ client, onEdit, onDelete, onView, onContact }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 border-green-400/30 text-green-400';
      case 'inactive': return 'bg-gray-500/20 border-gray-400/30 text-gray-400';
      case 'potential': return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-400';
      case 'churned': return 'bg-red-500/20 border-red-400/30 text-red-400';
      default: return 'bg-gray-500/20 border-gray-400/30 text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Активный',
      inactive: 'Неактивный',
      potential: 'Потенциальный',
      churned: 'Ушёл'
    };
    return labels[status] || 'Неизвестно';
  };

  const getTierIcon = (tier) => {
    switch(tier) {
      case 'premium': return <Award className="w-4 h-4 text-yellow-400" />;
      case 'gold': return <Star className="w-4 h-4 text-yellow-400" />;
      case 'silver': return <Target className="w-4 h-4 text-gray-400" />;
      default: return <Users className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center">
              {client.company}
              <span className="ml-2">{getTierIcon(client.tier)}</span>
            </h3>
            <p className="text-sm text-gray-300">{client.industry}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
            {getStatusLabel(client.status)}
          </span>
          <button className="text-gray-400 hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-300">
          <Users className="w-4 h-4 mr-2 text-yellow-400" />
          <span className="font-medium">{client.contact.name}</span>
          <span className="mx-2">•</span>
          <span>{client.contact.position}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-300">
            <Phone className="w-4 h-4 mr-2 text-yellow-400" />
            {client.contact.phone}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Mail className="w-4 h-4 mr-2 text-yellow-400" />
            {client.contact.email}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
          {client.location}
        </div>
      </div>

      <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{client.stats.totalDeals}</div>
            <div className="text-xs text-gray-400">Сделок</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">{client.stats.revenue}</div>
            <div className="text-xs text-gray-400">Доход</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">{client.stats.activeJobs}</div>
            <div className="text-xs text-gray-400">Активных</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          Клиент с {client.joinDate}
        </div>
        <div className="flex items-center">
          <Activity className="w-3 h-3 mr-1" />
          {client.lastActivity}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < client.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-300">({client.rating}/5)</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onContact(client)}
            className="p-2 text-gray-400 hover:text-green-400 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => onView(client)}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(client)}
            className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch(type) {
      case 'deal': return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'meeting': return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'email': return <Mail className="w-4 h-4 text-purple-400" />;
      case 'call': return <Phone className="w-4 h-4 text-yellow-400" />;
      case 'contract': return <FileText className="w-4 h-4 text-orange-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Последние активности</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-gray-700/50">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{activity.title}</p>
              <p className="text-xs text-gray-400">{activity.description}</p>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs text-gray-500">{activity.client}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  const clients = [
    {
      id: 1,
      company: 'Kaspi Bank',
      industry: 'Финансовые услуги',
      tier: 'premium',
      status: 'active',
      contact: {
        name: 'Алия Нурланова',
        position: 'HR Director',
        phone: '+7 777 123 4567',
        email: 'aliya@kaspi.kz'
      },
      location: 'Алматы',
      stats: {
        totalDeals: 12,
        revenue: '₸2.4M',
        activeJobs: 8
      },
      rating: 5,
      joinDate: '15.01.2024',
      lastActivity: '2 часа назад'
    },
    {
      id: 2,
      company: 'TechStartup KZ',
      industry: 'IT/Технологии',
      tier: 'gold',
      status: 'active',
      contact: {
        name: 'Данияр Абдрахманов',
        position: 'CEO',
        phone: '+7 701 987 6543',
        email: 'daniyal@techstartup.kz'
      },
      location: 'Нур-Султан',
      stats: {
        totalDeals: 8,
        revenue: '₸1.8M',
        activeJobs: 5
      },
      rating: 4,
      joinDate: '03.03.2024',
      lastActivity: '1 день назад'
    },
    {
      id: 3,
      company: 'Beeline Kazakhstan',
      industry: 'Телеком',
      tier: 'gold',
      status: 'active',
      contact: {
        name: 'Светлана Ким',
        position: 'Operations Manager',
        phone: '+7 747 555 1234',
        email: 'svetlana@beeline.kz'
      },
      location: 'Шымкент',
      stats: {
        totalDeals: 6,
        revenue: '₸950K',
        activeJobs: 3
      },
      rating: 4,
      joinDate: '22.02.2024',
      lastActivity: '3 дня назад'
    },
    {
      id: 4,
      company: 'Retail Chain KZ',
      industry: 'Розничная торговля',
      tier: 'silver',
      status: 'potential',
      contact: {
        name: 'Мадина Токаева',
        position: 'Marketing Director',
        phone: '+7 778 333 5678',
        email: 'madina@retail.kz'
      },
      location: 'Петропавловск',
      stats: {
        totalDeals: 2,
        revenue: '₸180K',
        activeJobs: 1
      },
      rating: 3,
      joinDate: '10.07.2024',
      lastActivity: '1 неделю назад'
    },
    {
      id: 5,
      company: 'Government Agency',
      industry: 'Государственный сектор',
      tier: 'gold',
      status: 'active',
      contact: {
        name: 'Ержан Мамытов',
        position: 'IT Director',
        phone: '+7 777 111 2222',
        email: 'erzhan@gov.kz'
      },
      location: 'Нур-Султан',
      stats: {
        totalDeals: 4,
        revenue: '₸1.2M',
        activeJobs: 2
      },
      rating: 4,
      joinDate: '05.06.2024',
      lastActivity: '2 дня назад'
    }
  ];

  const recentActivities = [
    {
      type: 'deal',
      title: 'Новая сделка закрыта',
      description: 'Контракт на ₸500,000 подписан с Kaspi Bank',
      client: 'Kaspi Bank',
      time: '2 часа назад'
    },
    {
      type: 'meeting',
      title: 'Встреча запланирована',
      description: 'Обсуждение нового проекта с TechStartup KZ',
      client: 'TechStartup KZ',
      time: '4 часа назад'
    },
    {
      type: 'email',
      title: 'Email отправлен',
      description: 'Предложение по услугам отправлено клиенту',
      client: 'Beeline Kazakhstan',
      time: '6 часов назад'
    },
    {
      type: 'call',
      title: 'Звонок клиенту',
      description: 'Обсуждение деталей контракта',
      client: 'Government Agency',
      time: '1 день назад'
    }
  ];

  const stats = [
    { title: 'Всего клиентов', value: '127', change: '+12', icon: Building2, color: 'blue' },
    { title: 'Активные', value: '89', change: '+8', icon: CheckCircle, color: 'green' },
    { title: 'Потенциальные', value: '23', change: '+5', icon: AlertCircle, color: 'yellow' },
    { title: 'Средний LTV', value: '₸850K', change: '+15%', icon: TrendingUp, color: 'purple' }
  ];

  const handleEditClient = (client) => {
    console.log('Edit client:', client);
  };

  const handleDeleteClient = (client) => {
    console.log('Delete client:', client);
  };

  const handleViewClient = (client) => {
    console.log('View client:', client);
  };

  const handleContactClient = (client) => {
    console.log('Contact client:', client);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesTier = tierFilter === 'all' || client.tier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Управление клиентами</h1>
              <p className="mt-1 text-sm text-gray-300">
                Отслеживание взаимоотношений с клиентами и их активности
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all">
                <FileText className="w-4 h-4 mr-2" />
                Отчет
              </button>
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Новый клиент
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-sm font-medium text-green-400">{stat.change}</span>
                      <span className="text-sm text-gray-400 ml-1">за месяц</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по компании или контакту..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400 w-full sm:w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="inactive">Неактивные</option>
                <option value="potential">Потенциальные</option>
                <option value="churned">Ушедшие</option>
              </select>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="all">Все уровни</option>
                <option value="premium">Premium</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="basic">Basic</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-gray-300 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Clients Grid */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredClients.map(client => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onEdit={handleEditClient}
                  onDelete={handleDeleteClient}
                  onView={handleViewClient}
                  onContact={handleContactClient}
                />
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">Клиенты не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить параметры поиска или добавьте нового клиента</p>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="xl:col-span-1">
            <ActivityFeed activities={recentActivities} />
          </div>
        </div>

        {/* Client Insights */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Топ клиенты по доходу</h3>
            <div className="space-y-3">
              {clients
                .sort((a, b) => parseFloat(b.stats.revenue.replace(/[₸KM,]/g, '')) - parseFloat(a.stats.revenue.replace(/[₸KM,]/g, '')))
                .slice(0, 5)
                .map((client, index) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-black font-bold text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{client.company}</p>
                        <p className="text-xs text-gray-400">{client.industry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">{client.stats.revenue}</p>
                      <p className="text-xs text-gray-400">{client.stats.totalDeals} сделок</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Распределение по уровням</h3>
            <div className="space-y-4">
              {['premium', 'gold', 'silver', 'basic'].map(tier => {
                const tierClients = clients.filter(c => c.tier === tier);
                const percentage = (tierClients.length / clients.length) * 100;
                const tierNames = {
                  premium: 'Premium',
                  gold: 'Gold',
                  silver: 'Silver',
                  basic: 'Basic'
                };

                return (
                  <div key={tier}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{tierNames[tier]}</span>
                      <span className="text-sm text-gray-400">{tierClients.length} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Предстоящие задачи</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Встреча с Kaspi Bank</p>
                  <p className="text-xs text-gray-400">Завтра в 14:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <Phone className="w-4 h-4 text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Звонок TechStartup KZ</p>
                  <p className="text-xs text-gray-400">31 августа в 11:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <FileText className="w-4 h-4 text-orange-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Подготовить предложение</p>
                  <p className="text-xs text-gray-400">Для Beeline Kazakhstan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;