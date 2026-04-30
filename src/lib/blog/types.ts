export interface PostFrontmatter {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  category: 'Vodič' | 'Reference' | 'Tutorijal' | 'Objašnjenje';
  keywords?: ReadonlyArray<string>;
  draft?: boolean;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingTimeMinutes: number;
  wordCount: number;
}

export interface PostSummary extends PostFrontmatter {
  slug: string;
  readingTimeMinutes: number;
  wordCount: number;
}
