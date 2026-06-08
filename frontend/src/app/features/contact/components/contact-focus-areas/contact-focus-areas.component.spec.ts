import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFocusAreasComponent } from './contact-focus-areas.component';

describe('ContactFocusAreasComponent', () => {
  let component: ContactFocusAreasComponent;
  let fixture: ComponentFixture<ContactFocusAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFocusAreasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactFocusAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
