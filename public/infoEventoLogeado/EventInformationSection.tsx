import React from "react";

interface EventMetadata {
  icon: string;
  text: string;
}

interface WhyAttendItem {
  title: string;
  description: string;
}

export const EventInformationSection = (): JSX.Element => {
  const eventMetadata: EventMetadata[] = [
    {
      icon: "📅",
      text: "09 Nov 2025",
    },
    {
      icon: "📍",
      text: "Málaga - Palacio de Congresos",
    },
    {
      icon: "🕐",
      text: "20:00h",
    },
  ];

  const whyAttendItems: WhyAttendItem[] = [
    {
      title: "Impacto directo:",
      description:
        "El 100% de los fondos recaudados se destinan a cuidados paliativos domiciliarios.",
    },
    {
      title: "Velada inolvidable:",
      description:
        "Disfruta de una cena gourmet, música en vivo y un ambiente elegante en el Palacio de Congresos.",
    },
    {
      title: "Comunidad solidaria:",
      description:
        "Conecta con personas que comparten tu pasión por marcar la diferencia en la vida de los demás.",
    },
    {
      title: "Subastas exclusivas:",
      description:
        "Participa en subastas de arte, experiencias únicas y artículos de colección donados por nuestros patrocinadores.",
    },
  ];

  return (
    <article className="flex flex-col gap-8 w-full">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
          Gala Benéfica Anual
        </h1>
      </header>

      <div className="flex flex-col gap-3">
        {eventMetadata.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-xl">{item.icon}</span>
            <p className="text-base text-slate-600 dark:text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
            Objetivo de recaudación
          </h3>
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            60%
          </span>
        </div>

        <div
          className="w-full h-4 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={60}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Objetivo de recaudación 60%"
        >
          <div className="h-full w-3/5 bg-[#00753e] dark:bg-[#00a651] rounded-full" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900 dark:text-white">
              12.500€
            </span>
            <span className="text-slate-600 dark:text-slate-400 text-base">
              de 20.000€
            </span>
          </div>
          <p className="text-base text-slate-600 dark:text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
            ¡Ayúdanos a llegar a la meta para cuidados paliativos!
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
          Sobre el evento
        </h2>

        <div className="flex flex-col gap-4 text-base text-slate-600 dark:text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
          <p className="text-justify leading-relaxed">
            Únete a nosotros en la Gala Benéfica Anual de Cudeca, un evento
            especial diseñado para recaudar fondos vitales que permiten
            continuar brindando cuidados paliativos gratuitos a pacientes y sus
            familias en toda la provincia de Málaga.
          </p>

          <p className="text-justify leading-relaxed">
            Esta noche mágica contará con una cena de gala, actuaciones en
            vivo, subastas solidarias y la oportunidad de conocer las historias
            inspiradoras de quienes se benefician directamente de tu
            generosidad. Cada entrada vendida y cada euro donado representa
            esperanza, dignidad y acompañamiento en los momentos más difíciles.
          </p>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              ¿Por qué asistir?
            </h3>
            <ul className="flex flex-col gap-3">
              {whyAttendItems.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-[#00753e] dark:text-[#00a651] font-bold flex-shrink-0">
                    •
                  </span>
                  <div className="flex flex-col gap-1">
                    <strong className="text-slate-600 dark:text-slate-300">
                      {item.title}
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-3 p-5 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-[#00753e] dark:border-[#00a651]">
        <p className="text-base text-slate-800 dark:text-slate-200 [font-family:'Arimo-Regular',Helvetica]">
          <strong className="font-bold">Tu presencia importa.</strong>
          {" "}
          Cada asiento ocupado es un paso más hacia nuestro objetivo de
          proporcionar cuidados compasivos y profesionales a quienes más lo
          necesitan.
        </p>
      </aside>
    </article>
  );
};

