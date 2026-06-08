import { ChangeDetectionStrategy, Component } from '@angular/core';

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
      subtitle: 'Node.js, Go, Python',
    },
    {
      title: 'API Design',
      subtitle: 'GraphQL, REST, gRPC',
    },
    {
      title: 'Auth & Security',
      subtitle: 'OAuth, JWT, RBAC',
    },
    {
      title: 'Database Design',
      subtitle: 'SQL & NoSQL Optimization',
    },
    {
      title: 'Angular Dev',
      subtitle: 'Signals, RxJS, NgRx',
    },
    {
      title: 'System Design',
      subtitle: 'Scalability & Availability',
    },
    {
      title: 'Performance Opt',
      subtitle: 'Profiling & Benchmarking',
    },
    {
      title: 'DSA',
      subtitle: 'Complexity & Efficiency',
    },
  ];
}
