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
      'Angular is fast by default, and slow in recognisable ways: components that re-render more than they need to, bundles that ship everything up front, and heavy work that runs on the main thread. Most of the wins below are small, local changes.',
    ),
    p(
      'The examples target Angular 17 and later, using standalone components, signals and the built-in control flow.',
    ),
  ),

  section(
    'Measure before you change anything',
    list(
      'Lighthouse and the Chrome Performance panel show the user-facing cost: LCP, Total Blocking Time and long tasks.',
      'Angular DevTools has a profiler that shows which components run change detection and how long each takes.',
      'Build with --stats-json and open the result in a bundle analyser to see what is in your initial chunk.',
    ),
    code(
      'bash',
      `
ng build --configuration production --stats-json
# open dist/<app>/stats.json in an analyser such as esbuild's bundle size analyzer`,
    ),
    p(
      'Optimising without a baseline is guesswork. Write down the numbers first so you know which change helped.',
    ),
  ),

  section(
    'Use OnPush and signals',
    p(
      'By default Angular checks every component on every event. With ChangeDetectionStrategy.OnPush a component is only checked when an input changes, an event fires inside it, or a signal it reads changes. Signals make this natural, because a template that reads a signal is updated precisely when that signal does.',
    ),
    code(
      'typescript',
      `
@Component({
  selector: 'app-project-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    @for (project of visible(); track project.slug) {
      <app-project-card [project]="project" />
    }
  \`,
})
export class ProjectListComponent {
  private readonly all = input.required<Project[]>();
  protected readonly filter = signal('All');

  // Recomputed only when \`all\` or \`filter\` changes
  protected readonly visible = computed(() =>
    this.filter() === 'All'
      ? this.all()
      : this.all().filter((p) => p.filters.includes(this.filter())),
  );
}`,
      'OnPush with computed state',
    ),
    callout(
      'Avoid calling functions in templates',
      'A method call in a template runs on every change-detection pass. Derive values with computed() or pure pipes so the work is cached.',
    ),
  ),

  section(
    'Track list items',
    p(
      'Without a stable identity Angular re-creates DOM for the whole list when the array changes. The @for block makes tracking mandatory, which is a good thing.',
    ),
    code(
      'html',
      `
@for (article of articles(); track article.slug) {
  <app-blog-card [article]="article" />
} @empty {
  <p>No articles yet.</p>
}`,
      'Track by a stable key, not by index',
    ),
  ),

  section(
    'Split the bundle: lazy routes and @defer',
    p(
      'The fastest code is code the user never downloads. Lazy-load route trees, and use @defer for heavy components that are not needed for first paint.',
    ),
    code(
      'typescript',
      `
export const routes: Routes = [
  {
    path: 'projects',
    loadChildren: () =>
      import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
  },
];`,
      'A lazy route tree',
    ),
    code(
      'html',
      `
@defer (on viewport) {
  <app-heavy-chart [data]="data()" />
} @placeholder {
  <div class="chart-skeleton"></div>
}`,
      'Defer until it scrolls into view',
    ),
    p(
      'On this portfolio the 3D scene sits behind @defer, so its libraries load as a separate chunk and never touch the initial bundle.',
    ),
  ),

  section(
    'Serve images properly',
    p(
      'Images are usually the heaviest thing on the page. Convert screenshots to WebP or AVIF, size them to how they are displayed, and lazy-load anything below the fold. NgOptimizedImage enforces much of this.',
    ),
    code(
      'html',
      `
<img ngSrc="images/projects/dashboard.webp" width="1200" height="720" priority />
<img ngSrc="images/projects/chat.webp" width="1200" height="720" />`,
      'priority for the LCP image, lazy for the rest',
    ),
    p(
      'Converting this portfolio\'s project screenshots from PNG to WebP took them from about 14 MB to under 1 MB with no visible loss.',
    ),
  ),

  section(
    'Keep animation and heavy loops out of the zone',
    p(
      'Zone.js triggers change detection after every async event, including each requestAnimationFrame tick. An animation library running inside the zone can cause a full check per frame. Run it outside Angular and re-enter only when state actually changes.',
    ),
    code(
      'typescript',
      `
constructor(private zone: NgZone) {}

startAnimation() {
  this.zone.runOutsideAngular(() => {
    gsap.to(this.el, {
      x: 200,
      duration: 1,
      onComplete: () => this.zone.run(() => this.done.set(true)),
    });
  });
}`,
      'Animate outside the zone, update state inside it',
    ),
  ),

  section(
    'Quick reference',
    table(
      ['Symptom', 'Likely fix'],
      ['Slow first load', 'Lazy routes, @defer, smaller images, analyse the bundle'],
      ['Janky interactions', 'OnPush, signals, remove template function calls'],
      ['Large lists feel slow', 'track keys, virtual scrolling (CDK) for very long lists'],
      ['CPU spikes during animation', 'runOutsideAngular for the animation loop'],
      ['Poor LCP', 'Preload the hero image, serve WebP, avoid render-blocking fonts'],
    ),
    p(
      'Server-side rendering with hydration can further improve perceived performance, but it adds complexity, so reach for it once the basics above are in place.',
    ),
  ),
];

export const ANGULAR_PERFORMANCE_ARTICLE: Article = {
  slug: 'angular-performance-tips',
  title: 'Angular Performance Tips',
  excerpt:
    'OnPush and signals, @defer and lazy routes, image handling and keeping animation out of the zone: measurable fixes for faster Angular apps.',
  category: 'FRONTEND',
  publishedAt: 'Sep 04, 2026',
  filters: ['Angular'],
  takeaways: [
    'Measure first, then change one thing at a time.',
    'OnPush plus signals avoids needless re-rendering.',
    'Lazy routes and @defer keep the initial bundle small.',
    'Run animation loops outside the Angular zone.',
  ],
  tip: {
    label: 'PRO TIP',
    text: 'Preload your LCP image and mark it priority; lazy-load everything below it.',
  },
  sections,
  readTime: estimateReadTime(sections),
};
