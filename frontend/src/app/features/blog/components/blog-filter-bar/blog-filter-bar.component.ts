import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-blog-filter-bar',
  standalone: true,
  templateUrl: './blog-filter-bar.component.html',
  styleUrl: './blog-filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogFilterBarComponent {
  protected readonly filters = [
    'All',
    'Backend',
    'Node.js',
    'Angular',
    'MongoDB',
    'SQL',
    'Authentication',
    'System Design',
    'DSA',
  ];

  protected activeFilter = 'All';
}
