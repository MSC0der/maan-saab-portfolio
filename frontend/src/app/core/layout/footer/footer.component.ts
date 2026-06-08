import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PRIMARY_NAVIGATION } from '../../config/navigation.config';
import { SITE_CONFIG } from '../../config/site.config';
import { SocialLink } from '../../types/navigation.types';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly site = SITE_CONFIG;
  protected readonly navigation = PRIMARY_NAVIGATION;
  protected readonly copyright = `© 2024 ${this.site.ownerName} (${this.site.brandName}). All rights reserved.`;
  protected readonly socialLinks: readonly SocialLink[] = [
    ...this.site.socialLinks,
    {
      label: 'Twitter',
      url: '#',
    },
  ];
}
