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
  },

  wayne: {
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
  },
};
