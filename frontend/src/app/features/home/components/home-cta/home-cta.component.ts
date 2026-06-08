import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-cta.component.html',
  styleUrl: './home-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCtaComponent {}
