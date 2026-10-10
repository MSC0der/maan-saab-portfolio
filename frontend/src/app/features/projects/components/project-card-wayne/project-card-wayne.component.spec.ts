import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../../data/projects.data';

import { ProjectCardWayneComponent } from './project-card-wayne.component';

describe('ProjectCardWayneComponent', () => {
  let component: ProjectCardWayneComponent;
  let fixture: ComponentFixture<ProjectCardWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardWayneComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCardWayneComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', PROJECTS[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
