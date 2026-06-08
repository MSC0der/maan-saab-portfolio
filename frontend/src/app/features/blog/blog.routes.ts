// blog.routes.ts

import { Routes } from '@angular/router';
console.log('BLOG ARTICLE PAGE LOADED');
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
