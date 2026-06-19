import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_PROJECTS_CONFIG } from '../../../../core/config/theme-projects.config';
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

  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_PROJECTS_CONFIG[this.themeService.theme()];
  }
}
