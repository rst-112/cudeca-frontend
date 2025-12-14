import { ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface QrScannerFABProps {
  onClick?: () => void; // Callback opcional para manejar el click
}

/**
 * Floating Action Button para acceder al escáner QR
 * Solo visible para usuarios con rol PERSONAL_EVENTO
 */
export const QrScannerFAB = ({ onClick }: QrScannerFABProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verificar si el usuario es personal de evento (staff)
  const isStaff = user?.roles?.includes('PERSONAL_EVENTO');

  // No mostrar el FAB si no es staff
  if (!isStaff) {
    return null;
  }

  const handleClick = () => {
    // Si se proporciona un onClick personalizado, usarlo
    if (onClick) {
      onClick();
      return;
    }

    // Comportamiento por defecto: navegar al dashboard con vista de scanner
    navigate('/dashboard', { state: { view: 'scanner' } });
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-linear-to-br from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 hover:from-slate-800 hover:to-slate-900 dark:hover:from-slate-700 dark:hover:to-slate-800 text-white shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)] transition-all duration-300 flex items-center justify-center z-50 active:scale-95 ring-4 ring-slate-300 dark:ring-slate-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 hover:ring-slate-400 dark:hover:ring-slate-400 cursor-pointer"
      aria-label="Escanear entrada"
      title="Escanear entrada"
    >
      <ScanLine size={34} strokeWidth={2} />
    </button>
  );
};
