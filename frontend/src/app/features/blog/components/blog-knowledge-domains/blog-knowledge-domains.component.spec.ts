import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogKnowledgeDomainsComponent } from './blog-knowledge-domains.component';

describe('BlogKnowledgeDomainsComponent', () => {
  let component: BlogKnowledgeDomainsComponent;
  let fixture: ComponentFixture<BlogKnowledgeDomainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogKnowledgeDomainsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogKnowledgeDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
