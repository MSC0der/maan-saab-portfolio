// Generates, from the same data the app renders:
//   - sitemap.xml (written to public/ so it is committed, and to dist/)
//   - one static HTML shell per route (dist/.../project/<slug>/index.html etc.)
//     with that route's own <title>, description, canonical and Open Graph tags,
//     so LinkedIn / WhatsApp / Slack previews and non-JS crawlers see the right
//     page instead of the homepage. The Angular app boots normally on each shell.
// Runs automatically after `npm run build`. Run `npm run seo` after editing
// project or article data to refresh public/sitemap.xml.
import { build } from 'esbuild';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'dist', 'frontend', 'browser');
const tmpFile = join(root, 'node_modules', '.cache', 'seo-routes.mjs');

await build({
  entryPoints: [join(root, 'src/app/core/seo/seo-routes.ts')],
  outfile: tmpFile,
  bundle: true,
  format: 'esm',
  platform: 'node',
  logLevel: 'error',
});
const { SEO_ROUTES, SITE_URL } = await import(pathToFileURL(tmpFile).href);
rmSync(tmpFile, { force: true });

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const urlOf = (path) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);

function sitemap() {
  const entries = SEO_ROUTES.filter((r) => !r.noindex).map((r) => {
    const lastmod = r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : '';
    return `  <url><loc>${urlOf(r.path)}</loc>${lastmod}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}

const xml = sitemap();
writeFileSync(join(root, 'public', 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${SEO_ROUTES.length} URLs (public/)`);

if (process.argv.includes('--sitemap-only')) {
  process.exit(0);
}

if (!existsSync(join(outDir, 'index.html'))) {
  console.error(`No build found at ${outDir}. Run \`npm run build\` first.`);
  process.exit(1);
}
writeFileSync(join(outDir, 'sitemap.xml'), xml);

const template = readFileSync(join(outDir, 'index.html'), 'utf8');

function shell(r) {
  const url = urlOf(r.path);
  let html = template;
  const swap = (pattern, replacement) => {
    if (!pattern.test(html)) {
      throw new Error(`index.html is missing the tag matching ${pattern} for ${r.path}`);
    }
    html = html.replace(pattern, () => replacement);
  };

  swap(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`);
  swap(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(r.description)}">`);
  swap(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  swap(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="${r.type ?? 'website'}">`);
  swap(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(r.title)}">`);
  swap(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(r.description)}">`);
  swap(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  swap(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(r.title)}">`);
  swap(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(r.description)}">`);

  if (r.jsonLd) {
    const ld = `<script type="application/ld+json" id="route-json-ld">${JSON.stringify(r.jsonLd).replace(/</g, '\u003c')}</script>\n</head>`;
    html = html.replace('</head>', () => ld);
  }
  return html;
}

let written = 0;
for (const r of SEO_ROUTES) {
  if (r.path === '/') {
    continue; // the root index.html already carries the homepage tags
  }
  const dir = join(outDir, ...r.path.split('/').filter(Boolean));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), shell(r));
  written++;
}
console.log(`static route shells: ${written} written to dist/frontend/browser`);
