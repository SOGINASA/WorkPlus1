import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Users,
  Building2,
  User,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Phone,
  MapPin,
  Download,
} from "lucide-react";
import {
  getUsers,
  getUserStats,
  bulkUpdateUsers,
  exportUsers,
  updateUser,
} from "../../../components/api/UserService";

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    employers: 0,
    candidates: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(true);

  // --- Загрузка данных ---
  const loadData = async () => {
    try {
      setLoading(true);
      const usersData = await getUsers({
        search: searchQuery,
        role: selectedRole,
        status: selectedStatus,
        page: 1,
        perPage: 20,
      });
      setUsers(usersData.users);

      const statsData = await getUserStats();
      setStats(statsData);
    } catch (err) {
      console.error("Ошибка загрузки:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedRole, selectedStatus]);

  // --- Массовые действия ---
  const handleBulkAction = async (action) => {
    try {
      await bulkUpdateUsers(selectedUsers, action);
      setSelectedUsers([]);
      loadData();
    } catch (err) {
      console.error("Ошибка массового обновления:", err.message);
    }
  };

  // --- Переключение выбора ---
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "employer":
        return <Building2 className="w-4 h-4" />;
      case "candidate":
        return <User className="w-4 h-4" />;
      case "admin":
        return <Users className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "employer":
        return "Работодатель";
      case "candidate":
        return "Соискатель";
      case "admin":
        return "Администратор";
      default:
        return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "blocked":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Активен";
      case "blocked":
        return "Заблокирован";
      case "pending":
        return "На модерации";
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Пользователи
          </h1>
          <p className="text-gray-400">Управление всеми пользователями системы</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportUsers}
            className="flex items-center px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-gray-300 hover:bg-white/10 transition-all text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm">
            <Users className="w-4 h-4 mr-2" />
            Добавить пользователя
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-400">Всего пользователей</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{stats.employers}</span>
          </div>
          <p className="text-sm text-gray-400">Работодателей</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <User className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{stats.candidates}</span>
          </div>
          <p className="text-sm text-gray-400">Соискателей</p>
        </div>
        <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{stats.active}</span>
          </div>
          <p className="text-sm text-gray-400">Активных</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-gray-700 rounded-xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени, email или компании..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              <option value="all">Все роли</option>
              <option value="employer">Работодатели</option>
              <option value="candidate">Соискатели</option>
              <option value="admin">Администраторы</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="blocked">Заблокированные</option>
              <option value="pending">На модерации</option>
            </select>
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 text-sm">
                Выбрано {selectedUsers.length} пользователей
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction("activate")}
                  className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30 transition-all"
                >
                  Активировать
                </button>
                <button
                  onClick={() => handleBulkAction("block")}
                  className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30 transition-all"
                >
                  Заблокировать
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-400">Загрузка...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                    />
                  </th>
                  <th className="text-left p-4 text-gray-300 font-medium">Пользователь</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Роль</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Статус</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Контакты</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Активность</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-all">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <span className="text-black font-medium text-sm">
                            {user.name?.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                          {user.company && (
                            <div className="text-gray-500 text-xs">{user.company}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-gray-300">
                        {getRoleIcon(user.role)}
                        <span className="text-sm">{getRoleLabel(user.role)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-300 text-sm">
                          <Phone className="w-3 h-3 mr-2 text-gray-500" />
                          {user.phone}
                        </div>
                        <div className="flex items-center text-gray-300 text-sm">
                          <MapPin className="w-3 h-3 mr-2 text-gray-500" />
                          {user.location}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-gray-300 text-sm">
                          Рег: {user.registeredDate}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Активен: {user.lastActivity}
                        </div>
                        {user.role === "employer" && (
                          <div className="text-yellow-400 text-xs">
                            {user.jobsPosted} вакансий
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {/* Кнопка блокировки/разблокировки */}
                        <button
                          onClick={() =>
                            updateUser(user.id, { status: user.status === "active" ? "blocked" : "active" })
                              .then(loadData)
                          }
                          className={`p-2 rounded-lg transition-all ${
                            user.status === "active"
                              ? "text-gray-400 hover:text-red-400 hover:bg-white/5"
                              : "text-red-400 hover:text-green-400 hover:bg-white/5"
                          }`}
                          title={user.status === "active" ? "Заблокировать" : "Разблокировать"}
                        >
                          <Ban className="w-4 h-4" />
                        </button>

                        {/* Кнопка "ещё" (оставляем на будущее) */}
                        <div className="relative">
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
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

export default UserList;
