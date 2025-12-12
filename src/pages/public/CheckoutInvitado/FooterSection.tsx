import { Link } from 'react-router-dom';

export const FooterSection = () => {
  const quickLinks = [
    { text: 'Sobre Nosotros', path: '/about' },
    { text: 'Nuestros Servicios', path: '/servicios' },
    { text: 'Cómo Ayudar', path: '/ayudar' },
    { text: 'Voluntariado', path: '/voluntariado' },
  ];

  const events = [
    { text: 'Próximos Eventos', path: '/eventos' },
    { text: 'Eventos Pasados', path: '/eventos/pasados' },
    { text: 'Organizar Evento', path: '/eventos/organizar' },
    { text: 'Patrocinios', path: '/patrocinios' },
  ];

  const contactInfo = [
    { text: 'Calle Virgen de la Peña, 7' },
    { text: '29602 Marbella, Málaga' },
    { text: 'Tel: +34 952 56 47 10' },
    { text: 'info@cudeca.org', isEmail: true },
  ];

  const legalLinks = [
    { text: 'Política de Privacidad', path: '/privacidad' },
    { text: 'Términos y Condiciones', path: '/terminos' },
    { text: 'Cookies', path: '/cookies' },
  ];

  return (
    <footer className="w-full bg-[#162810] text-white py-12 mt-16">
      <div className="container mx-auto px-8">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Fundación */}
          <div>
            <h2 className="text-lg font-bold mb-4 font-['Arimo']">Fundación Cudeca</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cuidados paliativos con corazón para Málaga y Costa del Sol desde 1992.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <nav aria-label="Enlaces Rápidos">
            <h3 className="text-base font-bold mb-4 font-['Arimo']">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Columna 3: Eventos */}
          <nav aria-label="Eventos">
            <h3 className="text-base font-bold mb-4 font-['Arimo']">Eventos</h3>
            <ul className="space-y-2">
              {events.map((event, index) => (
                <li key={index}>
                  <Link
                    to={event.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {event.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Columna 4: Contacto */}
          <address className="not-italic">
            <h3 className="text-base font-bold mb-4 font-['Arimo']">Contacto</h3>
            <ul className="space-y-2">
              {contactInfo.map((info, index) => (
                <li key={index}>
                  {info.isEmail ? (
                    <a
                      href={`mailto:${info.text}`}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {info.text}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">{info.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </address>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-slate-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-slate-400">
              © 2025 Fundación Cudeca. Todos los derechos reservados.
            </p>

            {/* Enlaces legales */}
            <nav className="flex gap-6" aria-label="Legal">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
