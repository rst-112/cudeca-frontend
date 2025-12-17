import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';
import { ScrollToTop } from './components/ScrollToTop';
import MainLayout from './components/layout/MainLayout';
import AuthPage from './features/auth/AuthPage';
import { PrivateRoute } from './components/PrivateRoute';
import AdminLayout from './features/admin/AdminLayout';
import AdminDashboard from './features/admin/AdminDashboard';
import CrearEvento from './features/admin/CrearEvento';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import Dashboard from './features/dashboard/Dashboard';
import DashboardHome from './features/dashboard/DashboardHome';
import ScannerView from './features/dashboard/ScannerView';

// Páginas públicas
import Home from './pages/Home';
import DetalleEvento from './pages/public/DetallesEvento';
import Eventos from './pages/public/Eventos';

// === PÁGINAS UNIFICADAS ===
import Checkout from './pages/public/Checkout';
import ConfirmationPage from './pages/public/Confirmation';
import PerfilUsuario from './pages/PerfilUsuario';

// === PÁGINAS LEGALES ===
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Cookies from './pages/legal/Cookies';

// Herramientas de Desarrollo
import SandboxSeatMap from './pages/public/SandboxSeatMap';
import SandboxSeatMapEditor from './pages/public/SandboxSeatMapEditor';

// Componente temporal para staff
const EventStaffDashboard = () => <div>Dashboard (Personal Evento)</div>;

function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading)
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-right" richColors />
            <Routes>
              {/* === RUTAS DE DESARROLLO === */}
              <Route path="/dev/mapa" element={<SandboxSeatMap />} />
              <Route path="/dev/mapa/editor" element={<SandboxSeatMapEditor />} />

              {/* Redirecciones de compatibilidad */}
              <Route path="/dev/checkout-usuario" element={<Checkout />} />
              <Route path="/dev/checkout-invitado" element={<Checkout />} />
              <Route path="/dev/compra-invitado" element={<ConfirmationPage />} />
              <Route path="/dev/compra-usuario" element={<ConfirmationPage />} />
              <Route path="/dev/perfil-usuario" element={<PerfilUsuario />} />
              <Route
                path="/dev/datos-fiscales"
                element={<Navigate to="/perfil?tab=fiscales" replace />}
              />
              <Route
                path="/dev/recarga-saldo"
                element={<Navigate to="/perfil?tab=monedero" replace />}
              />
              <Route
                path="/dev/suscripcion"
                element={<Navigate to="/perfil?tab=suscripcion" replace />}
              />
              <Route
                path="/dev/perfil-compras"
                element={<Navigate to="/perfil?tab=compras" replace />}
              />

              {/* === AUTH === */}
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
              <Route
                path="/forgot-password"
                element={
                  <RedirectIfAuthenticated>
                    <ForgotPasswordPage />
                  </RedirectIfAuthenticated>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <RedirectIfAuthenticated>
                    <ResetPasswordPage />
                  </RedirectIfAuthenticated>
                }
              />

              {/* === ADMIN GLOBAL (Rutas protegidas) === */}
              <Route element={<PrivateRoute requiredRole="ADMINISTRADOR" />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="eventos/crear" element={<CrearEvento />} />
                  {/* Aquí irán más rutas de admin */}
                </Route>
              </Route>

              {/* === STAFF & ADMIN (Backoffice Operativo) === */}
              <Route element={<PrivateRoute requiredRole={['ADMINISTRADOR', 'PERSONAL_EVENTO']} />}>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="scanner" element={<ScannerView />} />
                  <Route path="events" element={<div>Gestión de Eventos (Staff)</div>} />
                </Route>
              </Route>

              {/* === WEB PÚBLICA Y ZONA PERSONAL (Layout Principal) === */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="eventos" element={<Eventos />} />
                <Route path="evento/:id" element={<DetalleEvento />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="confirmacion" element={<ConfirmationPage />} />

                {/* PÁGINAS LEGALES */}
                <Route path="terminos" element={<Terms />} />
                <Route path="privacidad" element={<Privacy />} />
                <Route path="cookies" element={<Cookies />} />

                {/* ZONA PERSONAL (Accesible para TODOS los roles) */}
                <Route element={<PrivateRoute />}>
                  <Route path="perfil" element={<PerfilUsuario />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
