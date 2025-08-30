import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const JobList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');

  // Мокк данные вакансий
  const jobs = [
    {
      id: 1,
      title: 'Продавец-консультант',
      company: 'Магазин "Электроника"',
      location: 'Алматы',
      salary: '150,000 - 200,000 ₸',
      type: 'Полная занятость',
      status: 'active',
      created: '2024-08-28',
      views: 245,
      applications: 18,
      category: 'Продажи'
    },
    {
      id: 2,
      title: 'Курьер',
      company: 'Delivery Express',
      location: 'Нур-Султан',
      salary: '120,000 - 180,000 ₸',
      type: 'Полная занятость',
      status: 'pending',
      created: '2024-08-27',
      views: 189,
      applications: 32,
      category: 'Логистика'
    },
    {
      id: 3,
      title: 'SMM-менеджер',
      company: 'Digital Agency Pro',
      location: 'Алматы',
      salary: '250,000 - 350,000 ₸',
      type: 'Удаленно',
      status: 'active',
      created: '2024-08-26',
      views: 412,
      applications: 45,
      category: 'Маркетинг'
    },
    {
      id: 4,
      title: 'Официант',
      company: 'Ресторан "Вкус"',
      location: 'Шымкент',
      salary: '100,000 - 130,000 ₸',
      type: 'Полная занятость',
      status: 'paused',
      created: '2024-08-25',
      views: 156,
      applications: 12,
      category: 'Сервис'
    },
    {
      id: 5,
      title: 'Бухгалтер',
      company: 'ТОО "Финанс Групп"',
      location: 'Караганда',
      salary: '200,000 - 280,000 ₸',
      type: 'Полная занятость',
      status: 'active',
      created: '2024-08-24',
      views: 298,
      applications: 23,
      category: 'Финансы'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-500/10', text: 'text-green-400', icon: CheckCircle, label: 'Активна' },
      pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', icon: Clock, label: 'На модерации' },
      paused: { bg: 'bg-gray-500/10', text: 'text-gray-400', icon: AlertCircle, label: 'Приостановлена' }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border border-current/20`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Заголовок и кнопка создания */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Вакансии</h1>
          <p className="text-gray-300">Управление всеми вакансиями на платформе</p>
        </div>
        <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg flex items-center transition-all hover:from-yellow-500 hover:to-yellow-700 font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Создать вакансию
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-300">Всего вакансий</p>
              <p className="text-2xl font-bold text-white">{jobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-300">Активные</p>
              <p className="text-2xl font-bold text-white">
                {jobs.filter(j => j.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-300">На модерации</p>
              <p className="text-2xl font-bold text-white">
                {jobs.filter(j => j.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-300">Всего откликов</p>
              <p className="text-2xl font-bold text-white">
                {jobs.reduce((sum, job) => sum + job.applications, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию или компании..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="pending">На модерации</option>
            <option value="paused">Приостановленные</option>
          </select>
          
          <select
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_desc">Сначала новые</option>
            <option value="created_asc">Сначала старые</option>
            <option value="views_desc">По просмотрам</option>
            <option value="applications_desc">По откликам</option>
          </select>

          <button className="px-4 py-2 border border-yellow-400/20 rounded-lg hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all text-white flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </button>
        </div>
      </div>

      {/* Таблица вакансий */}
      <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Вакансия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Метрики
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Дата создания
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <h3 className="text-sm font-medium text-white">{job.title}</h3>
                      <p className="text-sm text-gray-300">{job.company}</p>
                      <div className="flex items-center mt-1 space-x-3 text-xs text-gray-400">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(job.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-gray-300">
                        <Eye className="w-4 h-4 mr-1" />
                        {job.views}
                      </span>
                      <span className="flex items-center text-yellow-400 font-medium">
                        <Users className="w-4 h-4 mr-1" />
                        {job.applications}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {job.created}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button className="text-yellow-400 hover:text-yellow-300 p-1 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-400 hover:text-green-300 p-1 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 p-1 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-300 p-1 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        <div className="px-6 py-3 border-t border-gray-700/50 flex items-center justify-between">
          <div className="text-sm text-gray-300">
            Показано 1-{filteredJobs.length} из {filteredJobs.length} вакансий
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-yellow-400/20 rounded text-sm hover:bg-yellow-400/10 text-white transition-colors">
              Предыдущая
            </button>
            <button className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 border border-yellow-400/20 rounded text-sm hover:bg-yellow-400/10 text-white transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-yellow-400/20 rounded text-sm hover:bg-yellow-400/10 text-white transition-colors">
              Следующая
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;