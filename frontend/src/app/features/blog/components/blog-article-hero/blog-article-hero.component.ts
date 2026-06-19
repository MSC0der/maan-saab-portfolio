import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { Article } from '../../models/article.model';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-article-hero',
  standalone: true,
  templateUrl: './blog-article-hero.component.html',
  styleUrl: './blog-article-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArticleHeroComponent {
  readonly article = input.required<Article>();

  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
