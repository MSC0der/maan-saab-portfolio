import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AboutExperienceComponent } from '../../components/about-experience/about-experience.component';
import { AboutExpertiseComponent } from '../../components/about-expertise/about-expertise.component';
import { AboutHeroComponent } from '../../components/about-hero/about-hero.component';
import { AboutTimelineComponent } from '../../components/about-timeline/about-timeline.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [AboutExperienceComponent, AboutExpertiseComponent, AboutHeroComponent, AboutTimelineComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {}
