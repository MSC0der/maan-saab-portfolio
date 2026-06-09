import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ProjectDataService } from '../../services/project-data.service';

@Component({
  selector: 'app-project-filter-bar',
  standalone: true,
  templateUrl: './project-filter-bar.component.html',
  styleUrl: './project-filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFilterBarComponent {
  private readonly projectService = inject(ProjectDataService);

  protected readonly filters = this.projectService.getFilters();

  protected readonly selectedFilter = this.projectService.selectedFilter;

  protected selectFilter(filter: string): void {
    this.projectService.setFilter(filter);
  }
}
