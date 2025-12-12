const footerData = {
  organization: {
    name: 'Fundación Cudeca',
    description: 'Cuidados paliativos con corazón para Málaga y Costa del Sol desde 1992.',
  },
  quickLinks: {
    title: 'Enlaces Rápidos',
    links: ['Sobre Nosotros', 'Nuestros Servicios', 'Cómo Ayudar'],
  },
  events: {
    title: 'Eventos',
    links: ['Próximos Eventos', 'Eventos Pasados'],
  },
  contact: {
    title: 'Contacto',
    details: [
      'Calle Virgen de la Peña, 7',
      '29602 Marbella, Málaga',
      'Tel: +34 952 56 47 10',
      'info@cudeca.org',
    ],
  },
  copyright: '© 2025 Fundación Cudeca. Todos los derechos reservados.',
  legal: ['Política de Privacidad', 'Términos y Condiciones'],
};

export const FooterSection = () => {
  return (
    <footer className="bg-[#162810] text-white mt-auto">
      <div className="container mx-auto px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-4 gap-8 mb-8">
          {/* Organization Info */}
          <div>
            <h2 className="text-lg font-bold mb-4 font-['Arimo']">
              {footerData.organization.name}
            </h2>
            <p className="text-sm text-gray-400 font-['Arimo']">
              {footerData.organization.description}
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Enlaces rápidos">
            <h3 className="text-base font-bold mb-4 font-['Arimo']">
              {footerData.quickLinks.title}
            </h3>
            <ul className="space-y-2">
              {footerData.quickLinks.links.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors font-['Arimo']"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Events */}
          <nav aria-label="Eventos">
            <h3 className="text-base font-bold mb-4 font-['Arimo']">{footerData.events.title}</h3>
            <ul className="space-y-2">
              {footerData.events.links.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors font-['Arimo']"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic">
            <h3 className="text-base font-bold mb-4 font-['Arimo']">{footerData.contact.title}</h3>
            <ul className="space-y-2">
              {footerData.contact.details.map((detail, index) => (
                <li key={index}>
                  {detail.includes('@') ? (
                    <a
                      href={`mailto:${detail}`}
                      className="text-sm text-gray-400 hover:text-white transition-colors font-['Arimo']"
                    >
                      {detail}
                    </a>
                  ) : detail.includes('Tel:') ? (
                    <a
                      href={`tel:${detail.replace('Tel: ', '').replace(/\s/g, '')}`}
                      className="text-sm text-gray-400 hover:text-white transition-colors font-['Arimo']"
                    >
                      {detail}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 font-['Arimo']">{detail}</p>
                  )}
                </li>
              ))}
            </ul>
          </address>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-gray-400 font-['Arimo']">{footerData.copyright}</p>
          <nav className="flex gap-6" aria-label="Legal">
            {footerData.legal.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors font-['Arimo']"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
