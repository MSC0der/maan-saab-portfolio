// blog.routes.ts

import { Routes } from '@angular/router';

import { articleSeoResolver } from '../../core/seo/seo.resolvers';
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
    resolve: { seo: articleSeoResolver },
    loadComponent: () =>
      import('./pages/blog-article-page/blog-article-page.component').then(
        (m) => m.BlogArticlePageComponent,
      ),
  },
];
