import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  ARCHITECTURE_PHASE_AT,
  SCROLL_KEYFRAMES,
  WORLD_RANGES,
  worldAt,
} from '../immersive.config';
import { ScrollDrivenState, WorldId } from '../immersive.model';

gsap.registerPlugin(ScrollTrigger);

/** Numeric channels the GSAP timeline drives (all of `SCROLL_KEYFRAMES`). */
type ScrollChannel = keyof typeof SCROLL_KEYFRAMES;

const CHANNELS: readonly ScrollChannel[] = [
  'coreExpand',
  'ringSeparation',
  'nodeSpread',
  'archReveal',
  'projectsForm',
  'projectsFocus',
  'journeyForm',
  'journeyProgress',
  'contactSettle',
  'cameraDolly',
];

interface Keyframe {
  readonly at: number;
  readonly value: number;
}

/**
 * Derives scroll-snap targets from a stepped keyframe channel (`projectsFocus`,
 * `journeyProgress`): the midpoint of every flat "dwell" run — where the
 * channel holds a single value across a span of progress — clipped to
 * `[rangeStart, rangeEnd]`. One point per project / milestone, generated from
 * the same data the camera choreography already uses, so it never drifts out
 * of sync with a future re-tune of the keyframes.
 */
function computeDwellSnapPoints(
  frames: readonly Keyframe[],
  rangeStart: number,
  rangeEnd: number,
): number[] {
  const points: number[] = [];
  let runStart = frames[0].at;
  let runValue = frames[0].value;

  const closeRun = (runEndAt: number): void => {
    const at1 = Math.max(runStart, rangeStart);
    const at2 = Math.min(runEndAt, rangeEnd);
    if (at2 > at1) {
      points.push((at1 + at2) / 2);
    }
  };

  for (let i = 1; i < frames.length; i++) {
    if (frames[i].value !== runValue) {
      closeRun(frames[i - 1].at);
      runStart = frames[i].at;
      runValue = frames[i].value;
    }
  }
  closeRun(frames[frames.length - 1].at);

  return points;
}

/** Nearest of `points` to `value`, or `value` unchanged if `points` is empty. */
function nearest(points: readonly number[], value: number): number {
  let best = value;
  let bestDistance = Infinity;
  for (const point of points) {
    const distance = Math.abs(point - value);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = point;
    }
  }
  return best;
}

/**
 * Owns the CORE → ARCHITECTURE choreography. A single GSAP timeline, scrubbed by
 * one ScrollTrigger, tweens the shared `ScrollDrivenState` object; the scene
 * loop reads it. No standalone scroll listeners.
 *
 * Provided per-component so the timeline + trigger are killed with the host.
 */
@Injectable()
export class CoreScrollService {
  private timeline?: gsap.core.Timeline;
  private trigger?: ScrollTrigger;
  private refreshHandle = 0;

  /**
   * @param state    Shared choreography state, mutated in place.
   * @param trigger  The tall scroll-track element ScrollTrigger measures.
   * @param onProgress  Reports normalised progress + phase for the HUD.
   * @param reducedMotion  Uses a plain (non-inertial) scrub.
   */
  attach(
    state: ScrollDrivenState,
    trigger: HTMLElement,
    onProgress: (
      progress: number,
      phase: ScrollDrivenState['phase'],
      world: WorldId,
    ) => void,
    reducedMotion: boolean,
  ): void {
    // One snap point per project / journey milestone — scrolling settles on
    // whichever is nearest instead of resting halfway between two, so the
    // corridor reads as "stop at this project, then the next" rather than a
    // free scrub. Left disabled outside those two ranges (core/architecture/
    // contact stay freely scrollable) and under reduced motion (a snap is an
    // auto-scroll the user didn't initiate).
    const projectSnapPoints = computeDwellSnapPoints(
      SCROLL_KEYFRAMES.projectsFocus,
      WORLD_RANGES.projects.start,
      WORLD_RANGES.projects.end,
    );
    const journeySnapPoints = computeDwellSnapPoints(
      SCROLL_KEYFRAMES.journeyProgress,
      WORLD_RANGES.journey.start,
      WORLD_RANGES.journey.end,
    );
    const snapTo = (value: number): number => {
      if (
        value >= WORLD_RANGES.projects.start &&
        value <= WORLD_RANGES.projects.end
      ) {
        return nearest(projectSnapPoints, value);
      }
      if (
        value >= WORLD_RANGES.journey.start &&
        value <= WORLD_RANGES.journey.end
      ) {
        return nearest(journeySnapPoints, value);
      }
      return value;
    };

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: 'bottom bottom',
        scrub: reducedMotion ? true : 1,
        snap: reducedMotion
          ? undefined
          : {
              snapTo,
              duration: { min: 0.25, max: 0.6 },
              ease: 'power1.inOut',
              delay: 0.08,
            },
        onUpdate: (self) => {
          const phase =
            self.progress >= ARCHITECTURE_PHASE_AT ? 'ARCHITECTURE' : 'CORE';
          const world = worldAt(self.progress);
          state.phase = phase;
          state.world = world;
          onProgress(self.progress, phase, world);
        },
      },
    });

    // Build linear tweens between successive keyframes on a normalised 0..1
    // timeline. ScrollTrigger's scrub provides the smoothing.
    for (const channel of CHANNELS) {
      const frames = SCROLL_KEYFRAMES[channel];
      for (let i = 1; i < frames.length; i++) {
        const previous = frames[i - 1];
        const current = frames[i];
        timeline.to(
          state,
          { [channel]: current.value, duration: current.at - previous.at },
          previous.at,
        );
      }
    }

    // Guarantee the timeline spans exactly 0..1 even if a channel ends early.
    timeline.set({}, {}, 1);

    this.timeline = timeline;
    this.trigger = timeline.scrollTrigger;

    // Fonts / layout can shift the track height after first paint.
    this.refreshHandle = window.requestAnimationFrame(() =>
      ScrollTrigger.refresh(),
    );
  }

  dispose(): void {
    if (this.refreshHandle) {
      cancelAnimationFrame(this.refreshHandle);
      this.refreshHandle = 0;
    }
    this.trigger?.kill();
    this.timeline?.kill();
    this.trigger = undefined;
    this.timeline = undefined;
  }
}
