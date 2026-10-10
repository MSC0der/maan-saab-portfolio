import { ConfiguredTheme, ThemeType } from '../services/theme.service';

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

const BASE_HEADER_CONFIG: Record<ConfiguredTheme, ThemeHeaderConfig> = {
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
};

/** Immersive Engineering Core keeps the standard brand + navigation labels; the
 * theme identity is expressed through the 3D home experience, not the chrome. */
export const THEME_HEADER_CONFIG: Record<ThemeType, ThemeHeaderConfig> = {
  ...BASE_HEADER_CONFIG,
  immersive: {
    ...BASE_HEADER_CONFIG['technical-dark'],
    brandName: 'MAAN SAAB',
  },
};
