import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HomeIconComponent } from '../home-icon/home-icon.component';

interface EngineeringPoint {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-home-about-preview',
  standalone: true,
  imports: [HomeIconComponent],
  templateUrl: './home-about-preview.component.html',
  styleUrl: './home-about-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeAboutPreviewComponent {
  protected readonly engineeringPoints: readonly EngineeringPoint[] = [
    {
      title: 'REST APIs:',
      description: 'Designing clean, documented, and versioned endpoints.',
    },
    {
      title: 'Security:',
      description: 'Implementing robust JWT auth, RBAC, and data encryption.',
    },
    {
      title: 'Optimization:',
      description: 'Query profiling, caching strategies, and reducing latency.',
    },
  ];
}
