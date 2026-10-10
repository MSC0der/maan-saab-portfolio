import { ConnectionConfig, NetworkNodeConfig } from './immersive.model';

/**
 * The engineering network — the technology ecosystem that surrounds the core.
 *
 * Per the spec this is static configuration for the prototype; the production
 * theme will source it from the existing portfolio skill data. Content is drawn
 * from PROJECT_CONTEXT.md (Node.js + Express services with JWT / RBAC / cron /
 * payments, Angular + TypeScript client, MySQL + MongoDB stores, AWS delivery) —
 * nothing here is invented.
 *
 * Every node carries two layouts:
 *   heroPosition  — the orbital composition around the core (scroll 0%).
 *   archPosition  — the hierarchical architecture layout (scroll 100%):
 *
 *                          AWS
 *                 ┌─────────┴─────────┐
 *              BACKEND            FRONTEND
 *                 │                   │
 *              NODE.JS ──────────  ANGULAR ── TYPESCRIPT
 *                 │                   │
 *                 └─────── DATABASE ──┘
 *                        /          \
 *                     MYSQL        MONGODB
 *
 * Coordinates are core-local units: x → right, y → up, z → toward camera.
 * Depth (z) is deliberately spread so the network reads as a volume, not a
 * diagram. The core stays dominant at the origin.
 */
export const NETWORK_NODES: readonly NetworkNodeConfig[] = [
  {
    id: 'nodejs',
    label: 'NODE.JS',
    kind: 'Backend Runtime',
    blurb: 'The service layer — every request, rule and integration runs here.',
    details: [
      'REST APIs',
      'JWT Authentication',
      'RBAC',
      'Cron Jobs',
      'Payment Integration',
      'Email & OTP Systems',
    ],
    heroPosition: [0.2, 2.75, -0.4],
    archPosition: [-3.8, 0.15, 0.7],
    accent: 'cyan',
    tier: 'tech',
    sigil: 'cube',
  },
  {
    id: 'angular',
    label: 'ANGULAR',
    kind: 'Client Application',
    blurb: 'The application shell — routing, rendering and the user experience.',
    details: [
      'Standalone Components',
      'Angular Signals',
      'RxJS Streams',
      'SPA Routing',
    ],
    heroPosition: [3.6, 0.7, 1.9],
    archPosition: [2.7, 0.15, 0.7],
    accent: 'cyan',
    tier: 'tech',
    sigil: 'ring',
  },
  {
    id: 'typescript',
    label: 'TYPESCRIPT',
    kind: 'Language',
    blurb: 'Type-safe contracts shared across the client and tooling.',
    details: ['Strict typing', 'Shared API contracts', 'Compile-time safety'],
    heroPosition: [2.7, -1.9, 2.4],
    archPosition: [3.6, -0.5, 0.3],
    accent: 'cyan',
    tier: 'tech',
    sigil: 'bars',
  },
  {
    id: 'mongodb',
    label: 'MONGODB',
    kind: 'Document Store',
    blurb: 'Flexible document storage for evolving, semi-structured records.',
    details: ['Aggregation pipelines', 'Index strategy', 'Flexible schemas'],
    heroPosition: [-2.2, 0.3, -1.3],
    archPosition: [2.9, -3.3, 0.6],
    accent: 'cyan',
    tier: 'tech',
    sigil: 'octa',
  },
  {
    id: 'mysql',
    label: 'MYSQL',
    kind: 'Relational Store',
    blurb: 'Transactional relational data with strong consistency guarantees.',
    details: ['Schema design', 'Query optimization', 'Transactional integrity'],
    heroPosition: [-1.5, -2.8, -2.9],
    archPosition: [-2.9, -3.3, 0.6],
    accent: 'cyan',
    tier: 'tech',
    sigil: 'prism',
  },
  {
    id: 'aws',
    label: 'AWS',
    kind: 'Cloud Platform',
    blurb: 'Deployment, object storage and content delivery for the platform.',
    details: ['Deployment', 'S3 Storage', 'Content Delivery'],
    heroPosition: [-3.4, 2.9, -0.6],
    archPosition: [0.0, 3.7, -0.3],
    accent: 'violet',
    tier: 'tech',
    sigil: 'tetra',
  },

  // Structural layers — collapsed onto the core until the architecture reveals.
  {
    id: 'backend',
    label: 'BACKEND',
    kind: 'Service Layer',
    blurb: 'APIs, authentication and background work.',
    details: ['APIs', 'Auth', 'Jobs'],
    heroPosition: [-0.2, 0.15, 0.1],
    archPosition: [-3.8, 2.1, -0.5],
    accent: 'cyan',
    tier: 'structural',
    sigil: 'cube',
  },
  {
    id: 'frontend',
    label: 'FRONTEND',
    kind: 'Client Layer',
    blurb: 'Rendering, routing and interaction.',
    details: ['SPA', 'Rendering', 'UX'],
    heroPosition: [0.2, 0.15, -0.1],
    archPosition: [2.7, 2.0, -0.5],
    accent: 'cyan',
    tier: 'structural',
    sigil: 'ring',
  },
  {
    id: 'database',
    label: 'DATABASE',
    kind: 'Data Layer',
    blurb: 'Relational and document persistence.',
    details: ['Relational', 'Document'],
    heroPosition: [0.0, -0.2, 0.0],
    archPosition: [0.0, -2.15, -0.4],
    accent: 'cyan',
    tier: 'structural',
    sigil: 'octa',
  },
] as const;

/** Technology nodes only — used for the HUD count and default hover set. */
export const TECHNOLOGY_NODE_IDS: readonly string[] = NETWORK_NODES.filter(
  (node) => node.tier === 'tech',
).map((node) => node.id);

/**
 * Meaningful engineering relationships, expressed as the architecture hierarchy.
 * While the structural nodes are collapsed on the core (hero layout) these read
 * as spokes from the core to each technology; as the architecture reveals they
 * re-string into the layered hierarchy above. This is an architecture diagram,
 * not a spider-web.
 */
export const NETWORK_CONNECTIONS: readonly ConnectionConfig[] = [
  { from: 'aws', to: 'backend', rank: 'primary', relation: 'Hosts services' },
  { from: 'aws', to: 'frontend', rank: 'primary', relation: 'Serves client' },
  { from: 'backend', to: 'nodejs', rank: 'primary', relation: 'Runs on' },
  { from: 'frontend', to: 'angular', rank: 'primary', relation: 'Built with' },
  { from: 'nodejs', to: 'angular', rank: 'primary', relation: 'HTTP / REST API' },
  { from: 'nodejs', to: 'database', rank: 'primary', relation: 'Persists to' },
  { from: 'database', to: 'mysql', rank: 'primary', relation: 'Relational' },
  { from: 'database', to: 'mongodb', rank: 'primary', relation: 'Document' },
  { from: 'angular', to: 'typescript', rank: 'secondary', relation: 'Compiled from' },
] as const;

/** Adjacency lookup: node id → ids it shares a connection with. */
export function buildAdjacency(): ReadonlyMap<string, readonly string[]> {
  const map = new Map<string, string[]>();

  for (const node of NETWORK_NODES) {
    map.set(node.id, []);
  }

  for (const connection of NETWORK_CONNECTIONS) {
    map.get(connection.from)?.push(connection.to);
    map.get(connection.to)?.push(connection.from);
  }

  return map;
}
