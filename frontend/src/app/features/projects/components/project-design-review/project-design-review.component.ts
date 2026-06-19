import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_PROJECTS_CONFIG } from '../../../../core/config/theme-projects.config';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-design-review',
  standalone: true,
  templateUrl: './project-design-review.component.html',
  styleUrl: './project-design-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDesignReviewComponent {
  readonly project = input.required<Project>();

  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_PROJECTS_CONFIG[this.themeService.theme()];
  }

  protected readonly expandedIndex = signal<number | null>(0);

  protected toggle(index: number): void {
    this.expandedIndex.update((current) => (current === index ? null : index));
  }
}
