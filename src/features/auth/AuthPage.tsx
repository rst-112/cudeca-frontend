import { useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import campaignImage from '../../assets/FotoLogin.png';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';

  const handleSwitch = (path: string) => {
    navigate(path);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
      {/* Botón Tema - Fijo arriba a la derecha */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Contenedor Principal */}
      <div className="relative w-full h-full flex bg-background">
        {/* === CAPA DE FORMULARIOS (Ocupan el 43.75% de ancho) === */}

        {/* 1. Formulario REGISTRO (Aparece a la IZQUIERDA cuando la imagen se va a la derecha) */}
        <div
          className={`
            absolute top-0 left-0 h-full 
            w-full lg:w-[43.75%] 
            flex items-center justify-center p-8 
            bg-background 
            transition-all duration-700
            ${
              !isLogin
                ? 'opacity-100 translate-x-0 z-10'
                : 'opacity-0 -translate-x-[20%] z-0 pointer-events-none'
            }
        `}
        >
          <div className="w-full max-w-md">
            <RegisterPage onSwitch={() => handleSwitch('/login')} />
          </div>
        </div>

        {/* 2. Formulario LOGIN (Aparece a la DERECHA cuando la imagen está a la izquierda) */}
        <div
          className={`
            absolute top-0 right-0 h-full 
            w-full lg:w-[43.75%] 
            flex items-center justify-center p-8 
            bg-background 
            transition-all duration-700
            ${
              isLogin
                ? 'opacity-100 translate-x-0 z-10'
                : 'opacity-0 translate-x-[20%] z-0 pointer-events-none'
            }
        `}
        >
          <div className="w-full max-w-md">
            <LoginPage onSwitch={() => handleSwitch('/registro')} />
          </div>
        </div>

        {/* === PANEL DE IMAGEN (Ocupa el 56.25% de ancho) === */}
        <div
          className={`
            hidden lg:block
            absolute top-0 left-0 h-full 
            w-[56.25%]
            z-20
            shadow-2xl
            overflow-hidden
            transform transition-transform duration-[800ms] cubic-bezier(0.65, 0, 0.35, 1)
          `}
          style={{
            // 77.7778% es la relación exacta para mover un bloque de 56.25% al borde derecho (43.75% restante)
            transform: isLogin ? 'translateX(0)' : 'translateX(77.7778%)',
            // Borde redondeado dinámico
            borderRadius: isLogin ? '0 2.5rem 2.5rem 0' : '2.5rem 0 0 2.5rem',
          }}
        >
          {/* Imagen interna */}
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-[800ms] cubic-bezier(0.65, 0, 0.35, 1)"
            style={{
              // Eliminamos el translate negativo en el registro para evitar que se corte la derecha
              transform: 'translateX(0)',
            }}
          >
            <img
              src={campaignImage}
              alt="Campaña Eres Pieza Clave"
              // object-left-top: ANCLA la imagen arriba a la izquierda.
              // Esto asegura que el texto "Eres pieza clave" y la cara no se corten nunca.
              className="w-full h-full object-cover object-left-top"
            />

            {/* Overlay sutil para unificar tonos si la imagen es muy clara */}
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20 mix-blend-multiply" />
          </div>
        </div>

        {/* --- VISTA MÓVIL (Simple Stack) --- */}
        <div className="lg:hidden absolute inset-0 bg-background flex flex-col p-4 overflow-y-auto z-30">
          <div className="flex-1 flex items-center justify-center">
            {isLogin ? (
              <LoginPage onSwitch={() => handleSwitch('/registro')} />
            ) : (
              <RegisterPage onSwitch={() => handleSwitch('/login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
