import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEngineeringReportComponent } from './project-engineering-report.component';

describe('ProjectEngineeringReportComponent', () => {
  let component: ProjectEngineeringReportComponent;
  let fixture: ComponentFixture<ProjectEngineeringReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEngineeringReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectEngineeringReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
