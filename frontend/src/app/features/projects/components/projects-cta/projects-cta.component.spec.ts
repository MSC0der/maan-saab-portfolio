import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProjectsCtaComponent } from './projects-cta.component';

describe('ProjectsCtaComponent', () => {
  let component: ProjectsCtaComponent;
  let fixture: ComponentFixture<ProjectsCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsCtaComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
