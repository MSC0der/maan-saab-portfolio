import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-featured-article',
  standalone: true,
  templateUrl: './blog-featured-article.component.html',
  styleUrl: './blog-featured-article.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogFeaturedArticleComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
