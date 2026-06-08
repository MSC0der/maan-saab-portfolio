import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Article } from '../../models/article.model';

@Component({
  selector: 'app-blog-article-layout',
  standalone: true,
  templateUrl: './blog-article-layout.component.html',
  styleUrl: './blog-article-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArticleLayoutComponent {
  readonly article = input.required<Article>();
}
