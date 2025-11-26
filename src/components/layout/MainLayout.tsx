import { Outlet, Link } from 'react-router-dom';
import { Home, LogIn, UserPlus } from 'lucide-react'; // Iconos

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:opacity-90">
            FUNDACIÓN CUDECA
          </Link>

          {/* Enlaces de Navegación */}
          <div className="flex gap-6 items-center">
            <Link to="/" className="flex items-center gap-1 hover:text-green-200 transition">
              <Home size={18} /> Inicio
            </Link>
            <Link to="/login" className="flex items-center gap-1 hover:text-green-200 transition">
              <LogIn size={18} /> Login
            </Link>
            <Link
              to="/registro"
              className="bg-white text-green-700 px-4 py-2 rounded-full font-semibold hover:bg-green-50 transition flex items-center gap-1"
            >
              <UserPlus size={18} /> Registro
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido Dinámico (Aquí se cargan las páginas) */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="opacity-80">© 2025 Fundación CUDECA. Desarrollado por Sapitos Team.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
