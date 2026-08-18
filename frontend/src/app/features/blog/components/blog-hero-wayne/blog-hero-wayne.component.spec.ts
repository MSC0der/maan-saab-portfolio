import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogHeroWayneComponent } from './blog-hero-wayne.component';

describe('BlogHeroWayneComponent', () => {
  let component: BlogHeroWayneComponent;
  let fixture: ComponentFixture<BlogHeroWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogHeroWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogHeroWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
