import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Calendar, MapPin } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';

export const EventoLogeado: React.FC = () => {
  const navigate = useNavigate();
  const events = [
    {
      title: 'Concierto Solidario Rock',
      date: '15 Ene 2025',
      location: 'Málaga',
      raised: '8500€ / 12.000€',
      price: 'Desde 12€',
      image: '',
    },
    {
      title: 'Cena Benéfica de Gala',
      date: '20 Ene 2025',
      location: 'Marbella',
      raised: '15.000€ / 25.000€',
      price: 'Desde 45€',
      image: '',
    },
    {
      title: 'Festival Familiar Solidario',
      date: '25 Ene 2025',
      location: 'Fuengirola',
      raised: '5200€ / 10.000€',
      price: 'Desde 8€',
      image: '',
    },
    {
      title: 'Teatro por la Esperanza',
      date: '28 Ene 2025',
      location: 'Benalmádena',
      raised: '6800€ / 12.000€',
      price: 'Desde 15€',
      image: '',
    },
    {
      title: 'Noche de Jazz Solidaria',
      date: '02 Feb 2025',
      location: 'Torremolinos',
      raised: '9400€ / 15.000€',
      price: 'Desde 18€',
      image: '',
    },
    {
      title: 'Concierto Benéfico de Navidad',
      date: '05 Feb 2025',
      location: 'Málaga',
      raised: '18.500€ / 20.000€',
      price: 'Desde 20€',
      image: '',
    },
    {
      title: 'Mercadillo Solidario',
      date: '12 Feb 2025',
      location: 'Marbella',
      raised: '3200€ / 8000€',
      price: 'Desde 5€',
      image: '',
    },
    {
      title: 'Cena de San Valentín',
      date: '14 Feb 2025',
      location: 'Fuengirola',
      raised: '11.200€ / 18.000€',
      price: 'Desde 35€',
      image: '',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header isLoggedIn={true} />

      <div className="w-full bg-slate-50 dark:bg-slate-900">
        <section
          className="w-full bg-slate-50 dark:bg-slate-900 py-8 px-8 border-y border-slate-200 dark:border-slate-700"
          aria-label="Upcoming Events Filter Section"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600">
              <Search className="text-slate-500 dark:text-slate-400" />
              <input
                type="search"
                placeholder="Buscar evento..."
                className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none"
                aria-label="Buscar evento"
              />
            </div>

            <nav
              className="flex flex-wrap gap-3"
              aria-label="Event category filters"
            >
              <button
                className="px-6 py-2 rounded-full font-semibold transition-all bg-[#00753e] dark:bg-[#00a651] text-white shadow-lg"
                aria-pressed="true"
                aria-label="Filter by Todos"
              >
                Todos
              </button>
              <button
                className="px-6 py-2 rounded-full font-semibold transition-all bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:shadow-md"
                aria-pressed="false"
                aria-label="Filter by Conciertos"
              >
                Conciertos
              </button>
              <button
                className="px-6 py-2 rounded-full font-semibold transition-all bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:shadow-md"
                aria-pressed="false"
                aria-label="Filter by Cenas"
              >
                Cenas
              </button>
              <button
                className="px-6 py-2 rounded-full font-semibold transition-all bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:shadow-md"
                aria-pressed="false"
                aria-label="Filter by Rifas"
              >
                Rifas
              </button>
              <button
                className="px-6 py-2 rounded-full font-semibold transition-all bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:shadow-md"
                aria-pressed="false"
                aria-label="Filter by Otros"
              >
                Otros
              </button>
            </nav>

            <button
              className="px-6 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg font-semibold hover:shadow-md transition-all flex items-center gap-2"
              aria-label="Filtrar por fecha: Próximos eventos"
              aria-haspopup="listbox"
              aria-expanded="false"
            >
              Fecha: Próximos <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="w-full bg-white dark:bg-slate-900 py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 mb-8">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                Próximos Eventos
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Descubre todas las formas de apoyar a Fundación Cudeca
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {events.map((event, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all flex flex-col">
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl" />
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 uppercase">
                        <span>Recaudado</span>
                        <span className="text-slate-900 dark:text-white font-bold">{event.raised}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2">
                        <div className="h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" style={{ width: '70%' }} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-4 mt-auto">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{event.price}</span>
                      <button
                        onClick={() => navigate('/info-evento-logeado')}
                        className="px-6 py-2 bg-[#00a651] text-white text-sm rounded-full font-semibold hover:bg-[#00753e] transition-all"
                      >
                        Entradas
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-2 mt-12">
              <button className="px-4 py-2 text-slate-600 dark:text-slate-400">« Anterior</button>
              <button className="w-10 h-10 bg-[#00a651] text-white rounded-full font-semibold">1</button>
              <button className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-300 dark:border-slate-600 font-semibold">2</button>
              <button className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-300 dark:border-slate-600 font-semibold">3</button>
              <button className="px-4 py-2 text-slate-600 dark:text-slate-400">Siguiente »</button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default EventoLogeado;
