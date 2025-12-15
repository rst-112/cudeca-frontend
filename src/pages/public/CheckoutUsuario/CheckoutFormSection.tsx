import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Check, Trash2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
// IMPORTANTE: Usamos 'import type' para evitar errores de compilación
import { procesarCheckout } from '@/services/checkout.service';
import type { CheckoutRequest, ItemCheckout } from '@/services/checkout.service';

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
  const { user } = useAuth();

  // --- ESTADOS DEL FORMULARIO ---
  const [email, setEmail] = useState('correodeejemplo@gmail.com');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados para Certificado Fiscal (Lo que pediste recuperar)
  const [requestFiscalCertificate, setRequestFiscalCertificate] = useState(true);
  const [fiscalDropdownOpen, setFiscalDropdownOpen] = useState(false);
  const [selectedFiscalData, setSelectedFiscalData] = useState('saved');

  // Campos editables del certificado fiscal
  const [fiscalNif, setFiscalNif] = useState('12341234A');
  const [fiscalName, setFiscalName] = useState('John Alucín Epark');
  const [fiscalAddress, setFiscalAddress] = useState('Avenida Juan XXIII, 21, 29006');


  // DATOS MOCK (Coinciden con los IDs 1 y 2 que insertamos en SQL)
  const cartItems: CartItem[] = [
    {
      id: '1',
      name: 'Noche de Jazz Solidaria',
      type: 'Asiento normal',
      image: '/image-noche-de-jazz-solidaria.png',
      basePrice: 15.0,
      implicitDonation: 3.0,
      memberDiscount: -1.5,
    },
    {
      id: '2',
      name: 'Gala Benéfica anual',
      type: 'Entrada general',
      image: '/image-gala-ben-fica-anual.png',
      basePrice: 15.0,
      implicitDonation: 5.0,
      memberDiscount: -1.5,
      additionalDonation: 350.0,
    },
  ];

  const paymentMethods = [
    { id: 'credit-card', label: 'Tarjeta de crédito', icon: CreditCard },
    { id: 'paypal', label: 'Paypal', icon: CreditCard },
    { id: 'bizum', label: 'Bizum', icon: CreditCard },
    { id: 'wallet', label: 'Monedero', subtitle: 'Saldo disponible: 36,00€', icon: Wallet },
  ];

  const fiscalDataOptions = [
    { id: 'saved', label: 'Usar mis datos guardados' },
    { id: 'other', label: 'Usar otros datos' },
  ];

  // --- CÁLCULOS ---
  const calculateItemTotal = (item: CartItem): number =>
    item.basePrice + item.implicitDonation + item.memberDiscount + (item.additionalDonation || 0);

  const calculateGrandTotal = (): number =>
    cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const getItemBreakdown = (item: CartItem): PriceBreakdown[] => {
    const breakdown: PriceBreakdown[] = [
      { label: 'Entrada base', amount: `${item.basePrice.toFixed(2)}€` },
      { label: 'Donación Implícita', amount: `${item.implicitDonation.toFixed(2)}€` },
      { label: 'Descuento Socio (10%)', amount: `${item.memberDiscount.toFixed(2)}€` },
    ];
    if (item.additionalDonation) {
      breakdown.push({ label: 'Donación Adicional', amount: `${item.additionalDonation.toFixed(2)}€` });
    }
    return breakdown;
  };

  // --- LÓGICA DE ENVÍO ---
  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // 1. Traducir método de pago
      let metodoPagoBackend = 'TARJETA';
      if (selectedPaymentMethod === 'paypal') metodoPagoBackend = 'PAYPAL';
      if (selectedPaymentMethod === 'bizum') metodoPagoBackend = 'BIZUM';
      if (selectedPaymentMethod === 'wallet') metodoPagoBackend = 'MONEDERO';

      // 2. Preparar Items
      const itemsParaBackend: ItemCheckout[] = cartItems.map(item => ({
        tipo: 'ENTRADA',
        referenciaId: parseInt(item.id),
        cantidad: 1,
        precio: calculateItemTotal(item)
      }));

      // 3. Preparar Datos Fiscales (Si el usuario los pidió)
      const datosFiscalesParaEnviar = requestFiscalCertificate ? {
        nombre: fiscalName,
        nif: fiscalNif,
        direccion: fiscalAddress,
        cp: "29000" // Código postal por defecto o añadir campo si es necesario
      } : undefined;

      // 4. Construir Request
      const request: CheckoutRequest = {
        usuarioId: user?.id || 1,
        emailContacto: email,
        metodoPago: metodoPagoBackend,
        donacionExtra: 0,
        items: itemsParaBackend,
        datosFiscales: datosFiscalesParaEnviar // <--- AQUI VAN LOS DATOS REALES
      };

      console.log("🚀 Enviando compra al backend:", request);

      // 5. Llamada API
      const response = await procesarCheckout(request);

      console.log("✅ Compra exitosa:", response);
      navigate('/dev/compra-usuario', { state: { compraId: response.compraId } });

    } catch (error: any) {
      console.error("❌ Error al procesar:", error);
      // Mostramos el error del backend si existe (ej: "TipoEntrada no encontrado")
      const backendMessage = error.response?.data?.mensaje || error.message;
      alert(`Error: ${backendMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

        {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
        <form className="flex-1 space-y-8" onSubmit={handleConfirmPurchase}>

          {/* 1. CONTACTO */}
          <section className="space-y-4">
            <h2 className="text-2xl font-normal text-slate-900 dark:text-white font-['Arimo']">Información de contacto</h2>
            <p className="text-base text-slate-900 dark:text-slate-300">Enviaremos tus entradas a:</p>
            <input
              type="email"
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded border-2 border-slate-300 dark:border-slate-600 focus:border-[#00a651] outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </section>

          {/* 2. FORMA DE PAGO */}
          <fieldset className="space-y-6">
            <legend className="text-2xl font-normal text-slate-900 dark:text-white font-['Arimo']">Forma de pago</legend>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <label key={method.id} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-[3px] border-[#00a651] bg-white dark:bg-slate-800 flex items-center justify-center">
                    {selectedPaymentMethod === method.id && <div className="w-3 h-3 bg-[#00a651] rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <span className="text-base text-slate-900 dark:text-white font-['Arimo']">{method.label}</span>
                    {method.subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{method.subtitle}</p>}
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* 3. CERTIFICADO FISCAL (LO QUE PEDISTE RECUPERAR) */}
          <section className="space-y-6 pt-8 border-t-2 border-slate-900 dark:border-slate-300">
            <h2 className="text-2xl font-normal text-slate-900 dark:text-white font-['Arimo']">Certificado Fiscal</h2>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requestFiscalCertificate}
                onChange={(e) => setRequestFiscalCertificate(e.target.checked)}
                className="sr-only"
              />
              <div className="flex-shrink-0 w-6 h-6 rounded border-2 border-[#00a651] bg-white dark:bg-slate-800 flex items-center justify-center">
                {requestFiscalCertificate && <Check className="w-4 h-4 text-[#00a651]" strokeWidth={3} />}
              </div>
              <span className="text-base text-slate-900 dark:text-white font-['Arimo']">Solicitar certificado fiscal</span>
            </label>

            {requestFiscalCertificate && (
              <fieldset className="space-y-6">
                {/* Opciones Radio */}
                <div className="space-y-4">
                  {fiscalDataOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="fiscal-data"
                        value={option.id}
                        checked={selectedFiscalData === option.id}
                        onChange={(e) => setSelectedFiscalData(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-shrink-0 w-6 h-6 rounded-full border-[3px] border-[#00a651] bg-white dark:bg-slate-800 flex items-center justify-center">
                        {selectedFiscalData === option.id && <div className="w-3 h-3 bg-[#00a651] rounded-full" />}
                      </div>
                      <span className="text-base text-slate-900 dark:text-white font-['Arimo']">{option.label}</span>
                    </label>
                  ))}
                </div>

                {/* Dropdown Simulado */}
                <div className="space-y-4">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-4 bg-gray-50 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600 hover:border-[#00a651] transition-colors"
                    onClick={() => setFiscalDropdownOpen(!fiscalDropdownOpen)}
                  >
                    <span className="text-base text-slate-900 dark:text-white font-['Arimo']">{fiscalName} ({fiscalNif})</span>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${fiscalDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* CAMPOS DE TEXTO CONECTADOS AL ESTADO */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="nif" className="text-base text-slate-900 dark:text-white font-['Arimo']">NIF <span className="text-[#d94f04]">*</span></label>
                      <input
                        type="text"
                        id="nif"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded border-2 border-slate-300 dark:border-slate-600 focus:border-[#00a651] outline-none"
                        value={fiscalNif}
                        onChange={(e) => setFiscalNif(e.target.value)}
                        required={requestFiscalCertificate}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="nombre" className="text-base text-slate-900 dark:text-white font-['Arimo']">Nombre <span className="text-[#d94f04]">*</span></label>
                      <input
                        type="text"
                        id="nombre"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded border-2 border-slate-300 dark:border-slate-600 focus:border-[#00a651] outline-none"
                        value={fiscalName}
                        onChange={(e) => setFiscalName(e.target.value)}
                        required={requestFiscalCertificate}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="direccion" className="text-base text-slate-900 dark:text-white font-['Arimo']">Dirección <span className="text-[#d94f04]">*</span></label>
                      <input
                        type="text"
                        id="direccion"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded border-2 border-slate-300 dark:border-slate-600 focus:border-[#00a651] outline-none"
                        value={fiscalAddress}
                        onChange={(e) => setFiscalAddress(e.target.value)}
                        required={requestFiscalCertificate}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>
            )}
          </section>
        </form>

        {/* --- COLUMNA DERECHA: RESUMEN --- */}
        <aside className="lg:w-[416px] space-y-6">
          <h2 className="text-2xl font-normal text-slate-900 dark:text-white font-['Arimo']">Resumen del carrito</h2>

          {cartItems.map((item) => (
             <article key={item.id} className="p-4 space-y-4 rounded border-2 border-slate-900 dark:border-slate-300">
                <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                    <div className="flex-1 flex justify-between gap-2">
                        <div className="space-y-1">
                            <h3 className="text-base text-slate-900 dark:text-white font-['Arimo']">{item.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{item.type}</p>
                        </div>
                        <button type="button" className="text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="space-y-1">
                    {getItemBreakdown(item).map((breakdown, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{breakdown.label}</span>
                        <span className="text-slate-900 dark:text-white">{breakdown.amount}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-medium">
                      <span className="text-sm text-slate-900 dark:text-white">Total:</span>
                      <span className="text-sm text-slate-900 dark:text-white">{calculateItemTotal(item).toFixed(2)}€</span>
                    </div>
                </div>
             </article>
          ))}

          <div className="space-y-6 pt-6 border-t-2 border-slate-900 dark:border-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-normal text-slate-900 dark:text-white font-['Arimo']">Total:</span>
              <span className="text-3xl text-slate-900 dark:text-white font-['Arimo']">{calculateGrandTotal().toFixed(2)}€</span>
            </div>

            <button
              type="button"
              onClick={(e) => handleConfirmPurchase(e)}
              disabled={isProcessing}
              className={`w-full h-[60px] text-white text-lg font-['Arimo'] rounded transition-colors ${
                  isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00a651] hover:bg-[#008a43]'
              }`}
            >
              {isProcessing ? 'Procesando...' : `Confirmar compra ${calculateGrandTotal().toFixed(2)}€`}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};