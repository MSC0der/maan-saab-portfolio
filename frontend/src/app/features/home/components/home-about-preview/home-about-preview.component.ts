import { inject, ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_HOME_CONFIG } from '../../../../core/config/theme-home.config';
import { HomeIconComponent } from '../home-icon/home-icon.component';

interface EngineeringPoint {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-home-about-preview',
  standalone: true,
  imports: [HomeIconComponent],
  templateUrl: './home-about-preview.component.html',
  styleUrl: './home-about-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeAboutPreviewComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_HOME_CONFIG[this.themeService.theme()];
  }

  protected readonly engineeringPoints: readonly EngineeringPoint[] = [
    {
      title: 'REST APIs:',
      description: 'Designing clean, documented, and versioned endpoints.',
    },
    {
      title: 'Security:',
      description: 'Implementing robust JWT auth, RBAC, and data encryption.',
    },
    {
      title: 'Optimization:',
      description: 'Query profiling, caching strategies, and reducing latency.',
    },
  ];
}
