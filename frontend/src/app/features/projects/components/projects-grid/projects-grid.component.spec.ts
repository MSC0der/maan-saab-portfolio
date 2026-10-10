import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProjectsGridComponent } from './projects-grid.component';

describe('ProjectsGridComponent', () => {
  let component: ProjectsGridComponent;
  let fixture: ComponentFixture<ProjectsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsGridComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
