import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Checkbox } from '../../components/ui/Checkbox';
import { toast } from 'sonner';
import logoLight from '../../assets/ImagenLogoCudecaLigth.png';
import logoDark from '../../assets/ImagenLogoCudecaDark.png';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginPageProps {
  onSwitch?: () => void;
}

export default function LoginPage({ onSwitch }: LoginPageProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password, data.rememberMe ?? false);
      toast.success('¡Sesión iniciada correctamente!', {
        description: 'Bienvenido de vuelta',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Error al iniciar sesión', {
        description: error instanceof Error ? error.message : 'Credenciales inválidas',
      });
    }
  };

  return (
    <div className="w-full space-y-8 py-4">
      {/* Logo con Transición Suave */}
      <div className="text-center">
        <Link to="/" className="inline-block group relative h-24 w-64 mx-auto">
          {/* Logo para Modo Claro (Verde) */}
          <img
            src={logoLight}
            alt="Fundación Cudeca"
            className={`
              absolute inset-0 h-full w-full object-contain
              transition-all duration-500 ease-in-out
              opacity-100 dark:opacity-0 scale-100 dark:scale-95
              group-hover:scale-105
            `}
          />

          {/* Logo para Modo Oscuro (Blanco) */}
          <img
            src={logoDark}
            alt="Fundación Cudeca"
            className={`
              absolute inset-0 h-full w-full object-contain
              transition-all duration-500 ease-in-out
              opacity-0 dark:opacity-100 scale-95 dark:scale-100
              group-hover:scale-105
            `}
          />
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white font-['Arimo'] tracking-tight">
          Inicia sesión
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-['Arimo'] leading-relaxed">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-bold text-[#00A651] hover:text-[#008a43] dark:text-[#00d66a] dark:hover:text-[#00A651] underline underline-offset-4 decoration-2 transition-all duration-200 hover:scale-105 inline-block cursor-pointer"
            aria-label="Cambiar a formulario de registro"
          >
            Regístrate gratis
          </button>
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        aria-label="Formulario de inicio de sesión"
      >
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className={errors.email ? 'border-red-500 focus:ring-red-200' : ''}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 font-['Arimo']">
              <span className="text-base">⚠</span> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`pr-12 ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:ring-offset-2 cursor-pointer"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 font-['Arimo'] animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="text-base" aria-hidden="true">
                ⚠
              </span>{' '}
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Checkbox id="rememberMe" {...register('rememberMe')} />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-normal text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Recuérdame
            </Label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[#00A651] hover:text-[#008a43] dark:text-[#00d66a] dark:hover:text-[#00A651] transition-colors underline-offset-4 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Submit Button - CON FONDO VERDE VISIBLE */}
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="default"
          size="lg"
          className="w-full mt-8 shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Iniciar sesión"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} aria-hidden="true" />
              Iniciando sesión...
            </span>
          ) : (
            'Entrar'
          )}
        </Button>

        {/* Guest Button - CON BORDE VISIBLE */}
        <Button variant="outline" size="lg" asChild className="w-full">
          <Link to="/">Entrar como invitado</Link>
        </Button>
      </form>
    </div>
  );
}
