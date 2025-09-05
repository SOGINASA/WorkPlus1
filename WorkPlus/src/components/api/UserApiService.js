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
    // Функция отключена - используем инициалы
    throw new Error('Загрузка аватаров отключена. Используются инициалы.');
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

  // === ЗАЯВКИ НА ВАКАНСИИ ===
  
  static async getMyApplications(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await apiRequest(`/api/profile/applications?${queryParams}`);

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки заявок');
    }

    return await response.json();
  }

  static async withdrawApplication(applicationId) {
    const response = await apiRequest(`/api/profile/applications/${applicationId}`, {
      method: 'DELETE'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка отзыва заявки');
    }

    return await response.json();
  }

  // === ОТКЛИКИ НА РЕЗЮМЕ ===
  
  static async getResumeResponses(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await apiRequest(`/api/profile/resume-responses?${queryParams}`);

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки откликов на резюме');
    }

    return await response.json();
  }

  static async updateResumeResponseStatus(responseId, status) {
    const response = await apiRequest(`/api/profile/resume-responses/${responseId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления статуса отклика');
    }

    return await response.json();
  }

  // === СТАТИСТИКА ПРОФИЛЯ ===
  
  static async getProfileStatistics() {
    const response = await apiRequest('/api/profile/statistics');

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки статистики');
    }

    return await response.json();
  }

  // === СКАЧИВАНИЕ РЕЗЮМЕ ===
  
  static async downloadResume() {
    const response = await apiRequest('/api/profile/download-resume');

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка скачивания резюме');
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
      throw new Error(error.error || 'Ошибка обновления настроек уведомлений');
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
    const response = await apiRequest(`/api/profile/saved-jobs/${jobId}`, {
      method: 'POST'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка сохранения вакансии');
    }

    return await response.json();
  }

  static async unsaveJob(jobId) {
    const response = await apiRequest(`/api/profile/saved-jobs/${jobId}`, {
      method: 'DELETE'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка удаления вакансии из сохраненных');
    }

    return await response.json();
  }

  // === ПРОСМОТРЫ ПРОФИЛЯ ===
  
  static async getProfileViews(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await apiRequest(`/api/profile/views?${queryParams}`);

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки просмотров профиля');
    }

    return await response.json();
  }

  // === РЕКОМЕНДАЦИИ ВАКАНСИЙ ===
  
  static async getJobRecommendations(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await apiRequest(`/api/profile/job-recommendations?${queryParams}`);

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки рекомендаций вакансий');
    }

    return await response.json();
  }

  // === НАВЫКИ ===
  
  static async addSkill(skillData) {
    const response = await apiRequest('/api/profile/skills', {
      method: 'POST',
      body: JSON.stringify(skillData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка добавления навыка');
    }

    return await response.json();
  }

  static async updateSkill(skillId, skillData) {
    const response = await apiRequest(`/api/profile/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify(skillData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления навыка');
    }

    return await response.json();
  }

  static async deleteSkill(skillId) {
    const response = await apiRequest(`/api/profile/skills/${skillId}`, {
      method: 'DELETE'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка удаления навыка');
    }

    return await response.json();
  }

  // === ОБРАЗОВАНИЕ ===
  
  static async addEducation(educationData) {
    const response = await apiRequest('/api/profile/education', {
      method: 'POST',
      body: JSON.stringify(educationData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка добавления образования');
    }

    return await response.json();
  }

  static async updateEducation(educationId, educationData) {
    const response = await apiRequest(`/api/profile/education/${educationId}`, {
      method: 'PUT',
      body: JSON.stringify(educationData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления образования');
    }

    return await response.json();
  }

  static async deleteEducation(educationId) {
    const response = await apiRequest(`/api/profile/education/${educationId}`, {
      method: 'DELETE'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка удаления образования');
    }

    return await response.json();
  }

  // === ОПЫТ РАБОТЫ ===
  
  static async addWorkExperience(workData) {
    const response = await apiRequest('/api/profile/work-experience', {
      method: 'POST',
      body: JSON.stringify(workData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка добавления опыта работы');
    }

    return await response.json();
  }

  static async updateWorkExperience(workId, workData) {
    const response = await apiRequest(`/api/profile/work-experience/${workId}`, {
      method: 'PUT',
      body: JSON.stringify(workData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления опыта работы');
    }

    return await response.json();
  }

  static async deleteWorkExperience(workId) {
    const response = await apiRequest(`/api/profile/work-experience/${workId}`, {
      method: 'DELETE'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка удаления опыта работы');
    }

    return await response.json();
  }
}

export default UserApiService;