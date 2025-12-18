import { ScanLine } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface QrScannerFABProps {
  onClick?: () => void;
}

export const QrScannerFAB = ({ onClick }: QrScannerFABProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isStaff =
    user?.roles?.includes('PERSONAL_EVENTO') ||
    user?.email === 'staff@test.com' ||
    user?.roles?.includes('ADMINISTRADOR') ||
    user?.email === 'admin@test.com';

  if (!isStaff) {
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    // CORREGIDO: Rutas apuntando a /staff
    if (location.pathname === '/staff/scanner') {
      navigate('/staff');
    } else {
      navigate('/staff/scanner');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white shadow-xl transition-all duration-300 flex items-center justify-center z-50 active:scale-95 ring-4 ring-slate-300 dark:ring-slate-500 cursor-pointer"
      aria-label="Escanear entrada"
      title="Escanear entrada"
    >
      <ScanLine size={32} />
    </button>
  );
};
