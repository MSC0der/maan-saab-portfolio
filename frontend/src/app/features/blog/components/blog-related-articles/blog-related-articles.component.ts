import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';
import { ThemeService } from '../../../../core/services/theme.service';
import { ArticleDataService } from '../../services/article-data.service';

@Component({
  selector: 'app-blog-related-articles',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-related-articles.component.html',
  styleUrl: './blog-related-articles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogRelatedArticlesComponent {
  /** The article being read, so it is never listed as "related" to itself. */
  readonly slug = input<string>('');

  private readonly themeService = inject(ThemeService);
  private readonly articleService = inject(ArticleDataService);

  protected readonly articles = computed(() =>
    this.articleService.getRelated(this.slug(), 3),
  );

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
