import * as React from 'react';
import { cn } from '../../lib/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-sm font-semibold leading-none font-["Arimo"]',
      'text-slate-900 dark:text-slate-100', // ← FIX: Colores para dark mode
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      'transition-colors duration-200',
      className,
    )}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };
