// src/components/api/JobService.js
import { apiRequest } from "./AuthUtils";

// Получение списка вакансий
export const getJobs = async ({ search = "", status = "all", page = 1, perPage = 20 }) => {
  const params = new URLSearchParams({ search, status, page: page.toString(), per_page: perPage.toString() });
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await apiRequest(`/api/admin/jobs/get_all${queryString}`, { method: "GET" });
  
  if (!response.ok) throw new Error("Ошибка получения вакансий");
  return response.json();
};

// Получение очереди на модерацию
export const getPendingJobs = async () => {
  const response = await apiRequest(`/api/admin/jobs/pending`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка получения очереди на модерацию");
  return response.json();
};

// Получение статистики модерации
export const getJobStats = async () => {
  const response = await apiRequest(`/api/admin/jobs/stats`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка получения статистики вакансий");
  return response.json();
};

// Получение деталей вакансии
export const getJobById = async (id) => {
  const response = await apiRequest(`/api/admin/jobs/${id}`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка получения деталей вакансии");
  return response.json();
};

// Одобрение вакансии
export const approveJob = async (id) => {
  const response = await apiRequest(`/api/admin/jobs/${id}/approve`, { method: "PATCH" });
  if (!response.ok) throw new Error("Ошибка при одобрении вакансии");
  return response.json();
};

// Отклонение вакансии
export const rejectJob = async (id, comment) => {
  const response = await apiRequest(`/api/admin/jobs/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ comment }),
  });
  if (!response.ok) throw new Error("Ошибка при отклонении вакансии");
  return response.json();
};

// Удаление (деактивация) вакансии
export const deleteJob = async (id) => {
  const response = await apiRequest(`/api/admin/jobs/${id}/delete`, { method: "PUT" });
  if (!response.ok) throw new Error("Ошибка удаления вакансии");
  const data = await response.json();
  console.log("Deleted job:", data);
  return data;
};

// Обновление вакансии
export const updateJob = async (id, data) => {
  const response = await apiRequest(`/api/admin/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления вакансии");
  return response.json();
};

export const createJob = async (data) => {
  const response = await apiRequest(`/api/jobs/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка при создании вакансии");
  return response.json();
};
