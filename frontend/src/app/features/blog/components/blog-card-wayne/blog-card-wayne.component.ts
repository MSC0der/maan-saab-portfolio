import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterLink } from '@angular/router';

import { Article } from '../../models/article.model';

@Component({
  selector: 'app-blog-card-wayne',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-card-wayne.component.html',
  styleUrl: './blog-card-wayne.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCardWayneComponent {
  readonly article = input.required<Article>();
}
