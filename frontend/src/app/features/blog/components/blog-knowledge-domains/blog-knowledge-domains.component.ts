import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_BLOG_CONFIG } from '../../../../core/config/theme-blog.config';

interface KnowledgeDomain {
  readonly title: string;
  readonly subtitle: string;
}

@Component({
  selector: 'app-blog-knowledge-domains',
  standalone: true,
  templateUrl: './blog-knowledge-domains.component.html',
  styleUrl: './blog-knowledge-domains.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogKnowledgeDomainsComponent {
  protected readonly domains: readonly KnowledgeDomain[] = [
    {
      title: 'Backend Engineering',
      subtitle: 'Node.js, Express.js',
    },
    {
      title: 'API Design',
      subtitle: 'REST, validation, pagination',
    },
    {
      title: 'Auth & Security',
      subtitle: 'JWT, RBAC, OTP',
    },
    {
      title: 'Database Design',
      subtitle: 'MongoDB, MySQL, indexing',
    },
    {
      title: 'Angular Dev',
      subtitle: 'Signals, RxJS, OnPush',
    },
    {
      title: 'System Design',
      subtitle: 'Caching, scalability',
    },
    {
      title: 'Performance Opt',
      subtitle: 'Query tuning, profiling',
    },
    {
      title: 'DSA',
      subtitle: 'Complexity & Efficiency',
    },
  ];
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_BLOG_CONFIG[this.themeService.theme()];
  }
}
