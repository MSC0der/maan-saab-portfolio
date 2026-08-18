import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectDataService } from '../../services/project-data.service';
import { ProjectCardWayneComponent } from "../project-card-wayne/project-card-wayne.component";

@Component({
  selector: 'app-projects-grid-wayne',
  standalone: true,
  imports: [ProjectCardWayneComponent],
  templateUrl: './projects-grid-wayne.component.html',
  styleUrl: './projects-grid-wayne.component.scss',
})
export class ProjectsGridWayneComponent {
  private readonly projectService = inject(ProjectDataService);
  protected readonly projects = this.projectService.filteredProjects;
}
