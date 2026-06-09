import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-case-study-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-case-study-hero.component.html',
  styleUrl: './project-case-study-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCaseStudyHeroComponent {
  readonly project = input.required<Project>();
}
