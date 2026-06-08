import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BlogHeroComponent } from '../../components/blog-hero/blog-hero.component';
import { BlogFeaturedArticleComponent } from '../../components/blog-featured-article/blog-featured-article.component';
import { BlogFilterBarComponent } from '../../components/blog-filter-bar/blog-filter-bar.component';
import { BlogGridComponent } from '../../components/blog-grid/blog-grid.component';
import { BlogKnowledgeDomainsComponent } from '../../components/blog-knowledge-domains/blog-knowledge-domains.component';
import { BlogNewsletterComponent } from '../../components/blog-newsletter/blog-newsletter.component';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [
    BlogHeroComponent,
    BlogFeaturedArticleComponent,
    BlogFilterBarComponent,
    BlogGridComponent,
    BlogKnowledgeDomainsComponent,
    BlogNewsletterComponent,
  ],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPageComponent {}
