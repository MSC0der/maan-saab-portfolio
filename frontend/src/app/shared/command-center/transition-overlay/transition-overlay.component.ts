import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  effect,
  inject,
} from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import {
  TransitionService,
  TransitionType,
} from '../services/transition.service';
import { WayneTransitionService } from '../services/wayne-transition.service';
import { ScanTransitionService } from '../services/scan-transition.service';
import { GlitchTransitionService } from '../services/glitch-transition.service';
import { FadeTransitionService } from '../services/fade-transition.service';

@Component({
  selector: 'app-transition-overlay',
  standalone: true,
  templateUrl: './transition-overlay.component.html',
  styleUrl: './transition-overlay.component.scss',
})
export class TransitionOverlayComponent implements AfterViewInit {
  protected readonly transition = inject(TransitionService);

  private readonly themeService = inject(ThemeService);

  private readonly wayneTransition = inject(WayneTransitionService);
  private readonly scanTransition = inject(ScanTransitionService);
  private readonly glitchTransition = inject(GlitchTransitionService);
  private readonly fadeTransition = inject(FadeTransitionService);

  private readonly transitionEffect = effect(() => {
    if (!this.transition.active()) {
      return;
    }

    const type = this.transition.transition();

    if (!type) {
      return;
    }

    // Deferred a frame (even for "instant") so the signal writes below
    // never land inside this same effect's synchronous run.
    requestAnimationFrame(() => this.playFor(type));
  });

  @ViewChild('weapon')
  private weapon?: ElementRef<HTMLElement>;

  @ViewChild('impactCrack')
  private impactCrack?: ElementRef<HTMLElement>;

  @ViewChild('impactFlash')
  private impactFlash?: ElementRef<HTMLElement>;

  @ViewChild('scanBackdrop')
  private scanBackdrop?: ElementRef<HTMLElement>;

  @ViewChild('scanGrid')
  private scanGrid?: ElementRef<HTMLElement>;

  @ViewChild('scanLine')
  private scanLine?: ElementRef<HTMLElement>;

  @ViewChild('glitchBackdrop')
  private glitchBackdrop?: ElementRef<HTMLElement>;

  @ViewChild('glitchFlash')
  private glitchFlash?: ElementRef<HTMLElement>;

  @ViewChildren('glitchSlice')
  private glitchSlices?: QueryList<ElementRef<HTMLElement>>;

  @ViewChild('fadeBackdrop')
  private fadeBackdrop?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {}

  private playFor(type: TransitionType): void {
    switch (type) {
      case 'wayne':
        this.playWayne();
        return;
      case 'scan':
        this.playScan();
        return;
      case 'glitch':
        this.playGlitch();
        return;
      case 'fade':
        this.playFade();
        return;
      case 'instant':
        // No animation by design: apply the new theme and drop the
        // overlay immediately.
        this.themeService.applyPendingTheme();
        this.transition.finish();
        return;
    }
  }

  private playWayne(): void {
    if (!this.weapon || !this.impactCrack || !this.impactFlash) {
      return;
    }

    this.wayneTransition.play(
      this.weapon.nativeElement,
      this.impactCrack.nativeElement,
      this.impactFlash.nativeElement,
      () => this.themeService.applyPendingTheme(),
      () => this.transition.finish(),
    );
  }

  private playScan(): void {
    if (!this.scanBackdrop || !this.scanGrid || !this.scanLine) {
      return;
    }

    this.scanTransition.play(
      this.scanBackdrop.nativeElement,
      this.scanGrid.nativeElement,
      this.scanLine.nativeElement,
      () => this.themeService.applyPendingTheme(),
      () => this.transition.finish(),
    );
  }

  private playGlitch(): void {
    if (!this.glitchBackdrop || !this.glitchFlash || !this.glitchSlices) {
      return;
    }

    const slices = this.glitchSlices
      .toArray()
      .map((ref) => ref.nativeElement);

    if (!slices.length) {
      return;
    }

    this.glitchTransition.play(
      this.glitchBackdrop.nativeElement,
      slices,
      this.glitchFlash.nativeElement,
      () => this.themeService.applyPendingTheme(),
      () => this.transition.finish(),
    );
  }

  private playFade(): void {
    if (!this.fadeBackdrop) {
      return;
    }

    this.fadeTransition.play(
      this.fadeBackdrop.nativeElement,
      () => this.themeService.applyPendingTheme(),
      () => this.transition.finish(),
    );
  }
}
