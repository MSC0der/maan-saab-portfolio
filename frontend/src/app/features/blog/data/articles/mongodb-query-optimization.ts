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
      'Slow MongoDB queries almost always come down to the same thing: the database examines far more documents than it returns. The fix is rarely clever. It is measuring the query, then giving it an index shaped like the question you are asking.',
    ),
    p(
      'This is the workflow I follow: read the plan, build the right compound index, keep aggregation pipelines lean, and stop paginating with skip.',
    ),
  ),

  section(
    'Measure first with explain()',
    p(
      'Before touching an index, look at what the query does today. explain("executionStats") runs the query and reports how much work it took.',
    ),
    code(
      'javascript',
      `
db.orders
  .find({ status: 'paid', customerId: 4821 })
  .sort({ createdAt: -1 })
  .explain('executionStats');`,
      'Run it in mongosh or Compass',
    ),
    p('Three fields in the output tell most of the story:'),
    table(
      ['Field', 'What to look for'],
      ['winningPlan.stage', 'COLLSCAN means a full collection scan; IXSCAN means an index was used'],
      ['totalDocsExamined vs nReturned', 'Should be close. A ratio of thousands to one means a missing or poorly shaped index'],
      ['executionTimeMillis', 'Your baseline to compare against after the change'],
    ),
    callout(
      'Watch for in-memory sorts',
      'A SORT stage in the plan means MongoDB sorted results in memory because no index delivered them in order. On large result sets that is slow and can hit the memory limit.',
    ),
  ),

  section(
    'Shape the index: Equality, Sort, Range',
    p(
      'For compound indexes, field order matters more than which fields you include. A reliable rule is ESR: put equality fields first, then the sort field, then range fields.',
    ),
    code(
      'javascript',
      `
// Query: paid orders for one customer, newest first, in a date window
db.orders.find({
  status: 'paid',                          // equality
  customerId: 4821,                        // equality
  createdAt: { $gte: start, $lt: end },    // range
}).sort({ createdAt: -1 });                // sort

// ESR index: equality, equality, then the sort/range field
db.orders.createIndex({ status: 1, customerId: 1, createdAt: -1 });`,
      'An index that serves the filter and the sort together',
    ),
    p(
      'Because the index already stores createdAt in the order requested, MongoDB walks it and returns documents sorted, with no in-memory sort stage.',
    ),
  ),

  section(
    'Cover the query when you can',
    p(
      'A covered query is answered from the index alone, without fetching documents. It needs every filtered and returned field to be in the index, and the _id excluded from the projection unless it is indexed too.',
    ),
    code(
      'javascript',
      `
db.orders.createIndex({ customerId: 1, status: 1, total: 1 });

db.orders.find(
  { customerId: 4821, status: 'paid' },
  { _id: 0, status: 1, total: 1 },
);
// explain: totalDocsExamined is 0, the index answered everything`,
    ),
    p(
      'Even when a query cannot be fully covered, projecting only the fields you need cuts network and deserialisation cost, especially for wide documents.',
    ),
  ),

  section(
    'Keep aggregation pipelines lean',
    p(
      'Aggregation stages run in order and each one passes its output on. The cheapest pipeline reduces the data as early as possible.',
    ),
    list(
      'Put $match first, and let it use an index, so later stages see fewer documents.',
      'Follow with $project or $unset to drop fields you will not use.',
      'Put $sort next to the $match so a matching index can supply the order.',
      '$lookup is a join and can be expensive. Index the foreign field, and match before you look up.',
      'Use allowDiskUse only as a safety net, not as a design.',
    ),
    code(
      'javascript',
      `
db.orders.aggregate([
  { $match: { status: 'paid', createdAt: { $gte: start } } }, // index-backed
  { $project: { customerId: 1, total: 1 } },                  // slim the docs
  { $group: { _id: '$customerId', revenue: { $sum: '$total' } } },
  { $sort: { revenue: -1 } },
  { $limit: 20 },
]);`,
    ),
  ),

  section(
    'Paginate without skip',
    p(
      'skip(n) does not jump to position n; it walks and discards n documents. Deep pages get slower linearly, and under writes the pages drift. Range-based pagination uses the index to start exactly where the last page ended.',
    ),
    code(
      'javascript',
      `
// First page
db.orders.find({ customerId: 4821 }).sort({ createdAt: -1, _id: -1 }).limit(20);

// Next page: continue after the last item you returned
db.orders
  .find({
    customerId: 4821,
    $or: [
      { createdAt: { $lt: last.createdAt } },
      { createdAt: last.createdAt, _id: { $lt: last._id } }, // tie-breaker
    ],
  })
  .sort({ createdAt: -1, _id: -1 })
  .limit(20);`,
      'Keyset pagination with a tie-breaker',
    ),
  ),

  section(
    'Schema habits that cost you later',
    list(
      'Unbounded arrays: a document that grows forever eventually hits the 16 MB limit and gets slower to read and write. Reference instead of embedding when a list can grow without bound.',
      'Embedding versus referencing: embed data that is read together and changes together, reference data that is shared or large.',
      'Over-indexing: every index speeds reads and slows writes. Drop indexes nothing uses.',
      'Low-selectivity indexes: an index on a boolean rarely helps by itself. Make it the leading field of a compound index only if queries filter on it.',
    ),
  ),

  section(
    'Find the slow queries in production',
    p(
      'You cannot optimise what you cannot see. Turn on the profiler for slow operations and review it regularly.',
    ),
    code(
      'javascript',
      `
// Log operations slower than 100 ms
db.setProfilingLevel(1, { slowms: 100 });

// Slowest recent operations
db.system.profile.find().sort({ millis: -1 }).limit(5);

// Which indexes are never used?
db.orders.aggregate([{ $indexStats: {} }]);`,
    ),
    p(
      'On managed clusters, Atlas Performance Advisor surfaces the same information and suggests indexes. Treat the suggestions as leads to verify with explain(), not changes to apply blindly.',
    ),
  ),

  section(
    'A short checklist',
    list(
      'Run explain("executionStats") and compare docs examined to docs returned.',
      'Build compound indexes in Equality, Sort, Range order.',
      'Project only what you need, and cover the query where it is cheap to do so.',
      'Filter early in aggregations and index the fields you $lookup on.',
      'Paginate by key, not by skip.',
      'Measure again after the change, so you know it helped.',
    ),
  ),
];

export const MONGODB_QUERY_OPTIMIZATION_ARTICLE: Article = {
  slug: 'mongodb-query-optimization',
  title: 'MongoDB Query Optimization',
  excerpt:
    'A practical workflow: read the explain plan, build compound indexes with the ESR rule, keep aggregations lean and replace skip-based pagination.',
  category: 'DATABASE',
  publishedAt: 'Aug 21, 2026',
  filters: ['Backend', 'MongoDB'],
  takeaways: [
    'Compare documents examined to documents returned.',
    'Order compound indexes Equality, Sort, Range.',
    'Filter early in aggregation pipelines.',
    'Paginate with a key, not skip().',
  ],
  tip: {
    label: 'PRO TIP',
    text: 'Always re-run explain() after adding an index. Confirm the planner chose it and that the work actually went down.',
  },
  sections,
  readTime: estimateReadTime(sections),
};
