import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutOperationalExpertiseWayneComponent } from './about-operational-expertise-wayne.component';

describe('AboutOperationalExpertiseWayneComponent', () => {
  let component: AboutOperationalExpertiseWayneComponent;
  let fixture: ComponentFixture<AboutOperationalExpertiseWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutOperationalExpertiseWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutOperationalExpertiseWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
