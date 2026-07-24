import { ArrowUpRight, Code2 } from 'lucide-react';

import { TrackedPortfolioLink } from '@/components/seo/tracked-portfolio-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AUTHOR } from '@/lib/site';

export function CreatorCard() {
  return (
    <aside className="mt-8" aria-labelledby="creator-card-heading">
      <Card className="relative overflow-hidden shadow-none">
        <div className="bg-brand absolute inset-y-0 left-0 w-1" aria-hidden="true" />
        <CardContent className="p-5 pl-6 sm:p-6 sm:pl-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div
              className="bg-brand-soft text-brand flex size-11 shrink-0 items-center justify-center rounded-2xl"
              aria-hidden="true"
            >
              <Code2 className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-brand text-[11px] font-semibold tracking-wider uppercase">
                Full-stack product developer
              </p>
              <h2
                id="creator-card-heading"
                className="text-foreground font-display mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl"
              >
                Kako je Uplatnica napravljena?
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
                Ivan Milićević je dizajnirao i razvio Uplatnicu QR, od NBS IPS i MOD 97 validacije
                do offline PWA podrške, privatnosti i kompletnog product iskustva.
              </p>
              <Button variant="outline" size="sm" asChild className="mt-5 w-full sm:w-fit">
                <TrackedPortfolioLink
                  href={AUTHOR.caseStudyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  placement="article_creator"
                >
                  Pogledaj tehnički case study
                  <ArrowUpRight aria-hidden="true" />
                </TrackedPortfolioLink>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
