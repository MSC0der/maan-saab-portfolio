import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_HOME_CONFIG } from '../../../../core/config/theme-home.config';

@Component({
  selector: 'app-home-status',
  standalone: true,
  templateUrl: './home-status.component.html',
  styleUrl: './home-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeStatusComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_HOME_CONFIG[this.themeService.theme()];
  }
}
