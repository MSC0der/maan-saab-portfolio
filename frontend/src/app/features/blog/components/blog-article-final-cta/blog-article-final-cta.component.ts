import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-article-final-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-article-final-cta.component.html',
  styleUrl: './blog-article-final-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArticleFinalCtaComponent {}
