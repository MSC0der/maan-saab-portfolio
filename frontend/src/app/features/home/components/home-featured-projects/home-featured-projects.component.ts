import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HomeCardComponent } from '../home-card/home-card.component';
import { HomeIconComponent } from '../home-icon/home-icon.component';
import { HomeTechChipComponent } from '../home-tech-chip/home-tech-chip.component';

interface FeaturedProject {
  readonly title: string;
  readonly summary: string;
  readonly visualLabel: string;
  readonly technologies: readonly string[];
  readonly slug: string;
}

@Component({
  selector: 'app-home-featured-projects',
  standalone: true,
  imports: [HomeCardComponent, HomeIconComponent, HomeTechChipComponent, RouterLink],
  templateUrl: './home-featured-projects.component.html',
  styleUrl: './home-featured-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFeaturedProjectsComponent {
  protected readonly featuredProjects: readonly FeaturedProject[] = [
    {
      title: 'Security Compliance System',
      summary:
        'An enterprise-grade compliance monitoring tool built with a focus on audit logging and data integrity.',
      visualLabel: 'System Architecture Diagram',
      technologies: ['Node.js', 'TypeScript'],
      slug: 'security-compliance-system',
    },
    {
      title: 'Garage Management System',
      summary:
        'A comprehensive SaaS platform for automotive repair shops handling inventory, booking, and invoicing.',
      visualLabel: 'Dashboard Interface',
      technologies: ['Angular', 'Node.js'],
      slug: 'garage-management-system',
    },
  ];
}
