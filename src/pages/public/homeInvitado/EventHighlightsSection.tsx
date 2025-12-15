import React from "react";
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  price: string;
}

const eventsData: Event[] = [
  {
    id: 1,
    title: "Concierto Solidario Rock",
    date: "15 Nov",
    location: "Málaga",
    price: "Desde 12€",
  },
  {
    id: 2,
    title: "Cena Benéfica de Gala",
    date: "20 Nov",
    location: "Marbella",
    price: "Desde 45€",
  },
  {
    id: 3,
    title: "Noche de Jazz Solidaria",
    date: "22 Nov",
    location: "Torremolinos",
    price: "Desde 18€",
  },
  {
    id: 4,
    title: "Festival Familiar Solidario",
    date: "25 Nov",
    location: "Fuengirola",
    price: "Desde 8€",
  },
  {
    id: 5,
    title: "Teatro por la Esperanza",
    date: "28 Nov",
    location: "Benalmádena",
    price: "Desde 15€",
  },
  {
    id: 6,
    title: "Concierto Benéfico de Navidad",
    date: "02 Dic",
    location: "Málaga",
    price: "Desde 20€",
  },
];

export const EventHighlightsSection = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white [font-family:'Arimo-Bold',Helvetica]">
            Próximos Eventos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base [font-family:'Arimo-Regular',Helvetica]">
            Descubre todas las formas de apoyar a Fundación Cudeca
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {eventsData.map((event) => (
            <article
              key={event.id}
              className="flex flex-col gap-3 p-0 bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-5xl">
                🎭
              </div>

              <div className="flex flex-col gap-3 p-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base [font-family:'Arimo-Bold',Helvetica]">
                  {event.title}
                </h3>

                <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <time>{event.date}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <address className="not-italic">{event.location}</address>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {event.price}
                  </span>
                  <button
                    onClick={() => navigate("/evento-invitado")}
                    className="px-4 py-2 bg-[#00753e] dark:bg-[#00a651] hover:bg-[#006835] dark:hover:bg-[#008a43] text-white font-semibold rounded-lg transition-all text-sm [font-family:'Arimo-Regular',Helvetica]"
                    aria-label={`Comprar entradas para ${event.title}`}
                  >
                    Entradas
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
