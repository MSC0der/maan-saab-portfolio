export interface Testimonial {
  readonly quote: string;
  readonly name: string;
  /** e.g. "Engineering Manager, Imminent Ideas" */
  readonly role: string;
}

/**
 * Real recommendations only. The Testimonials section on the home page renders
 * nothing while this list is empty, so nothing placeholder ever ships.
 *
 * Ask a manager, client or teammate for 1–2 sentences (with permission to quote
 * them by name and role), then add them here:
 *
 * { quote: '…', name: 'Full Name', role: 'Title, Company' },
 */
export const TESTIMONIALS: readonly Testimonial[] = [];
