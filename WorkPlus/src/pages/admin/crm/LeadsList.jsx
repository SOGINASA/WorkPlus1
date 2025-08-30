import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  User,
  Building2,
  MapPin,
  TrendingUp,
  Clock,
  Star,
  Eye,
  Edit3,
  Trash2,
  Download,
  Users,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    new: { bg: 'bg-blue-500/20', border: 'border-blue-400/30', text: 'text-blue-400', label: 'Новый' },
    contacted: { bg: 'bg-yellow-500/20', border: 'border-yellow-400/30', text: 'text-yellow-400', label: 'Связались' },
    qualified: { bg: 'bg-purple-500/20', border: 'border-purple-400/30', text: 'text-purple-400', label: 'Квалифицирован' },
    proposal: { bg: 'bg-orange-500/20', border: 'border-orange-400/30', text: 'text-orange-400', label: 'Предложение' },
    negotiation: { bg: 'bg-indigo-500/20', border: 'border-indigo-400/30', text: 'text-indigo-400', label: 'Переговоры' },
    closed_won: { bg: 'bg-green-500/20', border: 'border-green-400/30', text: 'text-green-400', label: 'Закрыт' },
    closed_lost: { bg: 'bg-red-500/20', border: 'border-red-400/30', text: 'text-red-400', label: 'Проигран' }
  };

  const config = statusConfig[status] || statusConfig.new;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.border} ${config.text}`}>
      {config.label}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    high: { icon: TrendingUp, color: 'text-red-400', label: 'Высокий' },
    medium: { icon: Clock, color: 'text-yellow-400', label: 'Средний' },
    low: { icon: TrendingUp, color: 'text-green-400', label: 'Низкий' }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;
  const Icon = config.icon;

  return (
    <div className={`flex items-center ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      <span className="text-xs">{config.label}</span>
    </div>
  );
};

const LeadCard = ({ lead, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <span className="text-black font-semibold text-sm">
              {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{lead.name}</h3>
            <p className="text-sm text-gray-300">{lead.position} в {lead.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={lead.status} />
          <div className="relative">
            <button className="text-gray-400 hover:text-white">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-300">
          <Phone className="w-4 h-4 mr-2 text-yellow-400" />
          {lead.phone}
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <Mail className="w-4 h-4 mr-2 text-yellow-400" />
          {lead.email}
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <Building2 className="w-4 h-4 mr-2 text-yellow-400" />
          {lead.company}
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
          {lead.location}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <PriorityBadge priority={lead.priority} />
          <div className="text-sm text-gray-400">
            Создан: {lead.created}
          </div>
        </div>
        <div className="text-lg font-semibold text-yellow-400">
          {lead.value}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <Star className={`w-4 h-4 ${lead.rating >= 4 ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
          <span className="text-sm text-gray-300">Рейтинг: {lead.rating}/5</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(lead)}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(lead)}
            className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(lead)}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const LeadsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or table

  const leads = [
    {
      id: 1,
      name: 'Алия Нурланова',
      position: 'HR Director',
      company: 'Kaspi Bank',
      phone: '+7 777 123 4567',
      email: 'aliya@kaspi.kz',
      location: 'Алматы',
      status: 'qualified',
      priority: 'high',
      value: '₸500,000',
      rating: 4,
      created: '15.08.2025',
      lastContact: '28.08.2025',
      source: 'Website'
    },
    {
      id: 2,
      name: 'Данияр Абдрахманов',
      position: 'CEO',
      company: 'TechStartup KZ',
      phone: '+7 701 987 6543',
      email: 'daniyal@techstartup.kz',
      location: 'Нур-Султан',
      status: 'proposal',
      priority: 'high',
      value: '₸1,200,000',
      rating: 5,
      created: '20.08.2025',
      lastContact: '29.08.2025',
      source: 'Referral'
    },
    {
      id: 3,
      name: 'Светлана Ким',
      position: 'Operations Manager',
      company: 'Beeline Kazakhstan',
      phone: '+7 747 555 1234',
      email: 'svetlana@beeline.kz',
      location: 'Шымкент',
      status: 'contacted',
      priority: 'medium',
      value: '₸350,000',
      rating: 3,
      created: '22.08.2025',
      lastContact: '27.08.2025',
      source: 'LinkedIn'
    },
    {
      id: 4,
      name: 'Арман Сейдахметов',
      position: 'Founder',
      company: 'FinTech Solutions',
      phone: '+7 705 444 7890',
      email: 'arman@fintech.kz',
      location: 'Алматы',
      status: 'negotiation',
      priority: 'high',
      value: '₸800,000',
      rating: 4,
      created: '25.08.2025',
      lastContact: '30.08.2025',
      source: 'Cold Email'
    },
    {
      id: 5,
      name: 'Мадина Токаева',
      position: 'Marketing Director',
      company: 'Retail Chain KZ',
      phone: '+7 778 333 5678',
      email: 'madina@retail.kz',
      location: 'Петропавловск',
      status: 'new',
      priority: 'low',
      value: '₸180,000',
      rating: 2,
      created: '28.08.2025',
      lastContact: '-',
      source: 'Instagram'
    },
    {
      id: 6,
      name: 'Ержан Мамытов',
      position: 'IT Director',
      company: 'Government Agency',
      phone: '+7 777 111 2222',
      email: 'erzhan@gov.kz',
      location: 'Нур-Султан',
      status: 'closed_won',
      priority: 'medium',
      value: '₸950,000',
      rating: 5,
      created: '10.08.2025',
      lastContact: '29.08.2025',
      source: 'Tender'
    }
  ];

  const stats = [
    { title: 'Всего лидов', value: '246', change: '+18', icon: Users, color: 'blue' },
    { title: 'Квалифицированных', value: '89', change: '+12', icon: Target, color: 'purple' },
    { title: 'В переговорах', value: '23', change: '+5', icon: AlertCircle, color: 'yellow' },
    { title: 'Закрыто (успех)', value: '45', change: '+8', icon: CheckCircle, color: 'green' }
  ];

  const handleEditLead = (lead) => {
    console.log('Edit lead:', lead);
  };

  const handleDeleteLead = (lead) => {
    console.log('Delete lead:', lead);
  };

  const handleViewLead = (lead) => {
    console.log('View lead:', lead);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Лиды</h1>
              <p className="mt-1 text-sm text-gray-300">
                Управление потенциальными клиентами
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </button>
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Новый лид
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
                  placeholder="Поиск по имени или компании..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400 w-full sm:w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="all">Все статусы</option>
                <option value="new">Новые</option>
                <option value="contacted">Связались</option>
                <option value="qualified">Квалифицированы</option>
                <option value="proposal">Предложение</option>
                <option value="negotiation">Переговоры</option>
                <option value="closed_won">Закрыты</option>
                <option value="closed_lost">Проиграны</option>
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

        {/* Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              onView={handleViewLead}
            />
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Лиды не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить параметры поиска или добавьте нового лида</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsList;