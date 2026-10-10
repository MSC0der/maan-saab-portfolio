import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ARTICLES } from '../../data/articles.data';
import { BlogArticleLayoutComponent } from './blog-article-layout.component';

describe('BlogArticleLayoutComponent', () => {
  let fixture: ComponentFixture<BlogArticleLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogArticleLayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogArticleLayoutComponent);
    fixture.componentRef.setInput('article', ARTICLES[0]);
    fixture.detectChanges();
  });

  it('renders every section of the article', () => {
    const rendered = fixture.nativeElement.querySelectorAll('.article-section');
    expect(rendered.length).toBe(ARTICLES[0].sections.length);
  });

  it('builds a table of contents entry per section', () => {
    const links = fixture.nativeElement.querySelectorAll('.toc a');
    expect(links.length).toBe(ARTICLES[0].sections.length);
    expect(links[0].textContent.trim()).toBe('Introduction');
  });

  it('renders code blocks and tables from the data', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.code-block').length).toBeGreaterThan(0);
    expect(el.querySelectorAll('.table-wrap table').length).toBeGreaterThan(0);
  });
});
