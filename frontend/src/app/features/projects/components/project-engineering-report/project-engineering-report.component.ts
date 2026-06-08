import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-engineering-report',
  standalone: true,
  templateUrl: './project-engineering-report.component.html',
  styleUrl: './project-engineering-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEngineeringReportComponent {
  readonly project = input.required<Project>();
}
