// src/components/api/UserService.js
import { apiRequest } from "./AuthUtils";

// Получение списка пользователей
export const getUsers = async ({ search = "", role = "all", status = "all", page = 1, perPage = 20 }) => {
  const params = new URLSearchParams({ search, role, status, page, per_page: perPage });
  const response = await apiRequest(`/api/admin/user_list/?${params.toString()}`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка получения пользователей");
  return response.json();
};

// Получение статистики
export const getUserStats = async () => {
  const response = await apiRequest(`/api/admin/user_list/stats`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка получения статистики");
  return response.json();
};

// Обновление пользователя
export const updateUser = async (id, data) => {
  const response = await apiRequest(`/api/admin/user_list/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления пользователя");
  return response.json();
};

// Массовое обновление
export const bulkUpdateUsers = async (ids, action) => {
  const response = await apiRequest(`/api/admin/user_list/bulk`, {
    method: "PATCH",
    body: JSON.stringify({ ids, action }),
  });
  if (!response.ok) throw new Error("Ошибка массового обновления");
  return response.json();
};

// Экспорт в CSV
export const exportUsers = async () => {
  const response = await apiRequest(`/api/admin/user_list/export`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка экспорта");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

  // Получение списка кандидатов
export const getCandidates = async ({ search = "", status = "all", page = 1, perPage = 20 }) => {
  const params = new URLSearchParams({ search, type: "candidate", status, page, per_page: perPage });
  const response = await apiRequest(`/api/admin/users?${params.toString()}`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка получения кандидатов");
  return response.json();
};

// Получить профиль пользователя (с учетом типа)
export const getUser = async (id) => {
  const response = await apiRequest(`/api/admin/user_profile/${id}`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка загрузки пользователя");
  return response.json();
};

// Обновить данные кандидата
export const updateCandidateProfile = async (id, data) => {
  const response = await apiRequest(`/api/admin/user_profile/${id}/candidate`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления профиля кандидата");
  return response.json();
};

// Обновить данные работодателя
export const updateEmployerProfile = async (id, data) => {
  const response = await apiRequest(`/api/admin/user_profile/${id}/employer`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления профиля работодателя");
  return response.json();
};
