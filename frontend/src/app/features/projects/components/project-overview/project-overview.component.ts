import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent {
  readonly project = input.required<Project>();
}