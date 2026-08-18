import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutClearanceMetricsWayneComponent } from './about-clearance-metrics-wayne.component';

describe('AboutClearanceMetricsWayneComponent', () => {
  let component: AboutClearanceMetricsWayneComponent;
  let fixture: ComponentFixture<AboutClearanceMetricsWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutClearanceMetricsWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutClearanceMetricsWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
