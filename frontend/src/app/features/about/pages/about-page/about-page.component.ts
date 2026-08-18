import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AboutPageWayneComponent } from '../about-page-wayne/about-page-wayne.component';
import { AboutPageDefaultComponent } from '../about-page-default/about-page-default.component';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [AboutPageWayneComponent, AboutPageDefaultComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly theme = this.themeService.theme;
}
