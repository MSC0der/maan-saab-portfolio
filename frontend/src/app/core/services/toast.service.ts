import { Injectable, signal } from '@angular/core';

export interface Toast {
  readonly id: number;
  readonly message: string;
  readonly variant: 'error' | 'info';
}

const AUTO_DISMISS_MS = 4000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;

  readonly toasts = signal<readonly Toast[]>([]);

  show(message: string, variant: Toast['variant'] = 'info'): void {
    const id = this.nextId++;

    this.toasts.update((toasts) => [...toasts, { id, message, variant }]);

    setTimeout(() => this.dismiss(id), AUTO_DISMISS_MS);
  }

  dismiss(id: number): void {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
