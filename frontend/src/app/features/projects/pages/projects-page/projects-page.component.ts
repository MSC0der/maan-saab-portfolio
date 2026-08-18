import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { ProjectsPageDefaultComponent } from '../projects-page-default/projects-page-default.component';
import { ProjectsPageWayneComponent } from '../projects-page-wayne/projects-page-wayne.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [ProjectsPageWayneComponent, ProjectsPageDefaultComponent],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPageComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly theme = this.themeService.theme;
}
