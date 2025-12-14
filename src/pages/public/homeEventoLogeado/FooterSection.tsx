import React from "react";

export const FooterSection = (): JSX.Element => {
  const quickLinks = [
    { text: "Sobre Nosotros" },
    { text: "Nuestros Servicios" },
    { text: "Cómo Ayudar" },
  ];

  const eventLinks = [
    { text: "Próximos Eventos" },
    { text: "Eventos Pasados" },
  ];

  const contactInfo = [
    { text: "Calle Virgen de la Peña, 7" },
    { text: "29602 Marbella, Málaga" },
    { text: "Tel: +34 952 56 47 10", href: "tel:+34952564710" },
    { text: "info@cudeca.org", href: "mailto:info@cudeca.org" },
  ];

  const legalLinks = [
    { text: "Política de Privacidad" },
    { text: "Términos y Condiciones" },
  ];

  return (
    <footer className="w-full bg-slate-900 dark:bg-black text-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold [font-family:'Arimo-Bold',Helvetica]">
              Fundación Cudeca
            </h2>
            <p className="text-sm text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
              Cuidados paliativos con corazón para Málaga y Costa del Sol desde
              1992.
            </p>
          </div>

          <nav className="flex flex-col gap-4" aria-label="Enlaces Rápidos">
            <h3 className="text-base font-bold [font-family:'Arimo-Bold',Helvetica]">
              Enlaces Rápidos
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
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
              Eventos
            </h3>
            <ul className="flex flex-col gap-2">
              {eventLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
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
              Contacto
            </h3>
            <div className="flex flex-col gap-2 text-sm text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
              {contactInfo.map((info, index) => (
                <div key={index}>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="hover:text-white transition-colors"
                    >
                      {info.text}
                    </a>
                  ) : (
                    <p>{info.text}</p>
                  )}
                </div>
              ))}
            </div>
          </address>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
            © 2025 Fundación Cudeca. Todos los derechos reservados.
          </p>

          <nav className="flex items-center gap-6" aria-label="Legal">
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="text-sm text-slate-400 hover:text-white transition-colors [font-family:'Arimo-Regular',Helvetica]"
              >
                {link.text}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href="#" title="Facebook" className="text-slate-400 hover:text-white transition-colors">
              f
            </a>
            <a href="#" title="Twitter" className="text-slate-400 hover:text-white transition-colors">
              𝕏
            </a>
            <a href="#" title="Instagram" className="text-slate-400 hover:text-white transition-colors">
              📷
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

