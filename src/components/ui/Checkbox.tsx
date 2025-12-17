import * as React from 'react';
import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          'peer h-5 w-5 shrink-0 rounded border-2 cursor-pointer',
          'transition-all duration-200 ease-in-out',
          // Light mode
          'border-slate-300 bg-white hover:border-[#00A651]/50',
          // Dark mode
          'dark:border-slate-600 dark:bg-slate-800 dark:hover:border-[#00A651]/70',
          // Checked state (ambos modos)
          'checked:bg-[#00A651] checked:border-[#00A651]',
          'checked:dark:bg-[#00A651] checked:dark:border-[#00A651]',
          // Focus
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00A651]/20',
          'dark:focus-visible:ring-[#00A651]/30',
          // Disabled
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
