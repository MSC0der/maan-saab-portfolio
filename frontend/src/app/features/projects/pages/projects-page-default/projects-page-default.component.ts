import { Component } from '@angular/core';
import { HomeSectionComponent } from '../../../home/components/home-section/home-section.component';
import { ProjectsHeroComponent } from '../../components/projects-hero/projects-hero.component';
import { ProjectFilterBarComponent } from '../../components/project-filter-bar/project-filter-bar.component';
import { ProjectsGridComponent } from '../../components/projects-grid/projects-grid.component';
import { ProjectsCtaComponent } from '../../components/projects-cta/projects-cta.component';
import { ProjectsIntelligenceComponent } from '../../components/projects-intelligence/projects-intelligence.component';

@Component({
  selector: 'app-projects-page-default',
  standalone: true,
  imports: [
    HomeSectionComponent,
    ProjectsHeroComponent,
    ProjectFilterBarComponent,
    ProjectsGridComponent,
    ProjectsCtaComponent,
  ],
  templateUrl: './projects-page-default.component.html',
  styleUrl: './projects-page-default.component.scss',
})
export class ProjectsPageDefaultComponent {}
