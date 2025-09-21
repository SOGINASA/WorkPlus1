import React, { useState, useEffect } from "react";
import {
  Search, Eye, Edit, Trash2, MoreHorizontal,
  CheckCircle, AlertCircle, Clock
} from "lucide-react";
import { getJobs, deleteJob } from "../../../components/api/JobService";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs({ search: searchTerm, status: filterStatus });
      console.log("Fetched jobs:", data);
      setJobs(data.jobs || []);

      // вычисляем статистику
      const total = data.total || (data.jobs ? data.jobs.length : 0);
      const approved = data.jobs.filter(j => j.moderation_status === "approved").length;
      const pending = data.jobs.filter(j => j.moderation_status === "pending").length;
      const rejected = data.jobs.filter(j => j.moderation_status === "rejected").length;
      setStats({ total, approved, pending, rejected });
    } catch (err) {
      console.error("Ошибка загрузки вакансий:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [searchTerm, filterStatus]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { bg: "bg-green-500/10", text: "text-green-400", icon: CheckCircle, label: "Активна" },
      pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", icon: Clock, label: "На модерации" },
      rejected: { bg: "bg-red-500/10", text: "text-red-400", icon: AlertCircle, label: "Отклонена" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border border-current/20`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return <div className="p-6 text-white">Загрузка вакансий...</div>;
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || job.moderation_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Список вакансий</h1>
        <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
          <MoreHorizontal className="w-4 h-4 mr-2" />
          Действия
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm text-gray-400">Всего вакансий</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm text-gray-400">Одобрено</h3>
          <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm text-gray-400">На модерации</h3>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm text-gray-400">Отклонено</h3>
          <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск вакансий..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-200"
          >
            <option value="all">Все</option>
            <option value="approved">Активные</option>
            <option value="pending">На модерации</option>
            <option value="rejected">Отклонённые</option>
          </select>
        </div>
      </div>

      {/* Таблица вакансий */}
            {/* Таблица вакансий */}
      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Вакансия</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Компания</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Город</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Зарплата</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Отклики / Просмотры</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Статус</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Дата создания</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-700">
                {/* Название */}
                <td className="px-6 py-4 font-medium">{job.title}</td>

                {/* Компания */}
                <td className="px-6 py-4">{job.company?.name || "—"}</td>

                {/* Город */}
                <td className="px-6 py-4">{job.location?.city || job.company?.city || "—"}</td>

                {/* Зарплата */}
                <td className="px-6 py-4">
                  {job.salary?.display || "Не указана"}
                </td>

                {/* Отклики / Просмотры */}
                <td className="px-6 py-4">
                  <span className="text-blue-400">{job.stats?.applications || 0}</span> /{" "}
                  <span className="text-gray-400">{job.stats?.views || 0}</span>
                </td>

                {/* Статус */}
                <td className="px-6 py-4">{getStatusBadge(job.moderation.status)}</td>

                {/* Дата создания */}
                <td className="px-6 py-4">
                  {job.created_at ? new Date(job.created_at).toLocaleDateString("ru-RU") : "—"}
                </td>

                {/* Действия */}
                <td className="px-6 py-4 text-right space-x-2">
                  {/* 👁 Просмотр */}
                  <button
                    className="p-2 hover:bg-gray-600 rounded-lg"
                    onClick={() => window.location.href = `/admin/jobs/moderation?id=${job.id}`}
                  >
                    <Eye className="w-4 h-4 text-blue-400" />
                  </button>

                  {/* ✏️ Редактировать
                  <button
                    className="p-2 hover:bg-gray-600 rounded-lg"
                    onClick={() => window.location.href = `/admin/jobs/${job.id}`}
                  >
                    <Edit className="w-4 h-4 text-yellow-400" />
                  </button> */}

                  {/* 🗑 Удалить */}
                  <button
                    className="p-2 hover:bg-gray-600 rounded-lg"
                    onClick={async () => {
                      if (window.confirm("Удалить вакансию?")) {
                        await deleteJob(job.id);
                        loadJobs();
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobList;
