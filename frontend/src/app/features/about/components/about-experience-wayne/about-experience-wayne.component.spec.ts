import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutExperienceWayneComponent } from './about-experience-wayne.component';

describe('AboutExperienceWayneComponent', () => {
  let component: AboutExperienceWayneComponent;
  let fixture: ComponentFixture<AboutExperienceWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutExperienceWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutExperienceWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
