import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AboutIconName = 'arrow' | 'hub' | 'lock' | 'database' | 'dns' | 'web' | 'cloud' | 'terminal' | 'tree';

@Component({
  selector: 'app-about-icon',
  standalone: true,
  templateUrl: './about-icon.component.html',
  styleUrl: './about-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutIconComponent {
  readonly name = input<AboutIconName>();
}
