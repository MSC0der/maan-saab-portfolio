import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPerformanceMetricsComponent } from './blog-performance-metrics.component';

describe('BlogPerformanceMetricsComponent', () => {
  let component: BlogPerformanceMetricsComponent;
  let fixture: ComponentFixture<BlogPerformanceMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPerformanceMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogPerformanceMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
