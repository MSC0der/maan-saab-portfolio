import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-blog-performance-metrics',
  standalone: true,
  templateUrl: './blog-performance-metrics.component.html',
  styleUrl: './blog-performance-metrics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPerformanceMetricsComponent {
  readonly article = input.required<Article>();
}
