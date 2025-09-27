// src/components/api/JobTemplateService.js
import { apiRequest } from "./AuthUtils";

// Получение всех шаблонов
export const getJobTemplates = async () => {
  const response = await apiRequest(`/api/job-templates/`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка получения шаблонов вакансий");
  return response.json();
};

// Получение одного шаблона
export const getJobTemplate = async (id) => {
  const response = await apiRequest(`/api/job-templates/${id}`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка получения шаблона");
  return response.json();
};

// Создание нового шаблона
export const createJobTemplate = async (data) => {
  const response = await apiRequest(`/api/job-templates/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка создания шаблона");
  return response.json();
};

// Редактирование шаблона
export const updateJobTemplate = async (id, data) => {
  const response = await apiRequest(`/api/job-templates/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления шаблона");
  return response.json();
};

// Удаление шаблона
export const deleteJobTemplate = async (id) => {
  const response = await apiRequest(`/api/job-templates/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Ошибка удаления шаблона");
  return response.json();
};

// Создание вакансии из шаблона
export const createJobFromTemplate = async (id, data = {}) => {
  const response = await apiRequest(`/api/job-templates/${id}/use`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка создания вакансии из шаблона");
  return response.json();
};
