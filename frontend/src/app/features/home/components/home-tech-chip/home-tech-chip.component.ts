import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-home-tech-chip',
  standalone: true,
  templateUrl: './home-tech-chip.component.html',
  styleUrl: './home-tech-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTechChipComponent {
  readonly label = input.required<string>();
  readonly compact = input(false);
}
