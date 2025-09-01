// src/components/Header.jsx
import React, { useState } from 'react';
import { Building, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../api/AuthUtils';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  // Проверяем тип пользователя
  const isEmployer = user && user.user_type === 'employer';
  const isCandidate = user && user.user_type === 'candidate';
  const isAdmin = user && user.user_type === 'admin';

  return (
    <header className="bg-black/50 backdrop-blur-sm border-b border-yellow-400/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Building className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </div>
            <div>
              <a href="/" className="block">
                <h1 className="text-lg md:text-xl font-bold text-yellow-400">WorkPlus.kz</h1>
                <p className="text-xs text-gray-400 hidden sm:block">HR-экосистема Казахстана</p>
              </a>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm xl:text-base">Главная</a>
            <a href="/jobs" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Вакансии</a>
            <a href="/notifications" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Уведомления</a>
            
            {/* Показываем резюме только для соискателей */}
            {(isCandidate || isAdmin || !isAuthenticated()) && (
              <a href="/resume-dashboard" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Резюме</a>
            )}

            {/* {isCandidate && (
              <a href="/notifications" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Уведомления</a>
            )} */}
            
            {/* Показываем размещение вакансий только для работодателей */}
            {isEmployer && (
              <a href="/create-job" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Разместить вакансию</a>
            )}

            {/* ссылка на аддминпанель */}
            {isAdmin && (
              <a href="/admin/dashboard" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Панель администратора</a>
            )}

          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated() ? (
              // Для неавторизованных пользователей
              <>
                <a 
                  href="/login" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base"
                >
                  Войти
                </a>
                <a 
                  href="/register" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base border border-gray-600 px-3 py-2 rounded-lg hover:border-yellow-400"
                >
                  Регистрация
                </a>
                <a 
                  href="/register" 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-2 xl:px-4 xl:py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm xl:text-base"
                >
                  Разместить вакансию
                </a>
              </>
            ) : (
              // Для авторизованных пользователей
              <>
                {/* Кнопка размещения вакансии только для работодателей */}
                {isEmployer && (
                  <a 
                    href="/create-job" 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-2 xl:px-4 xl:py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm xl:text-base"
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
                    <span className="text-sm xl:text-base hidden xl:block">{user.name}</span>
                  </button>

                  {/* Выпадающее меню пользователя */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-yellow-400 font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user.user_type === 'candidate' ? 'Соискатель' : ''}
                          {user.user_type === 'employer' ? 'Работодатель' : ''}
                          {user.user_type === 'admin' ? 'Администратор' : ''}
                        </p>
                      </div>
                      
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 inline mr-2" />
                        Профиль
                      </a>

                      {isEmployer && (
                        <a
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
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
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
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
                className="text-yellow-400 hover:text-yellow-300 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Главная
              </a>
              <a 
                href="/jobs" 
                className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Вакансии
              </a>
              
              {/* Показываем резюме только для соискателей или неавторизованных */}
              {(isCandidate || !isAuthenticated()) && (
                <a 
                  href="/resume-dashboard" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Резюме
                </a>
              )}

              {/* Показываем размещение вакансий только для работодателей */}
              {isEmployer && (
                <a 
                  href="/create-job" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Разместить вакансию
                </a>
              )}
              
              <a 
                href="/about" 
                className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                О нас
              </a>
              <a 
                href="/contact" 
                className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Контакты
              </a>
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
                {!isAuthenticated() ? (
                  // Мобильное меню для неавторизованных
                  <>
                    <a
                      href="/login"
                      className="text-gray-300 hover:text-yellow-400 transition-colors text-left px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Войти
                    </a>
                    <a
                      href="/register"
                      className="text-gray-300 hover:text-yellow-400 transition-colors text-left px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Регистрация
                    </a>
                    <a 
                      href="/register" 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Разместить вакансию
                    </a>
                  </>
                ) : (
                  // Мобильное меню для авторизованных
                  <>
                    <div className="px-2 py-2 border-b border-gray-600">
                      <p className="text-sm text-yellow-400 font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.user_type === 'candidate' ? 'Соискатель' : 'Работодатель'}
                      </p>
                    </div>

                    <a
                      href="/profile"
                      className="text-gray-300 hover:text-yellow-400 transition-colors text-left px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 inline mr-2" />
                      Профиль
                    </a>

                    {isEmployer && (
                      <>
                        <a
                          href="/admin/dashboard"
                          className="text-gray-300 hover:text-yellow-400 transition-colors text-left px-2 py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Панель управления
                        </a>
                        <a 
                          href="/create-job" 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Разместить вакансию
                        </a>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 transition-colors text-left px-2 py-1"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Выйти
                    </button>
                  </>
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