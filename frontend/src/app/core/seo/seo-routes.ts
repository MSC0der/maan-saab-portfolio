// Build-time entry: every indexable route with its SEO config. Bundled by
// scripts/generate-seo.mjs to produce sitemap.xml and per-route HTML shells.
import { ARTICLES } from '../../features/blog/data/articles.data';
import { PROJECTS } from '../../features/projects/data/projects.data';
import {
  articleSeo,
  projectSeo,
  SeoConfig,
  SITE_URL,
  STATIC_SEO,
} from './seo.config';

export { SITE_URL };

export interface SeoRoute extends SeoConfig {
  /** ISO date for sitemap <lastmod>, when known. */
  readonly lastmod?: string;
}

export const SEO_ROUTES: readonly SeoRoute[] = [
  ...Object.values(STATIC_SEO),
  ...PROJECTS.map((project) => projectSeo(project)),
  ...ARTICLES.map((article) => {
    const seo = articleSeo(article);
    return { ...seo, lastmod: seo.publishedTime };
  }),
];
