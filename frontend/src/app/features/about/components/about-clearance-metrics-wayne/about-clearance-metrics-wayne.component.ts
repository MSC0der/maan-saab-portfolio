import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ClearanceMetric {
  value: string;
  label: string;
}

@Component({
  selector: 'app-about-clearance-metrics-wayne',
  standalone: true,
  templateUrl: './about-clearance-metrics-wayne.component.html',
  styleUrl: './about-clearance-metrics-wayne.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutClearanceMetricsWayneComponent {
  protected readonly metrics: readonly ClearanceMetric[] = [
    {
      value: '1.5+',
      label: 'Years Experience',
    },
    {
      value: '10+',
      label: 'Projects Delivered',
    },
    {
      value: '12+',
      label: 'Tech Stack Mastered',
    },
    {
      value: '100+',
      label: 'APIs Delivered',
    },
  ];
}
