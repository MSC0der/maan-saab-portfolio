import { Injectable } from '@angular/core';

const POSITION_TIMEOUT_MS = 8_000;
const REVERSE_GEOCODE_TIMEOUT_MS = 6_000;

/**
 * Best-effort visitor location for contact-form submissions.
 *
 * Uses the browser's native Geolocation API — this always shows the
 * browser's own permission prompt (there is no way to get precise location
 * silently, by design). If the visitor declines, the API is unsupported, or
 * the reverse-geocode lookup fails, every method here resolves to null
 * rather than throwing — callers should treat null as "no location
 * available", not as an error, and must not block form submission on it.
 */
@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  /** Approximate address, e.g. "Mumbai, Maharashtra, India". */
  async getApproximateAddress(): Promise<string | null> {
    const position = await this.getPosition();
    if (!position) {
      return null;
    }

    return this.reverseGeocode(position.coords.latitude, position.coords.longitude);
  }

  private getPosition(): Promise<GeolocationPosition | null> {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        () => resolve(null),
        { timeout: POSITION_TIMEOUT_MS, maximumAge: 5 * 60_000 },
      );
    });
  }

  private async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<string | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      REVERSE_GEOCODE_TIMEOUT_MS,
    );

    try {
      // OpenStreetMap Nominatim — free, keyless reverse geocoding.
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const address = data?.address ?? {};
      const locality =
        address.city ?? address.town ?? address.village ?? address.suburb;
      const parts = [locality, address.state, address.country].filter(Boolean);

      return parts.length > 0 ? parts.join(', ') : (data?.display_name ?? null);
    } catch {
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
