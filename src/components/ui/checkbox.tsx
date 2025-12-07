import * as React from 'react';
import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          'peer h-5 w-5 shrink-0 rounded border-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer',
          'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-[#00A651]/50 checked:bg-[#00A651] checked:border-[#00A651] accent-[#00A651]',
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
