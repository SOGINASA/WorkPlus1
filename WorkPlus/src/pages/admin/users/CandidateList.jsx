// src/pages/admin/users/CandidateList.jsx
import { useState, useEffect } from "react";
import {
  Search,
  Phone,
  MapPin,
  Ban,
  Eye,
} from "lucide-react";
import { getCandidates, updateUser } from "../../../components/api/UserService";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getCandidates({
        search: searchQuery,
        status: selectedStatus,
        page: 1,
        perPage: 20,
      });
      setCandidates(data.users);
    } catch (error) {
      console.error("Ошибка загрузки кандидатов:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedStatus]);

  const toggleStatus = async (user) => {
    try {
      await updateUser(user.id, {
        status: user.status === "active" ? "blocked" : "active",
      });
      loadData();
    } catch (err) {
      console.error("Ошибка обновления:", err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Соискатели
      </h1>

      {/* Фильтры */}
      <div className="bg-white/5 border border-gray-700 rounded-xl p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени, email или телефону..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 text-sm"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
        >
          <option value="all">Все</option>
          <option value="active">Активные</option>
          <option value="blocked">Заблокированные</option>
        </select>
      </div>

      {/* Таблица */}
      <div className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-400">Загрузка...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left p-4 text-gray-300">Кандидат</th>
                  <th className="text-left p-4 text-gray-300">Образование</th>
                  <th className="text-left p-4 text-gray-300">Статус</th>
                  <th className="text-left p-4 text-gray-300">Опыт</th>
                  <th className="text-left p-4 text-gray-300">Контакты</th>
                  <th className="text-left p-4 text-gray-300">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {candidates.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-black font-medium text-sm">
                          {c.name?.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{c.name}</div>
                        <div className="text-gray-400 text-sm">{c.email}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{c.education}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          c.status === "active"
                            ? "text-green-400 bg-green-400/10 border-green-400/20"
                            : "text-red-400 bg-red-400/10 border-red-400/20"
                        }`}
                      >
                        {c.status === "active" ? "Активен" : "Заблокирован"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {c.experience ? `${c.experience} лет` : "—"}
                    </td>
                    <td className="p-4 text-sm text-gray-300 space-y-1">
                      {c.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-2 text-gray-500" />
                          {c.phone}
                        </div>
                      )}
                      {c.location && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-2 text-gray-500" />
                          {c.location}
                        </div>
                      )}
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(c)}
                        className={`p-2 rounded-lg transition-all ${
                          c.status === "active"
                            ? "text-gray-400 hover:text-red-400"
                            : "text-red-400 hover:text-green-400"
                        }`}
                        title={
                          c.status === "active"
                            ? "Заблокировать"
                            : "Разблокировать"
                        }
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" onClick={(e) => {
                            window.location.href=`/admin/users/profiles?id=${c.id}`;
                          }}>
                            <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateList;
