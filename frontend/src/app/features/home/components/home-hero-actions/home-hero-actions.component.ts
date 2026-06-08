import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-hero-actions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-hero-actions.component.html',
  styleUrl: './home-hero-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeroActionsComponent {}
