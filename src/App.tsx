import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';
import AuthPage from './features/auth/AuthPage';
import { PrivateRoute } from './components/PrivateRoute';
import AdminDashboard from './features/admin/AdminDashboard';

import Home from './pages/Home';
import Dashboard from './features/dashboard/Dashboard';

// Componentes temporales para las rutas que faltan
const EventStaffDashboard = () => <div>Dashboard (Personal Evento)</div>;

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/registro" element={<AuthPage />} />

            {/* Rutas protegidas por rol */}
            <Route element={<PrivateRoute requiredRole="ADMINISTRADOR" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route element={<PrivateRoute requiredRole="COMPRADOR" />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

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
