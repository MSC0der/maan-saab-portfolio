/** Inline building blocks an article section is made of. */
export type ArticleBlock =
  | { readonly type: 'p'; readonly text: string }
  | { readonly type: 'h3'; readonly text: string }
  | {
      readonly type: 'list';
      readonly ordered?: boolean;
      readonly items: readonly string[];
    }
  | {
      readonly type: 'code';
      readonly language: string;
      readonly code: string;
      readonly caption?: string;
    }
  | {
      readonly type: 'callout';
      readonly label: string;
      readonly text: string;
    }
  | {
      readonly type: 'table';
      readonly head: readonly string[];
      readonly rows: readonly (readonly string[])[];
    };

export interface ArticleSection {
  /** Anchor id; also what the table of contents links to. */
  readonly id: string;
  /** Omit for the opening section, which has no heading. */
  readonly heading?: string;
  readonly blocks: readonly ArticleBlock[];
}

export interface Article {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  /** Short label shown on cards, e.g. AUTHENTICATION. */
  readonly category: string;
  /** Estimated from the article body, never hand-typed. */
  readonly readTime: string;
  readonly publishedAt: string;

  /**
   * Canonical topics this article belongs to. The blog filter bar offers a
   * chip for a topic only when at least one article carries it.
   */
  readonly filters: readonly string[];

  readonly featured?: boolean;
  readonly heroTitle?: string;

  /** Shown next to the title as "In this article". */
  readonly takeaways: readonly string[];
  readonly sections: readonly ArticleSection[];

  /** Optional sidebar tip. */
  readonly tip?: { readonly label: string; readonly text: string };
}
