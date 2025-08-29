// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Shield, Lock, Eye, FileText, Users, Globe, Clock, AlertCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Политика конфиденциальности
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Мы серьезно относимся к защите ваших персональных данных и соблюдаем все требования законодательства Республики Казахстан
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Последнее обновление: 29 августа 2025 года
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-yellow-600" />
            Содержание
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="#general" className="text-yellow-600 hover:text-yellow-700 text-sm">1. Общие положения</a>
            <a href="#data-collection" className="text-yellow-600 hover:text-yellow-700 text-sm">2. Сбор персональных данных</a>
            <a href="#data-usage" className="text-yellow-600 hover:text-yellow-700 text-sm">3. Использование данных</a>
            <a href="#data-sharing" className="text-yellow-600 hover:text-yellow-700 text-sm">4. Передача данных третьим лицам</a>
            <a href="#data-security" className="text-yellow-600 hover:text-yellow-700 text-sm">5. Защита данных</a>
            <a href="#user-rights" className="text-yellow-600 hover:text-yellow-700 text-sm">6. Права пользователей</a>
            <a href="#cookies" className="text-yellow-600 hover:text-yellow-700 text-sm">7. Файлы Cookie</a>
            <a href="#contact" className="text-yellow-600 hover:text-yellow-700 text-sm">8. Контактная информация</a>
          </div>
        </div>

        <div className="space-y-8">
          {/* Общие положения */}
          <section id="general" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Globe className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Общие положения</h2>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки персональных данных пользователей сервиса WorkPlus.kz (далее — «Сервис»).
              </p>
              <p className="mb-4">
                Оператором персональных данных является ТОО «WorkPlus Kazakhstan», зарегистрированное в Республике Казахстан.
              </p>
              <p className="mb-4">
                Настоящая Политика разработана в соответствии с:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Законом Республики Казахстан «О персональных данных и их защите»</li>
                <li>Законом Республики Казахстан «Об информатизации»</li>
                <li>Иными нормативными правовыми актами Республики Казахстан</li>
              </ul>
              <p>
                Используя наш Сервис, вы даете согласие на обработку ваших персональных данных в соответствии с настоящей Политикой.
              </p>
            </div>
          </section>

          {/* Сбор персональных данных */}
          <section id="data-collection" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. Сбор персональных данных</h2>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">Мы собираем следующие категории персональных данных:</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Данные соискателей:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>ФИО, дата рождения, пол</li>
                <li>Контактная информация (телефон, email, адрес)</li>
                <li>Образование и профессиональный опыт</li>
                <li>Навыки и компетенции</li>
                <li>Фотография (по желанию)</li>
                <li>Документы об образовании (при необходимости)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Данные работодателей:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Наименование организации</li>
                <li>Контактное лицо и его данные</li>
                <li>Реквизиты организации</li>
                <li>Контактная информация</li>
                <li>Информация о вакансиях</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Технические данные:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>IP-адрес и геолокация</li>
                <li>Данные об устройстве и браузере</li>
                <li>Информация о посещенных страницах</li>
                <li>Файлы cookie</li>
              </ul>
            </div>
          </section>

          {/* Использование данных */}
          <section id="data-usage" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Eye className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Использование персональных данных</h2>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">Ваши персональные данные используются для:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Предоставления услуг поиска работы и подбора персонала</li>
                <li>Создания и управления учетными записями пользователей</li>
                <li>Обеспечения связи между соискателями и работодателями</li>
                <li>Размещения резюме и вакансий на платформе</li>
                <li>Отправки уведомлений о подходящих вакансиях/кандидатах</li>
                <li>Улучшения качества наших услуг</li>
                <li>Обеспечения безопасности платформы</li>
                <li>Соблюдения требований законодательства</li>
                <li>Проведения аналитики и исследований (в обезличенном виде)</li>
              </ul>
            </div>
          </section>

          {/* Передача данных третьим лицам */}
          <section id="data-sharing" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Передача данных третьим лицам</h2>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">Мы можем передавать ваши персональные данные третьим лицам в следующих случаях:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Работодателям — при отклике на вакансию (с вашего согласия)</li>
                <li>Соискателям — при размещении вакансии работодателем</li>
                <li>Нашим партнерам и подрядчикам — для обеспечения работы Сервиса</li>
                <li>Государственным органам — при наличии законных оснований</li>
                <li>В случае продажи или реорганизации бизнеса</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-800 text-sm">
                    Мы не продаем и не передаем ваши персональные данные третьим лицам в коммерческих целях без вашего явного согласия.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Защита данных */}
          <section id="data-security" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Lock className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">5. Защита персональных данных</h2>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">Мы применяем следующие меры защиты:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Шифрование данных при передаче (SSL/TLS)</li>
                <li>Контроль доступа к персональным данным</li>
                <li>Регулярные резервные копии</li>
                <li>Мониторинг системы безопасности</li>
                <li>Обучение сотрудников правилам обработки данных</li>
                <li>Физическая защита серверов и оборудования</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Сроки хранения данных:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Активные аккаунты — в течение всего периода использования</li>
                <li>Неактивные аккаунты — 3 года с момента последней активности</li>
                <li>Данные для выполнения договорных обязательств — согласно законодательству</li>
                <li>Технические логи — до 12 месяцев</li>
              </ul>
            </div>
          </section>

          {/* Права пользователей */}
          <section id="user-rights" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">6. Права пользователей</h2>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">Вы имеете право:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Получать информацию об обработке ваших персональных данных</li>
                <li>Требовать уточнения, блокирования или уничтожения неточных данных</li>
                <li>Отзывать согласие на обработку персональных данных</li>
                <li>Получать копию ваших персональных данных</li>
                <li>Ограничивать обработку ваших данных</li>
                <li>Подавать жалобы в уполномоченный орган</li>
              </ul>
              
              <p className="mb-4">
                Для реализации своих прав обратитесь к нам по контактным данным, указанным в разделе 8.
              </p>
            </div>
          </section>

          {/* Файлы Cookie */}
          <section id="cookies" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Globe className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">7. Файлы Cookie</h2>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">Наш сайт использует файлы cookie для:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Обеспечения работы сайта и аутентификации</li>
                <li>Анализа трафика и поведения пользователей</li>
                <li>Персонализации контента</li>
                <li>Улучшения пользовательского опыта</li>
              </ul>
              
              <p className="mb-4">
                Вы можете управлять настройками cookie в своем браузере. Отключение некоторых cookie может повлиять на функциональность сайта.
              </p>
            </div>
          </section>

          {/* Контактная информация */}
          <section id="contact" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">8. Контактная информация</h2>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                По всем вопросам, связанным с обработкой персональных данных, обращайтесь к нам:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">ТОО «WorkPlus Kazakhstan»</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Адрес:</strong> г. Петропавловск, ул. Конституции Казахстана, 35, офис 205</p>
                  <p><strong>Email:</strong> privacy@workplus.kz</p>
                  <p><strong>Телефон:</strong> +7 (700) 123-45-67</p>
                  <p><strong>Ответственное лицо:</strong> Специалист по защите персональных данных</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-800 text-sm">
                    <p className="font-medium mb-1">Изменения в Политике</p>
                    <p>
                      Мы можем вносить изменения в настоящую Политику. Актуальная версия всегда доступна на нашем сайте. 
                      О существенных изменениях мы уведомим вас заблаговременно.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Back to Top */}
        <div className="mt-12 text-center">
          <a 
            href="#top" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
          >
            Наверх
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;