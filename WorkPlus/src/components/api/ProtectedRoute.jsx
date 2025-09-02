// src/components/api/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from './AuthUtils';
import { X, AlertCircle } from 'lucide-react';

// Компонент для защиты маршрутов с проверкой типа пользователя
export const RoleBasedRoute = ({ 
  children, 
  requiredUserType = null,
  fallbackPath = '/login',
  showError = true 
}) => {
  const { user, loading } = useAuth();

  // Показываем загрузку
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован
  if (!user) {
    if (showError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Необходима авторизация</h2>
            <p className="text-gray-300 mb-6">
              Для доступа к этой странице необходимо войти в систему
            </p>
            <button
              onClick={() => window.location.href = fallbackPath}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
            >
              Войти в систему
            </button>
          </div>
        </div>
      );
    } else {
      // Тихое перенаправление без показа ошибки
      window.location.href = fallbackPath;
      return null;
    }
  }

  // Проверка типа пользователя, если указан
  if (requiredUserType && user.user_type !== requiredUserType) {
    const userTypeNames = {
      'employer': 'работодателей',
      'candidate': 'соискателей', 
      'admin': 'администраторов'
    };

    const requiredTypeName = userTypeNames[requiredUserType] || requiredUserType;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Доступ запрещен</h2>
          <p className="text-gray-300 mb-6">
            Эта страница доступна только для {requiredTypeName}
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Вернуться назад
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Если все проверки пройдены, отображаем контент
  return children;
};

// HOC для оборачивания компонентов с проверкой роли
export const withAuth = (WrappedComponent, requiredUserType = null) => {
  return function AuthenticatedComponent(props) {
    return (
      <RoleBasedRoute requiredUserType={requiredUserType}>
        <WrappedComponent {...props} />
      </RoleBasedRoute>
    );
  };
};

// Специализированные компоненты для разных типов пользователей
export const EmployerRoute = ({ children }) => (
  <RoleBasedRoute requiredUserType="employer">
    {children}
  </RoleBasedRoute>
);

export const CandidateRoute = ({ children }) => (
  <RoleBasedRoute requiredUserType="candidate">
    {children}
  </RoleBasedRoute>
);

export const AdminRoute = ({ children }) => (
  <RoleBasedRoute requiredUserType="admin">
    {children}
  </RoleBasedRoute>
);

// Хук для проверки прав доступа
export const usePermissions = () => {
  const { user } = useAuth();

  return {
    isEmployer: user?.user_type === 'employer',
    isCandidate: user?.user_type === 'candidate', 
    isAdmin: user?.user_type === 'admin',
    canCreateJobs: user?.user_type === 'employer',
    canApplyForJobs: user?.user_type === 'candidate',
    canManageUsers: user?.user_type === 'admin',
    hasCompany: user?.user_type === 'employer' && user?.company_id,
    isVerified: user?.is_verified === true,
    userType: user?.user_type
  };
};