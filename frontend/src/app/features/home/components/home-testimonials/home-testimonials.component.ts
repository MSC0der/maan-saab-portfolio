import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TESTIMONIALS } from '../../data/testimonials.data';

@Component({
  selector: 'app-home-testimonials',
  standalone: true,
  templateUrl: './home-testimonials.component.html',
  styleUrl: './home-testimonials.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTestimonialsComponent {
  protected readonly testimonials = TESTIMONIALS;
}
