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

/** Heuristic composition of the next request's context (never a total). */
export interface ContextBreakdownProjection {
  systemTokens: number
  toolsTokens: number
  messageTokens: number
}

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionMap {
    tokenUsage: TokenUsageProjection
    contextPressure: ContextPressureProjection
    contextBreakdown: ContextBreakdownProjection
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
  uncachedInputTokens?: number
  inputTokens?: number
  outputTokens?: number
  cacheReadTokens?: number
  cacheWriteTokens?: number
  projectedTokens?: number
  contextWindow?: number
  /** Wall times (ms) from the whole-log `sessionStats` projection. */
  llmMs?: number
  toolMs?: number
  ttftMs?: number
  ttftSteps?: number
  decodeMs?: number
  decodeTokens?: number
  /** Context composition (heuristic) from `contextBreakdown`. */
  systemTokens?: number
  toolsTokens?: number
  messageTokens?: number
  /** Background jobs / child subagents mirrored from the session list. */
  jobsCount: number
  subagentCount: number
  /** Per-day token history (heatmap), when the host unit is mounted. */
  tokenHistory?: TokenHistoryProjection
}

/** Aggregate figures across the derived rows. */
export interface WindowAggregate {
  total: number
  running: number
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  /** Summed LLM / tool wall time (ms) over rows reporting it. */
  llmMs: number
  toolMs: number
  /** Rows that contributed a `tokenUsage` value. */
  counted: number
}

/** Derivation options. */
export interface DeriveOptions {
  /** Include blank sessions (default false, matching the sidebar browser). */
  includeBlank?: boolean
  /**
   * Include subagent sessions (default false). Subagents are internal child
   * agents with `origin: 'subagent'`; the sidebar hides them under their
   * parent's catalog, so the dashboard hides them too by default.
   */
  includeSubagents?: boolean
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
  const breakdown = summary.projectionValues?.contextBreakdown
  return {
    id: summary.id,
    title: summary.displayTitle.length > 0 ? summary.displayTitle : idTail(summary.id),
    ...(summary.cwd !== undefined ? { cwd: summary.cwd } : {}),
    running: summary.running,
    ...(summary.pendingInteraction !== undefined ? { pendingInteraction: summary.pendingInteraction } : {}),
    completed: summary.completed === true,
    blank: summary.blank,
    updatedAt: summary.updatedAt,
    jobsCount: 0,
    subagentCount: 0,
    ...(stats !== undefined
      ? {
        turns: stats.turns,
        steps: stats.steps,
        llmMs: stats.llmMs,
        toolMs: stats.toolMs,
        ttftMs: stats.ttftMs,
        ttftSteps: stats.ttftSteps,
        decodeMs: stats.decodeMs,
        decodeTokens: stats.decodeTokens,
      }
      : {}),
    ...(usage !== undefined
      ? {
        uncachedInputTokens: usage.uncachedInputTokens,
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
    ...(breakdown !== undefined
      ? {
        systemTokens: breakdown.systemTokens,
        toolsTokens: breakdown.toolsTokens,
        messageTokens: breakdown.messageTokens,
      }
      : {}),
    ...(summary.projectionValues?.tokenHistory !== undefined
      ? { tokenHistory: summary.projectionValues.tokenHistory }
      : {}),
  }
}

/**
 * Derive the ordered dashboard rows from a session-list snapshot.
 * @param state - the `useSessions` snapshot.
 * @param opts - blank/subagent filtering (defaults hide both).
 * @returns non-blank, non-subagent rows sorted by `updatedAt` descending (stable).
 */
export function deriveWindowRows(state: SessionListState, opts: DeriveOptions): WindowRow[] {
  const rows: WindowRow[] = []
  for (const id of state.ids) {
    const summary = state.byId[id]
    if (summary === undefined) continue
    if (summary.blank && !opts.includeBlank) continue
    if (summary.origin === 'subagent' && !opts.includeSubagents) continue
    const row = deriveRow(summary)
    row.jobsCount = state.jobsBySession[id]?.length ?? 0
    row.subagentCount = state.subagentsByParent[id]?.entries.length ?? 0
    rows.push(row)
  }
  rows.sort((a, b) => b.updatedAt - a.updatedAt)
  return rows
}

/**
 * Count sessions the dashboard hides by default (subagents, plus blank rows
 * when blank sessions are excluded).
 * @param state - the `useSessions` snapshot.
 * @returns the number of hidden subagent sessions.
 */
export function hiddenSubagentCount(state: SessionListState): number {
  let count = 0
  for (const id of state.ids) {
    const summary = state.byId[id]
    if (summary !== undefined && summary.origin === 'subagent') count += 1
  }
  return count
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
  let llmMs = 0
  let toolMs = 0
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
    llmMs += row.llmMs ?? 0
    toolMs += row.toolMs ?? 0
  }
  return { total: rows.length, running, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, llmMs, toolMs, counted }
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

/**
 * Human wall-time formatting for a millisecond duration: 45s, 3m 12s, 1h 23m, 2d 5h.
 * @param ms - non-negative duration in milliseconds.
 * @returns the formatted string ("–" for non-finite values).
 */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '–'
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ${minutes % 60}m`
  return `${Math.floor(hours / 24)}d ${hours % 24}h`
}

/**
 * Decode throughput in tokens/second over the decode-timed steps.
 * @param row - the dashboard row.
 * @returns tokens/second, or null when the row has no decode timing/usage.
 */
export function decodeThroughput(row: WindowRow): number | null {
  if (row.decodeMs === undefined || row.decodeTokens === undefined || row.decodeMs <= 0) return null
  return (row.decodeTokens / row.decodeMs) * 1000
}

/**
 * Average first-token latency across the steps that recorded one.
 * @param row - the dashboard row.
 * @returns average TTFT in milliseconds, or null when no step recorded one.
 */
export function ttftAverageMs(row: WindowRow): number | null {
  if (row.ttftMs === undefined || row.ttftSteps === undefined || row.ttftSteps <= 0) return null
  return row.ttftMs / row.ttftSteps
}

/**
 * One-decimal number formatting with a trailing ".0" removed (e.g. 12.3, 5).
 * @param n - a finite number.
 * @returns the formatted string.
 */
export function formatOneDecimal(n: number): string {
  if (!Number.isFinite(n)) return '–'
  const tenths = Math.round(n * 10) / 10
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

// ---------------------------------------------------------------------------
// Cost estimation (USD, per 1M tokens) and per-day token history.
// ---------------------------------------------------------------------------

/** Model pricing in USD per 1M tokens. */
export interface ModelPricing {
  inputHit: number
  inputMiss: number
  output: number
}

/**
 * DeepSeek official pricing (snapshot 2026-08-14 from
 * https://api-docs.deepseek.com/quick_start/pricing/). Update here when the
 * upstream page changes.
 */
export const DEFAULT_PRICING: Readonly<Record<string, ModelPricing>> = {
  'deepseek-v4-flash': { inputHit: 0.0028, inputMiss: 0.14, output: 0.28 },
  'deepseek-v4-pro': { inputHit: 0.003625, inputMiss: 0.435, output: 0.87 },
}

/**
 * Estimate the USD cost of one session's recorded usage.
 * Cache reads are billed at the hit price; uncached input and cache writes at
 * the miss price; output at the output price.
 * @param row - the dashboard row.
 * @param pricing - the model pricing to apply.
 * @returns cost in USD, or null when the row has no usage.
 */
export function costUsd(row: WindowRow, pricing: ModelPricing): number | null {
  if (row.inputTokens === undefined) return null
  const miss = (row.uncachedInputTokens ?? 0) + (row.cacheWriteTokens ?? 0)
  const hit = row.cacheReadTokens ?? 0
  const output = row.outputTokens ?? 0
  return (miss * pricing.inputMiss + hit * pricing.inputHit + output * pricing.output) / 1_000_000
}

/** A display currency with its USD exchange rate (units per 1 USD). */
export interface Currency {
  code: string
  symbol: string
  rate: number
}

/** Approximate exchange rates (snapshot 2026-08; update as needed). */
export const CURRENCIES: readonly Currency[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'CNY', symbol: '¥', rate: 7.2 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'JPY', symbol: '¥', rate: 150 },
]

/**
 * Format a USD cost in the given currency: $12.30, ¥88.56, €11.32, ¥1,320.
 * @param usd - cost in USD.
 * @param currency - display currency (default USD).
 */
export function formatCost(usd: number, currency: Currency = CURRENCIES[0]!): string {
  if (!Number.isFinite(usd) || usd < 0) return '–'
  const amount = usd * currency.rate
  if (currency.code === 'JPY') return `${currency.symbol}${Math.round(amount)}`
  let decimals = 2
  if (amount >= 100) decimals = 0
  else if (amount < 1) decimals = 3
  else if (amount < 0.01) decimals = 4
  return `${currency.symbol}${amount.toFixed(decimals)}`
}

/** Sort keys for the overview table. */
export type SortKey = 'activity' | 'inputTokens' | 'duration'

/** Status filter buckets for the overview table. */
export type StatusFilter = 'all' | 'running' | 'waiting' | 'idle'

/** Whether a row is in a waiting state (pending interaction). */
function isWaiting(row: WindowRow): boolean {
  return row.pendingInteraction !== undefined
}

/**
 * Filter rows by status bucket.
 * @param rows - the derived rows.
 * @param status - the bucket to keep.
 * @returns the filtered rows.
 */
export function filterRows(rows: readonly WindowRow[], status: StatusFilter): WindowRow[] {
  switch (status) {
    case 'running': return rows.filter(r => r.running)
    case 'waiting': return rows.filter(isWaiting)
    case 'idle': return rows.filter(r => !r.running && !isWaiting(r))
    case 'all': return [...rows]
  }
}

/**
 * Sort rows by the given key (stable tie-break by activity).
 * @param rows - the derived rows.
 * @param key - the sort key.
 * @returns a new sorted array.
 */
export function sortRows(rows: readonly WindowRow[], key: SortKey): WindowRow[] {
  const copy = [...rows]
  switch (key) {
    case 'inputTokens':
      copy.sort((a, b) => (b.inputTokens ?? -1) - (a.inputTokens ?? -1))
      return copy
    case 'duration': {
      const dur = (r: WindowRow): number => (r.llmMs ?? 0) + (r.toolMs ?? 0)
      copy.sort((a, b) => dur(b) - dur(a))
      return copy
    }
    case 'activity':
      copy.sort((a, b) => b.updatedAt - a.updatedAt)
      return copy
  }
}

/** One workspace group (sessions sharing a cwd). */
export interface WorkspaceGroup {
  title: string
  rows: WindowRow[]
}

/** Basename of a path (workspace title fallback). */
function basename(path: string): string {
  const norm = path.replace(/[\\/]+$/, '')
  const idx = Math.max(norm.lastIndexOf('\\'), norm.lastIndexOf('/'))
  return idx >= 0 ? norm.slice(idx + 1) : norm
}

/**
 * Group rows by workspace (cwd), preserving the input order inside each group.
 * @param rows - the derived rows (already sorted).
 * @returns groups ordered by their first row's position.
 */
export function groupByWorkspace(rows: readonly WindowRow[]): WorkspaceGroup[] {
  const groups: WorkspaceGroup[] = []
  const index = new Map<string, WorkspaceGroup>()
  for (const row of rows) {
    const title = row.cwd !== undefined && row.cwd.length > 0 ? basename(row.cwd) : 'ungrouped'
    let group = index.get(title)
    if (group === undefined) {
      group = { title, rows: [] }
      index.set(title, group)
      groups.push(group)
    }
    group.rows.push(row)
  }
  return groups
}

/** One day of token history (input/output). */
export interface TokenHistoryDay {
  input: number
  output: number
}

/** Per-day token history keyed by UTC day `YYYY-MM-DD`. */
export type TokenHistoryProjection = Record<string, TokenHistoryDay>

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionMap {
    tokenHistory: TokenHistoryProjection
  }
}

/**
 * Peak daily token total (input + output) across the history.
 * @param history - the per-day token history.
 * @returns the maximum single-day total (0 when empty).
 */
export function peakDailyTokens(history: Readonly<TokenHistoryProjection>): number {
  let peak = 0
  for (const key of Object.keys(history)) {
    const day = history[key]
    if (day === undefined) continue
    const total = day.input + day.output
    if (total > peak) peak = total
  }
  return peak
}
