import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectFilterBarComponent } from '../../components/project-filter-bar/project-filter-bar.component';
import { HomeSectionComponent } from '../../../home/components/home-section/home-section.component';
import { ProjectsHeroComponent } from '../../components/projects-hero/projects-hero.component';
import { ProjectsGridComponent } from '../../components/projects-grid/projects-grid.component';
import { ProjectsCtaComponent } from '../../components/projects-cta/projects-cta.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [
    HomeSectionComponent,
    ProjectsHeroComponent,
    ProjectFilterBarComponent,
    ProjectsGridComponent,
    ProjectsCtaComponent
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPageComponent {}