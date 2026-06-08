import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSystemFlowComponent } from './project-system-flow.component';

describe('ProjectSystemFlowComponent', () => {
  let component: ProjectSystemFlowComponent;
  let fixture: ComponentFixture<ProjectSystemFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSystemFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSystemFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
