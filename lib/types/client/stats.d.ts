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
/** Heuristic composition of the next request's context (never a total). */
export interface ContextBreakdownProjection {
    systemTokens: number;
    toolsTokens: number;
    messageTokens: number;
}
declare module '@deepseek-ai/dsh-session-projection/types' {
    interface SessionProjectionMap {
        tokenUsage: TokenUsageProjection;
        contextPressure: ContextPressureProjection;
        contextBreakdown: ContextBreakdownProjection;
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
    uncachedInputTokens?: number;
    inputTokens?: number;
    outputTokens?: number;
    cacheReadTokens?: number;
    cacheWriteTokens?: number;
    projectedTokens?: number;
    contextWindow?: number;
    /** Wall times (ms) from the whole-log `sessionStats` projection. */
    llmMs?: number;
    toolMs?: number;
    ttftMs?: number;
    ttftSteps?: number;
    decodeMs?: number;
    decodeTokens?: number;
    /** Context composition (heuristic) from `contextBreakdown`. */
    systemTokens?: number;
    toolsTokens?: number;
    messageTokens?: number;
    /** Background jobs / child subagents mirrored from the session list. */
    jobsCount: number;
    subagentCount: number;
    /** Per-day token history (heatmap), when the host unit is mounted. */
    tokenHistory?: TokenHistoryProjection;
}
/** Aggregate figures across the derived rows. */
export interface WindowAggregate {
    total: number;
    running: number;
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens: number;
    cacheWriteTokens: number;
    /** Summed LLM / tool wall time (ms) over rows reporting it. */
    llmMs: number;
    toolMs: number;
    /** Rows that contributed a `tokenUsage` value. */
    counted: number;
}
/** Derivation options. */
export interface DeriveOptions {
    /** Include blank sessions (default false, matching the sidebar browser). */
    includeBlank?: boolean;
    /**
     * Include subagent sessions (default false). Subagents are internal child
     * agents with `origin: 'subagent'`; the sidebar hides them under their
     * parent's catalog, so the dashboard hides them too by default.
     */
    includeSubagents?: boolean;
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
 * @param opts - blank/subagent filtering (defaults hide both).
 * @returns non-blank, non-subagent rows sorted by `updatedAt` descending (stable).
 */
export declare function deriveWindowRows(state: SessionListState, opts: DeriveOptions): WindowRow[];
/**
 * Count sessions the dashboard hides by default (subagents, plus blank rows
 * when blank sessions are excluded).
 * @param state - the `useSessions` snapshot.
 * @returns the number of hidden subagent sessions.
 */
export declare function hiddenSubagentCount(state: SessionListState): number;
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
/**
 * Human wall-time formatting for a millisecond duration: 45s, 3m 12s, 1h 23m, 2d 5h.
 * @param ms - non-negative duration in milliseconds.
 * @returns the formatted string ("–" for non-finite values).
 */
export declare function formatDuration(ms: number): string;
/**
 * Decode throughput in tokens/second over the decode-timed steps.
 * @param row - the dashboard row.
 * @returns tokens/second, or null when the row has no decode timing/usage.
 */
export declare function decodeThroughput(row: WindowRow): number | null;
/**
 * Average first-token latency across the steps that recorded one.
 * @param row - the dashboard row.
 * @returns average TTFT in milliseconds, or null when no step recorded one.
 */
export declare function ttftAverageMs(row: WindowRow): number | null;
/**
 * One-decimal number formatting with a trailing ".0" removed (e.g. 12.3, 5).
 * @param n - a finite number.
 * @returns the formatted string.
 */
export declare function formatOneDecimal(n: number): string;
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
/** Model pricing in USD per 1M tokens. */
export interface ModelPricing {
    inputHit: number;
    inputMiss: number;
    output: number;
}
/**
 * DeepSeek official pricing (snapshot 2026-08-14 from
 * https://api-docs.deepseek.com/quick_start/pricing/). Update here when the
 * upstream page changes.
 */
export declare const DEFAULT_PRICING: Readonly<Record<string, ModelPricing>>;
/**
 * Estimate the USD cost of one session's recorded usage.
 * Cache reads are billed at the hit price; uncached input and cache writes at
 * the miss price; output at the output price.
 * @param row - the dashboard row.
 * @param pricing - the model pricing to apply.
 * @returns cost in USD, or null when the row has no usage.
 */
export declare function costUsd(row: WindowRow, pricing: ModelPricing): number | null;
/** Format a USD cost compactly: $12.30, $0.45, $0.0234. */
export declare function formatCost(usd: number): string;
/** Sort keys for the overview table. */
export type SortKey = 'activity' | 'inputTokens' | 'duration';
/** Status filter buckets for the overview table. */
export type StatusFilter = 'all' | 'running' | 'waiting' | 'idle';
/**
 * Filter rows by status bucket.
 * @param rows - the derived rows.
 * @param status - the bucket to keep.
 * @returns the filtered rows.
 */
export declare function filterRows(rows: readonly WindowRow[], status: StatusFilter): WindowRow[];
/**
 * Sort rows by the given key (stable tie-break by activity).
 * @param rows - the derived rows.
 * @param key - the sort key.
 * @returns a new sorted array.
 */
export declare function sortRows(rows: readonly WindowRow[], key: SortKey): WindowRow[];
/** One workspace group (sessions sharing a cwd). */
export interface WorkspaceGroup {
    title: string;
    rows: WindowRow[];
}
/**
 * Group rows by workspace (cwd), preserving the input order inside each group.
 * @param rows - the derived rows (already sorted).
 * @returns groups ordered by their first row's position.
 */
export declare function groupByWorkspace(rows: readonly WindowRow[]): WorkspaceGroup[];
/** One day of token history (input/output). */
export interface TokenHistoryDay {
    input: number;
    output: number;
}
/** Per-day token history keyed by UTC day `YYYY-MM-DD`. */
export type TokenHistoryProjection = Record<string, TokenHistoryDay>;
declare module '@deepseek-ai/dsh-session-projection/types' {
    interface SessionProjectionMap {
        tokenHistory: TokenHistoryProjection;
    }
}
/**
 * Peak daily token total (input + output) across the history.
 * @param history - the per-day token history.
 * @returns the maximum single-day total (0 when empty).
 */
export declare function peakDailyTokens(history: Readonly<TokenHistoryProjection>): number;
