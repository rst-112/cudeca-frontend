import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Settings, ShoppingCart, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Menú Lateral */}
      <aside className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
        <div className="p-8 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold font-['Arimo']">Fundación Cudeca</h1>
          <p className="text-gray-500 dark:text-gray-400">Cudeca Admin</p>
        </div>
        <nav className="flex-1 p-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
              <Calendar size={20} /> Eventos
            </h2>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/admin/eventos" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                  Gestión de eventos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
              <ShoppingCart size={20} /> Ventas
            </h2>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/admin/ventas" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                  Ver Compras
                </Link>
              </li>
              <li>
                <Link to="/admin/reembolsos" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                  Reembolsos Manuales
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
              <Settings size={20} /> Configuración
            </h2>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/admin/usuarios" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                  Gestión de usuarios
                </Link>
              </li>
              <li>
                <Link to="/admin/exportar" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                  Exportar Datos
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="p-8 border-t dark:border-gray-700">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <LogOut size={18} className="mr-2" /> Salir
          </Button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
