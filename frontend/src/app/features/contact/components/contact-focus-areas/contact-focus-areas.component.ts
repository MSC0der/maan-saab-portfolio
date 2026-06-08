import { ChangeDetectionStrategy, Component } from '@angular/core';

interface FocusArea {
  readonly number: string;
  readonly title: string;
}

@Component({
  selector: 'app-contact-focus-areas',
  standalone: true,
  templateUrl: './contact-focus-areas.component.html',
  styleUrl: './contact-focus-areas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFocusAreasComponent {
  protected readonly areas: readonly FocusArea[] = [
    {
      number: '01',
      title: 'Software Engineer Roles',
    },
    {
      number: '02',
      title: 'Full Stack Development',
    },
    {
      number: '03',
      title: 'Backend Architecture',
    },
    {
      number: '04',
      title: 'Freelance Projects',
    },
    {
      number: '05',
      title: 'Technical Consulting',
    },
    {
      number: '+',
      title: 'Open to Discuss',
    },
  ];
}
