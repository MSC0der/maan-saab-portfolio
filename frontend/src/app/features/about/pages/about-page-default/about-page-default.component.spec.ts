import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPageDefaultComponent } from './about-page-default.component';

describe('AboutPageDefaultComponent', () => {
  let component: AboutPageDefaultComponent;
  let fixture: ComponentFixture<AboutPageDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPageDefaultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutPageDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
