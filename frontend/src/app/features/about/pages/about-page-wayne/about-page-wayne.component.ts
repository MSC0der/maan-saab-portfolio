import { Component } from '@angular/core';
import { AboutHeroComponent } from "../../components/about-hero/about-hero.component";
import { AboutTimelineComponent } from "../../components/about-timeline/about-timeline.component";
import { AboutExperienceComponent } from "../../components/about-experience/about-experience.component";
import { AboutExpertiseComponent } from "../../components/about-expertise/about-expertise.component";
import { HomeSectionComponent } from "../../../home/components/home-section/home-section.component";
import { AboutHeroWayneComponent } from "../../components/about-hero-wayne/about-hero-wayne.component";
import { AboutTimelineWayneComponent } from "../../components/about-timeline-wayne/about-timeline-wayne.component";
import { AboutExperienceWayneComponent } from "../../components/about-experience-wayne/about-experience-wayne.component";
import { AboutOperationalExpertiseWayneComponent } from "../../components/about-operational-expertise-wayne/about-operational-expertise-wayne.component";
import { AboutCapabilitiesMatrixWayneComponent } from "../../components/about-capabilities-matrix-wayne/about-capabilities-matrix-wayne.component";
import { AboutCommandingPhilosophyWayneComponent } from "../../components/about-commanding-philosophy-wayne/about-commanding-philosophy-wayne.component";
import { AboutClearanceMetricsWayneComponent } from "../../components/about-clearance-metrics-wayne/about-clearance-metrics-wayne.component";
import { AboutVerifiedRecordsWayneComponent } from "../../components/about-verified-records-wayne/about-verified-records-wayne.component";
import { AboutCtaWayneComponent } from "../../components/about-cta-wayne/about-cta-wayne.component";

@Component({
  selector: 'app-about-page-wayne',
  standalone: true,
  imports: [AboutHeroComponent, AboutTimelineComponent, AboutExperienceComponent, AboutExpertiseComponent, HomeSectionComponent, AboutHeroWayneComponent, AboutTimelineWayneComponent, AboutExperienceWayneComponent, AboutOperationalExpertiseWayneComponent, AboutCapabilitiesMatrixWayneComponent, AboutCommandingPhilosophyWayneComponent, AboutClearanceMetricsWayneComponent, AboutVerifiedRecordsWayneComponent, AboutCtaWayneComponent],
  templateUrl: './about-page-wayne.component.html',
  styleUrl: './about-page-wayne.component.scss'
})
export class AboutPageWayneComponent {

}
