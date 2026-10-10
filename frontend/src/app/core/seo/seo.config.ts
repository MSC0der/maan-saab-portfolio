// Pure data and helpers (no Angular imports) so the runtime SeoService and the
// build-time scripts/generate-seo.mjs both read the same single source of truth.

export const SITE_URL = 'https://maan-saab-portfolio.pages.dev';
export const SITE_NAME = 'Ranbir Singh Maan';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_IMAGE_ALT =
  'Ranbir Singh Maan, backend-focused full stack engineer';

export interface SeoConfig {
  /** Full document title, already including the site name. */
  readonly title: string;
  readonly description: string;
  /** Route path starting with "/", e.g. "/project/paperscraft". */
  readonly path: string;
  readonly type?: 'website' | 'article';
  readonly noindex?: boolean;
  /** ISO date, for articles. */
  readonly publishedTime?: string;
  readonly jsonLd?: Record<string, unknown>;
}

export const HOME_TITLE = `${SITE_NAME} | Backend-Focused Full Stack Engineer`;

const withSite = (page: string): string => `${page} | ${SITE_NAME}`;

export const STATIC_SEO = {
  home: {
    title: HOME_TITLE,
    description:
      'Ranbir Singh Maan is a backend-focused full stack engineer building secure APIs, authentication systems and production web apps with Node.js, Angular and MongoDB. Open to full-time roles.',
    path: '/',
  },
  about: {
    title: withSite('About'),
    description:
      'About Ranbir Singh Maan: a full stack engineer focused on backend systems, authentication, role-based access and payment integrations, with production experience in Node.js, Angular and MongoDB.',
    path: '/about',
  },
  projects: {
    title: withSite('Projects'),
    description:
      'Case studies and client work by Ranbir Singh Maan: a security compliance system, a garage management platform, a real-time chat app, e-commerce builds and more.',
    path: '/projects',
  },
  blog: {
    title: withSite('Blog'),
    description:
      'Engineering articles on REST API design, JWT vs session authentication, RBAC in Express, MongoDB and SQL performance, Redis caching and Angular performance.',
    path: '/blog',
  },
  contact: {
    title: withSite('Contact'),
    description:
      'Get in touch with Ranbir Singh Maan about full-time backend or full stack roles, freelance projects and collaborations.',
    path: '/contact',
  },
} as const satisfies Record<string, SeoConfig>;

const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

/** "Oct 02, 2026" -> "2026-10-02". Returns undefined if it cannot be parsed. */
export function toIsoDate(display: string): string | undefined {
  const match = /^([A-Za-z]{3})[a-z]*\s+(\d{1,2}),\s*(\d{4})$/.exec(display.trim());
  if (!match) {
    return undefined;
  }
  const month = MONTHS.indexOf(match[1].toLowerCase());
  if (month < 0) {
    return undefined;
  }
  return `${match[3]}-${String(month + 1).padStart(2, '0')}-${match[2].padStart(2, '0')}`;
}

/** Search snippets cut off around 155 characters. */
function clip(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) {
    return clean;
  }
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

export function projectSeo(project: {
  slug: string;
  title: string;
  category: string;
  summary: string;
}): SeoConfig {
  return {
    title: withSite(`${project.title} case study`),
    description: clip(`${project.category}: ${project.summary}`),
    path: `/project/${project.slug}`,
  };
}

export function articleSeo(article: {
  slug: string;
  title: string;
  heroTitle?: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}): SeoConfig {
  const path = `/blog/${article.slug}`;
  const publishedTime = toIsoDate(article.publishedAt);
  const headline = article.heroTitle ?? article.title;

  return {
    title: withSite(article.title),
    description: clip(article.excerpt),
    path,
    type: 'article',
    publishedTime,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline,
      description: article.excerpt,
      articleSection: article.category,
      ...(publishedTime ? { datePublished: publishedTime } : {}),
      image: DEFAULT_IMAGE,
      mainEntityOfPage: `${SITE_URL}${path}`,
      author: { '@type': 'Person', name: SITE_NAME, url: `${SITE_URL}/` },
    },
  };
}

export const notFoundSeo = (what: string, path: string): SeoConfig => ({
  title: withSite(`${what} not found`),
  description: `This ${what.toLowerCase()} does not exist.`,
  path,
  noindex: true,
});
