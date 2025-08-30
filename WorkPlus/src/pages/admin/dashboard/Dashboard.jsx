import React from 'react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Eye,
  UserCheck,
  Clock,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Activity,
  Target
} from 'lucide-react';

const StatCard = ({ title, value, change, changeType, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500/20 border-blue-400/30 text-blue-400",
    green: "bg-green-500/20 border-green-400/30 text-green-400",
    yellow: "bg-yellow-500/20 border-yellow-400/30 text-yellow-400",
    red: "bg-red-500/20 border-red-400/30 text-red-400",
    purple: "bg-purple-500/20 border-purple-400/30 text-purple-400"
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'up' ? (
                <ArrowUp className="w-4 h-4 text-green-400 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-400 mr-1" />
              )}
              <span className={`text-sm font-medium ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {change}
              </span>
              <span className="text-sm text-gray-400 ml-1">vs прошлый месяц</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const activities = [
    { type: 'job', message: 'Новая вакансия "Frontend разработчик" опубликована', time: '2 минуты назад', company: 'ТechKZ' },
    { type: 'user', message: 'Зарегистрирован новый работодатель', time: '15 минут назад', company: 'Kaspi Bank' },
    { type: 'application', message: '12 новых откликов на вакансии', time: '1 час назад', company: 'Различные' },
    { type: 'payment', message: 'Оплачена подписка Pro', time: '2 часа назад', company: 'Beeline KZ' },
    { type: 'moderation', message: 'Вакансия отправлена на доработку', time: '3 часа назад', company: 'StartupKZ' }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'job': return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'user': return <Users className="w-4 h-4 text-green-400" />;
      case 'application': return <UserCheck className="w-4 h-4 text-purple-400" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-yellow-400" />;
      case 'moderation': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Последние активности</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-gray-700/50">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{activity.message}</p>
              <p className="text-xs text-gray-400">{activity.company} • {activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopVacancies = () => {
  const vacancies = [
    { title: 'Frontend разработчик', company: 'TechKZ', views: 1250, applications: 45, location: 'Алматы' },
    { title: 'Продавец-консультант', company: 'Sulpak', views: 890, applications: 78, location: 'Нур-Султан' },
    { title: 'SMM менеджер', company: 'Digital Agency', views: 672, applications: 23, location: 'Шымкент' },
    { title: 'Водитель курьер', company: 'Glovo', views: 545, applications: 67, location: 'Алматы' },
    { title: 'Бухгалтер', company: 'FinanceGroup', views: 423, applications: 12, location: 'Караганда' }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Топ вакансии по просмотрам</h3>
      <div className="space-y-4">
        {vacancies.map((vacancy, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
            <div className="flex-1">
              <h4 className="font-medium text-white">{vacancy.title}</h4>
              <p className="text-sm text-gray-300">{vacancy.company} • {vacancy.location}</p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1 text-yellow-400" />
                <span className="text-yellow-400">{vacancy.views}</span>
              </div>
              <div className="flex items-center">
                <UserCheck className="w-4 h-4 mr-1 text-green-400" />
                <span className="text-green-400">{vacancy.applications}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Панель управления</h1>
              <p className="mt-1 text-sm text-gray-300">
                Обзор основных метрик WorkPlus.kz
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-300">
                <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                Сегодня: {new Date().toLocaleDateString('ru-RU', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Всего вакансий"
            value="2,847"
            change="+12.5%"
            changeType="up"
            icon={Briefcase}
            color="blue"
          />
          <StatCard
            title="Активные пользователи"
            value="15,623"
            change="+8.3%"
            changeType="up"
            icon={Users}
            color="green"
          />
          <StatCard
            title="Доход за месяц"
            value="₸4,250,000"
            change="+15.2%"
            changeType="up"
            icon={DollarSign}
            color="yellow"
          />
          <StatCard
            title="Конверсия"
            value="23.8%"
            change="-2.1%"
            changeType="down"
            icon={Target}
            color="purple"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Отклики сегодня"
            value="1,284"
            change="+5.7%"
            changeType="up"
            icon={UserCheck}
            color="green"
          />
          <StatCard
            title="Новые работодатели"
            value="47"
            change="+18.9%"
            changeType="up"
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="На модерации"
            value="23"
            change="-8.4%"
            changeType="down"
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="Жалобы"
            value="5"
            change="-25.0%"
            changeType="down"
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Charts and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TopVacancies />
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Быстрые действия</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 hover:border-blue-400/50 transition-all group">
              <Briefcase className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-blue-400">Новая вакансия</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-500/20 border border-green-400/30 rounded-lg hover:bg-green-500/30 hover:border-green-400/50 transition-all group">
              <Users className="w-6 h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-green-400">Добавить пользователя</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg hover:bg-yellow-500/30 hover:border-yellow-400/50 transition-all group">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-yellow-400">Модерация</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-500/20 border border-purple-400/30 rounded-lg hover:bg-purple-500/30 hover:border-purple-400/50 transition-all group">
              <Activity className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-purple-400">Аналитика</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;