import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_PROJECTS_CONFIG } from '../../../../core/config/theme-projects.config';
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

  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_PROJECTS_CONFIG[this.themeService.theme()];
  }
}
