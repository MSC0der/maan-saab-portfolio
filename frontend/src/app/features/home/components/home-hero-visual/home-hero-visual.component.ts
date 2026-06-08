import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-home-hero-visual',
  standalone: true,
  templateUrl: './home-hero-visual.component.html',
  styleUrl: './home-hero-visual.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeroVisualComponent {
  readonly imageUrl = input.required<string>();
}
