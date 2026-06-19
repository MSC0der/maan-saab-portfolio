import { ChangeDetectionStrategy, Component } from '@angular/core';
import { inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_ABOUT_CONFIG } from '../../../../core/config/theme-about.config';
import { AboutIconComponent } from '../about-icon/about-icon.component';

@Component({
  selector: 'app-about-hero',
  standalone: true,
  imports: [AboutIconComponent],
  templateUrl: './about-hero.component.html',
  styleUrl: './about-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutHeroComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_ABOUT_CONFIG[this.themeService.theme()];
  }

  protected readonly heroImageUrl = '/images/about/maan-about-hero.png';
}
