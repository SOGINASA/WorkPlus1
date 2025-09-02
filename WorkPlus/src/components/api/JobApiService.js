// src/components/api/JobApiService.js
import { apiRequest } from './AuthUtils';

class JobApiService {
  // === ПУБЛИЧНЫЕ МЕТОДЫ (без авторизации) ===
  
  static async getJobs(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/jobs?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Ошибка загрузки вакансий');
    }
    
    return await response.json();
  }

  static async getJobDetail(jobId) {
    const response = await apiRequest(`/api/jobs/${jobId}`);
    
    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки вакансии');
    }
    
    return await response.json();
  }

  // === КОМПАНИИ ===
  
  static async getCompanies(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const queryString = queryParams.toString();
      const response = await apiRequest(`/api/companies/${queryString ? `?${queryString}` : ''}`);


      if (!response || !response.ok) {
        // Если backend недоступен, возвращаем мок данные
        console.warn('Backend недоступен, используем мок данные');
        return {
          companies: [
            { id: 1, name: 'ТОО "Пример Компания"', city: 'Петропавловск', industry: 'IT' },
            { id: 2, name: 'Kaspi.kz', city: 'Алматы', industry: 'Финтех' },
            { id: 3, name: 'Beeline Kazakhstan', city: 'Алматы', industry: 'Телеком' }
          ]
        };
      }

      return await response.json();
    } catch (error) {
      // В случае сетевой ошибки возвращаем мок
      console.warn('Сетевая ошибка, используем мок данные:', error.message);
      return {
        companies: [
          { id: 1, name: 'ТОО "Пример Компания"', city: 'Петропавловск', industry: 'IT' },
          { id: 2, name: 'Kaspi.kz', city: 'Алматы', industry: 'Финтех' },
          { id: 3, name: 'Beeline Kazakhstan', city: 'Алматы', industry: 'Телеком' }
        ]
      };
    }
  }

  // === МЕТОДЫ ДЛЯ РАБОТОДАТЕЛЕЙ ===
  
  static async createJob(jobData) {
    try {
      const response = await apiRequest('/api/employer/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData)
      });

      if (!response || !response.ok) {
        // Если backend недоступен, имитируем успешное создание
        console.warn('Backend недоступен, имитируем создание вакансии');
        return {
          message: 'Вакансия успешно создана (мок режим)',
          job: {
            id: Math.floor(Math.random() * 1000),
            ...jobData,
            created_at: new Date().toISOString()
          }
        };
      }

      return await response.json();
    } catch (error) {
      // В случае сетевой ошибки имитируем успех
      console.warn('Сетевая ошибка при создании вакансии, используем мок:', error.message);
      return {
        message: 'Вакансия успешно создана (мок режим)',
        job: {
          id: Math.floor(Math.random() * 1000),
          ...jobData,
          created_at: new Date().toISOString()
        }
      };
    }
  }

  static async getEmployerJobs(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await apiRequest(`/api/employer/jobs?${queryParams}`);

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки вакансий');
    }

    return await response.json();
  }

  static async updateJob(jobId, jobData) {
    const response = await apiRequest(`/api/employer/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления вакансии');
    }

    return await response.json();
  }

  static async deleteJob(jobId) {
    const response = await apiRequest(`/api/employer/jobs/${jobId}`, {
      method: 'DELETE'
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка удаления вакансии');
    }

    return await response.json();
  }

  static async getJobApplications(jobId, params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await apiRequest(`/api/employer/jobs/${jobId}/applications?${queryParams}`);

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки заявок');
    }

    return await response.json();
  }

  static async updateApplicationStatus(applicationId, statusData) {
    const response = await apiRequest(`/api/employer/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(statusData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления заявки');
    }

    return await response.json();
  }

  static async getEmployerDashboard() {
    const response = await apiRequest('/api/employer/dashboard');

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки дашборда');
    }

    return await response.json();
  }

  // === КОМПАНИИ ===
  
  static async getCompanies(params = {}) {
    const queryParams = new URLSearchParams(params);
    const queryString = queryParams.toString();
    const response = await apiRequest(`/api/companies/${queryString ? `?${queryString}` : ''}`);


    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки компаний');
    }

    return await response.json();
  }

  static async getCompanyDetail(companyId) {
    const response = await apiRequest(`/api/companies/${companyId}`);

    if (!response || !response.ok) {
      throw new Error('Ошибка загрузки компании');
    }

    return await response.json();
  }

  static async createCompany(companyData) {
    const response = await apiRequest('/api/companies', {
      method: 'POST',
      body: JSON.stringify(companyData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка создания компании');
    }

    return await response.json();
  }

  static async updateCompany(companyId, companyData) {
    const response = await apiRequest(`/api/companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify(companyData)
    });

    if (!response || !response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления компании');
    }

    return await response.json();
  }
}

export default JobApiService;