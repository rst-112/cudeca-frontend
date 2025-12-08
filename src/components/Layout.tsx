import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
            <Link to="/eventos" className="text-blue-600 hover:underline">
              Eventos
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.nombre}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};
