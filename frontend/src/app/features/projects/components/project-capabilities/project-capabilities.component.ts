import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_PROJECTS_CONFIG } from '../../../../core/config/theme-projects.config';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-capabilities',
  standalone: true,
  templateUrl: './project-capabilities.component.html',
  styleUrl: './project-capabilities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCapabilitiesComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_PROJECTS_CONFIG[this.themeService.theme()];
  }
  readonly project = input.required<Project>();
}
