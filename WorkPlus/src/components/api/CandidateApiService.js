// CandidateApiService.js - API для работы с профилем и откликами кандидата
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Получить токен из localStorage
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Создать axios instance с токеном
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// ========== ПРОФИЛЬ ==========

/**
 * Получить профиль текущего пользователя
 */
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, createAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    throw error.response?.data || { error: 'Не удалось загрузить профиль' };
  }
};

/**
 * Обновить профиль
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(
      `${API_URL}/profile`,
      profileData,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    throw error.response?.data || { error: 'Не удалось обновить профиль' };
  }
};

/**
 * Получить статистику профиля
 */
export const getStatistics = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/profile/statistics`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    throw error.response?.data || { error: 'Не удалось загрузить статистику' };
  }
};

// ========== ОТКЛИКИ (APPLICATIONS) ==========

/**
 * Получить список откликов кандидата
 * @param {Object} params - Параметры запроса
 * @param {number} params.page - Номер страницы
 * @param {number} params.perPage - Количество на странице
 * @param {string} params.status - Фильтр по статусу (new, viewed, interview, hired, rejected)
 */
export const getApplications = async ({ page = 1, perPage = 20, status = '' } = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('per_page', perPage);
    if (status) {
      params.append('status', status);
    }

    const response = await axios.get(
      `${API_URL}/profile/applications?${params.toString()}`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении откликов:', error);
    throw error.response?.data || { error: 'Не удалось загрузить отклики' };
  }
};

/**
 * Отозвать отклик
 * @param {number} applicationId - ID отклика
 */
export const withdrawApplication = async (applicationId) => {
  try {
    const response = await axios.post(
      `${API_URL}/profile/applications/${applicationId}/withdraw`,
      {},
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при отзыве отклика:', error);
    throw error.response?.data || { error: 'Не удалось отозвать отклик' };
  }
};

/**
 * Получить отклики компаний на резюме
 */
export const getResumeResponses = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/profile/resume-responses`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении откликов компаний:', error);
    throw error.response?.data || { error: 'Не удалось загрузить отклики компаний' };
  }
};

// ========== ОБРАЗОВАНИЕ ==========

/**
 * Добавить образование
 */
export const addEducation = async (educationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/profile/education`,
      educationData,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении образования:', error);
    throw error.response?.data || { error: 'Не удалось добавить образование' };
  }
};

/**
 * Обновить образование
 */
export const updateEducation = async (educationId, educationData) => {
  try {
    const response = await axios.put(
      `${API_URL}/profile/education/${educationId}`,
      educationData,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении образования:', error);
    throw error.response?.data || { error: 'Не удалось обновить образование' };
  }
};

/**
 * Удалить образование
 */
export const deleteEducation = async (educationId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/profile/education/${educationId}`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении образования:', error);
    throw error.response?.data || { error: 'Не удалось удалить образование' };
  }
};

// ========== ОПЫТ РАБОТЫ ==========

/**
 * Добавить опыт работы
 */
export const addWorkExperience = async (experienceData) => {
  try {
    const response = await axios.post(
      `${API_URL}/profile/work-experience`,
      experienceData,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении опыта работы:', error);
    throw error.response?.data || { error: 'Не удалось добавить опыт работы' };
  }
};

/**
 * Обновить опыт работы
 */
export const updateWorkExperience = async (experienceId, experienceData) => {
  try {
    const response = await axios.put(
      `${API_URL}/profile/work-experience/${experienceId}`,
      experienceData,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении опыта работы:', error);
    throw error.response?.data || { error: 'Не удалось обновить опыт работы' };
  }
};

/**
 * Удалить опыт работы
 */
export const deleteWorkExperience = async (experienceId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/profile/work-experience/${experienceId}`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении опыта работы:', error);
    throw error.response?.data || { error: 'Не удалось удалить опыт работы' };
  }
};

// ========== НАВЫКИ ==========

/**
 * Добавить навык
 */
export const addSkill = async (skillData) => {
  try {
    const response = await axios.post(
      `${API_URL}/profile/skills`,
      skillData,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении навыка:', error);
    throw error.response?.data || { error: 'Не удалось добавить навык' };
  }
};

/**
 * Удалить навык
 */
export const deleteSkill = async (skillId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/profile/skills/${skillId}`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении навыка:', error);
    throw error.response?.data || { error: 'Не удалось удалить навык' };
  }
};

// ========== ЭКСПОРТ ДАННЫХ ==========

/**
 * Экспортировать данные профиля
 */
export const exportProfileData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/profile/export-data`,
      {
        ...createAuthHeaders(),
        responseType: 'blob'
      }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при экспорте данных:', error);
    throw error.response?.data || { error: 'Не удалось экспортировать данные' };
  }
};

export default {
  getProfile,
  updateProfile,
  getStatistics,
  getApplications,
  withdrawApplication,
  getResumeResponses,
  addEducation,
  updateEducation,
  deleteEducation,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  addSkill,
  deleteSkill,
  exportProfileData
};
