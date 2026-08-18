export interface EmailjsConfig {
  readonly serviceId: string;
  readonly templateId: string;
  readonly publicKey: string;
}

/**
 * EmailJS configuration for the contact form.
 *
 * EmailJS's Public Key is explicitly designed to be used client-side — it is
 * NOT a secret (see https://www.emailjs.com/docs/sdk/installation/), so it's
 * safe to commit alongside the Service ID and Template ID below.
 *
 * To enable real email delivery:
 * 1. Create a free account at https://www.emailjs.com/
 * 2. Email Services -> Add New Service (e.g. Gmail) -> copy the "Service ID"
 * 3. Email Templates -> Create New Template -> add template variables
 *    matching CONTACT_FORM_TEMPLATE_PARAMS in email.service.ts
 *    (from_name, from_email, company, project_type, budget, message)
 *    -> copy the "Template ID"
 * 4. Account -> General -> copy the "Public Key"
 * 5. Replace the three placeholder values below with your real values.
 *
 * Until real values are set, EmailService.isConfigured() returns false and
 * the contact form shows a "message me directly" fallback instead of trying
 * to send.
 */
export const EMAILJS_CONFIG: EmailjsConfig = {
  serviceId: 'service_dqov6ln',
  templateId: 'template_dbeh76m',
  publicKey: 'JPlqOK4IvWPOe7ZcF',
};

export const CONTACT_FALLBACK_EMAIL = 'contact@maansaab.com';
