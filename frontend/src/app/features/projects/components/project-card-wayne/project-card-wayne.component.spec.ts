import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCardWayneComponent } from './project-card-wayne.component';

describe('ProjectCardWayneComponent', () => {
  let component: ProjectCardWayneComponent;
  let fixture: ComponentFixture<ProjectCardWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCardWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
