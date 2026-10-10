import { inject, Injectable, signal } from '@angular/core';
import { TransitionService } from '../../shared/command-center/services/transition.service';
import { isWebGLAvailable } from '../../features/immersive/webgl-support.util';

export type ThemeType = 'technical-dark' | 'wayne' | 'immersive';

/** Themes that ship a full content configuration of their own. The immersive
 * Engineering Core theme reuses the technical-dark copy for secondary pages and
 * replaces only the home experience, so it is layered on top of this set. */
export type ConfiguredTheme = Exclude<ThemeType, 'immersive'>;

const THEME_STORAGE_KEY = 'portfolio-theme';
const THEMES: readonly ThemeType[] = ['technical-dark', 'wayne', 'immersive'];

/**
 * Whether this device can comfortably run the 3D "Experience" view: a desktop
 * with a fine pointer and WebGL, decent memory/cores, and no reduced-motion or
 * data-saver preference. Everyone else gets the fast "Brief" view by default.
 */
function canRunExperience(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return (
    window.matchMedia('(pointer: fine)').matches &&
    window.matchMedia('(min-width: 1024px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !nav.connection?.saveData &&
    (nav.deviceMemory ?? 8) >= 4 &&
    (nav.hardwareConcurrency ?? 8) >= 4 &&
    isWebGLAvailable()
  );
}

/** `?view=brief` / `?view=experience` lets you send a recruiter a specific view. */
function themeFromUrl(): ThemeType | null {
  const view = new URLSearchParams(window.location.search).get('view');
  if (view === 'brief') {
    return 'technical-dark';
  }
  return view === 'experience' ? 'immersive' : null;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly theme = signal<ThemeType>('technical-dark');

  /** True when the 3D Experience view is worth offering on this device. */
  readonly canExperience = canRunExperience();

  private readonly transition = inject(TransitionService);
  private pendingTheme: ThemeType | null = null;

  constructor() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType | null;
    const saved = stored && THEMES.includes(stored) ? stored : null;
    const fromUrl = themeFromUrl();

    const savedTheme: ThemeType =
      fromUrl ?? saved ?? (this.canExperience ? 'immersive' : 'technical-dark');

    if (fromUrl) {
      localStorage.setItem(THEME_STORAGE_KEY, fromUrl);
    }

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

    localStorage.setItem(THEME_STORAGE_KEY, this.pendingTheme);

    this.pendingTheme = null;
  }
}
