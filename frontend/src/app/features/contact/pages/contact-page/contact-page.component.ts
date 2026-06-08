import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactAvailabilityComponent } from '../../components/contact-availability/contact-availability.component';
import { ContactDirectLinksComponent } from '../../components/contact-direct-links/contact-direct-links.component';
import { ContactHeroComponent } from '../../components/contact-hero/contact-hero.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { ContactSidebarCtaComponent } from '../../components/contact-sidebar-cta/contact-sidebar-cta.component';
import { ContactFocusAreasComponent } from '../../components/contact-focus-areas/contact-focus-areas.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    ContactHeroComponent,
    ContactFormComponent,
    ContactAvailabilityComponent,
    ContactDirectLinksComponent,
    ContactFocusAreasComponent,
    ContactSidebarCtaComponent,
  ],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {}
