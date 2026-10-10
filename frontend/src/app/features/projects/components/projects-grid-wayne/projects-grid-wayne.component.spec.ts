import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProjectsGridWayneComponent } from './projects-grid-wayne.component';

describe('ProjectsGridWayneComponent', () => {
  let component: ProjectsGridWayneComponent;
  let fixture: ComponentFixture<ProjectsGridWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsGridWayneComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsGridWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
