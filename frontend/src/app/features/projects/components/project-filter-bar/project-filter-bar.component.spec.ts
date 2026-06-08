import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFilterBarComponent } from './project-filter-bar.component';

describe('ProjectFilterBarComponent', () => {
  let component: ProjectFilterBarComponent;
  let fixture: ComponentFixture<ProjectFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFilterBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
