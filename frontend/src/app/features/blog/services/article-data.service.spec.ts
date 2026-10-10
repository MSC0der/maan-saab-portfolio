import { TestBed } from '@angular/core/testing';

import { ARTICLES } from '../data/articles.data';
import { estimateReadTime } from '../data/articles/article-blocks';
import { ArticleDataService } from './article-data.service';

describe('ArticleDataService', () => {
  let service: ArticleDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleDataService);
  });

  it('lists every article when no topic is selected', () => {
    expect(service.filteredArticles().length).toBe(ARTICLES.length);
  });

  it('filters by topic and back to all', () => {
    service.selectTopic('Angular');
    const angular = service.filteredArticles();
    expect(angular.length).toBeGreaterThan(0);
    expect(angular.every((a) => a.filters.includes('Angular'))).toBeTrue();

    service.selectTopic('All');
    expect(service.filteredArticles().length).toBe(ARTICLES.length);
  });

  it('only offers filter chips that have at least one article', () => {
    for (const { topic } of service.filterOptions) {
      if (topic !== 'All') {
        expect(ARTICLES.some((a) => a.filters.includes(topic))).toBeTrue();
      }
    }
  });

  it('never lists an article as related to itself', () => {
    for (const article of ARTICLES) {
      const related = service.getRelated(article.slug, 3);
      expect(related.length).toBe(3);
      expect(related.some((r) => r.slug === article.slug)).toBeFalse();
    }
  });

  it('puts the article sharing the most topics first', () => {
    const rbac = service.getRelated('building-rbac-in-express', 1)[0];
    expect(rbac.slug).toBe('jwt-vs-session-authentication');
  });

  it('gives every article unique, complete content and a date', () => {
    const slugs = new Set(ARTICLES.map((a) => a.slug));
    expect(slugs.size).toBe(ARTICLES.length);

    for (const article of ARTICLES) {
      expect(article.sections.length).toBeGreaterThan(3);
      expect(article.takeaways.length).toBeGreaterThan(0);
      expect(article.publishedAt).toMatch(/^[A-Z][a-z]{2} \d{2}, \d{4}$/);
    }
  });

  it('computes read time from the body instead of a hand-typed label', () => {
    for (const article of ARTICLES) {
      expect(article.readTime).toBe(estimateReadTime(article.sections));
    }
  });

  it('pairs hero stat labels with live numbers', () => {
    const stats = service.heroStats([{ label: 'A' }, { label: 'B' }]);
    expect(stats[0].value).toBe(String(ARTICLES.length));
    expect(stats.length).toBe(2);
  });
});
