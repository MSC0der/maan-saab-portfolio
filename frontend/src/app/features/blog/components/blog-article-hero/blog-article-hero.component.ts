import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Article } from '../../models/article.model';

@Component({
  selector: 'app-blog-article-hero',
  standalone: true,
  templateUrl: './blog-article-hero.component.html',
  styleUrl: './blog-article-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArticleHeroComponent {
  readonly article = input.required<Article>();
}
