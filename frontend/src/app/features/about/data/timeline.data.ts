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
    title: 'Full Stack Development Internship',
    description:
      'Worked with Angular, APIs, debugging, and production workflows.',
  },
  {
    year: '2025',
    title: 'Joined Imminent Ideas as Full Stack Developer',
    description:
      'Built REST APIs, authentication systems, Angular integrations, and database solutions.',
  },
  {
    year: '2026',
    title: 'Focused on Backend Engineering',
    description:
      'Working on scalable APIs, query optimization, authentication systems, DSA, and system design.',
  },
  {
    year: 'Future',
    title: 'Software Engineer at a Product Company',
    description: 'Building large-scale products used by thousands of users.',
    future: true,
  },
] as const;
