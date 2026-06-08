import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNextProjectComponent } from './project-next-project.component';

describe('ProjectNextProjectComponent', () => {
  let component: ProjectNextProjectComponent;
  let fixture: ComponentFixture<ProjectNextProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectNextProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectNextProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
