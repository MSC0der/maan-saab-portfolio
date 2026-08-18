import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutHeroWayneComponent } from './about-hero-wayne.component';

describe('AboutHeroWayneComponent', () => {
  let component: AboutHeroWayneComponent;
  let fixture: ComponentFixture<AboutHeroWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutHeroWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutHeroWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
