import { CoreQuality, QualityProfile, WorldId } from './immersive.model';

/**
 * Single source of truth for the Engineering Core experience: colours, camera
 * path, motion frequencies, choreography timings and quality profiles. Nothing
 * here should be duplicated as a literal inside the services.
 */

// ── Palette ──────────────────────────────────────────────────────────────────
export const CORE_COLORS = {
  /** Scene background / fog — the engineering void. */
  background: 0x05070b,
  /** Base structural graphite — most geometry stays this dark. */
  graphite: 0x0b1118,
  /** Slightly lifted graphite for secondary plates. */
  graphiteLift: 0x141d28,
  /** Electric cyan — behaves like illumination, used sparingly. */
  cyan: 0x22d3ee,
  /** Soft violet — restrained secondary accent. */
  violet: 0x8b5cf6,
  /** Near-black tint sitting under emissive energy materials. */
  energyBase: 0x08161b,
} as const;

// ── Camera ───────────────────────────────────────────────────────────────────
// The camera is part of the experience: it starts outside the system looking in
// and travels through the structure as the viewer scrolls, with a gentle orbit
// so the move reads as "entering" rather than "zooming".
export const CAMERA_CONFIG = {
  fov: 46,
  near: 0.1,
  far: 200,
  /** Sideways swing across the entry → architecture move. */
  orbitAmplitude: 1.35,
  /** Max pointer-parallax offset applied on top of the scroll position. */
  parallax: { x: 0.7, y: 0.5 },
  /** Amplitude of the always-on idle drift (disabled for reduced motion). */
  idleDrift: { x: 0.22, y: 0.16 },
  /** Low-pass factors — higher = snappier follow. */
  lerp: { pointer: 0.05, position: 0.05 },
} as const;

/**
 * The camera is the storyteller. Waypoints keyed to global scroll progress
 * (`cameraDolly`), Catmull-Rom interpolated; idle drift + pointer parallax +
 * entity focus are layered on top. Worlds beyond `projects` extend this array.
 *
 *   entry        far away, looking in
 *   core         observing the core
 *   architecture moving inward
 *   projects     the corridor travel is applied on top of the last waypoint
 */
export const CAMERA_PATH: readonly {
  readonly at: number;
  readonly pos: readonly [number, number, number];
  readonly target: readonly [number, number, number];
  readonly fov: number;
}[] = [
  { at: 0.0, pos: [1.5, 0.4, 11.6], target: [0.1, 0.1, 0], fov: 46 },
  { at: 0.13, pos: [0.9, 0.5, 8.4], target: [0.05, 0.15, 0], fov: 46 },
  { at: 0.34, pos: [0.2, 1.5, 5.9], target: [0, 0.45, 0], fov: 47 },
  { at: 0.48, pos: [1.5, 1.3, 7.7], target: [2.6, 0.7, 0.2], fov: 49 },
];

// ── World 04: Project Systems corridor ─────────────────────────────────────
export const PROJECT_SYSTEMS = {
  /** X of the first cluster; clusters march down +X so the camera travels. */
  corridorStart: 4.2,
  corridorSpacing: 6.6,
  /** Deterministic per-cluster jitter so the corridor is not a rigid line. */
  yJitter: 0.7,
  zJitter: 1.0,
  /** System-node labels shown per cluster (real technologies / architecture). */
  maxNodesPerCluster: 5,
  /** Radius the system nodes sit at around the project core. */
  ringRadius: 1.5,
  projectCoreRadius: 0.36,
  /** How far behind the focused cluster the camera frames from. */
  cameraBack: 5.6,
  cameraHeight: 1.35,
  /** Idle spin / float of an inactive cluster. */
  clusterSpin: 0.05,
  floatHz: 0.4,
  floatAmplitude: 0.12,
  /** How fast the focused cluster's rotation eases back to 0 (its ring's
   * designed front) — scaled by brightness, so it settles facing the camera
   * rather than being caught mid-spin at a random angle. */
  faceCameraLerp: 0.05,
} as const;

// ── World 05: Engineering Journey ──────────────────────────────────────────
// A genuine route through space, deeper than the project corridor. Milestone
// anchors are generated procedurally from the entry index so the path scales
// to whatever the real timeline holds; X advances (the camera keeps
// travelling), Y and Z weave so it never reads as a 2D line.
export const JOURNEY_CONFIG = {
  /** World-space offset of the whole path — a fresh region the camera flies to
   * after the project corridor. */
  origin: [50, 1.4, -12] as const,
  /** A lead-in point near the corridor exit so the path visibly connects. */
  leadIn: [40, 1.0, 1.5] as const,
  /** Per-milestone spacing / weave (local units, added to `origin`). */
  step: 7.2,
  yWeave: 2.6,
  zWeave: 4.4,
  /** Milestone visual sizing. */
  ringRadius: 0.52,
  markerHeight: 1.15,
  coreRadius: 0.17,
  /** Camera framing while travelling the path. */
  cameraBack: 5.4,
  cameraHeight: 1.7,
  cameraSide: 3.0,
  /** Idle life. */
  floatHz: 0.32,
  floatAmplitude: 0.1,
  spin: 0.04,
  /** Curve sampling density per segment for the drawn path line. */
  pathSamplesPerSegment: 20,
  /** Eases the camera toward each parked milestone as the stepped
   * `journeyProgress` scroll channel settles — purely scroll-driven. */
  focusLerp: 0.06,
  /** World-space radius of the invisible reach proxy a milestone's hover /
   * click raycast targets — so activation doesn't need the tiny core mesh. */
  influenceRadius: 4.6,
} as const;

// ── Fog — the depth cue that dissolves the "image boundary" ──────────────────
export const FOG_CONFIG = { near: 7.5, far: 34 } as const;

// ── Core geometry sizing (core-local units) ─────────────────────────────────
export const CORE_GEOMETRY = {
  /** Sparse outer frame that makes the core read as a large structure. */
  outerFrameRadius: 3.15,
  outerFrameStruts: 8,
  outerRingRadius: 2.55,
  energyRingRadius: 2.02,
  /** Bright partial arcs that flow around the energy ring. */
  energyArcs: 3,
  innerRingRadii: [1.62, 1.28, 0.98] as const,
  innerSpokeInner: 0.98,
  innerSpokeOuter: 1.58,
  /** Docking ports where connections meet the core. */
  ports: 6,
  portRadius: 1.62,
  baseRingRadius: 2.95,
  /** Tilt of the stability ring so it reads as an engineered gyro mount. */
  baseRingTilt: 0.5,
  centralShellRadius: 0.34,
  centralInnerRadius: 0.2,
  /** How far the outer + energy rings slide apart at ringSeparation = 1. */
  ringSeparationDepth: 1.0,
  /** Core group scale at coreExpand = 1. */
  expandedScale: 1.14,
  /** Micro-satellite orbit radii (min..max), tilted around the centre. */
  satelliteOrbit: { min: 0.55, max: 0.82 },
} as const;

// ── Nodes ──────────────────────────────────────────────────────────────────
export const NODE_CONFIG = {
  /** Hex housing radius. */
  hexRadius: 0.34,
  /** Fraction of the hero radius nodes sit at when nodeSpread = 0. */
  compactFactor: 0.5,
  /** Depth scaling: closer nodes render larger. Clamped to this range. */
  depthScale: { perUnitZ: 0.05, min: 0.78, max: 1.28 },
  /** Billboard slerp — low, so nodes lag the camera and feel physically placed. */
  billboardLerp: 0.1,
} as const;

// ── Motion frequencies (radians / second) ──────────────────────────────────
// Layered on purpose: structure barely moves, energy is moderate, the centre
// has the most life. Nothing here should feel like a loading spinner.
export const CORE_MOTION = {
  coreGroupYaw: 0.014,
  outerFrameSpin: -0.03,
  outerRingSpin: 0.05,
  baseRingSpin: -0.02,
  energyRingSpin: 0.13,
  energyArcSpin: 0.34,
  innerArchSpin: -0.09,
  innerArchTilt: 0.03,
  centralYaw: 0.2,
  centralPitch: 0.12,
  innerCoreYaw: -0.42,
  satelliteSpeed: 0.5,
  /** Energy-ring emissive pulse. */
  energyPulseHz: 1.6,
  energyPulseDepth: 0.32,
  /** Central-core breathing scale. */
  corePulseHz: 2.2,
  corePulseDepth: 0.06,
  /** Blink cadence for the technical markers. */
  markerBlinkHz: 1.1,
  /** Everything is multiplied by this when prefers-reduced-motion is set. */
  reducedMotionScale: 0.12,
  /** Node idle float. */
  nodeFloatHz: 0.45,
  nodeFloatAmplitude: 0.13,
} as const;

// ── Data flow ──────────────────────────────────────────────────────────────
export const PARTICLE_CONFIG = {
  /** Base travel speed along a connection path (progress / second). */
  speed: 0.085,
  speedJitter: 0.045,
  size: 0.05,
  /** How far a connection path bows outward from the core centre. */
  pathBow: 0.32,
  /** Roughly one in N particles renders violet instead of cyan. */
  violetEvery: 5,
  /** Chance a particle pauses at a node when it completes a trip. */
  pauseChance: 0.35,
  pauseSeconds: { min: 0.3, max: 0.9 },
  /** Travelling brightness pulse along the connection line itself. */
  linePulseSpeed: 0.4,
  linePulseWidth: 0.07,
} as const;

// ── Interaction ────────────────────────────────────────────────────────────
export const INTERACTION_CONFIG = {
  /** Minimum ms between raycasts on pointermove. */
  raycastThrottleMs: 33,
  /** Radius of the invisible sphere used to detect "core hover". */
  coreProxyRadius: 2.05,
  /** State lerp factor for node / connection brightness transitions. */
  stateLerp: 0.12,
} as const;

// ── Pointer field — cursor as a subtle spatial force ───────────────────────
// The cursor is inertial and magnetic, never a 1:1 controller. Every term
// here is deliberately small; consumers additionally scale by world state and
// an engagement factor, and everything collapses to zero for reduced motion.
export const POINTER_FIELD = {
  /** Low-pass factor for the medium (camera parallax) pointer follow. */
  followLerp: 0.06,
  /** Low-pass factor for the slow (environment / lighting) pointer follow. */
  slowLerp: 0.022,
  /** Per-frame decay of the pointer target once the cursor leaves the stage. */
  releaseDecay: 0.9,
  /** How fast the projected world-space cursor eases to its new position. */
  worldLerp: 0.22,

  core: {
    /** World-units the local core light drifts toward the cursor. */
    lightDrift: 0.9,
    /** Radians the energy ring / arcs bend toward the cursor. */
    energyTilt: 0.08,
    /** World-units a near node micro-shifts toward the cursor (depth-scaled). */
    nodeShift: 0.045,
    /** Camera look-target pull toward the projected cursor. */
    lookPull: 0.05,
  },

  architecture: {
    /** Screen-space radius (NDC) a node starts responding to the cursor in. */
    reachNdc: 0.85,
    /** Screen-space radius (NDC) for full response. */
    focusNdc: 0.12,
    /** Extra brightness a cursor-near node gains. */
    gain: 0.6,
    /** Camera look bias toward the weighted active region. */
    lookBias: 0.06,
  },

  projects: {
    /** Eases the camera toward each parked cluster as the stepped
     * `projectsFocus` scroll channel settles — purely scroll-driven. */
    focusLerp: 0.08,
  },

  environment: {
    /** Distant node-cloud counter-parallax (world units). */
    backgroundShift: 0.4,
    /** Ambient shader UV offset driven by the cursor. */
    shaderOffset: 0.04,
  },
} as const;

// ── Dwell — "you have arrived, now look around" ────────────────────────────
// Governs how sharply the camera reads "arrived" once the stepped scroll
// parks it on a single project or milestone (see `dwellAmount`).
export const DWELL = {
  /** How near the stepped focus must be to an integer to count as "parked". */
  settleBand: { inner: 0.05, outer: 0.34 },
  /** Idle "point of interest" breathing for journey milestones. */
  milestonePulseHz: 0.85,
  milestonePulseDepth: 0.16,
} as const;

// ── Scroll choreography ────────────────────────────────────────────────────
// Keyframes on a normalised 0..1 timeline; ScrollTrigger scrubs the playhead.
// Values are the target of each channel at that progress. The visual payload:
//   0%   compact core
//   25%  core expands, nodes respond and drift outward
//   50%  outer rings separate, the central core opens, inner architecture shows
//   75%  nodes travel to the architecture layout, connections re-string
//   100% the core is the hub of a layered engineering architecture
export const SCROLL_KEYFRAMES = {
  coreExpand: [
    { at: 0, value: 0 },
    { at: 0.14, value: 0.4 },
    { at: 0.34, value: 1 },
    { at: 1, value: 1 },
  ],
  ringSeparation: [
    { at: 0, value: 0 },
    { at: 0.19, value: 0 },
    { at: 0.34, value: 0.65 },
    { at: 0.44, value: 1 },
    { at: 1, value: 1 },
  ],
  nodeSpread: [
    { at: 0, value: 0 },
    { at: 0.11, value: 0.12 },
    { at: 0.38, value: 1 },
    { at: 1, value: 1 },
  ],
  archReveal: [
    { at: 0, value: 0 },
    { at: 0.28, value: 0 },
    { at: 0.41, value: 0.85 },
    { at: 0.45, value: 1 },
    { at: 1, value: 1 },
  ],
  // Architecture reorganises into project systems; overlaps archReveal so it
  // reads as a transform, not a cut. Then falls back to 0 over 0.66→0.74 as the
  // clusters fragment — that fall IS the transition into the Engineering
  // Journey, not a fade-out.
  projectsForm: [
    { at: 0, value: 0 },
    { at: 0.42, value: 0 },
    { at: 0.49, value: 1 },
    { at: 0.66, value: 1 },
    { at: 0.74, value: 0 },
    { at: 1, value: 0 },
  ],
  // Normalised 0..1 corridor position; the scene scales it by (clusterCount-1).
  // Stepped: the camera settles on each project (flat dwell) before travelling
  // to the next (ramp), so every project→project move reads as a deliberate
  // arrival rather than a blur. 7 clusters → dwells at k/6.
  projectsFocus: [
    { at: 0, value: 0 },
    { at: 0.475, value: 0 },
    { at: 0.49, value: 0 },
    { at: 0.504, value: 0.1667 },
    { at: 0.518, value: 0.1667 },
    { at: 0.532, value: 0.3333 },
    { at: 0.546, value: 0.3333 },
    { at: 0.56, value: 0.5 },
    { at: 0.574, value: 0.5 },
    { at: 0.588, value: 0.6667 },
    { at: 0.602, value: 0.6667 },
    { at: 0.616, value: 0.8333 },
    { at: 0.63, value: 0.8333 },
    { at: 0.644, value: 1 },
    { at: 0.66, value: 1 },
    { at: 1, value: 1 },
  ],
  // World 05 — the fragmented project particles travel out and organise into
  // the career path; milestones materialise. Overlaps the projectsForm fall so
  // it reads as a transform, not a cut.
  journeyForm: [
    { at: 0, value: 0 },
    { at: 0.64, value: 0 },
    { at: 0.73, value: 0.6 },
    { at: 0.82, value: 1 },
    { at: 1, value: 1 },
  ],
  // 0..1 position of the camera travelling along the Engineering Journey path.
  // Stepped like `projectsFocus`: the camera arrives at a milestone and *parks*
  // (flat dwell) before travelling to the next (ramp), so every milestone is an
  // unmistakable stop rather than something you glide past. 5 milestones →
  // dwells at k/4 (coupled to ENGINEERING_TIMELINE length).
  journeyProgress: [
    { at: 0, value: 0 },
    { at: 0.66, value: 0 },
    { at: 0.7, value: 0 },
    { at: 0.722, value: 0 },
    { at: 0.744, value: 0.25 },
    { at: 0.766, value: 0.25 },
    { at: 0.788, value: 0.5 },
    { at: 0.81, value: 0.5 },
    { at: 0.832, value: 0.75 },
    { at: 0.854, value: 0.75 },
    { at: 0.876, value: 1 },
    { at: 0.898, value: 1 },
    { at: 1, value: 1 },
  ],
  // World 08 — the experience settles into the quiet CONTACT state.
  contactSettle: [
    { at: 0, value: 0 },
    { at: 0.9, value: 0 },
    { at: 0.96, value: 1 },
    { at: 1, value: 1 },
  ],
  cameraDolly: [
    { at: 0, value: 0 },
    { at: 1, value: 1 },
  ],
} as const;

/** Scroll sub-range each world owns — drives the HUD label, the nav highlight
 * and nav "scroll to world". `dsa` / `collapse` are reserved for later
 * milestones (they collapse onto the end for now). */
export const WORLD_RANGES: Record<WorldId, { start: number; end: number }> = {
  entry: { start: 0.0, end: 0.03 },
  core: { start: 0.03, end: 0.19 },
  architecture: { start: 0.19, end: 0.43 },
  projects: { start: 0.43, end: 0.66 },
  journey: { start: 0.66, end: 0.9 },
  dsa: { start: 1.0, end: 1.0 },
  collapse: { start: 1.0, end: 1.0 },
  contact: { start: 0.9, end: 1.0 },
};

export function worldAt(progress: number): WorldId {
  const order: readonly WorldId[] = [
    'entry',
    'core',
    'architecture',
    'projects',
    'journey',
    'dsa',
    'collapse',
    'contact',
  ];
  let current: WorldId = 'entry';
  for (const id of order) {
    if (progress >= WORLD_RANGES[id].start && WORLD_RANGES[id].end > WORLD_RANGES[id].start) {
      current = id;
    }
  }
  return current;
}

/** Progress at which the HUD phase label flips from CORE to ARCHITECTURE. */
export const ARCHITECTURE_PHASE_AT = 0.38;

/** Height of the scroll track as a multiple of the viewport — the room GSAP
 * ScrollTrigger has to scrub the full world timeline. Grows per milestone as
 * worlds are added (M2 projects: 620 · M3 journey: 900 · M3 pacing pass: 1100 —
 * more room per world so each project → project move lands). */
export const SCROLL_TRACK_VH = 1100;

// ── Quality profiles ───────────────────────────────────────────────────────
export const QUALITY_PROFILES: Record<CoreQuality, QualityProfile> = {
  full: {
    pixelRatioCap: 2,
    outerSegments: 30,
    energySegments: 44,
    innerSpokes: 12,
    particlesPerConnection: 3,
    coreMarkers: 20,
    orbitSatellites: 5,
    distantNodes: 70,
    foregroundMotes: 10,
    journeyParticles: 190,
    ambientShader: true,
    glowSprites: true,
  },
  balanced: {
    pixelRatioCap: 1.5,
    outerSegments: 20,
    energySegments: 28,
    innerSpokes: 8,
    particlesPerConnection: 2,
    coreMarkers: 12,
    orbitSatellites: 4,
    distantNodes: 36,
    foregroundMotes: 6,
    journeyParticles: 96,
    ambientShader: true,
    glowSprites: true,
  },
  performance: {
    pixelRatioCap: 1,
    outerSegments: 14,
    energySegments: 18,
    innerSpokes: 6,
    particlesPerConnection: 1,
    coreMarkers: 8,
    orbitSatellites: 3,
    distantNodes: 18,
    foregroundMotes: 0,
    journeyParticles: 0,
    ambientShader: false,
    glowSprites: false,
  },
} as const;

interface NavigatorWithDeviceMemory extends Navigator {
  readonly deviceMemory?: number;
}

/**
 * Device-aware quality pick. The prototype only needs FULL + a lighter
 * fallback, so this returns `full` on capable desktops and `balanced`
 * everywhere else; `performance` stays available for manual selection later.
 */
export function detectQuality(): CoreQuality {
  if (typeof window === 'undefined') {
    return 'balanced';
  }

  const nav = window.navigator as NavigatorWithDeviceMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const smallViewport =
    Math.min(window.innerWidth, window.innerHeight) < 720;

  if (coarsePointer || smallViewport || cores <= 4 || memory <= 4) {
    return 'balanced';
  }

  return 'full';
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
