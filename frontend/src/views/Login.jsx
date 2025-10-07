// ...existing code...
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../js/store/appContext";

 function Login() {
  const navigate = useNavigate();
  const { actions } = useContext(Context);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Completa usuario y contraseña.");
      return;
    }
    setLoading(true);
    try {
      const token = await actions.login(username, password);
      if (token) {
        navigate("/admin");
      } else {
        setError("Credenciales inválidas.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white overflow-hidden">
      {/* background like Home */}
      <div className="absolute inset-0">
        <img
          src="/deskdark.jpg"
          alt="Dark workspace background"
          className="w-full h-full object-cover object-center"
          draggable="false"
        />
        <div className="absolute inset-0 bg-black bg-opacity-55" />
      </div>

      <main className="absolute inset-0 flex items-center justify-center z-10 p-6">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 backdrop-blur-sm border border-white/6 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          {/* decorative left accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-blue-500 to-indigo-600 opacity-80" />

          {/* top row: lock icon + title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/30 border border-white/6 text-blue-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2" />
                <rect x="6" y="10" width="12" height="8" rx="2" strokeWidth="1.5" />
                <path d="M8 10V8a4 4 0 118 0v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-lg md:text-xl font-black tracking-tight">Admin Login</h2>
          </div>

          {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

          <label className="block mb-4">
            <span className="text-sm text-gray-300">Usuario</span>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 20a8 8 0 0116 0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none w-full pl-10 pr-3 py-2 bg-transparent border border-transparent rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-white transition"
                autoComplete="username"
                placeholder="tu_usuario"
                required
              />
            </div>
          </label>

          <label className="block mb-6">
            <span className="text-sm text-gray-300">Contraseña</span>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="11" width="18" height="10" rx="2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none w-full pl-10 pr-3 py-2 bg-transparent border border-transparent rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-white transition"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>
          </label>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-black rounded-lg font-semibold hover:scale-[1.02] transform transition disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            <button
              type="button"
              onClick={() => {
                setUsername("");
                setPassword("");
                setError("");
              }}
              className="text-sm text-gray-400 hover:text-white"
            >
              Limpiar
            </button>
          </div>

          {/* subtle footer helper */}
          <div className="mt-5 text-xs text-gray-500">
            <span className="opacity-60">Acceso administrativo</span>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;
// ...existing code...