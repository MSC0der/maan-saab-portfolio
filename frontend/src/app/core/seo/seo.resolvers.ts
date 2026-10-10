import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ArticleDataService } from '../../features/blog/services/article-data.service';
import { ProjectDataService } from '../../features/projects/services/project-data.service';
import { SeoConfig, articleSeo, notFoundSeo, projectSeo } from './seo.config';

export const projectSeoResolver: ResolveFn<SeoConfig> = (route) => {
  const slug = route.paramMap.get('slug') ?? '';
  const project = inject(ProjectDataService).getProjectBySlug(slug);
  return project
    ? projectSeo(project)
    : notFoundSeo('Project', `/project/${slug}`);
};

export const articleSeoResolver: ResolveFn<SeoConfig> = (route) => {
  const slug = route.paramMap.get('slug') ?? '';
  const article = inject(ArticleDataService).getArticle(slug);
  return article
    ? articleSeo(article)
    : notFoundSeo('Article', `/blog/${slug}`);
};
