import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { Project } from '../../models/project.model';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_PROJECTS_CONFIG } from '../../../../core/config/theme-projects.config';

@Component({
  selector: 'app-project-system-flow',
  standalone: true,
  templateUrl: './project-system-flow.component.html',
  styleUrl: './project-system-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSystemFlowComponent {
  readonly project = input.required<Project>();

  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_PROJECTS_CONFIG[this.themeService.theme()];
  }
}
