import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-newsletter',
  standalone: true,
  imports: [],
  templateUrl: './blog-newsletter.component.html',
  styleUrl: './blog-newsletter.component.scss',
})
export class BlogNewsletterComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
