// src/components/api/CandidateService.js
import { apiRequest } from "./AuthUtils";

// Профиль
export async function getProfile() {
  const res = await apiRequest(`/api/profile/`, { method: "GET" });
  if (!res.ok) throw new Error("Не удалось загрузить профиль");
  return res.json();
}

export async function updateProfile(data) {
  const res = await apiRequest(`/api/profile/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Не удалось сохранить профиль");
  }
  return res.json();
}

// Мои отклики
export async function getApplications({ page = 1, perPage = 20, status } = {}) {
  const qs = new URLSearchParams({ page, per_page: perPage, ...(status ? { status } : {}) });
  const res = await apiRequest(`/api/profile/applications?${qs.toString()}`, { method: "GET" });
  if (!res.ok) throw new Error("Не удалось загрузить отклики");
  return res.json(); // { applications: [], pagination: {...} }
}

export async function withdrawApplication(id) {
  const res = await apiRequest(`/api/profile/applications/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Не удалось отозвать заявку");
  }
  return res.json();
}

// Отклики компаний на резюме
export async function getResumeResponses() {
  const res = await apiRequest(`/api/profile/resume-responses`, { method: "GET" });
  if (!res.ok) throw new Error("Не удалось загрузить отклики на резюме");
  return res.json(); // { responses: [] }
}

// Резюме upload
export async function uploadResume(file) {
  const form = new FormData();
  form.append("resume", file);
  const res = await apiRequest(`/api/profile/resume`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Ошибка загрузки резюме");
  }
  return res.json(); // { message, resume_file }
}

// Экспорт данных профиля (если используете кнопку экспорта JSON)
export async function exportProfile() {
  const res = await apiRequest(`/api/profile/export`, { method: "GET" });
  if (!res.ok) throw new Error("Не удалось экспортировать профиль");
  return res; // обработка blob на стороне вызывающего, если нужно
}

export async function profileById(userId) {
  const res = await apiRequest(`/api/profile/${userId}`, { method: "GET" });
  if (!res.ok) throw new Error("Не удалось загрузить профиль по ID");
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  // console.log("profileById response:", data);
  return data;
}