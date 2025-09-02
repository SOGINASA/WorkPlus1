// src/components/api/UserApiService.js
import { apiRequest } from './AuthUtils';

class UserApiService {
  // === ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ===
  
  static async getProfile() {
    const response = await apiRequest('/api/profile');

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки профиля');
    }

    return await response.json();
  }

  static async updateProfile(profileData) {
    const response = await apiRequest('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления профиля');
    }

    return await response.json();
  }

  static async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiRequest('/api/profile/avatar', {
      method: 'POST',
      body: formData,
      headers: {} // Убираем Content-Type для FormData
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка загрузки аватара');
    }

    return await response.json();
  }

  static async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await apiRequest('/api/profile/resume', {
      method: 'POST',
      body: formData,
      headers: {} // Убираем Content-Type для FormData
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка загрузки резюме');
    }

    return await response.json();
  }

  // === НАСТРОЙКИ УВЕДОМЛЕНИЙ ===
  
  static async getNotificationSettings() {
    const response = await apiRequest('/api/profile/notifications');

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки настроек уведомлений');
    }

    return await response.json();
  }

  static async updateNotificationSettings(settings) {
    const response = await apiRequest('/api/profile/notifications', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления настроек');
    }

    return await response.json();
  }

  // === СМЕНА ПАРОЛЯ ===
  
  static async changePassword(passwordData) {
    const response = await apiRequest('/api/profile/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка смены пароля');
    }

    return await response.json();
  }

  // === ВЕРИФИКАЦИЯ ===
  
  static async verifyEmail(token) {
    const response = await apiRequest('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token })
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка верификации email');
    }

    return await response.json();
  }

  static async resendVerificationEmail() {
    const response = await apiRequest('/api/auth/resend-verification', {
      method: 'POST'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка отправки письма верификации');
    }

    return await response.json();
  }

  static async verifyPhone(phoneData) {
    const response = await apiRequest('/api/profile/verify-phone', {
      method: 'POST',
      body: JSON.stringify(phoneData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка верификации телефона');
    }

    return await response.json();
  }

  // === СТАТИСТИКА ПРОФИЛЯ ===
  
  static async getProfileStats() {
    const response = await apiRequest('/api/profile/stats');

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки статистики');
    }

    return await response.json();
  }

  // === УДАЛЕНИЕ АККАУНТА ===
  
  static async deleteAccount(confirmationData) {
    const response = await apiRequest('/api/profile/delete', {
      method: 'DELETE',
      body: JSON.stringify(confirmationData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка удаления аккаунта');
    }

    return await response.json();
  }

  // === ЭКСПОРТ ДАННЫХ (GDPR) ===
  
  static async requestDataExport() {
    const response = await apiRequest('/api/profile/export-data', {
      method: 'POST'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка запроса экспорта данных');
    }

    return await response.json();
  }

  // === БЛОКИРОВКА КОМПАНИЙ/ПОЛЬЗОВАТЕЛЕЙ ===
  
  static async getBlockedCompanies() {
    const response = await apiRequest('/api/profile/blocked-companies');

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки списка заблокированных компаний');
    }

    return await response.json();
  }

  static async blockCompany(companyId) {
    const response = await apiRequest(`/api/profile/block-company/${companyId}`, {
      method: 'POST'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка блокировки компании');
    }

    return await response.json();
  }

  static async unblockCompany(companyId) {
    const response = await apiRequest(`/api/profile/unblock-company/${companyId}`, {
      method: 'DELETE'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка разблокировки компании');
    }

    return await response.json();
  }

  // === СОХРАНЕННЫЕ ВАКАНСИИ ===
  
  static async getSavedJobs(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await apiRequest(`/api/profile/saved-jobs?${queryParams}`);

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки сохраненных вакансий');
    }

    return await response.json();
  }

  static async saveJob(jobId) {
    const response = await apiRequest(`/api/profile/save-job/${jobId}`, {
      method: 'POST'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка сохранения вакансии');
    }

    return await response.json();
  }

  static async unsaveJob(jobId) {
    const response = await apiRequest(`/api/profile/unsave-job/${jobId}`, {
      method: 'DELETE'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка удаления из сохраненных');
    }

    return await response.json();
  }

  // === ПОДПИСКИ НА УВЕДОМЛЕНИЯ О ВАКАНСИЯХ ===
  
  static async getJobAlerts() {
    const response = await apiRequest('/api/profile/job-alerts');

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки подписок на вакансии');
    }

    return await response.json();
  }

  static async createJobAlert(alertData) {
    const response = await apiRequest('/api/profile/job-alerts', {
      method: 'POST',
      body: JSON.stringify(alertData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка создания подписки');
    }

    return await response.json();
  }

  static async updateJobAlert(alertId, alertData) {
    const response = await apiRequest(`/api/profile/job-alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify(alertData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления подписки');
    }

    return await response.json();
  }

  static async deleteJobAlert(alertId) {
    const response = await apiRequest(`/api/profile/job-alerts/${alertId}`, {
      method: 'DELETE'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка удаления подписки');
    }

    return await response.json();
  }
}

export default UserApiService;