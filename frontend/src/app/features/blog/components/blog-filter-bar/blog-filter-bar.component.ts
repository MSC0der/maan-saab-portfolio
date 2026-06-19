import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-filter-bar',
  standalone: true,
  templateUrl: './blog-filter-bar.component.html',
  styleUrl: './blog-filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogFilterBarComponent {
  protected get filters() {
    return this.config.filterBar.filters;
  }

  protected activeFilter = this.filters[0];

  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
