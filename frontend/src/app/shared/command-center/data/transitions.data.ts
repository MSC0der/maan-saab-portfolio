import { TransitionType } from '../services/transition.service';

export interface TransitionOption {
  id: TransitionType;

  title: string;

  description: string;

  icon: string;

  available: boolean;
}

export const TRANSITIONS: readonly TransitionOption[] = [
  {
    id: 'scan',
    title: 'Digital Scan',
    description: 'Classic engineering scan.',
    icon: 'radar',
    available: true,
  },
  {
    id: 'wayne',
    title: 'Wayne Protocol',
    description: 'Enterprise boot animation.',
    icon: 'security',
    available: true,
  },
  {
    id: 'glitch',
    title: 'Matrix Glitch',
    description: 'Digital corruption effect.',
    icon: 'bug_report',
    available: true,
  },
  {
    id: 'fade',
    title: 'Fade',
    description: 'Smooth dissolve.',
    icon: 'blur_on',
    available: true,
  },
  {
    id: 'instant',
    title: 'Instant',
    description: 'No transition.',
    icon: 'bolt',
    available: true,
  },
];
