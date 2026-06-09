import { Injectable, signal, computed } from '@angular/core';

import { PROJECTS } from '../data/projects.data';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectDataService {
  readonly selectedFilter = signal('All');

  readonly filteredProjects = computed(() => {
    const filter = this.selectedFilter();

    if (filter === 'All') {
      return PROJECTS;
    }

    return PROJECTS.filter((project) => project.filters.includes(filter));
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
