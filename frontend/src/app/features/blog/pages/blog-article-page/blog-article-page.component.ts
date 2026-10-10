import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BlogArticleFinalCtaComponent } from '../../components/blog-article-final-cta/blog-article-final-cta.component';
import { BlogArticleHeroComponent } from '../../components/blog-article-hero/blog-article-hero.component';
import { BlogArticleLayoutComponent } from '../../components/blog-article-layout/blog-article-layout.component';
import { BlogArticleNewsletterComponent } from '../../components/blog-article-newsletter/blog-article-newsletter.component';
import { BlogRelatedArticlesComponent } from '../../components/blog-related-articles/blog-related-articles.component';
import { ArticleDataService } from '../../services/article-data.service';

@Component({
  selector: 'app-blog-article-page',
  standalone: true,
  imports: [
    RouterLink,
    BlogArticleHeroComponent,
    BlogArticleLayoutComponent,
    BlogRelatedArticlesComponent,
    BlogArticleNewsletterComponent,
    BlogArticleFinalCtaComponent,
  ],
  templateUrl: './blog-article-page.component.html',
  styleUrl: './blog-article-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArticlePageComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly articleService = inject(ArticleDataService);

  protected readonly article = this.articleService.getArticle(
    this.route.snapshot.paramMap.get('slug') ?? '',
  );
}
