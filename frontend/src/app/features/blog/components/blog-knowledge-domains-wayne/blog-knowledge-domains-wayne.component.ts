import { Component } from '@angular/core';

@Component({
  selector: 'app-blog-knowledge-domains-wayne',
  standalone: true,
  templateUrl: './blog-knowledge-domains-wayne.component.html',
  styleUrl: './blog-knowledge-domains-wayne.component.scss',
})
export class BlogKnowledgeDomainsWayneComponent {
  protected readonly sectors = [
    {
      title: 'Backend Engineering',
      icon: '⌘',
    },
    {
      title: 'API Architecture',
      icon: '◈',
    },
    {
      title: 'Authentication & Security',
      icon: '◉',
    },
    {
      title: 'Database Systems',
      icon: '▣',
    },
    {
      title: 'Angular Operations',
      icon: '▤',
    },
    {
      title: 'System Design',
      icon: '△',
    },
    {
      title: 'Performance Engineering',
      icon: '◎',
    },
    {
      title: 'Problem Solving',
      icon: '✦',
    },
  ];
}
