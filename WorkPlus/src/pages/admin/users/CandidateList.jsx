import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  MoreHorizontal,
  Eye,
  Ban,
  Mail,
  MapPin,
  GraduationCap,
  Download,
} from "lucide-react";
import { apiRequest } from "components/api/AuthUtils";

const CandidateList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const statuses = [
    { value: "all", label: "Все статусы" },
    { value: "active", label: "Активные" },
    { value: "blocked", label: "Заблокированные" },
  ];

  // Загружаем кандидатов
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          type: "candidate",
          status: selectedStatus,
          search: searchQuery,
          page,
          per_page: perPage,
        });
        const res = await apiRequest(`/api/admin/users?${queryParams.toString()}`);
        if (res && res.ok) {
          const data = await res.json();
          console.log("Полученные данные кандидатов:", data);
          setCandidates(data.users || []);
          setTotalPages(data.pagination.pages || 1);
          setTotalCount(data.pagination.total || 0);
        }
      } catch (error) {
        console.error("Ошибка загрузки кандидатов:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [searchQuery, selectedStatus, page]);

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map((cand) => cand.id));
    }
  };

  const blockCandidate = async (id) => {
    try {
      const res = await apiRequest(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res && res.ok) {
        // После блокировки обновляем список кандидатов
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, status: "blocked" } : c
          )
        );
      }
    } catch (error) {
      console.error("Ошибка блокировки кандидата:", error);
    }
  };

  if (loading) {
    return <div className="p-6 text-white text-lg">Загрузка кандидатов...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Соискатели
          </h1>
          <p className="text-gray-400">База кандидатов и управление резюме</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <button className="flex items-center px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-gray-300 hover:bg-white/10 transition-all text-sm">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </button> */}
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm">
            <User className="w-4 h-4 mr-2" />
            Добавить кандидата
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Поиск по имени, email или городу..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={
                      selectedCandidates.length === candidates.length &&
                      candidates.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">Кандидат</th>
                <th className="text-left p-4 text-gray-300 font-medium">Образование</th>
                <th className="text-left p-4 text-gray-300 font-medium">Статус</th>
                <th className="text-left p-4 text-gray-300 font-medium">Опыт</th>
                <th className="text-left p-4 text-gray-300 font-medium">Навыки</th>
                <th className="text-left p-4 text-gray-300 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-white/5 transition-all">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => toggleCandidateSelection(candidate.id)}
                      className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-medium text-sm">
                          {candidate.name?.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-medium">{candidate.name}</div>
                        <div className="text-gray-400 text-sm">
                          {candidate.age ? `${candidate.age} лет` : "Возраст не указан"}
                        </div>
                        <div className="flex items-center mt-1 space-x-3">
                          {candidate.email && (
                            <div className="flex items-center text-gray-400 text-xs">
                              <Mail className="w-3 h-3 mr-1" />
                              {candidate.email}
                            </div>
                          )}
                          {candidate.location && (
                            <div className="flex items-center text-gray-400 text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {candidate.location}
                            </div>
                          )}
                        </div>
                        {candidate.education && (
                          <div className="flex items-center text-gray-500 text-xs mt-1">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {candidate.education}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white">
                    {candidate.education || "Образование не указано"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        candidate.status === "active"
                          ? "text-green-400 bg-green-400/10 border-green-400/20"
                          : "text-red-400 bg-red-400/10 border-red-400/20"
                      }`}
                    >
                      {candidate.status === "active" ? "Активен" : "Заблокирован"}
                    </span>
                  </td>
                  <td className="p-4 text-white">
                    {candidate.experience ? `${candidate.experience} лет` : "Без опыта"}
                  </td>
                  <td className="p-4 text-white">
                    {candidate.skills && candidate.skills.length > 0
                      ? candidate.skills.join(", ")
                      : "Навыки не указаны"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => blockCandidate(candidate.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Показано {candidates.length} из {totalCount} кандидатов
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-3 py-1 border rounded text-sm ${
                  page === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-white/5 border-gray-700 text-gray-300 hover:bg-white/10 transition-all"
                }`}
              >
                Назад
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  className={`px-3 py-1 border rounded text-sm ${
                    page === idx + 1
                      ? "bg-yellow-400/20 border-yellow-400/40 text-yellow-400"
                      : "bg-white/5 border-gray-700 text-gray-300 hover:bg-white/10 transition-all"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-3 py-1 border rounded text-sm ${
                  page === totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-white/5 border-gray-700 text-gray-300 hover:bg-white/10 transition-all"
                }`}
              >
                Далее
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
