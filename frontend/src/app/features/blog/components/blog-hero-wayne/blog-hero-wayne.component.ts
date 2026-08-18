import { Component, inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-hero-wayne',
  standalone: true,
  imports: [],
  templateUrl: './blog-hero-wayne.component.html',
  styleUrl: './blog-hero-wayne.component.scss',
})
export class BlogHeroWayneComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
