import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { HomePageDefaultComponent } from '../home-page-default/home-page-default.component';
import { HomePageImmersiveComponent } from '../home-page-immersive/home-page-immersive.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HomePageDefaultComponent, HomePageImmersiveComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly theme = this.themeService.theme;
}
