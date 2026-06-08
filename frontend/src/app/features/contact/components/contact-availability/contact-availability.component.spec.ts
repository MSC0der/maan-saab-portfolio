import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAvailabilityComponent } from './contact-availability.component';

describe('ContactAvailabilityComponent', () => {
  let component: ContactAvailabilityComponent;
  let fixture: ComponentFixture<ContactAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
