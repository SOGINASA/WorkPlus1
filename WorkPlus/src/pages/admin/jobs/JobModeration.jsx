import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageCircle,
  Flag,
  Calendar,
  MapPin,
} from "lucide-react";

import {
  getPendingJobs,
  getJobStats,
  approveJob,
  rejectJob,
  getJobById,
} from "../../../components/api/JobService";

const JobModeration = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [moderationComment, setModerationComment] = useState("");
  const [stats, setStats] = useState({
    pending: 0,
    flagged: 0,
    approved_today: 0,
    rejected_today: 0,
  });
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobIdFromUrl = searchParams.get("id");

  // Загрузка списка + статистики + конкретной вакансии, если задан id
  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsData, statsData] = await Promise.all([
        getPendingJobs(),
        getJobStats(),
      ]);
      setJobs(jobsData);
      setStats(statsData);

      if (jobIdFromUrl) {
        try {
          const jobData = await getJobById(jobIdFromUrl);
          setSelectedJob(jobData);
        } catch (err) {
          console.warn("Не удалось загрузить вакансию по id:", jobIdFromUrl);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [jobIdFromUrl]);

  const getPriorityBadge = (priority) => {
    const config = {
      high: { bg: "bg-red-500/10", text: "text-red-400", label: "Высокий" },
      normal: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Обычный" },
      low: { bg: "bg-gray-500/10", text: "text-gray-400", label: "Низкий" },
    };

    const { bg, text, label } = config[priority] || config.normal;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} border border-current/20`}
      >
        {label}
      </span>
    );
  };

  const handleApprove = async (jobId) => {
    try {
      await approveJob(jobId);
      alert(`Вакансия ${jobId} одобрена`);
      loadData();
      setSelectedJob(null);
      navigate("/admin/jobs/moderation"); // убираем ?id после действия
    } catch (err) {
      alert("Ошибка при одобрении вакансии");
    }
  };

  const handleReject = async (jobId) => {
    if (!moderationComment.trim()) {
      alert("Укажите причину отклонения");
      return;
    }
    try {
      await rejectJob(jobId, moderationComment);
      alert(`Вакансия ${jobId} отклонена`);
      setModerationComment("");
      loadData();
      setSelectedJob(null);
      navigate("/admin/jobs/moderation"); // убираем ?id после действия
    } catch (err) {
      alert("Ошибка при отклонении вакансии");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("ru-RU") +
      " " +
      date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Модерация вакансий</h1>
          <p className="text-gray-300">
            Проверка и одобрение вакансий перед публикацией
          </p>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<Clock className="w-6 h-6 text-yellow-400" />} label="В очереди" value={stats.pending} color="yellow" />
        <StatCard icon={<Flag className="w-6 h-6 text-red-400" />} label="С флагами" value={stats.flagged} color="red" />
        <StatCard icon={<CheckCircle className="w-6 h-6 text-green-400" />} label="Одобрено сегодня" value={stats.approved_today} color="green" />
        <StatCard icon={<XCircle className="w-6 h-6 text-red-400" />} label="Отклонено сегодня" value={stats.rejected_today} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-yellow-400/20 rounded-lg">
            <div className="p-4 border-b border-gray-700/50">
              <h2 className="text-lg font-semibold text-white">
                Очередь модерации
              </h2>
            </div>
            <div className="divide-y divide-gray-700/50">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${
                    selectedJob?.id === job.id
                      ? "bg-yellow-400/10 border-r-2 border-yellow-400"
                      : ""
                  }`}
                  onClick={() => {
                    navigate(`/admin/jobs/moderation?id=${job.id}`);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">
                        {job.company?.name}
                      </p>
                    </div>
                    {getPriorityBadge(
                      job.is_urgent ? "high" : job.is_featured ? "normal" : "low"
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{job.location?.city || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {formatDate(job.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Детали */}
        <div className="lg:col-span-2">
          {selectedJob ? (
            <div className="bg-white/5 border border-yellow-400/20 rounded-lg">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-bold text-white">
                  {selectedJob.title}
                </h2>
                <p className="text-gray-300 mt-1">
                  {selectedJob.company?.name}
                </p>
              </div>

              <div className="p-6">
                {/* Описание */}
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3">Описание</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Комментарий */}
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3">
                    Комментарий модератора
                  </h3>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    rows={3}
                    placeholder="Укажите причину отклонения..."
                    value={moderationComment}
                    onChange={(e) => setModerationComment(e.target.value)}
                  />
                </div>

                {/* Действия */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                      <Eye className="w-4 h-4 mr-1" />
                      Предпросмотр
                    </button>
                    <button className="flex items-center text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Связаться
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleReject(selectedJob.id)}
                      className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Отклонить
                    </button>
                    <button
                      onClick={() => handleApprove(selectedJob.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Одобрить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-yellow-400/20 rounded-lg p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Выберите вакансию для проверки
              </h3>
              <p className="text-gray-300">
                Выберите вакансию из списка слева для детального просмотра
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Вспомогательная карточка для статистики
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white/5 p-6 rounded-lg border border-yellow-400/20">
    <div className="flex items-center">
      <div
        className={`w-12 h-12 bg-${color}-500/10 border border-${color}-500/20 rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-300">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default JobModeration;
