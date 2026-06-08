import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogArticleHeroComponent } from './blog-article-hero.component';

describe('BlogArticleHeroComponent', () => {
  let component: BlogArticleHeroComponent;
  let fixture: ComponentFixture<BlogArticleHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogArticleHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogArticleHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
