import { Component } from '@angular/core';

@Component({
  selector: 'app-about-commanding-philosophy-wayne',
  standalone: true,
  imports: [],
  templateUrl: './about-commanding-philosophy-wayne.component.html',
  styleUrl: './about-commanding-philosophy-wayne.component.scss',
})
export class AboutCommandingPhilosophyWayneComponent {
  protected readonly principles = [
    {
      title: 'Scalability',
      description:
        'Building systems that support future growth without requiring major rewrites.',
    },
    {
      title: 'Reliability',
      description:
        'Delivering stable software that performs consistently under pressure.',
    },
    {
      title: 'Clean Architecture',
      description: 'Separation of concerns and maintainable code structures.',
    },
    {
      title: 'Performance',
      description: 'Optimizing throughput while maintaining simplicity.',
    },
  ];
}
