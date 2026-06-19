import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_PROJECTS_CONFIG } from '../../../../core/config/theme-projects.config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-next-project',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-next-project.component.html',
  styleUrl: './project-next-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNextProjectComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_PROJECTS_CONFIG[this.themeService.theme()];
  }
}
