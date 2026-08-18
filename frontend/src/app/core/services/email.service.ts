import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs.config';

export interface ContactFormPayload {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
}

const SEND_TIMEOUT_MS = 15_000;

export class EmailSendTimeoutError extends Error {
  constructor() {
    super('Timed out while sending the message.');
    this.name = 'EmailSendTimeoutError';
  }
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private initialized = false;

  isConfigured(): boolean {
    return Object.values(EMAILJS_CONFIG).every(
      (value) => !value.startsWith('YOUR_'),
    );
  }

  async sendContactForm(
    payload: ContactFormPayload,
    recaptchaToken: string,
    location: string | null,
  ): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('EmailJS is not configured.');
    }

    if (!this.initialized) {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
      this.initialized = true;
    }

    const send = emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        from_name: payload.name,
        from_email: payload.email,
        company: payload.company,
        project_type: payload.projectType,
        budget: payload.budget,
        message: payload.message,
        location: location ?? 'Not shared',
        'g-recaptcha-response': recaptchaToken,
      },
    );

    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new EmailSendTimeoutError()), SEND_TIMEOUT_MS);
    });

    await Promise.race([send, timeout]);
  }
}
