import { Routes } from '@angular/router';

import { APP_ROUTES } from './core/constants/routes.constants';

export const routes: Routes = [
  {
    path: APP_ROUTES.home,
    loadComponent: () =>
      import('./core/layout/shell/shell.component').then(
        (m) => m.ShellComponent,
      ),
    children: [
      {
        path: APP_ROUTES.home,
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
        title: 'MAAN SAAB | Backend-Focused Full Stack Engineer',
      },
      {
        path: APP_ROUTES.about,
        loadChildren: () =>
          import('./features/about/about.routes').then((m) => m.ABOUT_ROUTES),
        title: 'About | MAAN SAAB',
      },
      {
        path: APP_ROUTES.projects,
        loadChildren: () =>
          import('./features/projects/projects.routes').then(
            (m) => m.PROJECTS_ROUTES,
          ),
        title: 'Projects | MAAN SAAB',
      },
      {
        path: `${APP_ROUTES.project}/:slug`,
        loadComponent: () =>
          import('./features/projects/pages/project-case-study-page/project-case-study-page.component').then(
            (m) => m.ProjectCaseStudyPageComponent,
          ),
        title: 'Project Case Study | MAAN SAAB',
      },
      {
        path: APP_ROUTES.blog,
        loadChildren: () =>
          import('./features/blog/blog.routes').then((m) => m.BLOG_ROUTES),
        title: 'Blog | MAAN SAAB',
      },
      {
        path: APP_ROUTES.contact,
        loadChildren: () =>
          import('./features/contact/contact.routes').then(
            (m) => m.CONTACT_ROUTES,
          ),
        title: 'Contact | MAAN SAAB',
      },
    ],
  },
  {
    path: '**',
    redirectTo: APP_ROUTES.home,
  },
];
