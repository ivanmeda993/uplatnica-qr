import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import readingTime from 'reading-time';

import type { Post, PostFrontmatter, PostSummary } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

async function listSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    return files.filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw e;
  }
}

async function readPostFile(slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;
    if (fm.draft) return null;
    const stats = readingTime(content);
    return {
      ...fm,
      slug,
      content,
      readingTimeMinutes: Math.max(1, Math.round(stats.minutes)),
      wordCount: stats.words,
    };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw e;
  }
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const slugs = await listSlugs();
  const posts = await Promise.all(slugs.map(readPostFile));
  return posts
    .filter((p): p is Post => p !== null)
    .map(({ content: _content, ...summary }) => summary)
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return readPostFile(slug);
}

export async function getRelatedPosts(slug: string, n = 3): Promise<PostSummary[]> {
  const all = await getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, n);
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score:
        (p.category === current.category ? 2 : 0) +
        (p.keywords?.filter((k) => current.keywords?.includes(k)).length ?? 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map(({ post }) => post);
}
