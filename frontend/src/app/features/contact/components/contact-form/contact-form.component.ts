import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONTACT_CONFIG } from '../../../../core/config/theme-contact.config';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_CONTACT_CONFIG[this.themeService.theme()];
  }
}
