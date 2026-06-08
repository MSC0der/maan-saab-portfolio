import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSidebarCtaComponent } from './contact-sidebar-cta.component';

describe('ContactSidebarCtaComponent', () => {
  let component: ContactSidebarCtaComponent;
  let fixture: ComponentFixture<ContactSidebarCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSidebarCtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactSidebarCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
