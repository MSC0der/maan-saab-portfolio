// blog.routes.ts

import { Routes } from '@angular/router';
export const BLOG_ROUTES: Routes = [
  
  {
    path: '',
    loadComponent: () =>
      import('./pages/blog-page/blog-page.component').then(
        (m) => m.BlogPageComponent,
      ),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./pages/blog-article-page/blog-article-page.component').then(
        (m) => m.BlogArticlePageComponent,
      ),
  },
];
