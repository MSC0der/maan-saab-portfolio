import { Injectable, signal } from '@angular/core';

export type TransitionType = 'scan' | 'wayne' | 'glitch' | 'fade' | 'instant';

const STORAGE_KEY = 'portfolio-transition';

const DEFAULT_TRANSITION: TransitionType = 'scan';

@Injectable({
  providedIn: 'root',
})
export class TransitionService {
  readonly active = signal(false);

  readonly transition = signal<TransitionType | null>(null);

  /** The user's chosen "how the interface changes" style, used for every
   * real theme swap. Loaded from storage so the choice survives reloads. */
  readonly preferred = signal<TransitionType>(this.loadPreferred());

  private loadPreferred(): TransitionType {
    const saved = localStorage.getItem(STORAGE_KEY) as TransitionType | null;

    const valid: readonly TransitionType[] = [
      'scan',
      'wayne',
      'glitch',
      'fade',
      'instant',
    ];

    return saved && valid.includes(saved) ? saved : DEFAULT_TRANSITION;
  }

  setPreferred(type: TransitionType, remember: boolean): void {
    this.preferred.set(type);

    if (remember) {
      localStorage.setItem(STORAGE_KEY, type);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  play(type: TransitionType) {
    this.transition.set(type);
    this.active.set(true);
  }

  finish() {
    this.active.set(false);
    this.transition.set(null);
  }
}
