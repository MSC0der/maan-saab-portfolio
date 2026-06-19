import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONTACT_CONFIG } from '../../../../core/config/theme-contact.config';

@Component({
  selector: 'app-contact-sidebar-cta',
  standalone: true,
  templateUrl: './contact-sidebar-cta.component.html',
  styleUrl: './contact-sidebar-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSidebarCtaComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_CONTACT_CONFIG[this.themeService.theme()];
  }
}
