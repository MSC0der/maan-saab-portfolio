/**
 * Shared types for the Immersive Engineering Core experience.
 *
 * Boundary reminder: Angular owns portfolio data + DOM, Three.js owns the scene,
 * GSAP owns choreography. Nothing in here reaches into services or the DOM.
 */

/** Rendering quality tier. `full` and `balanced` are implemented for the
 * prototype; `performance` is wired through the profile table for later use. */
export type CoreQuality = 'full' | 'balanced' | 'performance';

export interface QualityProfile {
  /** Upper bound for `renderer.setPixelRatio` — keeps fill-rate in check. */
  readonly pixelRatioCap: number;
  /** Instanced segment count for the outer structural ring. */
  readonly outerSegments: number;
  /** Instanced segment count for the energy ring. */
  readonly energySegments: number;
  /** Radial spoke count inside the inner architecture. */
  readonly innerSpokes: number;
  /** Data particles travelling along every connection path. */
  readonly particlesPerConnection: number;
  /** Blinking technical markers on the inner architecture. */
  readonly coreMarkers: number;
  /** Micro-satellites orbiting the central core. */
  readonly orbitSatellites: number;
  /** Faint out-of-focus nodes populating the deep background. */
  readonly distantNodes: number;
  /** Large soft motes drifting near the camera for foreground parallax. */
  readonly foregroundMotes: number;
  /** Pooled particles bridging the project clusters into the journey path. */
  readonly journeyParticles: number;
  /** Whether the procedural ambient-energy shader plane is built. */
  readonly ambientShader: boolean;
  /** Whether additive glow sprites are attached to energy elements. */
  readonly glowSprites: boolean;
}

/** Where a node sits in the system hierarchy. `structural` nodes (Service /
 * Client / Data layers) only materialise once the architecture reveals. */
export type NodeTier = 'tech' | 'structural';

/**
 * A node in the engineering network. Two layouts: `heroPosition` is the orbital
 * composition around the core; `archPosition` is the hierarchical architecture
 * layout the scroll transition resolves into. Both are core-local units where
 * x → right, y → up, z → toward the camera. Depth is deliberately varied.
 */
export interface NetworkNodeConfig {
  readonly id: string;
  /** Short uppercase label rendered on the node and in the HUD. */
  readonly label: string;
  /** Classification shown in the info panel. */
  readonly kind: string;
  /** Single sentence describing the node's role in the system. */
  readonly blurb: string;
  /** Capability bullets — sourced from the portfolio profile, not invented. */
  readonly details: readonly string[];
  readonly heroPosition: readonly [number, number, number];
  readonly archPosition: readonly [number, number, number];
  /** Accent used for the node's energy state. */
  readonly accent: 'cyan' | 'violet';
  readonly tier: NodeTier;
  /** Distinct procedural sigil shape for the node's small icon. */
  readonly sigil: 'cube' | 'octa' | 'tetra' | 'ring' | 'bars' | 'prism';
}

/**
 * The continuous experience is one world with several states the scroll moves
 * between. `entry → core → architecture` exist today; the rest are added
 * milestone by milestone. The label is derived from `worldProgress`.
 */
export type WorldId =
  | 'entry'
  | 'core'
  | 'architecture'
  | 'projects'
  | 'journey'
  | 'dsa'
  | 'collapse'
  | 'contact';

/**
 * Plain spatial spec for one project system — the Angular side derives this from
 * the real `PROJECTS` data and hands it to the Three.js builder. No portfolio
 * content beyond what the builder needs to place geometry + a label.
 */
export interface ProjectSpec {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly accent: 'cyan' | 'violet';
  /** Surrounding system-node labels — real technologies / architecture items. */
  readonly nodes: readonly string[];
}

/**
 * Plain spatial spec for one Engineering Journey milestone — the Angular side
 * derives this from the real `ENGINEERING_TIMELINE` and hands it to the Three.js
 * builder. No content beyond what the builder needs to place geometry + a year
 * marker; the full text lives in `ActiveMilestoneView`.
 */
export interface JourneyMilestoneSpec {
  readonly id: string;
  /** Short marker string — a year, or `Future`. */
  readonly year: string;
  readonly title: string;
  readonly detail: string;
  /** Aspirational trajectory rather than a completed step — rendered fainter. */
  readonly future: boolean;
}

/** Milestone view-model handed to the overlay when a milestone is activated. */
export interface ActiveMilestoneView {
  readonly id: string;
  readonly year: string;
  readonly title: string;
  readonly detail: string;
  readonly future: boolean;
}

/** Project view-model handed to the Angular overlay when a project is activated. */
export interface ActiveProjectView {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly role: string | null;
  readonly architecture: readonly string[];
  readonly technologies: readonly string[];
  /** Existing route — `/project/:slug`. Null for projects without a case study. */
  readonly routePath: string | null;
}

/** A meaningful relationship between two nodes — not decoration. */
export interface ConnectionConfig {
  readonly from: string;
  readonly to: string;
  /** `primary` paths read cyan, `secondary` paths read restrained violet. */
  readonly rank: 'primary' | 'secondary';
  /** Human-readable relationship, surfaced in the info panel. */
  readonly relation: string;
}

/** Node view-model handed to the Angular overlay when a node is activated. */
export interface ActiveNodeView {
  readonly id: string;
  readonly label: string;
  readonly kind: string;
  readonly blurb: string;
  readonly details: readonly string[];
  readonly connections: readonly string[];
}

/**
 * The damped pointer "field" — the subtle, inertial force the whole scene
 * reads. Not a 1:1 mouse mapping: every consumer scales these by world state
 * and an engagement term so the cursor behaves magnetically, never like a
 * game controller. Pre-allocated; mutated in place each frame.
 */
export interface PointerFieldState {
  /** Medium-damped pointer, NDC -1..1 — camera parallax + node micro-shift. */
  x: number;
  y: number;
  /** Slow-damped pointer, NDC — environment, lighting, energy-field bend. */
  slowX: number;
  slowY: number;
  /** 0..1 engagement — eased pointer distance from centre while hovering. */
  engage: number;
}

/** Pointer + interaction state written by interaction, read by the scene loop.
 * A single shared object avoids per-frame allocation and event thrash. */
export interface SceneRuntimeState {
  /** Pointer position in normalised device coords, smoothed toward target. */
  readonly pointer: { x: number; y: number };
  /** Raw (un-smoothed) pointer target set by the last pointermove. */
  readonly pointerTarget: { x: number; y: number };
  /** Damped inertial pointer field layered on top of `pointer`. */
  readonly field: PointerFieldState;
  /** False while the pointer is outside the stage — parallax eases back home. */
  hovering: boolean;
  /** Id of the hovered node, or null. */
  hoveredNodeId: string | null;
  /** Id of the activated (clicked) node, or null. */
  activeNodeId: string | null;
  /** Id of the hovered project cluster, or null. */
  hoveredProjectId: string | null;
  /** Id of the activated (clicked) project cluster, or null. */
  activeProjectId: string | null;
  /** Id of the hovered journey milestone, or null. */
  hoveredMilestoneId: string | null;
  /** Id of the activated (clicked) journey milestone, or null. */
  activeMilestoneId: string | null;
  /** True while the pointer is over the core proxy. */
  coreHovered: boolean;
  /** Honour `prefers-reduced-motion` — kills camera travel + parallax + drift. */
  reducedMotion: boolean;
}

/** Scroll-driven choreography state, written by the GSAP timeline (scrubbed by
 * ScrollTrigger) and read by the scene loop. All 0..1 unless noted. Channels are
 * added per milestone; worlds overlap so transitions are transforms, not cuts. */
export interface ScrollDrivenState {
  /** Global scroll progress 0..1 — the camera path is sampled by this. */
  cameraDolly: number;

  // ── World 02–03: Core → Architecture ──────────────────────────────────────
  /** 0 = compact core, 1 = expanded core. */
  coreExpand: number;
  /** 0 = rings nested, 1 = outer/energy rings separated + core opened. */
  ringSeparation: number;
  /** 0 = nodes tucked near the core, 1 = nodes at their orbital spread. */
  nodeSpread: number;
  /** 0 = orbital composition, 1 = hierarchical architecture layout. */
  archReveal: number;

  // ── World 04: Project Systems ────────────────────────────────────────────
  /** 0 = architecture layout, 1 = architecture reorganised into project
   * clusters travelling along the corridor; then back to 0 as the clusters
   * fragment into the journey. */
  projectsForm: number;
  /** Fractional index of the cluster the camera is centred on (0..count-1). */
  projectsFocus: number;

  // ── World 05: Engineering Journey ───────────────────────────────────────
  /** 0 = project clusters intact, 1 = their fragments have organised into the
   * career path and the milestones have materialised. */
  journeyForm: number;
  /** 0..1 normalised position of the camera travelling along the path. */
  journeyProgress: number;

  // ── World 08: Contact ───────────────────────────────────────────────────
  /** 0 = still in the corridor, 1 = settled into the quiet contact state. */
  contactSettle: number;

  /** Coarse label kept for the existing HUD binding. */
  phase: 'CORE' | 'ARCHITECTURE';
  /** Current world — drives HUD, nav highlight and the inspector body. */
  world: WorldId;
}
