import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../../data/projects.data';

import { ProjectEngineeringReportComponent } from './project-engineering-report.component';

describe('ProjectEngineeringReportComponent', () => {
  let component: ProjectEngineeringReportComponent;
  let fixture: ComponentFixture<ProjectEngineeringReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEngineeringReportComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectEngineeringReportComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', PROJECTS[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
