// src/components/Header.jsx
import React, { useState } from 'react';
import { Building, Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <h1 className="text-lg md:text-xl font-bold text-yellow-400">WorkPlus.kz</h1>
              <p className="text-xs text-gray-400 hidden sm:block">HR-экосистема Казахстана</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm xl:text-base">Главная</a>
            <a href="/jobs" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Вакансии</a>
            <a href="/resumes" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Резюме</a>
            <a href="/post-job" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Разместить вакансию</a>
            {/* <a href="/pricing" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Тарифы</a>
            <a href="/blog" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Блог</a>
            <a href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">О нас</a>
            <a href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Контакты</a> */}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-300 hover:text-yellow-400 transition-colors text-sm xl:text-base">Войти</button>
            <a 
              href="/post-job" 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-2 xl:px-4 xl:py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm xl:text-base"
            >
              Разместить вакансию
            </a>
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
              <a href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors px-2 py-1">Главная</a>
              <a href="/jobs" className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1">Вакансии</a>
              <a href="/resumes" className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1">Резюме</a>
              <a href="/post-job" className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1">Разместить вакансию</a>
              <a href="/pricing" className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1">Тарифы</a>
              <a href="/blog" className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1">Блог</a>
              <a href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1">О нас</a>
              <a href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors px-2 py-1">Контакты</a>
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
                <button className="text-gray-300 hover:text-yellow-400 transition-colors text-left px-2 py-1">Войти</button>
                <a 
                  href="/post-job" 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-center"
                >
                  Разместить вакансию
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
