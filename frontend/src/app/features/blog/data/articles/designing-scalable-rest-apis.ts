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
      'An API is a contract that outlives the code behind it. Clients (web apps, mobile apps, other teams) build on its quirks, so decisions made in week one are still there in year three. Most "scalability" problems in REST APIs are really design problems: unbounded lists, ambiguous errors and unsafe retries.',
    ),
    p(
      'These are the design rules I apply early, because they are cheap on day one and expensive to retrofit.',
    ),
  ),

  section(
    'Model resources and be consistent',
    list(
      'Use plural nouns for collections: /orders, /orders/42, /orders/42/items.',
      'Let the HTTP method carry the verb: GET reads, POST creates, PUT replaces, PATCH changes part of a resource, DELETE removes it.',
      'Return the right status: 201 with a Location header on create, 204 for empty success, 404 for missing, 409 for conflicts, 422 for validation failures.',
      'Pick one naming convention for fields (camelCase or snake_case) and never mix them.',
    ),
    p(
      'Consistency matters more than any individual choice. A client developer should be able to guess the next endpoint correctly.',
    ),
  ),

  section(
    'Paginate every list from day one',
    p(
      'An endpoint that returns "all orders" works until the table grows, and then it becomes your slowest route and your biggest payload. Never ship an unbounded list. Prefer cursor pagination: it stays fast on deep pages and stays stable while data changes.',
    ),
    code(
      'javascript',
      `
// GET /orders?limit=20&after=eyJpZCI6MTAyfQ
app.get('/orders', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100); // hard cap
  const after = decodeCursor(req.query.after);                // { id: 102 } or null

  const rows = await db.orders.findAfter(after, limit + 1);   // fetch one extra
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;

  res.json({
    data: page,
    next: hasMore ? encodeCursor({ id: page.at(-1).id }) : null,
  });
});`,
      'Cursor pagination with a capped page size',
    ),
  ),

  section(
    'Make retries safe with idempotency keys',
    p(
      'Networks fail after the server has done the work but before the client hears about it. The client retries, and now you have charged a card or created an order twice. GET, PUT and DELETE are idempotent by definition. POST is not, so make it so with an Idempotency-Key header.',
    ),
    code(
      'javascript',
      `
app.post('/payments', async (req, res) => {
  const key = req.get('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key required' });

  const seen = await idempotency.get(key);
  if (seen) return res.status(seen.status).json(seen.body); // replay the stored result

  const result = await payments.charge(req.body);
  await idempotency.save(key, { status: 201, body: result }, { ttlHours: 24 });
  res.status(201).json(result);
});`,
      'Store the first result and replay it on retries',
    ),
    callout(
      'Where it matters most',
      'Payments, order creation and anything that sends email or SMS. If doing it twice would hurt, require a key.',
    ),
  ),

  section(
    'Return errors clients can act on',
    p(
      'A bare 500 with a string is hard to handle. A consistent error shape lets clients show the right message and lets you debug from a support ticket. RFC 9457 defines a standard "problem details" format.',
    ),
    code(
      'json',
      `
{
  "type": "https://api.example.com/problems/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "email must be a valid address",
  "instance": "/users",
  "requestId": "req_9f2c1d",
  "errors": [{ "field": "email", "message": "must be a valid address" }]
}`,
      'Content-Type: application/problem+json',
    ),
    p(
      'Always include a request id, and log it server-side. Never leak stack traces or internal messages to the client.',
    ),
  ),

  section(
    'Protect the API: validation and rate limits',
    list(
      'Validate at the edge with a schema (Zod, Joi or similar), so handlers only ever see well-formed data.',
      'Rate-limit per key or per IP, and respond with 429 and a Retry-After header.',
      'Cap payload sizes and page sizes. Unbounded input is an outage waiting to happen.',
      'Use timeouts on every outbound call so one slow dependency cannot exhaust your workers.',
    ),
    code(
      'javascript',
      `
import { z } from 'zod';

const CreateUser = z.object({
  email: z.string().email(),
  role: z.enum(['viewer', 'analyst']),
});

const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json(problem(parsed.error));
  req.body = parsed.data; // downstream code gets clean, typed data
  next();
};`,
    ),
  ),

  section(
    'Cache with ETags and plan for change',
    p(
      'Conditional requests save bandwidth and server work: return an ETag, and answer a matching If-None-Match with 304 Not Modified and no body.',
    ),
    table(
      ['Concern', 'Practice'],
      ['Caching', 'ETag or Last-Modified plus Cache-Control for public, rarely-changing data'],
      ['Versioning', 'Version in the path (/v1) or a header; only break a version on purpose'],
      ['Evolution', 'Add fields freely, never remove or repurpose one without a new version'],
      ['Documentation', 'Write the OpenAPI contract first, then generate clients and validators'],
    ),
    p(
      'Contract-first design pays off twice: front-end and back-end teams can work in parallel against the same document, and tests can check that the implementation never drifts from it.',
    ),
  ),

  section(
    'A launch checklist',
    list(
      'Every collection endpoint is paginated and has a hard cap.',
      'Unsafe operations accept an idempotency key.',
      'Errors share one shape and include a request id.',
      'Input is validated at the boundary; outputs never leak internals.',
      'Rate limits, timeouts and payload limits are set.',
      'The OpenAPI document matches what is deployed.',
    ),
  ),
];

export const SCALABLE_REST_APIS_ARTICLE: Article = {
  slug: 'designing-scalable-rest-apis',
  title: 'Designing Scalable REST APIs',
  excerpt:
    'Pagination, idempotency keys, consistent error shapes and contract-first design: the decisions that keep an API healthy as traffic and clients grow.',
  category: 'ARCHITECTURE',
  publishedAt: 'Aug 07, 2026',
  filters: ['Backend', 'System Design', 'Node.js'],
  takeaways: [
    'Paginate every list and cap the page size.',
    'Use idempotency keys so retries cannot duplicate work.',
    'Return one consistent, documented error shape.',
    'Write the OpenAPI contract first.',
  ],
  tip: {
    label: 'PRO TIP',
    text: 'Add a request id to every response and log it. It turns a vague support ticket into a one-line search.',
  },
  sections,
  readTime: estimateReadTime(sections),
};
