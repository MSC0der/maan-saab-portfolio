import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class WayneTransitionService {
  play(
    weapon: HTMLElement,
    crack: HTMLElement,
    flash: HTMLElement,
    applyTheme: () => void,
    finish: () => void,
  ): void {
    gsap.killTweensOf(weapon);
    gsap.killTweensOf(crack);
    gsap.killTweensOf(flash);

    gsap.set(weapon, {
      x: -window.innerWidth * 0.45,
      y: -window.innerHeight * 0.32,

      scale: 0.18,

      rotation: -1080,

      opacity: 0.55,

      filter: 'blur(6px) brightness(.55)',

      transformOrigin: '50% 50%',

      force3D: true,
    });

    gsap.set(crack, {
      scale: 0.85,
      opacity: 0,
      transformOrigin: '50% 50%',
      force3D: true,
    });

    gsap.set(flash, {
      scale: 1,
      opacity: 0,
      transformOrigin: '50% 50%',
      force3D: true,
    });

    const tl = gsap.timeline({
      onComplete: finish,
    });

    const duration = 1.7;

    // Single continuous throw: position, scale, opacity and focus all
    // ease together on one curve so the batarang reads as one physical
    // flight (natural accelerate-in/decelerate-out) instead of the
    // disjointed stage-to-stage jumps that caused the teleport feel.
    tl.to(
      weapon,
      {
        duration,

        x: 0,
        y: 0,

        scale: 1,

        opacity: 1,

        filter: 'blur(0px) brightness(1)',

        ease: 'power2.inOut',
      },
      0,
    );

    // Continuous spin across the same duration, settling into the
    // landing rotation exactly as the throw arrives.
    tl.to(
      weapon,
      {
        duration,
        rotation: 0,
        ease: 'power2.out',
      },
      0,
    );

    // --- Beat 2: impact --------------------------------------------
    // Fires the instant the incoming flight above reaches the center.
    tl.addLabel('impact', duration);

    // Very brief white punch — appear then fade (~50ms total).
    tl.to(flash, { duration: 0.02, opacity: 0.85, ease: 'power1.out' }, 'impact')
      .to(flash, { duration: 0.03, opacity: 0, ease: 'power1.in' }, 'impact+=0.02');

    // Glass crack — sharp, punchy pop from slightly smaller to full size.
    // Peak opacity capped below 1 so it reads as thin fractures in the
    // glass rather than a dominant explosion behind the weapon.
    tl.fromTo(
      crack,
      { scale: 0.85, opacity: 0 },
      { duration: 0.09, scale: 1, opacity: 0.85, ease: 'back.out(3)' },
      'impact',
    );

    // --- Beat 3: brief recognition hold -----------------------------
    // Once the crack has fully appeared, the batarang stays completely
    // embedded and motionless — no wiggle, no reaction, no drift —
    // long enough for the viewer to register "it just hit my screen"
    // before anything else happens.
    tl.addLabel('hold', 'impact+=0.09');
    tl.to({}, { duration: 0.3 }, 'hold');

    // --- Beat 4: final impact / screen break ------------------------
    // Fires once the recognition hold ends. A single, stronger burst
    // right at the impact point — the batarang disappears into it
    // rather than flying away, and the crack blows outward with it as
    // the glass finally gives way.
    tl.addLabel('burst', 'hold+=0.3');

    // Bright flash with a strong radial expansion — reuses the
    // existing impact-flash element rather than adding a new one.
    // ~80ms total, pure white, no color/fire.
    tl.to(
      flash,
      { duration: 0.03, opacity: 1, scale: 1.15, ease: 'power1.out' },
      'burst',
    ).to(
      flash,
      { duration: 0.05, opacity: 0, scale: 1.9, ease: 'power1.in' },
      'burst+=0.03',
    );

    // The crack blows outward and dissolves with the burst — expanding
    // rather than shrinking, as if the glass has finally given way —
    // instead of just sitting there and fading in place.
    tl.to(
      crack,
      { duration: 0.08, opacity: 0, scale: 1.5, ease: 'power1.in' },
      'burst',
    );

    // The batarang itself is consumed by the burst: a very brief
    // brightness/scale punch, then it dissolves to nothing right where
    // it's embedded. No translation — it never leaves the impact point.
    tl.to(
      weapon,
      {
        duration: 0.03,
        scale: '+=0.06',
        filter: 'blur(2px) brightness(1.6)',
        ease: 'power1.out',
      },
      'burst',
    ).to(
      weapon,
      { duration: 0.07, opacity: 0, ease: 'power1.in' },
      'burst+=0.03',
    );

    // Theme reveal at the peak brightness of the burst, so the swap
    // happens hidden under the flash rather than before or after it.
    tl.call(applyTheme, [], 'burst+=0.03');

    // Brief pad so the fully-faded frame holds for an instant before
    // the transition completes and the Wayne theme is left visible.
    tl.to({}, { duration: 0.1 }, 'burst+=0.1');
  }
}
