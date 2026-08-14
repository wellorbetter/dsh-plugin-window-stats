// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { SessionId, SessionListState, SessionSummary } from '@deepseek-ai/dsh-client-runtime/client'
import {
  aggregate,
  cacheHitRatio,
  decodeThroughput,
  deriveRow,
  deriveWindowRows,
  formatDuration,
  formatTokens,
  hiddenSubagentCount,
  relativeTime,
  ttftAverageMs,
} from '../src/client/stats.ts'

const id = (n: number): SessionId => `session-${n}` as SessionId

function summary(overrides: Partial<SessionSummary> & { id: SessionId }): SessionSummary {
  return {
    displayTitle: `S${overrides.id}`,
    running: false,
    blank: false,
    updatedAt: 0,
    ...overrides,
  } as SessionSummary
}

function usage(
  uncachedInputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  cacheWriteTokens: number,
): { tokenUsage: { uncachedInputTokens: number; outputTokens: number; cacheReadTokens: number; cacheWriteTokens: number } } {
  return { tokenUsage: { uncachedInputTokens, outputTokens, cacheReadTokens, cacheWriteTokens } }
}

function stateOf(rows: SessionSummary[]): SessionListState {
  const byId = {} as Record<SessionId, SessionSummary>
  const ids: SessionId[] = []
  for (const row of rows) {
    byId[row.id] = row
    ids.push(row.id)
  }
  return {
    ids,
    byId,
    current: undefined,
    phase: 'ready',
    subagentsByParent: {},
    jobsBySession: {},
    currentAddress: undefined,
  } as SessionListState
}

describe('deriveRow', () => {
  it('copies title, status, and projection values', () => {
    const row = deriveRow(summary({
      id: id(1),
      displayTitle: 'Fix the build',
      running: true,
      pendingInteraction: 'approval',
      completed: true,
      updatedAt: 123,
      projectionValues: {
        ...usage(100, 50, 20, 5),
        sessionStats: { turns: 2, steps: 4, llmMs: 10, toolMs: 20, ttftMs: 3, ttftSteps: 4, decodeMs: 5, decodeTokens: 50 },
        contextPressure: { projectedTokens: 400, contextWindow: 8000 },
      },
    }))
    expect(row.title).toBe('Fix the build')
    expect(row.running).toBe(true)
    expect(row.pendingInteraction).toBe('approval')
    expect(row.completed).toBe(true)
    expect(row.turns).toBe(2)
    expect(row.steps).toBe(4)
    expect(row.inputTokens).toBe(125) // 100 + 20 + 5
    expect(row.outputTokens).toBe(50)
    expect(row.cacheReadTokens).toBe(20)
    expect(row.cacheWriteTokens).toBe(5)
    expect(row.projectedTokens).toBe(400)
    expect(row.contextWindow).toBe(8000)
  })

  it('leaves absent projection fields undefined and falls back on the id tail for titles', () => {
    const row = deriveRow(summary({ id: id(123456789), displayTitle: '' }))
    expect(row.title).toBe('23456789') // last 8 chars of 'session-123456789'
    expect(row.turns).toBeUndefined()
    expect(row.inputTokens).toBeUndefined()
    expect(row.projectedTokens).toBeUndefined()
    expect(row.completed).toBe(false)
  })
})

describe('deriveWindowRows', () => {
  it('filters blank rows and sorts by updatedAt descending', () => {
    const rows = deriveWindowRows(stateOf([
      summary({ id: id(1), updatedAt: 100, displayTitle: 'older' }),
      summary({ id: id(2), updatedAt: 300, displayTitle: 'newest' }),
      summary({ id: id(3), updatedAt: 200, displayTitle: 'blank', blank: true }),
    ]), { includeBlank: false })
    expect(rows.map(r => r.id)).toEqual([id(2), id(1)])
  })

  it('includes blank rows when opted in', () => {
    const rows = deriveWindowRows(stateOf([
      summary({ id: id(1), updatedAt: 100, blank: true }),
      summary({ id: id(2), updatedAt: 300 }),
    ]), { includeBlank: true })
    expect(rows.map(r => r.id)).toEqual([id(2), id(1)])
  })

  it('filters subagent sessions by default and can include them', () => {
    const rows = deriveWindowRows(stateOf([
      summary({ id: id(1), updatedAt: 300, displayTitle: 'top-level' }),
      summary({ id: id(2), updatedAt: 200, displayTitle: 'subagent', origin: 'subagent' }),
    ]), { includeBlank: false })
    expect(rows.map(r => r.id)).toEqual([id(1)])

    const withSubagents = deriveWindowRows(stateOf([
      summary({ id: id(1), updatedAt: 300, displayTitle: 'top-level' }),
      summary({ id: id(2), updatedAt: 200, displayTitle: 'subagent', origin: 'subagent' }),
    ]), { includeBlank: false, includeSubagents: true })
    expect(withSubagents.map(r => r.id)).toEqual([id(1), id(2)])
  })
})

describe('hiddenSubagentCount', () => {
  it('counts subagent sessions only', () => {
    const count = hiddenSubagentCount(stateOf([
      summary({ id: id(1), displayTitle: 'a', origin: 'subagent' }),
      summary({ id: id(2), displayTitle: 'b', origin: 'subagent' }),
      summary({ id: id(3), displayTitle: 'c' }),
    ]))
    expect(count).toBe(2)
  })
})

describe('aggregate', () => {
  it('sums tokens over rows that report usage', () => {
    const s1 = deriveRow(summary({ id: id(1), running: true, updatedAt: 1, projectionValues: usage(100, 10, 20, 5) }))
    const s2 = deriveRow(summary({ id: id(2), running: false, updatedAt: 2, projectionValues: usage(200, 30, 40, 5) }))
    const s3 = deriveRow(summary({ id: id(3), running: false, updatedAt: 3 }))
    const agg = aggregate([s1, s2, s3])
    expect(agg.total).toBe(3)
    expect(agg.running).toBe(1)
    expect(agg.inputTokens).toBe(125 + 245)
    expect(agg.outputTokens).toBe(10 + 30)
    expect(agg.cacheReadTokens).toBe(20 + 40)
    expect(agg.cacheWriteTokens).toBe(5 + 5)
    expect(agg.counted).toBe(2)
  })
})

describe('cacheHitRatio', () => {
  it('returns the clamped ratio and null when input is missing or zero', () => {
    const noUsage = deriveRow(summary({ id: id(1) }))
    expect(cacheHitRatio(noUsage)).toBeNull()
    const zeroInput = deriveRow(summary({ id: id(1), projectionValues: usage(0, 0, 0, 0) }))
    expect(cacheHitRatio(zeroInput)).toBeNull()
    const fullCache = deriveRow(summary({ id: id(2), projectionValues: usage(0, 0, 100, 0) }))
    expect(cacheHitRatio(fullCache)).toBe(1)
    const row3 = deriveRow(summary({ id: id(3), projectionValues: usage(60, 0, 20, 0) }))
    expect(cacheHitRatio(row3)).toBe(0.25)
  })
})

describe('formatTokens', () => {
  it('formats k and M with one decimal and passes small numbers through', () => {
    expect(formatTokens(0)).toBe('0')
    expect(formatTokens(999)).toBe('999')
    expect(formatTokens(1234)).toBe('1.2k')
    expect(formatTokens(1500)).toBe('1.5k')
    expect(formatTokens(1_234_567)).toBe('1.2M')
    expect(formatTokens(Number.NaN)).toBe('–')
    expect(formatTokens(-1)).toBe('–')
  })
})

describe('relativeTime', () => {
  const now = 1_000_000
  it('buckets by elapsed time', () => {
    expect(relativeTime(now - 500, now)).toEqual({ unit: 'now', n: 0 })
    expect(relativeTime(now - 90_000, now)).toEqual({ unit: 'min', n: 1 })
    expect(relativeTime(now - 3_600_000, now)).toEqual({ unit: 'hour', n: 1 })
    expect(relativeTime(now - 86_400_000, now)).toEqual({ unit: 'day', n: 1 })
    expect(relativeTime(now - 14 * 86_400_000, now)).toEqual({ unit: 'week', n: 2 })
    expect(relativeTime(now - 60 * 86_400_000, now)).toEqual({ unit: 'month', n: 2 })
    expect(relativeTime(now - 400 * 86_400_000, now)).toEqual({ unit: 'year', n: 1 })
  })
})

describe('formatDuration', () => {
  it('formats seconds, minutes, hours, and days', () => {
    expect(formatDuration(0)).toBe('0s')
    expect(formatDuration(45_000)).toBe('45s')
    expect(formatDuration(3 * 60_000 + 12_000)).toBe('3m 12s')
    expect(formatDuration(1 * 3_600_000 + 23 * 60_000)).toBe('1h 23m')
    expect(formatDuration(2 * 86_400_000 + 5 * 3_600_000)).toBe('2d 5h')
    expect(formatDuration(Number.NaN)).toBe('–')
  })
})

describe('decodeThroughput / ttftAverageMs', () => {
  it('computes throughput and average TTFT, null when absent', () => {
    const row = deriveRow(summary({
      id: id(1),
      projectionValues: {
        sessionStats: { turns: 1, steps: 1, llmMs: 100, toolMs: 50, ttftMs: 300, ttftSteps: 2, decodeMs: 500, decodeTokens: 1000 },
      },
    }))
    expect(decodeThroughput(row)).toBe(2000)
    expect(ttftAverageMs(row)).toBe(150)
    const bare = deriveRow(summary({ id: id(2) }))
    expect(decodeThroughput(bare)).toBeNull()
    expect(ttftAverageMs(bare)).toBeNull()
  })
})
