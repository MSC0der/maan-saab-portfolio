import { ChangeDetectionStrategy, Component } from '@angular/core';
import { inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_ABOUT_CONFIG } from '../../../../core/config/theme-about.config';

@Component({
  selector: 'app-about-timeline-wayne',
  standalone: true,
  imports: [],
  templateUrl: './about-timeline-wayne.component.html',
  styleUrl: './about-timeline-wayne.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutTimelineWayneComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_ABOUT_CONFIG[this.themeService.theme()];
  }

  protected readonly missions = [
    {
      mission: 'MISSION 001',
      period: '2021',
      status: 'Genesis Operation',
      title: 'Started Bachelor of Computer Applications',
      description:
        'Learning programming fundamentals, databases, and software development concepts.',
    },
    {
      mission: 'MISSION 002',
      period: '2024',
      status: 'Field Training',
      title: 'Full Stack Development Internship',
      description:
        'Worked with Angular, APIs, debugging, and production workflows.',
    },
    {
      mission: 'MISSION 003',
      period: '2025',
      status: 'Deployment Active',
      title: 'Joined Imminent Ideas as Full Stack Developer',
      description:
        'Built REST APIs, authentication systems, Angular integrations, and database solutions.',
    },
    {
      mission: 'MISSION 004',
      period: '2026',
      status: 'Backend Specialization',
      title: 'Focused on Backend Engineering',
      description:
        'Working on scalable APIs, query optimization, authentication systems, DSA, and system design.',
    },
    {
      mission: 'MISSION 005',
      period: 'Future',
      status: 'Ongoing Mission',
      title: 'Software Engineer at a Product Company',
      description: 'Building large-scale products used by thousands of users.',
    },
  ];
}
