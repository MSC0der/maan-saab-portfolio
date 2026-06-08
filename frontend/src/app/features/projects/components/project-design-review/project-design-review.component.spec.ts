import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDesignReviewComponent } from './project-design-review.component';

describe('ProjectDesignReviewComponent', () => {
  let component: ProjectDesignReviewComponent;
  let fixture: ComponentFixture<ProjectDesignReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDesignReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDesignReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
