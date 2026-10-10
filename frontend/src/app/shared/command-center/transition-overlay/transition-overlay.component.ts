import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  effect,
  NgZone,
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
  private readonly zone = inject(NgZone);

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

  ngAfterViewInit(): void {
    this.warmWayneAssets();
  }

  /**
   * The Wayne `<img>`s only exist once the transition starts, so the first
   * throw used to fetch + rasterise a 300KB SVG on its opening frame. Decode
   * both ahead of time so they're in the image cache when the animation begins.
   */
  private warmWayneAssets(): void {
    for (const src of ['images/aru-x1.png', 'images/glass-impact.svg']) {
      const img = new Image();
      img.src = src;
      void img.decode().catch(() => undefined);
    }
  }

  private playFor(type: TransitionType): void {
    // GSAP ticks every frame; inside the zone each tick triggers a full
    // change-detection pass. Run the timelines outside Angular and re-enter
    // only for the two callbacks that touch signals.
    this.zone.runOutsideAngular(() => this.dispatch(type));
  }

  private applyTheme = (): void =>
    this.zone.run(() => this.themeService.applyPendingTheme());

  private finish = (): void => this.zone.run(() => this.transition.finish());

  private dispatch(type: TransitionType): void {
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
        this.applyTheme();
        this.finish();
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
      this.applyTheme,
      this.finish,
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
      this.applyTheme,
      this.finish,
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
      this.applyTheme,
      this.finish,
    );
  }

  private playFade(): void {
    if (!this.fadeBackdrop) {
      return;
    }

    this.fadeTransition.play(
      this.fadeBackdrop.nativeElement,
      this.applyTheme,
      this.finish,
    );
  }
}
