import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogGridWayneComponent } from './blog-grid-wayne.component';

describe('BlogGridWayneComponent', () => {
  let component: BlogGridWayneComponent;
  let fixture: ComponentFixture<BlogGridWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogGridWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogGridWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
