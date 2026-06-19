import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-article-final-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-article-final-cta.component.html',
  styleUrl: './blog-article-final-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArticleFinalCtaComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
