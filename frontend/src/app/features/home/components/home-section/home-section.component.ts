import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-home-section',
  standalone: true,
  templateUrl: './home-section.component.html',
  styleUrl: './home-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSectionComponent {
  readonly sectionId = input<string>();
  readonly reveal = input(true);
}
