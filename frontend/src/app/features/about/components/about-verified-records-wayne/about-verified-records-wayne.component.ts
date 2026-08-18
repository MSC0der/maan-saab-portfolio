import { ChangeDetectionStrategy, Component } from '@angular/core';

interface VerifiedRecord {
  title: string;
  subtitle: string;
  status: 'VERIFIED' | 'ACTIVE' | 'SECURE';
}

@Component({
  selector: 'app-about-verified-records-wayne',
  standalone: true,
  templateUrl: './about-verified-records-wayne.component.html',
  styleUrl: './about-verified-records-wayne.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutVerifiedRecordsWayneComponent {
  protected readonly records: readonly VerifiedRecord[] = [
    {
      title: 'IMMINENT IDEAS PVT LTD',
      subtitle: 'Full Stack Developer',
      status: 'ACTIVE',
    },
    {
      title: 'BACHELOR OF COMPUTER APPLICATIONS',
      subtitle: 'Kolhan University',
      status: 'VERIFIED',
    },
    {
      title: 'NODE.JS BACKEND ENGINEERING',
      subtitle: 'Production APIs & Authentication',
      status: 'SECURE',
    },
    {
      title: 'ANGULAR DEVELOPMENT',
      subtitle: 'Enterprise Frontend Systems',
      status: 'VERIFIED',
    },
  ];
}
