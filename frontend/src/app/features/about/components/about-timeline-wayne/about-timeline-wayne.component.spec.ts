import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTimelineWayneComponent } from './about-timeline-wayne.component';

describe('AboutTimelineWayneComponent', () => {
  let component: AboutTimelineWayneComponent;
  let fixture: ComponentFixture<AboutTimelineWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTimelineWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutTimelineWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
