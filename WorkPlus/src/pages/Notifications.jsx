import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MessageCircle, 
  Calendar, 
  Building, 
  User,
  Filter,
  Trash2,
  Settings,
  Loader,
  ChevronRight
} from 'lucide-react';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedType, setSelectedType] = useState('all'); // all, application, interview, rejection, etc.

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  // Типы уведомлений
  const notificationTypes = {
    'application_accepted': {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      title: 'Заявка принята',
      color: 'green'
    },
    'application_rejected': {
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      title: 'Заявка отклонена',
      color: 'red'
    },
    'interview_scheduled': {
      icon: <Calendar className="w-5 h-5 text-blue-400" />,
      title: 'Собеседование назначено',
      color: 'blue'
    },
    'interview_cancelled': {
      icon: <XCircle className="w-5 h-5 text-orange-400" />,
      title: 'Собеседование отменено',
      color: 'orange'
    },
    'profile_viewed': {
      icon: <Eye className="w-5 h-5 text-purple-400" />,
      title: 'Профиль просмотрен',
      color: 'purple'
    },
    'message_received': {
      icon: <MessageCircle className="w-5 h-5 text-cyan-400" />,
      title: 'Новое сообщение',
      color: 'cyan'
    },
    'job_match': {
      icon: <Building className="w-5 h-5 text-yellow-400" />,
      title: 'Подходящая вакансия',
      color: 'yellow'
    },
    'application_viewed': {
      icon: <Eye className="w-5 h-5 text-gray-400" />,
      title: 'Заявка просмотрена',
      color: 'gray'
    }
  };

  // Загрузка уведомлений
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const queryParams = new URLSearchParams();
      if (filter !== 'all') {
        queryParams.append('is_read', filter === 'read' ? 'true' : 'false');
      }
      if (selectedType !== 'all') {
        queryParams.append('type', selectedType);
      }

      const url = `${API_BASE_URL}/api/notifications${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке уведомлений');
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем уведомления при монтировании компонента
  useEffect(() => {
    fetchNotifications();
  }, [filter, selectedType]);

  // Отметить уведомление как прочитанное
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true }
              : notification
          )
        );
      }
    } catch (err) {
      console.error('Ошибка при отметке как прочитанное:', err);
    }
  };

  // Отметить все как прочитанные
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Все уведомления отмечены как прочитанные');
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, is_read: true }))
        );
      }
    } catch (err) {
      console.error('Ошибка при отметке всех как прочитанные:', err);
    }
  };

  // Удалить уведомление
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
      }
    } catch (err) {
      console.error('Ошибка при удалении уведомления:', err);
    }
  };

  // Клик по уведомлению
  const handleNotificationClick = async (notification) => {
    // Отмечаем как прочитанное
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Переходим на соответствующую страницу в зависимости от типа
    if (notification.job_id) {
      navigate(`/jobdetail?id=${notification.job_id}`);
    } else if (notification.type === 'message_received' && notification.chat_id) {
      navigate(`/messages?chat=${notification.chat_id}`);
    } else if (notification.type === 'profile_viewed') {
      navigate('/profile');
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays === 1) return '1 день назад';
    if (diffDays < 7) return `${diffDays} дня назад`;
    return date.toLocaleDateString('ru-RU');
  };

  // Получить цвет фона для типа уведомления
  const getNotificationBg = (type, isRead) => {
    const opacity = isRead ? '5' : '10';
    const colors = {
      green: `bg-green-400/${opacity}`,
      red: `bg-red-400/${opacity}`,
      blue: `bg-blue-400/${opacity}`,
      orange: `bg-orange-400/${opacity}`,
      purple: `bg-purple-400/${opacity}`,
      cyan: `bg-cyan-400/${opacity}`,
      yellow: `bg-yellow-400/${opacity}`,
      gray: `bg-gray-400/${opacity}`
    };
    
    return colors[notificationTypes[type]?.color] || `bg-white/${opacity}`;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-400/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Уведомления
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                {unreadCount > 0 ? `${unreadCount} непрочитанных уведомлений` : 'Все уведомления прочитаны'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-yellow-400/20 text-white rounded-lg hover:bg-yellow-400/10 hover:border-yellow-400/40 transition-all disabled:opacity-50 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Отметить все как прочитанные
              </button>
              <button
                onClick={() => navigate('/settings/notifications')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-gray-600 text-white rounded-lg hover:bg-white/10 transition-all text-sm"
              >
                <Settings className="w-4 h-4" />
                Настройки
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Статус</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="all">Все уведомления</option>
                  <option value="unread">Непрочитанные</option>
                  <option value="read">Прочитанные</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Тип</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="all">Все типы</option>
                  <option value="application_accepted">Заявки принятые</option>
                  <option value="application_rejected">Заявки отклоненные</option>
                  <option value="interview_scheduled">Собеседования</option>
                  <option value="profile_viewed">Просмотры профиля</option>
                  <option value="message_received">Сообщения</option>
                  <option value="job_match">Подходящие вакансии</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications List */}
      <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Notifications */}
          {!loading && !error && (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const typeInfo = notificationTypes[notification.type] || {
                  icon: <Bell className="w-5 h-5 text-gray-400" />,
                  title: 'Уведомление',
                  color: 'gray'
                };

                return (
                  <div
                    key={notification.id}
                    className={`${getNotificationBg(notification.type, notification.is_read)} backdrop-blur-sm border ${
                      notification.is_read ? 'border-white/10' : 'border-yellow-400/20'
                    } rounded-xl p-4 md:p-6 hover:border-yellow-400/30 transition-all group cursor-pointer`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${
                        notification.is_read ? 'opacity-60' : ''
                      }`}>
                        {typeInfo.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-base md:text-lg font-semibold ${
                                notification.is_read ? 'text-gray-300' : 'text-white'
                              }`}>
                                {typeInfo.title}
                              </h3>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              )}
                            </div>
                            <p className={`text-sm md:text-base ${
                              notification.is_read ? 'text-gray-400' : 'text-gray-300'
                            }`}>
                              {notification.message}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs md:text-sm text-gray-500">
                              {formatDate(notification.created_at)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>

                        {/* Additional info */}
                        {notification.job_title && (
                          <div className="flex items-center gap-2 text-sm text-yellow-400 mb-2">
                            <Building className="w-4 h-4" />
                            <span>{notification.job_title}</span>
                            {notification.company_name && (
                              <span className="text-gray-400">• {notification.company_name}</span>
                            )}
                          </div>
                        )}

                        {/* Action buttons */}
                        {notification.type === 'interview_scheduled' && notification.interview_date && (
                          <div className="flex items-center gap-2 text-sm text-blue-400">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(notification.interview_date).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Notifications */}
          {!loading && !error && notifications.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 border border-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === 'unread' ? 'Нет непрочитанных уведомлений' : 'Нет уведомлений'}
              </h3>
              <p className="text-gray-400">
                {filter === 'unread' 
                  ? 'Все уведомления прочитаны' 
                  : 'Уведомления появятся здесь, когда работодатели начнут взаимодействовать с вашим профилем'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!loading && !error && notifications.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Хотите получать больше предложений?
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Обновите свое резюме и увеличьте шансы на трудоустройство
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all"
              >
                Редактировать профиль
              </button>
              <button 
                onClick={() => navigate('/jobs')}
                className="border border-yellow-400/40 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-400/10 transition-all"
              >
                Найти вакансии
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NotificationsPage;