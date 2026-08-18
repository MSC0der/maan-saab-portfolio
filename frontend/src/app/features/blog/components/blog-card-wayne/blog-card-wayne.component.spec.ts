import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCardWayneComponent } from './blog-card-wayne.component';

describe('BlogCardWayneComponent', () => {
  let component: BlogCardWayneComponent;
  let fixture: ComponentFixture<BlogCardWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCardWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogCardWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
