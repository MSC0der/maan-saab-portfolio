import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogArchitectureComparisonComponent } from './blog-architecture-comparison.component';

describe('BlogArchitectureComparisonComponent', () => {
  let component: BlogArchitectureComparisonComponent;
  let fixture: ComponentFixture<BlogArchitectureComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogArchitectureComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogArchitectureComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
