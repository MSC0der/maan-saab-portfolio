import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ArticleDataService } from '../../services/article-data.service';
import { BlogCardWayneComponent } from '../blog-card-wayne/blog-card-wayne.component';

@Component({
  selector: 'app-blog-grid-wayne',
  standalone: true,
  imports: [BlogCardWayneComponent],
  templateUrl: './blog-grid-wayne.component.html',
  styleUrl: './blog-grid-wayne.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogGridWayneComponent {
  protected readonly articles = inject(ArticleDataService).filteredArticles;
}
