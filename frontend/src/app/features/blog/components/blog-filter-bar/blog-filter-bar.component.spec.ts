import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogFilterBarComponent } from './blog-filter-bar.component';

describe('BlogFilterBarComponent', () => {
  let component: BlogFilterBarComponent;
  let fixture: ComponentFixture<BlogFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogFilterBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
