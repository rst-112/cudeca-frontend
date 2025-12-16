import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/auth.types';

interface PrivateRouteProps {
  requiredRole?: Role | Role[]; // Ahora acepta uno o varios roles
}

export const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Lógica mejorada para soportar Arrays de roles
  if (requiredRole) {
    const rolesRequeridos = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const tienePermiso = user?.roles?.some((r) => rolesRequeridos.includes(r));

    if (!tienePermiso) {
      // Si intenta entrar al Dashboard sin permiso, lo mandamos a su perfil
      return <Navigate to="/perfil" replace />;
    }
  }

  return <Outlet />;
};
