import { ConfiguredTheme, ThemeType } from '../services/theme.service';

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
    titleLines: string[];

    /** Labels only; the numbers are computed from the real articles. */
    stats: {
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
    buttonLabel: string;
  };
}

const BASE_BLOG_CONFIG: Record<ConfiguredTheme, ThemeBlogConfig> = {
  'technical-dark': {
    articleHero: {
      authorName: 'Ranbir Singh Maan',
      authorRole: 'Backend-Focused Full Stack Engineer',
    },
    featuredArticle: {
      label: 'Featured Analysis',
      primaryButton: 'Read Article',
      secondaryButton: 'Browse all articles',
    },
    card: {
      readMoreLabel: 'ACCESS REPORT',
    },
    knowledgeDomains: {
      title: 'Core Knowledge Domains',
    },
    newsletter: {
      title: 'New articles, as they are published',
      description:
        'Short, practical write-ups on backend architecture, security and performance. Follow on LinkedIn to see new posts first.',
      buttonLabel: 'Follow on LinkedIn',
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

      titleLines: ['Engineering Insights', '& Technical Articles'],

      stats: [
        { label: 'Articles' },
        { label: 'Topics' },
        { label: 'Minutes of reading' },
        { label: 'Latest post' },
      ],
    },
    relatedArticles: {
      title: 'Continue Reading',
      description:
        'More engineering insights on backend architecture, security, scalability and modern web development.',
    },
    articleNewsletter: {
      eyebrow: 'ENGINEERING INSIGHTS',

      title: 'Enjoyed this? More is on the way',

      description:
        'I publish practical notes on backend architecture, authentication and performance. Follow on LinkedIn to catch the next one.',

      buttonLabel: 'Follow on LinkedIn',
    },
  },
  wayne: {
    articleHero: {
      authorName: 'R. S. MAAN',
      authorRole: 'LEAD SYSTEMS OPERATIVE // BACKEND INFRASTRUCTURE',
    },
    featuredArticle: {
      label: 'PRIORITY INTELLIGENCE BRIEF',
      primaryButton: 'READ DOSSIER',
      secondaryButton: 'BROWSE ARCHIVE',
    },
    card: {
      readMoreLabel: 'READ DOSSIER',
    },
    knowledgeDomains: {
      title: 'OPERATIONAL KNOWLEDGE BASE',
    },
    newsletter: {
      title: 'FOLLOW THE FIELD NOTES',
      description:
        'New dossiers on architecture, security and performance are filed regularly. Follow on LinkedIn to receive them first.',
      buttonLabel: 'FOLLOW',
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

      titleLines: ['OPERATIONAL REPORTS', '&', 'ENGINEERING DOSSIERS'],

      description:
        'Field notes, architecture reviews, deployment reports and engineering intelligence gathered from production systems.',

      stats: [
        { label: 'DOSSIERS' },
        { label: 'DOMAINS' },
        { label: 'MINUTES OF INTEL' },
        { label: 'LAST FILED' },
      ],
    },
    relatedArticles: {
      title: 'RELATED DOSSIERS',
      description:
        'Additional operational reports covering system architecture, security infrastructure and production engineering.',
    },
    articleNewsletter: {
      eyebrow: 'INTELLIGENCE BRIEFINGS',

      title: 'FOLLOW FOR NEW DOSSIERS',

      description:
        'Operational reports and architecture reviews as they are filed. Follow on LinkedIn to see them first.',

      buttonLabel: 'FOLLOW',
    },
  },
};

/** Immersive Engineering Core reuses the technical-dark Blog content. */
export const THEME_BLOG_CONFIG: Record<ThemeType, ThemeBlogConfig> = {
  ...BASE_BLOG_CONFIG,
  immersive: BASE_BLOG_CONFIG['technical-dark'],
};
