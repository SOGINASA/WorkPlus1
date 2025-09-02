import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Shield,
  Globe,
  DollarSign,
  UserCheck,
  Settings,
  BarChart3,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  FileText,
  Activity,
  TrendingUp,
  Building2,
  X
} from 'lucide-react';

const AdminSidebar = ({ isCollapsed = false, currentPath, onNavigate, isMobile = false, onClose }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const navigationConfig = [
    {
      id: 'dashboard',
      name: 'Панель управления',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      badge: '3',
      subItems: [
        { name: 'Обзор', icon: LayoutDashboard, path: '/admin/dashboard', description: 'Основная панель' },
        { name: 'Аналитика', icon: BarChart3, path: '/admin/dashboard/analytics', description: 'Метрики системы' },
        { name: 'Отчеты', icon: FileText, path: '/admin/dashboard/reports', description: 'Системные отчеты' }
      ]
    },
    {
      id: 'jobs',
      name: 'Вакансии',
      icon: Briefcase,
      path: '/admin/jobs',
      badge: '12',
      subItems: [
        { name: 'Все вакансии', icon: Briefcase, path: '/admin/jobs/list', description: 'Список всех вакансий' },
        { name: 'Модерация', icon: Shield, path: '/admin/jobs/moderation', description: 'Проверка вакансий', badge: '5' },
        { name: 'Аналитика', icon: TrendingUp, path: '/admin/jobs/analytics', description: 'Статистика вакансий' },
        { name: 'Шаблоны', icon: FileText, path: '/admin/jobs/templates', description: 'Готовые шаблоны' }
      ]
    },
    {
      id: 'users',
      name: 'Пользователи',
      icon: Users,
      path: '/admin/users',
      subItems: [
        { name: 'Все пользователи', icon: Users, path: '/admin/users/list', description: 'Полный список' },
        { name: 'Работодатели', icon: Building2, path: '/admin/users/employers', description: 'Компании и HR' },
        { name: 'Соискатели', icon: User, path: '/admin/users/candidates', description: 'Кандидаты' },
        { name: 'Профили', icon: UserCheck, path: '/admin/users/profiles', description: 'Профили пользователей' }
      ]
    },
    {
      id: 'moderation',
      name: 'Модерация',
      icon: Shield,
      path: '/admin/moderation',
      badge: '8',
      subItems: [
        { name: 'Очередь', icon: Shield, path: '/admin/moderation/queue', description: 'Ждут проверки', badge: '3' },
        { name: 'Жалобы', icon: Activity, path: '/admin/moderation/reports', description: 'Репорты пользователей', badge: '2' },
        { name: 'Контент', icon: FileText, path: '/admin/moderation/content', description: 'Модерация контента' }
      ]
    },
    {
      id: 'social',
      name: 'Социальные сети',
      icon: Globe,
      path: '/admin/social',
      subItems: [
        { name: 'Менеджер', icon: Globe, path: '/admin/social/manager', description: 'Управление соцсетями' },
        { name: 'Планировщик', icon: Activity, path: '/admin/social/scheduler', description: 'Отложенные посты' },
        { name: 'Аналитика', icon: TrendingUp, path: '/admin/social/analytics', description: 'Статистика постов' },
        { name: 'Календарь', icon: LayoutDashboard, path: '/admin/social/calendar', description: 'Календарь публикаций' }
      ]
    },
    {
      id: 'finances',
      name: 'Финансы',
      icon: DollarSign,
      path: '/admin/finances',
      subItems: [
        { name: 'Доходы', icon: TrendingUp, path: '/admin/finances/revenue', description: 'Общие доходы' },
        { name: 'Подписки', icon: UserCheck, path: '/admin/finances/subscriptions', description: 'Управление подписками' },
        { name: 'Платежи', icon: DollarSign, path: '/admin/finances/payments', description: 'Транзакции' },
        { name: 'Отчеты', icon: FileText, path: '/admin/finances/reports', description: 'Финансовые отчеты' }
      ]
    },
    {
      id: 'crm',
      name: 'CRM',
      icon: UserCheck,
      path: '/admin/crm',
      subItems: [
        { name: 'Лиды', icon: Users, path: '/admin/crm/leads', description: 'Потенциальные клиенты' },
        { name: 'Воронка', icon: TrendingUp, path: '/admin/crm/pipeline', description: 'Воронка продаж' },
        { name: 'Клиенты', icon: Building2, path: '/admin/crm/clients', description: 'База клиентов' }
      ]
    },
    {
      id: 'settings',
      name: 'Настройки',
      icon: Settings,
      path: '/admin/settings',
      subItems: [
        { name: 'Общие', icon: Settings, path: '/admin/settings/general', description: 'Основные настройки' },
        { name: 'Тарифы', icon: DollarSign, path: '/admin/settings/pricing', description: 'Ценообразование' },
        { name: 'Интеграции', icon: Globe, path: '/admin/settings/integrations', description: 'Внешние сервисы' },
        { name: 'Разрешения', icon: Shield, path: '/admin/settings/permissions', description: 'Роли и права' }
      ]
    },
    {
      id: 'analytics',
      name: 'Аналитика',
      icon: BarChart3,
      path: '/admin/analytics',
      subItems: [
        { name: 'Воронки', icon: TrendingUp, path: '/admin/analytics/funnels', description: 'Конверсионные воронки' },
        { name: 'Когорты', icon: Users, path: '/admin/analytics/cohorts', description: 'Когортный анализ' },
        { name: 'Гео-данные', icon: Globe, path: '/admin/analytics/geo', description: 'География пользователей' }
      ]
    }
  ];

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const isItemActive = (item) => {
    const path = currentPath || location.pathname;
    if (item.subItems) {
      return item.subItems.some(subItem => subItem.path === path);
    }
    return item.path === path;
  };

  const isSubItemActive = (subItem) => {
    const path = currentPath || location.pathname;
    return subItem.path === path;
  };

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gray-800/50 backdrop-blur-sm border-r border-yellow-400/20 flex flex-col transition-all duration-300 ${isMobile ? 'h-full' : 'h-screen'}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
              <Briefcase className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold text-white">WorkPlus</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Desktop Logo */}
      {!isMobile && (
        <div className="flex items-center justify-center p-4 border-b border-gray-700/50 flex-shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold text-white">WorkPlus</span>
              <span className="ml-2 px-2 py-1 bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-xs rounded-full">
                Admin
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-black" />
            </div>
          )}
        </div>
      )}

      {/* Navigation - теперь с фиксированной высотой и скроллом */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {navigationConfig.map((item) => {
              const isActive = isItemActive(item);
              const isExpanded = expandedItems[item.id];
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.id} className="mb-1">
                  {/* Main Item */}
                  <button
                    onClick={() => {
                      if (hasSubItems) {
                        toggleExpanded(item.id);
                      } else {
                        handleNavigation(item.path);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                      isActive 
                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <div className="flex items-center min-w-0">
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-yellow-400' : ''}`} />
                      {!isCollapsed && (
                        <>
                          <span className="ml-3 text-sm font-medium truncate">{item.name}</span>
                          {item.badge && (
                            <span className="ml-2 px-2 py-0.5 bg-red-500/20 border border-red-400/30 text-red-400 text-xs rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    
                    {!isCollapsed && hasSubItems && (
                      <div className="flex-shrink-0 ml-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                        ) : (
                          <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Sub Items */}
                  {!isCollapsed && hasSubItems && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1 border-l border-gray-700/50 pl-4">
                      {item.subItems.map((subItem, index) => {
                        const isSubActive = isSubItemActive(subItem);
                        
                        return (
                          <button
                            key={index}
                            onClick={() => handleNavigation(subItem.path)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 group ${
                              isSubActive
                                ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/30'
                            }`}
                          >
                            <div className="flex items-center min-w-0">
                              <subItem.icon className={`w-4 h-4 flex-shrink-0 mr-3 ${isSubActive ? 'text-yellow-400' : ''}`} />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium truncate">{subItem.name}</span>
                                  {subItem.badge && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-red-500/20 border border-red-400/30 text-red-400 text-xs rounded-full">
                                      {subItem.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">{subItem.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Quick Stats - фиксированная позиция внизу */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Быстрая статистика
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                <span className="text-xs text-gray-400">Активные вакансии</span>
                <span className="text-sm font-medium text-white">247</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                <span className="text-xs text-gray-400">Новые пользователи</span>
                <span className="text-sm font-medium text-green-400">+12</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                <span className="text-xs text-gray-400">Ждут модерации</span>
                <span className="text-sm font-medium text-yellow-400">8</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Profile - фиксированная позиция внизу */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
          <div className="flex items-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <User className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Алексей Иванов</p>
              <p className="text-xs text-gray-400 truncate">Супер-администратор</p>
            </div>
            <button 
              onClick={() => handleNavigation('/login')}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsed User Profile */}
      {isCollapsed && (
        <div className="p-4 border-t border-gray-700/50 flex justify-center flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-black" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;