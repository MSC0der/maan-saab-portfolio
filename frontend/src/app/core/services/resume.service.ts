import { Injectable, inject, signal } from '@angular/core';
import { RESUME_SIGNED_URL_ENDPOINT } from '../config/resume.config';
import { ToastService } from './toast.service';

const RESUME_FILENAME = 'Ranbir_Singh_Maan_Resume.docx';

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
      const blob = await this.fetchFile(url);

      this.triggerDownload(blob);
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

  private async fetchFile(url: string): Promise<Blob> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Resume file request failed with status ${response.status}`);
    }

    return response.blob();
  }

  private triggerDownload(blob: Blob): void {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = RESUME_FILENAME;
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Give the browser a moment to pick up the download before revoking.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}
