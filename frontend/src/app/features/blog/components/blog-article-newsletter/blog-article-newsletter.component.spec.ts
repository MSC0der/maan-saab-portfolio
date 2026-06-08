import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogArticleNewsletterComponent } from './blog-article-newsletter.component';

describe('BlogArticleNewsletterComponent', () => {
  let component: BlogArticleNewsletterComponent;
  let fixture: ComponentFixture<BlogArticleNewsletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogArticleNewsletterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogArticleNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
