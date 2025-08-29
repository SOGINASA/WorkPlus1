import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-center">
      {/* фон как в HeroSection */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>

      {/* контент */}
      <div className="relative z-10">
        <h1 className="text-8xl font-extrabold text-white drop-shadow-lg">404</h1>
        <p className="mt-4 text-2xl text-white drop-shadow-md">Страница не найдена</p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-xl shadow hover:bg-yellow-500 transition"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
