import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-capabilities',
  standalone: true,
  templateUrl: './project-capabilities.component.html',
  styleUrl: './project-capabilities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCapabilitiesComponent {
  readonly project = input.required<Project>();
}
