// Verifies every project `liveUrl` still responds. Run: npm run check:links
// A client site that goes offline should be marked `availability: 'retired'`
// (and its liveUrl removed) in projects.data.ts, never left as a dead button.
import { readFileSync } from 'node:fs';

const DATA = new URL(
  '../src/app/features/projects/data/projects.data.ts',
  import.meta.url,
);
const source = readFileSync(DATA, 'utf8');
const urls = [...source.matchAll(/liveUrl:\s*'([^']+)'/g)].map((m) => m[1]);

const TIMEOUT_MS = 20000;
const ATTEMPTS = 3;

async function probe(url) {
  let lastError = 'unknown error';
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'user-agent': 'Mozilla/5.0 (portfolio-link-check)' },
      });
      if (res.ok) {
        return { ok: true, detail: String(res.status) };
      }
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = err?.cause?.code ?? err?.name ?? String(err);
    }
  }
  return { ok: false, detail: lastError };
}

const results = await Promise.all(
  urls.map(async (url) => ({ url, ...(await probe(url)) })),
);

for (const r of results) {
  console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${r.url}  (${r.detail})`);
}

const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.error(
    `\n${failed.length} link(s) failed. If a client site is permanently closed, ` +
      `remove its liveUrl and set availability: 'retired'.`,
  );
  process.exit(1);
}
console.log(`\nAll ${results.length} project links respond.`);
