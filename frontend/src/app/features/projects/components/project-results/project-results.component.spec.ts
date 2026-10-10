import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../../data/projects.data';

import { ProjectResultsComponent } from './project-results.component';

describe('ProjectResultsComponent', () => {
  let component: ProjectResultsComponent;
  let fixture: ComponentFixture<ProjectResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectResultsComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectResultsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', PROJECTS[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
