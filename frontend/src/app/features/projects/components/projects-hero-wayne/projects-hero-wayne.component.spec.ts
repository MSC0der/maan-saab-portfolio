import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsHeroWayneComponent } from './projects-hero-wayne.component';

describe('ProjectsHeroWayneComponent', () => {
  let component: ProjectsHeroWayneComponent;
  let fixture: ComponentFixture<ProjectsHeroWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsHeroWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsHeroWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
