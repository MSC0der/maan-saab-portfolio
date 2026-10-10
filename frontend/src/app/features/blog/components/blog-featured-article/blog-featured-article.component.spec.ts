import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ArticleDataService } from '../../services/article-data.service';
import { BlogFeaturedArticleComponent } from './blog-featured-article.component';

describe('BlogFeaturedArticleComponent', () => {
  let fixture: ComponentFixture<BlogFeaturedArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogFeaturedArticleComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogFeaturedArticleComponent);
    fixture.detectChanges();
  });

  it('shows the featured article from the data, not hard-coded copy', () => {
    const featured = TestBed.inject(ArticleDataService).featuredArticle;
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('h2')?.textContent?.trim()).toBe(featured.title);
    expect(el.querySelector('.featured-meta')?.textContent).toContain(
      featured.publishedAt,
    );
  });

  it('links to the featured article', () => {
    const featured = TestBed.inject(ArticleDataService).featuredArticle;
    const link: HTMLAnchorElement | null =
      fixture.nativeElement.querySelector('a.primary-btn');

    expect(link?.getAttribute('href')).toBe(`/blog/${featured.slug}`);
  });
});
