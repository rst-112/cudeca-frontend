import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { apiClient } from '../../services/api';
import { toast } from 'sonner';
import logoLight from '../../assets/ImagenLogoCudecaLigth.png';
import logoDark from '../../assets/ImagenLogoCudecaDark.png';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

const schema = z.object({
  email: z.string().email('Email inválido'),
});

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await apiClient.post('/auth/forgot-password', data);
      setIsSent(true);
      toast.success('Solicitud procesada');
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión', { description: 'Inténtalo de nuevo más tarde' });
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-4 font-['Arimo'] relative">
        {/* Botón Tema */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-[#00A651] w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
            Revisa tu correo
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Si existe una cuenta asociada a ese email, recibirás las instrucciones en unos momentos.
          </p>
          <Button asChild className="w-full bg-[#00A651] hover:bg-[#008a43]">
            <Link to="/login">Volver al Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-4 font-['Arimo'] relative">
      {/* Botón Tema */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-8 animate-in fade-in zoom-in-95">
        <div className="text-center">
          <div className="inline-block group relative h-16 w-48 mx-auto mb-4">
            <img
              src={logoLight}
              alt="Cudeca"
              className="absolute inset-0 h-full w-full object-contain opacity-100 dark:opacity-0 transition-opacity duration-300"
            />
            <img
              src={logoDark}
              alt="Cudeca"
              className="absolute inset-0 h-full w-full object-contain opacity-0 dark:opacity-100 transition-opacity duration-300"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Recuperar contraseña
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#00A651] hover:bg-[#008a43] mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" /> Enviando...
              </span>
            ) : (
              'Enviar enlace'
            )}
          </Button>
        </form>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-500 hover:text-[#00A651] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} /> Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
