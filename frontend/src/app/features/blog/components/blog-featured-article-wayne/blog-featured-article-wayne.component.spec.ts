import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BlogFeaturedArticleWayneComponent } from './blog-featured-article-wayne.component';

describe('BlogFeaturedArticleWayneComponent', () => {
  let component: BlogFeaturedArticleWayneComponent;
  let fixture: ComponentFixture<BlogFeaturedArticleWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogFeaturedArticleWayneComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogFeaturedArticleWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
