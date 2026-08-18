import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-filter-bar-wayne',
  standalone: true,
  templateUrl: './blog-filter-bar-wayne.component.html',
  styleUrl: './blog-filter-bar-wayne.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogFilterBarWayneComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }

  protected activeFilter = this.config.filterBar.filters[0];
}
