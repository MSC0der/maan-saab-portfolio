import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectResultsComponent } from './project-results.component';

describe('ProjectResultsComponent', () => {
  let component: ProjectResultsComponent;
  let fixture: ComponentFixture<ProjectResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
