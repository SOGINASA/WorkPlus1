import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  LogOut
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Функция навигации
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Закрываем мобильное меню при навигации
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed}
          currentPath={location.pathname}
          onNavigate={handleNavigation}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-64 h-full">
            <AdminSidebar 
              isCollapsed={false}
              currentPath={location.pathname}
              onNavigate={handleNavigation}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20 px-4 py-3 flex items-center justify-between">
          {/* Left Side - Mobile Menu Button + Collapse Button */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-400 hover:text-white transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 text-gray-400 hover:text-white transition-colors hidden lg:block"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:block">
              <p className="text-sm text-gray-400">
                {getBreadcrumb(location.pathname)}
              </p>
            </div>
          </div>

          {/* Right Side - Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск..."
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400 w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
                <span className="hidden sm:block text-sm">Алексей И.</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">Алексей Иванов</p>
                  <p className="text-xs text-gray-400">admin@workplus.kz</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => handleNavigation('/admin/settings/general')}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Профиль
                  </button>
                  <button
                    onClick={() => handleNavigation('/admin/settings/general')}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Menu className="w-4 h-4 mr-2" />
                    Настройки
                  </button>
                  <hr className="my-1 border-gray-700" />
                  <button
                    onClick={() => {
                      // Здесь логика выхода
                      console.log('Выход из системы');
                      navigate('/login');
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Функция для генерации breadcrumb
const getBreadcrumb = (pathname) => {
  const pathMap = {
    '/admin/dashboard': 'Панель управления',
    '/admin/dashboard/analytics': 'Панель управления / Аналитика',
    '/admin/dashboard/reports': 'Панель управления / Отчеты',
    '/admin/jobs/list': 'Вакансии / Список',
    '/admin/jobs/moderation': 'Вакансии / Модерация',
    '/admin/jobs/analytics': 'Вакансии / Аналитика',
    '/admin/jobs/templates': 'Вакансии / Шаблоны',
    '/admin/users/list': 'Пользователи / Список',
    '/admin/users/employers': 'Пользователи / Работодатели',
    '/admin/users/candidates': 'Пользователи / Соискатели',
    '/admin/users/profiles': 'Пользователи / Профили',
    '/admin/moderation/queue': 'Модерация / Очередь',
    '/admin/moderation/reports': 'Модерация / Жалобы',
    '/admin/moderation/content': 'Модерация / Контент',
    '/admin/social/manager': 'Соцсети / Управление',
    '/admin/social/scheduler': 'Соцсети / Планировщик',
    '/admin/social/analytics': 'Соцсети / Аналитика',
    '/admin/social/calendar': 'Соцсети / Календарь',
    '/admin/finances/revenue': 'Финансы / Доходы',
    '/admin/finances/subscriptions': 'Финансы / Подписки',
    '/admin/finances/payments': 'Финансы / Платежи',
    '/admin/finances/reports': 'Финансы / Отчеты',
    '/admin/crm/leads': 'CRM / Лиды',
    '/admin/crm/pipeline': 'CRM / Воронка',
    '/admin/crm/clients': 'CRM / Клиенты',
    '/admin/settings/general': 'Настройки / Общие',
    '/admin/settings/pricing': 'Настройки / Тарифы',
    '/admin/settings/integrations': 'Настройки / Интеграции',
    '/admin/settings/permissions': 'Настройки / Разрешения',
    '/admin/analytics/funnels': 'Аналитика / Воронки',
    '/admin/analytics/cohorts': 'Аналитика / Когорты',
    '/admin/analytics/geo': 'Аналитика / География'
  };

  return pathMap[pathname] || 'Неизвестная страница';
};

export default AdminLayout;