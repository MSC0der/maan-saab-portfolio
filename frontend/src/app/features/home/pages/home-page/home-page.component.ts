import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HomeAboutPreviewComponent } from '../../components/home-about-preview/home-about-preview.component';
import { HomeCapabilitiesComponent } from '../../components/home-capabilities/home-capabilities.component';
import { HomeCtaComponent } from '../../components/home-cta/home-cta.component';
import { HomeFeaturedProjectsComponent } from '../../components/home-featured-projects/home-featured-projects.component';
import { HomeHeroComponent } from '../../components/home-hero/home-hero.component';
import { HomeSectionComponent } from '../../components/home-section/home-section.component';
import { HomeStatusComponent } from '../../components/home-status/home-status.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HomeAboutPreviewComponent,
    HomeCapabilitiesComponent,
    HomeCtaComponent,
    HomeFeaturedProjectsComponent,
    HomeHeroComponent,
    HomeSectionComponent,
    HomeStatusComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
