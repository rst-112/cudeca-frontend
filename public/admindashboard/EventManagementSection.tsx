import React from "react";

interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
  status: {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
  funding: {
    current: string;
    goal: string;
    percentage: number;
  };
  actionIcons?: {
    edit: string;
    pin: string;
    eye: string;
  };
}

export const EventManagementSection = (): JSX.Element => {
  const events: Event[] = [
    {
      id: 1,
      title: "Gala Benéfica Anual 2024",
      date: "15 de Diciembre, 2024 - 19:00h",
      image: "https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?w=200&h=150&fit=crop",
      status: {
        label: "PUBLICADO",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-[#016630] dark:text-green-400",
        borderColor: "border-[#b9f8cf] dark:border-green-600",
      },
      funding: {
        current: "8500€",
        goal: "10.000€",
        percentage: 85,
      },
    },
    {
      id: 2,
      title: "Jornada de Puertas Abiertas",
      date: "22 de Enero, 2025 - 10:00h",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop",
      status: {
        label: "BORRADOR",
        bgColor: "bg-gray-100 dark:bg-gray-700",
        textColor: "text-[#1e2939] dark:text-gray-300",
        borderColor: "border-gray-300 dark:border-gray-600",
      },
      funding: {
        current: "2300€",
        goal: "5000€",
        percentage: 46,
      },
    },
    {
      id: 3,
      title: "Maratón Solidaria Málaga",
      date: "05 de Marzo, 2024 - 08:00h",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=150&fit=crop",
      status: {
        label: "CANCELADO",
        bgColor: "bg-[#ffe2e2] dark:bg-red-900/30",
        textColor: "text-[#9f0712] dark:text-red-400",
        borderColor: "border-[#ffc9c9] dark:border-red-600",
      },
      funding: {
        current: "4200€",
        goal: "15.000€",
        percentage: 28,
      },
    },
    {
      id: 4,
      title: "Concierto de Navidad",
      date: "20 de Diciembre, 2023 - 20:30h",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop",
      status: {
        label: "FINALIZADO",
        bgColor: "bg-[#101828] dark:bg-gray-900",
        textColor: "text-white dark:text-gray-200",
        borderColor: "border-[#101828] dark:border-gray-700",
      },
      funding: {
        current: "12.500€",
        goal: "12.000€",
        percentage: 100,
      },
    },
  ];

  return (
    <section className="mt-1.5 w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="mt-[30px] w-full flex-1 flex flex-col gap-[20px] px-8">
        <header className="w-full flex gap-8 items-center justify-between">
          <h1 className="text-xl font-normal text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
            Gestión de Eventos
          </h1>

          <button
            className="px-6 py-2 flex gap-2 bg-[#00a651] hover:bg-[#008a43] dark:bg-[#00a651] dark:hover:bg-[#008a43] rounded-lg shadow-md hover:shadow-lg text-white font-bold transition-all duration-200 text-sm"
            aria-label="Crear Evento"
          >
            <svg width="20" height="20" viewBox="0 0 20 2" fill="none">
              <line y1="1" x2="20" y2="1" stroke="white" strokeWidth="2" />
            </svg>
            <svg width="2" height="20" viewBox="0 0 2 20" fill="none">
              <line x1="1" x2="1" y2="20" stroke="white" strokeWidth="2" />
            </svg>
            Crear Evento
          </button>
        </header>

        <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto pr-4">
          {events.map((event) => (
            <article
              key={event.id}
              className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
            >
              {/* Imagen del evento */}
              <div className="flex-shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-32 h-28 rounded-lg object-cover"
                />
              </div>

              {/* Contenido principal */}
              <div className="flex-1 flex flex-col gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
                    {event.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
                    {event.date}
                  </p>
                </div>

                {/* Estado y Financiación */}
                <div className="flex gap-6 items-center">
                  {/* Estado */}
                  <div
                    className={`px-4 py-1 rounded-full text-xs font-semibold border ${event.status.bgColor} ${event.status.textColor} ${event.status.borderColor}`}
                  >
                    {event.status.label}
                  </div>

                  {/* Financiación */}
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {event.funding.current} / {event.funding.goal}
                    </span>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-[#00a651] dark:bg-[#00a651] rounded-full h-2 transition-all"
                        style={{ width: `${event.funding.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 text-slate-600 dark:text-slate-400">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Editar">
                      ✏️
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Marcar">
                      📍
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Ver">
                      👁️
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

