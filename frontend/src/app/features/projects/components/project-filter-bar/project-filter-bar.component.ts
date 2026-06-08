import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-project-filter-bar',
  standalone: true,
  templateUrl: './project-filter-bar.component.html',
  styleUrl: './project-filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFilterBarComponent {
  protected readonly filters = [
    'All',
    'Backend',
    'Full Stack',
    'Angular',
    'Node.js',
    'MongoDB',
    'Authentication',
    'System Design',
  ];

  protected selectedFilter = 'All';

  protected selectFilter(filter: string): void {
    this.selectedFilter = filter;
  }
}