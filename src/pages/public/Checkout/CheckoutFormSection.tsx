import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Wallet,
  Check,
  Trash2,
  ChevronDown,
  Smartphone,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { procesarCheckout } from '../../../services/checkout.service';
import type { CheckoutRequest, ItemCheckout } from '../../../services/checkout.service';
import { toast } from 'sonner';

// --- INTERFACES ---
interface CartItem {
  id: string;
  name: string;
  type: string;
  image: string;
  basePrice: number;
  implicitDonation: number;
  memberDiscount: number;
  additionalDonation?: number;
}

interface PriceBreakdown {
  label: string;
  amount: string;
}

export const CheckoutFormSection = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // --- ESTADOS ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card');
  const [email, setEmail] = useState('');

  // Fiscales
  const [requestFiscalCertificate, setRequestFiscalCertificate] = useState(false); // Default false es mejor UX
  const [fiscalMode, setFiscalMode] = useState<'saved' | 'new'>('new');
  const [fiscalDropdownOpen, setFiscalDropdownOpen] = useState(false);

  // Formulario manual
  const [fiscalNif, setFiscalNif] = useState('');
  const [fiscalName, setFiscalName] = useState('');
  const [fiscalAddress, setFiscalAddress] = useState('');
  const [fiscalCity, setFiscalCity] = useState('');
  const [fiscalZip, setFiscalZip] = useState('');

  const [selectedSavedId, setSelectedSavedId] = useState<number | null>(null);

  // --- EFECTOS ---
  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email);
      setFiscalMode('saved');
      setSelectedSavedId(1); // Mock selección inicial
    } else {
      setFiscalMode('new');
    }
  }, [isAuthenticated, user]);

  // --- MOCK DATA ---
  const cartItems: CartItem[] = [
    {
      id: '1',
      name: 'Noche de Jazz Solidaria',
      type: 'Asiento normal',
      image:
        'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=200',
      basePrice: 15.0,
      implicitDonation: 3.0,
      memberDiscount: isAuthenticated ? -1.5 : 0,
    },
    {
      id: '2',
      name: 'Gala Benéfica anual',
      type: 'Entrada general',
      image:
        'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=200',
      basePrice: 15.0,
      implicitDonation: 5.0,
      memberDiscount: isAuthenticated ? -1.5 : 0,
      additionalDonation: 350.0,
    },
  ];

  const paymentMethods = [
    { id: 'credit-card', label: 'Tarjeta de crédito', icon: CreditCard },
    { id: 'paypal', label: 'Paypal', icon: Wallet },
    { id: 'bizum', label: 'Bizum', icon: Smartphone },
    ...(isAuthenticated
      ? [{ id: 'wallet', label: 'Monedero', subtitle: 'Saldo disponible: 36,00€', icon: Wallet }]
      : []),
  ];

  // --- CÁLCULOS ---
  const calculateItemTotal = (item: CartItem) =>
    item.basePrice + item.implicitDonation + item.memberDiscount + (item.additionalDonation || 0);
  const calculateGrandTotal = () =>
    cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const getItemBreakdown = (item: CartItem): PriceBreakdown[] => {
    const breakdown = [
      { label: 'Entrada base', amount: `${item.basePrice.toFixed(2)}€` },
      { label: 'Donación Implícita', amount: `${item.implicitDonation.toFixed(2)}€` },
    ];
    if (item.memberDiscount !== 0)
      breakdown.push({ label: 'Descuento Socio', amount: `${item.memberDiscount.toFixed(2)}€` });
    if (item.additionalDonation)
      breakdown.push({
        label: 'Donación Adicional',
        amount: `${item.additionalDonation.toFixed(2)}€`,
      });
    return breakdown;
  };

  // --- SUBMIT ---
  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (requestFiscalCertificate && fiscalMode === 'new') {
      if (!fiscalNif || !fiscalName || !fiscalAddress) {
        toast.error('Por favor completa los datos fiscales obligatorios');
        return;
      }
    }

    try {
      setIsProcessing(true);

      let metodoPagoBackend = 'TARJETA';
      if (selectedPaymentMethod === 'paypal') metodoPagoBackend = 'PAYPAL';
      if (selectedPaymentMethod === 'bizum') metodoPagoBackend = 'BIZUM';
      if (selectedPaymentMethod === 'wallet') metodoPagoBackend = 'MONEDERO';

      const itemsParaBackend: ItemCheckout[] = cartItems.map((item) => ({
        tipo: 'ENTRADA',
        referenciaId: parseInt(item.id),
        cantidad: 1,
        precio: calculateItemTotal(item),
      }));

      const request: CheckoutRequest = {
        usuarioId: user?.id || 0,
        metodoPago: metodoPagoBackend,
        donacionExtra: 0,
        items: itemsParaBackend,
        solicitarCertificado: requestFiscalCertificate,
        datosFiscalesId:
          requestFiscalCertificate && fiscalMode === 'saved' ? selectedSavedId! : undefined,
      };

      console.log('🚀 Enviando al backend:', request);
      const response = await procesarCheckout(request);

      const rutaDestino = isAuthenticated ? '/confirmacion' : '/confirmacion'; // Unificada
      navigate(rutaDestino, { state: { compraId: response.compraId, email: email } });
    } catch (error) {
      console.error(error);
      toast.error('Error procesando la compra');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* --- FORMULARIO IZQUIERDO --- */}
        <form className="flex-1 space-y-10" onSubmit={handleConfirmPurchase}>
          {/* 1. INFORMACIÓN DE CONTACTO */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Información de contacto
            </h2>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-[#00A651]">
                  <UserIcon size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Sesión iniciada como
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Correo electrónico para recibir las entradas
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none transition-all"
                  placeholder="ejemplo@email.com"
                  required
                />
              </div>
            )}
          </section>

          {/* 2. FORMA DE PAGO */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Forma de pago</h2>
            <div className="grid gap-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    selectedPaymentMethod === method.id
                      ? 'border-[#00A651] bg-[#00A651]/5 dark:bg-[#00A651]/10'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method.id ? 'border-[#00A651]' : 'border-slate-300 dark:border-slate-600'}`}
                  >
                    {selectedPaymentMethod === method.id && (
                      <div className="w-2.5 h-2.5 bg-[#00A651] rounded-full" />
                    )}
                  </div>

                  <method.icon
                    className={`w-6 h-6 ${selectedPaymentMethod === method.id ? 'text-[#00A651]' : 'text-slate-400'}`}
                  />

                  <div className="flex-1">
                    <span className="block font-semibold text-slate-900 dark:text-white">
                      {method.label}
                    </span>
                    {method.subtitle && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {method.subtitle}
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* 3. DATOS FISCALES */}
          <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Certificado Fiscal
            </h2>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${requestFiscalCertificate ? 'bg-[#00A651] border-[#00A651]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#00A651]'}`}
              >
                {requestFiscalCertificate && (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                )}
              </div>
              <input
                type="checkbox"
                checked={requestFiscalCertificate}
                onChange={(e) => setRequestFiscalCertificate(e.target.checked)}
                className="sr-only"
              />
              <span className="text-slate-700 dark:text-slate-300 group-hover:text-[#00A651] transition-colors">
                Quiero solicitar certificado fiscal de donación
              </span>
            </label>

            {requestFiscalCertificate && (
              <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
                {isAuthenticated && (
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setFiscalMode('saved')}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${fiscalMode === 'saved' ? 'bg-white dark:bg-slate-700 text-[#00A651] shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Mis datos guardados
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiscalMode('new')}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${fiscalMode === 'new' ? 'bg-white dark:bg-slate-700 text-[#00A651] shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Usar nuevos datos
                    </button>
                  </div>
                )}

                {fiscalMode === 'saved' && isAuthenticated ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setFiscalDropdownOpen(!fiscalDropdownOpen)}
                      className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#00A651] transition-colors"
                    >
                      <span className="font-medium text-slate-900 dark:text-white">
                        {user?.nombre || 'Usuario'} - 12345678A (Principal)
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform ${fiscalDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {fiscalDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-10">
                        <div className="p-2 text-sm text-slate-500 italic text-center">
                          No hay más direcciones guardadas.
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        NIF / CIF *
                      </label>
                      <input
                        type="text"
                        value={fiscalNif}
                        onChange={(e) => setFiscalNif(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#00A651] outline-none"
                        placeholder="12345678A"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Nombre / Razón Social *
                      </label>
                      <input
                        type="text"
                        value={fiscalName}
                        onChange={(e) => setFiscalName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#00A651] outline-none"
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        value={fiscalAddress}
                        onChange={(e) => setFiscalAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#00A651] outline-none"
                        placeholder="Calle, número..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        value={fiscalCity}
                        onChange={(e) => setFiscalCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#00A651] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        value={fiscalZip}
                        onChange={(e) => setFiscalZip(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#00A651] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </form>

        {/* --- RESUMEN DERECHO (Sticky en Desktop) --- */}
        <aside className="lg:w-[400px] shrink-0 h-fit lg:sticky lg:top-24 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resumen</h2>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.type}</p>
                  </div>
                  <button className="text-slate-400 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-1">
                  {getItemBreakdown(item).map((bd, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">{bd.label}</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {bd.amount}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold text-sm">
                    <span className="text-slate-900 dark:text-white">Subtotal</span>
                    <span className="text-[#00A651]">{calculateItemTotal(item).toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-end mb-6">
              <span className="text-lg text-slate-600 dark:text-slate-300">Total a pagar</span>
              <span className="text-3xl font-extrabold text-[#00A651]">
                {calculateGrandTotal().toFixed(2)}€
              </span>
            </div>

            <button
              onClick={handleConfirmPurchase}
              disabled={isProcessing}
              className={`w-full py-4 text-lg font-bold text-white rounded-xl shadow-lg transition-all transform active:scale-95 ${
                isProcessing
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#00A651] hover:bg-[#008a43] hover:shadow-[#00A651]/30'
              }`}
            >
              {isProcessing ? 'Procesando...' : 'Confirmar y Pagar'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 flex justify-center items-center gap-1">
              <Check size={12} /> Pago 100% Seguro y Encriptado
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
