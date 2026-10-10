import { Injectable } from '@angular/core';
import * as THREE from 'three';

import {
  CAMERA_CONFIG,
  CAMERA_PATH,
  CORE_COLORS,
  CORE_GEOMETRY,
  CORE_MOTION,
  DWELL,
  FOG_CONFIG,
  INTERACTION_CONFIG,
  JOURNEY_CONFIG,
  NODE_CONFIG,
  PARTICLE_CONFIG,
  POINTER_FIELD,
  PROJECT_SYSTEMS,
  QUALITY_PROFILES,
} from '../immersive.config';
import {
  CoreQuality,
  JourneyMilestoneSpec,
  NodeTier,
  ProjectSpec,
  QualityProfile,
  SceneRuntimeState,
  ScrollDrivenState,
} from '../immersive.model';
import {
  NETWORK_CONNECTIONS,
  NETWORK_NODES,
  buildAdjacency,
} from '../technology-network.data';

/** Per-node mutable runtime — geometry handles plus lerped visual state. */
interface NodeRuntime {
  readonly id: string;
  readonly tier: NodeTier;
  readonly group: THREE.Group;
  readonly body: THREE.Mesh;
  readonly bodyMaterial: THREE.MeshStandardMaterial;
  readonly frameMaterial: THREE.MeshBasicMaterial;
  readonly iconMaterial: THREE.MeshBasicMaterial;
  readonly labelMaterial: THREE.SpriteMaterial;
  readonly icon: THREE.Mesh;
  readonly glow: THREE.Sprite | null;
  readonly heroPosition: THREE.Vector3;
  readonly compactPosition: THREE.Vector3;
  readonly archPosition: THREE.Vector3;
  readonly worldPosition: THREE.Vector3;
  readonly floatPhase: number;
  /** 0..1 hover/active emphasis. */
  brightness: number;
  brightnessTarget: number;
  /** 0..1 how present the node is right now (spread for tech, arch for layers). */
  presence: number;
  /** 0..1 cursor proximity this frame (architecture regional activation). */
  cursorInfluence: number;
}

/** Per-connection mutable runtime — an animated path with a travelling pulse. */
interface ConnectionRuntime {
  readonly fromId: string;
  readonly toId: string;
  readonly fromNode: NodeRuntime;
  readonly toNode: NodeRuntime;
  readonly isSecondary: boolean;
  readonly line: THREE.Line;
  readonly baseColor: THREE.Color;
  readonly positions: Float32Array;
  readonly colors: Float32Array;
  readonly positionAttribute: THREE.BufferAttribute;
  readonly colorAttribute: THREE.BufferAttribute;
  readonly start: THREE.Vector3;
  readonly end: THREE.Vector3;
  readonly control: THREE.Vector3;
  intensity: number;
  intensityTarget: number;
  pulseT: number;
  pulsePause: number;
}

interface ParticleRuntime {
  connectionIndex: number;
  t: number;
  speed: number;
  pause: number;
}

/** One project system — a central object with real technology/architecture
 * nodes around it, placed along the corridor the camera travels in World 04. */
interface ProjectClusterRuntime {
  readonly id: string;
  readonly group: THREE.Group;
  readonly core: THREE.Mesh;
  readonly coreMaterial: THREE.MeshStandardMaterial;
  readonly wireMaterial: THREE.MeshBasicMaterial;
  readonly glow: THREE.Sprite | null;
  readonly nodeMeshes: readonly THREE.Object3D[];
  readonly nodeFrameMaterials: readonly THREE.MeshBasicMaterial[];
  readonly nodeBodyMaterials: readonly THREE.MeshStandardMaterial[];
  readonly nodeLabelMaterials: readonly THREE.SpriteMaterial[];
  readonly lines: readonly THREE.Line[];
  readonly lineMaterial: THREE.LineBasicMaterial;
  readonly titleMaterial: THREE.SpriteMaterial;
  readonly categoryMaterial: THREE.SpriteMaterial;
  readonly basePosition: THREE.Vector3;
  readonly worldPosition: THREE.Vector3;
  readonly floatPhase: number;
  readonly accentColor: THREE.Color;
  brightness: number;
  brightnessTarget: number;
}

/** One Engineering Journey milestone — a small engineered location on the
 * career path, built once and materialised as `journeyForm` resolves. */
interface JourneyMilestoneRuntime {
  readonly id: string;
  readonly future: boolean;
  readonly group: THREE.Group;
  readonly ringMaterial: THREE.MeshBasicMaterial;
  readonly markerMaterial: THREE.MeshStandardMaterial;
  readonly coreMaterial: THREE.MeshStandardMaterial;
  readonly coreMesh: THREE.Mesh;
  readonly ring: THREE.Mesh;
  /** Thin secondary ring that fades in as the camera approaches — the "becomes
   * more detailed" cue so the milestone reads as a place, not a speck. */
  readonly detailRing: THREE.Mesh;
  readonly detailRingMaterial: THREE.MeshBasicMaterial;
  readonly glow: THREE.Sprite | null;
  readonly label: THREE.Sprite;
  readonly labelMaterial: THREE.SpriteMaterial;
  readonly labelBaseScale: THREE.Vector2;
  readonly basePosition: THREE.Vector3;
  readonly worldPosition: THREE.Vector3;
  readonly floatPhase: number;
  /** Approx fractional position along the path (fallback for proximity). */
  readonly pathU: number;
  brightness: number;
}

/** A pooled particle carrying a fragment of a project cluster out into the
 * path. Never allocated in the render loop. */
interface JourneyParticleRuntime {
  clusterIndex: number;
  /** Fractional position on the path curve this fragment settles onto. */
  pathT: number;
  /** When (in `journeyForm`) this fragment starts travelling. */
  delay: number;
  bowX: number;
  bowY: number;
  phase: number;
  /** Slow along-path drift once the path has formed (keeps it alive). */
  drift: number;
}

const CURVE_SAMPLES = 24;

// Module-level scratch — reused every frame, never allocated in the loop.
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _scale = new THREE.Vector3(1, 1, 1);
const _color = new THREE.Color();
const _ndc = new THREE.Vector2();
const _plane = new THREE.Plane();
const _camForward = new THREE.Vector3();
const _pointerRay = new THREE.Raycaster();
const _jv1 = new THREE.Vector3();
const _jv2 = new THREE.Vector3();
const _jv3 = new THREE.Vector3();

/**
 * Owns the entire Three.js side of the Engineering Core: renderer, scene,
 * camera, lighting, a layered procedural core, the technology network, data flow
 * and the render loop. Interaction and scroll services push state in through the
 * shared `runtime` / `scroll` objects and the `setHovered* / setActive*`
 * setters — this service never reads the DOM or portfolio data.
 *
 * Provided per-component (not root) so each mount gets a clean lifecycle.
 */
@Injectable()
export class EngineeringCoreSceneService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private perspective!: THREE.PerspectiveCamera;
  private clock!: THREE.Clock;
  private profile!: QualityProfile;

  private host!: HTMLElement;
  private frameHandle = 0;
  private running = false;
  private disposed = false;
  private resizeObserver?: ResizeObserver;
  private readonly onVisibility = () => this.handleVisibility();

  // Core sub-groups — GSAP mutates these via the scroll state each frame.
  private coreGroup!: THREE.Group;
  private outerFrameGroup!: THREE.Group;
  private outerRingGroup!: THREE.Group;
  private energyRingGroup!: THREE.Group;
  private energyArcGroup!: THREE.Group;
  private innerArchGroup!: THREE.Group;
  private centralCoreGroup!: THREE.Group;
  private centralInnerGroup!: THREE.Group;
  private baseRingGroup!: THREE.Group;
  private networkGroup!: THREE.Group;
  private projectSystemsGroup!: THREE.Group;
  private journeyGroup!: THREE.Group;
  private backgroundGroup!: THREE.Group;
  private foregroundGroup!: THREE.Group;

  private projectSpecs: readonly ProjectSpec[] = [];
  private projectClusters: ProjectClusterRuntime[] = [];

  private journeySpecs: readonly JourneyMilestoneSpec[] = [];
  private journeyMilestones: JourneyMilestoneRuntime[] = [];
  private journeyCurve: THREE.CatmullRomCurve3 | null = null;
  private journeyLine: THREE.Line | null = null;
  private journeyLineColors: Float32Array = new Float32Array(0);
  private journeyLineBaseColor = new THREE.Color(CORE_COLORS.cyan);
  private journeyPathPulse = 0;
  private journeyParticles: JourneyParticleRuntime[] = [];
  private journeyParticlePoints: THREE.Points | null = null;
  private journeyParticlePositions: Float32Array = new Float32Array(0);
  private readonly journeyOrigin = new THREE.Vector3();
  /** Damped fractional milestone index the camera frames — scroll-driven only. */
  private magnetMilestone = 0;
  private milestoneFocusBlend = 0;

  private centralShell!: THREE.Mesh;
  private centralShellMaterial!: THREE.MeshStandardMaterial;
  private centralWireMaterial!: THREE.MeshBasicMaterial;
  private centralInnerMaterial!: THREE.MeshStandardMaterial;
  private centralGlow: THREE.Sprite | null = null;
  private readonly energyMaterials: THREE.MeshStandardMaterial[] = [];
  private readonly ports: THREE.Object3D[] = [];
  private satellites: THREE.InstancedMesh | null = null;
  private readonly satellitePhases: number[] = [];
  private markerPoints: THREE.Points | null = null;
  private markerColors: Float32Array = new Float32Array(0);
  private readonly markerPhases: number[] = [];
  private corePointLight!: THREE.PointLight;
  private readonly corePointLightBase = new THREE.Vector3(0, 0, 0.4);
  private ambientUniforms: {
    uTime: { value: number };
    uPointer: { value: THREE.Vector2 };
  } | null = null;
  private softDotTexture: THREE.Texture | null = null;

  private nodes: NodeRuntime[] = [];
  private connections: ConnectionRuntime[] = [];
  private particles: ParticleRuntime[] = [];
  private particlePoints: THREE.Points | null = null;
  private particlePositions: Float32Array = new Float32Array(0);

  private adjacency: ReadonlyMap<string, readonly string[]> = new Map();
  private raycastTargets: THREE.Object3D[] = [];
  private coreProxy!: THREE.Object3D;

  private energyBoost = 0;
  private focusBlend = 0;

  /** Cursor projected into the world on the focus plane — the core "gravity"
   * look-bias reads this (architecture/core worlds only). */
  private readonly pointerWorld = new THREE.Vector3();
  /** Damped corridor focus index the camera frames — scroll-driven only. */
  private magnetFocus = 0;
  /** Weighted centroid of the cursor-active architecture region + its weight. */
  private readonly regionCentroid = new THREE.Vector3();
  private regionWeight = 0;

  private readonly disposableGeometries: THREE.BufferGeometry[] = [];
  private readonly disposableMaterials: THREE.Material[] = [];
  private readonly disposableTextures: THREE.Texture[] = [];

  /** Pointer + interaction state — written by CoreInteractionService. */
  readonly runtime: SceneRuntimeState = {
    pointer: { x: 0, y: 0 },
    pointerTarget: { x: 0, y: 0 },
    field: { x: 0, y: 0, slowX: 0, slowY: 0, engage: 0 },
    hovering: false,
    hoveredNodeId: null,
    activeNodeId: null,
    hoveredProjectId: null,
    activeProjectId: null,
    hoveredMilestoneId: null,
    activeMilestoneId: null,
    coreHovered: false,
    reducedMotion: false,
  };

  /** Scroll choreography state — written by CoreScrollService's GSAP timeline. */
  readonly scroll: ScrollDrivenState = {
    cameraDolly: 0,
    coreExpand: 0,
    ringSeparation: 0,
    nodeSpread: 0,
    archReveal: 0,
    projectsForm: 0,
    projectsFocus: 0,
    journeyForm: 0,
    journeyProgress: 0,
    contactSettle: 0,
    phase: 'CORE',
    world: 'entry',
  };

  private readonly cameraBase = new THREE.Vector3();
  private readonly lookTarget = new THREE.Vector3();
  private readonly camPathPos = new THREE.Vector3();
  private readonly camPathTarget = new THREE.Vector3();
  private camPathFov: number = CAMERA_CONFIG.fov;
  private projectFocusBlend = 0;

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  init(
    canvas: HTMLCanvasElement,
    host: HTMLElement,
    quality: CoreQuality,
    reducedMotion: boolean,
    projects: readonly ProjectSpec[] = [],
    journey: readonly JourneyMilestoneSpec[] = [],
  ): void {
    this.host = host;
    this.profile = QUALITY_PROFILES[quality];
    this.runtime.reducedMotion = reducedMotion;
    this.projectSpecs = projects;
    this.journeySpecs = journey;
    this.adjacency = buildAdjacency();

    const { clientWidth: w, clientHeight: h } = host;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: quality === 'full',
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, this.profile.pixelRatioCap),
    );
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(CORE_COLORS.background, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.16;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(
      CORE_COLORS.background,
      FOG_CONFIG.near,
      FOG_CONFIG.far,
    );

    this.perspective = new THREE.PerspectiveCamera(
      CAMERA_CONFIG.fov,
      w / Math.max(h, 1),
      CAMERA_CONFIG.near,
      CAMERA_CONFIG.far,
    );
    this.sampleCameraPath(0);
    this.perspective.position.copy(this.camPathPos);
    this.perspective.lookAt(this.camPathTarget);

    this.clock = new THREE.Clock();

    this.buildLights();
    this.buildEnvironment();
    this.buildCore();
    this.buildNetwork();
    this.buildParticles();
    this.buildProjectSystems();
    this.buildJourney();
    this.buildCoreProxy();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    document.addEventListener('visibilitychange', this.onVisibility);

    this.start();
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.stop();

    this.resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);

    for (const geometry of this.disposableGeometries) {
      geometry.dispose();
    }
    for (const material of this.disposableMaterials) {
      material.dispose();
    }
    for (const texture of this.disposableTextures) {
      texture.dispose();
    }

    this.renderer.dispose();
    this.renderer.forceContextLoss();

    this.nodes = [];
    this.connections = [];
    this.particles = [];
    this.projectClusters = [];
    this.journeyMilestones = [];
    this.journeyParticles = [];
    this.journeyCurve = null;
    this.raycastTargets = [];
  }

  // ── Public accessors used by interaction + scroll services ────────────────

  get camera(): THREE.PerspectiveCamera {
    return this.perspective;
  }

  getRaycastTargets(): readonly THREE.Object3D[] {
    return this.raycastTargets;
  }

  /** Returns a node id, `core`, `project:<id>`, `milestone:<id>`, or null. */
  resolveHit(object: THREE.Object3D): string | null {
    if (object === this.coreProxy) {
      return 'core';
    }
    let current: THREE.Object3D | null = object;
    while (current) {
      const projectId = current.userData['projectId'];
      if (typeof projectId === 'string') {
        // The reach proxies stay raycastable at all times — only report a hit
        // while the project systems are actually on screen.
        return this.projectSystemsGroup?.visible ? `project:${projectId}` : null;
      }
      const milestoneId = current.userData['milestoneId'];
      if (typeof milestoneId === 'string') {
        return this.journeyGroup?.visible ? `milestone:${milestoneId}` : null;
      }
      const id = current.userData['nodeId'];
      if (typeof id === 'string') {
        return id;
      }
      current = current.parent;
    }
    return null;
  }

  setHoveredNode(id: string | null): void {
    this.runtime.hoveredNodeId = id;
    this.refreshTargets();
  }

  setActiveNode(id: string | null): void {
    this.runtime.activeNodeId = id;
    this.refreshTargets();
  }

  setHoveredProject(id: string | null): void {
    this.runtime.hoveredProjectId = id;
    this.refreshTargets();
  }

  setActiveProject(id: string | null): void {
    this.runtime.activeProjectId = id;
    this.refreshTargets();
  }

  setHoveredMilestone(id: string | null): void {
    this.runtime.hoveredMilestoneId = id;
  }

  setActiveMilestone(id: string | null): void {
    this.runtime.activeMilestoneId = id;
  }

  setCoreHovered(hovered: boolean): void {
    this.runtime.coreHovered = hovered;
    this.refreshTargets();
  }

  nodeWorldPosition(id: string, out: THREE.Vector3): THREE.Vector3 {
    const node = this.nodes.find((entry) => entry.id === id);
    return node ? out.copy(node.worldPosition) : out.set(0, 0, 0);
  }

  // ── Build: lighting ──────────────────────────────────────────────────────

  private buildLights(): void {
    // Key — cool white/cyan from the upper-right/front.
    const key = new THREE.DirectionalLight(0xdff6ff, 1.4);
    key.position.set(4, 5, 6);

    // Rim — restrained violet from the rear/side for edge separation.
    const rimViolet = new THREE.DirectionalLight(CORE_COLORS.violet, 0.6);
    rimViolet.position.set(-5, 1.5, -4);

    const rimCyan = new THREE.DirectionalLight(CORE_COLORS.cyan, 0.42);
    rimCyan.position.set(3, -2, -5);

    // Fill — low neutral so the graphite reads as engineered, not murky.
    const fill = new THREE.AmbientLight(0x223040, 0.72);

    // Local core glow — modulated by the energy pulse + core hover, and drifts
    // toward the cursor during the CORE world (the "gravitational" response).
    this.corePointLight = new THREE.PointLight(CORE_COLORS.cyan, 0.7, 10, 2);
    this.corePointLight.position.copy(this.corePointLightBase);

    this.scene.add(key, rimViolet, rimCyan, fill, this.corePointLight);
  }

  // ── Build: environment ─────────────────────────────────────────────────

  private buildEnvironment(): void {
    // Grid — almost invisible; it is a depth cue, not decoration. Fog fades it
    // into the distance so it reads as perspective rather than tiling.
    const fine = new THREE.GridHelper(52, 52, 0x0d262c, 0x0d262c);
    const coarse = new THREE.GridHelper(52, 13, 0x1a4048, 0x1a4048);
    for (const [grid, opacity] of [
      [fine, 0.2],
      [coarse, 0.12],
    ] as const) {
      const material = grid.material as THREE.Material;
      material.transparent = true;
      material.opacity = opacity;
      material.depthWrite = false;
      grid.position.y = -3.7;
      this.disposableMaterials.push(material);
      this.disposableGeometries.push(grid.geometry);
      this.scene.add(grid);
    }

    this.buildBackgroundNodes();
    this.buildForegroundMotes();

    if (!this.profile.ambientShader) {
      return;
    }

    // Procedural ambient energy — one additive plane that fills the visual
    // field behind the core. Atmosphere, not a gradient wallpaper.
    const geometry = this.trackGeometry(new THREE.PlaneGeometry(48, 30));
    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uCyan: { value: new THREE.Color(CORE_COLORS.cyan) },
      uViolet: { value: new THREE.Color(CORE_COLORS.violet) },
    };
    this.ambientUniforms = uniforms;
    const material = this.trackMaterial(
      new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision mediump float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uPointer;
          uniform vec3 uCyan;
          uniform vec3 uViolet;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
          }
          void main() {
            vec2 p = vUv - 0.5;
            float r = length(p * vec2(1.7, 1.0));
            float falloff = smoothstep(0.82, 0.03, r);
            // The cursor gently shears the noise field — atmosphere responding
            // to presence, not a visible distortion.
            float n = noise(vUv * 3.0 + uTime * 0.028 + uPointer);
            n += 0.5 * noise(vUv * 6.0 - uTime * 0.045 + uPointer * 1.7);
            n /= 1.5;
            vec3 col = mix(uCyan, uViolet, smoothstep(0.08, 0.6, r) * 0.9);
            float alpha = falloff * (0.04 + 0.055 * n);
            gl_FragColor = vec4(col * (0.5 + 0.7 * n), alpha);
          }
        `,
      }),
    );
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0.3, -10);
    this.scene.add(plane);
  }

  private buildBackgroundNodes(): void {
    this.backgroundGroup = new THREE.Group();
    const count = this.profile.distantNodes;
    if (count > 0) {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 2] = -9 - Math.random() * 16;
      }
      const geometry = this.trackGeometry(new THREE.BufferGeometry());
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      );
      const material = this.trackMaterial(
        new THREE.PointsMaterial({
          color: CORE_COLORS.cyan,
          map: this.softDot(),
          size: 0.09,
          transparent: true,
          opacity: 0.3,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      );
      this.backgroundGroup.add(new THREE.Points(geometry, material));
    }
    this.scene.add(this.backgroundGroup);
  }

  private buildForegroundMotes(): void {
    this.foregroundGroup = new THREE.Group();
    const count = this.profile.foregroundMotes;
    if (count > 0) {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 9;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
        positions[i * 3 + 2] = 2.6 + Math.random() * 2.6;
      }
      const geometry = this.trackGeometry(new THREE.BufferGeometry());
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      );
      const material = this.trackMaterial(
        new THREE.PointsMaterial({
          color: CORE_COLORS.cyan,
          map: this.softDot(),
          size: 0.42,
          transparent: true,
          opacity: 0.06,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        }),
      );
      this.foregroundGroup.add(new THREE.Points(geometry, material));
    }
    this.scene.add(this.foregroundGroup);
  }

  // ── Build: procedural core ─────────────────────────────────────────────

  private buildCore(): void {
    this.coreGroup = new THREE.Group();
    this.outerFrameGroup = new THREE.Group();
    this.outerRingGroup = new THREE.Group();
    this.energyRingGroup = new THREE.Group();
    this.energyArcGroup = new THREE.Group();
    this.innerArchGroup = new THREE.Group();
    this.centralCoreGroup = new THREE.Group();
    this.centralInnerGroup = new THREE.Group();
    this.baseRingGroup = new THREE.Group();

    const graphite = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: CORE_COLORS.graphite,
        metalness: 0.86,
        roughness: 0.42,
      }),
    );
    const graphiteLift = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: CORE_COLORS.graphiteLift,
        metalness: 0.7,
        roughness: 0.55,
      }),
    );
    // Outer structural shell: lower metalness + higher roughness so it never
    // collapses to a black slab at grazing angles, plus a faint cyan-grey
    // self-illumination for background separation. Not brighter, just readable.
    const structural = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x161f2b,
        metalness: 0.46,
        roughness: 0.64,
        emissive: 0x0a1a22,
        emissiveIntensity: 0.14,
      }),
    );

    this.buildOuterFrame(structural);
    this.buildOuterRing(structural);
    this.buildEnergyRing();
    this.buildInnerArchitecture(graphite, graphiteLift);
    this.buildMarkers();
    this.buildCentralCore();
    this.buildBaseRing(graphite);

    this.energyRingGroup.add(this.energyArcGroup);
    this.centralCoreGroup.add(this.centralInnerGroup);
    this.coreGroup.add(
      this.baseRingGroup,
      this.outerFrameGroup,
      this.outerRingGroup,
      this.energyRingGroup,
      this.innerArchGroup,
      this.centralCoreGroup,
    );
    this.scene.add(this.coreGroup);
  }

  private buildOuterFrame(structural: THREE.MeshStandardMaterial): void {
    // A sparse outer cage — makes the core read as a large engineered structure
    // rather than a single object floating in space.
    const radius = CORE_GEOMETRY.outerFrameRadius;
    const strutCount = CORE_GEOMETRY.outerFrameStruts;
    const strut = this.trackGeometry(new THREE.BoxGeometry(0.06, 0.06, 0.9));
    const struts = new THREE.InstancedMesh(strut, structural, strutCount);
    for (let i = 0; i < strutCount; i++) {
      const angle = (i / strutCount) * Math.PI * 2;
      _v1.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      _quat.setFromEuler(_euler.set(0, 0, angle));
      _mat4.compose(_v1, _quat, _scale.set(1, 1, 1));
      struts.setMatrixAt(i, _mat4);
    }
    struts.instanceMatrix.needsUpdate = true;

    const railFront = this.trackGeometry(
      new THREE.TorusGeometry(radius, 0.012, 5, 150),
    );
    const front = new THREE.Mesh(railFront, structural);
    const back = new THREE.Mesh(railFront, structural);
    front.position.z = 0.42;
    back.position.z = -0.42;

    this.outerFrameGroup.add(struts, front, back);
  }

  private buildOuterRing(structural: THREE.MeshStandardMaterial): void {
    const count = this.profile.outerSegments;
    const radius = CORE_GEOMETRY.outerRingRadius;
    const segment = this.trackGeometry(new THREE.BoxGeometry(0.32, 0.15, 0.24));
    // Skip roughly every fifth slot so the ring has engineered gaps.
    const visible: number[] = [];
    for (let i = 0; i < count; i++) {
      if (i % 5 !== 4) {
        visible.push(i);
      }
    }
    const segments = new THREE.InstancedMesh(
      segment,
      structural,
      visible.length,
    );
    segments.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    visible.forEach((slot, index) => {
      const angle = (slot / count) * Math.PI * 2;
      _v1.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      _quat.setFromEuler(_euler.set(0, 0, angle));
      _mat4.compose(_v1, _quat, _scale.set(1, 1, 1));
      segments.setMatrixAt(index, _mat4);
    });
    segments.instanceMatrix.needsUpdate = true;

    // Small emissive strips sitting in the gaps.
    const stripGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.04, 0.09, 0.05),
    );
    const stripMaterial = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: CORE_COLORS.energyBase,
        emissive: CORE_COLORS.cyan,
        emissiveIntensity: 0.6,
        roughness: 0.4,
      }),
    );
    this.energyMaterials.push(stripMaterial);
    const gapCount = Math.floor(count / 5);
    const strips = new THREE.InstancedMesh(
      stripGeometry,
      stripMaterial,
      gapCount,
    );
    for (let i = 0; i < gapCount; i++) {
      const angle = ((i * 5 + 4) / count) * Math.PI * 2;
      _v1.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      _quat.setFromEuler(_euler.set(0, 0, angle));
      _mat4.compose(_v1, _quat, _scale.set(1, 1, 1));
      strips.setMatrixAt(i, _mat4);
    }
    strips.instanceMatrix.needsUpdate = true;

    const edgeGeometry = this.trackGeometry(
      new THREE.TorusGeometry(radius, 0.006, 6, 170),
    );
    const edgeMaterial = this.trackMaterial(
      new THREE.MeshBasicMaterial({
        color: CORE_COLORS.cyan,
        transparent: true,
        opacity: 0.22,
      }),
    );

    this.outerRingGroup.add(
      segments,
      strips,
      new THREE.Mesh(edgeGeometry, edgeMaterial),
    );
  }

  private buildEnergyRing(): void {
    const count = this.profile.energySegments;
    const radius = CORE_GEOMETRY.energyRingRadius;

    const torusGeometry = this.trackGeometry(
      new THREE.TorusGeometry(radius, 0.012, 8, 160),
    );
    const torusMaterial = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: CORE_COLORS.energyBase,
        emissive: CORE_COLORS.cyan,
        emissiveIntensity: 0.42,
        metalness: 0.3,
        roughness: 0.35,
        transparent: true,
        opacity: 0.42,
      }),
    );
    this.energyMaterials.push(torusMaterial);

    const segGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.045, 0.045, 0.13),
    );
    const segMaterial = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: CORE_COLORS.energyBase,
        emissive: CORE_COLORS.cyan,
        emissiveIntensity: 0.6,
        metalness: 0.2,
        roughness: 0.3,
      }),
    );
    this.energyMaterials.push(segMaterial);

    const segments = new THREE.InstancedMesh(segGeometry, segMaterial, count);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      _v1.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      _quat.setFromEuler(_euler.set(0, 0, angle));
      _mat4.compose(_v1, _quat, _scale.set(1, 1, 1));
      segments.setMatrixAt(i, _mat4);
      segments.setColorAt(
        i,
        _color.set(i % 7 === 3 ? CORE_COLORS.violet : CORE_COLORS.cyan),
      );
    }
    segments.instanceMatrix.needsUpdate = true;
    if (segments.instanceColor) {
      segments.instanceColor.needsUpdate = true;
    }
    this.energyRingGroup.add(new THREE.Mesh(torusGeometry, torusMaterial), segments);

    // Bright partial arcs that flow around the ring faster than the ticks.
    const arcGeometry = this.trackGeometry(
      new THREE.TorusGeometry(radius, 0.02, 8, 40, Math.PI * 0.32),
    );
    const arcMaterial = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: CORE_COLORS.energyBase,
        emissive: CORE_COLORS.cyan,
        emissiveIntensity: 1.1,
        roughness: 0.25,
        transparent: true,
        opacity: 0.9,
      }),
    );
    this.energyMaterials.push(arcMaterial);
    for (let i = 0; i < CORE_GEOMETRY.energyArcs; i++) {
      const arc = new THREE.Mesh(arcGeometry, arcMaterial);
      arc.rotation.z = (i / CORE_GEOMETRY.energyArcs) * Math.PI * 2;
      this.energyArcGroup.add(arc);
    }
  }

  private buildInnerArchitecture(
    graphite: THREE.MeshStandardMaterial,
    graphiteLift: THREE.MeshStandardMaterial,
  ): void {
    const edgeMaterial = this.trackMaterial(
      new THREE.MeshBasicMaterial({
        color: CORE_COLORS.cyan,
        transparent: true,
        opacity: 0.12,
      }),
    );

    for (const ringRadius of CORE_GEOMETRY.innerRingRadii) {
      const geometry = this.trackGeometry(
        new THREE.TorusGeometry(ringRadius, 0.016, 8, 120),
      );
      this.innerArchGroup.add(new THREE.Mesh(geometry, graphite));
      const glowGeometry = this.trackGeometry(
        new THREE.TorusGeometry(ringRadius, 0.004, 6, 120),
      );
      this.innerArchGroup.add(new THREE.Mesh(glowGeometry, edgeMaterial));
    }

    const spokeCount = this.profile.innerSpokes;
    const spokeLength =
      CORE_GEOMETRY.innerSpokeOuter - CORE_GEOMETRY.innerSpokeInner;
    const spokeGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.03, 0.03, spokeLength),
    );
    const spokes = new THREE.InstancedMesh(
      spokeGeometry,
      graphiteLift,
      spokeCount,
    );
    const mid =
      (CORE_GEOMETRY.innerSpokeInner + CORE_GEOMETRY.innerSpokeOuter) / 2;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      _v1.set(Math.cos(angle) * mid, Math.sin(angle) * mid, 0);
      _quat.setFromEuler(_euler.set(0, 0, angle + Math.PI / 2));
      _mat4.compose(_v1, _quat, _scale.set(1, 1, 1));
      spokes.setMatrixAt(i, _mat4);
    }
    spokes.instanceMatrix.needsUpdate = true;
    this.innerArchGroup.add(spokes);

    // Technical plates + docking ports where connections meet the core.
    const plateGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.3, 0.03, 0.2),
    );
    const portGeometry = this.trackGeometry(
      new THREE.CylinderGeometry(0.05, 0.07, 0.16, 12),
    );
    const portMaterial = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: CORE_COLORS.energyBase,
        emissive: CORE_COLORS.cyan,
        emissiveIntensity: 0.65,
        roughness: 0.4,
      }),
    );
    this.energyMaterials.push(portMaterial);

    for (let i = 0; i < CORE_GEOMETRY.ports; i++) {
      const angle = (i / CORE_GEOMETRY.ports) * Math.PI * 2 + Math.PI / 6;
      if (i % 3 === 0) {
        const plate = new THREE.Mesh(plateGeometry, graphiteLift);
        plate.position.set(Math.cos(angle) * 1.28, Math.sin(angle) * 1.28, 0);
        plate.rotation.z = angle;
        this.innerArchGroup.add(plate);
      }
      const port = new THREE.Mesh(portGeometry, portMaterial);
      port.userData['portAngle'] = angle;
      port.position.set(
        Math.cos(angle) * CORE_GEOMETRY.portRadius,
        Math.sin(angle) * CORE_GEOMETRY.portRadius,
        0.02,
      );
      port.rotation.z = angle + Math.PI / 2;
      this.innerArchGroup.add(port);
      this.ports.push(port);
    }
  }

  private buildMarkers(): void {
    const count = this.profile.coreMarkers;
    if (count === 0) {
      return;
    }
    const positions = new Float32Array(count * 3);
    this.markerColors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.98 + Math.random() * 0.64;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      this.markerPhases.push(Math.random() * Math.PI * 2);
    }
    const geometry = this.trackGeometry(new THREE.BufferGeometry());
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(this.markerColors, 3),
    );
    const material = this.trackMaterial(
      new THREE.PointsMaterial({
        map: this.softDot(),
        size: 0.06,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    );
    this.markerPoints = new THREE.Points(geometry, material);
    this.markerPoints.frustumCulled = false;
    this.innerArchGroup.add(this.markerPoints);
  }

  private buildCentralCore(): void {
    const shellGeometry = this.trackGeometry(
      new THREE.IcosahedronGeometry(CORE_GEOMETRY.centralShellRadius, 1),
    );
    // Dark faceted crystal: non-metallic + very rough so the key light can
    // never throw a stray specular highlight; a faint emissive gives it a hint
    // of contained internal energy. It fades to a cage as the core "opens".
    this.centralShellMaterial = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x0a1017,
        metalness: 0,
        roughness: 0.95,
        emissive: 0x0b1a24,
        emissiveIntensity: 0.16,
        flatShading: true,
        transparent: true,
        opacity: 0.94,
      }),
    ) as THREE.MeshStandardMaterial;
    this.centralShell = new THREE.Mesh(shellGeometry, this.centralShellMaterial);

    const wireGeometry = this.trackGeometry(
      new THREE.IcosahedronGeometry(CORE_GEOMETRY.centralShellRadius + 0.06, 1),
    );
    this.centralWireMaterial = this.trackMaterial(
      new THREE.MeshBasicMaterial({
        color: CORE_COLORS.cyan,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      }),
    ) as THREE.MeshBasicMaterial;
    const wire = new THREE.Mesh(wireGeometry, this.centralWireMaterial);

    const innerGeometry = this.trackGeometry(
      new THREE.IcosahedronGeometry(CORE_GEOMETRY.centralInnerRadius, 0),
    );
    this.centralInnerMaterial = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: CORE_COLORS.energyBase,
        emissive: CORE_COLORS.cyan,
        emissiveIntensity: 1.4,
        metalness: 0.2,
        roughness: 0.25,
      }),
    ) as THREE.MeshStandardMaterial;
    const inner = new THREE.Mesh(innerGeometry, this.centralInnerMaterial);

    const octaGeometry = this.trackGeometry(
      new THREE.OctahedronGeometry(CORE_GEOMETRY.centralInnerRadius + 0.12, 0),
    );
    const octaMaterial = this.trackMaterial(
      new THREE.MeshBasicMaterial({
        color: CORE_COLORS.cyan,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      }),
    );
    const octa = new THREE.Mesh(octaGeometry, octaMaterial);

    this.centralInnerGroup.add(inner, octa);
    this.centralCoreGroup.add(this.centralShell, wire);

    // Micro-satellites orbiting the centre.
    const satCount = this.profile.orbitSatellites;
    if (satCount > 0) {
      const satGeometry = this.trackGeometry(
        new THREE.BoxGeometry(0.045, 0.045, 0.045),
      );
      const satMaterial = this.trackMaterial(
        new THREE.MeshStandardMaterial({
          color: CORE_COLORS.energyBase,
          emissive: CORE_COLORS.cyan,
          emissiveIntensity: 0.9,
          roughness: 0.3,
        }),
      );
      this.energyMaterials.push(satMaterial);
      this.satellites = new THREE.InstancedMesh(
        satGeometry,
        satMaterial,
        satCount,
      );
      this.satellites.frustumCulled = false;
      for (let i = 0; i < satCount; i++) {
        this.satellitePhases.push((i / satCount) * Math.PI * 2);
      }
      this.centralCoreGroup.add(this.satellites);
    }

    if (this.profile.glowSprites) {
      this.centralGlow = this.makeGlowSprite(1.9, 0);
      this.centralCoreGroup.add(this.centralGlow);
    }
  }

  private buildBaseRing(graphite: THREE.MeshStandardMaterial): void {
    const geometry = this.trackGeometry(
      new THREE.TorusGeometry(CORE_GEOMETRY.baseRingRadius, 0.05, 10, 140),
    );
    this.baseRingGroup.add(new THREE.Mesh(geometry, graphite));

    const mountGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.24, 0.24, 0.5),
    );
    const mounts = new THREE.InstancedMesh(mountGeometry, graphite, 3);
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
      _v1.set(
        Math.cos(angle) * CORE_GEOMETRY.baseRingRadius,
        Math.sin(angle) * CORE_GEOMETRY.baseRingRadius,
        0,
      );
      _quat.setFromEuler(_euler.set(0, 0, angle));
      _mat4.compose(_v1, _quat, _scale.set(1, 1, 1));
      mounts.setMatrixAt(i, _mat4);
    }
    mounts.instanceMatrix.needsUpdate = true;
    this.baseRingGroup.add(mounts);
    this.baseRingGroup.rotation.x = CORE_GEOMETRY.baseRingTilt;
  }

  // ── Build: technology network ─────────────────────────────────────────

  private buildNetwork(): void {
    this.networkGroup = new THREE.Group();

    const frameGeometry = this.trackGeometry(
      new THREE.TorusGeometry(NODE_CONFIG.hexRadius, 0.018, 3, 6),
    );
    const plateGeometry = this.trackGeometry(
      new THREE.CylinderGeometry(
        NODE_CONFIG.hexRadius * 0.86,
        NODE_CONFIG.hexRadius * 0.86,
        0.05,
        6,
      ),
    );
    const sigilGeometries = this.buildSigilGeometries();
    const cyanIcon = this.trackMaterial(
      new THREE.MeshBasicMaterial({ color: CORE_COLORS.cyan }),
    );
    const violetIcon = this.trackMaterial(
      new THREE.MeshBasicMaterial({ color: CORE_COLORS.violet }),
    );

    for (const config of NETWORK_NODES) {
      const accentHex =
        config.accent === 'violet' ? CORE_COLORS.violet : CORE_COLORS.cyan;

      const group = new THREE.Group();
      group.userData['nodeId'] = config.id;

      const bodyMaterial = this.trackMaterial(
        new THREE.MeshStandardMaterial({
          color: 0x0c141d,
          emissive: accentHex,
          emissiveIntensity: 0.16,
          metalness: 0.5,
          roughness: 0.5,
          transparent: true,
          opacity: 0.24,
        }),
      ) as THREE.MeshStandardMaterial;
      const body = new THREE.Mesh(plateGeometry, bodyMaterial);
      body.rotation.x = Math.PI / 2;
      body.userData['nodeId'] = config.id;

      const frameMaterial = this.trackMaterial(
        new THREE.MeshBasicMaterial({
          color: accentHex,
          transparent: true,
          opacity: 0.3,
        }),
      ) as THREE.MeshBasicMaterial;
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);

      const iconMaterial = (
        config.accent === 'violet' ? violetIcon : cyanIcon
      ).clone() as THREE.MeshBasicMaterial;
      iconMaterial.transparent = true;
      this.trackMaterial(iconMaterial);
      const icon = new THREE.Mesh(sigilGeometries[config.sigil], iconMaterial);

      const label = this.makeLabelSprite(config.label, config.tier);

      let glow: THREE.Sprite | null = null;
      if (this.profile.glowSprites && config.tier === 'tech') {
        glow = this.makeGlowSprite(0.8, 0, accentHex);
        group.add(glow);
      }

      group.add(frame, body, icon, label);

      const hero = new THREE.Vector3(...config.heroPosition);
      const arch = new THREE.Vector3(...config.archPosition);

      // Label offset: structural labels always sit clearly above; technology
      // labels lean toward their side of the architecture so a layer label and
      // the technology label beneath it never stack.
      const lean =
        config.tier === 'tech'
          ? arch.x < -0.6
            ? -0.16
            : arch.x > 0.6
              ? 0.16
              : 0
          : 0;
      label.position.set(lean, config.tier === 'structural' ? 0.5 : 0.56, 0);

      const compact =
        config.tier === 'structural'
          ? hero.clone()
          : hero.clone().multiplyScalar(NODE_CONFIG.compactFactor);
      if (config.tier === 'tech') {
        compact.y *= 0.72;
      }
      group.position.copy(compact);

      this.networkGroup.add(group);
      if (config.tier === 'tech') {
        this.raycastTargets.push(body);
      }

      this.nodes.push({
        id: config.id,
        tier: config.tier,
        group,
        body,
        bodyMaterial,
        frameMaterial,
        iconMaterial,
        labelMaterial: label.material as THREE.SpriteMaterial,
        icon,
        glow,
        heroPosition: hero,
        compactPosition: compact,
        archPosition: arch,
        worldPosition: compact.clone(),
        floatPhase: Math.random() * Math.PI * 2,
        brightness: 0.12,
        brightnessTarget: 0.12,
        presence: 0,
        cursorInfluence: 0,
      });
    }

    for (const config of NETWORK_CONNECTIONS) {
      const fromNode = this.nodes.find((n) => n.id === config.from);
      const toNode = this.nodes.find((n) => n.id === config.to);
      if (!fromNode || !toNode) {
        continue;
      }
      const isSecondary = config.rank === 'secondary';
      const baseColor = new THREE.Color(
        isSecondary ? CORE_COLORS.violet : CORE_COLORS.cyan,
      );
      const material = this.trackMaterial(
        new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );

      const positions = new Float32Array(CURVE_SAMPLES * 3);
      const colors = new Float32Array(CURVE_SAMPLES * 3);
      const positionAttribute = new THREE.BufferAttribute(positions, 3);
      const colorAttribute = new THREE.BufferAttribute(colors, 3);
      positionAttribute.setUsage(THREE.DynamicDrawUsage);
      colorAttribute.setUsage(THREE.DynamicDrawUsage);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', positionAttribute);
      geometry.setAttribute('color', colorAttribute);
      this.disposableGeometries.push(geometry);
      const line = new THREE.Line(geometry, material);
      line.frustumCulled = false;
      this.networkGroup.add(line);

      this.connections.push({
        fromId: config.from,
        toId: config.to,
        fromNode,
        toNode,
        isSecondary,
        line,
        baseColor,
        positions,
        colors,
        positionAttribute,
        colorAttribute,
        start: new THREE.Vector3(),
        end: new THREE.Vector3(),
        control: new THREE.Vector3(),
        intensity: 0.12,
        intensityTarget: 0.12,
        pulseT: Math.random(),
        pulsePause: 0,
      });
    }

    this.scene.add(this.networkGroup);
  }

  private buildSigilGeometries(): Record<string, THREE.BufferGeometry> {
    const map: Record<string, THREE.BufferGeometry> = {
      cube: this.trackGeometry(new THREE.BoxGeometry(0.12, 0.12, 0.12)),
      octa: this.trackGeometry(new THREE.OctahedronGeometry(0.095)),
      tetra: this.trackGeometry(new THREE.TetrahedronGeometry(0.1)),
      ring: this.trackGeometry(new THREE.TorusGeometry(0.075, 0.022, 6, 14)),
      bars: this.trackGeometry(new THREE.BoxGeometry(0.17, 0.045, 0.045)),
      prism: this.trackGeometry(
        new THREE.CylinderGeometry(0.08, 0.08, 0.1, 3),
      ),
    };
    return map;
  }

  private buildParticles(): void {
    const perConnection = this.profile.particlesPerConnection;
    const total = this.connections.length * perConnection;
    if (total === 0) {
      return;
    }

    this.particlePositions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);

    let index = 0;
    for (let c = 0; c < this.connections.length; c++) {
      for (let p = 0; p < perConnection; p++) {
        this.particles.push({
          connectionIndex: c,
          t: p / perConnection + Math.random() * 0.05,
          speed:
            PARTICLE_CONFIG.speed +
            (Math.random() - 0.5) * PARTICLE_CONFIG.speedJitter,
          pause: 0,
        });
        const violet = index % PARTICLE_CONFIG.violetEvery === 0;
        _color.set(violet ? CORE_COLORS.violet : CORE_COLORS.cyan);
        colors[index * 3] = _color.r;
        colors[index * 3 + 1] = _color.g;
        colors[index * 3 + 2] = _color.b;
        index++;
      }
    }

    const geometry = this.trackGeometry(new THREE.BufferGeometry());
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3),
    );
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = this.trackMaterial(
      new THREE.PointsMaterial({
        map: this.softDot(),
        size: PARTICLE_CONFIG.size,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    );

    this.particlePoints = new THREE.Points(geometry, material);
    this.particlePoints.frustumCulled = false;
    this.scene.add(this.particlePoints);
  }

  // ── Build: World 04 — Project Systems ────────────────────────────────

  /**
   * Each real project becomes a spatial cluster — a central object with its
   * actual technology / architecture items around it — laid along a corridor
   * on +X so the camera travels between them. Built once, hidden until the
   * architecture reorganises (`projectsForm`).
   */
  private buildProjectSystems(): void {
    this.projectSystemsGroup = new THREE.Group();
    this.projectSystemsGroup.visible = false;
    this.scene.add(this.projectSystemsGroup);

    if (this.projectSpecs.length === 0) {
      return;
    }

    const coreGeo = this.trackGeometry(
      new THREE.IcosahedronGeometry(PROJECT_SYSTEMS.projectCoreRadius, 0),
    );
    const wireGeo = this.trackGeometry(
      new THREE.IcosahedronGeometry(PROJECT_SYSTEMS.projectCoreRadius + 0.05, 0),
    );
    const nodeGeo = this.trackGeometry(
      new THREE.CylinderGeometry(0.24, 0.24, 0.06, 6),
    );
    const nodeFrameGeo = this.trackGeometry(
      new THREE.TorusGeometry(0.24, 0.014, 3, 6),
    );

    this.projectSpecs.forEach((spec, index) => {
      const accentHex = spec.accent === 'violet' ? CORE_COLORS.violet : CORE_COLORS.cyan;
      const group = new THREE.Group();
      group.position.set(
        PROJECT_SYSTEMS.corridorStart + index * PROJECT_SYSTEMS.corridorSpacing,
        Math.sin(index * 12.9898) * PROJECT_SYSTEMS.yJitter,
        Math.cos(index * 7.233) * PROJECT_SYSTEMS.zJitter - 0.6,
      );

      const coreMaterial = this.trackMaterial(
        new THREE.MeshStandardMaterial({
          color: 0x0c141d,
          emissive: accentHex,
          emissiveIntensity: 0.15,
          metalness: 0.55,
          roughness: 0.5,
          flatShading: true,
          transparent: true,
          opacity: 0,
        }),
      ) as THREE.MeshStandardMaterial;
      const core = new THREE.Mesh(coreGeo, coreMaterial);
      core.userData['projectId'] = spec.id;
      this.raycastTargets.push(core);

      const wireMaterial = this.trackMaterial(
        new THREE.MeshBasicMaterial({
          color: accentHex,
          wireframe: true,
          transparent: true,
          opacity: 0,
        }),
      ) as THREE.MeshBasicMaterial;
      const wire = new THREE.Mesh(wireGeo, wireMaterial);

      let glow: THREE.Sprite | null = null;
      if (this.profile.glowSprites) {
        glow = this.makeGlowSprite(1.7, 0, accentHex);
        glow.material.opacity = 0;
        group.add(glow);
      }
      group.add(core, wire);

      // Invisible reach proxy — so a hover / click registers anywhere over the
      // cluster's system ring, not only on the small central mesh. Gated on
      // `projectSystemsGroup.visible` in `resolveHit` so it is inert elsewhere.
      const proxy = new THREE.Mesh(
        this.trackGeometry(
          new THREE.SphereGeometry(PROJECT_SYSTEMS.ringRadius * 1.15, 8, 6),
        ),
        this.trackMaterial(new THREE.MeshBasicMaterial({ visible: false })),
      );
      proxy.userData['projectId'] = spec.id;
      group.add(proxy);
      this.raycastTargets.push(proxy);

      const labels = spec.nodes.slice(0, PROJECT_SYSTEMS.maxNodesPerCluster);
      const nodeMeshes: THREE.Object3D[] = [];
      const nodeFrameMaterials: THREE.MeshBasicMaterial[] = [];
      const nodeBodyMaterials: THREE.MeshStandardMaterial[] = [];
      const nodeLabelMaterials: THREE.SpriteMaterial[] = [];
      const lines: THREE.Line[] = [];
      const lineMaterial = this.trackMaterial(
        new THREE.LineBasicMaterial({
          color: accentHex,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0,
        }),
      );

      labels.forEach((label, k) => {
        const angle = -Math.PI / 2 + (k / labels.length) * Math.PI * 2;
        const nodePos = new THREE.Vector3(
          Math.cos(angle) * PROJECT_SYSTEMS.ringRadius,
          Math.sin(angle) * PROJECT_SYSTEMS.ringRadius * 0.82,
          Math.sin(k * 5.31) * 0.55,
        );
        const nodeGroup = new THREE.Group();
        nodeGroup.position.copy(nodePos);

        const bodyMaterial = this.trackMaterial(
          new THREE.MeshStandardMaterial({
            color: 0x0c141d,
            emissive: accentHex,
            emissiveIntensity: 0.35,
            metalness: 0.4,
            roughness: 0.55,
            transparent: true,
            opacity: 0,
          }),
        ) as THREE.MeshStandardMaterial;
        const body = new THREE.Mesh(nodeGeo, bodyMaterial);
        body.rotation.x = Math.PI / 2;

        const frameMaterial = this.trackMaterial(
          new THREE.MeshBasicMaterial({
            color: accentHex,
            transparent: true,
            opacity: 0,
          }),
        ) as THREE.MeshBasicMaterial;
        const frame = new THREE.Mesh(nodeFrameGeo, frameMaterial);

        const labelSprite = this.makeLabelSprite(label.toUpperCase(), 'structural');
        labelSprite.position.set(0, 0.4, 0);
        labelSprite.scale.set(1.15, 0.29, 1);

        nodeGroup.add(body, frame, labelSprite);
        group.add(nodeGroup);

        nodeMeshes.push(nodeGroup);
        nodeFrameMaterials.push(frameMaterial);
        nodeBodyMaterials.push(bodyMaterial);
        nodeLabelMaterials.push(labelSprite.material as THREE.SpriteMaterial);

        const linePts = [new THREE.Vector3(0, 0, 0), nodePos.clone()];
        const lineGeo = this.trackGeometry(
          new THREE.BufferGeometry().setFromPoints(linePts),
        );
        const line = new THREE.Line(lineGeo, lineMaterial);
        line.frustumCulled = false;
        group.add(line);
        lines.push(line);
      });

      const titleSprite = this.makeWideLabel(spec.title.toUpperCase(), 28, 'rgba(234,246,255,0.95)');
      titleSprite.position.set(0, PROJECT_SYSTEMS.ringRadius + 0.42, 0);
      titleSprite.scale.multiplyScalar(0.86);
      const categorySprite = this.makeWideLabel(spec.category.toUpperCase(), 17, 'rgba(120,150,165,0.9)');
      categorySprite.position.set(0, PROJECT_SYSTEMS.ringRadius + 0.14, 0);
      categorySprite.scale.multiplyScalar(0.86);
      group.add(titleSprite, categorySprite);

      this.projectSystemsGroup.add(group);
      this.projectClusters.push({
        id: spec.id,
        group,
        core,
        coreMaterial,
        wireMaterial,
        glow,
        nodeMeshes,
        nodeFrameMaterials,
        nodeBodyMaterials,
        nodeLabelMaterials,
        lines,
        lineMaterial,
        titleMaterial: titleSprite.material as THREE.SpriteMaterial,
        categoryMaterial: categorySprite.material as THREE.SpriteMaterial,
        basePosition: group.position.clone(),
        worldPosition: group.position.clone(),
        floatPhase: index * 1.7,
        accentColor: new THREE.Color(accentHex),
        brightness: 0.12,
        brightnessTarget: 0.12,
      });
    });
  }

  // ── Build: World 05 — Engineering Journey ─────────────────────────────

  /** Local anchor for milestone `i` — X advances so the camera keeps
   * travelling; Y and Z weave so the path is a route through space, never a
   * 2D line. Deterministic, scales to any milestone count. */
  private journeyAnchorLocal(i: number, out: THREE.Vector3): THREE.Vector3 {
    return out.set(
      i * JOURNEY_CONFIG.step,
      Math.sin(i * 1.7 + 0.6) * JOURNEY_CONFIG.yWeave,
      Math.cos(i * 1.15) * JOURNEY_CONFIG.zWeave,
    );
  }

  /**
   * The project clusters do not fade out — their fragments travel out into
   * deeper space and organise into the career path. This builds that path (a
   * Catmull-Rom curve through procedurally-placed milestone anchors), the
   * milestone locations on it, and the pooled bridge-particle system. Hidden
   * until `journeyForm` lifts it.
   */
  private buildJourney(): void {
    this.journeyGroup = new THREE.Group();
    this.journeyGroup.visible = false;
    this.scene.add(this.journeyGroup);

    if (this.journeySpecs.length === 0) {
      return;
    }

    this.journeyOrigin.set(
      JOURNEY_CONFIG.origin[0],
      JOURNEY_CONFIG.origin[1],
      JOURNEY_CONFIG.origin[2],
    );

    // Curve control points: a lead-in near the corridor exit, then one per
    // milestone. The lead-in makes the path visibly *continue* from projects.
    const points: THREE.Vector3[] = [
      new THREE.Vector3(
        JOURNEY_CONFIG.leadIn[0],
        JOURNEY_CONFIG.leadIn[1],
        JOURNEY_CONFIG.leadIn[2],
      ),
    ];
    const anchors: THREE.Vector3[] = [];
    this.journeySpecs.forEach((_, i) => {
      const anchor = this.journeyAnchorLocal(i, new THREE.Vector3()).add(
        this.journeyOrigin,
      );
      anchors.push(anchor);
      points.push(anchor);
    });

    this.journeyCurve = new THREE.CatmullRomCurve3(
      points,
      false,
      'catmullrom',
      0.5,
    );

    // ── The path line — an engineering route, not a neon rope: low base
    // opacity with a single travelling light pulse.
    const sampleCount =
      JOURNEY_CONFIG.pathSamplesPerSegment * (points.length - 1) + 1;
    const linePositions = new Float32Array(sampleCount * 3);
    this.journeyLineColors = new Float32Array(sampleCount * 3);
    for (let i = 0; i < sampleCount; i++) {
      const t = i / (sampleCount - 1);
      this.journeyCurve.getPoint(t, _jv1);
      linePositions[i * 3] = _jv1.x;
      linePositions[i * 3 + 1] = _jv1.y;
      linePositions[i * 3 + 2] = _jv1.z;
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3),
    );
    const colorAttr = new THREE.BufferAttribute(this.journeyLineColors, 3);
    colorAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeometry.setAttribute('color', colorAttr);
    this.disposableGeometries.push(lineGeometry);
    const lineMaterial = this.trackMaterial(
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.journeyLine = new THREE.Line(lineGeometry, lineMaterial);
    this.journeyLine.frustumCulled = false;
    this.journeyGroup.add(this.journeyLine);

    // ── Milestones — a consistent engineered marker: ring + secondary detail
    // ring + vertical strut + small energy core + soft halo + a
    // distance-readable year label.
    const ringGeo = this.trackGeometry(
      new THREE.TorusGeometry(JOURNEY_CONFIG.ringRadius, 0.016, 3, 28),
    );
    const detailRingGeo = this.trackGeometry(
      new THREE.TorusGeometry(JOURNEY_CONFIG.ringRadius * 1.32, 0.006, 3, 40),
    );
    const markerGeo = this.trackGeometry(
      new THREE.CylinderGeometry(0.018, 0.018, JOURNEY_CONFIG.markerHeight, 6),
    );
    const coreGeo = this.trackGeometry(
      new THREE.IcosahedronGeometry(JOURNEY_CONFIG.coreRadius, 0),
    );
    const proxyGeo = this.trackGeometry(
      new THREE.SphereGeometry(JOURNEY_CONFIG.influenceRadius * 0.42, 8, 6),
    );

    this.journeySpecs.forEach((spec, i) => {
      const anchor = anchors[i];
      const group = new THREE.Group();
      group.position.copy(anchor);

      const ringMaterial = this.trackMaterial(
        new THREE.MeshBasicMaterial({
          color: CORE_COLORS.cyan,
          transparent: true,
          opacity: 0,
        }),
      ) as THREE.MeshBasicMaterial;
      const ring = new THREE.Mesh(ringGeo, ringMaterial);

      const detailRingMaterial = this.trackMaterial(
        new THREE.MeshBasicMaterial({
          color: CORE_COLORS.cyan,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0,
        }),
      ) as THREE.MeshBasicMaterial;
      const detailRing = new THREE.Mesh(detailRingGeo, detailRingMaterial);

      const markerMaterial = this.trackMaterial(
        new THREE.MeshStandardMaterial({
          color: 0x141d28,
          emissive: CORE_COLORS.cyan,
          emissiveIntensity: 0.1,
          metalness: 0.5,
          roughness: 0.6,
          transparent: true,
          opacity: 0,
        }),
      ) as THREE.MeshStandardMaterial;
      const marker = new THREE.Mesh(markerGeo, markerMaterial);
      marker.position.y = -JOURNEY_CONFIG.markerHeight / 2 + 0.04;

      const coreMaterial = this.trackMaterial(
        new THREE.MeshStandardMaterial({
          color: CORE_COLORS.energyBase,
          emissive: CORE_COLORS.cyan,
          emissiveIntensity: 0.4,
          metalness: 0.2,
          roughness: 0.3,
          transparent: true,
          opacity: 0,
        }),
      ) as THREE.MeshStandardMaterial;
      const coreMesh = new THREE.Mesh(coreGeo, coreMaterial);
      coreMesh.userData['milestoneId'] = spec.id;

      let glow: THREE.Sprite | null = null;
      if (this.profile.glowSprites) {
        glow = this.makeGlowSprite(1.3, 0, CORE_COLORS.cyan);
        glow.material.opacity = 0;
        group.add(glow);
      }

      const label = this.makeWideLabel(
        spec.year.toUpperCase(),
        26,
        'rgba(234,246,255,0.95)',
      );
      label.position.set(0, JOURNEY_CONFIG.ringRadius + 0.5, 0);
      label.scale.multiplyScalar(0.8);
      const labelBaseScale = new THREE.Vector2(label.scale.x, label.scale.y);

      const proxy = new THREE.Mesh(
        proxyGeo,
        this.trackMaterial(new THREE.MeshBasicMaterial({ visible: false })),
      );
      proxy.userData['milestoneId'] = spec.id;
      this.raycastTargets.push(proxy);

      group.add(ring, detailRing, marker, coreMesh, label, proxy);
      this.journeyGroup.add(group);

      this.journeyMilestones.push({
        id: spec.id,
        future: spec.future,
        group,
        ringMaterial,
        markerMaterial,
        coreMaterial,
        coreMesh,
        ring,
        detailRing,
        detailRingMaterial,
        glow,
        label,
        labelMaterial: label.material as THREE.SpriteMaterial,
        labelBaseScale,
        basePosition: anchor.clone(),
        worldPosition: anchor.clone(),
        floatPhase: i * 1.9,
        pathU: (i + 1) / (points.length - 1),
        brightness: 0.12,
      });
    });

    this.buildJourneyParticles();
  }

  /**
   * Pooled bridge particles — a fixed set that carries fragments of the
   * project clusters out along a curved route and lets them settle onto the
   * path. One BufferGeometry, one metadata array; never grown per frame.
   */
  private buildJourneyParticles(): void {
    const count = this.profile.journeyParticles;
    if (count === 0 || !this.journeyCurve) {
      return;
    }

    this.journeyParticlePositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const clusterCount = Math.max(1, this.projectClusters.length);

    for (let i = 0; i < count; i++) {
      this.journeyParticles.push({
        clusterIndex: i % clusterCount,
        pathT: (i + 0.5) / count,
        delay: (i / count) * 0.22,
        bowX: (Math.sin(i * 3.11) * 0.5 + 0.5) * 3.4 * (i % 2 ? 1 : -1),
        bowY: Math.cos(i * 1.73) * 1.6,
        phase: i * 0.618,
        drift: 0.012 + (i % 5) * 0.004,
      });
      _color.set(i % 6 === 0 ? CORE_COLORS.violet : CORE_COLORS.cyan);
      colors[i * 3] = _color.r;
      colors[i * 3 + 1] = _color.g;
      colors[i * 3 + 2] = _color.b;
    }

    const geometry = this.trackGeometry(new THREE.BufferGeometry());
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.journeyParticlePositions, 3),
    );
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = this.trackMaterial(
      new THREE.PointsMaterial({
        map: this.softDot(),
        size: 0.075,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    );
    this.journeyParticlePoints = new THREE.Points(geometry, material);
    this.journeyParticlePoints.frustumCulled = false;
    this.journeyParticlePoints.visible = false;
    this.scene.add(this.journeyParticlePoints);
  }

  private buildCoreProxy(): void {
    const geometry = this.trackGeometry(
      new THREE.SphereGeometry(INTERACTION_CONFIG.coreProxyRadius, 12, 12),
    );
    const material = this.trackMaterial(
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    this.coreProxy = new THREE.Mesh(geometry, material);
    this.scene.add(this.coreProxy);
    this.raycastTargets.push(this.coreProxy);
  }

  // ── Sprite helpers ────────────────────────────────────────────────────

  /** Shared radial-gradient texture that turns square GL points into soft dots. */
  private softDot(): THREE.Texture {
    if (this.softDotTexture) {
      return this.softDotTexture;
    }
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.45, 'rgba(255,255,255,0.55)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.disposableTextures.push(texture);
    this.softDotTexture = texture;
    return texture;
  }

  private makeGlowSprite(
    scale: number,
    yOffset: number,
    colorHex: number = CORE_COLORS.cyan,
  ): THREE.Sprite {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      _color.set(colorHex);
      const rgb = `${Math.round(_color.r * 255)}, ${Math.round(
        _color.g * 255,
      )}, ${Math.round(_color.b * 255)}`;
      gradient.addColorStop(0, `rgba(${rgb}, 0.9)`);
      gradient.addColorStop(0.4, `rgba(${rgb}, 0.25)`);
      gradient.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.disposableTextures.push(texture);

    const material = this.trackMaterial(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.8,
      }),
    );
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(scale, scale, 1);
    sprite.position.y = yOffset;
    return sprite;
  }

  private makeLabelSprite(text: string, tier: NodeTier): THREE.Sprite {
    const width = 256;
    const height = 64;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.font =
        `${tier === 'structural' ? 500 : 600} ${
          tier === 'structural' ? 24 : 30
        }px "JetBrains Mono", ui-monospace, "Courier New", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle =
        tier === 'structural'
          ? 'rgba(150, 180, 190, 0.85)'
          : 'rgba(234, 246, 248, 0.94)';
      ctx.fillText(text, width / 2, height / 2 + 2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.disposableTextures.push(texture);

    const material = this.trackMaterial(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    );
    const sprite = new THREE.Sprite(material);
    const s = tier === 'structural' ? 1.4 : 1.7;
    sprite.scale.set(s, s * 0.25, 1);
    return sprite;
  }

  /** Wider text sprite for project titles / categories (longer strings). */
  private makeWideLabel(text: string, sizePx: number, fill: string): THREE.Sprite {
    const width = 640;
    const height = 96;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `600 ${sizePx}px "JetBrains Mono", ui-monospace, "Courier New", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = fill;
      ctx.fillText(text, width / 2, height / 2 + 2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.disposableTextures.push(texture);
    const material = this.trackMaterial(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    );
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(width / 145, height / 145, 1);
    return sprite;
  }

  // ── State targets ────────────────────────────────────────────────────

  private refreshTargets(): void {
    const focusId = this.runtime.hoveredNodeId ?? this.runtime.activeNodeId;
    const related = focusId ? this.adjacency.get(focusId) ?? [] : [];
    const relatedSet = new Set(related);
    const isHoverFocus = this.runtime.hoveredNodeId !== null;

    for (const node of this.nodes) {
      let target: number;
      if (focusId === null) {
        target = this.runtime.coreHovered ? 0.3 : 0.12;
      } else if (node.id === focusId) {
        target = isHoverFocus ? 1 : 0.85;
      } else if (relatedSet.has(node.id)) {
        target = isHoverFocus ? 0.55 : 0.45;
      } else {
        target = isHoverFocus ? 0.05 : 0.12;
      }
      if (this.runtime.coreHovered) {
        target = Math.max(target, 0.28);
      }
      node.brightnessTarget = target;
    }

    for (const connection of this.connections) {
      const touchesFocus =
        focusId !== null &&
        (connection.fromId === focusId || connection.toId === focusId);
      connection.intensityTarget = touchesFocus
        ? 1
        : focusId === null
          ? 0.16
          : 0.05;
    }

    const projFocus =
      this.runtime.hoveredProjectId ?? this.runtime.activeProjectId;
    const projHover = this.runtime.hoveredProjectId !== null;
    for (const cluster of this.projectClusters) {
      cluster.brightnessTarget =
        projFocus === null
          ? 0.14
          : cluster.id === projFocus
            ? projHover
              ? 1
              : 0.9
            : projHover
              ? 0.05
              : 0.12;
    }
  }

  // ── Render loop ──────────────────────────────────────────────────────

  private start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.clock.start();
    const loop = () => {
      if (!this.running) {
        return;
      }
      this.frameHandle = requestAnimationFrame(loop);
      this.frame();
    };
    this.frameHandle = requestAnimationFrame(loop);
  }

  private stop(): void {
    this.running = false;
    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = 0;
    }
  }

  private handleVisibility(): void {
    if (document.hidden) {
      this.stop();
    } else if (!this.disposed) {
      this.start();
    }
  }

  private frame(): void {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;
    const motion = this.runtime.reducedMotion
      ? CORE_MOTION.reducedMotionScale
      : 1;

    this.updatePointerField();
    this.updateCore(dt, elapsed, motion);
    this.updateNetwork(dt, elapsed, motion);
    this.updateParticles(dt);
    this.updateProjects(dt, elapsed, motion);
    this.updateJourney(dt, elapsed, motion);
    this.updateEnvironment(dt, elapsed, motion);
    this.updateCamera(elapsed);

    if (this.ambientUniforms) {
      this.ambientUniforms.uTime.value = elapsed;
      this.ambientUniforms.uPointer.value.set(
        this.runtime.field.slowX * POINTER_FIELD.environment.shaderOffset,
        this.runtime.field.slowY * POINTER_FIELD.environment.shaderOffset,
      );
    }

    this.renderer.render(this.scene, this.perspective);
  }

  /**
   * Derives the damped pointer field every consumer reads. Runs first so the
   * whole frame sees one coherent cursor state. The raw pointer target is set
   * by CoreInteractionService on pointermove; here it is low-pass filtered into
   * a medium and a slow channel, an engagement factor, and a world-space point
   * (the cursor projected onto the plane through the current look target).
   */
  private updatePointerField(): void {
    const r = this.runtime;
    const pf = POINTER_FIELD;

    if (!r.hovering) {
      r.pointerTarget.x *= pf.releaseDecay;
      r.pointerTarget.y *= pf.releaseDecay;
    }

    r.pointer.x = THREE.MathUtils.lerp(r.pointer.x, r.pointerTarget.x, pf.followLerp);
    r.pointer.y = THREE.MathUtils.lerp(r.pointer.y, r.pointerTarget.y, pf.followLerp);

    r.field.x = r.pointer.x;
    r.field.y = r.pointer.y;
    r.field.slowX = THREE.MathUtils.lerp(r.field.slowX, r.pointer.x, pf.slowLerp);
    r.field.slowY = THREE.MathUtils.lerp(r.field.slowY, r.pointer.y, pf.slowLerp);

    const magnitude = Math.min(1, Math.hypot(r.pointer.x, r.pointer.y));
    r.field.engage = THREE.MathUtils.lerp(
      r.field.engage,
      r.hovering ? magnitude : 0,
      0.05,
    );

    // Project the cursor into the world on a camera-facing plane through the
    // current look target — a stable "where the cursor is pointing" the
    // magnetic focus can measure distances against. Uses last frame's camera,
    // which is imperceptible and keeps the whole frame internally consistent.
    _ndc.set(r.pointer.x, r.pointer.y);
    this.perspective.getWorldDirection(_camForward);
    _plane.setFromNormalAndCoplanarPoint(_camForward, this.lookTarget);
    _pointerRay.setFromCamera(_ndc, this.perspective);
    if (_pointerRay.ray.intersectPlane(_plane, _v3)) {
      this.pointerWorld.lerp(_v3, pf.worldLerp);
    }
  }

  private updateCore(dt: number, elapsed: number, motion: number): void {
    // The core (rings, frame, hub) never had its own exit — only the
    // architecture network's nodes/connections faded via `netFade` — so it sat
    // fully opaque at the world origin for the rest of the experience, reading
    // as a stray structure crashing into the project corridor / journey. Hide
    // it in lockstep with that same fade so the whole architecture dissolves
    // together; reappears if the user scrolls back up past it.
    const netFade =
      1 - THREE.MathUtils.smoothstep(this.scroll.projectsForm, 0.0, 0.34);
    this.coreGroup.visible = netFade > 0.001;

    this.coreGroup.rotation.y += CORE_MOTION.coreGroupYaw * motion * dt;
    this.outerFrameGroup.rotation.z += CORE_MOTION.outerFrameSpin * motion * dt;
    this.outerRingGroup.rotation.z += CORE_MOTION.outerRingSpin * motion * dt;
    this.baseRingGroup.rotation.z += CORE_MOTION.baseRingSpin * motion * dt;
    this.energyRingGroup.rotation.z += CORE_MOTION.energyRingSpin * motion * dt;
    this.energyArcGroup.rotation.z += CORE_MOTION.energyArcSpin * motion * dt;
    this.innerArchGroup.rotation.z += CORE_MOTION.innerArchSpin * motion * dt;
    this.innerArchGroup.rotation.x += CORE_MOTION.innerArchTilt * motion * dt;
    this.centralCoreGroup.rotation.y += CORE_MOTION.centralYaw * motion * dt;
    this.centralCoreGroup.rotation.x += CORE_MOTION.centralPitch * motion * dt;
    this.centralInnerGroup.rotation.y += CORE_MOTION.innerCoreYaw * motion * dt;

    const boostTarget = this.runtime.coreHovered ? 1 : 0;
    this.energyBoost = THREE.MathUtils.lerp(this.energyBoost, boostTarget, 0.06);

    const separation =
      this.scroll.ringSeparation * CORE_GEOMETRY.ringSeparationDepth;
    this.coreGroup.scale.setScalar(
      THREE.MathUtils.lerp(1, CORE_GEOMETRY.expandedScale, this.scroll.coreExpand),
    );
    this.outerFrameGroup.position.z = -separation * 1.15;
    this.outerRingGroup.position.z = -separation;
    this.energyRingGroup.position.z = separation * 0.5;
    this.baseRingGroup.position.z = -separation * 0.85;
    this.innerArchGroup.scale.setScalar(1 + this.scroll.archReveal * 0.05);

    // Ports extend outward as the rings separate.
    for (const port of this.ports) {
      const angle = port.userData['portAngle'] as number;
      const radius = CORE_GEOMETRY.portRadius + separation * 0.32;
      port.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.02);
    }

    // Central core "opens" with ring separation: the dark shell fades to a
    // faceted cage while the luminous centre grows and brightens.
    const open = this.scroll.ringSeparation;
    this.centralShell.scale.setScalar(1 + open * 0.18);
    this.centralShellMaterial.opacity = 0.94 - open * 0.74;
    this.centralWireMaterial.opacity = 0.3 + open * 0.5;
    this.centralInnerGroup.scale.setScalar(1 + open * 0.2);
    if (this.centralGlow) {
      // The soft halo carries the "luminous hub" read so the inner crystal can
      // stay a small, controlled seed of energy rather than a bright polygon.
      this.centralGlow.material.opacity =
        0.55 + open * 0.4 + this.energyBoost * 0.2;
      const g = 1.9 + open * 1.4 + this.energyBoost * 0.3;
      this.centralGlow.scale.set(g, g, 1);
    }

    const pulse =
      1 +
      Math.sin(elapsed * CORE_MOTION.energyPulseHz) *
        CORE_MOTION.energyPulseDepth *
        motion;
    for (const material of this.energyMaterials) {
      material.emissiveIntensity = 0.5 * pulse * (1 + this.energyBoost * 0.6);
    }

    const corePulse =
      1 +
      Math.sin(elapsed * CORE_MOTION.corePulseHz) *
        CORE_MOTION.corePulseDepth *
        motion;
    this.centralCoreGroup.scale.setScalar(corePulse + this.energyBoost * 0.08);
    this.centralInnerMaterial.emissiveIntensity =
      1.1 * pulse + open * 0.5 + this.energyBoost;

    // ── Pointer "gravity" ────────────────────────────────────────────────
    // During the CORE world the environment leans toward the cursor: the
    // local light drifts, the energy ring bends, distant structure is barely
    // affected. Fades out as the systems form; nil for reduced motion.
    const pf = POINTER_FIELD.core;
    const field = this.runtime.field;
    const coreResp =
      (1 - THREE.MathUtils.clamp(this.scroll.projectsForm, 0, 1)) *
      (this.runtime.reducedMotion ? 0 : 1);

    _v1.set(
      this.corePointLightBase.x + field.slowX * pf.lightDrift * coreResp,
      this.corePointLightBase.y + field.slowY * pf.lightDrift * coreResp,
      this.corePointLightBase.z,
    );
    this.corePointLight.position.lerp(_v1, 0.06);
    this.corePointLight.intensity =
      0.7 * pulse +
      open * 0.8 +
      this.energyBoost * 0.8 +
      field.engage * coreResp * 0.35;

    const tilt = pf.energyTilt * coreResp;
    this.energyRingGroup.rotation.x = THREE.MathUtils.lerp(
      this.energyRingGroup.rotation.x,
      -field.slowY * tilt,
      0.05,
    );
    this.energyRingGroup.rotation.y = THREE.MathUtils.lerp(
      this.energyRingGroup.rotation.y,
      field.slowX * tilt,
      0.05,
    );

    this.updateSatellites(elapsed, motion);
    this.updateMarkers(elapsed, motion);
  }

  private updateSatellites(elapsed: number, motion: number): void {
    if (!this.satellites) {
      return;
    }
    const { min, max } = CORE_GEOMETRY.satelliteOrbit;
    for (let i = 0; i < this.satellitePhases.length; i++) {
      const phase = this.satellitePhases[i];
      const angle = elapsed * CORE_MOTION.satelliteSpeed * motion + phase;
      const radius = min + (max - min) * (0.5 + 0.5 * Math.sin(phase * 3));
      _v1.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.3) * radius * 0.4,
        Math.sin(angle) * radius,
      );
      _quat.setFromEuler(_euler.set(angle, angle * 0.7, 0));
      _mat4.compose(_v1, _quat, _scale.set(1, 1, 1));
      this.satellites.setMatrixAt(i, _mat4);
    }
    this.satellites.instanceMatrix.needsUpdate = true;
  }

  private updateMarkers(elapsed: number, motion: number): void {
    if (!this.markerPoints) {
      return;
    }
    const archBoost = 0.4 + this.scroll.archReveal * 0.6;
    for (let i = 0; i < this.markerPhases.length; i++) {
      const wave =
        0.5 +
        0.5 *
          Math.sin(
            elapsed * CORE_MOTION.markerBlinkHz * motion + this.markerPhases[i],
          );
      const mag = (0.12 + 0.88 * wave * wave * wave) * archBoost;
      const violet = i % 6 === 0;
      _color.set(violet ? CORE_COLORS.violet : CORE_COLORS.cyan);
      this.markerColors[i * 3] = _color.r * mag;
      this.markerColors[i * 3 + 1] = _color.g * mag;
      this.markerColors[i * 3 + 2] = _color.b * mag;
    }
    (
      this.markerPoints.geometry.getAttribute('color') as THREE.BufferAttribute
    ).needsUpdate = true;
  }

  private updateNetwork(dt: number, elapsed: number, motion: number): void {
    const spread = THREE.MathUtils.clamp(this.scroll.nodeSpread, 0, 1);
    const arch = THREE.MathUtils.clamp(this.scroll.archReveal, 0, 1);
    // The architecture network hands off to the project systems: it fades out
    // early as `projectsForm` ramps so the transition reads as a reorganisation
    // rather than two overlapping layers.
    const netFade =
      1 - THREE.MathUtils.smoothstep(this.scroll.projectsForm, 0.0, 0.34);
    const connReveal =
      THREE.MathUtils.clamp(0.32 + spread * 0.68, 0.32, 1) * netFade;

    // Cursor field for this world: a small depth-scaled micro-shift while the
    // core is loose, and — once the architecture has resolved — a screen-space
    // "which technology area am I pointing at" that brightens that region and
    // biases the camera. Both nil for reduced motion / once the systems form.
    const field = this.runtime.field;
    const pf = POINTER_FIELD;
    const cursorLive = this.runtime.reducedMotion ? 0 : 1;
    const shiftAmt =
      pf.core.nodeShift * field.engage * netFade * (1 - arch * 0.8) * cursorLive;
    const archMode =
      THREE.MathUtils.smoothstep(arch, 0.4, 0.9) *
      (1 - THREE.MathUtils.smoothstep(this.scroll.projectsForm, 0.0, 0.3)) *
      cursorLive *
      (this.runtime.activeNodeId ? 0 : 1);
    this.regionCentroid.set(0, 0, 0);
    this.regionWeight = 0;

    for (const node of this.nodes) {
      // compact → hero → architecture, plus a small idle float.
      _v1.lerpVectors(node.compactPosition, node.heroPosition, spread);
      _v1.lerp(node.archPosition, arch);
      const presence =
        (node.tier === 'structural'
          ? // Materialise only once the technology nodes have nearly reached
            // their architecture positions, so labels never cross mid-flight.
            THREE.MathUtils.smoothstep(arch, 0.45, 0.9)
          : THREE.MathUtils.clamp(0.55 + spread * 0.45, 0.55, 1)) * netFade;
      node.presence = presence;

      _v1.y +=
        Math.sin(elapsed * CORE_MOTION.nodeFloatHz + node.floatPhase) *
        CORE_MOTION.nodeFloatAmplitude *
        motion *
        presence;

      // Depth-weighted micro-shift toward the cursor — nodes nearer the camera
      // (higher z) lean a little more, distant ones barely move.
      if (shiftAmt > 0.0001) {
        const lean = THREE.MathUtils.clamp(0.35 + _v1.z * 0.12, 0, 1.1) * presence;
        _v1.x += field.slowX * shiftAmt * lean;
        _v1.y += field.slowY * shiftAmt * lean;
      }

      node.group.position.copy(_v1);
      node.worldPosition.copy(_v1);

      // Screen-space cursor proximity — the soft "influence radius" that lets
      // the region react without the pointer hitting a tiny mesh.
      let cursorBoost = 0;
      if (archMode > 0.01 && node.tier === 'tech') {
        _v2.copy(node.worldPosition).project(this.perspective);
        const d = Math.hypot(_v2.x - field.x, _v2.y - field.y);
        const influence =
          THREE.MathUtils.smoothstep(d, pf.architecture.reachNdc, pf.architecture.focusNdc) *
          archMode;
        node.cursorInfluence = influence;
        cursorBoost = influence * pf.architecture.gain;
        if (influence > 0.001) {
          this.regionCentroid.addScaledVector(node.worldPosition, influence);
          this.regionWeight += influence;
        }
      } else {
        node.cursorInfluence = 0;
      }

      const depthScale = THREE.MathUtils.clamp(
        1 + _v1.z * NODE_CONFIG.depthScale.perUnitZ,
        NODE_CONFIG.depthScale.min,
        NODE_CONFIG.depthScale.max,
      );
      node.group.scale.setScalar(depthScale * (0.72 + 0.28 * presence));
      node.group.quaternion.slerp(
        this.perspective.quaternion,
        NODE_CONFIG.billboardLerp,
      );
      node.icon.rotation.y += motion * dt * 0.8;
      node.icon.rotation.x += motion * dt * 0.4;

      node.brightness = THREE.MathUtils.lerp(
        node.brightness,
        Math.max(node.brightnessTarget, cursorBoost),
        INTERACTION_CONFIG.stateLerp,
      );
      const b = node.brightness;
      node.bodyMaterial.emissiveIntensity = 0.2 + b * 1.5;
      node.bodyMaterial.opacity = (0.16 + 0.2 * presence + b * 0.3) * presence;
      node.frameMaterial.opacity = (0.42 + b * 0.55) * presence;
      node.iconMaterial.opacity = (0.62 + b * 0.4) * presence;
      // Structural labels are held below technology labels so the tech layer
      // stays the priority read.
      const labelCap = node.tier === 'structural' ? 0.66 : 1;
      node.labelMaterial.opacity =
        THREE.MathUtils.clamp(0.5 + b * 0.5, 0, 1) * presence * labelCap;
      if (node.glow) {
        node.glow.material.opacity = (0.08 + b * 0.7) * presence;
        const g = 0.85 + b * 0.55;
        node.glow.scale.set(g, g, 1);
      }
    }

    for (const connection of this.connections) {
      connection.start.copy(connection.fromNode.worldPosition);
      connection.end.copy(connection.toNode.worldPosition);

      connection.control
        .addVectors(connection.start, connection.end)
        .multiplyScalar(0.5);
      const bow =
        connection.control.length() *
        PARTICLE_CONFIG.pathBow *
        (1 - arch * 0.7);
      connection.control.add(
        _v2.copy(connection.control).normalize().multiplyScalar(bow),
      );

      for (let i = 0; i < CURVE_SAMPLES; i++) {
        const t = i / (CURVE_SAMPLES - 1);
        this.quadraticPoint(
          connection.start,
          connection.control,
          connection.end,
          t,
          _v3,
        );
        connection.positions[i * 3] = _v3.x;
        connection.positions[i * 3 + 1] = _v3.y;
        connection.positions[i * 3 + 2] = _v3.z;
      }
      connection.positionAttribute.needsUpdate = true;

      // A cursor-active technology area pulls its own connections up with it.
      const cursorConn =
        Math.max(
          connection.fromNode.cursorInfluence,
          connection.toNode.cursorInfluence,
        ) * 0.7;
      connection.intensity = THREE.MathUtils.lerp(
        connection.intensity,
        Math.max(connection.intensityTarget, cursorConn),
        INTERACTION_CONFIG.stateLerp,
      );

      // Travelling brightness pulse, with the occasional pause at a node.
      if (connection.pulsePause > 0) {
        connection.pulsePause = Math.max(0, connection.pulsePause - dt);
      } else {
        connection.pulseT +=
          PARTICLE_CONFIG.linePulseSpeed * dt * (1 + this.energyBoost * 0.3);
        if (connection.pulseT >= 1) {
          connection.pulseT -= 1;
          if (Math.random() < PARTICLE_CONFIG.pauseChance) {
            connection.pulsePause =
              PARTICLE_CONFIG.pauseSeconds.min +
              Math.random() *
                (PARTICLE_CONFIG.pauseSeconds.max -
                  PARTICLE_CONFIG.pauseSeconds.min);
          }
        }
      }

      const baseMag = (0.05 + connection.intensity * 0.5) * connReveal;
      const width = PARTICLE_CONFIG.linePulseWidth;
      for (let i = 0; i < CURVE_SAMPLES; i++) {
        const t = i / (CURVE_SAMPLES - 1);
        const d = Math.abs(t - connection.pulseT);
        const pulse =
          connection.pulsePause > 0
            ? 0
            : Math.exp(-(d * d) / (width * width)) *
              (0.6 + connection.intensity * 0.6);
        const mag = baseMag + pulse;
        connection.colors[i * 3] = connection.baseColor.r * mag;
        connection.colors[i * 3 + 1] = connection.baseColor.g * mag;
        connection.colors[i * 3 + 2] = connection.baseColor.b * mag;
      }
      connection.colorAttribute.needsUpdate = true;
    }

    this.focusBlend = THREE.MathUtils.lerp(
      this.focusBlend,
      this.runtime.activeNodeId ? 1 : 0,
      0.05,
    );
  }

  private updateParticles(dt: number): void {
    if (!this.particlePoints || this.particles.length === 0) {
      return;
    }
    const reveal = THREE.MathUtils.clamp(this.scroll.nodeSpread * 1.2, 0, 1);
    const rate = 1 + this.energyBoost * 0.25;

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const connection = this.connections[particle.connectionIndex];
      if (particle.pause > 0) {
        particle.pause = Math.max(0, particle.pause - dt);
      } else {
        particle.t += particle.speed * rate * dt;
        if (particle.t >= 1) {
          particle.t -= 1;
          if (Math.random() < PARTICLE_CONFIG.pauseChance) {
            particle.pause =
              PARTICLE_CONFIG.pauseSeconds.min +
              Math.random() *
                (PARTICLE_CONFIG.pauseSeconds.max -
                  PARTICLE_CONFIG.pauseSeconds.min);
          }
        }
      }
      this.quadraticPoint(
        connection.start,
        connection.control,
        connection.end,
        particle.t,
        _v1,
      );
      this.particlePositions[i * 3] = _v1.x;
      this.particlePositions[i * 3 + 1] = _v1.y;
      this.particlePositions[i * 3 + 2] = _v1.z;
    }

    (
      this.particlePoints.geometry.getAttribute('position') as THREE.BufferAttribute
    ).needsUpdate = true;
    const netFade =
      1 - THREE.MathUtils.smoothstep(this.scroll.projectsForm, 0.0, 0.34);
    (this.particlePoints.material as THREE.PointsMaterial).opacity =
      (0.3 + 0.6 * reveal) * netFade;
  }

  // ── Update: World 04 — Project Systems ─────────────────────────────────

  private updateProjects(dt: number, elapsed: number, motion: number): void {
    if (!this.projectSystemsGroup || this.projectClusters.length === 0) {
      return;
    }
    const form = THREE.MathUtils.clamp(this.scroll.projectsForm, 0, 1);
    const settle = THREE.MathUtils.clamp(this.scroll.contactSettle, 0, 1);
    this.projectSystemsGroup.visible = form > 0.002 && settle < 0.995;
    if (!this.projectSystemsGroup.visible) {
      return;
    }

    const maxIdx = Math.max(1, this.projectClusters.length - 1);
    // Fully materialised well before the end of the corridor; fades right out as
    // the experience settles into the quiet CONTACT state.
    const appear = THREE.MathUtils.smoothstep(form, 0.08, 0.5) * (1 - settle);

    // ── Corridor focus — scroll owns it outright ────────────────────────────
    // The stepped `projectsFocus` scroll channel already parks the camera on
    // each cluster in turn; this just eases the follower toward it. No cursor
    // input feeds into this on purpose — a cursor "magnet" here used to be
    // able to drag the focus (and the lit cluster) across neighbours just
    // from ordinary mouse movement, which read as flicker/instability.
    const pr = POINTER_FIELD.projects;
    const scrollIdx = this.scroll.projectsFocus * maxIdx;
    this.magnetFocus = THREE.MathUtils.lerp(
      this.magnetFocus,
      scrollIdx,
      this.runtime.activeProjectId ? 0.04 : pr.focusLerp,
    );

    const focusVal = this.magnetFocus;

    for (let i = 0; i < this.projectClusters.length; i++) {
      const cluster = this.projectClusters[i];
      // Only the cluster the camera is arriving at reads brightly — distant
      // clusters stay quiet so their labels never crowd the frame.
      const proximity = 1 - THREE.MathUtils.clamp(Math.abs(i - focusVal), 0, 1.4);
      cluster.brightness = THREE.MathUtils.lerp(
        cluster.brightness,
        Math.max(cluster.brightnessTarget, proximity * proximity * 0.85),
        INTERACTION_CONFIG.stateLerp,
      );
      const b = cluster.brightness;

      const floaty =
        Math.sin(elapsed * PROJECT_SYSTEMS.floatHz + cluster.floatPhase) *
        PROJECT_SYSTEMS.floatAmplitude *
        motion;
      cluster.group.position.set(
        cluster.basePosition.x,
        cluster.basePosition.y + floaty,
        cluster.basePosition.z,
      );
      cluster.worldPosition.copy(cluster.group.position);
      // Idle clusters drift lazily; the one the camera is arriving at eases
      // its rotation back to 0 — the ring's designed front — so it settles
      // facing the camera square-on instead of being caught at whatever
      // angle the idle spin left it at. Wrapping first is safe (rotation is
      // 2π-periodic, so it never causes a visible jump) and lets the ease
      // always take the short way home.
      cluster.group.rotation.y +=
        PROJECT_SYSTEMS.clusterSpin * motion * dt * (1 - b);
      cluster.group.rotation.y =
        THREE.MathUtils.euclideanModulo(
          cluster.group.rotation.y + Math.PI,
          Math.PI * 2,
        ) - Math.PI;
      cluster.group.rotation.y = THREE.MathUtils.lerp(
        cluster.group.rotation.y,
        0,
        b * PROJECT_SYSTEMS.faceCameraLerp,
      );

      // As the Engineering Journey forms, the clusters visibly fragment —
      // contract inward and spin up — rather than simply dimming. Their
      // fragments become the bridge particles handled in updateJourney().
      const frag = THREE.MathUtils.clamp(this.scroll.journeyForm, 0, 1);
      cluster.group.scale.setScalar(
        1 - 0.6 * THREE.MathUtils.smoothstep(frag, 0.0, 0.5),
      );
      cluster.group.rotation.y += frag * 1.8 * motion * dt;

      // The project core stays a small, dark structural anchor — the ring of
      // real technology nodes + the title carry the "system" read.
      cluster.coreMaterial.opacity = (0.3 + 0.4 * b) * appear;
      cluster.coreMaterial.emissiveIntensity = 0.12 + b * 0.8;
      cluster.wireMaterial.opacity = (0.1 + b * 0.32) * appear;
      if (cluster.glow) {
        cluster.glow.material.opacity = (0.04 + b * 0.4) * appear;
        const g = 1.2 + b * 0.7;
        cluster.glow.scale.set(g, g, 1);
      }
      cluster.lineMaterial.opacity = (0.05 + b * 0.55) * appear;
      cluster.titleMaterial.opacity = THREE.MathUtils.clamp(
        (0.06 + b * 0.9) * appear,
        0,
        1,
      );
      cluster.categoryMaterial.opacity = THREE.MathUtils.clamp(
        (0.04 + b * 0.7) * appear,
        0,
        1,
      );

      for (let k = 0; k < cluster.nodeMeshes.length; k++) {
        cluster.nodeMeshes[k].quaternion.slerp(
          this.perspective.quaternion,
          0.12,
        );
        cluster.nodeBodyMaterials[k].opacity = (0.1 + b * 0.4) * appear;
        cluster.nodeBodyMaterials[k].emissiveIntensity = 0.3 + b * 1.1;
        cluster.nodeFrameMaterials[k].opacity = (0.22 + b * 0.62) * appear;
        cluster.nodeLabelMaterials[k].opacity = THREE.MathUtils.clamp(
          (0.12 + b * 0.75) * appear,
          0,
          1,
        );
      }
    }
  }

  // ── Update: World 05 — Engineering Journey ────────────────────────────

  /**
   * The project fragments travel out and organise into the career path; the
   * camera then travels the path (`journeyProgress`) purely on scroll — no
   * cursor input feeds the camera or the milestone highlight here.
   */
  private updateJourney(dt: number, elapsed: number, motion: number): void {
    if (
      !this.journeyGroup ||
      this.journeyMilestones.length === 0 ||
      !this.journeyCurve
    ) {
      return;
    }

    const form = THREE.MathUtils.clamp(this.scroll.journeyForm, 0, 1);
    const settle = THREE.MathUtils.clamp(this.scroll.contactSettle, 0, 1);
    const visible = form > 0.002 && settle < 0.995;
    this.journeyGroup.visible = visible;
    if (this.journeyParticlePoints) {
      this.journeyParticlePoints.visible =
        visible && this.journeyParticles.length > 0;
    }
    if (!visible) {
      return;
    }

    const appear = THREE.MathUtils.smoothstep(form, 0.12, 0.7) * (1 - settle);
    const jp = THREE.MathUtils.clamp(this.scroll.journeyProgress, 0, 1);
    const reduced = this.runtime.reducedMotion;

    // ── Path line — low base glow with one slow travelling pulse.
    if (this.journeyLine) {
      this.journeyPathPulse = (this.journeyPathPulse + dt * 0.11 * motion) % 1;
      const samples = this.journeyLineColors.length / 3;
      const base = 0.05 + 0.06 * appear;
      for (let i = 0; i < samples; i++) {
        const t = i / (samples - 1);
        let d = Math.abs(t - this.journeyPathPulse);
        d = Math.min(d, 1 - d);
        const pulse = Math.exp(-(d * d) / 0.0016) * 0.7;
        const mag = (base + pulse) * appear;
        this.journeyLineColors[i * 3] = this.journeyLineBaseColor.r * mag;
        this.journeyLineColors[i * 3 + 1] = this.journeyLineBaseColor.g * mag;
        this.journeyLineColors[i * 3 + 2] = this.journeyLineBaseColor.b * mag;
      }
      (
        this.journeyLine.geometry.getAttribute('color') as THREE.BufferAttribute
      ).needsUpdate = true;
      (this.journeyLine.material as THREE.LineBasicMaterial).opacity = appear;
    }

    // ── Bridge particles: fragment → curved travel → settle onto the path.
    if (this.journeyParticlePoints && this.journeyParticles.length > 0) {
      const clusters = this.projectClusters;
      for (let i = 0; i < this.journeyParticles.length; i++) {
        const p = this.journeyParticles[i];
        const travel = THREE.MathUtils.smoothstep(
          form,
          p.delay,
          p.delay + 0.55,
        );
        if (travel > 0.985) {
          p.pathT = (p.pathT + p.drift * dt * motion) % 1;
        }
        this.journeyCurve.getPoint(p.pathT, _jv2);
        if (clusters.length > 0) {
          _jv1.copy(clusters[p.clusterIndex].worldPosition);
        } else {
          this.journeyCurve.getPoint(0, _jv1);
        }
        const ease = travel * travel * (3 - 2 * travel);
        _jv3.lerpVectors(_jv1, _jv2, ease);
        const bow = Math.sin(ease * Math.PI);
        _jv3.x += p.bowX * bow;
        _jv3.y += p.bowY * bow;
        const scatter = (1 - ease) * 0.7 + 0.04;
        _jv3.x += Math.sin(elapsed * 0.8 + p.phase) * scatter;
        _jv3.y += Math.cos(elapsed * 0.7 + p.phase * 1.7) * scatter;
        _jv3.z += Math.sin(elapsed * 0.6 + p.phase * 0.9) * scatter;
        this.journeyParticlePositions[i * 3] = _jv3.x;
        this.journeyParticlePositions[i * 3 + 1] = _jv3.y;
        this.journeyParticlePositions[i * 3 + 2] = _jv3.z;
      }
      (
        this.journeyParticlePoints.geometry.getAttribute(
          'position',
        ) as THREE.BufferAttribute
      ).needsUpdate = true;
      // Brightest mid-transit (fragments in flight), easing back to a quiet
      // shimmer once they have settled onto the path.
      const transit = THREE.MathUtils.smoothstep(form, 0.02, 0.4);
      const settled = THREE.MathUtils.smoothstep(form, 0.5, 0.95);
      (this.journeyParticlePoints.material as THREE.PointsMaterial).opacity =
        (0.16 + 0.55 * transit - 0.28 * settled) * (1 - settle);
    }

    // ── Path focus — scroll owns it outright (see updateProjects: the
    // mirrored cursor magnet used to drag this across milestones from
    // ordinary mouse movement, which read as flicker/instability).
    const maxIdx = Math.max(1, this.journeyMilestones.length - 1);
    const scrollIdx = jp * maxIdx;
    this.magnetMilestone = THREE.MathUtils.lerp(
      this.magnetMilestone,
      scrollIdx,
      this.runtime.activeMilestoneId ? 0.04 : JOURNEY_CONFIG.focusLerp,
    );

    // ── Milestone geometry.
    const hovered = this.runtime.hoveredMilestoneId;
    const active = this.runtime.activeMilestoneId;
    // Idle "there is something here" breathing — every milestone reads as a
    // live point of interest, not just when the camera arrives.
    const idle =
      1 +
      Math.sin(elapsed * DWELL.milestonePulseHz) *
        DWELL.milestonePulseDepth *
        motion;
    for (let i = 0; i < this.journeyMilestones.length; i++) {
      const ms = this.journeyMilestones[i];
      const proximity =
        1 - THREE.MathUtils.clamp(Math.abs(i - this.magnetMilestone), 0, 1.5);
      const isFocus = ms.id === hovered || ms.id === active;
      // Raised baseline (0.28) so a milestone is always clearly present as you
      // approach it — you should never wonder whether something is there.
      const target = Math.max(
        isFocus ? (hovered ? 1 : 0.9) : 0.28,
        proximity * proximity,
      );
      ms.brightness = THREE.MathUtils.lerp(
        ms.brightness,
        target,
        INTERACTION_CONFIG.stateLerp,
      );
      const b = ms.brightness;
      const cap = ms.future ? 0.62 : 1;
      // How fully the camera has "arrived" at this milestone.
      const arrived = proximity * proximity;

      const floaty =
        Math.sin(elapsed * JOURNEY_CONFIG.floatHz + ms.floatPhase) *
        JOURNEY_CONFIG.floatAmplitude *
        motion;
      ms.group.position.set(
        ms.basePosition.x,
        ms.basePosition.y + floaty,
        ms.basePosition.z,
      );
      ms.worldPosition.copy(ms.group.position);
      ms.ring.quaternion.slerp(this.perspective.quaternion, 0.08);
      ms.ring.rotation.z += JOURNEY_CONFIG.spin * motion * dt;
      ms.detailRing.quaternion.copy(ms.ring.quaternion);
      ms.detailRing.rotation.z -= JOURNEY_CONFIG.spin * 1.6 * motion * dt;
      ms.coreMesh.rotation.y += motion * dt * 0.6;

      // Ring blooms open as the camera arrives — the "becomes more detailed"
      // cue; the secondary ring only shows up close.
      ms.ring.scale.setScalar(1 + arrived * 0.28);
      ms.ringMaterial.opacity = (0.24 + b * 0.66) * idle * appear * cap;
      ms.detailRingMaterial.opacity = arrived * arrived * 0.5 * appear * cap;
      ms.markerMaterial.opacity = (0.14 + b * 0.5) * appear * cap;
      ms.markerMaterial.emissiveIntensity = (0.14 + b * 0.6) * idle;
      ms.coreMaterial.opacity = (0.3 + b * 0.6) * appear * cap;
      ms.coreMaterial.emissiveIntensity = (0.3 + b * 1.2) * idle;
      ms.labelMaterial.opacity =
        THREE.MathUtils.clamp((0.28 + b * 0.72) * appear, 0, 1) * cap;
      ms.label.scale.set(
        ms.labelBaseScale.x * (1 + arrived * 0.22),
        ms.labelBaseScale.y * (1 + arrived * 0.22),
        1,
      );
      if (ms.glow) {
        ms.glow.material.opacity = (0.06 + b * 0.42) * idle * appear * cap;
        const g = 1.1 + b * 0.8;
        ms.glow.scale.set(g, g, 1);
      }
    }
  }

  private updateEnvironment(dt: number, elapsed: number, motion: number): void {
    const field = this.runtime.field;
    const envShift = POINTER_FIELD.environment.backgroundShift;

    if (this.backgroundGroup) {
      this.backgroundGroup.rotation.y += 0.006 * motion * dt;
      this.backgroundGroup.rotation.z = Math.sin(elapsed * 0.05) * 0.03;
      // Distant nodes drift the opposite way to the cursor, weakly — the far
      // layer has the least parallax, so depth reads as depth.
      this.backgroundGroup.position.x = THREE.MathUtils.lerp(
        this.backgroundGroup.position.x,
        -field.slowX * envShift,
        0.02,
      );
      this.backgroundGroup.position.y = THREE.MathUtils.lerp(
        this.backgroundGroup.position.y,
        -field.slowY * envShift * 0.7,
        0.02,
      );
    }
    if (this.foregroundGroup) {
      // Counter-parallax so the motes clearly sit in front of the scene —
      // restrained, so it never reads as a mouse-tracking demo.
      this.foregroundGroup.position.x = THREE.MathUtils.lerp(
        this.foregroundGroup.position.x,
        -field.slowX * 0.95,
        0.04,
      );
      this.foregroundGroup.position.y = THREE.MathUtils.lerp(
        this.foregroundGroup.position.y,
        -field.slowY * 0.7,
        0.04,
      );
      this.foregroundGroup.rotation.z += 0.01 * motion * dt;
    }
  }

  /**
   * 1 when the stepped focus has settled on a single object (its index is near
   * an integer), 0 mid-travel — purely scroll-driven. Drives how squarely the
   * camera looks at the parked cluster/milestone versus a touch ahead while
   * still travelling between them.
   */
  private dwellAmount(focus: number): number {
    const frac = Math.abs(focus - Math.round(focus));
    return (
      1 -
      THREE.MathUtils.smoothstep(
        frac,
        DWELL.settleBand.inner,
        DWELL.settleBand.outer,
      )
    );
  }

  /** Linear-with-smoothstep interpolation of the camera waypoint path. */
  private sampleCameraPath(t: number): void {
    const path = CAMERA_PATH;
    let i = 0;
    while (i < path.length - 1 && t > path[i + 1].at) {
      i++;
    }
    const a = path[i];
    const b = path[Math.min(i + 1, path.length - 1)];
    const span = Math.max(1e-4, b.at - a.at);
    const lt = THREE.MathUtils.clamp((t - a.at) / span, 0, 1);
    const s = lt * lt * (3 - 2 * lt);
    this.camPathPos.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], s),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], s),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], s),
    );
    this.camPathTarget.set(
      THREE.MathUtils.lerp(a.target[0], b.target[0], s),
      THREE.MathUtils.lerp(a.target[1], b.target[1], s),
      THREE.MathUtils.lerp(a.target[2], b.target[2], s),
    );
    this.camPathFov = THREE.MathUtils.lerp(a.fov, b.fov, s);
  }

  private updateCamera(elapsed: number): void {
    const reduced = this.runtime.reducedMotion;
    const field = this.runtime.field;
    // The pointer is smoothed in updatePointerField(); here it is only read.

    const dolly = reduced
      ? this.scroll.cameraDolly * 0.5
      : this.scroll.cameraDolly;
    this.sampleCameraPath(dolly);
    this.cameraBase.copy(this.camPathPos);
    this.lookTarget.copy(this.camPathTarget);

    // World 03 — architecture: the camera leans toward the technology area the
    // cursor is exploring (weighted centroid built in updateNetwork).
    if (!reduced && this.regionWeight > 0.05 && !this.runtime.activeNodeId) {
      _v1.copy(this.regionCentroid).divideScalar(this.regionWeight);
      const bias =
        POINTER_FIELD.architecture.lookBias *
        THREE.MathUtils.clamp(this.regionWeight, 0, 1);
      this.lookTarget.lerp(_v1, bias);
      this.cameraBase.x += (_v1.x - this.cameraBase.x) * bias * 0.35;
    }

    // World 04 — corridor travel: blend from the architecture framing toward
    // the framing of the focused cluster as the systems form. `magnetFocus`
    // (stepped scroll position, scroll-driven only) drives the target
    // cluster. Framed dead-on from directly behind — no sideways offset and
    // no cursor-driven arc — so the cluster's ring faces the viewer squarely
    // once the camera arrives, instead of at a random angle.
    const form = THREE.MathUtils.clamp(this.scroll.projectsForm, 0, 1);
    if (form > 0.001 && this.projectClusters.length > 0) {
      const cx =
        PROJECT_SYSTEMS.corridorStart +
        this.magnetFocus * PROJECT_SYSTEMS.corridorSpacing;
      const dwell = this.dwellAmount(this.magnetFocus);

      _v1.set(cx, PROJECT_SYSTEMS.cameraHeight, PROJECT_SYSTEMS.cameraBack);
      // Look at the cluster centre once parked; a touch ahead while travelling.
      _v2.set(cx + 1.6 * (1 - dwell), 0.5, 0);
      const k = reduced ? form * 0.6 : form;
      this.cameraBase.lerp(_v1, k);
      this.lookTarget.lerp(_v2, k);
    }

    // World 05 — the Engineering Journey: the camera travels the path
    // (`journeyProgress`), framed from behind + above + to one side so it
    // reads as moving *through* a career, not scrubbing a timeline. Scroll
    // alone drives the position — no cursor bias.
    const jForm = THREE.MathUtils.clamp(this.scroll.journeyForm, 0, 1);
    if (jForm > 0.001 && this.journeyCurve) {
      const jp = THREE.MathUtils.clamp(this.scroll.journeyProgress, 0, 1);
      const jdwell = this.dwellAmount(this.magnetMilestone);
      // Path point (the parked milestone during a dwell) + a look point that
      // pulls onto the milestone as we settle, ahead while travelling.
      this.journeyCurve.getPoint(jp, _jv1);
      this.journeyCurve.getPoint(Math.min(1, jp + 0.05 * (1 - jdwell)), _jv2);

      const jrelX = -JOURNEY_CONFIG.cameraSide;
      const jrelZ = JOURNEY_CONFIG.cameraBack;
      _jv3.set(
        _jv1.x + jrelX,
        _jv1.y + JOURNEY_CONFIG.cameraHeight,
        _jv1.z + jrelZ,
      );
      // Commit to the path framing quickly so the camera never strands
      // mid-flight between the corridor exit and the journey.
      const k = reduced
        ? THREE.MathUtils.smoothstep(jForm, 0, 0.5) * 0.6
        : THREE.MathUtils.smoothstep(jForm, 0, 0.5);
      this.cameraBase.lerp(_jv3, k);
      this.lookTarget.lerp(_jv2, k);
    }

    // World 08 — settle: pull back into a calm wide framing for CONTACT.
    // (A lightweight version; World 07's full collapse-to-core lands later.)
    const settle = THREE.MathUtils.clamp(this.scroll.contactSettle, 0, 1);
    if (settle > 0.001) {
      const ease = settle * settle * (3 - 2 * settle);
      _v1.set(
        this.cameraBase.x + 0.5,
        this.cameraBase.y + 1.4,
        this.cameraBase.z + 4.2,
      );
      this.cameraBase.lerp(_v1, ease * (reduced ? 0.6 : 1));
      _v2.set(this.cameraBase.x + 0.4, 0.4, this.cameraBase.z - 6);
      this.lookTarget.lerp(_v2, ease * 0.7);
    }

    if (!reduced) {
      // Sideways swing — only through the entry → architecture move.
      const swing = Math.max(0, 1 - dolly * 2.4);
      this.cameraBase.x +=
        Math.sin(dolly * Math.PI) * CAMERA_CONFIG.orbitAmplitude * swing;

      const idleX = Math.sin(elapsed * 0.23) * CAMERA_CONFIG.idleDrift.x;
      const idleY = Math.cos(elapsed * 0.19) * CAMERA_CONFIG.idleDrift.y;
      // Fully out (not just eased down) once the corridor / journey camera
      // takes over — those worlds are scroll-only, no cursor parallax at all.
      const parScale =
        1 -
        Math.max(
          THREE.MathUtils.clamp(this.scroll.projectsForm, 0, 1),
          THREE.MathUtils.clamp(this.scroll.journeyForm, 0, 1),
        );
      const parX = field.x * CAMERA_CONFIG.parallax.x * parScale;
      const parY = field.y * CAMERA_CONFIG.parallax.y * parScale;
      this.cameraBase.x += idleX + parX;
      this.cameraBase.y += idleY + parY;
      this.lookTarget.x += parX * 0.18;
      this.lookTarget.y += parY * 0.12;

      // CORE "gravity": the look target eases toward the projected cursor while
      // the core is still the subject.
      const grav =
        POINTER_FIELD.core.lookPull *
        field.engage *
        (1 - THREE.MathUtils.clamp(this.scroll.archReveal, 0, 1) * 0.6) *
        (1 - THREE.MathUtils.clamp(this.scroll.projectsForm, 0, 1));
      if (grav > 0.0005) {
        this.lookTarget.lerp(this.pointerWorld, grav);
      }
    }

    if (this.focusBlend > 0.001 && this.runtime.activeNodeId) {
      this.nodeWorldPosition(this.runtime.activeNodeId, _v1);
      this.lookTarget.lerp(_v1, 0.3 * this.focusBlend);
      _v2.subVectors(_v1, this.cameraBase).setLength(0.7 * this.focusBlend);
      this.cameraBase.add(_v2.setComponent(2, 0));
    }

    // Active project — a subtle focus toward the selected cluster.
    this.projectFocusBlend = THREE.MathUtils.lerp(
      this.projectFocusBlend,
      this.runtime.activeProjectId ? 1 : 0,
      0.06,
    );
    if (this.projectFocusBlend > 0.001 && this.runtime.activeProjectId) {
      const cluster = this.projectClusters.find(
        (c) => c.id === this.runtime.activeProjectId,
      );
      if (cluster) {
        this.lookTarget.lerp(cluster.worldPosition, 0.26 * this.projectFocusBlend);
        _v2.set(
          cluster.worldPosition.x - 1.0,
          PROJECT_SYSTEMS.cameraHeight,
          PROJECT_SYSTEMS.cameraBack - 0.8,
        );
        this.cameraBase.lerp(_v2, 0.2 * this.projectFocusBlend);
      }
    }

    // Active milestone — a subtle settle closer to the selected location.
    this.milestoneFocusBlend = THREE.MathUtils.lerp(
      this.milestoneFocusBlend,
      this.runtime.activeMilestoneId ? 1 : 0,
      0.06,
    );
    if (this.milestoneFocusBlend > 0.001 && this.runtime.activeMilestoneId) {
      const ms = this.journeyMilestones.find(
        (m) => m.id === this.runtime.activeMilestoneId,
      );
      if (ms) {
        this.lookTarget.lerp(ms.worldPosition, 0.28 * this.milestoneFocusBlend);
        _v2.set(
          ms.worldPosition.x - 2.0,
          ms.worldPosition.y + 1.1,
          ms.worldPosition.z + 3.8,
        );
        this.cameraBase.lerp(_v2, 0.2 * this.milestoneFocusBlend);
      }
    }

    if (Math.abs(this.perspective.fov - this.camPathFov) > 0.01) {
      this.perspective.fov = THREE.MathUtils.lerp(
        this.perspective.fov,
        this.camPathFov,
        0.06,
      );
      this.perspective.updateProjectionMatrix();
    }
    this.perspective.position.lerp(this.cameraBase, CAMERA_CONFIG.lerp.position);
    this.perspective.lookAt(this.lookTarget);
  }

  private quadraticPoint(
    a: THREE.Vector3,
    c: THREE.Vector3,
    b: THREE.Vector3,
    t: number,
    out: THREE.Vector3,
  ): THREE.Vector3 {
    const inv = 1 - t;
    return out
      .set(0, 0, 0)
      .addScaledVector(a, inv * inv)
      .addScaledVector(c, 2 * inv * t)
      .addScaledVector(b, t * t);
  }

  private resize(): void {
    if (this.disposed || !this.host) {
      return;
    }
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (w === 0 || h === 0) {
      return;
    }
    this.perspective.aspect = w / h;
    this.perspective.updateProjectionMatrix();
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, this.profile.pixelRatioCap),
    );
    this.renderer.setSize(w, h, false);
  }

  // ── Disposal bookkeeping ─────────────────────────────────────────────

  private trackGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
    this.disposableGeometries.push(geometry);
    return geometry;
  }

  private trackMaterial<T extends THREE.Material>(material: T): T {
    this.disposableMaterials.push(material);
    return material;
  }
}
