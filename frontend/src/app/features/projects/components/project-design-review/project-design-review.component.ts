import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-design-review',
  standalone: true,
  templateUrl: './project-design-review.component.html',
  styleUrl: './project-design-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDesignReviewComponent {
  readonly project = input.required<Project>();

  protected readonly expandedIndex = signal<number | null>(0);

  protected toggle(index: number): void {
    this.expandedIndex.update((current) =>
      current === index ? null : index,
    );
  }
}