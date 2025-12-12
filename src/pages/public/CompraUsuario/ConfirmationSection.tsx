import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';

export const ConfirmationSection = () => {
  const navigate = useNavigate();
  const userEmail = 'usuario.logueado@email.com';

  const handleViewPurchases = () => {
    navigate('/perfil');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <section className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Título de la página */}
      <h1 className="text-lg text-slate-500 dark:text-slate-400 mb-6 font-['Arimo']">
        Confirmación compra usuario
      </h1>

      {/* Card principal */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-4 border-[#00bcd4] p-12 space-y-8">
        {/* Header de confirmación */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#00bcd4]" strokeWidth={2.5} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center font-['Arimo']">
              ¡Gracias por su colaboración!
            </h2>
          </div>
          <p className="text-xl font-bold text-[#00753e] text-center font-['Arimo']">
            Tu pago ha sido procesado correctamente.
          </p>
        </div>

        {/* Información del pedido */}
        <div className="space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 text-center font-['Arimo']">
            Estamos procesando tu pedido y generando las entradas.
          </p>

          <p className="text-base text-slate-700 dark:text-slate-300 text-center font-['Arimo']">
            En unos instantes, recibirás un correo electrónico con todos los detalles en:
          </p>

          {/* Email destacado */}
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
              <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-['Arimo']">
              {userEmail}
            </p>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-['Arimo']">
            (Revisa tu carpeta de spam si no lo ves en 5 minutos)
          </p>
        </div>

        {/* Separador */}
        <hr className="border-t border-slate-200 dark:border-slate-700" />

        {/* Sección de perfil */}
        <div className="space-y-3">
          <p className="text-xl font-bold text-slate-900 dark:text-white text-center font-['Arimo']">
            Puedes ver esta compra y todas tus entradas en tu perfil.
          </p>

          {/* Botones de acción */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-[#00753e] border-2 border-[#00753e] rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00753e] focus:ring-offset-2 transition-colors font-['Arimo']"
              aria-label="Volver a la página anterior"
            >
              Volver
            </button>

            <button
              type="button"
              onClick={handleViewPurchases}
              className="px-8 py-3 bg-[#00753e] text-white rounded-2xl shadow-md hover:bg-[#005a30] focus:outline-none focus:ring-2 focus:ring-[#00753e] focus:ring-offset-2 transition-colors font-['Arimo']"
              aria-label="Ver mis compras"
            >
              Mis compras
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
