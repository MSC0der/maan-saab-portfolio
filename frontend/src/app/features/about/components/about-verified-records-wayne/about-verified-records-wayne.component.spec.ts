import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutVerifiedRecordsWayneComponent } from './about-verified-records-wayne.component';

describe('AboutVerifiedRecordsWayneComponent', () => {
  let component: AboutVerifiedRecordsWayneComponent;
  let fixture: ComponentFixture<AboutVerifiedRecordsWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutVerifiedRecordsWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutVerifiedRecordsWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
