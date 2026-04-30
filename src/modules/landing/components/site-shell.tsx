import type { ReactNode } from 'react';

import { LandingFooter } from './landing-footer';
import { SiteHeader } from './site-header';

interface SiteShellProps {
  children: ReactNode;
  /** Background variant — defaults to bg-mesh-soft for content pages */
  variant?: 'soft' | 'hero' | 'plain';
}

const VARIANT_BG = {
  soft: 'bg-mesh-soft',
  hero: 'bg-mesh-hero',
  plain: '',
} as const;

export function SiteShell({ children, variant = 'soft' }: SiteShellProps) {
  return (
    <div className={`${VARIANT_BG[variant]} flex min-h-dvh flex-col`}>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
