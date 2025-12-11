import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Handshake, Store, Heart } from 'lucide-react';

const volunteerAreas = [
  {
    icon: <Heart size={32} className="text-white" />,
    title: 'Acompañamiento a pacientes',
    description: 'Ofrece tu tiempo para acompañar a pacientes y familiares, brindando apoyo emocional y compañía.',
    bgColor: 'bg-red-500'
  },
  {
    icon: <Store size={32} className="text-white" />,
    title: 'Tiendas benéficas',
    description: 'Colabora en nuestras tiendas benéficas, ayudando en la clasificación de donaciones, atención al cliente y más.',
    bgColor: 'bg-blue-500'
  },
  {
    icon: <Handshake size={32} className="text-white" />,
    title: 'Eventos y campañas',
    description: 'Participa en la organización y desarrollo de nuestros eventos solidarios para recaudar fondos.',
    bgColor: 'bg-green-500'
  }
];

export default function Voluntariado() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-['Arimo']">
          Únete a nuestro equipo de voluntariado
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl mx-auto">
          El voluntariado es el corazón de Cudeca. Tu tiempo y talento son el regalo más valioso que puedes ofrecer. Descubre cómo puedes marcar la diferencia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {volunteerAreas.map((area, index) => (
          <div key={index} className="group p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-6 ${area.bgColor} group-hover:scale-110 transition-transform duration-300`}>
              {area.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-['Arimo']">{area.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{area.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button asChild size="lg" className="bg-[#00A651] hover:bg-[#008a43] text-white text-lg px-8 h-14">
          <Link to="/registro">
            Inscríbete como voluntario <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
