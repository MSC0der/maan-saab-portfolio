import { Injectable, signal } from '@angular/core';

export type ThemeType = 'technical-dark' | 'wayne';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly theme = signal<ThemeType>('technical-dark');

  setTheme(theme: ThemeType): void {
    this.theme.set(theme);

    document.documentElement.setAttribute('data-theme', theme);
  }
}
