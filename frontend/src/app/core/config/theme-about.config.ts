import { ThemeType } from '../services/theme.service';

export interface ThemeAboutConfig {
  hero: {
    title: string;
    description: string;
    ctaLabel: string;
    imageAlt: string;
  };
  timeline: {
    title: string;
    description: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    description: string;
  };
  expertise: {
    title: string;
    description: string;
  };
}

export const THEME_ABOUT_CONFIG: Record<ThemeType, ThemeAboutConfig> = {
  'technical-dark': {
    hero: {
      title: 'Building Software That Solves Real Problems',
      description:
        'I am a Backend-Focused Full Stack Engineer specializing in secure APIs, scalable systems, and robust backend architecture. My approach prioritizes clarity, performance, and building systems that can handle real-world demands gracefully.',
      ctaLabel: 'View Work',
      imageAlt: 'Technical backend architecture diagram',
    },
    timeline: {
      title: 'Engineering Journey',
      description:
        'The path from student developer to backend-focused software engineer.',
    },
    experience: {
      eyebrow: 'Production Engineering',
      title: 'Experience Building Production Systems',
      description:
        'Building secure, scalable, and maintainable software architecture used in high-stakes real-world business environments at Imminent Ideas.',
    },
    expertise: {
      title: 'Technical Expertise',
      description:
        'Technologies and engineering disciplines I use to design, build and maintain production-grade software systems.',
    },
  },

  wayne: {
    hero: {
      title: 'Building Software That Solves Real Problems',
      description:
        'Backend-focused engineer specializing in secure APIs, scalable infrastructure and operational software systems designed for production environments.',
      ctaLabel: 'View Work',
      imageAlt: 'Wayne Division systems architecture',
    },
    timeline: {
      title: 'CAREER TIMELINE',
      description:
        'Operational history documenting progression through training, deployment and engineering assignments.',
    },
    experience: {
      eyebrow: 'ACTIVE DEPLOYMENT RECORD',
      title: 'FIELD EXPERIENCE REPORT',
      description:
        'Operational experience developing secure infrastructure, authentication systems, APIs and enterprise-grade platforms for production environments.',
    },
    expertise: {
      title: 'TACTICAL SPECIALIZATIONS',
      description:
        'Engineering domains, technologies and operational competencies utilized throughout mission deployments.',
    },
  },
};
