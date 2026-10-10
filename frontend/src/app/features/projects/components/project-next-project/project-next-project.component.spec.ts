import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProjectNextProjectComponent } from './project-next-project.component';

describe('ProjectNextProjectComponent', () => {
  let component: ProjectNextProjectComponent;
  let fixture: ComponentFixture<ProjectNextProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectNextProjectComponent],
      providers: [provideRouter([])],
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
