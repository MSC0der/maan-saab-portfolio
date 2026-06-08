import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BlogCardComponent } from '../blog-card/blog-card.component';

import { ARTICLES } from '../../data/articles.data';

@Component({
  selector: 'app-blog-grid',
  standalone: true,
  imports: [BlogCardComponent],
  templateUrl: './blog-grid.component.html',
  styleUrl: './blog-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogGridComponent {
  protected readonly articles = ARTICLES;
}
