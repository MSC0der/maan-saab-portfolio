import { ChangeDetectionStrategy, Component } from '@angular/core';
import { inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_ABOUT_CONFIG } from '../../../../core/config/theme-about.config';
import { AboutExpertiseCardComponent } from '../about-expertise-card/about-expertise-card.component';

interface ExpertisePanel {
  readonly title: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly skills: readonly string[];
}

@Component({
  selector: 'app-about-expertise',
  standalone: true,
  imports: [AboutExpertiseCardComponent],
  templateUrl: './about-expertise.component.html',
  styleUrl: './about-expertise.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutExpertiseComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_ABOUT_CONFIG[this.themeService.theme()];
  }
  protected readonly panels: readonly ExpertisePanel[] = [
    {
      title: 'Backend Engineering',
      imageAlt: 'Backend architecture visualization',
      imageUrl: '/images/about/sechema_optimization.png',
      skills: [
        'Node.js',
        'Express.js',
        'REST APIs',
        'Middleware',
        'Auth',
        'RBAC',
        'API Security',
      ],
    },
    {
      title: 'Frontend Engineering',
      imageAlt: 'Frontend architecture visualization',
      imageUrl: '/images/about/frontend_engineering_technical_architecture.png',
      skills: [
        'Angular',
        'TypeScript',
        'RxJS',
        'Responsive UI',
        'Component Architecture',
      ],
    },
    {
      title: 'Database Systems',
      imageAlt: 'Database topology visualization',
      imageUrl: '/images/about/rest_api_structure.png',
      skills: [
        'MongoDB',
        'MySQL',
        'Query Optimization',
        'Schema Design',
        'Data Modeling',
      ],
    },
    {
      title: 'Cloud & Dev Tools',
      imageAlt: 'Engineering toolkit visualization',
      imageUrl: '/images/about/cloud_dev_tools.png',
      skills: ['Docker', 'AWS S3', 'Git', 'GitHub', 'Postman', 'VS Code'],
    },
    {
      title: 'Software Engineering',
      imageAlt: 'Engineering process flow visualization',
      imageUrl: '/images/about/sofware_engineering_techincal_architecture.png',
      skills: [
        'Debugging',
        'Optimization',
        'Problem Solving',
        'Clean Architecture',
        'Scalability',
      ],
    },
    {
      title: 'Problem Solving & DSA',
      imageAlt: 'Algorithm roadmap dashboard',
      imageUrl: '/images/about/problem_solving_dsa.png',
      skills: [
        'Arrays',
        'Binary Search',
        'Sliding Window',
        'Trees',
        'Graphs',
        'Dynamic Programming',
      ],
    },
  ];
}
