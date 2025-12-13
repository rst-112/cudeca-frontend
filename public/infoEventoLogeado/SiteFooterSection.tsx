import React from "react";

export const SiteFooterSection = (): JSX.Element => {
  const footerData = {
    organization: {
      name: "Fundación Cudeca",
      description:
        "Cuidados paliativos con corazón para Málaga y Costa del Sol desde 1992.",
    },
    quickLinks: {
      title: "Enlaces Rápidos",
      links: [
        { text: "Sobre Nosotros", href: "#sobre-nosotros" },
        { text: "Nuestros Servicios", href: "#servicios" },
        { text: "Cómo Ayudar", href: "#ayudar" },
      ],
    },
    events: {
      title: "Eventos",
      links: [
        { text: "Próximos Eventos", href: "#proximos-eventos" },
        { text: "Eventos Pasados", href: "#eventos-pasados" },
      ],
    },
    contact: {
      title: "Contacto",
      details: [
        { text: "Calle Virgen de la Peña, 7" },
        { text: "29602 Marbella, Málaga" },
        { text: "Tel: +34 952 56 47 10", href: "tel:+34952564710" },
        { text: "info@cudeca.org", href: "mailto:info@cudeca.org" },
      ],
    },
    legal: {
      copyright: "© 2025 Fundación Cudeca. Todos los derechos reservados.",
      links: [
        { text: "Política de Privacidad", href: "#privacidad" },
        { text: "Términos y Condiciones", href: "#terminos" },
      ],
    },
  };

  return (
    <footer className="w-full bg-slate-900 dark:bg-black text-white py-12 px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold [font-family:'Arimo-Bold',Helvetica]">
              {footerData.organization.name}
            </h2>
            <p className="text-sm text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
              {footerData.organization.description}
            </p>
          </div>

          <nav
            className="flex flex-col gap-4"
            aria-label="Enlaces rápidos"
          >
            <h3 className="text-base font-bold [font-family:'Arimo-Bold',Helvetica]">
              {footerData.quickLinks.title}
            </h3>
            <ul className="flex flex-col gap-2">
              {footerData.quickLinks.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors [font-family:'Arimo-Regular',Helvetica]"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="flex flex-col gap-4" aria-label="Eventos">
            <h3 className="text-base font-bold [font-family:'Arimo-Bold',Helvetica]">
              {footerData.events.title}
            </h3>
            <ul className="flex flex-col gap-2">
              {footerData.events.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors [font-family:'Arimo-Regular',Helvetica]"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <address className="flex flex-col gap-4 not-italic">
            <h3 className="text-base font-bold [font-family:'Arimo-Bold',Helvetica]">
              {footerData.contact.title}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
              {footerData.contact.details.map((detail, index) => (
                <div key={index}>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="hover:text-white transition-colors"
                    >
                      {detail.text}
                    </a>
                  ) : (
                    <p>{detail.text}</p>
                  )}
                </div>
              ))}
            </div>
          </address>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
            {footerData.legal.copyright}
          </p>

          <nav className="flex items-center gap-6" aria-label="Legal">
            {footerData.legal.links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors [font-family:'Arimo-Regular',Helvetica]"
              >
                {link.text}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#"
              title="Facebook"
              className="text-slate-400 hover:text-white transition-colors"
            >
              f
            </a>
            <a
              href="#"
              title="Twitter"
              className="text-slate-400 hover:text-white transition-colors"
            >
              𝕏
            </a>
            <a
              href="#"
              title="Instagram"
              className="text-slate-400 hover:text-white transition-colors"
            >
              📷
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

