import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSecurityArchitectureComponent } from './project-security-architecture.component';

describe('ProjectSecurityArchitectureComponent', () => {
  let component: ProjectSecurityArchitectureComponent;
  let fixture: ComponentFixture<ProjectSecurityArchitectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSecurityArchitectureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSecurityArchitectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
