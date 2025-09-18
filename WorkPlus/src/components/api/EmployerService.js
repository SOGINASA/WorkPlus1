// src/components/api/EmployerService.js
import { apiRequest } from "./AuthUtils";

// Получение списка работодателей
export const getEmployers = async ({ search = "", subscription = "all", status = "all", page = 1, perPage = 20 }) => {
  const params = new URLSearchParams({ search, subscription, status, page, per_page: perPage });
  const response = await apiRequest(`/api/admin/employers/?${params.toString()}`, { method: "GET" });
  if (!response.ok) throw new Error("Ошибка получения работодателей");
  return response.json();
};

// Переключение блокировки / разблокировки
export const toggleEmployerBlock = async (id) => {
  const response = await apiRequest(`/api/admin/employers/${id}/toggle_block`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Ошибка при изменении статуса работодателя");
  return response.json();
};
