import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogFilterBarWayneComponent } from './blog-filter-bar-wayne.component';

describe('BlogFilterBarWayneComponent', () => {
  let component: BlogFilterBarWayneComponent;
  let fixture: ComponentFixture<BlogFilterBarWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogFilterBarWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogFilterBarWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
