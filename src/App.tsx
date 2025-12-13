import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';
import MainLayout from './components/layout/MainLayout';
import AuthPage from './features/auth/AuthPage';
import { PrivateRoute } from './components/PrivateRoute';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminLayout from './features/admin/AdminLayout';
import CrearEvento from './features/admin/CrearEvento';
import Dashboard from './features/dashboard/Dashboard';

// Páginas públicas
import Home from './pages/Home';
import DetalleEvento from './pages/public/DetallesEvento';
import Checkout from './pages/public/Checkout';
import SandboxSeatMap from './pages/public/SandboxSeatMap';
import SandboxSeatMapEditor from './pages/public/SandboxSeatMapEditor';
import { HomeInvitado } from './pages/public/homeInvitado/HomeInvitado';
import { InfoEventoInvitado } from './pages/public/infoEventoInvitado/InfoEventoInvitado';
import { HomeEventoLogeado } from './pages/public/homeEventoLogeado/HomeEventoLogeado';
import { InfoEventoLogeado } from './pages/public/infoEventoLogeado/InfoEventoLogeado';

// Páginas privadas
import { CreacionDeEventos } from './pages/private/creaciondeeventos/CreacionDeEventos';
import { EditarEntrada } from './pages/private/editarEntrada/EditarEntrada';
import { TiposDeEntrada } from './pages/private/tiposentrada/TiposDeEntrada';

// Componentes temporales
const EventStaffDashboard = () => <div>Dashboard (Personal Evento)</div>;

/**
 * RedirectIfAuthenticated - Redirige a home si ya está logueado
 */
function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-gray-600">Cargando...</span>
      </div>
    );
  }

  // Si está autenticado, redirigir a home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado, mostrar el login/register
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <Routes>
            {/* Rutas públicas con MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="evento/:id" element={<DetalleEvento />} />
            </Route>

            {/* === RUTAS PÚBLICAS SIN MAINLAYOUT === */}
            <Route path="/home-invitado" element={<HomeInvitado />} />
            <Route path="/evento-invitado" element={<InfoEventoInvitado />} />
            <Route path="/home-logeado" element={<HomeEventoLogeado />} />
            <Route path="/info-evento-logeado" element={<InfoEventoLogeado />} />
            <Route path="/creacion-eventos" element={<CreacionDeEventos />} />
            <Route path="/editar-entrada" element={<EditarEntrada />} />
            <Route path="/tipos-entrada" element={<TiposDeEntrada />} />

            {/* === RUTA DE DESARROLLO - SANDBOX === */}
            <Route path="/dev/mapa" element={<SandboxSeatMap />} />
            <Route path="/dev/mapa/editor" element={<SandboxSeatMapEditor />} />

            {/* Admin Dashboard - Público (sin protección de rol) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="eventos" element={<AdminDashboard />} />
              <Route path="eventos/crear" element={<CrearEvento />} />
            </Route>

            {/* Rutas de autenticación (redirige si ya está logueado) */}
            <Route
              path="/login"
              element={
                <RedirectIfAuthenticated>
                  <AuthPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/registro"
              element={
                <RedirectIfAuthenticated>
                  <AuthPage />
                </RedirectIfAuthenticated>
              }
            />

            {/* Rutas protegidas - Checkout */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<Checkout />} />
            </Route>


            {/* Rutas protegidas por rol - Comprador */}
            <Route element={<PrivateRoute requiredRole="COMPRADOR" />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Rutas protegidas por rol - Personal de Evento */}
            <Route element={<PrivateRoute requiredRole="PERSONAL_EVENTO" />}>
              <Route path="/staff" element={<EventStaffDashboard />} />
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
