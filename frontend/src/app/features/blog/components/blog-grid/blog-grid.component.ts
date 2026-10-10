import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ArticleDataService } from '../../services/article-data.service';
import { BlogCardComponent } from '../blog-card/blog-card.component';

@Component({
  selector: 'app-blog-grid',
  standalone: true,
  imports: [BlogCardComponent],
  templateUrl: './blog-grid.component.html',
  styleUrl: './blog-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogGridComponent {
  protected readonly articles = inject(ArticleDataService).filteredArticles;
}
