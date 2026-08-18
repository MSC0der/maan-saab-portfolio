import { ThemeType } from '../../../core/services/theme.service';

export interface ThemeOption {
  id: ThemeType;

  title: string;

  subtitle: string;

  description: string;

  icon: string;

  available: boolean;

  accent: string;
}
