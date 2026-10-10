import { Component, inject } from '@angular/core';
import { SITE_CONFIG } from '../../../../core/config/site.config';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-article-newsletter',
  standalone: true,
  imports: [],
  templateUrl: './blog-article-newsletter.component.html',
  styleUrl: './blog-article-newsletter.component.scss',
})
export class BlogArticleNewsletterComponent {
  private readonly themeService = inject(ThemeService);

  /** There is no mailing list: the honest way to follow is LinkedIn. */
  protected readonly followUrl =
    SITE_CONFIG.socialLinks.find((link) => link.label === 'LinkedIn')?.url ?? '#';

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
