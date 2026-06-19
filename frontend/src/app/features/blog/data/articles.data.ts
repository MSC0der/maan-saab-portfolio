import { Article } from '../models/article.model';

export const ARTICLES: readonly Article[] = [
  {
    slug: 'jwt-vs-session-authentication',
    title: 'JWT vs Session Authentication',
    excerpt:
      'A comparative analysis of stateful vs stateless authentication strategies in modern web apps.',
    category: 'AUTHENTICATION',
    readTime: '8 min read',
    publishedAt: 'Sep 12, 2023',
    featured: true,

    heroTitle: 'JWT vs Session Authentication: Choosing the Right Strategy',

    content: [
      'Authentication is one of the most critical components of any modern application.',
      'Session-based authentication stores user information on the server and relies on session identifiers.',
      'JWT authentication stores signed user claims inside tokens and enables stateless authentication.',
      'JWTs scale better across distributed systems because they remove server-side session storage.',
      'Session authentication provides easier revocation and tighter server-side control.',
      'Choosing between JWT and Sessions depends on application architecture and scalability requirements.',
    ],
    metrics: [
      {
        value: '99%',
        label: 'Security Confidence',
      },
      {
        value: 'O(1)',
        label: 'JWT Validation',
      },
      {
        value: 'Stateless',
        label: 'Scaling Profile',
      },
      {
        value: 'HttpOnly',
        label: 'Best Practice',
      },
    ],
  },
  {
    slug: 'building-rbac-in-express',
    title: 'Building RBAC in Express.js',
    excerpt:
      'Middleware patterns for securing large-scale Express applications with dynamic roles.',
    category: 'BACKEND',
    readTime: '15 min read',
    publishedAt: 'Aug 28, 2023',
  },
  {
    slug: 'mongodb-query-optimization',
    title: 'MongoDB Query Optimization',
    excerpt:
      'Techniques for indexing and aggregation pipelines to reduce latency by 60%.',
    category: 'DATABASE',
    readTime: '10 min read',
    publishedAt: 'Jul 15, 2023',
  },
  {
    slug: 'angular-performance-tips',
    title: 'Angular Performance Tips',
    excerpt:
      'OnPush change detection, lazy loading, and SSR strategies for blazing-fast SPAs.',
    category: 'FRONTEND',
    readTime: '12 min read',
    publishedAt: 'Jun 30, 2023',
  },
  {
    slug: 'designing-scalable-rest-apis',
    title: 'Designing Scalable REST APIs',
    excerpt:
      'Evolution from monolith to microservices using contract-first design with OpenAPI.',
    category: 'ARCHITECTURE',
    readTime: '20 min read',
    publishedAt: 'May 14, 2023',
  },
  {
    slug: 'redis-caching-strategies',
    title: 'Redis Caching Strategies',
    excerpt:
      'How to implement write-through vs write-behind cache patterns for global apps.',
    category: 'INFRA',
    readTime: '9 min read',
    publishedAt: 'Apr 02, 2023',
  },
];
