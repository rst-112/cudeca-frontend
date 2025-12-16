import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Privacy() {
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
            <div className="p-4 bg-linear-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                Política de Privacidad
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-slate-600 dark:text-slate-400">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              1. Responsable del Tratamiento
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-slate-100">FUNDACIÓN CUDECA</strong>
              <br />
              CIF: G-29806519
              <br />
              Dirección: Avda. del Cosmos s/n, 29631 Benalmádena (Málaga), España
              <br />
              Correo: info@cudeca.org
              <br />
              Teléfono: +34 952 564 910
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              2. Finalidad del Tratamiento
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Los datos personales que nos proporciona serán tratados con las siguientes
              finalidades:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Gestión de usuarios:</strong>{' '}
                Crear y gestionar su cuenta de usuario en la plataforma.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">
                  Procesamiento de compras:
                </strong>{' '}
                Tramitar la venta de entradas para eventos solidarios.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">
                  Procesamiento de donaciones:
                </strong>{' '}
                Gestionar las donaciones realizadas y emitir certificados fiscales.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Comunicaciones:</strong>{' '}
                Enviar información sobre eventos, noticias y campañas (solo si ha dado su
                consentimiento).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Cumplimiento legal:</strong>{' '}
                Cumplir con obligaciones fiscales y contables.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              3. Legitimación
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              La base legal para el tratamiento de sus datos es:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-900 dark:text-slate-100">
                  Ejecución de contrato:
                </strong>{' '}
                Para gestionar compras de entradas y suscripciones.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Consentimiento:</strong> Para
                el envío de comunicaciones comerciales y marketing (puede revocar este
                consentimiento en cualquier momento).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Interés legítimo:</strong>{' '}
                Para mejorar nuestros servicios y realizar análisis estadísticos anónimos.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Obligación legal:</strong>{' '}
                Para cumplir con normativas fiscales y contables.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              4. Datos Recogidos
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Recopilamos los siguientes tipos de datos personales:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-900 dark:text-slate-100">
                  Datos de identificación:
                </strong>{' '}
                Nombre, apellidos, email, NIF/NIE.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Datos de contacto:</strong>{' '}
                Dirección postal, teléfono.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Datos de pago:</strong>{' '}
                Información de tarjeta bancaria (procesada mediante pasarela segura, no almacenamos
                datos completos de tarjetas).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Datos de navegación:</strong>{' '}
                Dirección IP, tipo de navegador, cookies (ver nuestra{' '}
                <Link
                  to="/cookies"
                  className="text-[#00A651] dark:text-green-400 hover:underline font-semibold"
                >
                  Política de Cookies
                </Link>
                ).
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              5. Destinatarios de los Datos
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Sus datos pueden ser comunicados a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-900 dark:text-slate-100">
                  Proveedores de servicios:
                </strong>{' '}
                Empresas que nos ayudan a operar la plataforma (hosting, procesamiento de pagos,
                envío de emails).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">
                  Administraciones públicas:
                </strong>{' '}
                Cuando sea requerido por ley (Agencia Tributaria, juzgados).
              </li>
            </ul>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Todos nuestros proveedores están sujetos a acuerdos de confidencialidad y cumplen con
              el RGPD.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              6. Transferencias Internacionales
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Algunos de nuestros proveedores pueden estar ubicados fuera del Espacio Económico
              Europeo (EEE). En esos casos, garantizamos que existen salvaguardas adecuadas
              (Cláusulas Contractuales Tipo aprobadas por la Comisión Europea).
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              7. Conservación de Datos
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Conservaremos sus datos personales durante:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-900 dark:text-slate-100">
                  Usuarios registrados:
                </strong>{' '}
                Mientras mantenga su cuenta activa y hasta 2 años después de su última interacción.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">
                  Compras y donaciones:
                </strong>{' '}
                Durante el plazo legal de conservación (6 años desde la última transacción, según
                normativa fiscal).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">
                  Comunicaciones comerciales:
                </strong>{' '}
                Hasta que revoque su consentimiento.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              8. Derechos del Usuario
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Acceso:</strong> Solicitar
                información sobre los datos que tenemos sobre usted.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Rectificación:</strong>{' '}
                Corregir datos inexactos o incompletos.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Supresión:</strong> Solicitar
                la eliminación de sus datos cuando ya no sean necesarios.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Oposición:</strong> Oponerse
                al tratamiento de sus datos para determinadas finalidades.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Portabilidad:</strong>{' '}
                Recibir sus datos en formato estructurado y transferirlos a otro responsable.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Limitación:</strong>{' '}
                Solicitar la limitación del tratamiento en ciertos casos.
              </li>
            </ul>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Para ejercer estos derechos, envíe un correo a{' '}
              <a
                href="mailto:privacidad@cudeca.org"
                className="text-[#00A651] dark:text-green-400 hover:underline"
              >
                privacidad@cudeca.org
              </a>{' '}
              adjuntando copia de su DNI/NIE.
            </p>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              También puede presentar una reclamación ante la{' '}
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00A651] dark:text-green-400 hover:underline"
              >
                Agencia Española de Protección de Datos (AEPD)
              </a>
              .
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              9. Medidas de Seguridad
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos
              personales contra acceso no autorizado, pérdida, alteración o divulgación:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>Cifrado SSL/TLS en todas las comunicaciones</li>
              <li>Servidores seguros con acceso restringido</li>
              <li>Copias de seguridad regulares</li>
              <li>Control de acceso basado en roles</li>
              <li>Auditorías periódicas de seguridad</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              10. Cookies
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Utilizamos cookies para mejorar su experiencia en nuestra plataforma. Para más
              información, consulte nuestra{' '}
              <Link
                to="/cookies"
                className="text-[#00A651] dark:text-green-400 hover:underline font-semibold"
              >
                Política de Cookies
              </Link>
              .
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              11. Actualizaciones
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Nos reservamos el derecho de modificar esta política en cualquier momento. Le
              notificaremos los cambios significativos por email o mediante aviso en la plataforma.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              12. Contacto
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Para cualquier duda sobre esta política o el tratamiento de sus datos, puede
              contactarnos en:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50">
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100">Email:</strong>{' '}
                <a
                  href="mailto:privacidad@cudeca.org"
                  className="text-[#00A651] dark:text-green-400 hover:underline font-medium transition-colors"
                >
                  privacidad@cudeca.org
                </a>
                <br />
                <strong className="text-slate-900 dark:text-slate-100">Teléfono:</strong>{' '}
                <span className="text-slate-700 dark:text-slate-300">+34 952 564 910</span>
                <br />
                <strong className="text-slate-900 dark:text-slate-100">Correo postal:</strong>{' '}
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
