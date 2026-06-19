import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../models/article.model';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCardComponent {
  readonly article = input.required<Article>();
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
