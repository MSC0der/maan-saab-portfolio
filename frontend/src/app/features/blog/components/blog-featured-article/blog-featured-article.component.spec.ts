import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogFeaturedArticleComponent } from './blog-featured-article.component';

describe('BlogFeaturedArticleComponent', () => {
  let component: BlogFeaturedArticleComponent;
  let fixture: ComponentFixture<BlogFeaturedArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogFeaturedArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogFeaturedArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
