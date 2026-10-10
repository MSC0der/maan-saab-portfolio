import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ARTICLES } from '../../data/articles.data';

import { BlogCardWayneComponent } from './blog-card-wayne.component';

describe('BlogCardWayneComponent', () => {
  let component: BlogCardWayneComponent;
  let fixture: ComponentFixture<BlogCardWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCardWayneComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogCardWayneComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('article', ARTICLES[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
