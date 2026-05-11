import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/components/seo/json-ld';
import { getAllPosts } from '@/lib/blog/posts';
import { breadcrumbLd } from '@/lib/landing/jsonld';
import { getSiteUrl, SITE } from '@/lib/site';
import { SiteShell } from '@/modules/landing/components/site-shell';

export const metadata: Metadata = {
  title: 'Blog — vodiči o NBS IPS QR i plaćanjima u Srbiji',
  description:
    'Vodiči i objašnjenja o IPS QR kodu, šiframa plaćanja, modelu poziva na broj 97, kako platiti EPS struju, Infostan, kredit i druge račune u Srbiji.',
  alternates: { canonical: '/blog' },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const base = getSiteUrl();

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Početna', url: `${base}/` },
          { name: 'Blog', url: `${base}/blog` },
        ])}
      />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand text-xs font-semibold tracking-wider uppercase">
            {SITE.name} · Blog
          </p>
          <h1 className="font-display mt-3 text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            Vodiči o IPS QR plaćanjima u Srbiji
          </h1>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Šifre plaćanja, model poziva na broj, kako platiti struju ili Infostan QR kodom.
            Praktična uputstva, bez zavlačenja.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="border-border bg-card rounded-2xl border p-8 text-center">
            <p className="text-muted-foreground text-sm">
              Još nema objavljenih članaka. Vraćaj se uskoro.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group border-border bg-card shadow-card hover:shadow-card-lg block h-full rounded-2xl border p-6 transition-all"
                >
                  <p className="text-brand text-[11px] font-semibold tracking-wider uppercase">
                    {post.category}
                  </p>
                  <h2 className="text-foreground group-hover:text-brand mt-2 text-lg leading-tight font-semibold tracking-tight transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {post.description}
                  </p>
                  <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
                    <time dateTime={post.datePublished}>
                      {new Date(post.datePublished).toLocaleDateString('sr-Latn-RS', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span>{post.readingTimeMinutes} min čitanja</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteShell>
  );
}
