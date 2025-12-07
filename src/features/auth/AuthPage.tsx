import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const nextIsLogin = location.pathname === '/login';
    if (nextIsLogin !== isLogin) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsLogin(nextIsLogin);
        setIsAnimating(false);
      }, 700); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isLogin]);

  const handleSwitch = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-slate-950 relative">
      {/* Theme Toggle - Outside blur container */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content Container - Blurs during animation */}
      <div
        className={`relative w-full h-full transition-all duration-700 ${isAnimating ? 'blur-md scale-[0.98]' : 'blur-0 scale-100'}`}
      >
        {/* Image Section - Hidden on mobile, 50% on desktop */}
        <div
          className={`hidden lg:block absolute top-0 bottom-0 w-1/2 transition-all duration-700 ease-in-out z-20 overflow-hidden ${
            isLogin ? 'left-1/2 rounded-l-4xl' : 'left-0 rounded-r-4xl'
          }`}
        >
          <div className="absolute inset-0 bg-black/10 z-10" />
          <img
            src="/src/assets/FotoLogin.png"
            alt="Cudeca Campaign - Eres pieza clave"
            className="h-full w-full object-cover object-left shadow-2xl"
          />
        </div>

        {/* Login Form Wrapper */}
        <div
          className={`absolute top-0 bottom-0 w-full lg:w-1/2 flex flex-col transition-all duration-700 ease-in-out overflow-y-auto ${
            isLogin
              ? 'left-0 opacity-100 z-10'
              : '-left-full lg:left-0 opacity-0 z-0 pointer-events-none'
          }`}
        >
          <div className="w-full max-w-[455px] m-auto py-6 px-8 lg:px-12">
            <LoginPage onSwitch={() => handleSwitch('/registro')} />
          </div>
        </div>

        {/* Register Form Wrapper */}
        <div
          className={`absolute top-0 bottom-0 w-full lg:w-1/2 flex flex-col transition-all duration-700 ease-in-out overflow-y-auto ${
            !isLogin
              ? 'right-0 opacity-100 z-10'
              : '-right-full lg:right-0 opacity-0 z-0 pointer-events-none'
          }`}
        >
          <div className="w-full max-w-[455px] m-auto py-6 px-8 lg:px-12">
            <RegisterPage onSwitch={() => handleSwitch('/login')} />
          </div>
        </div>
      </div>
    </div>
  );
}
