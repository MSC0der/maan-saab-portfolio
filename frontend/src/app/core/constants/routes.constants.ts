export const APP_ROUTES = {
  home: '',
  about: 'about',
  projects: 'projects',
  project: 'project',
  contact: 'contact',
  blog: 'blog',
} as const;

export const routePath = {
  home: '/',
  about: `/${APP_ROUTES.about}`,
  projects: `/${APP_ROUTES.projects}`,
  project: (slug: string) => `/${APP_ROUTES.project}/${slug}`,
  contact: `/${APP_ROUTES.contact}`,
  blog: `/${APP_ROUTES.blog}`,
} as const;