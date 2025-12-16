import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button
          asChild
          variant="ghost"
          className="mb-8 hover:bg-white/50 dark:hover:bg-slate-800/50"
        >
          <Link to="/" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
        </Button>

        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700/50 p-8 md:p-16 shadow-2xl dark:shadow-slate-950/50">
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-200 dark:border-slate-700/50">
            <div className="p-4 bg-linear-to-br from-amber-500/10 to-amber-600/10 dark:from-amber-500/20 dark:to-amber-600/20 rounded-2xl shadow-lg">
              <Cookie className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                Política de Cookies
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              1. ¿Qué son las Cookies?
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo
              (ordenador, tablet, smartphone) cuando visita nuestra plataforma. Se utilizan para
              mejorar su experiencia de navegación y el funcionamiento del sitio web.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              2. ¿Qué Cookies Utilizamos?
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4">
              Cookies Estrictamente Necesarias (No requieren consentimiento)
            </h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Estas cookies son esenciales para el correcto funcionamiento de la plataforma y no
              pueden ser desactivadas.
            </p>
            <div className="overflow-x-auto my-8 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-lg">
              <table className="min-w-full">
                <thead className="bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50">
                  <tr>
                    <th className="border-b-2 border-slate-200 dark:border-slate-700 px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Cookie
                    </th>
                    <th className="border-b-2 border-slate-200 dark:border-slate-700 px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Finalidad
                    </th>
                    <th className="border-b-2 border-slate-200 dark:border-slate-700 px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Duración
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-900 dark:text-slate-100">
                      auth_token
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      Mantener la sesión del usuario
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      7 días / Persistente*
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-900 dark:text-slate-100">
                      cudeca-cart
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      Guardar el carrito de compras
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      30 días
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-900 dark:text-slate-100">
                      vite-ui-theme
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      Preferencia de tema (claro/oscuro)
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      Persistente
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-slate-600 dark:text-slate-400">
              * Persistente si activa "Recuérdame", de lo contrario, solo durante la sesión.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4">
              Cookies de Rendimiento y Análisis
            </h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Nos ayudan a entender cómo interactúan los usuarios con nuestra plataforma para
              mejorar su funcionamiento.
            </p>
            <div className="overflow-x-auto my-8 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-lg">
              <table className="min-w-full">
                <thead className="bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50">
                  <tr>
                    <th className="border-b-2 border-slate-200 dark:border-slate-700 px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Cookie
                    </th>
                    <th className="border-b-2 border-slate-200 dark:border-slate-700 px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Finalidad
                    </th>
                    <th className="border-b-2 border-slate-200 dark:border-slate-700 px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Duración
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-900 dark:text-slate-100">
                      _ga
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      Google Analytics - Análisis de tráfico
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">2 años</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-900 dark:text-slate-100">
                      _gid
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      Google Analytics - Análisis de sesiones
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      24 horas
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              3. ¿Cómo Gestionar las Cookies?
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Puede configurar su navegador para rechazar todas las cookies o para que le avise
              cuando se envíe una cookie. Sin embargo, algunas funciones de la plataforma podrían no
              funcionar correctamente sin cookies.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4">
              Configuración por Navegador:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00A651] dark:text-green-400 hover:underline font-medium transition-colors"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00A651] dark:text-green-400 hover:underline font-medium transition-colors"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00A651] dark:text-green-400 hover:underline font-medium transition-colors"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00A651] dark:text-green-400 hover:underline font-medium transition-colors"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              4. Cookies de Terceros
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Utilizamos servicios de terceros que pueden establecer sus propias cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Google Analytics:</strong>{' '}
                Para análisis estadísticos del tráfico web.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Pasarelas de pago:</strong>{' '}
                Para procesar transacciones de forma segura (Stripe, PayPal).
              </li>
            </ul>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Estos terceros tienen sus propias políticas de privacidad y cookies sobre las cuales
              no tenemos control.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              5. Actualizaciones de la Política
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Podemos actualizar esta política de cookies periódicamente. Le recomendamos revisarla
              regularmente para estar informado sobre cómo utilizamos las cookies.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              6. Más Información
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Para más detalles sobre cómo tratamos sus datos personales, consulte nuestra{' '}
              <Link
                to="/privacidad"
                className="text-[#00A651] dark:text-green-400 hover:underline font-semibold transition-colors"
              >
                Política de Privacidad
              </Link>
              .
            </p>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Si tiene alguna pregunta sobre nuestra política de cookies, puede contactarnos en:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50">
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100">Email:</strong>{' '}
                <a
                  href="mailto:info@cudeca.org"
                  className="text-[#00A651] dark:text-green-400 hover:underline font-medium transition-colors"
                >
                  info@cudeca.org
                </a>
                <br />
                <strong className="text-slate-900 dark:text-slate-100">Teléfono:</strong>{' '}
                <span className="text-slate-700 dark:text-slate-300">+34 952 564 910</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
