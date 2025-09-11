// src/components/api/AuthUtils.js
import React, { useState, useEffect, useContext, createContext } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export { API_BASE_URL };

// Получение токенов из localStorage
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

// Сохранение токенов
export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

// Удаление токенов (logout)
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// Функции для работы с пользователем
export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Ошибка при чтении пользователя из localStorage:', error);
    return null;
  }
};

export const saveUserToStorage = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Ошибка при сохранении пользователя в localStorage:', error);
  }
};

// Проверка, истек ли токен
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// Обновление access token через refresh token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('Нет refresh token');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Не удалось обновить токен');
    }

    const data = await response.json();
    
    // Сохраняем новый access token
    saveTokens(data.access_token);
    
    return data.access_token;
  } catch (error) {
    // Если refresh token тоже недействительный, очищаем все токены
    clearTokens();
    throw error;
  }
};

// Функция для выполнения API запросов с автообновлением токена
export const apiRequest = async (url, options = {}) => {
  let accessToken = getAccessToken();
  
  // Проверяем, не истек ли access token
  if (isTokenExpired(accessToken)) {
    try {
      accessToken = await refreshAccessToken();
    } catch (error) {
      // Если нет refresh токена, не перенаправляем сразу
      if (!getRefreshToken()) {
        console.warn('Нет токенов для аутентификации');
        return null;
      }
      // Перенаправляем на страницу входа только если refresh тоже не работает
      window.location.href = '/login';
      return null;
    }
  }

  try {
    // Выполняем запрос с актуальным токеном
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // Если получили 401, пробуем обновить токен и повторить запрос
    if (response.status === 401) {
      try {
        accessToken = await refreshAccessToken();
        
        // Повторяем запрос с новым токеном
        return fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers
          }
        });
      } catch (error) {
        console.warn('Не удалось обновить токен, возможно сервер недоступен');
        return null;
      }
    }

    return response;
  } catch (error) {
    console.warn('Ошибка сетевого запроса:', error.message);
    return null;
  }
};

// React Context для аутентификации
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверка аутентификации при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      const storedUser = getUserFromStorage();
      
      // Если нет токенов, просто завершаем загрузку
      if (!accessToken && !refreshToken) {
        setLoading(false);
        return;
      }

      // Если есть пользователь в localStorage, показываем его сразу
      if (storedUser) {
        setUser(storedUser);
      }

      // Только если есть access token, пробуем проверить на сервере
      if (accessToken && !isTokenExpired(accessToken)) {
        try {
          // Проверяем валидность токена, запросив профиль пользователя
          const response = await apiRequest('/api/auth/me'); // Исправлен эндпоинт
          
          if (response && response.ok) {
            const userData = await response.json();
            setUser(userData.user); // Обратите внимание на .user
            saveUserToStorage(userData.user);
          }
        } catch (error) {
          console.warn('Не удалось проверить токен на сервере, используем локальные данные:', error.message);
          // Не очищаем токены если сервер просто недоступен
          // clearTokens();
          // setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Функция входа
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка входа');
      }

      const data = await response.json();
      
      // Сохраняем токены и пользователя
      saveTokens(data.access_token, data.refresh_token);
      saveUserToStorage(data.user);
      setUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Функция регистрации
  const register = async (registrationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка регистрации');
      }

      const data = await response.json();
      
      // Сохраняем токены и пользователя
      saveTokens(data.access_token, data.refresh_token);
      saveUserToStorage(data.user);
      setUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  };


  // Функция выхода
  const logout = () => {
    clearTokens();
    setUser(null);
    window.location.href = '/login';
  };

  // Проверка, аутентифицирован ли пользователь
  const isAuthenticated = () => {
    return user !== null && getAccessToken() !== null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

// Компонент для защиты маршрутов с проверкой типа пользователя
export const ProtectedRoute = ({ children, allowedTypes }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  // Проверка типа пользователя
  if (allowedTypes && !allowedTypes.includes(user.user_type)) {
    // Если тип пользователя не разрешён, перенаправляем в зависимости от роли
    if (user.user_type === 'admin') {
      window.location.href = '/admin';   // например, админку
    } else if (user.user_type === 'employer') {
      window.location.href = '/employer-profile'; // страница работодателя
    } else {
      window.location.href = '/candidate-profile';  // профиль обычного пользователя
    }
    return null;
  }

  return children;
};
