import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type HomeIconName = 'api' | 'key' | 'storage' | 'psychology' | 'check' | 'work';

@Component({
  selector: 'app-home-icon',
  standalone: true,
  templateUrl: './home-icon.component.html',
  styleUrl: './home-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeIconComponent {
  readonly name = input.required<HomeIconName>();
}
