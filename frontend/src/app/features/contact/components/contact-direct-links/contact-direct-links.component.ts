import { Component, inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONTACT_CONFIG } from '../../../../core/config/theme-contact.config';

@Component({
  selector: 'app-contact-direct-links',
  standalone: true,
  templateUrl: './contact-direct-links.component.html',
  styleUrl: './contact-direct-links.component.scss',
})
export class ContactDirectLinksComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_CONTACT_CONFIG[this.themeService.theme()];
  }
}
