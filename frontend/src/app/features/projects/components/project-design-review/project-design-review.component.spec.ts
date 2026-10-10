import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../../data/projects.data';

import { ProjectDesignReviewComponent } from './project-design-review.component';

describe('ProjectDesignReviewComponent', () => {
  let component: ProjectDesignReviewComponent;
  let fixture: ComponentFixture<ProjectDesignReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDesignReviewComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDesignReviewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', PROJECTS[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
