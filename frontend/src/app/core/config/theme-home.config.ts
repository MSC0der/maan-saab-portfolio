import { ThemeType } from '../services/theme.service';

export interface ThemeHomeConfig {
  hero: {
    preTitle: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
  };

  aboutPreview: {
    eyebrow: string;
    title: string;
    description: string;
  };

  projects: {
    eyebrow: string;
    title: string;
    description: string;
  };

  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };

  status: {
    label: string;
    text: string;
    highlight: string;
  };

  heroActions: {
    primary: string;
    secondary: string;
    ghost: string;
  };
}

export const THEME_HOME_CONFIG: Record<ThemeType, ThemeHomeConfig> = {
  'technical-dark': {
    hero: {
      preTitle: 'Ranbir Singh Maan',
      titleLine1: 'Backend-Focused',
      titleHighlight: 'Full Stack Engineer',
      description:
        'I build secure APIs, scalable backend systems, authentication workflows, and modern web applications using Node.js and Angular.',
    },
    aboutPreview: {
      eyebrow: '',
      title: 'Turning Complex Business Requirements into Scalable Software',
      description:
        'With a deep focus on backend architecture, I specialize in translating high-level business goals into robust, maintainable, and high-performance technical solutions.',
    },
    projects: {
      eyebrow: '',
      title: 'Featured Projects',
      description:
        "A selection of production systems I've architected and delivered.",
    },
    cta: {
      eyebrow: '',
      title: "Let's Build Something Amazing Together",
      description:
        'Available for new opportunities and consulting on complex backend architecture.',
      primaryButton: 'Hire Me',
      secondaryButton: 'Get In Touch',
    },
    status: {
      label: 'Professional Status',
      highlight: 'Full Stack Developer at Imminent Ideas',
      text: 'Building secure APIs, authentication systems, payment integrations, cron jobs and scalable backend workflows.',
    },
    heroActions: {
      primary: 'View Projects',
      secondary: 'Download Resume',
      ghost: 'Contact Me',
    },
  },

  wayne: {
    hero: {
      preTitle: 'ACCESS GRANTED // SESSION ACTIVE',
      titleLine1: 'RANBIR SINGH',
      titleHighlight: 'MAAN',
      description:
        'Building scalable software systems, enterprise applications, APIs, and digital infrastructure designed for real-world production environments.',
    },
    aboutPreview: {
      eyebrow: 'SECTION 02 // PERSONNEL DOSSIER',
      title: 'CLASSIFIED ENGINEERING DOSSIER',
      description:
        'Enterprise application architect focused on scalable APIs, distributed systems, authentication frameworks, and production-grade software infrastructure.',
    },
    projects: {
      eyebrow: 'SECTION 03 // ACTIVE OPERATIONS',

      title: 'MISSION DOSSIERS',

      description:
        'Production systems, enterprise platforms, and infrastructure initiatives deployed in operational environments.',
    },
    cta: {
      eyebrow: 'SECTION 04 // RECRUITMENT CHANNEL',
      title: 'AUTHORIZED COLLABORATION PROTOCOL',
      description:
        'Available for enterprise engagements, mission-critical software development, and strategic engineering initiatives.',
      primaryButton: 'INITIATE CONTACT',
      secondaryButton: 'OPEN CHANNEL',
    },
    status: {
      label: 'CURRENT ASSIGNMENT',
      highlight: 'FULL STACK ENGINEER // IMMINENT IDEAS',
      text: 'Developing enterprise APIs, authentication frameworks, payment infrastructure, automation services, and mission-critical backend systems.',
    },
    heroActions: {
      primary: 'VIEW MISSIONS',
      secondary: 'ACCESS DOSSIER',
      ghost: 'OPEN CHANNEL',
    },
  },
};
