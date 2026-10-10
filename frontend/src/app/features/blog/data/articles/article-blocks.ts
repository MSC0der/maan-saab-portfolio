import { ArticleBlock, ArticleSection } from '../../models/article.model';

/** Tiny authoring helpers so article files read like the articles themselves. */
export const p = (text: string): ArticleBlock => ({ type: 'p', text });

export const h3 = (text: string): ArticleBlock => ({ type: 'h3', text });

export const list = (...items: string[]): ArticleBlock => ({
  type: 'list',
  items,
});

export const steps = (...items: string[]): ArticleBlock => ({
  type: 'list',
  ordered: true,
  items,
});

export const code = (
  language: string,
  source: string,
  caption?: string,
): ArticleBlock => ({
  type: 'code',
  language,
  code: source.replace(/^\n/, '').replace(/\s+$/, ''),
  caption,
});

export const callout = (label: string, text: string): ArticleBlock => ({
  type: 'callout',
  label,
  text,
});

export const table = (
  head: string[],
  ...rows: string[][]
): ArticleBlock => ({ type: 'table', head, rows });

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** A headed section; the anchor id is derived from the heading. */
export const section = (
  heading: string,
  ...blocks: ArticleBlock[]
): ArticleSection => ({ id: slugify(heading), heading, blocks });

/** The opening section has no heading and anchors as `intro`. */
export const intro = (...blocks: ArticleBlock[]): ArticleSection => ({
  id: 'intro',
  blocks,
});

const blockText = (block: ArticleBlock): string => {
  switch (block.type) {
    case 'p':
    case 'h3':
      return block.text;
    case 'callout':
      return block.text;
    case 'list':
      return block.items.join(' ');
    case 'table':
      return [...block.head, ...block.rows.flat()].join(' ');
    case 'code':
      return '';
  }
};

/**
 * Reading time from the prose (≈200 wpm) plus a little for each code block,
 * so the label always matches the article it sits on.
 */
export function estimateReadTime(sections: readonly ArticleSection[]): string {
  let words = 0;
  let codeBlocks = 0;
  for (const s of sections) {
    words += (s.heading ?? '').split(/\s+/).filter(Boolean).length;
    for (const block of s.blocks) {
      words += blockText(block).split(/\s+/).filter(Boolean).length;
      if (block.type === 'code') {
        codeBlocks += 1;
      }
    }
  }
  const minutes = Math.max(1, Math.round(words / 200 + codeBlocks * 0.5));
  return `${minutes} min read`;
}
