import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-home-card',
  standalone: true,
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCardComponent {
  readonly dashed = input(false);
  readonly centered = input(false);
}
