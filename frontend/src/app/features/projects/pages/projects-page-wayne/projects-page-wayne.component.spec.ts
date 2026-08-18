import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsPageWayneComponent } from './projects-page-wayne.component';

describe('ProjectsPageWayneComponent', () => {
  let component: ProjectsPageWayneComponent;
  let fixture: ComponentFixture<ProjectsPageWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsPageWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsPageWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
