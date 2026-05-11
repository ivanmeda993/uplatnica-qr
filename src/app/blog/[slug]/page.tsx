import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Markdown } from '@/components/blog/markdown';
import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog/posts';
import { articleLd, breadcrumbLd } from '@/lib/landing/jsonld';
import { AUTHOR, getSiteUrl } from '@/lib/site';
import { SiteShell } from '@/modules/landing/components/site-shell';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Članak nije pronađen' };
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords ? [...post.keywords] : undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
      authors: [AUTHOR.url],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 3);
  const base = getSiteUrl();

  return (
    <SiteShell>
      <JsonLd
        data={[
          articleLd(post),
          breadcrumbLd([
            { name: 'Početna', url: `${base}/` },
            { name: 'Blog', url: `${base}/blog` },
            { name: post.title, url: `${base}/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-xs"
        >
          <ArrowLeft className="size-3.5" />
          Svi članci
        </Link>

        <header className="mb-10">
          <p className="text-brand text-xs font-semibold tracking-wider uppercase">
            {post.category}
          </p>
          <h1 className="font-display mt-3 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
            {post.description}
          </p>
          <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <time dateTime={post.datePublished}>
                {new Date(post.datePublished).toLocaleDateString('sr-Latn-RS', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {post.readingTimeMinutes} min čitanja
            </span>
            <span>
              Autor:{' '}
              <a
                href={AUTHOR.url}
                target="_blank"
                rel="author noopener noreferrer"
                className="text-foreground hover:text-brand font-medium"
              >
                {AUTHOR.name}
              </a>
            </span>
          </div>
        </header>

        <Markdown content={post.content} />

        <div className="bg-mesh-soft border-border mt-12 rounded-3xl border p-8">
          <h3 className="text-foreground font-display text-2xl font-semibold tracking-tight">
            Generiši svoj IPS QR
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Sačuvaš uplatnicu jednom i sledeće mesece samo otvoriš šablon. Besplatno i bez reklama.
          </p>
          <Button variant="brand" size="lg" asChild className="mt-5">
            <Link href="/register">
              Napravi besplatan nalog
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-foreground mb-4 text-lg font-semibold">
              Povezani članci
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="border-border bg-card hover:border-brand/40 block rounded-xl border p-4 transition-colors"
                  >
                    <p className="text-brand text-[10px] font-semibold tracking-wider uppercase">
                      {p.category}
                    </p>
                    <p className="text-foreground mt-1 text-sm font-semibold">{p.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </SiteShell>
  );
}
