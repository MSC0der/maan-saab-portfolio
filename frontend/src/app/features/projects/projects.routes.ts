import { Routes } from '@angular/router';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/projects-page/projects-page.component').then(
        (m) => m.ProjectsPageComponent,
      ),
  },

  {
    path: ':slug',
    loadComponent: () =>
      import(
        './pages/project-case-study-page/project-case-study-page.component'
      ).then((m) => m.ProjectCaseStudyPageComponent),
  },
];