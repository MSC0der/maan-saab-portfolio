import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogRelatedArticlesComponent } from './blog-related-articles.component';

describe('BlogRelatedArticlesComponent', () => {
  let component: BlogRelatedArticlesComponent;
  let fixture: ComponentFixture<BlogRelatedArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogRelatedArticlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogRelatedArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
