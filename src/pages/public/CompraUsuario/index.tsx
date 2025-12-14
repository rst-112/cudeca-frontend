import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Ajusta la ruta si es necesario
import { ConfirmationSection } from './ConfirmationSection';
import { FooterSection } from './FooterSection';
import { Navbar } from '../../../components/ui/Navbar';

export const CompraUsuario = () => {
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
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      <ConfirmationSection />
      <FooterSection />
    </div>
  );
};