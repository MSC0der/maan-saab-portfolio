import { Routes } from '@angular/router';

import { APP_ROUTES } from './core/constants/routes.constants';
import { STATIC_SEO } from './core/seo/seo.config';
import { projectSeoResolver } from './core/seo/seo.resolvers';

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
        data: { seo: STATIC_SEO.home },
      },
      {
        path: APP_ROUTES.about,
        loadChildren: () =>
          import('./features/about/about.routes').then((m) => m.ABOUT_ROUTES),
        data: { seo: STATIC_SEO.about },
      },
      {
        path: APP_ROUTES.projects,
        loadChildren: () =>
          import('./features/projects/projects.routes').then(
            (m) => m.PROJECTS_ROUTES,
          ),
        data: { seo: STATIC_SEO.projects },
      },
      {
        path: `${APP_ROUTES.project}/:slug`,
        loadComponent: () =>
          import('./features/projects/pages/project-case-study-page/project-case-study-page.component').then(
            (m) => m.ProjectCaseStudyPageComponent,
          ),
        resolve: { seo: projectSeoResolver },
      },
      {
        path: APP_ROUTES.blog,
        loadChildren: () =>
          import('./features/blog/blog.routes').then((m) => m.BLOG_ROUTES),
        data: { seo: STATIC_SEO.blog },
      },
      {
        path: APP_ROUTES.contact,
        loadChildren: () =>
          import('./features/contact/contact.routes').then(
            (m) => m.CONTACT_ROUTES,
          ),
        data: { seo: STATIC_SEO.contact },
      },
    ],
  },
  {
    path: '**',
    redirectTo: APP_ROUTES.home,
  },
];
