/**
 * The engineer's real path — student developer → backend-focused software
 * engineer. Single source of truth: consumed by the About page timeline
 * (`about-timeline.component.ts`) and the immersive Engineering Journey world.
 * Content is not duplicated or reworded anywhere else.
 */
export interface TimelineEntry {
  readonly year: string;
  readonly title: string;
  readonly description: string;
  /** Aspirational trajectory, not a completed milestone. */
  readonly future?: boolean;
}

export const ENGINEERING_TIMELINE: readonly TimelineEntry[] = [
  {
    year: '2021',
    title: 'Started Bachelor of Computer Applications',
    description:
      'Learning programming fundamentals, databases, and software development concepts.',
  },
  {
    year: '2024',
    title: 'Joined Imminent Ideas as Full Stack Intern',
    description:
      'Four months of training in Angular, APIs and Git workflows, working with production code.',
  },
  {
    year: '2025',
    title: 'Full Stack Developer at Imminent Ideas',
    description:
      'Built Node.js and MySQL APIs for PeopleFern, an HRMS SaaS: validation, AES-encrypted payloads, permission management and session handling.',
  },
  {
    year: '2026',
    title: 'Backend Engineer on Garage Futurist',
    description:
      'Delivering backend work of a live multi-tenant SaaS: Razorpay subscriptions, Socket.IO chat, reports, cron jobs and Swagger docs.',
  },
  {
    year: '2028',
    title: 'MCA at Chandigarh University',
    description:
      'Pursuing a Master of Computer Applications, expected to graduate in 2028.',
    future: true,
  },
  {
    year: 'Future',
    title: 'Software Engineer at a Product Company',
    description: 'Building large-scale products used by thousands of users.',
    future: true,
  },
] as const;
