import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { ThemeService } from '../../../../core/services/theme.service';
import { EmailService, EmailSendTimeoutError } from '../../../../core/services/email.service';
import { RecaptchaService } from '../../../../core/services/recaptcha.service';
import { GeolocationService } from '../../../../core/services/geolocation.service';
import { THEME_CONTACT_CONFIG } from '../../../../core/config/theme-contact.config';
import { CONTACT_FALLBACK_EMAIL } from '../../../../core/config/emailjs.config';

type SubmitState =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'error'
  | 'timeout'
  | 'captcha-required';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent implements AfterViewInit {
  private readonly themeService = inject(ThemeService);
  private readonly emailService = inject(EmailService);
  private readonly recaptchaService = inject(RecaptchaService);
  private readonly geolocationService = inject(GeolocationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private readonly recaptchaContainer =
    viewChild.required<ElementRef<HTMLElement>>('recaptchaContainer');
  private recaptchaWidgetId: number | null = null;

  protected readonly submitState = signal<SubmitState>('idle');
  protected readonly fallbackEmail = CONTACT_FALLBACK_EMAIL;

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    projectType: [''],
    budget: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
    // Honeypot — real visitors never see or fill this field (hidden via CSS).
    // Bots that auto-fill every field trip it, and we silently no-op instead
    // of spending an EmailJS send on them.
    website: [''],
  });

  protected get config() {
    return THEME_CONTACT_CONFIG[this.themeService.theme()];
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.recaptchaService.isConfigured()) {
      return;
    }

    try {
      this.recaptchaWidgetId = await this.recaptchaService.render(
        this.recaptchaContainer().nativeElement,
      );
    } catch {
      // reCAPTCHA failed to load (e.g. offline/blocked) — the form still
      // works, it just skips CAPTCHA verification for this visit.
      this.recaptchaWidgetId = null;
    }
  }

  protected async onSubmit(): Promise<void> {
    if (this.submitState() === 'submitting' || this.submitState() === 'success') {
      return;
    }

    if (this.form.controls.website.value) {
      // Honeypot tripped — pretend it worked so scripted bots don't retry.
      this.submitState.set('success');
      this.form.reset();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const recaptchaToken = this.getRecaptchaToken();
    if (this.recaptchaService.isConfigured() && !recaptchaToken) {
      this.submitState.set('captcha-required');
      return;
    }

    this.submitState.set('submitting');

    const location = await this.geolocationService.getApproximateAddress();
    const { website: _website, ...payload } = this.form.getRawValue();

    try {
      await this.emailService.sendContactForm(payload, recaptchaToken, location);
      this.submitState.set('success');
      this.form.reset();
      this.reenableAfterNextEdit();
    } catch (error) {
      this.submitState.set(
        error instanceof EmailSendTimeoutError ? 'timeout' : 'error',
      );
    } finally {
      this.resetRecaptcha();
    }
  }

  private getRecaptchaToken(): string {
    if (this.recaptchaWidgetId === null) {
      return '';
    }

    return this.recaptchaService.getResponse(this.recaptchaWidgetId);
  }

  private resetRecaptcha(): void {
    if (this.recaptchaWidgetId !== null) {
      this.recaptchaService.reset(this.recaptchaWidgetId);
    }
  }

  /**
   * Keeps the submit button disabled after a successful send (to prevent an
   * accidental duplicate send) until the visitor actually starts filling the
   * form out again.
   */
  private reenableAfterNextEdit(): void {
    this.form.valueChanges
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.submitState() === 'success') {
          this.submitState.set('idle');
        }
      });
  }
}
