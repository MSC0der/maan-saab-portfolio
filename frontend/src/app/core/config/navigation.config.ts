import { routePath } from '../constants/routes.constants';
import { NavigationItem } from '../types/navigation.types';

export const PRIMARY_NAVIGATION: readonly NavigationItem[] = [
  {
    label: 'Home',
    path: routePath.home,
    exact: true,
  },
  {
    label: 'About',
    path: routePath.about,
    exact: false,
  },
  {
    label: 'Projects',
    path: routePath.projects,
    exact: false,
  },
  {
    label: 'Blog',
    path: routePath.blog,
    exact: false,
  },
  {
    label: 'Contact',
    path: routePath.contact,
    exact: false,
  },
];
