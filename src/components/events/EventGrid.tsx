import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
  price: string;
}

interface EventGridProps {
  events: Event[];
}

export const EventGrid = ({ events }: EventGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <Card
          key={event.id}
          className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full border-cudeca-gris-borde/40 bg-white"
        >
          <div className="relative h-56 overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 right-4 z-20">
              <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-cudeca-verde shadow-sm border border-cudeca-verde/10">
                {event.price}
              </span>
            </div>
          </div>

          <CardHeader className="pb-3 grow-0 pt-5">
            <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-cudeca-verde transition-colors">
              {event.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 flex flex-col grow">
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 text-sm text-cudeca-gris-texto">
                <Calendar className="w-4 h-4 text-cudeca-naranja mt-0.5 shrink-0" />
                <span className="font-medium text-gray-700">{event.date}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-cudeca-gris-texto">
                <MapPin className="w-4 h-4 text-cudeca-naranja mt-0.5 shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>

            <p className="text-slate-600 font-light text-sm line-clamp-3 grow">
              {event.description}
            </p>

            <div className="pt-2 mt-auto">
              <Button
                asChild
                className="w-full bg-cudeca-verde hover:bg-cudeca-verde-dark text-white font-semibold h-11 group-hover:translate-y-[-2px] transition-all shadow-md hover:shadow-lg hover:shadow-cudeca-verde/20"
              >
                <Link to={`/evento/${event.id}`}>
                  <span>Comprar Entradas</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
