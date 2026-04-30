import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'ring-offset-background focus-visible:ring-ring inline-flex touch-manipulation items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 select-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.15em] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_2px_6px_-1px_oklch(0_0_0/0.12)] hover:shadow-[0_4px_12px_-2px_oklch(0_0_0/0.18)]',
        brand:
          'bg-brand text-brand-foreground shadow-[0_4px_14px_-2px_oklch(0.62_0.18_155/0.45)] hover:shadow-[0_6px_20px_-2px_oklch(0.62_0.18_155/0.55)] hover:brightness-105',
        soft: 'bg-brand-soft text-foreground hover:bg-brand-soft/80 dark:text-brand',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow',
        outline:
          'border-border-strong bg-surface text-foreground hover:bg-muted hover:border-foreground/20 border',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted hover:text-foreground',
        link: 'text-foreground rounded-none underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 text-sm',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-8 text-base font-semibold',
        icon: 'h-11 w-11',
        iconSm: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
