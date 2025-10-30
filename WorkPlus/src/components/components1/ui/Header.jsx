// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Building, Menu, X, User, LogOut, Settings, Crown } from 'lucide-react';
import { useAuth } from '../../api/AuthUtils';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  // Проверяем тип пользователя
  const isEmployer = user && user.user_type === 'employer';
  const isCandidate = user && user.user_type === 'candidate';
  const isAdmin = user && user.user_type === 'admin';

  // Роуты профиля
  const profileRoutes = {
    candidate: '/candidate-profile',
    employer: '/employer-profile',
  };

  const getProfilePath = () => {
    if (!user) return '/login';
    return profileRoutes[user.user_type] || '/profile';
  };

  // Проверка активной ссылки
  const isActiveLink = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const getLinkClasses = (path, baseClasses = "transition-colors text-sm xl:text-base whitespace-nowrap") => {
    const isActive = isActiveLink(path);
    return `${baseClasses} ${isActive 
      ? 'text-yellow-400' 
      : 'text-gray-300 hover:text-yellow-400'
    }`;
  };

  const getPremiumLinkClasses = (path) => {
    const isActive = isActiveLink(path);
    return `transition-colors text-sm xl:text-base whitespace-nowrap flex items-center ${isActive 
      ? 'text-purple-400' 
      : 'text-purple-300 hover:text-purple-400'
    }`;
  };

  const getMobileLinkClasses = (path) => {
    const isActive = isActiveLink(path);
    return `transition-colors px-2 py-1 ${isActive 
      ? 'text-yellow-400' 
      : 'text-gray-300 hover:text-yellow-400'
    }`;
  };

  return (
    <header className="bg-black/50 backdrop-blur-sm border-b border-yellow-400/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Building className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </div>
            <div>
              <a href="/" className="block" onClick={() => setCurrentPath('/')}>
                <h1 className="text-lg md:text-xl font-bold text-yellow-400">WorkPlus.kz</h1>
                <p className="text-xs text-gray-400 hidden sm:block">HR-экосистема Казахстана</p>
              </a>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 justify-center">
            <a 
              href="/" 
              className={getLinkClasses('/')}
              onClick={() => setCurrentPath('/')}
            >
              Главная
            </a>
            <a 
              href="/jobs" 
              className={getLinkClasses('/jobs')}
              onClick={() => setCurrentPath('/jobs')}
            >
              Вакансии
            </a>
            <a 
              href="/vacancy-key" 
              className={getPremiumLinkClasses('/vacancy-key')}
              onClick={() => setCurrentPath('/vacancy-key')}
            >
              <Crown className="w-3 h-3 xl:w-4 xl:h-4 mr-1" />
              Премиум поиск
            </a>
            <a 
              href="/notifications" 
              className={getLinkClasses('/notifications')}
              onClick={() => setCurrentPath('/notifications')}
            >
              Уведомления
            </a>
            
            {/* Показываем резюме только для соискателей */}
            {(isCandidate || isAdmin || !isAuthenticated()) && (
              <a 
                href="/create-resume" 
                className={getLinkClasses('/create-resume')}
                onClick={() => setCurrentPath('/create-resume')}
              >
                Резюме
              </a>
            )}
            
            {/* УБИРАЕМ ДУБЛИРУЮЩУЮ КНОПКУ ОТСЮДА - она будет только в секции actions справа */}
            
            {/* ссылка на админпанель */}
            {isAdmin && (
              <a 
                href="/admin/dashboard" 
                className={getLinkClasses('/admin')}
                onClick={() => setCurrentPath('/admin/dashboard')}
              >
                Админ панель
              </a>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {!isAuthenticated() ? (
              // Для неавторизованных пользователей
              <div className="flex items-center space-x-3">
                <a 
                  href="/login" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base whitespace-nowrap"
                  onClick={() => setCurrentPath('/login')}
                >
                  Войти
                </a>
                <div className="w-px h-4 bg-gray-600"></div>
                <a 
                  href="/register" 
                  className="border border-gray-600 text-gray-300 hover:text-yellow-400 hover:border-yellow-400 px-3 py-1.5 xl:px-4 xl:py-2 rounded-lg transition-all text-sm xl:text-base whitespace-nowrap"
                  onClick={() => setCurrentPath('/register')}
                >
                  Регистрация
                </a>
                <a 
                  href="/register" 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1.5 xl:px-4 xl:py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm xl:text-base whitespace-nowrap"
                  onClick={() => setCurrentPath('/register')}
                >
                  Разместить вакансию
                </a>
              </div>
            ) : (
              // Для авторизованных пользователей
              <div className="flex items-center space-x-3">
                {/* Кнопка размещения вакансии только для работодателей - ЕДИНСТВЕННАЯ КНОПКА */}
                {isEmployer && (
                  <a 
                    href="/create-job" 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1.5 xl:px-4 xl:py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm xl:text-base whitespace-nowrap"
                    onClick={() => setCurrentPath('/create-job')}
                  >
                    Разместить вакансию
                  </a>
                )}

                {/* Меню пользователя */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-sm xl:text-base hidden xl:block max-w-24 truncate">{user?.name}</span>
                  </button>

                  {/* Выпадающее меню пользователя */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-yellow-400 font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.user_type === 'candidate' && 'Соискатель'}
                          {user?.user_type === 'employer' && 'Работодатель'}
                          {user?.user_type === 'admin' && 'Администратор'}
                        </p>
                      </div>
                      
                      <a
                        href={getProfilePath()}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActiveLink(getProfilePath()) 
                            ? 'bg-gray-700 text-yellow-400' 
                            : 'text-gray-300 hover:bg-gray-700 hover:text-yellow-400'
                        }`}
                        onClick={() => {
                          setUserMenuOpen(false);
                          setCurrentPath(getProfilePath());
                        }}
                      >
                        <Settings className="w-4 h-4 inline mr-2" />
                        Профиль
                      </a>

                      {isEmployer && (
                        <a
                          href="/employer/dashboard"
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isActiveLink('/employer/dashboard') 
                              ? 'bg-gray-700 text-yellow-400' 
                              : 'text-gray-300 hover:bg-gray-700 hover:text-yellow-400'
                          }`}
                          onClick={() => {
                            setUserMenuOpen(false);
                            setCurrentPath('/employer/dashboard');
                          }}
                        >
                          Панель управления
                        </a>
                      )}

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <a 
                href="/" 
                className={getMobileLinkClasses('/')}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentPath('/');
                }}
              >
                Главная
              </a>
              <a 
                href="/jobs" 
                className={getMobileLinkClasses('/jobs')}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentPath('/jobs');
                }}
              >
                Вакансии
              </a>
              <a 
                href="/vacancy-key" 
                className="transition-colors px-2 py-1 flex items-center text-purple-300 hover:text-purple-400"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentPath('/vacancy-key');
                }}
              >
                <Crown className="w-4 h-4 mr-2" />
                Премиум поиск
              </a>
              <a 
                href="/notifications" 
                className={getMobileLinkClasses('/notifications')}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentPath('/notifications');
                }}
              >
                Уведомления
              </a>
              
              {/* Показываем резюме только для соискателей или неавторизованных */}
              {(isCandidate || !isAuthenticated()) && (
                <a 
                  href="/resume-dashboard" 
                  className={getMobileLinkClasses('/resume-dashboard')}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentPath('/resume-dashboard');
                  }}
                >
                  Резюме
                </a>
              )}

              {/* В мобильном меню оставляем ссылку на размещение вакансий в навигации для работодателей */}
              {isEmployer && (
                <a 
                  href="/create-job" 
                  className={getMobileLinkClasses('/create-job')}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentPath('/create-job');
                  }}
                >
                  Разместить вакансию
                </a>
              )}
              
              <a 
                href="/about" 
                className={getMobileLinkClasses('/about')}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentPath('/about');
                }}
              >
                О нас
              </a>
              <a 
                href="/contact" 
                className={getMobileLinkClasses('/contact')}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentPath('/contact');
                }}
              >
                Контакты
              </a>
              
              <div className="pt-4 border-t border-gray-700">
                {!isAuthenticated() ? (
                  // Мобильное меню для неавторизованных
                  <div className="space-y-3">
                    <a
                      href="/login"
                      className="block w-full text-center py-3 text-gray-300 hover:text-yellow-400 transition-colors border-b border-gray-700/50"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCurrentPath('/login');
                      }}
                    >
                      Войти
                    </a>
                    <a
                      href="/register"
                      className="block w-full text-center py-3 border border-gray-600 text-gray-300 hover:text-yellow-400 hover:border-yellow-400 rounded-lg transition-all mx-0"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCurrentPath('/register');
                      }}
                    >
                      Регистрация
                    </a>
                    <a 
                      href="/register" 
                      className="block w-full text-center py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all mx-0"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCurrentPath('/register');
                      }}
                    >
                      Разместить вакансию
                    </a>
                  </div>
                ) : (
                  // Мобильное меню для авторизованных
                  <div className="space-y-3">
                    <div className="px-0 py-3 border-b border-gray-600/50">
                      <p className="text-sm text-yellow-400 font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.user_type === 'candidate' ? 'Соискатель' : 'Работодатель'}
                      </p>
                    </div>

                    <a
                      href={getProfilePath()}
                      className="flex items-center w-full py-3 text-gray-300 hover:text-yellow-400 transition-colors border-b border-gray-700/50"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCurrentPath(getProfilePath());
                      }}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Профиль
                    </a>

                    {isEmployer && (
                      <>
                        <a
                          href="/employer/dashboard"
                          className="flex items-center w-full py-3 text-gray-300 hover:text-yellow-400 transition-colors border-b border-gray-700/50"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setCurrentPath('/employer/dashboard');
                          }}
                        >
                          Панель управления
                        </a>
                        {/* В мобильном меню кнопка размещения вакансий для работодателей остается */}
                        <a 
                          href="/create-job" 
                          className="block w-full text-center py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all mx-0"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setCurrentPath('/create-job');
                          }}
                        >
                          Разместить вакансию
                        </a>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full py-3 text-red-400 hover:text-red-300 transition-colors border-t border-gray-700/50 mt-4"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay для закрытия меню пользователя при клике вне его */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;