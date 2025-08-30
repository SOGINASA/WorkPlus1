import React, { useState } from 'react';
import { Search, User, MoreHorizontal, Eye, Edit, Ban, CheckCircle, TrendingUp, Users, MapPin, Calendar, Phone, Mail, Star, Briefcase, Filter, Download, GraduationCap, Clock } from 'lucide-react';

const CandidateList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const statuses = [
    { value: 'all', label: 'Все статусы' },
    { value: 'active', label: 'Активно ищут' },
    { value: 'passive', label: 'Рассматривают' },
    { value: 'employed', label: 'Трудоустроены' },
    { value: 'blocked', label: 'Заблокированные' }
  ];

  const experienceLevels = [
    { value: 'all', label: 'Любой опыт' },
    { value: 'no-experience', label: 'Без опыта' },
    { value: '1-3', label: '1-3 года' },
    { value: '3-5', label: '3-5 лет' },
    { value: '5+', label: 'Более 5 лет' }
  ];

  const candidates = [
    {
      id: 1,
      name: 'Максим Петров',
      email: 'maksim.petrov@email.com',
      phone: '+7 701 234 56 78',
      age: 28,
      location: 'Петропавловск',
      position: 'Frontend Developer',
      experience: '3-5',
      salary: 350000,
      status: 'active',
      registeredDate: '10 дек 2024',
      lastActivity: '2 часа назад',
      applications: 15,
      interviews: 8,
      offers: 2,
      rating: 4.7,
      skills: ['React', 'JavaScript', 'CSS'],
      education: 'Высшее техническое'
    },
    {
      id: 2,
      name: 'Анна Смирнова',
      email: 'anna.smirnova@email.com',
      phone: '+7 702 345 67 89',
      age: 24,
      location: 'Костанай',
      position: 'Менеджер по продажам',
      experience: '1-3',
      salary: 200000,
      status: 'passive',
      registeredDate: '15 ноя 2024',
      lastActivity: '1 день назад',
      applications: 8,
      interviews: 4,
      offers: 1,
      rating: 4.3,
      skills: ['Продажи', 'CRM', 'Переговоры'],
      education: 'Высшее экономическое'
    },
    {
      id: 3,
      name: 'Елена Козлова',
      email: 'elena.kozlova@email.com',
      phone: '+7 717 456 78 90',
      age: 22,
      location: 'Петропавловск',
      position: 'Продавец-консультант',
      experience: 'no-experience',
      salary: 150000,
      status: 'active',
      registeredDate: '18 дек 2024',
      lastActivity: '30 мин назад',
      applications: 12,
      interviews: 6,
      offers: 3,
      rating: 4.1,
      skills: ['Обслуживание клиентов', 'Касса', 'Консультации'],
      education: 'Среднее специальное'
    },
    {
      id: 4,
      name: 'Дмитрий Волков',
      email: 'dmitry.volkov@email.com',
      phone: '+7 703 567 89 01',
      age: 35,
      location: 'Актау',
      position: 'Инженер-строитель',
      experience: '5+',
      salary: 450000,
      status: 'employed',
      registeredDate: '5 ноя 2024',
      lastActivity: '1 неделю назад',
      applications: 5,
      interviews: 3,
      offers: 2,
      rating: 4.9,
      skills: ['AutoCAD', 'Проектирование', 'Строительство'],
      education: 'Высшее техническое'
    },
    {
      id: 5,
      name: 'Ольга Иванова',
      email: 'olga.ivanova@email.com',
      phone: '+7 704 678 90 12',
      age: 26,
      location: 'Павлодар',
      position: 'SMM-менеджер',
      experience: '1-3',
      salary: 250000,
      status: 'blocked',
      registeredDate: '20 окт 2024',
      lastActivity: '2 недели назад',
      applications: 3,
      interviews: 1,
      offers: 0,
      rating: 3.5,
      skills: ['Instagram', 'Контент', 'Аналитика'],
      education: 'Высшее гуманитарное'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'passive':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'employed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'blocked':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Активно ищет';
      case 'passive':
        return 'Рассматривает';
      case 'employed':
        return 'Трудоустроен';
      case 'blocked':
        return 'Заблокирован';
      default:
        return status;
    }
  };

  const getExperienceLabel = (experience) => {
    switch (experience) {
      case 'no-experience':
        return 'Без опыта';
      case '1-3':
        return '1-3 года';
      case '3-5':
        return '3-5 лет';
      case '5+':
        return '5+ лет';
      default:
        return experience;
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || candidate.status === selectedStatus;
    const matchesExperience = selectedExperience === 'all' || candidate.experience === selectedExperience;
    
    return matchesSearch && matchesStatus && matchesExperience;
  });

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(cand => cand.id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Соискатели</h1>
          <p className="text-gray-400">База кандидатов и управление резюме</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-gray-300 hover:bg-white/10 transition-all text-sm">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm">
            <User className="w-4 h-4 mr-2" />
            Добавить кандидата
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">2,654</span>
          </div>
          <p className="text-sm text-gray-400">Всего кандидатов</p>
          <div className="flex items-center mt-2 text-green-400 text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            +18% за месяц
          </div>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">1,847</span>
          </div>
          <p className="text-sm text-gray-400">Активно ищут</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">3,156</span>
          </div>
          <p className="text-sm text-gray-400">Всего откликов</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">4.2</span>
          </div>
          <p className="text-sm text-gray-400">Средний рейтинг</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени, email или должности..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              {experienceLevels.map(exp => (
                <option key={exp.value} value={exp.value}>{exp.label}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedCandidates.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 text-sm">
                Выбрано {selectedCandidates.length} кандидатов
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition-all">
                  Отправить предложение
                </button>
                <button className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30 transition-all">
                  Заблокировать
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Candidates Table */}
      <div className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">Кандидат</th>
                <th className="text-left p-4 text-gray-300 font-medium">Должность</th>
                <th className="text-left p-4 text-gray-300 font-medium">Статус</th>
                <th className="text-left p-4 text-gray-300 font-medium">Опыт</th>
                <th className="text-left p-4 text-gray-300 font-medium">Зарплата</th>
                <th className="text-left p-4 text-gray-300 font-medium">Статистика</th>
                <th className="text-left p-4 text-gray-300 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-white/5 transition-all">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => toggleCandidateSelection(candidate.id)}
                      className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-medium text-sm">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-medium">{candidate.name}</div>
                        <div className="text-gray-400 text-sm">{candidate.age} лет</div>
                        <div className="flex items-center mt-1 space-x-3">
                          <div className="flex items-center text-gray-400 text-xs">
                            <Mail className="w-3 h-3 mr-1" />
                            {candidate.email}
                          </div>
                          <div className="flex items-center text-gray-400 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {candidate.location}
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          {candidate.education}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="text-white font-medium">{candidate.position}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs rounded-full border border-yellow-400/20">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                      {getStatusLabel(candidate.status)}
                    </span>
                    <div className="text-gray-400 text-xs mt-1">
                      {candidate.lastActivity}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border text-blue-400 bg-blue-400/10 border-blue-400/20">
                      {getExperienceLabel(candidate.experience)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-green-400 font-medium">
                      {candidate.salary.toLocaleString()} ₸
                    </div>
                    <div className="text-gray-400 text-xs">
                      ожидания
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-blue-400 font-medium text-sm">{candidate.applications}</div>
                          <div className="text-gray-400 text-xs">отклики</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-400 font-medium text-sm">{candidate.interviews}</div>
                          <div className="text-gray-400 text-xs">интервью</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-medium text-sm">{candidate.offers}</div>
                          <div className="text-gray-400 text-xs">офферы</div>
                        </div>
                      </div>
                      {candidate.rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-yellow-400 text-sm">{candidate.rating}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all">
                        <Ban className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Показано {filteredCandidates.length} из {candidates.length} кандидатов
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-white/5 border border-gray-700 rounded text-gray-300 hover:bg-white/10 transition-all text-sm">
                Назад
              </button>
              <button className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/40 rounded text-yellow-400 text-sm">
                1
              </button>
              <button className="px-3 py-1 bg-white/5 border border-gray-700 rounded text-gray-300 hover:bg-white/10 transition-all text-sm">
                2
              </button>
              <button className="px-3 py-1 bg-white/5 border border-gray-700 rounded text-gray-300 hover:bg-white/10 transition-all text-sm">
                Далее
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;