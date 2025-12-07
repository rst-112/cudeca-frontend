import { Link } from 'react-router-dom';

export const PublicPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">CUDECA</h1>
          <Link
            to="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white space-y-8">
          <h2 className="text-5xl font-bold">Bienvenido a CUDECA</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Sistema de gestión de eventos benéficos. Explora nuestros próximos eventos y únete a
            nuestra causa.
          </p>

          {/* Cards de Información */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">Eventos Especiales</h3>
              <p className="text-sm">Cenas benéficas, carreras solidarias y más</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Ayuda a la Comunidad</h3>
              <p className="text-sm">Tu participación marca la diferencia</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Únete a Nosotros</h3>
              <p className="text-sm">Forma parte de nuestra misión solidaria</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mt-12">
            <Link
              to="/eventos-publicos"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-lg"
            >
              Ver Eventos
            </Link>
            <a
              href="https://cudeca.org"
              target="_blank"
              rel="noreferrer"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition text-lg"
            >
              Sobre CUDECA
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full bg-white/10 backdrop-blur-sm p-4 text-white text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} CUDECA - Fundación Benéfica. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};
