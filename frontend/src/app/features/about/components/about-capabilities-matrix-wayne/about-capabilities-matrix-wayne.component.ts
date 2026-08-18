import { Component } from '@angular/core';

@Component({
  selector: 'app-about-capabilities-matrix-wayne',
  standalone: true,
  imports: [],
  templateUrl: './about-capabilities-matrix-wayne.component.html',
  styleUrl: './about-capabilities-matrix-wayne.component.scss',
})
export class AboutCapabilitiesMatrixWayneComponent {
  protected readonly capabilities = [
    {
      title: 'Frontend Systems',
      technology: 'Angular / TypeScript',
      percentage: 95,
      details: 'RxJS / State Management / Tailwind CSS',
    },
    {
      title: 'Backend Operations',
      technology: 'Node.js / Express.js',
      percentage: 98,
      details: 'REST APIs / Microservices / Streams',
    },
    {
      title: 'Data Intelligence',
      technology: 'MongoDB / MySQL',
      percentage: 92,
      details: 'Database Design / Redis / Indexing',
    },
    {
      title: 'Infrastructure Systems',
      technology: 'AWS / CI-CD',
      percentage: 90,
      details: 'Docker / EC2 / S3',
    },
    {
      title: 'Security Operations',
      technology: 'JWT / Auth Architecture',
      percentage: 94,
      details: 'RBAC / Encryption / Secure Coding',
    },
    {
      title: 'Problem Solving',
      technology: 'DSA / Logic',
      percentage: 96,
      details: 'Algorithms / Scalability',
    },
  ];
}
