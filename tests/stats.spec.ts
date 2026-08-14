// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { SessionId, SessionListState, SessionSummary } from '@deepseek-ai/dsh-client-runtime/client'
import {
  aggregate,
  cacheHitRatio,
  costUsd,
  decodeThroughput,
  deriveRow,
  deriveWindowRows,
  filterRows,
  formatCost,
  formatDuration,
  formatTokens,
  groupByWorkspace,
  hiddenSubagentCount,
  peakDailyTokens,
  relativeTime,
  sortRows,
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

describe('costUsd / formatCost', () => {
  const pricing = { inputHit: 0.003625, inputMiss: 0.435, output: 0.87 }

  it('estimates cost from disjoint buckets and returns null without usage', () => {
    const row = deriveRow(summary({ id: id(1), projectionValues: usage(1000, 100, 500, 200) }))
    // miss = uncached(1000) + cacheWrite(200) = 1200 ; hit = 500 ; output = 100
    const expected = (1200 * 0.435 + 500 * 0.003625 + 100 * 0.87) / 1_000_000
    expect(costUsd(row, pricing)).toBeCloseTo(expected, 12)
    const bare = deriveRow(summary({ id: id(2) }))
    expect(costUsd(bare, pricing)).toBeNull()
  })

  it('formats USD compactly', () => {
    expect(formatCost(12.3)).toBe('$12.30')
    expect(formatCost(0.45)).toBe('$0.450')
    expect(formatCost(0.0234)).toBe('$0.023')
  })
})

describe('filterRows / sortRows / groupByWorkspace', () => {
  const rows = [
    deriveRow(summary({ id: id(1), displayTitle: 'a', running: true, updatedAt: 300, cwd: 'C:\\x\\alpha', projectionValues: usage(10, 0, 0, 0) })),
    deriveRow(summary({ id: id(2), displayTitle: 'b', pendingInteraction: 'question', updatedAt: 200, cwd: 'C:\\x\\alpha', projectionValues: usage(100, 0, 0, 0) })),
    deriveRow(summary({ id: id(3), displayTitle: 'c', updatedAt: 100, cwd: 'C:\\x\\beta', projectionValues: usage(50, 0, 0, 0) })),
  ]

  it('filters by status', () => {
    expect(filterRows(rows, 'running').map(r => r.id)).toEqual([id(1)])
    expect(filterRows(rows, 'waiting').map(r => r.id)).toEqual([id(2)])
    expect(filterRows(rows, 'idle').map(r => r.id)).toEqual([id(3)])
    expect(filterRows(rows, 'all').length).toBe(3)
  })

  it('sorts by input tokens and duration', () => {
    const byInput = sortRows(rows, 'inputTokens')
    expect(byInput[0]?.id).toBe(id(2))
    const byActivity = sortRows(rows, 'activity')
    expect(byActivity[0]?.id).toBe(id(1))
  })

  it('groups by workspace basename', () => {
    const groups = groupByWorkspace(rows)
    expect(groups.map(g => g.title)).toEqual(['alpha', 'beta'])
    expect(groups[0]?.rows.length).toBe(2)
    expect(groups[1]?.rows.length).toBe(1)
  })
})

describe('peakDailyTokens', () => {
  it('returns the max single-day total', () => {
    expect(peakDailyTokens({ '2026-08-01': { input: 10, output: 5 }, '2026-08-02': { input: 1, output: 1 } })).toBe(15)
    expect(peakDailyTokens({})).toBe(0)
  })
})
