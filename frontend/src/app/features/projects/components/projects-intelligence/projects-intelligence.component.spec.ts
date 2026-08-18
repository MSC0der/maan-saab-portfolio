import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsIntelligenceComponent } from './projects-intelligence.component';

describe('ProjectsIntelligenceComponent', () => {
  let component: ProjectsIntelligenceComponent;
  let fixture: ComponentFixture<ProjectsIntelligenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsIntelligenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsIntelligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
