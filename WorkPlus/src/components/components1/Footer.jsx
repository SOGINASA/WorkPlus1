// src/components/Footer.jsx
import React from 'react';
import { Building, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Building className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-400">WorkPlus.kz</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 lg:mb-0 max-w-sm">
              HR-экосистема с мультиканальной дистрибуцией для Казахстана
            </p>
          </div>

          {/* Соискателям */}
          <div>
            <h4 className="text-white font-semibold mb-4">Соискателям</h4>
            <ul className="space-y-2">
              <li><a href="/jobs" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Поиск вакансий</a></li>
              <li><a href="/create-resume" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Создать резюме</a></li>
              <li><a href="/resumes" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Мое резюме</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Карьерные советы</a></li>
            </ul>
          </div>

          {/* Работодателям */}
          <div>
            <h4 className="text-white font-semibold mb-4">Работодателям</h4>
            <ul className="space-y-2">
              <li><a href="/post-job" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Разместить вакансию</a></li>
              <li><a href="/resumes" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Поиск резюме</a></li>
              <li><a href="/dashboard" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Панель управления</a></li>
              <li><a href="/pricing" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Тарифы</a></li>
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h4 className="text-white font-semibold mb-4">Компания</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">О нас</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Контакты</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Блог</a></li>
              <li><a href="/privacy-policy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Политика конфиденциальности</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">© 2025 WorkPlus.kz. Все права защищены.</p>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <span className="text-gray-400 text-sm">Петропавловск, Казахстан</span>
              <a href="tel:+77001234567" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                +7 (700) 123-45-67
              </a>
              <a href="mailto:info@workplus.kz" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                info@workplus.kz
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;