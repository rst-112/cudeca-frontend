import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A651] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#00A651] text-white hover:bg-[#008a43] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-[#F29325] text-white hover:bg-[#d97f1d] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
        destructive:
          'bg-[#D94F04] text-white hover:bg-[#b84103] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:border-slate-500 shadow-sm',
        ghost:
          'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100',
        link: 'text-[#00A651] underline-offset-4 hover:underline dark:text-[#00d66a]',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 rounded-md px-4 text-xs',
        lg: 'h-14 rounded-lg px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
