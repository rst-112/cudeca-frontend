// IMPORTANTE: Asegúrate de que esta línea incluya 'useNavigate'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Settings, ShoppingCart, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate(); // Aquí es donde fallaba si faltaba el import
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-['Arimo']">
      {/* Menú Lateral */}
      <aside className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col transition-colors duration-300">
        <div className="p-8 border-b dark:border-gray-700">
          <Link to="/" className="block">
            <h1 className="text-2xl font-bold text-[#00a651] hover:text-[#00753e] transition-colors">
              Fundación Cudeca
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Cudeca Admin</p>
          </Link>
        </div>

        <nav className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Sección Eventos */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar size={16} /> Eventos
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-lg transition-colors"
                >
                  Gestión de eventos
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/asientos"
                  className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-lg transition-colors"
                >
                  Gestión de Asientos
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección Ventas */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShoppingCart size={16} /> Ventas
            </h2>
            <ul className="space-y-2">
              <li>
                <span className="flex items-center px-4 py-2 text-gray-400 cursor-not-allowed">
                  Ver Compras (Próx.)
                </span>
              </li>
              <li>
                <span className="flex items-center px-4 py-2 text-gray-400 cursor-not-allowed">
                  Reembolsos (Próx.)
                </span>
              </li>
            </ul>
          </div>

          {/* Sección Configuración */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Settings size={16} /> Configuración
            </h2>
            <ul className="space-y-2">
              <li>
                <span className="flex items-center px-4 py-2 text-gray-400 cursor-not-allowed">
                  Gestión de usuarios
                </span>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-8 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
          >
            <LogOut size={18} className="mr-2" /> Salir
          </Button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
