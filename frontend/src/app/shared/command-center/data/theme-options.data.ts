import { ThemeOption } from '../models/theme-option.model';

export const THEME_OPTIONS: readonly ThemeOption[] = [
  {
    id: 'technical-dark',
    title: 'Technical Workspace',
    subtitle: 'Production Engineering',
    description:
      'High-density engineering interface built for backend systems and production workflows.',
    icon: 'dark_mode',
    available: true,
    accent: '#10b981',
  },

  {
    id: 'wayne',
    title: 'Wayne Division',
    subtitle: 'Enterprise Intelligence',
    description:
      'Enterprise command center focused on intelligence reports and mission dossiers.',
    icon: 'security',
    available: true,
    accent: '#d4af37',
  },

  {
    id: 'immersive',
    title: 'Engineering Core',
    subtitle: 'Immersive System',
    description:
      'A living 3D engineering system — technology nodes, connections and data flow around a procedural core.',
    icon: 'blur_on',
    available: true,
    accent: '#22d3ee',
  },
];
