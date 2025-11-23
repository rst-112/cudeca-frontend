/**
 * PrivateRoute - Componente Guard para Rutas Protegidas
 *
 * Este componente verifica si el usuario
 * está autenticado antes de permitir el acceso a rutas protegidas.
 *
 * USO EN REACT ROUTER:
 * ```tsx
 * <Route element={<PrivateRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 *   <Route path="/eventos" element={<Eventos />} />
 * </Route>
 * ```
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = () => {
  // Obtener estado de autenticación del contexto
  const { isAuthenticated, isLoading } = useAuth();

  // Obtener ubicación actual para guardarla si redirigimos
  const location = useLocation();

  /**
   * PASO 1: Verificación de Token en Proceso
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-gray-600">Cargando sesión...</span>
      </div>
    );
  }

  /**
   * PASO 2: Usuario No Autenticado
   *
   * Si isAuthenticated = false, redirigir al login.
   */
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /**
   * PASO 3: Usuario Autenticado - Permitir Acceso
   */
  return <Outlet />;
};
