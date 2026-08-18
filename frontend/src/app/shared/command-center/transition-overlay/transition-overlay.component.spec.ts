import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionOverlayComponent } from './transition-overlay.component';

describe('TransitionOverlayComponent', () => {
  let component: TransitionOverlayComponent;
  let fixture: ComponentFixture<TransitionOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransitionOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransitionOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
