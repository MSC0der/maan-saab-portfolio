import { Article } from '../models/article.model';
import { ANGULAR_PERFORMANCE_ARTICLE } from './articles/angular-performance-tips';
import { BINARY_SEARCH_ARTICLE } from './articles/binary-search-beyond-sorted-arrays';
import { BUILDING_RBAC_ARTICLE } from './articles/building-rbac-in-express';
import { JWT_VS_SESSION_ARTICLE } from './articles/jwt-vs-session-authentication';
import { MONGODB_QUERY_OPTIMIZATION_ARTICLE } from './articles/mongodb-query-optimization';
import { REDIS_CACHING_ARTICLE } from './articles/redis-caching-strategies';
import { SCALABLE_REST_APIS_ARTICLE } from './articles/designing-scalable-rest-apis';
import { SQL_INDEXING_ARTICLE } from './articles/sql-indexing-and-query-plans';

/** Newest first. Add a new article by creating its file and listing it here. */
export const ARTICLES: readonly Article[] = [
  JWT_VS_SESSION_ARTICLE,
  BUILDING_RBAC_ARTICLE,
  ANGULAR_PERFORMANCE_ARTICLE,
  MONGODB_QUERY_OPTIMIZATION_ARTICLE,
  SCALABLE_REST_APIS_ARTICLE,
  REDIS_CACHING_ARTICLE,
  SQL_INDEXING_ARTICLE,
  BINARY_SEARCH_ARTICLE,
];

/**
 * Canonical topic list. The order mirrors each theme's `filterBar.filters`
 * labels, which are matched to these by position.
 */
export const BLOG_FILTERS: readonly string[] = [
  'All',
  'Backend',
  'Node.js',
  'Angular',
  'MongoDB',
  'SQL',
  'Authentication',
  'System Design',
  'DSA',
];
