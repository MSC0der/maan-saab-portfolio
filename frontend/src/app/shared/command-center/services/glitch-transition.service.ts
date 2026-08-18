import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class GlitchTransitionService {
  play(
    backdrop: HTMLElement,
    slices: readonly HTMLElement[],
    flash: HTMLElement,
    applyTheme: () => void,
    finish: () => void,
  ): void {
    gsap.killTweensOf([backdrop, flash, ...slices]);

    gsap.set(backdrop, { opacity: 0 });
    gsap.set(flash, { opacity: 0 });
    gsap.set(slices, { xPercent: 0, opacity: 0 });

    const tl = gsap.timeline({ onComplete: finish });

    tl.to(backdrop, { duration: 0.06, opacity: 1, ease: 'power1.out' });

    // Each band kicks sideways and flickers a handful of times, out of
    // sync with its neighbours, so the whole frame reads as corrupted
    // signal rather than a single clean glitch.
    slices.forEach((slice, i) => {
      const jitter = gsap.timeline();
      const kicks = 3 + (i % 3);

      for (let k = 0; k < kicks; k++) {
        jitter
          .to(slice, {
            duration: 0.035,
            xPercent: gsap.utils.random(-8, 8),
            opacity: gsap.utils.random(0.35, 0.85),
            ease: 'none',
          })
          .to(
            slice,
            { duration: 0.03, xPercent: 0, opacity: 0, ease: 'none' },
            '>',
          );
      }

      tl.add(jitter, 0.05 + i * 0.015);
    });

    // Theme swaps mid-chaos, hidden by the noise.
    tl.call(applyTheme, [], '+=0.06');

    // One clean white punch marks the moment the signal locks back in.
    tl.to(flash, { duration: 0.03, opacity: 0.55, ease: 'power1.out' }, '<')
      .to(flash, { duration: 0.09, opacity: 0, ease: 'power1.in' }, '>');

    tl.to(
      backdrop,
      { duration: 0.22, opacity: 0, ease: 'power1.in' },
      '+=0.04',
    );
  }
}
