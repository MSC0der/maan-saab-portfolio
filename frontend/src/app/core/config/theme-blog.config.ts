import { ThemeType } from '../services/theme.service';

export interface ThemeBlogConfig {
  articleHero: {
    authorName: string;
    authorRole: string;
  };
  featuredArticle: {
    label: string;
    primaryButton: string;
    secondaryButton: string;
  };
  card: {
    readMoreLabel: string;
  };
  knowledgeDomains: {
    title: string;
  };
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    buttonLabel: string;
  };
  filterBar: {
    filters: string[];
  };
  articleCta: {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;

    stats: {
      value: string;
      label: string;
    }[];
  };
  relatedArticles: {
    title: string;
    description: string;
  };
  articleNewsletter: {
    eyebrow: string;
    title: string;
    description: string;
    placeholder: string;
    buttonLabel: string;
  };
}

export const THEME_BLOG_CONFIG: Record<ThemeType, ThemeBlogConfig> = {
  'technical-dark': {
    articleHero: {
      authorName: 'Ranbir Singh Maan',
      authorRole: 'Backend Architect & Security Consultant',
    },
    featuredArticle: {
      label: 'Featured Analysis',
      primaryButton: 'Read Article',
      secondaryButton: 'Bookmark',
    },
    card: {
      readMoreLabel: 'Read More →',
    },
    knowledgeDomains: {
      title: 'Core Knowledge Domains',
    },
    newsletter: {
      title: 'Stay Updated With New Engineering Articles',
      description:
        'Get occasional deep dives into backend architecture, security best practices and performance engineering.',
      placeholder: 'engineer@domain.com',
      buttonLabel: 'Subscribe',
    },
    filterBar: {
      filters: [
        'All',
        'Backend',
        'Node.js',
        'Angular',
        'MongoDB',
        'SQL',
        'Authentication',
        'System Design',
        'DSA',
      ],
    },
    articleCta: {
      title: 'Need Help Building Secure Systems?',
      description:
        'I help teams build scalable APIs, authentication systems, Angular applications and backend architectures.',
      primaryButton: 'View Projects',
      secondaryButton: 'Contact Me',
    },
    hero: {
      eyebrow: 'KNOWLEDGE HUB',

      title: 'Engineering Insights & Technical Articles',

      description:
        'Practical backend engineering, scalable architecture, authentication systems and production software lessons.',

      stats: [
        {
          value: '5+',
          label: 'Articles',
        },
        {
          value: '8+',
          label: 'Technologies',
        },
        {
          value: '2',
          label: 'Case Studies',
        },
        {
          value: '100%',
          label: 'Practical',
        },
      ],
    },
    relatedArticles: {
      title: 'Continue Reading',
      description:
        'More engineering insights on backend architecture, security, scalability and modern web development.',
    },
    articleNewsletter: {
      eyebrow: 'ENGINEERING INSIGHTS',

      title: 'Stay Updated With New Articles',

      description:
        'Backend engineering, architecture reviews, Angular development and production lessons delivered occasionally.',

      placeholder: 'engineer@domain.com',

      buttonLabel: 'Subscribe',
    },
  },
  wayne: {
    articleHero: {
      authorName: 'R. S. MAAN',
      authorRole: 'LEAD SYSTEMS OPERATIVE // BACKEND INFRASTRUCTURE',
    },
    featuredArticle: {
      label: 'PRIORITY INTELLIGENCE BRIEF',
      primaryButton: 'ACCESS REPORT',
      secondaryButton: 'ADD TO ARCHIVE',
    },
    card: {
      readMoreLabel: 'ACCESS REPORT →',
    },
    knowledgeDomains: {
      title: 'OPERATIONAL KNOWLEDGE BASE',
    },
    newsletter: {
      title: 'RECEIVE OPERATIONAL INTELLIGENCE UPDATES',
      description:
        'Periodic mission briefings covering architecture reviews, security protocols and engineering directives.',
      placeholder: 'wayne.tech@secure.channel',
      buttonLabel: 'ENROLL',
    },
    filterBar: {
      filters: [
        'ALL DOSSIERS',
        'BACKEND OPS',
        'NODE SYSTEMS',
        'ANGULAR UI',
        'DATA VAULTS',
        'SQL INTEL',
        'ACCESS CONTROL',
        'ARCHITECTURE',
        'ALGORITHMS',
      ],
    },
    articleCta: {
      title: 'REQUIRE ENGINEERING SUPPORT?',
      description:
        'Available for mission-critical backend systems, operational platforms, architecture reviews and secure application development.',
      primaryButton: 'VIEW DOSSIERS',
      secondaryButton: 'OPEN CHANNEL',
    },
    hero: {
      eyebrow: 'INTELLIGENCE ARCHIVE',

      title: 'OPERATIONAL REPORTS & ENGINEERING DOSSIERS',

      description:
        'Field notes, architecture reviews, deployment reports and engineering intelligence gathered from production systems.',

      stats: [
        {
          value: '5+',
          label: 'DOSSIERS',
        },
        {
          value: '8+',
          label: 'SYSTEMS',
        },
        {
          value: '2',
          label: 'OPERATIONS',
        },
        {
          value: '100%',
          label: 'FIELD TESTED',
        },
      ],
    },
    relatedArticles: {
      title: 'RELATED DOSSIERS',
      description:
        'Additional operational reports covering system architecture, security infrastructure and production engineering.',
    },
    articleNewsletter: {
      eyebrow: 'INTELLIGENCE BRIEFINGS',

      title: 'RECEIVE NEW DOSSIERS',

      description:
        'Operational reports, architecture reviews and engineering intelligence delivered through secure channels.',

      placeholder: 'operative@wayne-enterprises.com',

      buttonLabel: 'ENROLL',
    },
  },
};
