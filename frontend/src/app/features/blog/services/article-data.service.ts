import { Injectable } from '@angular/core';

import { ARTICLES } from '../data/articles.data';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleDataService {
  getArticle(slug: string): Article | undefined {
    return ARTICLES.find(
      article => article.slug === slug,
    );
  }
}