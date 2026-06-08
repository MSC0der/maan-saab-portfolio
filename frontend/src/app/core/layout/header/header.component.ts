import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { PRIMARY_NAVIGATION } from '../../config/navigation.config';
import { SITE_CONFIG } from '../../config/site.config';
import { NavigationItem } from '../../types/navigation.types';

interface HeaderNavigationItem {
  readonly label: string;
  readonly path: string;
  readonly exact: boolean;
  readonly fragmentOnly?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly site = SITE_CONFIG;
  protected readonly navigation = this.buildNavigation();

  private buildNavigation(): readonly HeaderNavigationItem[] {
    const navigationByLabel = new Map<string, NavigationItem>(
      PRIMARY_NAVIGATION.map((item) => [item.label, item]),
    );

    return [
      navigationByLabel.get('Home'),
      navigationByLabel.get('Projects'),
      navigationByLabel.get('About'),
      navigationByLabel.get('Blog'),
      navigationByLabel.get('Contact'),
    ].filter((item): item is HeaderNavigationItem => item !== undefined);
  }
}
