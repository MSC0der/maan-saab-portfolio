import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
  inject,
  signal,
} from '@angular/core';

import { ThemeService } from '../../../core/services/theme.service';

import { WORLD_RANGES } from '../immersive.config';
import { WorldId } from '../immersive.model';

interface ChromeItem {
  readonly index: string;
  readonly label: string;
  readonly world: WorldId;
  readonly worldName: string;
}

const ITEMS: readonly ChromeItem[] = [
  { index: '01', label: 'SYSTEM', world: 'core', worldName: 'CORE' },
  { index: '02', label: 'ARCHITECTURE', world: 'architecture', worldName: 'ARCHITECTURE' },
  { index: '03', label: 'PROJECTS', world: 'projects', worldName: 'PROJECT SYSTEMS' },
  { index: '04', label: 'EXPERIENCE', world: 'journey', worldName: 'ENGINEERING JOURNEY' },
  { index: '05', label: 'DSA', world: 'dsa', worldName: 'DSA LAB' },
  { index: '06', label: 'CONTACT', world: 'contact', worldName: 'CONTACT' },
];

const ENTRY_ITEM: ChromeItem = {
  index: '00',
  label: 'ENTRY',
  world: 'entry',
  worldName: 'SYSTEM ENTRY',
};

/**
 * Immersive-theme chrome: a floating identity, a SYSTEM ONLINE indicator and a
 * compact MENU that opens a restrained overlay. The overlay is both the
 * navigation and the "you are here" map of the one continuous system.
 *
 * Replaces the conventional header for the immersive theme only.
 */
@Component({
  selector: 'app-immersive-chrome',
  standalone: true,
  templateUrl: './immersive-chrome.component.html',
  styleUrl: './immersive-chrome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImmersiveChromeComponent {
  readonly world = input<WorldId>('entry');
  readonly worldSelect = output<WorldId>();

  private readonly themeService = inject(ThemeService);

  protected readonly items = ITEMS;
  protected readonly open = signal(false);

  protected readonly current = computed<ChromeItem>(() => {
    const world = this.world();
    if (world === 'collapse') {
      return ITEMS[ITEMS.length - 1];
    }
    return ITEMS.find((item) => item.world === world) ?? ENTRY_ITEM;
  });

  /** Leave the 3D world for the fast, scannable Brief view. */
  protected briefView(): void {
    this.themeService.setTheme('technical-dark');
  }

  protected isReady(id: WorldId): boolean {
    return WORLD_RANGES[id].end > WORLD_RANGES[id].start;
  }

  protected isActive(id: WorldId): boolean {
    return this.current().world === id;
  }

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected pick(id: WorldId): void {
    if (!this.isReady(id)) {
      return;
    }
    this.worldSelect.emit(id);
    this.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close();
  }
}
