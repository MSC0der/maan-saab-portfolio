import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectCaseStudyHeroComponent } from '../../components/project-case-study-hero/project-case-study-hero.component';
import { ProjectDataService } from '../../services/project-data.service';
import { Project } from '../../models/project.model';
import { ProjectOverviewComponent } from '../../components/project-overview/project-overview.component';
import { ProjectSystemFlowComponent } from '../../components/project-system-flow/project-system-flow.component';
import { ProjectCapabilitiesComponent } from '../../components/project-capabilities/project-capabilities.component';
import { ProjectDesignReviewComponent } from '../../components/project-design-review/project-design-review.component';
import { ProjectEngineeringReportComponent } from '../../components/project-engineering-report/project-engineering-report.component';
import { ProjectResultsComponent } from '../../components/project-results/project-results.component';
import { ProjectSecurityArchitectureComponent } from '../../components/project-security-architecture/project-security-architecture.component';
import { ProjectNextProjectComponent } from '../../components/project-next-project/project-next-project.component';

@Component({
  selector: 'app-project-case-study-page',
  standalone: true,
  imports: [
    RouterLink,
    ProjectCaseStudyHeroComponent,
    ProjectOverviewComponent,
    ProjectSystemFlowComponent,
    ProjectCapabilitiesComponent,
    ProjectDesignReviewComponent,
    ProjectEngineeringReportComponent,
    ProjectResultsComponent,
    ProjectSecurityArchitectureComponent,
    ProjectNextProjectComponent,
  ],
  templateUrl: './project-case-study-page.component.html',
  styleUrl: './project-case-study-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCaseStudyPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectService = inject(ProjectDataService);

  protected readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';

  protected readonly project: Project | undefined =
    this.projectService.getProjectBySlug(this.slug);
}
