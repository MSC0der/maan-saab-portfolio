import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';
import { ARTICLES } from '../../data/articles.data';

@Component({
  selector: 'app-blog-related-articles',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-related-articles.component.html',
  styleUrl: './blog-related-articles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogRelatedArticlesComponent {
  protected readonly articles = ARTICLES.slice(0, 3);
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
