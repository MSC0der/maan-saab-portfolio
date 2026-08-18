import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCommandingPhilosophyWayneComponent } from './about-commanding-philosophy-wayne.component';

describe('AboutCommandingPhilosophyWayneComponent', () => {
  let component: AboutCommandingPhilosophyWayneComponent;
  let fixture: ComponentFixture<AboutCommandingPhilosophyWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutCommandingPhilosophyWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutCommandingPhilosophyWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
