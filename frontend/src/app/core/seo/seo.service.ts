import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import {
  DEFAULT_IMAGE,
  DEFAULT_IMAGE_ALT,
  SITE_NAME,
  SITE_URL,
  SeoConfig,
} from './seo.config';

const JSON_LD_ID = 'route-json-ld';

/**
 * Applies a route's SEO config to the document head. Static tags live in
 * index.html (what crawlers that skip JavaScript see); this keeps them in sync
 * as the user navigates.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(seo: SeoConfig): void {
    const url = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`;

    this.title.setTitle(seo.title);
    this.setName('description', seo.description);
    this.setName('robots', seo.noindex ? 'noindex, follow' : 'index, follow');

    this.setProperty('og:type', seo.type ?? 'website');
    this.setProperty('og:site_name', SITE_NAME);
    this.setProperty('og:title', seo.title);
    this.setProperty('og:description', seo.description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', DEFAULT_IMAGE);
    this.setProperty('og:image:alt', DEFAULT_IMAGE_ALT);

    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', seo.title);
    this.setName('twitter:description', seo.description);
    this.setName('twitter:image', DEFAULT_IMAGE);

    if (seo.publishedTime) {
      this.setProperty('article:published_time', seo.publishedTime);
    } else {
      this.meta.removeTag(`property='article:published_time'`);
    }

    this.setCanonical(url);
    this.setJsonLd(seo.jsonLd);
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property='${property}'`);
  }

  private setCanonical(href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  /** Route-level structured data; replaced on every navigation. */
  private setJsonLd(data: Record<string, unknown> | undefined): void {
    this.document.getElementById(JSON_LD_ID)?.remove();
    if (!data) {
      return;
    }
    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}
