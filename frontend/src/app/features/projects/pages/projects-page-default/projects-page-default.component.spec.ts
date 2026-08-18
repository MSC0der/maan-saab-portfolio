import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsPageDefaultComponent } from './projects-page-default.component';

describe('ProjectsPageDefaultComponent', () => {
  let component: ProjectsPageDefaultComponent;
  let fixture: ComponentFixture<ProjectsPageDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsPageDefaultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsPageDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
