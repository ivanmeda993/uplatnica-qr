import { forwardRef,type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'border-border-strong bg-surface text-foreground flex min-h-[80px] w-full rounded-xl border px-3.5 py-2.5 text-base transition-colors',
          'placeholder:text-muted-foreground/70',
          'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'sm:text-sm',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
