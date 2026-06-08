import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCapabilitiesComponent } from './project-capabilities.component';

describe('ProjectCapabilitiesComponent', () => {
  let component: ProjectCapabilitiesComponent;
  let fixture: ComponentFixture<ProjectCapabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCapabilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
