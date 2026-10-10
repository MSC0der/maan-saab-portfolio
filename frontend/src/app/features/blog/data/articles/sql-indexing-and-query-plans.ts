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
      'When a SQL query is slow, the cause is usually one of two things: the database is reading far more rows than it needs, or it is doing extra work (sorting, temporary tables) to produce the answer. Indexes and the query plan are how you see and fix both.',
    ),
    p(
      'The examples use MySQL, but the ideas carry over to PostgreSQL and most relational databases.',
    ),
  ),

  section(
    'Read the plan with EXPLAIN',
    p(
      'EXPLAIN shows how the database intends to run a query. In MySQL 8.0.18 and later, EXPLAIN ANALYZE also runs it and reports real timings and row counts.',
    ),
    code(
      'sql',
      `
EXPLAIN ANALYZE
SELECT id, total
FROM orders
WHERE customer_id = 4821 AND status = 'paid'
ORDER BY created_at DESC
LIMIT 20;`,
    ),
    table(
      ['What you see', 'What it means'],
      ['type: ALL', 'Full table scan: every row was read'],
      ['type: ref / range', 'An index was used to find matching rows'],
      ['key: NULL', 'No index was chosen'],
      ['rows (large) vs result (small)', 'The index is not selective, or the wrong index is used'],
      ['Using filesort / Using temporary', 'Extra work to sort or group that an index could often avoid'],
    ),
  ),

  section(
    'How a B-tree index helps',
    p(
      'Most indexes are B-trees: sorted structures that let the database jump to a value and then walk neighbouring entries in order. That is why an index can serve both a filter and an ORDER BY, and why it cannot help a condition it cannot navigate, such as a leading wildcard.',
    ),
    p(
      'The price is paid on writes. Every INSERT, UPDATE and DELETE must also maintain each index, so more indexes means faster reads and slower writes.',
    ),
  ),

  section(
    'Composite indexes and the leftmost prefix',
    p(
      'A composite index on (a, b, c) is sorted by a, then b within each a, then c. It can serve queries that filter on a, on a and b, or on a, b and c, but not on b alone. This is the leftmost-prefix rule.',
    ),
    code(
      'sql',
      `
-- Query: paid orders for a customer, newest first
CREATE INDEX idx_orders_customer_status_created
  ON orders (customer_id, status, created_at);

-- Equality columns first, then the sort column. The index can now
-- filter and return rows already ordered by created_at.
SELECT id, total
FROM orders
WHERE customer_id = 4821 AND status = 'paid'
ORDER BY created_at DESC
LIMIT 20;`,
      'Equality columns first, then the column you sort by',
    ),
    callout(
      'Column order is a decision',
      'Put equality columns first, then the sort or range column. A range condition stops later columns of the index from being used for filtering.',
    ),
  ),

  section(
    'Queries that quietly defeat an index',
    list(
      'Functions on the column: WHERE DATE(created_at) = "2026-10-01" cannot use an index on created_at. Rewrite as a range: created_at >= "2026-10-01" AND created_at < "2026-10-02".',
      'Leading wildcards: LIKE "%smith" scans everything. LIKE "smith%" can use an index.',
      'Type mismatches: comparing a string column with a number forces conversion and can disable the index.',
      'OR across different columns: often easier to express as UNION so each branch uses its own index.',
      'SELECT *: pulls every column, which prevents covering indexes and wastes bandwidth.',
    ),
    code(
      'sql',
      `
-- Slow: function wraps the indexed column
SELECT COUNT(*) FROM orders WHERE DATE(created_at) = '2026-10-01';

-- Fast: a range the index can navigate
SELECT COUNT(*) FROM orders
WHERE created_at >= '2026-10-01' AND created_at < '2026-10-02';`,
    ),
  ),

  section(
    'Cover the query',
    p(
      'A covering index contains every column the query needs, so the database answers from the index without touching the table. EXPLAIN shows this as "Using index".',
    ),
    code(
      'sql',
      `
CREATE INDEX idx_orders_cover ON orders (customer_id, status, total);

SELECT status, total FROM orders WHERE customer_id = 4821;
-- Extra: Using index  (no table lookups at all)`,
    ),
  ),

  section(
    'Joins and the N+1 trap',
    list(
      'Index the foreign key columns you join on. A join without an index on the joined side can degrade to a nested scan.',
      'Watch for N+1 queries: loading a list, then querying once per row. Fetch related rows in a single JOIN or an IN (...) query instead.',
      'Select only the columns you need from each side of the join.',
    ),
    code(
      'javascript',
      `
// N+1: one query for orders, then one per order
const orders = await db.query('SELECT * FROM orders WHERE customer_id = ?', [id]);
for (const o of orders) {
  o.items = await db.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
}

// Better: two queries total
const orders2 = await db.query('SELECT id, total FROM orders WHERE customer_id = ?', [id]);
const items = await db.query(
  'SELECT order_id, sku, qty FROM order_items WHERE order_id IN (?)',
  [orders2.map((o) => o.id)],
);`,
    ),
  ),

  section(
    'Paginate by key, not by OFFSET',
    p(
      'LIMIT 20 OFFSET 100000 makes the database read and throw away 100,000 rows before returning 20. Use keyset pagination: remember the last seen key and ask for rows after it.',
    ),
    code(
      'sql',
      `
-- Page 1
SELECT id, created_at, total FROM orders
WHERE customer_id = 4821
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- Next page, continuing after the last row you showed
SELECT id, created_at, total FROM orders
WHERE customer_id = 4821
  AND (created_at, id) < ('2026-09-30 12:00:00', 98122)
ORDER BY created_at DESC, id DESC
LIMIT 20;`,
    ),
  ),

  section(
    'Index hygiene',
    list(
      'Add an index because a measured query needs it, not just in case.',
      'Remove redundant indexes. An index on (a) is usually redundant if you also have (a, b).',
      'Review unused indexes periodically; they cost writes and storage for nothing.',
      'Re-run EXPLAIN after every change, and on realistic data. A plan on ten rows says little about ten million.',
    ),
  ),
];

export const SQL_INDEXING_ARTICLE: Article = {
  slug: 'sql-indexing-and-query-plans',
  title: 'SQL Indexing and Query Plans',
  excerpt:
    'Read EXPLAIN output, design composite and covering indexes, avoid the queries that defeat them, and paginate without OFFSET.',
  category: 'DATABASE',
  publishedAt: 'Jul 10, 2026',
  filters: ['Backend', 'SQL'],
  takeaways: [
    'Use EXPLAIN ANALYZE to see rows read versus rows returned.',
    'Composite indexes follow the leftmost-prefix rule.',
    'Functions and leading wildcards on a column defeat its index.',
    'Keyset pagination beats OFFSET on large tables.',
  ],
  tip: {
    label: 'PRO TIP',
    text: 'Test query plans against realistic data volumes; the optimiser behaves very differently on a tiny table.',
  },
  sections,
  readTime: estimateReadTime(sections),
};
