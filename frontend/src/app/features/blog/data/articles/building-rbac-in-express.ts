import { Article } from '../../models/article.model';
import {
  callout,
  code,
  estimateReadTime,
  intro,
  list,
  p,
  section,
  table,
} from './article-blocks';

const sections = [
  intro(
    p(
      'Authentication tells you who a request is from. Authorization decides what that caller may do. Plenty of Express apps get the first right and then scatter if (user.role === "admin") checks through their route handlers, which is how privilege bugs are born.',
    ),
    p(
      'Role-based access control (RBAC) is the tidy answer: centralise the rules, express them as data, and enforce them in one middleware. This article builds that up step by step.',
    ),
  ),

  section(
    'Model permissions, not just roles',
    p(
      'The naive model attaches a list of endpoints to each role. It works for three roles and collapses at thirty, a problem often called role explosion: every new combination of access becomes a new role, and nobody can reason about who can do what.',
    ),
    p('A model that scales has three layers:'),
    list(
      'Permissions are small named capabilities, such as records.read, records.write, audit.read, users.manage.',
      'Roles are bundles of permissions with a human name, such as Analyst or Compliance Officer.',
      'Role inheritance lets a senior role include a junior one, so you only declare what is new.',
    ),
    code(
      'javascript',
      `
const ROLES = {
  viewer:  { permissions: ['records.read'] },
  analyst: { inherits: 'viewer',  permissions: ['records.write'] },
  officer: { inherits: 'analyst', permissions: ['audit.read', 'policy.publish'] },
  admin:   { inherits: 'officer', permissions: ['users.manage'] },
};

export function permissionsFor(role, seen = new Set()) {
  if (!role || seen.has(role)) return new Set(); // guards against cycles
  seen.add(role);
  const def = ROLES[role];
  if (!def) return new Set();
  return new Set([...permissionsFor(def.inherits, seen), ...def.permissions]);
}`,
      'Roles as data, with inheritance',
    ),
    callout(
      'Group permissions by capability',
      'When administrators were drowning in thousands of fine-grained entries, grouping permissions into business-level capabilities, like "manage records", made the model readable again.',
    ),
  ),

  section(
    'The enforcement middleware',
    p(
      'Authorization should be declared at the route, next to the handler it protects, and enforced by one piece of shared code. The route then documents its own requirement.',
    ),
    code(
      'javascript',
      `
export const requirePermission = (permission) => (req, res, next) => {
  // authenticate() runs earlier and sets req.user from the verified token
  if (!req.user) return res.sendStatus(401);

  if (!permissionsFor(req.user.role).has(permission)) {
    audit.deny(req, permission);
    return res.sendStatus(403);
  }

  audit.allow(req, permission);
  next();
};

router.get('/records/:id',  requirePermission('records.read'),  getRecord);
router.put('/records/:id',  requirePermission('records.write'), updateRecord);
router.get('/audit',        requirePermission('audit.read'),    listAudit);`,
      'One middleware, declared per route',
    ),
    list(
      'Deny by default: a route with no requirePermission should fail a lint rule or a startup check, not silently ship open.',
      '401 means "I do not know who you are"; 403 means "I know, and the answer is no". Keep them distinct.',
      'Never decide access from client-supplied data such as a role field in the request body.',
    ),
  ),

  section(
    'Resolve permissions cheaply',
    p(
      'It is tempting to bake the full permission list into the JWT. Resist it. Large lists bloat every request and go stale as soon as an administrator edits a role.',
    ),
    p(
      'Keep the token to identity plus a high-level role, and resolve permissions from a cache keyed by role. Invalidate that entry when a role changes. Because the lookup is by role, not by user, the cache stays small and a permission change takes effect immediately instead of when tokens expire.',
    ),
    code(
      'javascript',
      `
const cache = new Map(); // swap for Redis when you run several instances

export function cachedPermissions(role) {
  if (!cache.has(role)) cache.set(role, permissionsFor(role));
  return cache.get(role);
}

export function onRoleChanged(role) {
  cache.clear(); // roles inherit, so a change can affect several entries
}`,
    ),
  ),

  section(
    'Roles are not enough: check ownership',
    p(
      'RBAC answers "may this kind of user perform this kind of action?". It does not answer "may this user edit this particular record?". A viewer-level user editing their own profile and an analyst editing someone else\'s are different cases that share a permission name.',
    ),
    code(
      'javascript',
      `
router.put('/records/:id', requirePermission('records.write'), async (req, res) => {
  const record = await Records.findById(req.params.id);
  if (!record) return res.sendStatus(404);

  // Resource-level rule on top of the role check
  const owns = record.ownerId === req.user.id;
  const supervises = permissionsFor(req.user.role).has('records.manage_all');
  if (!owns && !supervises) return res.sendStatus(403);

  res.json(await Records.update(record, req.body));
});`,
      'Role check first, then the resource-level rule',
    ),
  ),

  section(
    'Log every decision',
    p(
      'Compliance and incident response both depend on knowing who tried what. Record allow and deny decisions in an append-only store with enough context to reconstruct the event.',
    ),
    table(
      ['Field', 'Why it matters'],
      ['actor id and role', 'Who made the request'],
      ['permission and route', 'What they attempted'],
      ['decision', 'Allowed or denied'],
      ['timestamp and request id', 'Correlate with application logs'],
      ['resource id', 'Which record was touched'],
    ),
    p(
      'Treat the log as write-once: application code appends, and only a retention job ever deletes. Denials are the more interesting half, since a spike in 403s from one account is often the first sign of probing.',
    ),
  ),

  section(
    'Test authorization like a matrix',
    p(
      'Authorization bugs hide in combinations, so test combinations. A table of role by action, driven through your real router, catches both missing checks and accidental over-grants.',
    ),
    code(
      'javascript',
      `
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

const MATRIX = [
  ['viewer',  'GET',  '/records/1', 200],
  ['viewer',  'PUT',  '/records/1', 403],
  ['analyst', 'PUT',  '/records/1', 200],
  ['analyst', 'GET',  '/audit',     403],
  ['officer', 'GET',  '/audit',     200],
];

for (const [role, method, path, expected] of MATRIX) {
  test(\`\${role} \${method} \${path} -> \${expected}\`, async () => {
    const res = await request(app)[method.toLowerCase()](path).set(authFor(role));
    assert.equal(res.status, expected);
  });
}`,
    ),
  ),

  section(
    'Common mistakes',
    list(
      'Checking the role in the handler instead of in shared middleware.',
      'Trusting the role claim in a token that is never re-validated or expires too slowly.',
      'Forgetting that an inherited role must also inherit new permissions when they are added.',
      'Returning 404 for some forbidden resources and 403 for others, which leaks which ids exist.',
      'Letting administrators grant permissions they do not hold themselves.',
    ),
  ),
];

export const BUILDING_RBAC_ARTICLE: Article = {
  slug: 'building-rbac-in-express',
  title: 'Building RBAC in Express.js',
  excerpt:
    'Model roles, permission groups and inheritance as data, enforce them in one middleware, and add audit logging and tests so authorization stays correct as it grows.',
  category: 'BACKEND',
  publishedAt: 'Sep 18, 2026',
  filters: ['Backend', 'Node.js', 'Authentication', 'System Design'],
  takeaways: [
    'Permissions are the unit; roles are named bundles with inheritance.',
    'Enforce access in one middleware, deny by default.',
    'Keep tokens small and resolve permissions from a cache.',
    'Add ownership checks, audit logs and a role-by-action test matrix.',
  ],
  tip: {
    label: 'PRO TIP',
    text: 'Grouping permissions into business capabilities is what keeps a permission model manageable at scale.',
  },
  sections,
  readTime: estimateReadTime(sections),
};
