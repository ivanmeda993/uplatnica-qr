import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

interface MarkdownProps {
  content: string;
  className?: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <article
      className={cn(
        'prose prose-neutral dark:prose-invert max-w-none',
        'prose-headings:font-display prose-headings:tracking-tight prose-headings:text-balance',
        'prose-h2:mt-12 prose-h2:scroll-mt-24 prose-h3:mt-8 prose-h3:scroll-mt-24',
        'prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-foreground prose-pre:text-background prose-pre:rounded-2xl',
        'prose-blockquote:border-brand prose-blockquote:not-italic prose-blockquote:font-normal',
        'prose-table:text-sm prose-th:bg-muted',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h2: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h2 id={slugify(text)} {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h3 id={slugify(text)} {...props}>
                {children}
              </h3>
            );
          },
          a: ({ href = '', children, ref: _ref, ...props }) => {
            const isExternal = /^https?:\/\//.test(href);
            if (isExternal) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              );
            }
            return (
              <Link href={href} {...props}>
                {children}
              </Link>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
