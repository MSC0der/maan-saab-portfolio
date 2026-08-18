import { Injectable } from '@angular/core';
import { RECAPTCHA_SITE_KEY } from '../config/recaptcha.config';

declare const grecaptcha: {
  render: (
    container: HTMLElement,
    params: { sitekey: string; theme?: 'light' | 'dark' },
  ) => number;
  getResponse: (widgetId: number) => string;
  reset: (widgetId: number) => void;
};

const SCRIPT_SRC = 'https://www.google.com/recaptcha/api.js';

/**
 * Thin wrapper around the Google reCAPTCHA v2 widget. The script is loaded
 * lazily (only when the contact form actually renders it) rather than added
 * globally to index.html, so pages that never show the form don't pay for it.
 */
@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private scriptPromise: Promise<void> | null = null;

  isConfigured(): boolean {
    return !RECAPTCHA_SITE_KEY.startsWith('YOUR_');
  }

  async render(container: HTMLElement): Promise<number> {
    await this.loadScript();
    return grecaptcha.render(container, {
      sitekey: RECAPTCHA_SITE_KEY,
      theme: 'dark',
    });
  }

  getResponse(widgetId: number): string {
    return typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse(widgetId) : '';
  }

  reset(widgetId: number): void {
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.reset(widgetId);
    }
  }

  private loadScript(): Promise<void> {
    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    this.scriptPromise = new Promise((resolve, reject) => {
      if (typeof grecaptcha !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA.'));
      document.head.appendChild(script);
    });

    return this.scriptPromise;
  }
}
