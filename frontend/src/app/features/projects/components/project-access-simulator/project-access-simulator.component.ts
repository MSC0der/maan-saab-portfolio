import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

interface RoleDef {
  readonly id: string;
  readonly label: string;
  /** Role this one inherits every permission group from (hierarchical RBAC). */
  readonly inherits?: string;
  /** Permission groups granted directly by this role. */
  readonly groups: readonly string[];
}

interface ActionDef {
  readonly id: string;
  readonly label: string;
  readonly method: string;
  readonly path: string;
  /** Functional permission group the endpoint's middleware requires. */
  readonly needs: string;
}

interface AuditEntry {
  readonly seq: number;
  readonly time: string;
  readonly role: string;
  readonly request: string;
  readonly allowed: boolean;
}

const ROLES: readonly RoleDef[] = [
  { id: 'viewer', label: 'Viewer', groups: ['records.read'] },
  {
    id: 'analyst',
    label: 'Analyst',
    inherits: 'viewer',
    groups: ['records.write'],
  },
  {
    id: 'officer',
    label: 'Compliance Officer',
    inherits: 'analyst',
    groups: ['audit.read', 'policy.publish'],
  },
  {
    id: 'admin',
    label: 'Admin',
    inherits: 'officer',
    groups: ['users.manage'],
  },
];

const ACTIONS: readonly ActionDef[] = [
  {
    id: 'view',
    label: 'View a compliance record',
    method: 'GET',
    path: '/records/:id',
    needs: 'records.read',
  },
  {
    id: 'edit',
    label: 'Edit a compliance record',
    method: 'PUT',
    path: '/records/:id',
    needs: 'records.write',
  },
  {
    id: 'audit',
    label: 'Read the audit log',
    method: 'GET',
    path: '/audit',
    needs: 'audit.read',
  },
  {
    id: 'publish',
    label: 'Publish a policy',
    method: 'POST',
    path: '/policies/publish',
    needs: 'policy.publish',
  },
  {
    id: 'users',
    label: 'Change a user’s role',
    method: 'POST',
    path: '/users/:id/role',
    needs: 'users.manage',
  },
];

const MAX_AUDIT_ROWS = 6;

/**
 * Interactive walkthrough of PeopleFern's (Security Compliance System) access-control
 * design (stateless JWT + hybrid claims, hierarchical RBAC, functional
 * permission groups, append-only audit trail).
 *
 * It is an illustrative model of that architecture — the roles, groups and
 * endpoints below are representative, not production data — and runs entirely
 * in the browser.
 */
@Component({
  selector: 'app-project-access-simulator',
  standalone: true,
  templateUrl: './project-access-simulator.component.html',
  styleUrl: './project-access-simulator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAccessSimulatorComponent {
  protected readonly roles = ROLES;
  protected readonly actions = ACTIONS;

  protected readonly roleId = signal('analyst');
  protected readonly actionId = signal('audit');
  protected readonly audit = signal<readonly AuditEntry[]>([]);
  private seq = 0;

  protected readonly role = computed(
    () => ROLES.find((r) => r.id === this.roleId()) ?? ROLES[0],
  );
  protected readonly action = computed(
    () => ACTIONS.find((a) => a.id === this.actionId()) ?? ACTIONS[0],
  );

  /** The role plus everything it inherits, most specific first. */
  protected readonly roleChain = computed(() => {
    const chain: RoleDef[] = [];
    let current: RoleDef | undefined = this.role();
    while (current) {
      chain.push(current);
      current = ROLES.find((r) => r.id === current?.inherits);
    }
    return chain;
  });

  protected readonly effectiveGroups = computed(() =>
    this.roleChain().flatMap((r) => r.groups),
  );

  protected readonly allowed = computed(() =>
    this.effectiveGroups().includes(this.action().needs),
  );

  /** Decoded token body. Hybrid claims: identity + high-level role only. */
  protected readonly claims = computed(() =>
    JSON.stringify(
      { sub: 'usr_8f21', role: this.roleId(), iss: 'compliance-api', exp: '15m' },
      null,
      2,
    ),
  );

  protected selectRole(id: string): void {
    this.roleId.set(id);
  }

  protected selectAction(id: string): void {
    this.actionId.set(id);
  }

  protected send(): void {
    const action = this.action();
    const entry: AuditEntry = {
      seq: ++this.seq,
      time: new Date().toLocaleTimeString([], { hour12: false }),
      role: this.role().label,
      request: `${action.method} ${action.path}`,
      allowed: this.allowed(),
    };
    this.audit.update((rows) => [entry, ...rows].slice(0, MAX_AUDIT_ROWS));
  }
}
