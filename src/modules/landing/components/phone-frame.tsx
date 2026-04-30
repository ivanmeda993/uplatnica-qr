import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

/**
 * Stylised phone shell — used to wrap mockup screens on the landing page.
 * Decorative only; does not represent a specific device.
 */
export function PhoneFrame({ children, className, label }: PhoneFrameProps) {
  return (
    <div className={cn('relative mx-auto w-full max-w-[300px]', className)}>
      <div className="from-brand/30 via-brand/8 absolute inset-x-4 -top-4 -bottom-4 rounded-[3rem] bg-gradient-to-br to-transparent blur-2xl" />
      <div className="shadow-card-lg relative overflow-hidden rounded-[2.6rem] border-2 border-neutral-800 bg-neutral-950 p-2">
        <div className="bg-background relative overflow-hidden rounded-[2.1rem]">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-neutral-950" />
          {/* Status bar pad */}
          <div className="h-9" aria-hidden />
          {children}
        </div>
      </div>
      {label && (
        <div className="mt-4 text-center">
          <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
