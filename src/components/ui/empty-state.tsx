import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border-strong bg-surface/50 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center',
        className
      )}
    >
      {Icon && (
        <div className="bg-brand-soft text-brand flex size-12 items-center justify-center rounded-2xl">
          <Icon className="size-6" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="text-muted-foreground max-w-sm text-sm text-pretty">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
