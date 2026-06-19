import { Component } from '@angular/core';
import { inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';

import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-hero',
  standalone: true,
  imports: [],
  templateUrl: './blog-hero.component.html',
  styleUrl: './blog-hero.component.scss',
})
export class BlogHeroComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
