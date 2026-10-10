import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import { detectQuality } from './immersive.config';
import {
  ActiveMilestoneView,
  ActiveNodeView,
  ActiveProjectView,
  WorldId,
} from './immersive.model';
import {
  buildImmersiveProjectSpecs,
  buildImmersiveProjectViews,
} from './immersive-data';
import {
  buildJourneyMilestones,
  buildJourneyViews,
} from './immersive-journey.data';
import { isWebGLAvailable } from './webgl-support.util';
import {
  NETWORK_NODES,
  buildAdjacency,
} from './technology-network.data';
import { CoreInteractionService } from './services/core-interaction.service';
import { CoreScrollService } from './services/core-scroll.service';
import { EngineeringCoreSceneService } from './services/engineering-core-scene.service';

/**
 * Canvas host for the immersive engineering world. Wires the three separated
 * concerns — scene (Three.js), interaction (raycasting / parallax) and scroll
 * (GSAP ScrollTrigger) — and forwards scene events to the Angular overlay.
 *
 * Loaded through an `@defer` block so `three` and `gsap/ScrollTrigger` stay out
 * of the home route chunk for every non-immersive visitor.
 */
@Component({
  selector: 'app-immersive-core',
  standalone: true,
  templateUrl: './immersive-core.component.html',
  styleUrl: './immersive-core.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EngineeringCoreSceneService,
    CoreInteractionService,
    CoreScrollService,
  ],
})
export class ImmersiveCoreComponent implements AfterViewInit, OnDestroy {
  /** The tall scroll-track element GSAP ScrollTrigger measures. */
  readonly scrollTrack = input.required<HTMLElement>();
  /** Honour prefers-reduced-motion (computed once by the parent). */
  readonly reducedMotion = input(false);

  readonly activeNode = output<ActiveNodeView | null>();
  readonly hoverNode = output<string | null>();
  readonly activeProject = output<ActiveProjectView | null>();
  readonly hoverProject = output<string | null>();
  readonly activeMilestone = output<ActiveMilestoneView | null>();
  readonly hoverMilestone = output<string | null>();
  readonly progress = output<number>();
  readonly phase = output<'CORE' | 'ARCHITECTURE'>();
  readonly world = output<WorldId>();
  /** Emitted if WebGL init throws after the capability probe passed. */
  readonly renderFailed = output<void>();

  private readonly canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly scene = inject(EngineeringCoreSceneService);
  private readonly interaction = inject(CoreInteractionService);
  private readonly scroll = inject(CoreScrollService);

  private readonly adjacency = buildAdjacency();
  private readonly projectViews = buildImmersiveProjectViews();
  private readonly milestoneViews = buildJourneyViews();
  private started = false;
  private lastPhase: 'CORE' | 'ARCHITECTURE' = 'CORE';
  private lastWorld: WorldId = 'entry';
  private lastProgressPercent = -1;

  ngAfterViewInit(): void {
    if (!isWebGLAvailable()) {
      this.renderFailed.emit();
      return;
    }

    const canvas = this.canvasRef().nativeElement;
    const hostElement = this.host.nativeElement;
    const quality = detectQuality();
    const reduced = this.reducedMotion();
    const projectSpecs = buildImmersiveProjectSpecs();
    const journeySpecs = buildJourneyMilestones();

    // Keep the render loop + GSAP ticker out of Angular's zone so they never
    // trigger change detection; hop back in only for real UI updates.
    this.zone.runOutsideAngular(() => {
      try {
        this.scene.init(
          canvas,
          hostElement,
          quality,
          reduced,
          projectSpecs,
          journeySpecs,
        );
      } catch (error) {
        console.error('Immersive world: WebGL initialisation failed', error);
        this.scene.dispose();
        this.zone.run(() => this.renderFailed.emit());
        return;
      }

      this.interaction.attach(this.scene, canvas, {
        hoverChange: (id) => this.zone.run(() => this.hoverNode.emit(id)),
        activeChange: (id) =>
          this.zone.run(() => this.activeNode.emit(this.toNodeView(id))),
        projectHoverChange: (id) =>
          this.zone.run(() => this.hoverProject.emit(id)),
        projectActiveChange: (id) =>
          this.zone.run(() =>
            this.activeProject.emit(id ? this.projectViews.get(id) ?? null : null),
          ),
        milestoneHoverChange: (id) =>
          this.zone.run(() => this.hoverMilestone.emit(id)),
        milestoneActiveChange: (id) =>
          this.zone.run(() =>
            this.activeMilestone.emit(
              id ? this.milestoneViews.get(id) ?? null : null,
            ),
          ),
      });

      this.scroll.attach(
        this.scene.scroll,
        this.scrollTrack(),
        (value, phase, world) => this.reportProgress(value, phase, world),
        reduced,
      );

      this.started = true;
    });
  }

  ngOnDestroy(): void {
    this.scroll.dispose();
    this.interaction.dispose();
    if (this.started) {
      this.scene.dispose();
    }
  }

  private reportProgress(
    value: number,
    phase: 'CORE' | 'ARCHITECTURE',
    world: WorldId,
  ): void {
    const percent = Math.round(value * 100);
    const phaseChanged = phase !== this.lastPhase;
    const worldChanged = world !== this.lastWorld;
    if (percent === this.lastProgressPercent && !phaseChanged && !worldChanged) {
      return;
    }
    this.lastProgressPercent = percent;
    this.lastPhase = phase;
    this.lastWorld = world;

    this.zone.run(() => {
      this.progress.emit(percent);
      if (phaseChanged) {
        this.phase.emit(phase);
      }
      if (worldChanged) {
        this.world.emit(world);
      }
    });
  }

  private toNodeView(id: string | null): ActiveNodeView | null {
    if (!id) {
      return null;
    }
    const node = NETWORK_NODES.find((entry) => entry.id === id);
    if (!node) {
      return null;
    }
    const connections = (this.adjacency.get(id) ?? []).map(
      (relatedId) =>
        NETWORK_NODES.find((entry) => entry.id === relatedId)?.label ??
        relatedId,
    );
    return {
      id: node.id,
      label: node.label,
      kind: node.kind,
      blurb: node.blurb,
      details: node.details,
      connections,
    };
  }
}
