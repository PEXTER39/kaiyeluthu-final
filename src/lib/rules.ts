import type { Assignment, Submission, WatchProgress } from "./types";

/** Seconds actually watched as a share of duration (skipped parts are never recorded). */
export function watchRatio(p?: WatchProgress) {
  if (!p || !p.duration) return 0;
  return Math.min(1, new Set(p.watchedSeconds).size / Math.floor(p.duration));
}

export const isSessionComplete = (p: WatchProgress | undefined, threshold: number) => watchRatio(p) >= threshold;

export function certificateChecklist(opts: {
  sessionIds: number[];
  progress: WatchProgress[];
  assignments: Assignment[];
  submissions: Submission[];
  threshold: number;
}) {
  const pendingSessions = opts.sessionIds.filter(
    (id) => !isSessionComplete(opts.progress.find((p) => p.sessionId === id), opts.threshold),
  );
  const pendingAssignments = opts.assignments.filter((a) => !opts.submissions.some((s) => s.assignmentId === a.id));
  return { pendingSessions, pendingAssignments, unlocked: pendingSessions.length === 0 && pendingAssignments.length === 0 };
}

/** Indian mobile: optional +91 / 0, then 10 digits starting 6-9. */
export function isValidIndianPhone(v: string) {
  const d = v.replace(/[\s-]/g, "");
  return /^(?:\+?91|0)?[6-9]\d{9}$/.test(d);
}
