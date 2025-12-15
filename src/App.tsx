import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';
import MainLayout from './components/layout/MainLayout';
import AuthPage from './features/auth/AuthPage';
import { PrivateRoute } from './components/PrivateRoute';
import AdminDashboard from './features/admin/AdminDashboard';

// Dashboard y sus sub-vistas
import Dashboard from './features/dashboard/Dashboard';
import DashboardHome from './features/dashboard/DashboardHome';
import ScannerView from './features/dashboard/ScannerView';

// Páginas públicas
import Home from './pages/Home';
import DetalleEvento from './pages/public/DetallesEvento';
import Checkout from './pages/public/Checkout';
import SandboxSeatMap from './pages/public/SandboxSeatMap';
import SandboxSeatMapEditor from './pages/public/SandboxSeatMapEditor';
import MisEntradas from './pages/public/MisEntradas';

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
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="evento/:id" element={<DetalleEvento />} />
            </Route>

            {/* Sandbox */}
            <Route path="/dev/mapa" element={<SandboxSeatMap />} />
            <Route path="/dev/mapa/editor" element={<SandboxSeatMapEditor />} />

            {/* Auth */}
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

            {/* Checkout Protegido */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* Admin */}
            <Route element={<PrivateRoute requiredRole="ADMINISTRADOR" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* === DASHBOARD ENTERPRISE ROUTING === */}
            <Route element={<PrivateRoute requiredRole="COMPRADOR" />}>
              {/* Dashboard es el Layout Padre */}
              <Route path="/dashboard" element={<Dashboard />}>
                {/* Index: Lo que se ve en /dashboard */}
                <Route index element={<DashboardHome />} />

                {/* Rutas Hijas: Se renderizan en el <Outlet /> del Dashboard */}
                <Route path="tickets" element={<MisEntradas />} />
                <Route path="events" element={<div>Eventos (Dashboard)</div>} />
                <Route path="profile" element={<div>Perfil (Dashboard)</div>} />

                {/* Ruta Scanner */}
                <Route path="scanner" element={<ScannerView />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
