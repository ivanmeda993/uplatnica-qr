import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
  size?: number;
}

/**
 * Brand mark — a stylized "U" formed from a QR-corner finder pattern.
 * Render as a self-contained SVG so it scales cleanly anywhere.
 */
export function Logo({ className, withWordmark = false, size = 28 }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          width="32"
          height="32"
          rx="8"
          fill="oklch(0.18 0.02 250)"
          className="dark:fill-brand"
        />
        <rect x="6" y="6" width="9" height="9" rx="1.5" fill="oklch(0.78 0.22 145)" />
        <rect x="9" y="9" width="3" height="3" rx="0.5" fill="oklch(0.18 0.02 250)" />
        <rect x="17" y="6" width="9" height="9" rx="1.5" fill="oklch(0.78 0.22 145)" />
        <rect x="20" y="9" width="3" height="3" rx="0.5" fill="oklch(0.18 0.02 250)" />
        <rect x="6" y="17" width="9" height="9" rx="1.5" fill="oklch(0.78 0.22 145)" />
        <rect x="9" y="20" width="3" height="3" rx="0.5" fill="oklch(0.18 0.02 250)" />
        <rect x="18" y="18" width="3" height="3" rx="0.5" fill="oklch(0.78 0.22 145)" />
        <rect x="23" y="18" width="3" height="3" rx="0.5" fill="oklch(0.78 0.22 145)" />
        <rect x="18" y="23" width="3" height="3" rx="0.5" fill="oklch(0.78 0.22 145)" />
        <rect x="23" y="23" width="3" height="3" rx="0.5" fill="oklch(0.78 0.22 145)" />
      </svg>
      {withWordmark && (
        <span className="text-[15px] font-semibold tracking-tight">
          Uplatnica<span className="text-brand">.</span>
        </span>
      )}
    </span>
  );
}
