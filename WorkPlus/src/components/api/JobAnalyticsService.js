import { apiRequest } from "./AuthUtils";

export const getAnalyticsSummary = (range="30d", startDate, endDate) => {
  let url = `/api/admin/job_analytics/summary?range=${range}`;
  if (range === "custom") {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }
  return apiRequest(url, { method: "GET" }).then(res => res.json());
};

export const getViewsData = (range="30d") =>
  apiRequest(`/api/admin/job_analytics/views?range=${range}`, { method: "GET" }).then(res => res.json());

export const getCategories = (range="30d") =>
  apiRequest(`/api/admin/job_analytics/categories?range=${range}`, { method: "GET" }).then(res => res.json());

export const getLocations = (range="30d") =>
  apiRequest(`/api/admin/job_analytics/locations?range=${range}`, { method: "GET" }).then(res => res.json());

export const getTopJobs = (range="30d") =>
  apiRequest(`/api/admin/job_analytics/top_jobs?range=${range}`, { method: "GET" }).then(res => res.json());
