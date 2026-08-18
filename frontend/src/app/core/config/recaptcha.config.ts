/**
 * Google reCAPTCHA v2 ("I'm not a robot" checkbox) site key for the contact form.
 *
 * The site key is meant to be public/client-side (it's what identifies your
 * site to Google, not a secret) — safe to commit. The matching SECRET key is
 * never used in this codebase at all; it only goes into the EmailJS dashboard.
 *
 * To enable it:
 * 1. Go to https://www.google.com/recaptcha/admin/create
 * 2. Choose reCAPTCHA v2 -> "I'm not a robot" Checkbox
 * 3. Add your domain(s) — include `localhost` while developing
 * 4. Copy the "Site Key" and paste it below
 * 5. Copy the "Secret Key" and paste it into EmailJS -> Email Templates ->
 *    your contact template -> Settings tab -> reCAPTCHA
 *
 * Until a real value is set here, RecaptchaService.isConfigured() returns
 * false and the contact form skips CAPTCHA verification entirely (so the
 * form still works end-to-end without it — it just isn't spam-protected).
 */
export const RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_SITE_KEY';
