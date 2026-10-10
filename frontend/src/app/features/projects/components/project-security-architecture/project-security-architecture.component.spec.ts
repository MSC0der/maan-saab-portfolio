import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../../data/projects.data';

import { ProjectSecurityArchitectureComponent } from './project-security-architecture.component';

describe('ProjectSecurityArchitectureComponent', () => {
  let component: ProjectSecurityArchitectureComponent;
  let fixture: ComponentFixture<ProjectSecurityArchitectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSecurityArchitectureComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSecurityArchitectureComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', PROJECTS[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
