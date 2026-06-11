import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-security-architecture',
  standalone: true,
  templateUrl: './project-security-architecture.component.html',
  styleUrl: './project-security-architecture.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSecurityArchitectureComponent {
  readonly project = input.required<Project>();
}