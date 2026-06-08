import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ARTICLES } from '../../data/articles.data';

@Component({
  selector: 'app-blog-related-articles',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-related-articles.component.html',
  styleUrl: './blog-related-articles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogRelatedArticlesComponent {
  protected readonly articles =
    ARTICLES.slice(0, 3);
}