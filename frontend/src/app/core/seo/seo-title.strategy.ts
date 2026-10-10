import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { SeoConfig } from './seo.config';
import { SeoService } from './seo.service';

/** Route data key holding a route's SeoConfig (static `data` or a resolver). */
export const SEO_DATA_KEY = 'seo';

/**
 * Runs after every navigation. Angular's default strategy only sets the title;
 * this one applies the full SEO config the route carries, so title, description,
 * canonical and social tags always change together.
 */
@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const config = route.data[SEO_DATA_KEY] as SeoConfig | undefined;
    if (config) {
      this.seo.apply(config);
    }
  }
}
