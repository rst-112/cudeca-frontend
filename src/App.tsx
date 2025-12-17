import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';
import MainLayout from './components/layout/MainLayout';
import AuthPage from './features/auth/AuthPage';
import { PrivateRoute } from './components/PrivateRoute';
import AdminDashboard from './features/admin/AdminDashboard';
import CrearEvento from './features/admin/CrearEvento';
import GestionAsientos from './features/admin/GestionAsientos';
import EditorMapaAsientos from './features/admin/EditorMapaAsientos';
import VisorMapaAsientos from './features/admin/VisorMapaAsientos';
import PerfilUsuario from './pages/PerfilUsuario';

// Páginas públicas
import DetalleEvento from './pages/public/DetallesEvento';
import Checkout from './pages/public/Checkout';
import { HomeInvitado } from './pages/public/homeInvitado/HomeInvitado';
import { InfoEventoInvitado } from './pages/public/infoEventoInvitado/InfoEventoInvitado';
import { HomeEventoLogeado } from './pages/public/homeEventoLogeado/HomeEventoLogeado';
import { InfoEventoLogeado } from './pages/public/infoEventoLogeado/InfoEventoLogeado';
import { EventoLogeado } from './pages/public/eventoLogeado/EventoLogeado';
import Eventos from './pages/public/Eventos';

// Páginas privadas
import { CreacionDeEventos } from './pages/private/creaciondeeventos/CreacionDeEventos';
import { EditarEntrada } from './pages/private/editarEntrada/EditarEntrada';
import { TiposDeEntrada } from './pages/private/tiposentrada/TiposDeEntrada';

// Componentes del Dashboard Staff (Restaurados)
import Dashboard from './features/dashboard/Dashboard';
import DashboardHome from './features/dashboard/DashboardHome';
import ScannerView from './features/dashboard/ScannerView';

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
          <CartProvider>
            <Toaster position="top-right" richColors />
            <Routes>
              {/* Rutas públicas con MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomeInvitado />} />
                <Route path="evento/:id" element={<DetalleEvento />} />
                <Route path="eventos" element={<Eventos />} />

                {/* Rutas Protegidas dentro del Layout */}
                <Route element={<PrivateRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/dashboard" element={<PerfilUsuario />} />
                </Route>
              </Route>

              {/* === RUTAS PÚBLICAS SIN MAINLAYOUT === */}
              <Route path="/home-invitado" element={<HomeInvitado />} />
              <Route path="/evento-invitado" element={<InfoEventoInvitado />} />
              <Route path="/home-logeado" element={<HomeEventoLogeado />} />
              <Route path="/info-evento-logeado" element={<InfoEventoLogeado />} />
              <Route path="/eventos-logeado" element={<EventoLogeado />} />
              <Route path="/creacion-eventos" element={<CreacionDeEventos />} />
              <Route path="/editar-entrada" element={<EditarEntrada />} />
              <Route path="/tipos-entrada" element={<TiposDeEntrada />} />


              {/* Admin Dashboard - Público (sin protección de rol) -> Protegido ahora */}
              <Route element={<PrivateRoute requiredRole="ADMINISTRADOR" />}>
                <Route path="/admin" element={<Dashboard />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="eventos" element={<AdminDashboard />} />
                  <Route path="asientos" element={<GestionAsientos />} />
                  <Route path="asientos/editor/:eventoId" element={<EditorMapaAsientos />} />
                  <Route path="asientos/visor/:eventoId" element={<VisorMapaAsientos />} />
                  <Route path="crear-evento" element={<CrearEvento />} />
                </Route>
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



              {/* Rutas protegidas por rol - Personal de Evento */}
              <Route element={<PrivateRoute requiredRole="PERSONAL_EVENTO" />}>
                <Route path="/staff" element={<Dashboard />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="scanner" element={<ScannerView />} />
                </Route>
              </Route>

              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
