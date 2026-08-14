/**
 * Pure derivation of the 「窗口统计」 (Window Stats) row model from the client
 * session-list snapshot. No React, no I/O, no subscriptions — the view and the
 * tests consume the same functions.
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/stats
 */
import type { PendingInteractionStatus, SessionId, SessionListState, SessionSummary } from '@deepseek-ai/dsh-client-runtime/client';
/** Provider-reported cumulative usage for one session log (four disjoint buckets). */
export interface TokenUsageProjection {
    uncachedInputTokens: number;
    outputTokens: number;
    cacheReadTokens: number;
    cacheWriteTokens: number;
}
/** Approximate context occupancy reference (fields are independent last-wins records). */
export interface ContextPressureProjection {
    pressureTokens?: number;
    projectedTokens?: number;
    contextWindow?: number;
}
/** Whole-log turn/step counts and wall times (compaction-independent). */
export interface SessionStatsProjection {
    turns: number;
    steps: number;
    llmMs: number;
    toolMs: number;
    ttftMs: number;
    ttftSteps: number;
    decodeMs: number;
    decodeTokens: number;
}
declare module '@deepseek-ai/dsh-session-projection/types' {
    interface SessionProjectionMap {
        tokenUsage: TokenUsageProjection;
        contextPressure: ContextPressureProjection;
        sessionStats: SessionStatsProjection;
    }
}
/** One dashboard row, derived from a `SessionSummary` plus its projections. */
export interface WindowRow {
    id: SessionId;
    /** Human-facing label: `displayTitle`, falling back to the id tail. */
    title: string;
    cwd?: string;
    running: boolean;
    pendingInteraction?: PendingInteractionStatus;
    completed: boolean;
    blank: boolean;
    updatedAt: number;
    turns?: number;
    steps?: number;
    inputTokens?: number;
    outputTokens?: number;
    cacheReadTokens?: number;
    cacheWriteTokens?: number;
    projectedTokens?: number;
    contextWindow?: number;
}
/** Aggregate figures across the derived rows. */
export interface WindowAggregate {
    total: number;
    running: number;
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens: number;
    cacheWriteTokens: number;
    /** Rows that contributed a `tokenUsage` value. */
    counted: number;
}
/** Derivation options. */
export interface DeriveOptions {
    /** Include blank sessions (default false, matching the sidebar browser). */
    includeBlank: boolean;
}
/**
 * Derive one row from a `SessionSummary`.
 * @param summary - the list row.
 * @returns the row with projection values copied (absent keys stay undefined).
 */
export declare function deriveRow(summary: SessionSummary): WindowRow;
/**
 * Derive the ordered dashboard rows from a session-list snapshot.
 * @param state - the `useSessions` snapshot.
 * @param opts - blank filtering (default hides blank rows).
 * @returns non-blank rows sorted by `updatedAt` descending (stable).
 */
export declare function deriveWindowRows(state: SessionListState, opts: DeriveOptions): WindowRow[];
/**
 * Aggregate totals across derived rows.
 * @param rows - the dashboard rows.
 * @returns counts and token sums (rows without a value contribute zero).
 */
export declare function aggregate(rows: readonly WindowRow[]): WindowAggregate;
/**
 * Cache-hit ratio for one row, clamped to [0, 1].
 * @param row - the dashboard row.
 * @returns the ratio, or null when the row has no input tokens.
 */
export declare function cacheHitRatio(row: WindowRow): number | null;
/**
 * Compact token/step formatting: 1234 → "1.2k", 1234567 → "1.2M".
 * @param n - a finite non-negative number.
 * @returns the formatted string ("–" for non-finite values).
 */
export declare function formatTokens(n: number): string;
/** Relative-time bucket for the locale layer. */
export type RelativeTimeUnit = 'now' | 'min' | 'hour' | 'day' | 'week' | 'month' | 'year';
/**
 * Bucket an epoch-ms timestamp relative to `now` for localized display.
 * @param ts - the timestamp (epoch ms).
 * @param now - the current time (epoch ms).
 * @returns the unit and its count.
 */
export declare function relativeTime(ts: number, now: number): {
    unit: RelativeTimeUnit;
    n: number;
};
