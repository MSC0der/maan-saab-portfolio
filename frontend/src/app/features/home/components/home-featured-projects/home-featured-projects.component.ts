import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_HOME_CONFIG } from '../../../../core/config/theme-home.config';
import { HomeCardComponent } from '../home-card/home-card.component';
import { PROJECTS } from '../../../projects/data/projects.data';
import { HomeTechChipComponent } from '../home-tech-chip/home-tech-chip.component';

interface FeaturedProject {
  readonly title: string;
  readonly summary: string;
  readonly visualLabel: string;
  readonly technologies: readonly string[];
  readonly slug: string;
  readonly coverImage?: string;
}

@Component({
  selector: 'app-home-featured-projects',
  standalone: true,
  imports: [
    HomeCardComponent,
    HomeTechChipComponent,
    RouterLink,
  ],
  templateUrl: './home-featured-projects.component.html',
  styleUrl: './home-featured-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFeaturedProjectsComponent {
  private readonly themeService = inject(ThemeService);

  protected get config() {
    return THEME_HOME_CONFIG[this.themeService.theme()];
  }
  /** Flagship work comes from the single project dataset, never a copy. */
  protected readonly featuredProjects: readonly FeaturedProject[] = PROJECTS.filter(
    (project) =>
      project.featured &&
      project.projectType !== 'portfolio' &&
      project.availability !== 'retired',
  )
    .slice(0, 3)
    .map((project) => ({
      title: project.title,
      summary: project.summary,
      visualLabel: project.category,
      technologies: project.technologies.slice(0, 3),
      slug: project.slug,
      coverImage: project.coverImage,
    }));
}
