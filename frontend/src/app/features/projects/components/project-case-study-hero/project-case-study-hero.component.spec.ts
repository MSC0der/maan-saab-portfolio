import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCaseStudyHeroComponent } from './project-case-study-hero.component';

describe('ProjectCaseStudyHeroComponent', () => {
  let component: ProjectCaseStudyHeroComponent;
  let fixture: ComponentFixture<ProjectCaseStudyHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCaseStudyHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCaseStudyHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
