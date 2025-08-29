import React, { useState } from 'react';
import { 
  Plus, Eye, Edit, Trash2, Download, Share2, Copy, 
  Star, Clock, Users, MapPin, Phone, Mail, Calendar,
  Award, Briefcase, GraduationCap, Languages, Settings,
  MoreHorizontal, CheckCircle, AlertCircle, FileText, X
} from 'lucide-react';

const ResumeDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedResume, setSelectedResume] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Моковые данные резюме пользователя
  const userResumes = [
    {
      id: 1,
      title: 'Менеджер по продажам',
      status: 'published', // published, draft, archived
      createdDate: '2024-12-01',
      lastModified: '2024-12-15',
      views: 234,
      responses: 15,
      isDefault: true,
      completeness: 95,
      data: {
        firstName: 'Анна',
        lastName: 'Смирнова',
        email: 'anna.smirnova@email.com',
        phone: '+7 (701) 123-45-67',
        city: 'Петропавловск',
        position: 'Менеджер по продажам',
        salary: '300,000 ₸',
        summary: 'Опытный менеджер по продажам с 5-летним стажем. Превышение планов продаж на 120%. Опыт работы с крупными клиентами.',
        experience: [
          { company: 'ТОО "КазТорг"', position: 'Старший менеджер по продажам', period: '2021-2024' },
          { company: 'Kaspi Red', position: 'Продавец-консультант', period: '2019-2021' }
        ],
        education: [
          { institution: 'КазНУ им. аль-Фараби', degree: 'Бакалавр экономики', period: '2015-2019' }
        ],
        skills: ['Продажи', 'CRM', 'Переговоры', 'Английский язык'],
        languages: [
          { name: 'Казахский', level: 'Родной' },
          { name: 'Русский', level: 'Свободно' },
          { name: 'Английский', level: 'Разговорный' }
        ]
      }
    },
    {
      id: 2,
      title: 'Специалист по маркетингу',
      status: 'draft',
      createdDate: '2024-12-10',
      lastModified: '2024-12-10',
      views: 0,
      responses: 0,
      isDefault: false,
      completeness: 65,
      data: {
        firstName: 'Анна',
        lastName: 'Смирнова',
        email: 'anna.smirnova@email.com',
        phone: '+7 (701) 123-45-67',
        city: 'Петропавловск',
        position: 'Специалист по маркетингу',
        salary: '280,000 ₸',
        summary: 'Начинающий маркетолог с опытом ведения социальных сетей и организации мероприятий.',
        experience: [],
        education: [],
        skills: ['SMM', 'Контент-маркетинг', 'Аналитика'],
        languages: []
      }
    },
    {
      id: 3,
      title: 'Администратор офиса',
      status: 'archived',
      createdDate: '2024-11-15',
      lastModified: '2024-11-20',
      views: 89,
      responses: 3,
      isDefault: false,
      completeness: 90,
      data: {
        firstName: 'Анна',
        lastName: 'Смирнова',
        email: 'anna.smirnova@email.com',
        phone: '+7 (701) 123-45-67',
        city: 'Петропавловск',
        position: 'Администратор офиса',
        salary: '180,000 ₸',
        summary: 'Опытный администратор с навыками работы с документооборотом и клиентами.',
        experience: [],
        education: [],
        skills: ['MS Office', 'Документооборот', 'Клиентский сервис'],
        languages: []
      }
    }
  ];

  const filteredResumes = userResumes.filter(resume => {
    if (activeTab === 'all') return true;
    return resume.status === activeTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-400';
      case 'draft': return 'text-yellow-400';
      case 'archived': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published': return 'Опубликовано';
      case 'draft': return 'Черновик';
      case 'archived': return 'Архив';
      default: return status;
    }
  };

  const handleCreateResume = () => {
    // Redirect to create resume page
    window.location.href = '/create-resume';
  };

  const handleEditResume = (resumeId) => {
    // Redirect to edit resume page
    window.location.href = `/edit-resume/${resumeId}`;
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  const handleDeleteResume = (resumeId) => {
    setSelectedResume(resumeId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting resume:', selectedResume);
    setShowDeleteModal(false);
    setSelectedResume(null);
    alert('Резюме удалено!');
  };

  const handleShareResume = (resume) => {
    setSelectedResume(resume);
    setShowShareModal(true);
  };

  const copyResumeLink = () => {
    const link = `https://workplus.kz/resume/${selectedResume.id}`;
    navigator.clipboard.writeText(link);
    alert('Ссылка скопирована в буфер обмена!');
  };

  return (
    <div>
      {/* Hero Section with gradient background */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Мои резюме</h1>
              <p className="text-gray-300">Управляйте своими резюме и отслеживайте статистику</p>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              <button 
                onClick={handleSettings}
                className="flex items-center px-4 py-2 bg-white/10 border border-gray-600 text-white rounded-lg hover:bg-white/15 transition-all"
              >
                <Settings className="w-4 h-4 mr-2" />
                Настройки
              </button>
              <button 
                onClick={handleCreateResume}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать резюме
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-400/20 border border-yellow-400/30 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-2xl font-bold text-yellow-400">{userResumes.length}</span>
              </div>
              <h3 className="text-white font-medium">Всего резюме</h3>
              <p className="text-gray-400 text-sm">
                {userResumes.filter(r => r.status === 'published').length} активных
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-400/20 border border-blue-400/30 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-400">
                  {userResumes.reduce((sum, r) => sum + r.views, 0)}
                </span>
              </div>
              <h3 className="text-white font-medium">Всего просмотров</h3>
              <p className="text-gray-400 text-sm">За последний месяц</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-400/20 border border-green-400/30 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-400">
                  {userResumes.reduce((sum, r) => sum + r.responses, 0)}
                </span>
              </div>
              <h3 className="text-white font-medium">Откликов</h3>
              <p className="text-gray-400 text-sm">От работодателей</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-400/20 border border-purple-400/30 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-400">
                  {Math.round(userResumes.reduce((sum, r) => sum + r.completeness, 0) / userResumes.length)}%
                </span>
              </div>
              <h3 className="text-white font-medium">Средняя полнота</h3>
              <p className="text-gray-400 text-sm">Заполненность резюме</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs and Resume Cards Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'Все', count: userResumes.length },
              { key: 'published', label: 'Опубликованные', count: userResumes.filter(r => r.status === 'published').length },
              { key: 'draft', label: 'Черновики', count: userResumes.filter(r => r.status === 'draft').length },
              { key: 'archived', label: 'Архив', count: userResumes.filter(r => r.status === 'archived').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-yellow-400 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Resume Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div key={resume.id} className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all group">
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">{resume.title}</h3>
                        {resume.isDefault && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span className={`flex items-center gap-1 ${getStatusColor(resume.status)}`}>
                          <CheckCircle className="w-3 h-3" />
                          {getStatusText(resume.status)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(resume.lastModified).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Заполненность</span>
                      <span className="text-sm font-medium text-white">{resume.completeness}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all"
                        style={{ width: `${resume.completeness}%` }}
                      />
                    </div>
                  </div>

                  {/* Resume Preview Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin className="w-3 h-3" />
                      <span>{resume.data.city}</span>
                      <span>•</span>
                      <span>{resume.data.salary}</span>
                    </div>
                    
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {resume.data.summary}
                    </p>
                  </div>

                  {/* Skills Preview */}
                  {resume.data.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {resume.data.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                        {resume.data.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                            +{resume.data.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="px-6 py-3 bg-white/5 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {resume.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {resume.responses}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleShareResume(resume)}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title="Поделиться"
                      >
                        <Share2 className="w-3 h-3 text-gray-400 hover:text-white" />
                      </button>
                      <button 
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title="Предпросмотр"
                      >
                        <Eye className="w-3 h-3 text-gray-400 hover:text-white" />
                      </button>
                      <button 
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title="Редактировать"
                        onClick={() => handleEditResume(resume.id)}
                      >
                        <Edit className="w-3 h-3 text-gray-400 hover:text-yellow-400" />
                      </button>
                      <button 
                        onClick={() => handleDeleteResume(resume.id)}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-white/5 border-t border-gray-700">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditResume(resume.id)}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2 px-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm"
                    >
                      Редактировать
                    </button>
                    <button className="px-4 py-2 bg-white/10 border border-gray-600 text-white rounded-lg hover:bg-white/15 transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredResumes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {activeTab === 'all' ? 'У вас пока нет резюме' : `Нет резюме в категории "${getStatusText(activeTab)}"`}
              </h3>
              <p className="text-gray-400 mb-6">
                Создайте ваше первое резюме и начните поиск работы
              </p>
              <button 
                onClick={handleCreateResume}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
              >
                Создать резюме
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Готовы к новым возможностям?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
            Оптимизируйте свои резюме и получите больше предложений от работодателей
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleCreateResume}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Создать новое резюме
            </button>
            <button className="border border-yellow-400/40 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:bg-yellow-400/10 transition-all text-sm md:text-base">
              Советы по созданию резюме
            </button>
          </div>
        </div>
      </section>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-red-400/20 rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 border border-red-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Удалить резюме?</h3>
              <p className="text-gray-300 mb-6">
                Это действие нельзя будет отменить. Все данные резюме будут безвозвратно утеряны.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-yellow-400/20 rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400/20 border border-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-yellow-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Поделиться резюме</h3>
              <p className="text-gray-300 mb-6">
                Скопируйте ссылку на ваше резюме для отправки работодателям
              </p>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={`https://workplus.kz/resume/${selectedResume?.id}`}
                    readOnly
                    className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                  />
                  <button
                    onClick={copyResumeLink}
                    className="p-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Закрыть
                </button>
                <button
                  onClick={copyResumeLink}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
                >
                  Копировать ссылку
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-yellow-400/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Настройки резюме</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Privacy Settings */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Приватность</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Показывать контактную информацию</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Разрешить работодателям связываться со мной</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Показывать в поиске резюме</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                  </label>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Уведомления</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Email уведомления о новых откликах</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">SMS о срочных предложениях</span>
                    <input type="checkbox" className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Еженедельный отчет активности</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                  </label>
                </div>
              </div>

              {/* Profile Settings */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Профиль</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Статус поиска работы</label>
                    <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
                      <option>Активно ищу работу</option>
                      <option>Рассматриваю предложения</option>
                      <option>Не ищу работу</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Готовность к переезду</label>
                    <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
                      <option>Готов к переезду</option>
                      <option>Только в пределах области</option>
                      <option>Только в текущем городе</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  alert('Настройки сохранены!');
                  setShowSettingsModal(false);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeDashboard;