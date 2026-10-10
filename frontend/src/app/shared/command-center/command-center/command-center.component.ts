import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  computed,
  effect,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommandCenterService } from '../services/command-center.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { CommandDockComponent } from '../command-dock/command-dock.component';
import { AnimationCenterComponent } from '../animation-center/animation-center.component';
import { TerminalComponent } from '../terminal/terminal.component';

const PANEL_LABELS = {
  themes: 'Workspace themes',
  animations: 'Workspace transitions',
  terminal: 'Developer terminal',
} as const;

@Component({
  selector: 'app-command-center',
  standalone: true,
  imports: [
    CommandDockComponent,
    ThemeSwitcherComponent,
    AnimationCenterComponent,
    TerminalComponent,
  ],
  templateUrl: './command-center.component.html',
  styleUrl: './command-center.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandCenterComponent {
  protected readonly commandCenter = inject(CommandCenterService);

  private readonly document = inject(DOCUMENT);

  protected readonly activePanel = this.commandCenter.activePanel;

  protected readonly panelLabel = computed(() => {
    const panel = this.activePanel();
    return panel ? PANEL_LABELS[panel] : null;
  });

  constructor() {
    // Lock page scroll behind the open panel so a phone swipe never drags the
    // page underneath; always released again, including on destroy.
    effect(() => {
      this.document.body.style.overflow = this.activePanel() ? 'hidden' : '';
    });

    inject(DestroyRef).onDestroy(() => {
      this.document.body.style.overflow = '';
    });
  }

  protected close(): void {
    this.commandCenter.close();
  }

  /** One Escape handler for every panel (themes, animations, terminal). */
  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.activePanel()) {
      this.close();
    }
  }
}
