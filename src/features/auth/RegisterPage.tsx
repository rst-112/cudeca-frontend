import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';

const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterPageProps {
  onSwitch?: () => void;
}

export default function RegisterPage({ onSwitch }: RegisterPageProps) {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        nombre: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <Link to="/" className="relative z-10 block">
          {/* Logo for Light Mode */}
          <img
            src="/src/assets/ImagenLogoCudecaLigth.png"
            alt="Fundación Cudeca"
            className="h-16 mx-auto mb-4 hover:opacity-80 transition-opacity dark:hidden"
          />
          {/* Logo for Dark Mode */}
          <img
            src="/src/assets/ImagenLogoCudecaDark.png"
            alt="Fundación Cudeca"
            className="h-16 mx-auto mb-4 hover:opacity-80 transition-opacity hidden dark:block"
          />
        </Link>

        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white mb-1.5 font-['Arimo'] text-left">
          Regístrate
        </h1>
        <p className="text-slate-500/80 dark:text-slate-400/80 text-base font-['Arimo'] text-left">
          ¿Tienes cuenta?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-bold text-[#00A651] hover:text-[#008a43] hover:underline transition-colors cursor-pointer"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="name"
            className="font-['Arimo'] text-slate-700 dark:text-slate-300 font-medium"
          >
            Nombre*
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            className={`bg-[#F4F4F4] dark:bg-slate-800 border-0 font-['Arimo'] ${errors.name ? 'ring-2 ring-red-500/20 bg-red-50 dark:bg-red-950/10' : ''}`}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400 font-['Arimo'] flex items-center gap-1">
              <span className="text-red-500">⚠</span> {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="font-['Arimo'] text-slate-700 dark:text-slate-300 font-medium"
          >
            Correo Electrónico*
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className={`bg-[#F4F4F4] dark:bg-slate-800 border-0 font-['Arimo'] ${errors.email ? 'ring-2 ring-red-500/20 bg-red-50 dark:bg-red-950/10' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 font-['Arimo'] flex items-center gap-1">
              <span className="text-red-500">⚠</span> {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="font-['Arimo'] text-slate-700 dark:text-slate-300 font-medium"
          >
            Contraseña*
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`bg-[#F4F4F4] dark:bg-slate-800 border-0 font-['Arimo'] pr-10 ${errors.password ? 'ring-2 ring-red-500/20 bg-red-50 dark:bg-red-950/10' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400 font-['Arimo'] flex items-center gap-1">
              <span className="text-red-500">⚠</span> {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="font-['Arimo'] text-slate-700 dark:text-slate-300 font-medium"
          >
            Confirmar Contraseña*
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`bg-[#F4F4F4] dark:bg-slate-800 border-0 font-['Arimo'] pr-10 ${errors.confirmPassword ? 'ring-2 ring-red-500/20 bg-red-50 dark:bg-red-950/10' : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 dark:text-red-400 font-['Arimo'] flex items-center gap-1">
              <span className="text-red-500">⚠</span> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2.5">
            <Checkbox id="terms" {...register('terms')} className="mt-0.5" />
            <Label
              htmlFor="terms"
              className="text-sm text-slate-500/90 dark:text-slate-400/90 font-['Arimo'] font-normal cursor-pointer leading-relaxed"
            >
              Acepto los{' '}
              <a
                href="#"
                className="text-[#00A651] hover:underline hover:text-[#008a43] font-medium transition-colors"
              >
                Términos
              </a>{' '}
              y la{' '}
              <a
                href="#"
                className="text-[#00A651] hover:underline hover:text-[#008a43] font-medium transition-colors"
              >
                Política de Privacidad
              </a>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600 dark:text-red-400 font-['Arimo'] flex items-center gap-1">
              <span className="text-red-500">⚠</span> {errors.terms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-bold font-['Arimo'] text-lg h-auto py-3 mt-2 bg-[#00A651] hover:bg-[#008a43] text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00A651] focus-visible:ring-offset-2"
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </Button>

        <Button
          variant="outline"
          asChild
          className="w-full font-bold font-['Arimo'] text-lg h-auto py-3 mt-3 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Link to="/">Entrar como invitado</Link>
        </Button>
      </form>
    </div>
  );
}
