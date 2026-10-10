import { Article } from '../../models/article.model';
import {
  callout,
  code,
  estimateReadTime,
  intro,
  list,
  p,
  section,
  table,
} from './article-blocks';

const sections = [
  intro(
    p(
      'A cache trades freshness for speed. Done well, it takes load off your database and cuts response times. Done carelessly, it serves stale data, hides bugs and, when it fails, takes the whole system down with it.',
    ),
    p(
      'This article covers the patterns that matter in a Node.js backend using Redis: how data gets in, how it leaves, and what goes wrong on the way.',
    ),
  ),

  section(
    'Start by deciding what to cache',
    p(
      'Cache data that is expensive to compute or fetch, read far more often than it changes, and tolerant of being slightly out of date. Reference data, product listings, permission lookups and rendered fragments qualify. Per-user financial balances, or anything where staleness is a bug, usually do not.',
    ),
    p(
      'Measure before adding one. A cache is another moving part with its own failure modes, and a query that is slow because it lacks an index should get the index, not a cache.',
    ),
  ),

  section(
    'Cache-aside: the default',
    p(
      'In cache-aside (also called lazy loading) the application owns the logic. It checks the cache first, falls back to the database on a miss, and then writes the result back with a TTL.',
    ),
    code(
      'javascript',
      `
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

export async function getProduct(id) {
  const key = \`product:v1:\${id}\`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const product = await db.products.findById(id);   // miss: go to the source
  if (product) {
    await redis.set(key, JSON.stringify(product), 'EX', 300);
  }
  return product;
}`,
      'Cache-aside with a 5 minute TTL',
    ),
    list(
      'Only data that is actually requested ends up cached.',
      'A cache outage degrades to slower reads, not an outage, as long as you handle the error.',
      'The first request after expiry is slow, and a cold cache after a deploy can be slow for everyone.',
    ),
  ),

  section(
    'Write-through and write-behind',
    p(
      'These two patterns move the work to the write path instead.',
    ),
    table(
      ['Pattern', 'How it works', 'Trade-off'],
      [
        'Write-through',
        'Every write updates the database and the cache together',
        'Reads are always warm and fresh; writes are slower and you cache data nobody reads',
      ],
      [
        'Write-behind',
        'Writes go to the cache and are flushed to the database asynchronously',
        'Very fast writes, but data can be lost if the cache dies before the flush',
      ],
      [
        'Cache-aside',
        'Reads populate the cache; writes invalidate it',
        'Simple and resilient, with a brief stale window',
      ],
    ),
    callout(
      'A word on write-behind',
      'It is powerful for high-volume counters or analytics, and risky for anything you cannot afford to lose. Treat the queue between cache and database as a critical component, not a detail.',
    ),
  ),

  section(
    'Invalidation is the hard part',
    p(
      'The old joke is that there are two hard problems in computer science, and cache invalidation is one of them. Keep it simple:',
    ),
    list(
      'Prefer short TTLs for data you cannot invalidate precisely.',
      'On a write, delete the key (or update it) in the same code path that changed the data.',
      'Version your keys, as in product:v1:42, so a schema change is a deploy, not a flush.',
      'For derived data, store a version number and include it in the key so a bump invalidates everything at once.',
    ),
    code(
      'javascript',
      `
export async function updateProduct(id, patch) {
  const product = await db.products.update(id, patch);
  await redis.del(\`product:v1:\${id}\`);   // next read repopulates it
  return product;
}`,
    ),
  ),

  section(
    'Survive the stampede',
    p(
      'When a popular key expires, hundreds of requests can miss at once and hit the database simultaneously, exactly when it is least able to cope. Three defences work well together:',
    ),
    list(
      'Add jitter to TTLs so keys written together do not all expire together.',
      'Use a short lock so only one request recomputes while the rest wait or serve stale data.',
      'Serve stale while revalidating: return the old value and refresh in the background.',
    ),
    code(
      'javascript',
      `
const ttl = (base) => base + Math.floor(Math.random() * base * 0.2); // +0-20% jitter

export async function getWithLock(key, loader) {
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);

  const lockKey = \`lock:\${key}\`;
  const got = await redis.set(lockKey, '1', 'EX', 10, 'NX'); // only one winner

  if (!got) {                       // someone else is rebuilding it
    await new Promise((r) => setTimeout(r, 100));
    return getWithLock(key, loader);
  }

  try {
    const value = await loader();
    await redis.set(key, JSON.stringify(value), 'EX', ttl(300));
    return value;
  } finally {
    await redis.del(lockKey);
  }
}`,
      'A simple single-flight lock with jitter',
    ),
  ),

  section(
    'Design keys and plan for failure',
    list(
      'Use a readable, namespaced pattern: <entity>:<version>:<id>[:<variant>].',
      'Set a TTL on almost everything, and set maxmemory with an eviction policy such as allkeys-lru.',
      'Wrap Redis calls in timeouts and treat errors as a cache miss, so a Redis incident never becomes an application incident.',
      'Do not store huge values. Large blobs increase latency and memory pressure for every client.',
      'Track hit ratio. A cache with a low hit ratio is added cost without benefit.',
    ),
    code(
      'javascript',
      `
async function safeGet(key) {
  try {
    return await Promise.race([
      redis.get(key),
      new Promise((_, reject) => setTimeout(() => reject(new Error('redis timeout')), 50)),
    ]);
  } catch {
    return null; // treat as a miss; the database is the source of truth
  }
}`,
      'Fail open: the cache is an optimisation, never a dependency',
    ),
  ),

  section(
    'Choosing a strategy',
    list(
      'Default to cache-aside with short TTLs and delete-on-write.',
      'Use write-through when reads must never see stale data and you can afford slower writes.',
      'Use write-behind only for loss-tolerant, write-heavy data like counters.',
      'Add jitter and locking as soon as a single key is hot enough to hurt when it expires.',
    ),
  ),
];

export const REDIS_CACHING_ARTICLE: Article = {
  slug: 'redis-caching-strategies',
  title: 'Redis Caching Strategies',
  excerpt:
    'Cache-aside, write-through and write-behind compared, plus TTL jitter, stampede protection and failing open so a cache outage never becomes yours.',
  category: 'INFRA',
  publishedAt: 'Jul 24, 2026',
  filters: ['Backend', 'System Design', 'Node.js'],
  takeaways: [
    'Default to cache-aside with TTLs and delete-on-write.',
    'Write-behind is fast but can lose data.',
    'Jitter and locks prevent cache stampedes.',
    'Treat the cache as an optimisation: fail open.',
  ],
  tip: {
    label: 'PRO TIP',
    text: 'Version your cache keys (product:v1:42). A schema change then becomes a deploy, not a manual flush.',
  },
  sections,
  readTime: estimateReadTime(sections),
};
