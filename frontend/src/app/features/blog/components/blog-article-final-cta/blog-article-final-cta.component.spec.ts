import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BlogArticleFinalCtaComponent } from './blog-article-final-cta.component';

describe('BlogArticleFinalCtaComponent', () => {
  let component: BlogArticleFinalCtaComponent;
  let fixture: ComponentFixture<BlogArticleFinalCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogArticleFinalCtaComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogArticleFinalCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
