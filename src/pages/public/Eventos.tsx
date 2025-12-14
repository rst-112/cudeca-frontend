import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';

// Mock data for events
const events = [
  {
    id: 1,
    title: 'Gala Benéfica Anual',
    date: '25 de Diciembre, 2024',
    location: 'Palacio de Ferias y Congresos, Málaga',
    description: 'Únete a nosotros para una noche de celebración y recaudación de fondos.',
    image: 'https://via.placeholder.com/400x250'
  },
  {
    id: 2,
    title: 'Concierto Solidario',
    date: '15 de Enero, 2025',
    location: 'Teatro Cervantes, Málaga',
    description: 'Disfruta de una noche de música con artistas locales e internacionales.',
    image: 'https://via.placeholder.com/400x250'
  },
  {
    id: 3,
    title: 'Marcha por la Vida',
    date: '10 de Febrero, 2025',
    location: 'Paseo Marítimo, Málaga',
    description: 'Camina con nosotros para apoyar a nuestros pacientes y sus familias.',
    image: 'https://via.placeholder.com/400x250'
  }
];

export default function Eventos() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-['Arimo']">
          Próximos Eventos Solidarios
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Participa en nuestros eventos y ayúdanos a seguir cuidando. Tu presencia es un regalo de esperanza.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.id} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col">
            <div className="overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-['Arimo']">{event.title}</h3>
              <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
                <Calendar size={16} className="mr-2" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-slate-500 dark:text-slate-400 mb-4">
                <MapPin size={16} className="mr-2" />
                <span>{event.location}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow">{event.description}</p>
              <Button asChild className="mt-auto bg-[#00A651] hover:bg-[#008a43] text-white">
                <Link to={`/evento/${event.id}`}>
                  Ver Detalles <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
