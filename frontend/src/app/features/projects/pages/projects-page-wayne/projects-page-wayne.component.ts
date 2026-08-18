import { Component } from '@angular/core';
import { HomeSectionComponent } from '../../../home/components/home-section/home-section.component';
import { ProjectFilterBarComponent } from '../../components/project-filter-bar/project-filter-bar.component';
import { ProjectsGridComponent } from '../../components/projects-grid/projects-grid.component';
import { ProjectsCtaComponent } from '../../components/projects-cta/projects-cta.component';
import { ProjectsIntelligenceComponent } from '../../components/projects-intelligence/projects-intelligence.component';
import { ProjectsHeroWayneComponent } from "../../components/projects-hero-wayne/projects-hero-wayne.component";

@Component({
  selector: 'app-projects-page-wayne',
  standalone: true,
  imports: [
    HomeSectionComponent,
    ProjectFilterBarComponent,
    ProjectsGridComponent,
    ProjectsCtaComponent,
    ProjectsIntelligenceComponent,
    ProjectsHeroWayneComponent
],

  templateUrl: './projects-page-wayne.component.html',
  styleUrl: './projects-page-wayne.component.scss',
})
export class ProjectsPageWayneComponent {}
