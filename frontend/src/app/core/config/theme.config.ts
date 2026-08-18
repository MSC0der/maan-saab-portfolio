import { ThemeType } from '../services/theme.service';

export interface ThemeHeaderConfig {
  brandName: string;
  resumeLabel: string;

  navigation: {
    home: string;
    projects: string;
    about: string;
    blog: string;
    contact: string;
  };
}

export const THEME_HEADER_CONFIG: Record<ThemeType, ThemeHeaderConfig> = {
  'technical-dark': {
    brandName: 'MAAN SAAB',
    resumeLabel: 'Resume',

    navigation: {
      home: 'Home',
      projects: 'Projects',
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
    },
  },

  wayne: {
    brandName: 'WAYNE TECH DIVISION',
    resumeLabel: 'AUTHORIZED ACCESS',

    navigation: {
      home: 'DOSSIER',
      projects: 'MISSIONS',
      about: 'ARSENAL',
      blog: 'OPERATIONS',
      contact: 'SECURE CHANNEL',
    },
  },

  // pristine: {
  //   brandName: '3D WEBSITE',
  //   resumeLabel: 'know me',

  //   navigation: {
  //     home: 'DOSSIER',
  //     projects: 'MISSIONS',
  //     about: 'ARSENAL',
  //     blog: 'OPERATIONS',
  //     contact: 'SECURE CHANNEL',
  //   },
  // },
};
