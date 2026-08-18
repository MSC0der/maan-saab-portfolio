import { inject, Injectable, signal } from '@angular/core';
import { TransitionService } from '../../shared/command-center/services/transition.service';

export type ThemeType = 'technical-dark' | 'wayne';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly theme = signal<ThemeType>('technical-dark');

  private readonly transition = inject(TransitionService);
  private pendingTheme: ThemeType | null = null;

  constructor() {
    const savedTheme =
      (localStorage.getItem('portfolio-theme') as ThemeType) ??
      'technical-dark';

    this.theme.set(savedTheme);

    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  setTheme(theme: ThemeType): void {
    if (this.theme() === theme) {
      return;
    }

    this.pendingTheme = theme;

    this.transition.play(this.transition.preferred());
  }

  applyPendingTheme(): void {
    if (!this.pendingTheme) {
      return;
    }

    this.theme.set(this.pendingTheme);

    document.documentElement.setAttribute('data-theme', this.pendingTheme);

    localStorage.setItem('portfolio-theme', this.pendingTheme);

    this.pendingTheme = null;
  }
}
