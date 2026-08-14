/**
 * Pure derivation of the 「窗口统计」 (Window Stats) row model from the client
 * session-list snapshot. No React, no I/O, no subscriptions — the view and the
 * tests consume the same functions.
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/stats
 */
import type {
  PendingInteractionStatus,
  SessionId,
  SessionListState,
  SessionSummary,
} from '@deepseek-ai/dsh-client-runtime/client'

// The projection key shapes below restate the public wire contracts of the
// token-meter and session-stats host units (they are delivered to the client
// verbatim on `session.list` rows and `session/projection` push frames).
/** Provider-reported cumulative usage for one session log (four disjoint buckets). */
export interface TokenUsageProjection {
  uncachedInputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
}

/** Approximate context occupancy reference (fields are independent last-wins records). */
export interface ContextPressureProjection {
  pressureTokens?: number
  projectedTokens?: number
  contextWindow?: number
}

/** Whole-log turn/step counts and wall times (compaction-independent). */
export interface SessionStatsProjection {
  turns: number
  steps: number
  llmMs: number
  toolMs: number
  ttftMs: number
  ttftSteps: number
  decodeMs: number
  decodeTokens: number
}

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionMap {
    tokenUsage: TokenUsageProjection
    contextPressure: ContextPressureProjection
    sessionStats: SessionStatsProjection
  }
}

/** One dashboard row, derived from a `SessionSummary` plus its projections. */
export interface WindowRow {
  id: SessionId
  /** Human-facing label: `displayTitle`, falling back to the id tail. */
  title: string
  cwd?: string
  running: boolean
  pendingInteraction?: PendingInteractionStatus
  completed: boolean
  blank: boolean
  updatedAt: number
  turns?: number
  steps?: number
  inputTokens?: number
  outputTokens?: number
  cacheReadTokens?: number
  cacheWriteTokens?: number
  projectedTokens?: number
  contextWindow?: number
}

/** Aggregate figures across the derived rows. */
export interface WindowAggregate {
  total: number
  running: number
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  /** Rows that contributed a `tokenUsage` value. */
  counted: number
}

/** Derivation options. */
export interface DeriveOptions {
  /** Include blank sessions (default false, matching the sidebar browser). */
  includeBlank: boolean
}

const ID_TAIL_LENGTH = 8

/** Fallback title: the last characters of the session id. */
function idTail(id: SessionId): string {
  return id.length > ID_TAIL_LENGTH ? id.slice(-ID_TAIL_LENGTH) : id
}

/**
 * Derive one row from a `SessionSummary`.
 * @param summary - the list row.
 * @returns the row with projection values copied (absent keys stay undefined).
 */
export function deriveRow(summary: SessionSummary): WindowRow {
  const usage = summary.projectionValues?.tokenUsage
  const stats = summary.projectionValues?.sessionStats
  const pressure = summary.projectionValues?.contextPressure
  return {
    id: summary.id,
    title: summary.displayTitle.length > 0 ? summary.displayTitle : idTail(summary.id),
    ...(summary.cwd !== undefined ? { cwd: summary.cwd } : {}),
    running: summary.running,
    ...(summary.pendingInteraction !== undefined ? { pendingInteraction: summary.pendingInteraction } : {}),
    completed: summary.completed === true,
    blank: summary.blank,
    updatedAt: summary.updatedAt,
    ...(stats !== undefined ? { turns: stats.turns, steps: stats.steps } : {}),
    ...(usage !== undefined
      ? {
        inputTokens: usage.uncachedInputTokens + usage.cacheReadTokens + usage.cacheWriteTokens,
        outputTokens: usage.outputTokens,
        cacheReadTokens: usage.cacheReadTokens,
        cacheWriteTokens: usage.cacheWriteTokens,
      }
      : {}),
    ...(pressure !== undefined
      ? {
        ...(pressure.projectedTokens !== undefined ? { projectedTokens: pressure.projectedTokens } : {}),
        ...(pressure.contextWindow !== undefined ? { contextWindow: pressure.contextWindow } : {}),
      }
      : {}),
  }
}

/**
 * Derive the ordered dashboard rows from a session-list snapshot.
 * @param state - the `useSessions` snapshot.
 * @param opts - blank filtering (default hides blank rows).
 * @returns non-blank rows sorted by `updatedAt` descending (stable).
 */
export function deriveWindowRows(state: SessionListState, opts: DeriveOptions): WindowRow[] {
  const rows: WindowRow[] = []
  for (const id of state.ids) {
    const summary = state.byId[id]
    if (summary === undefined) continue
    if (summary.blank && !opts.includeBlank) continue
    rows.push(deriveRow(summary))
  }
  rows.sort((a, b) => b.updatedAt - a.updatedAt)
  return rows
}

/**
 * Aggregate totals across derived rows.
 * @param rows - the dashboard rows.
 * @returns counts and token sums (rows without a value contribute zero).
 */
export function aggregate(rows: readonly WindowRow[]): WindowAggregate {
  let running = 0
  let inputTokens = 0
  let outputTokens = 0
  let cacheReadTokens = 0
  let cacheWriteTokens = 0
  let counted = 0
  for (const row of rows) {
    if (row.running) running += 1
    if (row.inputTokens !== undefined) {
      inputTokens += row.inputTokens
      outputTokens += row.outputTokens ?? 0
      cacheReadTokens += row.cacheReadTokens ?? 0
      cacheWriteTokens += row.cacheWriteTokens ?? 0
      counted += 1
    }
  }
  return { total: rows.length, running, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, counted }
}

/**
 * Cache-hit ratio for one row, clamped to [0, 1].
 * @param row - the dashboard row.
 * @returns the ratio, or null when the row has no input tokens.
 */
export function cacheHitRatio(row: WindowRow): number | null {
  if (row.inputTokens === undefined || row.inputTokens <= 0) return null
  const reads = row.cacheReadTokens ?? 0
  return Math.min(1, Math.max(0, reads / row.inputTokens))
}

/**
 * Compact token/step formatting: 1234 → "1.2k", 1234567 → "1.2M".
 * @param n - a finite non-negative number.
 * @returns the formatted string ("–" for non-finite values).
 */
export function formatTokens(n: number): string {
  if (!Number.isFinite(n) || n < 0) return '–'
  if (n < 1000) return String(Math.floor(n))
  if (n < 1_000_000) return trimTenths(n / 1000) + 'k'
  return trimTenths(n / 1_000_000) + 'M'
}

/** One-decimal formatting with a trailing ".0" removed. */
function trimTenths(value: number): string {
  const tenths = Math.floor(value * 10) / 10
  return Number.isInteger(tenths) ? String(tenths) : tenths.toFixed(1)
}

/** Relative-time bucket for the locale layer. */
export type RelativeTimeUnit = 'now' | 'min' | 'hour' | 'day' | 'week' | 'month' | 'year'

/**
 * Bucket an epoch-ms timestamp relative to `now` for localized display.
 * @param ts - the timestamp (epoch ms).
 * @param now - the current time (epoch ms).
 * @returns the unit and its count.
 */
export function relativeTime(ts: number, now: number): { unit: RelativeTimeUnit; n: number } {
  const seconds = Math.max(0, Math.floor((now - ts) / 1000))
  if (seconds < 60) return { unit: 'now', n: 0 }
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return { unit: 'min', n: minutes }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return { unit: 'hour', n: hours }
  const days = Math.floor(hours / 24)
  if (days < 7) return { unit: 'day', n: days }
  const weeks = Math.floor(days / 7)
  if (days < 30) return { unit: 'week', n: weeks }
  const months = Math.floor(days / 30)
  if (days < 365) return { unit: 'month', n: months }
  return { unit: 'year', n: Math.floor(days / 365) }
}
