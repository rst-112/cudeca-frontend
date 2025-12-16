import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Mail, UserPlus, ShoppingBag, Home, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';

export const ConfirmationCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const compraId = location.state?.compraId;
  const emailDestino = location.state?.email || user?.email || 'tu correo';

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Header Verde */}
        <div className="bg-[#00A651] p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-[#00A651]" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">¡Pago Completado!</h1>
          <p className="text-green-100 font-medium text-lg">Gracias por tu colaboración</p>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          {/* Info del Pedido */}
          <div className="text-center space-y-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-widest font-semibold">
              Referencia del Pedido
            </p>
            <p className="text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
              #{compraId || 'CUD-XXXX'}
            </p>
          </div>

          {/* Mensaje de Email */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center gap-3">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm">
              <Mail className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-300 mb-1">
                Hemos enviado tus entradas a:
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white break-all">
                {emailDestino}
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              ¿No lo recibes? Revisa tu carpeta de spam.
            </p>
          </div>

          {/* Acciones Condicionales */}
          <div className="flex flex-col gap-4">
            {isAuthenticated ? (
              // USUARIO LOGUEADO
              <>
                <Button
                  onClick={() => navigate('/perfil?tab=entradas')}
                  className="w-full h-14 text-lg bg-[#00A651] hover:bg-[#008a43] shadow-lg shadow-green-900/10"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" /> Ver Mis Entradas
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full h-14 text-base border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Home className="w-5 h-5 mr-2" /> Volver al Inicio
                </Button>
              </>
            ) : (
              // INVITADO
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 text-center">
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">
                    ¿Quieres guardar tus entradas?
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Crea una cuenta ahora para tener siempre a mano tus entradas y facturas.
                  </p>
                  <Button
                    onClick={() => navigate('/registro')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md border-0"
                  >
                    <UserPlus className="w-4 h-4 mr-2" /> Crear Cuenta Gratis
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="w-full text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Volver al Inicio <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
