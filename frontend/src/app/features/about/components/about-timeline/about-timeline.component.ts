import { ChangeDetectionStrategy, Component } from '@angular/core';

interface TimelineItem {
  readonly year: string;
  readonly title: string;
  readonly description: string;
  readonly future?: boolean;
}

@Component({
  selector: 'app-about-timeline',
  standalone: true,
  templateUrl: './about-timeline.component.html',
  styleUrl: './about-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutTimelineComponent {
  protected readonly timeline: readonly TimelineItem[] = [
    {
      year: '2021',
      title: 'Started Bachelor of Computer Applications',
      description: 'Learning programming fundamentals, databases, and software development concepts.',
    },
    {
      year: '2024',
      title: 'Full Stack Development Internship',
      description: 'Worked with Angular, APIs, debugging, and production workflows.',
    },
    {
      year: '2025',
      title: 'Joined Imminent Ideas as Full Stack Developer',
      description: 'Built REST APIs, authentication systems, Angular integrations, and database solutions.',
    },
    {
      year: '2026',
      title: 'Focused on Backend Engineering',
      description: 'Working on scalable APIs, query optimization, authentication systems, DSA, and system design.',
    },
    {
      year: 'Future',
      title: 'Software Engineer at a Product Company',
      description: 'Building large-scale products used by thousands of users.',
      future: true,
    },
  ];
}
