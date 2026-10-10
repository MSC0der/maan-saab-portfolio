import { ENGINEERING_TIMELINE } from '../about/data/timeline.data';
import { ActiveMilestoneView, JourneyMilestoneSpec } from './immersive.model';

/**
 * Angular-owned adapter: turns the real `ENGINEERING_TIMELINE` into the plain
 * milestone specs the Three.js Engineering Journey consumes. No fabrication —
 * every value comes straight from the shared timeline data.
 */
function milestoneId(index: number): string {
  return `ms-${index}`;
}

/** Spatial specs for the Three.js journey builder. */
export function buildJourneyMilestones(): JourneyMilestoneSpec[] {
  return ENGINEERING_TIMELINE.map((entry, index) => ({
    id: milestoneId(index),
    year: entry.year,
    title: entry.title,
    detail: entry.description,
    future: entry.future === true,
  }));
}

/** Inspector view-models keyed by milestone id, for the HTML overlay. */
export function buildJourneyViews(): Map<string, ActiveMilestoneView> {
  const views = new Map<string, ActiveMilestoneView>();
  ENGINEERING_TIMELINE.forEach((entry, index) => {
    views.set(milestoneId(index), {
      id: milestoneId(index),
      year: entry.year,
      title: entry.title,
      detail: entry.description,
      future: entry.future === true,
    });
  });
  return views;
}
