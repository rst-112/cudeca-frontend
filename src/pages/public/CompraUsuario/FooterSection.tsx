
import { Link } from "react-router-dom";

export const FooterSection = () => {
  const footerData = {
    about: {
      title: "Fundación Cudeca",
      description: "Cuidados paliativos con corazón para Málaga y Costa del Sol desde 1992.",
    },
    quickLinks: {
      title: "Enlaces Rápidos",
      links: [
        { text: "Sobre Nosotros", path: "/about" },
        { text: "Nuestros Servicios", path: "/servicios" },
        { text: "Cómo Ayudar", path: "/ayudar" },
      ],
    },
    events: {
      title: "Eventos",
      links: [
        { text: "Próximos Eventos", path: "/eventos" },
        { text: "Eventos Pasados", path: "/eventos/pasados" },
      ],
    },
    contact: {
      title: "Contacto",
      details: [
        { text: "Calle Virgen de la Peña, 7", type: "address" },
        { text: "29602 Marbella, Málaga", type: "address" },
        { text: "Tel: +34 952 56 47 10", type: "phone" },
        { text: "info@cudeca.org", type: "email" },
      ],
    },
    legal: {
      copyright: "© 2025 Fundación Cudeca. Todos los derechos reservados.",
      links: [
        { text: "Política de Privacidad", path: "/privacidad" },
        { text: "Términos y Condiciones", path: "/terminos" },
      ],
    },
  };

  return (
    <footer className="w-full bg-[#162810] text-white py-12 mt-auto">
      <div className="container mx-auto px-8">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Fundación */}
          <div>
            <h2 className="text-lg font-bold mb-4 font-['Arimo']">
              {footerData.about.title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {footerData.about.description}
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <nav aria-label="Enlaces rápidos">
            <h3 className="text-base font-bold mb-4 font-['Arimo']">
              {footerData.quickLinks.title}
            </h3>
            <ul className="space-y-2">
              {footerData.quickLinks.links.map((link, index) => (
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
            <h3 className="text-base font-bold mb-4 font-['Arimo']">
              {footerData.events.title}
            </h3>
            <ul className="space-y-2">
              {footerData.events.links.map((link, index) => (
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

          {/* Columna 4: Contacto */}
          <address className="not-italic">
            <h3 className="text-base font-bold mb-4 font-['Arimo']">
              {footerData.contact.title}
            </h3>
            <ul className="space-y-2">
              {footerData.contact.details.map((detail, index) => (
                <li key={index}>
                  {detail.type === "email" ? (
                    <a
                      href={`mailto:${detail.text}`}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {detail.text}
                    </a>
                  ) : detail.type === "phone" ? (
                    <a
                      href={`tel:${detail.text.replace("Tel: ", "").replace(/\s/g, "")}`}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {detail.text}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">
                      {detail.text}
                    </span>
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
              {footerData.legal.copyright}
            </p>

            {/* Enlaces legales */}
            <nav className="flex gap-6" aria-label="Legal">
              {footerData.legal.links.map((link, index) => (
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

