import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_HOME_CONFIG } from '../../../../core/config/theme-home.config';

@Component({
  selector: 'app-home-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-cta.component.html',
  styleUrl: './home-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCtaComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_HOME_CONFIG[this.themeService.theme()];
  }
}
