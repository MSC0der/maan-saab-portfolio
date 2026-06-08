import { SocialLink } from '../types/navigation.types';

export interface SiteConfig {
  readonly brandName: string;
  readonly ownerName: string;
  readonly role: string;
  readonly description: string;
  readonly socialLinks: readonly SocialLink[];
}

export const SITE_CONFIG: SiteConfig = {
  brandName: 'MAAN SAAB',
  ownerName: 'Ranbir Singh Maan',
  role: 'Backend-Focused Full Stack Engineer',
  description:
    'Technical engineering portfolio focused on backend systems, Angular architecture, and production-ready full stack applications.',
  socialLinks: [
    {
      label: 'GitHub',
      url: 'https://github.com/',
    },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/',
    },
  ],
};
