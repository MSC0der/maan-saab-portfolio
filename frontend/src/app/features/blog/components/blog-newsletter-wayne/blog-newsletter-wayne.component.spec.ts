import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogNewsletterWayneComponent } from './blog-newsletter-wayne.component';

describe('BlogNewsletterWayneComponent', () => {
  let component: BlogNewsletterWayneComponent;
  let fixture: ComponentFixture<BlogNewsletterWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogNewsletterWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogNewsletterWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
