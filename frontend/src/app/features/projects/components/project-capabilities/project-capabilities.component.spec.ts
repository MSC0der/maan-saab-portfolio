import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../../data/projects.data';

import { ProjectCapabilitiesComponent } from './project-capabilities.component';

describe('ProjectCapabilitiesComponent', () => {
  let component: ProjectCapabilitiesComponent;
  let fixture: ComponentFixture<ProjectCapabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCapabilitiesComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', PROJECTS[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
