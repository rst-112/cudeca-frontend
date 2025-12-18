import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';
import { ScrollToTop } from './components/ScrollToTop';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './features/admin/AdminLayout';

// Auth Pages
import AuthPage from './features/auth/AuthPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';

// Admin Pages & Features
import AdminDashboard from './features/admin/AdminDashboard';
import CrearEvento from './features/admin/CrearEvento';
import GestionAsientos from './features/admin/GestionAsientos';
import EditorMapaAsientos from './features/admin/EditorMapaAsientos';
import VisorMapaAsientos from './features/admin/VisorMapaAsientos';

// Staff Pages
import Dashboard from './features/dashboard/Dashboard';
import DashboardHome from './features/dashboard/DashboardHome';
import ScannerView from './features/dashboard/ScannerView';

// Public Pages
import { HomeInvitado as HomePage } from './pages/public/homeInvitado/HomeInvitado';
import Eventos from './pages/public/Eventos';
import DetalleEvento from './pages/public/DetallesEvento';
import Checkout from './pages/public/Checkout'; // Ahora accesible públicamente
import ConfirmationPage from './pages/public/Confirmation';

// Private User Pages
import PerfilUsuario from './pages/PerfilUsuario';

// Legal
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Cookies from './pages/legal/Cookies';

import { PrivateRoute } from './components/PrivateRoute';

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
              {/* === RUTAS PÚBLICAS (Layout Principal) === */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="eventos" element={<Eventos />} />
                <Route path="evento/:id" element={<DetalleEvento />} />

                {/* --- CAMBIO: CHECKOUT AHORA ES PÚBLICO --- */}
                <Route path="checkout" element={<Checkout />} />
                <Route path="confirmacion" element={<ConfirmationPage />} />

                {/* Páginas Legales */}
                <Route path="terminos" element={<Terms />} />
                <Route path="privacidad" element={<Privacy />} />
                <Route path="cookies" element={<Cookies />} />

                {/* Rutas Protegidas de Usuario */}
                <Route element={<PrivateRoute />}>
                  <Route path="perfil" element={<PerfilUsuario />} />
                </Route>
              </Route>

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

              {/* === ADMIN (Layout Dedicado) === */}
              <Route element={<PrivateRoute requiredRole="ADMINISTRADOR" />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="eventos" element={<AdminDashboard />} />
                  <Route path="asientos" element={<GestionAsientos />} />
                  <Route path="scanner" element={<ScannerView />} />
                </Route>
                <Route path="/creacion-eventos" element={<CrearEvento />} />
                {/* Rutas de Editor y Visor FUERA del AdminLayout para pantalla completa */}
                <Route path="/admin/asientos/editor/:eventoId" element={<EditorMapaAsientos />} />
                <Route path="/admin/asientos/visor/:eventoId" element={<VisorMapaAsientos />} />
              </Route>

              {/* === DASHBOARD/STAFF === */}
              <Route element={<PrivateRoute requiredRole={['ADMINISTRADOR', 'PERSONAL_EVENTO']} />}>
                <Route path="/staff" element={<Dashboard />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="scanner" element={<ScannerView />} />
                </Route>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="scanner" element={<ScannerView />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
