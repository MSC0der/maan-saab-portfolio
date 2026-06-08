import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectDataService } from '../../services/project-data.service';

@Component({
  selector: 'app-projects-grid',
  standalone: true,
  imports: [ProjectCardComponent],
  templateUrl: './projects-grid.component.html',
  styleUrl: './projects-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsGridComponent {
  private readonly projectService = inject(ProjectDataService);

  protected readonly projects = this.projectService.getProjects();
}