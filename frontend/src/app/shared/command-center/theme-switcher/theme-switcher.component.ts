import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';

import { ThemeService, ThemeType } from '../../../core/services/theme.service';
import { CommandCenterService } from '../services/command-center.service';
import { THEME_OPTIONS } from '../data/theme-options.data';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly commandCenter = inject(CommandCenterService);

  protected readonly themes = THEME_OPTIONS;

  protected readonly rememberChoice = signal(true);

  protected selectTheme(themeId: ThemeType): void {
    this.themeService.setTheme(themeId);

    if (this.rememberChoice()) {
      localStorage.setItem('portfolio-theme', themeId);
    } else {
      localStorage.removeItem('portfolio-theme');
    }

    this.commandCenter.close();
  }

  protected currentTheme(): ThemeType {
    return this.themeService.theme();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.commandCenter.close();
  }
}
