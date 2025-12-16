import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
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
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 dark:from-green-500/20 dark:to-green-600/20 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-[#00A651] dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                Términos y Condiciones de Uso
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-slate-600 dark:text-slate-400">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              1. Aceptación de los Términos
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Al acceder y utilizar la plataforma de eventos de la Fundación Cudeca, usted acepta
              estar legalmente vinculado por estos términos y condiciones de uso. Si no está de
              acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              2. Uso de la Plataforma
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Nuestra plataforma permite a los usuarios registrarse, comprar entradas para eventos
              solidarios y realizar donaciones para apoyar los cuidados paliativos que ofrece
              Fundación Cudeca.
            </p>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Al utilizar nuestros servicios, usted se compromete a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>Proporcionar información veraz y actualizada durante el registro</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso</li>
              <li>No utilizar la plataforma para fines ilícitos o no autorizados</li>
              <li>
                No intentar acceder a áreas restringidas o interferir con el funcionamiento del
                sistema
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              3. Compra de Entradas
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Al adquirir entradas para eventos de Cudeca, usted acepta las siguientes condiciones:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Precios:</strong> Los precios
                mostrados incluyen todos los impuestos aplicables y gastos de gestión (5%).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Pago:</strong> Aceptamos
                pagos mediante tarjeta de crédito/débito y monedero virtual. Todos los pagos son
                procesados de forma segura.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Entrega:</strong> Las
                entradas se enviarán al correo electrónico proporcionado en formato PDF descargable.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Cancelaciones:</strong> Las
                entradas no son reembolsables, excepto en caso de cancelación del evento por parte
                de Cudeca.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              4. Donaciones
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Las donaciones realizadas a través de nuestra plataforma son voluntarias y van
              destinadas íntegramente a financiar los programas de cuidados paliativos gratuitos de
              Fundación Cudeca.
            </p>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Todas las donaciones son deducibles fiscalmente según la legislación vigente. Podrá
              solicitar un certificado fiscal en el momento de realizar la donación.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              5. Protección de Datos
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              El tratamiento de sus datos personales se realiza conforme a nuestra{' '}
              <Link
                to="/privacidad"
                className="text-[#00A651] dark:text-green-400 hover:underline font-semibold"
              >
                Política de Privacidad
              </Link>
              . Sus datos se utilizarán exclusivamente para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>Gestionar su registro y acceso a la plataforma</li>
              <li>Procesar compras de entradas y donaciones</li>
              <li>Enviar comunicaciones relacionadas con eventos (si así lo autoriza)</li>
              <li>Emitir certificados fiscales cuando corresponda</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              6. Propiedad Intelectual
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Todos los contenidos de esta plataforma (textos, imágenes, logotipos, diseños) son
              propiedad de Fundación Cudeca y están protegidos por las leyes de propiedad
              intelectual e industrial vigentes.
            </p>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Queda prohibida la reproducción, distribución o modificación de cualquier contenido
              sin autorización expresa.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              7. Limitación de Responsabilidad
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Fundación Cudeca no será responsable de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>Interrupciones temporales del servicio por mantenimiento o causas técnicas</li>
              <li>Errores en la información proporcionada por terceros</li>
              <li>Pérdida de datos debido a problemas técnicos fuera de nuestro control</li>
              <li>Daños indirectos derivados del uso de la plataforma</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              8. Modificaciones
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los
              cambios entrarán en vigor inmediatamente tras su publicación en la plataforma. Es
              responsabilidad del usuario revisar periódicamente estos términos.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              9. Legislación Aplicable
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Estos términos se rigen por la legislación española. Cualquier controversia se
              someterá a los tribunales de Málaga, España.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              10. Contacto
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Para cualquier consulta relacionada con estos términos, puede contactarnos en:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50">
              <p className="text-slate-700 dark:text-slate-300 space-y-2">
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
                <br />
                <strong className="text-slate-900 dark:text-slate-100">Dirección:</strong>{' '}
                <span className="text-slate-700 dark:text-slate-300">
                  Avda. del Cosmos s/n, 29631 Benalmádena, Málaga, España
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
