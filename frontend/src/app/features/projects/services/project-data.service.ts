import { Injectable } from '@angular/core';

import { PROJECTS } from '../data/projects.data';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectDataService {
  getProjects(): readonly Project[] {
    return PROJECTS;
  }

  getProjectBySlug(slug: string): Project | undefined {
    return PROJECTS.find((project) => project.slug === slug);
  }
}
