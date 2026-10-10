import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../../data/projects.data';

import { ProjectCaseStudyHeroComponent } from './project-case-study-hero.component';

describe('ProjectCaseStudyHeroComponent', () => {
  let component: ProjectCaseStudyHeroComponent;
  let fixture: ComponentFixture<ProjectCaseStudyHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCaseStudyHeroComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCaseStudyHeroComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', PROJECTS[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
