import { ThemeType } from '../services/theme.service';

export interface ThemeProjectsConfig {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
  };

  filters: {
    heading?: string;
  };

  cta: {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };

  overview: {
    contextLabel: string;
    ownershipLabel: string;
    businessProblemTitle: string;
    technicalGoalsTitle: string;
  };

  systemFlow: {
    title: string;
    description: string;
  };

  capabilities: {
    title: string;
    description: string;
  };

  security: {
    title: string;
    description: string;
  };

  engineeringReport: {
    title: string;
    description: string;
    challengeLabel: string;
    solutionLabel: string;
  };

  designReview: {
    title: string;
    description: string;
    rationaleLabel: string;
  };

  results: {
    title: string;
    description: string;
  };

  nextProject: {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
}

export const THEME_PROJECTS_CONFIG: Record<ThemeType, ThemeProjectsConfig> = {
  'technical-dark': {
    hero: {
      eyebrow: '',
      title: 'Projects & Engineering Case Studies',
      description:
        "A collection of systems, APIs, architectures and software solutions I've designed and built.",
      ctaLabel: 'View Work',
    },

    filters: {},

    cta: {
      title: 'Interested in the Architecture Behind These Systems?',
      description:
        'Explore the engineering decisions, scalability strategies and implementation details.',
      primaryButton: 'View Engineering Case Studies',
      secondaryButton: 'Contact Me',
    },

    overview: {
      contextLabel: 'Project Context',
      ownershipLabel: 'Project Ownership',
      businessProblemTitle: 'Business Problem',
      technicalGoalsTitle: 'Technical Goals',
    },

    systemFlow: {
      title: 'System Architecture Flow',
      description:
        'End-to-end request journey through the platform architecture, demonstrating how data flows across application layers.',
    },

    capabilities: {
      title: 'Core Capabilities',
      description:
        'The key architectural and engineering features that power this system.',
    },

    security: {
      title: 'Architecture Highlights',
      description:
        'Core engineering capabilities and platform foundations implemented throughout the system.',
    },

    engineeringReport: {
      title: 'Engineering Challenges & Solutions',
      description:
        'Critical technical obstacles encountered during implementation and the engineering decisions used to overcome them.',
      challengeLabel: 'Challenge',
      solutionLabel: 'Solution',
    },

    designReview: {
      title: 'Architecture Decision Records',
      description:
        'Key engineering decisions, trade-offs and architectural reasoning that shaped the implementation of this platform.',
      rationaleLabel: 'Decision Rationale',
    },

    results: {
      title: 'Results & Impact',
      description:
        'Key outcomes achieved through architectural improvements, security enhancements and engineering optimizations.',
    },

    nextProject: {
      title: 'Explore More Engineering Work',
      description:
        'Review additional projects, architectures and backend systems from my portfolio.',
      primaryButton: 'View All Projects',
      secondaryButton: 'Contact Me',
    },
  },

  'wayne': {
    hero: {
      eyebrow: 'SECTION 03 // ACTIVE OPERATIONS',
      title: 'MISSION DOSSIERS',
      description:
        'Production systems, enterprise platforms, APIs and infrastructure initiatives deployed in operational environments.',
      ctaLabel: 'ACCESS DOSSIERS',
    },

    filters: {},

    cta: {
      title: 'REQUEST ACCESS TO ENGINEERING DOSSIERS',
      description:
        'Detailed architectural reviews, deployment strategies and operational insights available upon request.',
      primaryButton: 'VIEW DOSSIERS',
      secondaryButton: 'OPEN CHANNEL',
    },

    overview: {
      contextLabel: 'MISSION CONTEXT',
      ownershipLabel: 'ASSIGNED OPERATIVE',
      businessProblemTitle: 'MISSION OBJECTIVE',
      technicalGoalsTitle: 'TACTICAL REQUIREMENTS',
    },

    systemFlow: {
      title: 'MISSION EXECUTION FLOW',
      description:
        'Operational request routing and data movement across mission-critical infrastructure.',
    },

    capabilities: {
      title: 'TACTICAL CAPABILITIES',
      description:
        'Core systems, controls and operational features deployed within the platform.',
    },

    security: {
      title: 'INFRASTRUCTURE HIGHLIGHTS',
      description:
        'Foundational engineering systems and operational safeguards supporting the mission.',
    },

    engineeringReport: {
      title: 'OPERATIONAL INCIDENT REPORTS',
      description:
        'Technical obstacles encountered during deployment and the strategies used to neutralize them.',
      challengeLabel: 'INCIDENT',
      solutionLabel: 'RESOLUTION',
    },

    designReview: {
      title: 'ARCHITECTURE DIRECTIVES',
      description:
        'Engineering decisions and architectural directives governing system implementation.',
      rationaleLabel: 'DIRECTIVE RATIONALE',
    },

    results: {
      title: 'MISSION OUTCOMES',
      description:
        'Measured operational impact and platform performance improvements.',
    },

    nextProject: {
      title: 'ACCESS ADDITIONAL DOSSIERS',
      description:
        'Review additional missions, architectures and operational systems from the archive.',
      primaryButton: 'VIEW DOSSIERS',
      secondaryButton: 'OPEN CHANNEL',
    },
  },
};
