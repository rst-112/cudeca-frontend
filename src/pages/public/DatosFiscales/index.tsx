import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Ajusta la ruta si es necesario
import { Navbar } from '../../../components/ui/Navbar';
import { ProfileActionsSection } from './ProfileActionsSection';
import { FiscalDataSection } from './FiscalDataSection';
import { FooterSection } from './FooterSection';

export const DatosFiscales = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Si terminó de cargar y NO está autenticado, redirigir al Login
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Evitar parpadeos o renderizado indebido mientras se verifica la sesión
  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center bg-slate-50 dark:bg-slate-900">
        <ProfileActionsSection />
        <FiscalDataSection />
      </main>
      <FooterSection />
    </div>
  );
};