import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AboutIconComponent,
  AboutIconName,
} from '../about-icon/about-icon.component';
import { inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_ABOUT_CONFIG } from '../../../../core/config/theme-about.config';

interface ExperienceCard {
  readonly icon: AboutIconName;
  readonly title: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

@Component({
  selector: 'app-about-experience-wayne',
  standalone: true,
  imports: [AboutIconComponent],
  templateUrl: './about-experience-wayne.component.html',
  styleUrl: './about-experience-wayne.component.scss',
})
export class AboutExperienceWayneComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_ABOUT_CONFIG[this.themeService.theme()];
  }
  protected readonly cards: readonly ExperienceCard[] = [
    {
      icon: 'hub',
      title: 'REST API Architecture',
      description:
        'Architected and maintained highly scalable backend APIs utilizing Node.js and Express.js, ensuring low-latency data retrieval and robust service orchestration.',
      imageAlt: 'REST API backend system architecture',
      imageUrl: '/images/about/rest_api_structure.png',
    },
    {
      icon: 'lock',
      title: 'Identity & Access Management',
      description:
        'Implemented rigorous JWT authentication mechanisms, Role-Based Access Control (RBAC), and strict validation layers to secure internal service perimeters.',
      imageAlt: 'Digital security protocols and authentication workflows',
      imageUrl: '/images/about/identity_access_management.png',
    },
    {
      icon: 'database',
      title: 'Schema Optimization',
      description:
        'Optimized complex MongoDB document structures and refined SQL querying logic, significantly reducing query execution time and improving overall system throughput.',
      imageAlt: 'Database clusters and storage optimization',
      imageUrl: '/images/about/sechema_optimization.png',
    },
  ];
}
