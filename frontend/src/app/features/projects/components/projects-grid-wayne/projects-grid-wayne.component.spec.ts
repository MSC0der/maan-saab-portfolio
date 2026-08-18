import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsGridWayneComponent } from './projects-grid-wayne.component';

describe('ProjectsGridWayneComponent', () => {
  let component: ProjectsGridWayneComponent;
  let fixture: ComponentFixture<ProjectsGridWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsGridWayneComponent]
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
