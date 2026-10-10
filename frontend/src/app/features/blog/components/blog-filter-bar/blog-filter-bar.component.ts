import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';
import { ThemeService } from '../../../../core/services/theme.service';
import { ArticleDataService } from '../../services/article-data.service';

@Component({
  selector: 'app-blog-filter-bar',
  standalone: true,
  templateUrl: './blog-filter-bar.component.html',
  styleUrl: './blog-filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogFilterBarComponent {
  private readonly themeService = inject(ThemeService);
  private readonly articles = inject(ArticleDataService);

  protected readonly selected = this.articles.selectedTopic;

  /** Only topics with at least one article, labelled in the current theme. */
  protected readonly chips = computed(() => {
    const labels = THEME_BLOG_CONFIG[this.themeService.theme()].filterBar.filters;
    return this.articles.filterOptions.map(({ topic, index }) => ({
      topic,
      label: labels[index] ?? topic,
    }));
  });

  protected select(topic: string): void {
    this.articles.selectTopic(topic);
  }
}
