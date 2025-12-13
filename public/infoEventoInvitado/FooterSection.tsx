import React from "react";
import { useNavigate } from "react-router-dom";

export const FooterSection = (): JSX.Element => {
  const navigate = useNavigate();

  const footerLinks = [
    {
      title: "Información",
      links: ["Quiénes somos", "Cuidados paliativos", "Misión y Visión"],
    },
    {
      title: "Enlaces Rápidos",
      links: ["Donar ahora", "Contáctanos", "Voluntariado"],
    },
    {
      title: "Legal",
      links: ["Política de privacidad", "Términos y condiciones"],
    },
  ];

  return (
    <footer className="w-full bg-slate-900 dark:bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerLinks.map((section, index) => (
            <div key={index} className="flex flex-col gap-4">
              <h3 className="text-base font-bold [font-family:'Arimo-Regular',Helvetica]">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors [font-family:'Arimo-Regular',Helvetica]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
            © 2025 Fundación Cudeca. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-2xl"
              title="Facebook"
            >
              f
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-2xl"
              title="Twitter"
            >
              𝕏
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-2xl"
              title="Instagram"
            >
              📷
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col gap-4">
          <p className="text-xs text-slate-500 text-center [font-family:'Arimo-Regular',Helvetica]">
            Fundación Cudeca es una organización sin ánimo de lucro dedicada a
            proporcionar cuidados paliativos de calidad a pacientes y sus
            familias.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mx-auto px-4 py-2 text-sm text-[#00a651] hover:text-[#00d66a] transition-colors [font-family:'Arimo-Regular',Helvetica] font-semibold"
          >
            ← Volver a inicio
          </button>
        </div>
      </div>
    </footer>
  );
};

