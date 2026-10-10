import { Injectable, signal, computed } from '@angular/core';

import { PROJECTS } from '../data/projects.data';
import { Project } from '../models/project.model';

/** Flagship work first, then sites you can still visit, then retired client
 * work, with unbuilt concepts last. Array.sort is stable, so the authored order
 * is kept within each group. */
function displayRank(project: Project): number {
  if (project.featured) {
    return 0;
  }
  if (project.status === 'concept') {
    return 3;
  }
  return project.availability === 'live' ? 1 : 2;
}

const RANKED_PROJECTS: readonly Project[] = [...PROJECTS].sort(
  (a, b) => displayRank(a) - displayRank(b),
);

@Injectable({
  providedIn: 'root',
})
export class ProjectDataService {
  readonly selectedFilter = signal('All');

  readonly filteredProjects = computed(() => {
    const filter = this.selectedFilter();

    if (filter === 'All') {
      return RANKED_PROJECTS;
    }

    return RANKED_PROJECTS.filter((project) => project.filters.includes(filter));
  });

  getProjectBySlug(slug: string): Project | undefined {
    return PROJECTS.find((project) => project.slug === slug);
  }

  setFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }

  getFilters(): string[] {
    const filters = new Set<string>();

    PROJECTS.forEach((project) => {
      project.filters.forEach((filter) => {
        filters.add(filter);
      });
    });

    return ['All', ...Array.from(filters).sort()];
  }
}
