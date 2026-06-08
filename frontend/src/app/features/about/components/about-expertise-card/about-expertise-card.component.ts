import { ChangeDetectionStrategy, Component, input } from '@angular/core';


@Component({
  selector: 'app-about-expertise-card',
  standalone: true,
  templateUrl: './about-expertise-card.component.html',
  styleUrl: './about-expertise-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutExpertiseCardComponent {
  readonly title = input.required<string>();
  readonly imageUrl = input.required<string>();
  readonly imageAlt = input.required<string>();
  readonly skills = input.required<readonly string[]>();
}
