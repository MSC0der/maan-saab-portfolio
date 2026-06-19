import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONTACT_CONFIG } from '../../../../core/config/theme-contact.config';

@Component({
  selector: 'app-contact-focus-areas',
  standalone: true,
  templateUrl: './contact-focus-areas.component.html',
  styleUrl: './contact-focus-areas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFocusAreasComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_CONTACT_CONFIG[this.themeService.theme()];
  }
}