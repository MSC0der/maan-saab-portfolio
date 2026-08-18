import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogKnowledgeDomainsWayneComponent } from './blog-knowledge-domains-wayne.component';

describe('BlogKnowledgeDomainsWayneComponent', () => {
  let component: BlogKnowledgeDomainsWayneComponent;
  let fixture: ComponentFixture<BlogKnowledgeDomainsWayneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogKnowledgeDomainsWayneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogKnowledgeDomainsWayneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
