import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-system-flow',
  standalone: true,
  templateUrl: './project-system-flow.component.html',
  styleUrl: './project-system-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSystemFlowComponent {
  readonly project = input.required<Project>();
}