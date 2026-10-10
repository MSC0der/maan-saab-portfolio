import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BlogGridComponent } from './blog-grid.component';

describe('BlogGridComponent', () => {
  let component: BlogGridComponent;
  let fixture: ComponentFixture<BlogGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogGridComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
