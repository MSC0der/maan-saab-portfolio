import { routePath } from '../../core/constants/routes.constants';
import { PROJECTS } from '../projects/data/projects.data';
import { Project } from '../projects/models/project.model';
import { ActiveProjectView, ProjectSpec } from './immersive.model';

/**
 * Angular-owned adapter: turns real portfolio data into the plain spatial specs
 * the Three.js world consumes. No fabrication — every value comes straight from
 * `PROJECTS`. The client / marketing sites on `/projects` are intentionally not
 * part of the immersive engineering world.
 */
const IMMERSIVE_PROJECT_SLUGS: readonly string[] = [
  'security-compliance-system',
  'garage-management-system',
  'real-time-chat-platform',
  'scalable-url-shortener',
  'event-booking-platform',
  'stock-market-dashboard',
  'maan-saab-portfolio',
];

function selectedProjects(): readonly Project[] {
  return IMMERSIVE_PROJECT_SLUGS.map((slug) =>
    PROJECTS.find((project) => project.slug === slug),
  ).filter((project): project is Project => project !== undefined);
}

/** Cluster placement + labels for the Three.js builder. */
export function buildImmersiveProjectSpecs(): ProjectSpec[] {
  return selectedProjects().map((project) => ({
    id: project.slug,
    title: project.title,
    category: project.category,
    accent: project.status === 'concept' ? 'violet' : 'cyan',
    nodes: (project.architecture && project.architecture.length > 0
      ? project.architecture
      : project.technologies
    ).slice(0, 5),
  }));
}

/** Inspector view-models keyed by project id, for the HTML overlay. */
export function buildImmersiveProjectViews(): Map<string, ActiveProjectView> {
  const views = new Map<string, ActiveProjectView>();
  for (const project of selectedProjects()) {
    views.set(project.slug, {
      id: project.slug,
      title: project.title,
      category: project.category,
      summary: project.summary,
      role: project.role ?? null,
      architecture: project.architecture ?? [],
      technologies: project.technologies,
      routePath: routePath.project(project.slug),
    });
  }
  return views;
}
