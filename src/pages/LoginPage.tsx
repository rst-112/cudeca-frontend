import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setError('Credenciales inválidas');
    }
  };

  const handleGuestAccess = () => {
    // Redirigir a la página pública sin autenticación
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">CUDECA</h1>
          <p className="text-gray-600">Sistema de Gestión de Eventos</p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Entrar
          </button>
        </form>

        {/* Divisor */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O</span>
          </div>
        </div>

        {/* Botón de Invitado */}
        <button
          onClick={handleGuestAccess}
          className="w-full bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition font-semibold border border-gray-300"
        >
          🌐 Entrar como Invitado
        </button>

        {/* Links adicionales */}
        <div className="mt-6 text-center space-y-2">
          <Link to="/" className="block text-sm text-blue-600 hover:underline">
            ← Volver al inicio
          </Link>
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="#" className="text-blue-600 hover:underline font-semibold">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
