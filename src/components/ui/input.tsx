import { forwardRef,type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'border-border-strong bg-surface text-foreground flex h-11 w-full rounded-xl border px-3.5 text-base transition-colors',
          'placeholder:text-muted-foreground/70',
          'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'sm:text-sm',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
