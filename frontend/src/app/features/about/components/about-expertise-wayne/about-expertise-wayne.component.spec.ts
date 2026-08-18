import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutExpertiseWayneComponent } from './about-expertise-wayne.component';

describe('AboutExpertiseWayneComponent', () => {
  let component: AboutExpertiseWayneComponent;
  let fixture: ComponentFixture<AboutExpertiseWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutExpertiseWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutExpertiseWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
