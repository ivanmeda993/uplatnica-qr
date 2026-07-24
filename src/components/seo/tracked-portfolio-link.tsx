'use client';

import { track } from '@vercel/analytics';
import { type AnchorHTMLAttributes, type ComponentRef, forwardRef } from 'react';

export type PortfolioLinkPlacement =
  | 'article_creator'
  | 'article_byline'
  | 'about_project'
  | 'footer_creator';

interface TrackedPortfolioLinkProps extends AnchorHTMLAttributes<ComponentRef<'a'>> {
  href: string;
  placement: PortfolioLinkPlacement;
}

export const TrackedPortfolioLink = forwardRef<ComponentRef<'a'>, TrackedPortfolioLinkProps>(
  ({ href, onClick, placement, ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      onClick={(event) => {
        track('portfolio_referral_click', { placement });
        onClick?.(event);
      }}
      {...props}
    />
  )
);

TrackedPortfolioLink.displayName = 'TrackedPortfolioLink';
