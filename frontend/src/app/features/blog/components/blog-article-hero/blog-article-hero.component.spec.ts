import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ARTICLES } from '../../data/articles.data';

import { BlogArticleHeroComponent } from './blog-article-hero.component';

describe('BlogArticleHeroComponent', () => {
  let component: BlogArticleHeroComponent;
  let fixture: ComponentFixture<BlogArticleHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogArticleHeroComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogArticleHeroComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('article', ARTICLES[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
