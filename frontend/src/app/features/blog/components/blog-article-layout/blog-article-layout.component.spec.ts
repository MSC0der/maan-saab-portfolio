import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogArticleLayoutComponent } from './blog-article-layout.component';

describe('BlogArticleLayoutComponent', () => {
  let component: BlogArticleLayoutComponent;
  let fixture: ComponentFixture<BlogArticleLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogArticleLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogArticleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
