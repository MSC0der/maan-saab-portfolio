export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;

  featured?: boolean;

  heroTitle?: string;

  authorName?: string;
  authorRole?: string;

  heroImage?: string;

  content?: string[];
}
