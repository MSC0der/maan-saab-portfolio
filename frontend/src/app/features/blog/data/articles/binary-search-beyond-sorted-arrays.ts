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
      'Binary search is usually taught as "find a number in a sorted array", and then forgotten until an interview. Its real power is broader: any time you can ask a yes/no question whose answer flips exactly once as a value increases, you can binary search for the flip point.',
    ),
    p(
      'This article builds the reliable template, then applies it to problems where there is no array to search at all.',
    ),
  ),

  section(
    'A template that avoids off-by-one bugs',
    p(
      'Most binary search bugs come from fuzzy boundaries. The version I trust keeps a clear invariant: the answer always lies in [lo, hi), and each step shrinks that range.',
    ),
    code(
      'javascript',
      `
// First index i where nums[i] >= target (nums sorted ascending).
// Returns nums.length if every element is smaller.
function lowerBound(nums, target) {
  let lo = 0;
  let hi = nums.length;            // half-open range [lo, hi)

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);   // avoids overflow in other languages
    if (nums[mid] >= target) {
      hi = mid;                    // mid could be the answer, keep it
    } else {
      lo = mid + 1;                // mid is too small, discard it
    }
  }
  return lo;
}`,
      'lower_bound: the foundation for most variants',
    ),
    list(
      'Invariant: everything left of lo is too small, and everything from hi onward is acceptable.',
      'The loop ends when lo === hi, and that single index is the answer.',
      'Searching for an exact value is lowerBound plus one check: nums[i] === target.',
    ),
    table(
      ['Goal', 'How'],
      ['First element >= x', 'lowerBound(nums, x)'],
      ['First element > x', 'lowerBound(nums, x + 1) for integers'],
      ['Does x exist?', 'i = lowerBound(nums, x); i < n && nums[i] === x'],
      ['Count of x', 'lowerBound(x + 1) - lowerBound(x)'],
    ),
  ),

  section(
    'Search the answer, not the array',
    p(
      'Here is the generalisation. If you can write a function feasible(x) that is false below some threshold and true at and above it, then the smallest feasible x can be found by binary search, even when x is not an index.',
    ),
    callout(
      'The test',
      'Is the feasibility monotonic? If x works, does every larger x also work? If yes, binary search applies.',
    ),
    code(
      'javascript',
      `
// Smallest x in [lo, hi] for which feasible(x) is true.
function smallestFeasible(lo, hi, feasible) {
  hi += 1;                           // search the half-open range [lo, hi + 1)
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (feasible(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    ),
  ),

  section(
    'Worked example: ship packages within D days',
    p(
      'Packages with given weights must be shipped in order, and a ship carries at most "capacity" per day. What is the minimum capacity that ships everything within D days?',
    ),
    p(
      'Brute force would try every capacity. But feasibility is monotonic: if a capacity works, any larger one works too. The capacity cannot be lower than the heaviest package, nor higher than the total weight, so we binary search that range.',
    ),
    code(
      'javascript',
      `
function shipWithinDays(weights, days) {
  const daysNeeded = (capacity) => {
    let d = 1;
    let load = 0;
    for (const w of weights) {
      if (load + w > capacity) { d++; load = 0; }
      load += w;
    }
    return d;
  };

  const lo = Math.max(...weights);                  // must fit the heaviest item
  const hi = weights.reduce((a, b) => a + b, 0);    // one ship, one day
  return smallestFeasible(lo, hi, (c) => daysNeeded(c) <= days);
}

shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5); // 15`,
      'Binary search over capacity, with a greedy feasibility check',
    ),
    p(
      'Complexity is O(n log S), where n is the number of packages and S is the sum of the weights, instead of O(n x S) for trying every capacity.',
    ),
  ),

  section(
    'Another shape: rotated sorted arrays',
    p(
      'A sorted array rotated at some pivot, like [4, 5, 6, 7, 0, 1, 2], is no longer globally sorted, but at every step at least one half is. Decide which half is sorted, check whether the target lies in it, and discard the other.',
    ),
    code(
      'javascript',
      `
function searchRotated(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;

    if (nums[lo] <= nums[mid]) {                 // left half is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                     // right half is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
    ),
    p('This one uses a closed range [lo, hi]. Either style works; the skill is picking one and keeping the invariant consistent.'),
  ),

  section(
    'Pitfalls and a checklist',
    list(
      'Mixing closed [lo, hi] and half-open [lo, hi) conventions inside one loop is the most common source of infinite loops.',
      'mid = (lo + hi) / 2 can overflow in languages with fixed-size integers; use lo + (hi - lo) / 2.',
      'When searching an answer space, make sure your bounds really contain the answer and that the predicate is monotonic.',
      'Floating-point binary search needs a fixed iteration count (say 60 to 100) instead of lo < hi.',
    ),
    table(
      ['Before you code, ask', 'Typical answer'],
      ['What is the search space?', 'Indexes, or a range of candidate answers'],
      ['What is the yes/no question?', 'feasible(x) or nums[mid] >= target'],
      ['Does it flip exactly once?', 'It must, or binary search does not apply'],
      ['What does each step discard?', 'Half the space, which gives O(log n) steps'],
    ),
  ),
];

export const BINARY_SEARCH_ARTICLE: Article = {
  slug: 'binary-search-beyond-sorted-arrays',
  title: 'Binary Search Beyond Sorted Arrays',
  excerpt:
    'A bug-resistant template, then binary search on the answer: minimum shipping capacity, rotated arrays and the monotonic test that tells you when it applies.',
  category: 'ALGORITHMS',
  publishedAt: 'Jun 26, 2026',
  filters: ['DSA'],
  takeaways: [
    'Keep one invariant: the answer lives in [lo, hi).',
    'Binary search works on any monotonic yes/no question.',
    'Search the answer space when there is no array to index.',
    'Pick closed or half-open ranges and never mix them.',
  ],
  tip: {
    label: 'PRO TIP',
    text: 'If you cannot state what the loop invariant is, write that down before writing the loop.',
  },
  sections,
  readTime: estimateReadTime(sections),
};
