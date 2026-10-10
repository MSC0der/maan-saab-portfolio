import { Injectable, computed, signal } from '@angular/core';

import { ARTICLES, BLOG_FILTERS } from '../data/articles.data';
import { Article } from '../models/article.model';

export interface BlogFilterOption {
  /** Canonical topic name, used for filtering. */
  readonly topic: string;
  /** Index into a theme's `filterBar.filters` labels. */
  readonly index: number;
}

const ALL = 'All';

/** Topics that at least one article actually carries (plus "All"). */
const AVAILABLE_FILTERS: readonly BlogFilterOption[] = BLOG_FILTERS.map(
  (topic, index) => ({ topic, index }),
).filter(
  ({ topic }) =>
    topic === ALL || ARTICLES.some((article) => article.filters.includes(topic)),
);

@Injectable({
  providedIn: 'root',
})
export class ArticleDataService {
  readonly articles: readonly Article[] = ARTICLES;
  readonly filterOptions = AVAILABLE_FILTERS;

  readonly selectedTopic = signal(ALL);

  readonly filteredArticles = computed(() => {
    const topic = this.selectedTopic();
    return topic === ALL
      ? ARTICLES
      : ARTICLES.filter((article) => article.filters.includes(topic));
  });

  readonly featuredArticle: Article =
    ARTICLES.find((article) => article.featured) ?? ARTICLES[0];

  /** Live numbers for the blog hero, so they can never go stale. */
  readonly stats = {
    articles: ARTICLES.length,
    topics: BLOG_FILTERS.filter(
      (topic) =>
        topic !== ALL &&
        ARTICLES.some((article) => article.filters.includes(topic)),
    ).length,
    minutes: ARTICLES.reduce(
      (total, article) => total + (parseInt(article.readTime, 10) || 0),
      0,
    ),
    latest: ARTICLES[0].publishedAt.replace(/ \d{1,2},/, ''),
  };

  /** Pairs a theme's stat labels with the real numbers, in order. */
  heroStats(
    labels: readonly { label: string }[],
  ): readonly { label: string; value: string }[] {
    const s = this.stats;
    const values = [String(s.articles), String(s.topics), String(s.minutes), s.latest];
    return labels.map((item, i) => ({ label: item.label, value: values[i] ?? '' }));
  }

  getArticle(slug: string): Article | undefined {
    return ARTICLES.find((article) => article.slug === slug);
  }

  /** Articles sharing the most topics with `slug`, never the article itself. */
  getRelated(slug: string, limit = 3): readonly Article[] {
    const current = this.getArticle(slug);
    const overlap = (article: Article): number =>
      current
        ? article.filters.filter((topic) => current.filters.includes(topic))
            .length
        : 0;

    return ARTICLES.filter((article) => article.slug !== slug)
      .map((article, position) => ({ article, position, score: overlap(article) }))
      .sort((a, b) => b.score - a.score || a.position - b.position)
      .slice(0, limit)
      .map(({ article }) => article);
  }

  selectTopic(topic: string): void {
    this.selectedTopic.set(topic);
  }
}
