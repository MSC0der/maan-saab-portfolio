import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HomeAboutPreviewComponent } from '../../components/home-about-preview/home-about-preview.component';
import { HomeCapabilitiesComponent } from '../../components/home-capabilities/home-capabilities.component';
import { HomeCtaComponent } from '../../components/home-cta/home-cta.component';
import { HomeFeaturedProjectsComponent } from '../../components/home-featured-projects/home-featured-projects.component';
import { HomeHeroComponent } from '../../components/home-hero/home-hero.component';
import { HomeSectionComponent } from '../../components/home-section/home-section.component';
import { HomeTestimonialsComponent } from '../../components/home-testimonials/home-testimonials.component';
import { TESTIMONIALS } from '../../data/testimonials.data';
import { HomeStatusComponent } from '../../components/home-status/home-status.component';

@Component({
  selector: 'app-home-page-default',
  standalone: true,
  imports: [
    HomeAboutPreviewComponent,
    HomeCapabilitiesComponent,
    HomeCtaComponent,
    HomeFeaturedProjectsComponent,
    HomeHeroComponent,
    HomeSectionComponent,
    HomeStatusComponent,
    HomeTestimonialsComponent,
  ],
  templateUrl: './home-page-default.component.html',
  styleUrl: './home-page-default.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageDefaultComponent {
  /** Avoid an empty padded section until real testimonials are added. */
  protected readonly hasTestimonials = TESTIMONIALS.length > 0;
}
