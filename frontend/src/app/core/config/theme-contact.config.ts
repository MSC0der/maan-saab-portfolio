import { ThemeType } from '../services/theme.service';

export interface ThemeContactConfig {
  availability: {
    title: string;
    responseTime: string;

    items: {
      label: string;
      value: string;
    }[];
  };
  directLinks: {
    title: string;

    links: {
      label: string;
      value: string;
      href?: string;
    }[];
  };
  focusAreas: {
    title: string;

    areas: {
      number: string;
      title: string;
    }[];
  };
  sidebarCta: {
    title: string;
    description: string;
    terminalText: string;
  };
  contactForm: {
    title: string;

    fields: {
      name: string;
      email: string;
      company: string;
      projectType: string;
      budget: string;
      message: string;
    };

    placeholders: {
      name: string;
      email: string;
      company: string;
      budget: string;
      message: string;
    };

    projectTypes: string[];

    submitButton: string;
  };
}

export const THEME_CONTACT_CONFIG: Record<ThemeType, ThemeContactConfig> = {
  'technical-dark': {
    availability: {
      title: 'Available Now',
      responseTime: 'Typically replies within 24 hours.',

      items: [
        {
          label: 'Full-Time',
          value: 'Open',
        },
        {
          label: 'Freelance / Contract',
          value: 'Open',
        },
        {
          label: 'Remote',
          value: 'Preferred',
        },
      ],
    },
    directLinks: {
      title: 'Connect Directly',

      links: [
        {
          label: 'Email',
          value: 'contact@maansaab.com',
          href: 'mailto:contact@maansaab.com',
        },
        {
          label: 'LinkedIn',
          value: '/in/ranbirsinghmaan',
          href: 'https://linkedin.com/in/ranbirsinghmaan',
        },
        {
          label: 'GitHub',
          value: '/maansaab',
          href: 'https://github.com/maansaab',
        },
        {
          label: 'Location',
          value: 'India',
        },
      ],
    },
    focusAreas: {
      title: 'Focus Areas',

      areas: [
        {
          number: '01',
          title: 'Software Engineer Roles',
        },
        {
          number: '02',
          title: 'Full Stack Development',
        },
        {
          number: '03',
          title: 'Backend Architecture',
        },
        {
          number: '04',
          title: 'Freelance Projects',
        },
        {
          number: '05',
          title: 'Technical Consulting',
        },
        {
          number: '+',
          title: 'Open to Discuss',
        },
      ],
    },
    sidebarCta: {
      title: 'Ready to Architect Your Next Solution?',
      description:
        "Seeking partnerships for high-impact engineering projects. Let's discuss your system's scalability and performance requirements today.",
      terminalText: 'maan_saab@production_ready:~$',
    },
    contactForm: {
      title: 'Technical Inquiry',

      fields: {
        name: 'Name',
        email: 'Email',
        company: 'Company',
        projectType: 'Project Type',
        budget: 'Budget (Optional)',
        message: 'Message',
      },

      placeholders: {
        name: 'John Doe',
        email: 'john@company.com',
        company: 'Engineering Corp',
        budget: 'e.g. $5k - $10k',
        message: 'Tell me about your technical challenges...',
      },

      projectTypes: [
        'Software Engineer Role',
        'Full Stack Development',
        'Backend Architecture',
        'Technical Consulting',
      ],

      submitButton: 'Send Message',
    },
  },
  wayne: {
    availability: {
      title: 'COMMAND CENTER STATUS',
      responseTime: 'SYSTEM LOAD: 88%',

      items: [
        {
          label: 'NODE STATUS',
          value: 'ONLINE',
        },
        {
          label: 'SECURE CHANNEL',
          value: 'ACTIVE',
        },
        {
          label: 'ENCRYPTION',
          value: 'AES-256',
        },
        {
          label: 'LATENCY',
          value: '12MS',
        },
        {
          label: 'UPTIME',
          value: '99.998%',
        },
      ],
    },
    directLinks: {
      title: 'AUTHORIZED CONTACT METHODS',

      links: [
        {
          label: 'SECURE EMAIL CHANNEL',
          value: 'contact@maansaab.com',
          href: 'mailto:contact@maansaab.com',
        },
        {
          label: 'LINKEDIN NETWORK',
          value: '/in/ranbirsinghmaan',
          href: 'https://linkedin.com/in/ranbirsinghmaan',
        },
        {
          label: 'GITHUB REPOSITORY',
          value: '/maansaab',
          href: 'https://github.com/maansaab',
        },
        {
          label: 'OPERATIONAL REGION',
          value: 'INDIA',
        },
      ],
    },
    focusAreas: {
      title: 'CORE SERVICE DOSSIERS',

      areas: [
        {
          number: '01',
          title: 'Enterprise Applications',
        },
        {
          number: '02',
          title: 'Full Stack Development',
        },
        {
          number: '03',
          title: 'Backend Architecture',
        },
        {
          number: '04',
          title: 'API Engineering',
        },
      ],
    },
    sidebarCta: {
      title: 'READY TO DEPLOY YOUR NEXT SYSTEM?',
      description:
        'Operational planning, architecture reviews and mission-critical engineering support available through secure channels.',
      terminalText: 'wayne_ops@batcave:~$',
    },
    contactForm: {
      title: 'MISSION BRIEFING',

      fields: {
        name: 'OPERATIVE NAME',
        email: 'SECURE EMAIL',
        company: 'ORGANIZATION',
        projectType: 'MISSION TYPE',
        budget: 'RESOURCE ALLOCATION',
        message: 'MISSION DETAILS',
      },

      placeholders: {
        name: 'Bruce Wayne',
        email: 'wayne@wayneenterprises.com',
        company: 'Wayne Enterprises',
        budget: '$50k - $100k',
        message: 'Provide operational requirements...',
      },

      projectTypes: [
        'Enterprise Application',
        'Backend Architecture',
        'API Engineering',
        'Technical Consultation',
      ],

      submitButton: 'TRANSMIT BRIEFING',
    },
  },
};
