import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { THEME_HEADER_CONFIG } from '../../config/theme.config';
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

  protected readonly themeConfig;

  protected readonly navigation: readonly HeaderNavigationItem[];

  constructor(private readonly themeService: ThemeService) {
    this.themeConfig = THEME_HEADER_CONFIG[this.themeService.theme()];

    this.navigation = this.buildNavigation();
  }

  private buildNavigation(): readonly HeaderNavigationItem[] {
    const navigationByLabel = new Map<string, NavigationItem>(
      PRIMARY_NAVIGATION.map((item) => [item.label, item]),
    );

    return [
      {
        ...navigationByLabel.get('Home')!,
        label: this.themeConfig.navigation.home,
      },
      {
        ...navigationByLabel.get('Projects')!,
        label: this.themeConfig.navigation.projects,
      },
      {
        ...navigationByLabel.get('About')!,
        label: this.themeConfig.navigation.about,
      },
      {
        ...navigationByLabel.get('Blog')!,
        label: this.themeConfig.navigation.blog,
      },
      {
        ...navigationByLabel.get('Contact')!,
        label: this.themeConfig.navigation.contact,
      },
    ];
  }
}
