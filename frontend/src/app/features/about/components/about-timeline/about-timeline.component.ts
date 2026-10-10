import { ChangeDetectionStrategy, Component } from '@angular/core';
import { inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_ABOUT_CONFIG } from '../../../../core/config/theme-about.config';
import { ENGINEERING_TIMELINE } from '../../data/timeline.data';

@Component({
  selector: 'app-about-timeline',
  standalone: true,
  templateUrl: './about-timeline.component.html',
  styleUrl: './about-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutTimelineComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_ABOUT_CONFIG[this.themeService.theme()];
  }

  protected readonly timeline = ENGINEERING_TIMELINE;
}
