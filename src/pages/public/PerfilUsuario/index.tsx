// Pantalla de Perfil de Usuario
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Ajusta la ruta si es necesario
import { Navbar } from '../../../components/ui/Navbar';
import { FooterSection } from './FooterSection'; // Sección recuperada
import { ProfileActionsSection } from './ProfileActionsSection';
import { ProfileInformationSection } from './ProfileInformationSection';

export const PantallaDePerfil = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Si terminó de cargar y NO está autenticado, mandar al Login
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Mientras carga el estado de autenticación, no mostramos nada para evitar parpadeos
  if (isLoading) return null;

  // Si no está autenticado (y ya se va a redirigir), devolvemos null
  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center bg-slate-50 dark:bg-slate-900">
        <ProfileActionsSection />
        <ProfileInformationSection />
      </main>

      {/* Aquí está la parte de abajo que faltaba */}
      <FooterSection />
    </div>
  );
};