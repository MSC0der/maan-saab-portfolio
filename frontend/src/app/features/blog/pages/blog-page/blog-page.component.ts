import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { BlogFeaturedArticleComponent } from '../../components/blog-featured-article/blog-featured-article.component';
import { BlogFeaturedArticleWayneComponent } from '../../components/blog-featured-article-wayne/blog-featured-article-wayne.component';
import { BlogFilterBarComponent } from '../../components/blog-filter-bar/blog-filter-bar.component';
import { BlogFilterBarWayneComponent } from '../../components/blog-filter-bar-wayne/blog-filter-bar-wayne.component';
import { BlogGridComponent } from '../../components/blog-grid/blog-grid.component';
import { BlogGridWayneComponent } from '../../components/blog-grid-wayne/blog-grid-wayne.component';
import { BlogHeroComponent } from '../../components/blog-hero/blog-hero.component';
import { BlogHeroWayneComponent } from '../../components/blog-hero-wayne/blog-hero-wayne.component';
import { BlogKnowledgeDomainsComponent } from '../../components/blog-knowledge-domains/blog-knowledge-domains.component';
import { BlogKnowledgeDomainsWayneComponent } from '../../components/blog-knowledge-domains-wayne/blog-knowledge-domains-wayne.component';
import { BlogNewsletterComponent } from '../../components/blog-newsletter/blog-newsletter.component';
import { BlogNewsletterWayneComponent } from '../../components/blog-newsletter-wayne/blog-newsletter-wayne.component';

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
    BlogHeroWayneComponent,
    BlogFeaturedArticleWayneComponent,
    BlogFilterBarWayneComponent,
    BlogGridWayneComponent,
    BlogKnowledgeDomainsWayneComponent,
    BlogNewsletterWayneComponent,
  ],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPageComponent {
  protected readonly theme = inject(ThemeService).theme;
}
