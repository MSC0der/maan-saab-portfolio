import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCtaWayneComponent } from './about-cta-wayne.component';

describe('AboutCtaWayneComponent', () => {
  let component: AboutCtaWayneComponent;
  let fixture: ComponentFixture<AboutCtaWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutCtaWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutCtaWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
