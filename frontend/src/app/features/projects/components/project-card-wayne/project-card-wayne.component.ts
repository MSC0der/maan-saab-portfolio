import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-card-wayne',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-card-wayne.component.html',
  styleUrl: './project-card-wayne.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardWayneComponent {
  readonly project = input.required<Project>();
}
