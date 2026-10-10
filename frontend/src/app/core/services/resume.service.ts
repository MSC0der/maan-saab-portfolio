import { Injectable, inject, signal } from '@angular/core';
import { RESUME_SIGNED_URL_ENDPOINT } from '../config/resume.config';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private readonly toastService = inject(ToastService);

  private readonly downloading = signal(false);

  /** True while a resume download is in flight; bind to [disabled] on trigger buttons. */
  readonly isDownloading = this.downloading.asReadonly();

  async download(): Promise<void> {
    if (this.downloading()) {
      return;
    }

    this.downloading.set(true);

    try {
      const { url } = await this.fetchSignedUrl();

      this.triggerDownload(url);
      this.toastService.show('Resume download started.', 'info');
    } catch (error) {
      console.error('Unable to download resume', error);
      this.toastService.show("Couldn't download the resume — please try again.", 'error');
    } finally {
      this.downloading.set(false);
    }
  }

  private async fetchSignedUrl(): Promise<{ url: string }> {
    const response = await fetch(RESUME_SIGNED_URL_ENDPOINT);

    if (!response.ok) {
      throw new Error(`Resume link request failed with status ${response.status}`);
    }

    const { url } = (await response.json()) as { url?: string };

    if (!url) {
      throw new Error('Resume link response did not include a url');
    }

    return { url };
  }

  /**
   * Hands the short-lived signed link to the browser. The link carries
   * `Content-Disposition: attachment` (set when the Lambda signs it), so the
   * browser saves the file instead of navigating. Fetching it into a Blob
   * first would need CORS on the S3 bucket, which a plain download does not.
   */
  private triggerDownload(url: string): void {
    const link = document.createElement('a');

    link.href = url;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
