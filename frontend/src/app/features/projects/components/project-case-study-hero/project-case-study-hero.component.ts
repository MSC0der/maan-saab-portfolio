import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-case-study-hero',
  standalone: true,
  templateUrl: './project-case-study-hero.component.html',
  styleUrl: './project-case-study-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCaseStudyHeroComponent {
  readonly project = input.required<Project>();
}
