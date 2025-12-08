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

const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
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
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        nombre: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('¡Registro exitoso!', {
        description: 'Bienvenido a CUDECA',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Error al registrarse', {
        description: error instanceof Error ? error.message : 'No se pudo completar el registro',
      });
    }
  };

  return (
    <div className="w-full space-y-7">
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
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-['Arimo'] tracking-tight">
          Regístrate gratis
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-['Arimo'] leading-relaxed">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-bold text-[#00A651] hover:text-[#008a43] dark:text-[#00d66a] dark:hover:text-[#00A651] underline underline-offset-4 decoration-2 transition-all duration-200 hover:scale-105 inline-block cursor-pointer"
            aria-label="Cambiar a formulario de inicio de sesión"
          >
            Inicia sesión
          </button>
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label="Formulario de registro"
      >
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo*</Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            className={errors.name ? 'border-red-500' : ''}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <span aria-hidden="true">⚠</span> {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico*</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className={errors.email ? 'border-red-500' : ''}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <span aria-hidden="true">⚠</span> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña*</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`pr-12 ${errors.password ? 'border-red-500' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:ring-offset-2 cursor-pointer"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <span aria-hidden="true">⚠</span> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Contraseña*</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:ring-offset-2 cursor-pointer"
              aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <span aria-hidden="true">⚠</span> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Checkbox id="terms" {...register('terms')} className="mt-1" />
            <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
              Acepto los{' '}
              <a href="#" className="text-[#00A651] hover:underline font-semibold">
                Términos
              </a>{' '}
              y la{' '}
              <a href="#" className="text-[#00A651] hover:underline font-semibold">
                Política de Privacidad
              </a>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <span aria-hidden="true">⚠</span> {errors.terms.message}
            </p>
          )}
        </div>

        {/* Submit - VERDE VISIBLE */}
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="default"
          size="lg"
          className="w-full mt-6 shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Crear cuenta"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} aria-hidden="true" />
              Registrando...
            </span>
          ) : (
            'Registrarse'
          )}
        </Button>

        {/* Guest - BORDE VISIBLE */}
        <Button variant="outline" size="lg" asChild className="w-full">
          <Link to="/">Entrar como invitado</Link>
        </Button>
      </form>
    </div>
  );
}
