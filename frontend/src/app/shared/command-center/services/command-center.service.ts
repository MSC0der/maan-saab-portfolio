import { Injectable, signal } from '@angular/core';

export type CommandPanel = 'themes' | 'animations' | 'terminal' | null;

@Injectable({
  providedIn: 'root',
})
export class CommandCenterService {
  readonly activePanel = signal<CommandPanel>(null);

  open(panel: CommandPanel) {
    this.activePanel.set(panel);
  }

  close() {
    this.activePanel.set(null);
  }

  toggle(panel: CommandPanel) {
    this.activePanel.update((current) => (current === panel ? null : panel));
  }
}
