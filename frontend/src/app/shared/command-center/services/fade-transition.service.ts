import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class FadeTransitionService {
  play(
    backdrop: HTMLElement,
    applyTheme: () => void,
    finish: () => void,
  ): void {
    gsap.killTweensOf(backdrop);
    gsap.set(backdrop, { opacity: 0 });

    const tl = gsap.timeline({ onComplete: finish });

    tl.to(backdrop, { duration: 0.32, opacity: 1, ease: 'power1.inOut' });

    tl.call(applyTheme);

    tl.to({}, { duration: 0.14 });
    tl.to(backdrop, { duration: 0.38, opacity: 0, ease: 'power1.inOut' });
  }
}
