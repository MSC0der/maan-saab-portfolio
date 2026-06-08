import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AboutIconComponent } from '../about-icon/about-icon.component';

@Component({
  selector: 'app-about-hero',
  standalone: true,
  imports: [AboutIconComponent],
  templateUrl: './about-hero.component.html',
  styleUrl: './about-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutHeroComponent {
  protected readonly heroImageUrl =
    '/images/about/maan-about-hero.png';
    
}
