import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPageWayneComponent } from './about-page-wayne.component';

describe('AboutPageWayneComponent', () => {
  let component: AboutPageWayneComponent;
  let fixture: ComponentFixture<AboutPageWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPageWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutPageWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
