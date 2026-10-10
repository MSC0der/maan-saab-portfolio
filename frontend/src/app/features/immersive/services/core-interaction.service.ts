import { Injectable } from '@angular/core';
import * as THREE from 'three';

import { INTERACTION_CONFIG } from '../immersive.config';
import { EngineeringCoreSceneService } from './engineering-core-scene.service';

export interface InteractionCallbacks {
  /** Fired when the hovered node changes (node id or null). */
  readonly hoverChange: (nodeId: string | null) => void;
  /** Fired when the activated node changes (node id or null). */
  readonly activeChange: (nodeId: string | null) => void;
  /** Fired when the hovered project cluster changes (project id or null). */
  readonly projectHoverChange: (projectId: string | null) => void;
  /** Fired when the activated project cluster changes (project id or null). */
  readonly projectActiveChange: (projectId: string | null) => void;
  /** Fired when the hovered journey milestone changes (milestone id or null). */
  readonly milestoneHoverChange: (milestoneId: string | null) => void;
  /** Fired when the activated journey milestone changes (milestone id or null). */
  readonly milestoneActiveChange: (milestoneId: string | null) => void;
}

const PROJECT_PREFIX = 'project:';
const MILESTONE_PREFIX = 'milestone:';

/**
 * Turns pointer input over the stage into scene state: raycast-driven hover,
 * click-to-activate and the parallax target. Handles both the technology
 * network (World 02–03) and the project systems (World 04). Desktop pointer
 * events; touch falls through to activation on tap.
 *
 * Provided per-component so listeners are bound / unbound with the host.
 */
@Injectable()
export class CoreInteractionService {
  private scene!: EngineeringCoreSceneService;
  private element!: HTMLElement;
  private callbacks!: InteractionCallbacks;

  private readonly raycaster = new THREE.Raycaster();
  private readonly pointerNdc = new THREE.Vector2();
  private lastRaycastAt = 0;
  private attached = false;

  /**
   * Hover targets sit on animated meshes (scroll choreography + the pointer
   * field's own micro-shifts), so a raycast taken mid-motion can land on a
   * neighbouring node/proxy for a single tick before settling back. A hit is
   * only committed once it has repeated for `HOVER_CONFIRM_TICKS` — that's
   * ~2 throttle windows, imperceptible as latency but enough to stop the
   * hover state chattering on and off.
   */
  private static readonly HOVER_CONFIRM_TICKS = 2;
  private committedHit: string | null = null;
  private pendingHit: string | null = null;
  private pendingHitTicks = 0;

  private readonly onPointerMove = (event: PointerEvent) =>
    this.handlePointerMove(event);
  private readonly onPointerLeave = () => this.handlePointerLeave();
  private readonly onPointerDown = (event: PointerEvent) =>
    this.handlePointerDown(event);

  attach(
    scene: EngineeringCoreSceneService,
    element: HTMLElement,
    callbacks: InteractionCallbacks,
  ): void {
    this.scene = scene;
    this.element = element;
    this.callbacks = callbacks;
    this.attached = true;

    element.addEventListener('pointermove', this.onPointerMove, { passive: true });
    element.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    element.addEventListener('pointerdown', this.onPointerDown);
  }

  dispose(): void {
    if (!this.attached) {
      return;
    }
    this.attached = false;
    this.element.removeEventListener('pointermove', this.onPointerMove);
    this.element.removeEventListener('pointerleave', this.onPointerLeave);
    this.element.removeEventListener('pointerdown', this.onPointerDown);
  }

  private toNdc(event: PointerEvent): void {
    const rect = this.element.getBoundingClientRect();
    this.pointerNdc.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
  }

  private handlePointerMove(event: PointerEvent): void {
    this.toNdc(event);

    const runtime = this.scene.runtime;
    runtime.hovering = true;
    runtime.pointerTarget.x = this.pointerNdc.x;
    runtime.pointerTarget.y = this.pointerNdc.y;

    const now = performance.now();
    if (now - this.lastRaycastAt < INTERACTION_CONFIG.raycastThrottleMs) {
      return;
    }
    this.lastRaycastAt = now;
    this.evaluateHover();
  }

  private handlePointerLeave(): void {
    this.committedHit = null;
    this.pendingHit = null;
    this.pendingHitTicks = 0;
    const runtime = this.scene.runtime;
    runtime.hovering = false;
    if (runtime.hoveredNodeId !== null) {
      this.scene.setHoveredNode(null);
      this.callbacks.hoverChange(null);
    }
    if (runtime.hoveredProjectId !== null) {
      this.scene.setHoveredProject(null);
      this.callbacks.projectHoverChange(null);
    }
    if (runtime.hoveredMilestoneId !== null) {
      this.scene.setHoveredMilestone(null);
      this.callbacks.milestoneHoverChange(null);
    }
    if (runtime.coreHovered) {
      this.scene.setCoreHovered(false);
    }
    this.element.style.cursor = '';
  }

  private handlePointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }
    this.toNdc(event);
    const hit = this.raycast();
    const runtime = this.scene.runtime;

    const projectHit = this.projectId(hit);
    if (projectHit) {
      const next = runtime.activeProjectId === projectHit ? null : projectHit;
      this.scene.setActiveProject(next);
      this.callbacks.projectActiveChange(next);
      return;
    }

    const milestoneHit = this.milestoneId(hit);
    if (milestoneHit) {
      const next =
        runtime.activeMilestoneId === milestoneHit ? null : milestoneHit;
      this.scene.setActiveMilestone(next);
      this.callbacks.milestoneActiveChange(next);
      return;
    }

    if (hit && hit !== 'core') {
      const next = runtime.activeNodeId === hit ? null : hit;
      this.scene.setActiveNode(next);
      this.callbacks.activeChange(next);
      return;
    }

    // Core / empty space clears whatever is active.
    if (runtime.activeNodeId !== null) {
      this.scene.setActiveNode(null);
      this.callbacks.activeChange(null);
    }
    if (runtime.activeProjectId !== null) {
      this.scene.setActiveProject(null);
      this.callbacks.projectActiveChange(null);
    }
    if (runtime.activeMilestoneId !== null) {
      this.scene.setActiveMilestone(null);
      this.callbacks.milestoneActiveChange(null);
    }
  }

  private evaluateHover(): void {
    const hit = this.debouncedHit();
    const runtime = this.scene.runtime;
    const projectHit = this.projectId(hit);
    const milestoneHit = this.milestoneId(hit);

    const nextProject = projectHit;
    const nextMilestone = milestoneHit;
    const nextNode =
      !projectHit && !milestoneHit && hit && hit !== 'core' ? hit : null;
    const nextCore = hit === 'core';

    if (nextProject !== runtime.hoveredProjectId) {
      this.scene.setHoveredProject(nextProject);
      this.callbacks.projectHoverChange(nextProject);
    }
    if (nextMilestone !== runtime.hoveredMilestoneId) {
      this.scene.setHoveredMilestone(nextMilestone);
      this.callbacks.milestoneHoverChange(nextMilestone);
    }
    if (nextNode !== runtime.hoveredNodeId) {
      this.scene.setHoveredNode(nextNode);
      this.callbacks.hoverChange(nextNode);
    }
    if (nextCore !== runtime.coreHovered) {
      this.scene.setCoreHovered(nextCore);
    }
    this.element.style.cursor =
      nextProject || nextMilestone || nextNode ? 'pointer' : '';
  }

  private projectId(hit: string | null): string | null {
    return hit && hit.startsWith(PROJECT_PREFIX)
      ? hit.slice(PROJECT_PREFIX.length)
      : null;
  }

  private milestoneId(hit: string | null): string | null {
    return hit && hit.startsWith(MILESTONE_PREFIX)
      ? hit.slice(MILESTONE_PREFIX.length)
      : null;
  }

  /**
   * Raycasts and debounces the result — a hit only replaces the committed
   * hover target once it has repeated for `HOVER_CONFIRM_TICKS` throttle
   * windows, so a single transient hit while a mesh animates under the
   * cursor can't flip the hover state on its own.
   */
  private debouncedHit(): string | null {
    const hit = this.raycast();
    if (hit === this.committedHit) {
      this.pendingHit = null;
      this.pendingHitTicks = 0;
      return this.committedHit;
    }
    if (hit === this.pendingHit) {
      this.pendingHitTicks++;
    } else {
      this.pendingHit = hit;
      this.pendingHitTicks = 1;
    }
    if (this.pendingHitTicks >= CoreInteractionService.HOVER_CONFIRM_TICKS) {
      this.committedHit = hit;
      this.pendingHit = null;
      this.pendingHitTicks = 0;
    }
    return this.committedHit;
  }

  /** Returns a node id, `'core'`, `'project:<id>'`, `'milestone:<id>'`, or null. */
  private raycast(): string | null {
    this.raycaster.setFromCamera(this.pointerNdc, this.scene.camera);
    const targets = this.scene.getRaycastTargets() as THREE.Object3D[];
    const intersections = this.raycaster.intersectObjects(targets, false);
    if (intersections.length === 0) {
      return null;
    }
    // Prefer a specific hit over the (larger) core proxy.
    for (const intersection of intersections) {
      const id = this.scene.resolveHit(intersection.object);
      if (id && id !== 'core') {
        return id;
      }
    }
    return this.scene.resolveHit(intersections[0].object);
  }
}
