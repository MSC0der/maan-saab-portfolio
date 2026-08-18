import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCapabilitiesMatrixWayneComponent } from './about-capabilities-matrix-wayne.component';

describe('AboutCapabilitiesMatrixWayneComponent', () => {
  let component: AboutCapabilitiesMatrixWayneComponent;
  let fixture: ComponentFixture<AboutCapabilitiesMatrixWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutCapabilitiesMatrixWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutCapabilitiesMatrixWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
