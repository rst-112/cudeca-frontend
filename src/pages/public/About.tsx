import { Users, Heart, Handshake } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 font-['Arimo']">
            Nuestra Misión
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Añadir vida a los días, a través de nuestra forma especial de cuidar a personas con cáncer y otras enfermedades en estado avanzado, y ofrecer apoyo a sus familias.
          </p>
        </div>

        {/* Our Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900 dark:text-white font-['Arimo']">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="p-6">
              <Heart className="mx-auto h-12 w-12 text-[#00A651] mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Compasión</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Cuidamos con empatía y respeto, reconociendo la dignidad de cada persona.
              </p>
            </div>
            <div className="p-6">
              <Users className="mx-auto h-12 w-12 text-[#00A651] mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Compromiso</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Dedicados a la excelencia en cuidados paliativos, siempre gratuitos.
              </p>
            </div>
            <div className="p-6">
              <Handshake className="mx-auto h-12 w-12 text-[#00A651] mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Comunidad</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Juntos, voluntarios, profesionales y socios, formamos una red de apoyo.
              </p>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 bg-slate-50 dark:bg-slate-900 p-12 rounded-2xl">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-['Arimo']">Nuestra Historia</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Fundada en 1992 por Joan Hunt, Cudeca nació de la promesa de cuidar a los demás. Desde entonces, hemos atendido a más de 17,000 personas en la provincia de Málaga, gracias al incansable apoyo de la comunidad.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Lo que comenzó como un pequeño equipo de voluntarios se ha convertido en un completo programa asistencial con equipos domiciliarios, un centro de día y una unidad de hospitalización.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src="https://www.cudeca.org/wp-content/uploads/2020/03/joan-hunt-y-logo-cudeca.jpg" alt="Joan Hunt, fundadora de Cudeca" className="rounded-lg shadow-lg w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
