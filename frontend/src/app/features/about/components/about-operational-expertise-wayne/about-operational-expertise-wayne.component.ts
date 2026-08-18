import { Component } from '@angular/core';
import {
  AboutIconComponent,
  AboutIconName,
} from '../about-icon/about-icon.component';

interface OperationalCard {
  readonly icon: AboutIconName;
  readonly code: string;
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-about-operational-expertise-wayne',
  standalone: true,
  imports: [AboutIconComponent],
  templateUrl: './about-operational-expertise-wayne.component.html',
  styleUrl: './about-operational-expertise-wayne.component.scss',
})
export class AboutOperationalExpertiseWayneComponent {
  protected readonly cards: readonly OperationalCard[] = [
    {
      icon: 'hub',
      code: 'SYS_ARCH',
      title: 'REST API Architecture',
      description:
        'Designing scalable service APIs with authentication and authorization.',
    },
    {
      icon: 'lock',
      code: 'SEC_AUTH',
      title: 'Identity & Access Management',
      description:
        'JWT authentication, RBAC and validation layers securing internal and public services.',
    },
    {
      icon: 'database',
      code: 'DATA_OPS',
      title: 'Database Engineering',
      description:
        'Schema design, query optimization and scalable persistence architecture.',
    },
    {
      icon: 'terminal',
      code: 'BACK_END',
      title: 'Backend Systems',
      description:
        'Developing server-side logic and distributed service orchestration.',
    },
    {
      icon: 'cloud',
      code: 'INFRA_01',
      title: 'Cloud Infrastructure',
      description:
        'AWS S3 integrations, deployment pipelines and production environments.',
    },
    {
      icon: 'tree',
      code: 'PERF_OPT',
      title: 'Performance Optimization',
      description:
        'Reducing execution time and improving throughput across services.',
    },
  ];
}
