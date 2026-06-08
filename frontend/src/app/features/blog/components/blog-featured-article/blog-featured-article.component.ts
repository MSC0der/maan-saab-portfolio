import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-blog-featured-article',
  standalone: true,
  templateUrl: './blog-featured-article.component.html',
  styleUrl: './blog-featured-article.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogFeaturedArticleComponent {}
