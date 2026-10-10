import { Component, inject } from '@angular/core';
import { ArticleDataService } from '../../services/article-data.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-featured-article-wayne',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-featured-article-wayne.component.html',
  styleUrl: './blog-featured-article-wayne.component.scss',
})
export class BlogFeaturedArticleWayneComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly article = inject(ArticleDataService).featuredArticle;

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
