import { Component, inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-newsletter-wayne',
  standalone: true,
  templateUrl: './blog-newsletter-wayne.component.html',
  styleUrl: './blog-newsletter-wayne.component.scss',
})
export class BlogNewsletterWayneComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
