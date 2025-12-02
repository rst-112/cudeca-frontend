import * as React from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

// Mantenemos esto como 'type' para evitar el error del linter
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        // Estado para controlar si se ve la contraseña o no
        const [showPassword, setShowPassword] = React.useState(false);

        // Comprobamos si el input es de tipo contraseña
        const isPasswordType = type === 'password';

        return (
            <div className="relative">
                <input
                    // Si es password y el usuario activó "ver", cambiamos tipo a "text"
                    type={isPasswordType && showPassword ? 'text' : type}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-cudeca-gris-borde bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-cudeca-gris-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cudeca-verde focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-cudeca-gris-disabled/20 disabled:opacity-50',
                        // Si es contraseña, añadimos padding extra a la derecha para que el texto no se monte sobre el icono
                        isPasswordType ? 'pr-10' : '',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />

                {/* Solo mostramos el botón del ojo si el tipo es password */}
                {isPasswordType && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cudeca-gris-texto hover:text-cudeca-verde transition-colors"
                        tabIndex={-1} // Para que no moleste al navegar con tabulador
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">
                            {showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                        </span>
                    </button>
                )}
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
