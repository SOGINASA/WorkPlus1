import React, { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Восстановление для:", email);
    // Здесь будет API вызов для отправки письма
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>

      {/* Контент */}
      <div className="w-full max-w-md text-center">
        {/* Заголовок */}
        <div className="mb-10">
          <Lock className="w-12 h-12 md:w-16 md:h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            Восстановление{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              пароля
            </span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            Введите e-mail, указанный при регистрации.  
            Мы отправим ссылку для сброса пароля.
          </p>
        </div>

        {/* Форма */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-sm border border-yellow-400/10 rounded-xl p-6 md:p-8 shadow-lg text-left"
        >
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Электронная почта
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-yellow-400/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 transition-all"
          >
            Отправить ссылку
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </form>

        {/* Доп. ссылка */}
        <div className="text-center mt-6">
          <a
            href="/login"
            className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
          >
            Вернуться к входу
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
