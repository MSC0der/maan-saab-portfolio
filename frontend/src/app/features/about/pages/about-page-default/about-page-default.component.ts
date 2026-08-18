import { Component } from '@angular/core';
import { AboutHeroComponent } from "../../components/about-hero/about-hero.component";
import { AboutTimelineComponent } from "../../components/about-timeline/about-timeline.component";
import { AboutExperienceComponent } from "../../components/about-experience/about-experience.component";
import { AboutExpertiseComponent } from "../../components/about-expertise/about-expertise.component";

@Component({
  selector: 'app-about-page-default',
  standalone: true,
  imports: [AboutHeroComponent, AboutTimelineComponent, AboutExperienceComponent, AboutExpertiseComponent],
  templateUrl: './about-page-default.component.html',
  styleUrl: './about-page-default.component.scss'
})
export class AboutPageDefaultComponent {

}
