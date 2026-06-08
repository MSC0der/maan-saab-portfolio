import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDirectLinksComponent } from './contact-direct-links.component';

describe('ContactDirectLinksComponent', () => {
  let component: ContactDirectLinksComponent;
  let fixture: ComponentFixture<ContactDirectLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDirectLinksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactDirectLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
