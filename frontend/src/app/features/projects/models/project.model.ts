export interface ProjectMetric {
  readonly value: string;
  readonly label: string;
  readonly description: string;
}

export interface ProjectCapability {
  readonly title: string;
  readonly description: string;
}

export interface EngineeringDecision {
  readonly code: string;
  readonly title: string;
  readonly explanation: string;
}

export interface EngineeringObstacle {
  readonly obstacle: string;
  readonly obstacleDescription: string;

  readonly solution: string;
  readonly solutionDescription: string;
}

export interface ProjectSecurityFeature {
  readonly title: string;
  readonly description: string;
}

export interface Project {
  readonly slug: string;

  readonly title: string;
  readonly category: string;
  readonly summary: string;

  readonly technologies: readonly string[];

  readonly featured: boolean;
  readonly status: 'completed' | 'ongoing' | 'concept';
  readonly projectType:
    | 'enterprise'
    | 'client'
    | 'ecommerce'
    | 'portfolio'
    | 'concept';
  /**
   * Whether the delivered site can still be visited. `retired` = closed or
   * taken down by the client (shown as a tag, never as a dead link);
   * `private` = client-confidential. A project with `liveUrl` is `live`.
   */
  readonly availability?: 'live' | 'retired' | 'private';
  readonly liveUrl?: string;
  readonly githubUrl?: string;
  readonly coverImage?: string;

  readonly filters: readonly string[];

  readonly challenge?: string;
  readonly solution?: string;

  readonly architecture?: readonly string[];

  readonly businessProblem?: string;
  readonly technicalGoals?: string;
  readonly role?: string;
  readonly roleDescription?: string;
  readonly duration?: string;
  readonly teamSize?: string;

  readonly capabilities?: readonly ProjectCapability[];

  readonly engineeringDecisions?: readonly EngineeringDecision[];

  readonly obstacles?: readonly EngineeringObstacle[];

  readonly metrics?: readonly ProjectMetric[];
  layout?: 'featured' | 'tall' | 'wide' | 'standard';
}
