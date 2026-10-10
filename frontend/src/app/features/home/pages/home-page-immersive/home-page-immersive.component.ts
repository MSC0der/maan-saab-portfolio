import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { THEME_CONTACT_CONFIG } from '../../../../core/config/theme-contact.config';
import { ResumeService } from '../../../../core/services/resume.service';
import { ImmersiveChromeComponent } from '../../../immersive/components/immersive-chrome.component';
import {
  SCROLL_TRACK_VH,
  WORLD_RANGES,
  prefersReducedMotion,
} from '../../../immersive/immersive.config';
import {
  ActiveMilestoneView,
  ActiveNodeView,
  ActiveProjectView,
  WorldId,
} from '../../../immersive/immersive.model';
import { isWebGLAvailable } from '../../../immersive/webgl-support.util';
import { NETWORK_NODES } from '../../../immersive/technology-network.data';
import { ImmersiveCoreComponent } from '../../../immersive/immersive-core.component';

interface HudRow {
  readonly label: string;
  readonly value: string;
}

interface HeroMetric {
  readonly value: string;
  readonly label: string;
}

interface ContactLink {
  readonly label: string;
  readonly href: string;
  /** http(s) links open in a new tab; mailto: stays in place. */
  readonly external: boolean;
}

/**
 * Home experience for the Immersive Engineering world.
 *
 * Owns the real HTML chrome / hero / HUD / inspectors / contact and the scroll
 * track; the 3D world lives in the deferred `<app-immersive-core>` behind it.
 * Everything the viewer reads stays in this Angular layer so it works with
 * WebGL disabled.
 */
@Component({
  selector: 'app-home-page-immersive',
  standalone: true,
  imports: [ImmersiveCoreComponent, ImmersiveChromeComponent, RouterLink],
  templateUrl: './home-page-immersive.component.html',
  styleUrl: './home-page-immersive.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageImmersiveComponent {
  private readonly resumeService = inject(ResumeService);
  private readonly zone = inject(NgZone);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  protected readonly trackVh = SCROLL_TRACK_VH;
  protected readonly reducedMotion = prefersReducedMotion();
  protected readonly webglSupported = signal(isWebGLAvailable());

  protected readonly activeNode = signal<ActiveNodeView | null>(null);
  protected readonly activeProject = signal<ActiveProjectView | null>(null);
  protected readonly activeMilestone = signal<ActiveMilestoneView | null>(null);
  protected readonly hoverLabel = signal<string | null>(null);
  protected readonly progress = signal(0);
  protected readonly phase = signal<'CORE' | 'ARCHITECTURE'>('CORE');
  protected readonly world = signal<WorldId>('entry');

  /** Raw hover ids — drive the custom cursor's context state. */
  private readonly hoverNodeId = signal<string | null>(null);
  private readonly hoverProjectId = signal<string | null>(null);
  private readonly hoverMilestoneId = signal<string | null>(null);

  /** The custom cursor is a fine-pointer affordance only. */
  protected readonly cursorEnabled =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches;

  /** DEFAULT · EXPLORE (over the world) · CLICKABLE (raycast hit). */
  protected readonly cursorState = computed<
    'default' | 'explore' | 'clickable'
  >(() => {
    if (
      this.hoverNodeId() ||
      this.hoverProjectId() ||
      this.hoverMilestoneId()
    ) {
      return 'clickable';
    }
    const world = this.world();
    if (
      world === 'core' ||
      world === 'architecture' ||
      world === 'projects' ||
      world === 'journey'
    ) {
      return 'explore';
    }
    return 'default';
  });

  protected readonly entered = computed(
    () => this.world() !== 'entry' && this.world() !== 'core',
  );
  /** Past the architecture the hero identity gives way entirely to the world. */
  protected readonly deep = computed(
    () =>
      this.world() !== 'entry' &&
      this.world() !== 'core' &&
      this.world() !== 'architecture',
  );
  protected readonly atContact = computed(
    () => this.world() === 'contact' || this.world() === 'collapse',
  );
  protected readonly atJourney = computed(() => this.world() === 'journey');
  /** The cursor is on / near a milestone but its readout isn't open yet — show
   * the "click to open" affordance so the interaction is discoverable. */
  protected readonly milestoneHint = computed(
    () =>
      this.atJourney() &&
      !this.activeMilestone() &&
      this.hoverMilestoneId() !== null,
  );

  protected readonly isResumeDownloading = this.resumeService.isDownloading;

  /**
   * Hero copy. Leads with the real name and the actual positioning (backend
   * focus) so a recruiter gets who / what / availability in the first screen.
   */
  protected readonly hero = {
    brand: 'RANBIR SINGH MAAN',
    role: 'BACKEND-FOCUSED FULL STACK ENGINEER',
    line: 'I build secure APIs, authentication systems and production web apps with Node.js, Angular and MongoDB.',
    status: 'OPEN TO FULL-TIME ROLES · REMOTE PREFERRED',
  } as const;

  /** Verified portfolio figures (see About metrics). No invented values. */
  protected readonly metrics: readonly HeroMetric[] = [
    { value: '100+', label: 'APIS BUILT' },
    { value: '10+', label: 'PROJECTS SHIPPED' },
    { value: '12+', label: 'TECHNOLOGIES' },
  ];

  /** Availability copy comes from the shared contact config (single source). */
  protected readonly responseTime =
    THEME_CONTACT_CONFIG['technical-dark'].availability.responseTime;

  /** Real contact + social links from the existing contact config. */
  protected readonly contactLinks: readonly ContactLink[] = (() => {
    const links = THEME_CONTACT_CONFIG['technical-dark'].directLinks.links;
    const pick = (
      label: string,
      display: string,
      subject?: string,
    ): ContactLink | null => {
      const entry = links.find((link) => link.label === label);
      if (!entry?.href) {
        return null;
      }
      const href = subject
        ? `${entry.href}?subject=${encodeURIComponent(subject)}`
        : entry.href;
      return { label: display, href, external: href.startsWith('http') };
    };
    return [
      pick('Email', 'EMAIL ME', 'Opportunity: Full Stack / Backend Engineer'),
      pick('LinkedIn', 'LINKEDIN'),
      pick('GitHub', 'GITHUB'),
    ].filter((link): link is ContactLink => link !== null);
  })();

  constructor() {
    if (!this.cursorEnabled) {
      return;
    }
    const destroyRef = inject(DestroyRef);
    let raf = 0;
    let cx = -100;
    let cy = -100;
    const host = this.hostEl.nativeElement;

    const flush = (): void => {
      raf = 0;
      host.style.setProperty('--im-cx', `${cx}px`);
      host.style.setProperty('--im-cy', `${cy}px`);
    };
    const onMove = (event: PointerEvent): void => {
      cx = event.clientX;
      cy = event.clientY;
      if (!raf) {
        raf = requestAnimationFrame(flush);
      }
    };

    // Bound outside Angular — pure DOM writes, no change detection.
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => {
        window.addEventListener('pointermove', onMove, { passive: true });
      });
    });
    destroyRef.onDestroy(() => {
      window.removeEventListener('pointermove', onMove);
      if (raf) {
        cancelAnimationFrame(raf);
      }
    });
  }

  protected hud(): readonly HudRow[] {
    return [
      { label: 'SYSTEM', value: 'ONLINE' },
      { label: 'WORLD', value: this.world().toUpperCase() },
      {
        label: 'CORE',
        value: this.phase() === 'CORE' ? 'ACTIVE' : 'EXPANDED',
      },
      { label: 'FOCUS', value: this.hoverLabel() ?? '—' },
    ];
  }

  private isWorldReady(id: WorldId): boolean {
    return WORLD_RANGES[id].end > WORLD_RANGES[id].start;
  }

  protected goToWorld(id: WorldId): void {
    const el = this.track()?.nativeElement;
    if (!el || !this.isWorldReady(id)) {
      return;
    }
    const range = WORLD_RANGES[id];
    const fraction = Math.min(
      0.985,
      range.start + (range.end - range.start) * 0.15,
    );
    const top =
      el.offsetTop + fraction * (el.offsetHeight - window.innerHeight);
    window.scrollTo({
      top,
      behavior: this.reducedMotion ? 'auto' : 'smooth',
    });
  }

  protected onActiveNode(node: ActiveNodeView | null): void {
    this.activeNode.set(node);
  }

  protected onHoverNode(id: string | null): void {
    this.hoverNodeId.set(id);
    this.hoverLabel.set(
      id ? (NETWORK_NODES.find((node) => node.id === id)?.label ?? null) : null,
    );
  }

  protected onActiveProject(project: ActiveProjectView | null): void {
    this.activeProject.set(project);
  }

  protected onHoverProject(id: string | null): void {
    this.hoverProjectId.set(id);
    if (id) {
      this.hoverLabel.set(id.replace(/-/g, ' ').toUpperCase());
    } else if (this.world() === 'projects') {
      this.hoverLabel.set(null);
    }
  }

  protected onActiveMilestone(milestone: ActiveMilestoneView | null): void {
    this.activeMilestone.set(milestone);
  }

  protected onHoverMilestone(id: string | null): void {
    this.hoverMilestoneId.set(id);
    if (id) {
      this.hoverLabel.set('MILESTONE');
    } else if (this.world() === 'journey') {
      this.hoverLabel.set(null);
    }
  }

  protected onProgress(percent: number): void {
    this.progress.set(percent);
  }

  protected onPhase(phase: 'CORE' | 'ARCHITECTURE'): void {
    this.phase.set(phase);
  }

  protected onWorld(world: WorldId): void {
    this.world.set(world);
  }

  protected onRenderFailed(): void {
    this.webglSupported.set(false);
  }

  protected closeNodePanel(): void {
    this.activeNode.set(null);
  }

  protected closeProjectPanel(): void {
    this.activeProject.set(null);
  }

  protected closeMilestonePanel(): void {
    this.activeMilestone.set(null);
  }

  protected exploreSystem(): void {
    window.scrollBy({
      top: window.innerHeight * 1.1,
      behavior: this.reducedMotion ? 'auto' : 'smooth',
    });
  }

  protected downloadResume(): void {
    void this.resumeService.download();
  }
}
