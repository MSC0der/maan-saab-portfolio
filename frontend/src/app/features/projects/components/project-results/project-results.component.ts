import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-results',
  standalone: true,
  templateUrl: './project-results.component.html',
  styleUrl: './project-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectResultsComponent {
  readonly project = input.required<Project>();
}
