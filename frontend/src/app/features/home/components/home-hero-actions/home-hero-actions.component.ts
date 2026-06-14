import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_HOME_CONFIG } from '../../../../core/config/theme-home.config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-hero-actions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-hero-actions.component.html',
  styleUrl: './home-hero-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeroActionsComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_HOME_CONFIG[this.themeService.theme()];
  }
}
