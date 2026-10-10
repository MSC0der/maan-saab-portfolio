import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../../data/projects.data';

import { ProjectSystemFlowComponent } from './project-system-flow.component';

describe('ProjectSystemFlowComponent', () => {
  let component: ProjectSystemFlowComponent;
  let fixture: ComponentFixture<ProjectSystemFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSystemFlowComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSystemFlowComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', PROJECTS[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
