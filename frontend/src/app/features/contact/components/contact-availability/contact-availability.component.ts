import { Component, inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONTACT_CONFIG } from '../../../../core/config/theme-contact.config';

@Component({
  selector: 'app-contact-availability',
  standalone: true,
  templateUrl: './contact-availability.component.html',
  styleUrl: './contact-availability.component.scss',
})
export class ContactAvailabilityComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_CONTACT_CONFIG[this.themeService.theme()];
  }
}
