import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6 text-green-600">
        <CheckCircle size={48} />
      </div>

      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
        ¡Compra Confirmada!
      </h1>

      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg mb-8">
        Tu pedido se ha procesado correctamente. Hemos enviado un correo electrónico con los
        detalles de tus entradas.
      </p>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link to="/perfil?tab=compras">Ver mis entradas</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
