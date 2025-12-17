import * as React from 'react';
import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          'flex h-12 w-full rounded-lg px-4 py-3 text-base font-["Arimo"]',
          'transition-all duration-200',
          // Light mode
          'bg-white text-slate-900 border-2 border-slate-200',
          'placeholder:text-slate-400',
          // Dark mode
          'dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700',
          'dark:placeholder:text-slate-500',
          // Focus states
          'focus:outline-none focus:ring-4 focus:ring-[#00A651]/20 focus:border-[#00A651]',
          'dark:focus:ring-[#00A651]/30 dark:focus:border-[#00A651]',
          // Hover
          'hover:border-slate-300 dark:hover:border-slate-600',
          // Disabled
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900',
          // Error state (puedes añadir clases condicionales)
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
