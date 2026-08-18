import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class ScanTransitionService {
  play(
    backdrop: HTMLElement,
    grid: HTMLElement,
    line: HTMLElement,
    applyTheme: () => void,
    finish: () => void,
  ): void {
    gsap.killTweensOf([backdrop, grid, line]);

    gsap.set(backdrop, { opacity: 1 });
    gsap.set(grid, { opacity: 0 });
    gsap.set(line, { top: '-4%', opacity: 0 });

    const tl = gsap.timeline({ onComplete: finish });

    // The engineering grid powers on under the backdrop.
    tl.to(grid, { duration: 0.16, opacity: 0.4, ease: 'power1.out' });

    // A single scan line sweeps top to bottom, the way a radar or
    // diagnostic pass reads the whole interface in one stroke.
    tl.to(line, { duration: 0.05, opacity: 1 }, '<')
      .to(line, { duration: 0.62, top: '104%', ease: 'power1.inOut' }, '<');

    // Theme swaps once the sweep has passed the midpoint, hidden behind
    // the backdrop.
    tl.call(applyTheme, [], '-=0.25');

    // Brief hold once the pass completes, then the grid and backdrop
    // dissolve together to reveal the new workspace.
    tl.to({}, { duration: 0.1 });
    tl.to(line, { duration: 0.15, opacity: 0, ease: 'power1.in' }, '<');
    tl.to(grid, { duration: 0.28, opacity: 0, ease: 'power1.in' }, '<');
    tl.to(backdrop, { duration: 0.32, opacity: 0, ease: 'power1.in' }, '<');
  }
}
