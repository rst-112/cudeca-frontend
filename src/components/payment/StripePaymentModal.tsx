import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import { Loader2, CreditCard, Smartphone } from 'lucide-react';
import { apiClient } from '../../services/api';

// Cargar Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioId: number;
  amount: number;
  onSuccess: () => void;
}

// Formulario de Tarjeta (Stripe Real)
const CardForm = ({ amount, onSuccess }: { amount: number; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message || 'Error en el pago');
      setLoading(false);
    } else {
      toast.success(`Pago de ${amount}€ completado`);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
        <PaymentElement />
      </div>
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#00A651] text-white"
      >
        {loading ? <Loader2 className="animate-spin mr-2" /> : `Pagar ${amount}€ con Tarjeta`}
      </Button>
    </form>
  );
};

const BizumForm = ({
  amount,
  usuarioId,
  onSuccess,
}: {
  amount: number;
  usuarioId: number;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');

  const handleSimularBizum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) return toast.error('Introduce un móvil válido');

    setLoading(true);
    try {
      // Simulación de retardo de red (parece más real)
      await new Promise((r) => setTimeout(r, 1500));

      // Llamada a TU backend (no a Stripe)
      await apiClient.post(`/pagos/simular-bizum/${usuarioId}`, {
        amount: amount,
        currency: 'eur',
      });

      toast.success(`Bizum de ${amount}€ recibido correctamente`);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Error al conectar con Bizum');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSimularBizum} className="space-y-4 mt-4 text-center">
      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
          <Smartphone size={24} />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Introduce tu número de móvil asociado a Bizum:
        </p>
        <input
          type="tel"
          placeholder="600 000 000"
          className="w-full p-3 text-center text-xl font-bold tracking-widest border rounded-lg text-slate-900 dark:text-white dark:bg-slate-800 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={9}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#15b2bc] hover:bg-[#0e8e96] text-white font-bold"
      >
        {loading ? <Loader2 className="animate-spin mr-2" /> : `Confirmar Bizum de ${amount}€`}
      </Button>
    </form>
  );
};

export const StripePaymentModal = ({
  isOpen,
  onClose,
  usuarioId,
  amount,
  onSuccess,
}: StripePaymentModalProps) => {
  const [method, setMethod] = useState<'card' | 'bizum'>('card');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (method === 'card' && isOpen && amount > 0 && !clientSecret && !initialized.current) {
      initialized.current = true;

      // Mapear método a formato backend
      const methodMap: Record<string, string> = {
        card: 'TARJETA',
        bizum: 'BIZUM',
        paypal: 'PAYPAL',
      };

      apiClient
        .post(`/pagos/crear-intento/${usuarioId}`, {
          amount,
          currency: 'eur',
          paymentMethod: methodMap[method] || 'TARJETA',
        })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch(() => toast.error('Error iniciando Stripe'));
    }
  }, [isOpen, amount, usuarioId, method, clientSecret]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Cabecera con Pestañas */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setMethod('card')}
            className={`flex-1 p-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${method === 'card' ? 'text-[#00A651] border-b-2 border-[#00A651] bg-green-50/50 dark:bg-green-900/10' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <CreditCard size={18} /> Tarjeta
          </button>
          <button
            onClick={() => setMethod('bizum')}
            className={`flex-1 p-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${method === 'bizum' ? 'text-[#15b2bc] border-b-2 border-[#15b2bc] bg-blue-50/50 dark:bg-blue-900/10' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <Smartphone size={18} /> Bizum
          </button>
        </div>

        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            ✕
          </button>

          <h3 className="font-bold text-xl text-center mb-2 text-slate-900 dark:text-white">
            {amount.toFixed(2)} €
          </h3>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
            Total a pagar
          </p>

          {method === 'card' ? (
            clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CardForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
              </Elements>
            ) : (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-[#00A651]" />
              </div>
            )
          ) : (
            <BizumForm amount={amount} usuarioId={usuarioId} onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};
