import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Article } from '../../models/article.model';

@Component({
  selector: 'app-blog-article-layout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-article-layout.component.html',
  styleUrl: './blog-article-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArticleLayoutComponent {
  readonly article = input.required<Article>();

  /** Contents entries: every section, the opening one labelled "Introduction". */
  protected readonly contents = computed(() =>
    this.article().sections.map((section) => ({
      id: section.id,
      label: section.heading ?? 'Introduction',
    })),
  );

  protected readonly copiedKey = signal<string | null>(null);

  protected copy(text: string, key: string): void {
    void navigator.clipboard?.writeText(text).then(() => {
      this.copiedKey.set(key);
      setTimeout(() => {
        if (this.copiedKey() === key) {
          this.copiedKey.set(null);
        }
      }, 1600);
    });
  }
}
