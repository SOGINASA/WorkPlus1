import React, { useState } from 'react';
import {
  Shield,
  Users,
  User,
  Crown,
  Settings,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Key,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Save,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Globe,
  Building2,
  FileText,
  CreditCard,
  MessageCircle,
  BarChart3,
  Database,
  Mail
} from 'lucide-react';

const PermissionCard = ({ permission, enabled, onChange, description, category }) => {
  const getCategoryIcon = (cat) => {
    const iconMap = {
      jobs: FileText,
      users: Users,
      analytics: BarChart3,
      finances: CreditCard,
      settings: Settings,
      social: MessageCircle,
      data: Database,
      communication: Mail
    };
    const IconComponent = iconMap[cat] || Shield;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all">
      <div className="flex items-center flex-1">
        <div className="p-2 bg-gray-600/50 rounded-lg mr-3">
          {getCategoryIcon(category)}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white">{permission}</h4>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
          enabled ? 'bg-yellow-400' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

const RoleCard = ({ role, onEdit, onDelete, onToggle, onViewUsers }) => {
  const getRoleIcon = (roleName) => {
    switch(roleName.toLowerCase()) {
      case 'admin':
      case 'супер-админ':
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 'moderator':
      case 'модератор':
        return <Shield className="w-6 h-6 text-blue-400" />;
      case 'manager':
      case 'менеджер':
        return <User className="w-6 h-6 text-green-400" />;
      default:
        return <Users className="w-6 h-6 text-gray-400" />;
    }
  };

  const getRoleColor = (roleName) => {
    switch(roleName.toLowerCase()) {
      case 'admin':
      case 'супер-админ':
        return 'border-yellow-400/30';
      case 'moderator':
      case 'модератор':
        return 'border-blue-400/30';
      case 'manager':
      case 'менеджер':
        return 'border-green-400/30';
      default:
        return 'border-gray-400/30';
    }
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 hover:border-yellow-400/40 transition-all ${getRoleColor(role.name)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {getRoleIcon(role.name)}
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-white">{role.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{role.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs border ${
            role.active 
              ? 'bg-green-500/20 border-green-400/30 text-green-400'
              : 'bg-gray-500/20 border-gray-400/30 text-gray-400'
          }`}>
            {role.active ? 'Активна' : 'Отключена'}
          </div>
          <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Пользователей</span>
          <span className="text-sm font-medium text-white">{role.userCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Разрешений</span>
          <span className="text-sm font-medium text-white">{role.permissionCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Создана</span>
          <span className="text-sm font-medium text-white">{role.createdAt}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewUsers(role)}
          className="flex items-center px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-400 text-sm rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          <Users className="w-4 h-4 mr-1" />
          Пользователи
        </button>
        <button
          onClick={() => onEdit(role)}
          className="flex items-center px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 text-yellow-400 text-sm rounded-lg hover:bg-yellow-500/30 transition-colors"
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Редактировать
        </button>
        {role.name !== 'Супер-админ' && (
          <button
            onClick={() => onDelete(role)}
            className="flex items-center px-3 py-1 bg-red-500/20 border border-red-400/30 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Удалить
          </button>
        )}
      </div>
    </div>
  );
};

const UserCard = ({ user, onEdit, onToggle, onChangeRole, availableRoles }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'suspended': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 border-green-400/30 text-green-400';
      case 'suspended': return 'bg-red-500/20 border-red-400/30 text-red-400';
      case 'pending': return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-400';
      default: return 'bg-gray-500/20 border-gray-400/30 text-gray-400';
    }
  };

  return (
    <div className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-black" />
          </div>
          <div>
            <h4 className="font-medium text-white">{user.name}</h4>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(user.status)}`}>
          {getStatusIcon(user.status)}
          <span className="ml-1 capitalize">
            {user.status === 'active' ? 'Активен' : 
             user.status === 'suspended' ? 'Заблокирован' : 
             user.status === 'pending' ? 'Ожидает' : 'Неизвестно'}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Роль</span>
          <select
            value={user.role}
            onChange={(e) => onChangeRole(user.id, e.target.value)}
            className="text-xs bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white focus:ring-yellow-400 focus:border-yellow-400"
          >
            {availableRoles.map(role => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Последний вход</span>
          <span className="text-xs text-white">{user.lastLogin}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(user)}
          className="flex items-center px-2 py-1 bg-yellow-500/20 border border-yellow-400/30 text-yellow-400 text-xs rounded-lg hover:bg-yellow-500/30 transition-colors"
        >
          <Edit3 className="w-3 h-3 mr-1" />
          Изменить
        </button>
        <button
          onClick={() => onToggle(user)}
          className={`flex items-center px-2 py-1 text-xs rounded-lg transition-colors ${
            user.status === 'active'
              ? 'bg-red-500/20 border border-red-400/30 text-red-400 hover:bg-red-500/30'
              : 'bg-green-500/20 border border-green-400/30 text-green-400 hover:bg-green-500/30'
          }`}
        >
          {user.status === 'active' ? (
            <>
              <Lock className="w-3 h-3 mr-1" />
              Заблокировать
            </>
          ) : (
            <>
              <Unlock className="w-3 h-3 mr-1" />
              Активировать
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const RoleModal = ({ role, isOpen, onClose, onSave, isCreateMode = false }) => {
  const [roleName, setRoleName] = useState(role?.name || '');
  const [roleDescription, setRoleDescription] = useState(role?.description || '');
  const [permissions, setPermissions] = useState(role?.permissions || {});
  const [expandedCategories, setExpandedCategories] = useState({
    jobs: true,
    users: false,
    analytics: false,
    finances: false,
    settings: false,
    social: false,
    data: false,
    communication: false
  });

  const permissionCategories = {
    jobs: {
      title: 'Управление вакансиями',
      permissions: {
        'jobs.create': 'Создание вакансий',
        'jobs.edit': 'Редактирование вакансий',
        'jobs.delete': 'Удаление вакансий',
        'jobs.moderate': 'Модерация вакансий',
        'jobs.publish': 'Публикация вакансий',
        'jobs.analytics': 'Просмотр аналитики вакансий'
      }
    },
    users: {
      title: 'Управление пользователями',
      permissions: {
        'users.view': 'Просмотр пользователей',
        'users.edit': 'Редактирование пользователей',
        'users.delete': 'Удаление пользователей',
        'users.suspend': 'Блокировка пользователей',
        'users.roles': 'Управление ролями',
        'users.permissions': 'Управление разрешениями'
      }
    },
    analytics: {
      title: 'Аналитика и отчеты',
      permissions: {
        'analytics.view': 'Просмотр аналитики',
        'analytics.export': 'Экспорт отчетов',
        'analytics.advanced': 'Расширенная аналитика',
        'analytics.realtime': 'Данные в реальном времени'
      }
    },
    finances: {
      title: 'Финансы',
      permissions: {
        'finances.view': 'Просмотр финансов',
        'finances.transactions': 'Управление транзакциями',
        'finances.reports': 'Финансовые отчеты',
        'finances.billing': 'Управление подписками'
      }
    },
    settings: {
      title: 'Настройки системы',
      permissions: {
        'settings.general': 'Общие настройки',
        'settings.integrations': 'Управление интеграциями',
        'settings.security': 'Настройки безопасности',
        'settings.backup': 'Резервное копирование'
      }
    },
    social: {
      title: 'Социальные сети',
      permissions: {
        'social.manage': 'Управление соцсетями',
        'social.post': 'Публикация постов',
        'social.schedule': 'Планирование публикаций',
        'social.analytics': 'Аналитика соцсетей'
      }
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const togglePermission = (permKey, enabled) => {
    setPermissions(prev => ({
      ...prev,
      [permKey]: enabled
    }));
  };

  const handleSave = () => {
    const roleData = {
      id: role?.id || Date.now(),
      name: roleName,
      description: roleDescription,
      permissions: permissions,
      permissionCount: Object.values(permissions).filter(Boolean).length,
      active: true,
      createdAt: role?.createdAt || new Date().toLocaleDateString('ru'),
      userCount: role?.userCount || 0
    };
    onSave(roleData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-yellow-400/20 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">
          {isCreateMode ? 'Создание роли' : 'Редактирование роли'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Название роли <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Например: Менеджер по найму"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Описание
              </label>
              <textarea
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-400 focus:border-yellow-400 resize-none"
                placeholder="Описание роли и ее обязанностей"
              />
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3">Статистика разрешений</h4>
              <div className="space-y-2">
                {Object.entries(permissionCategories).map(([key, category]) => {
                  const categoryPerms = Object.keys(category.permissions);
                  const enabledPerms = categoryPerms.filter(perm => permissions[perm]);
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-xs text-gray-400">{category.title}</span>
                      <span className="text-xs text-white">{enabledPerms.length}/{categoryPerms.length}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Разрешения</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(permissionCategories).map(([categoryKey, category]) => (
                <div key={categoryKey} className="border border-gray-600/50 rounded-lg">
                  <button
                    onClick={() => toggleCategory(categoryKey)}
                    className="w-full flex items-center justify-between p-3 bg-gray-700/30 hover:bg-gray-700/50 transition-colors rounded-t-lg"
                  >
                    <span className="text-sm font-medium text-white">{category.title}</span>
                    {expandedCategories[categoryKey] ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedCategories[categoryKey] && (
                    <div className="p-3 space-y-2 border-t border-gray-600/50">
                      {Object.entries(category.permissions).map(([permKey, permDesc]) => (
                        <PermissionCard
                          key={permKey}
                          permission={permDesc}
                          description={`Разрешение: ${permKey}`}
                          category={categoryKey}
                          enabled={permissions[permKey] || false}
                          onChange={(enabled) => togglePermission(permKey, enabled)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={!roleName.trim()}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50"
          >
            {isCreateMode ? 'Создать роль' : 'Сохранить изменения'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserPermissions = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Супер-админ',
      description: 'Полный доступ ко всем функциям системы',
      active: true,
      userCount: 2,
      permissionCount: 24,
      createdAt: '01.01.2025',
      permissions: {}
    },
    {
      id: 2,
      name: 'Модератор',
      description: 'Модерация контента и управление пользователями',
      active: true,
      userCount: 8,
      permissionCount: 12,
      createdAt: '15.01.2025',
      permissions: {}
    },
    {
      id: 3,
      name: 'Менеджер',
      description: 'Управление вакансиями и клиентами',
      active: true,
      userCount: 15,
      permissionCount: 8,
      createdAt: '20.01.2025',
      permissions: {}
    },
    {
      id: 4,
      name: 'Аналитик',
      description: 'Доступ к аналитике и отчетам',
      active: false,
      userCount: 3,
      permissionCount: 6,
      createdAt: '25.01.2025',
      permissions: {}
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Алексей Иванов',
      email: 'alex@workplus.kz',
      role: 'Супер-админ',
      status: 'active',
      lastLogin: '2 часа назад'
    },
    {
      id: 2,
      name: 'Мария Петрова',
      email: 'maria@workplus.kz',
      role: 'Модератор',
      status: 'active',
      lastLogin: '1 день назад'
    },
    {
      id: 3,
      name: 'Дмитрий Сидоров',
      email: 'dmitry@workplus.kz',
      role: 'Менеджер',
      status: 'suspended',
      lastLogin: '5 дней назад'
    },
    {
      id: 4,
      name: 'Анна Козлова',
      email: 'anna@workplus.kz',
      role: 'Аналитик',
      status: 'pending',
      lastLogin: 'Никогда'
    },
    {
      id: 5,
      name: 'Сергей Волков',
      email: 'sergey@workplus.kz',
      role: 'Менеджер',
      status: 'active',
      lastLogin: '3 часа назад'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsCreateMode(true);
    setIsRoleModalOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsCreateMode(false);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = (roleData) => {
    if (isCreateMode) {
      setRoles(prev => [...prev, roleData]);
    } else {
      setRoles(prev => prev.map(role => 
        role.id === roleData.id ? roleData : role
      ));
    }
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleDeleteRole = (role) => {
    if (role.userCount > 0) {
      alert('Невозможно удалить роль с назначенными пользователями');
      return;
    }
    setRoles(prev => prev.filter(r => r.id !== role.id));
  };

  const handleChangeUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleToggleUser = (user) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
        : u
    ));
  };

  const activeRoles = roles.filter(role => role.active).length;
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Роли и разрешения</h1>
              <p className="mt-1 text-sm text-gray-300">
                Управление ролями пользователей и их разрешениями
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              {saveStatus && (
                <div className={`flex items-center px-3 py-1 rounded-lg text-sm ${
                  saveStatus === 'success' 
                    ? 'bg-green-500/20 border border-green-400/30 text-green-400'
                    : 'bg-red-500/20 border border-red-400/30 text-red-400'
                }`}>
                  {saveStatus === 'success' ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-2" />
                  )}
                  {saveStatus === 'success' ? 'Сохранено' : 'Ошибка'}
                </div>
              )}
              <button
                onClick={handleCreateRole}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать роль
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{activeRoles}</h3>
                <p className="text-sm text-gray-400">Активных ролей</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{activeUsers}</h3>
                <p className="text-sm text-gray-400">Активных пользователей</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center">
              <Key className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
                <p className="text-sm text-gray-400">Всего пользователей</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setSelectedTab('roles')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'roles'
                  ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Роли
            </button>
            <button
              onClick={() => setSelectedTab('users')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'users'
                  ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Пользователи
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={selectedTab === 'roles' ? 'Поиск ролей...' : 'Поиск пользователей...'}
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400 transition-colors w-64"
              />
            </div>
            <button className="p-2 bg-gray-700/50 border border-gray-600/50 text-gray-400 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {selectedTab === 'roles' ? (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              Управление ролями ({filteredRoles.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRoles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={handleEditRole}
                  onDelete={handleDeleteRole}
                  onToggle={() => console.log('Toggle role')}
                  onViewUsers={() => console.log('View users')}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              Управление пользователями ({filteredUsers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={() => console.log('Edit user')}
                  onToggle={handleToggleUser}
                  onChangeRole={handleChangeUserRole}
                  availableRoles={roles}
                />
              ))}
            </div>
          </div>
        )}

        {/* Activity Log */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6">
          <div className="flex items-center mb-6">
            <Clock className="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-white">Журнал активности</h3>
              <p className="text-sm text-gray-400 mt-1">
                Последние изменения ролей и разрешений
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                action: 'Создана новая роль "Менеджер по найму"',
                user: 'Алексей Иванов',
                time: '2 часа назад',
                type: 'create'
              },
              {
                action: 'Изменены разрешения роли "Модератор"',
                user: 'Мария Петрова', 
                time: '4 часа назад',
                type: 'update'
              },
              {
                action: 'Заблокирован пользователь Дмитрий Сидоров',
                user: 'Алексей Иванов',
                time: '1 день назад',
                type: 'suspend'
              },
              {
                action: 'Назначена роль "Аналитик" пользователю Анна Козлова',
                user: 'Мария Петрова',
                time: '2 дня назад',
                type: 'assign'
              }
            ].map((activity, index) => {
              const getActivityIcon = (type) => {
                switch(type) {
                  case 'create': return <Plus className="w-4 h-4 text-green-400" />;
                  case 'update': return <Edit3 className="w-4 h-4 text-yellow-400" />;
                  case 'suspend': return <Lock className="w-4 h-4 text-red-400" />;
                  case 'assign': return <UserCheck className="w-4 h-4 text-blue-400" />;
                  default: return <Clock className="w-4 h-4 text-gray-400" />;
                }
              };

              return (
                <div key={index} className="flex items-center p-3 bg-gray-700/30 rounded-lg">
                  <div className="p-2 bg-gray-600/50 rounded-lg mr-4">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Role Modal */}
      <RoleModal
        role={selectedRole}
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSave={handleSaveRole}
        isCreateMode={isCreateMode}
      />
    </div>
  );
};

export default UserPermissions;