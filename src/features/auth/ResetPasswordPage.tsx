import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { apiClient, isAxiosError } from '../../services/api'; // Asegúrate de importar isAxiosError
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle'; // Importamos el Toggle

// Regex mejorado: Escapamos los caracteres especiales para evitar ambigüedades
// Lista permitida: @ # $ % ^ & + = ! ? *
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!?*])(?=\S+$).*$/;

const schema = z
  .object({
    password: z
      .string()
      .trim() // 1. Elimina espacios accidentales al inicio/final
      .min(1, 'La contraseña no puede estar vacía.')
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(
        PASSWORD_REGEX,
        'La contraseña debe contener una mayúscula, una minúscula, un número y un carácter especial (@#$%^&+=!?*).',
      ),

    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // Estados independientes para visualizar contraseñas
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange', // 2. Validar mientras se escribe para mejor feedback visual
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-4 relative font-['Arimo']">
        {/* Botón Tema */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <div className="text-center bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-red-100 dark:border-red-900/20 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-500 mb-2">Enlace inválido</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Falta el token de seguridad o el enlace está roto.
          </p>
          <Button asChild variant="link" className="mt-4 text-[#00A651]">
            <Link to="/login">Ir al Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        newPassword: data.password,
      });
      toast.success('¡Contraseña actualizada correctamente!');
      navigate('/login');
    } catch (error) {
      let msg = 'Error al restablecer la contraseña';

      // 3. Manejo mejorado del error para mostrar el mensaje específico del backend
      if (isAxiosError(error) && error.response?.data) {
        const responseData = error.response.data as { error?: string; message?: string };
        // El backend puede devolver el error en 'error' (tu ejemplo) o 'message'
        msg = responseData.error || responseData.message || msg;
      }

      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-4 font-['Arimo'] relative">
      {/* Botón Tema */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in-95">
        <div className="text-center">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nueva Contraseña</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Introduce tu nueva clave segura
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Nueva contraseña</Label>
            <div className="relative">
              <Input
                type={showPass ? 'text' : 'password'}
                {...register('password')}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer p-1"
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">
                {String(errors.password.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Confirmar contraseña</Label>
            <div className="relative">
              <Input
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer p-1"
                tabIndex={-1}
              >
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">
                {String(errors.confirmPassword.message)}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#00A651] hover:bg-[#008a43] text-white mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" /> Guardando...
              </span>
            ) : (
              'Guardar nueva contraseña'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
