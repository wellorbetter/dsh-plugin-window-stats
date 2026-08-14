// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import type { SessionId, SessionListState, SessionSummary } from '@deepseek-ai/dsh-client-runtime/client'
import { WindowStatsView } from '../src/client/WindowStatsView.tsx'

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

function stateOf(rows: SessionSummary[]): SessionListState {
  const byId = {} as Record<SessionId, SessionSummary>
  const ids: SessionId[] = []
  for (const row of rows) {
    byId[row.id] = row
    ids.push(row.id)
  }
  return { ids, byId, current: undefined, phase: 'ready', subagentsByParent: {}, jobsBySession: {}, currentAddress: undefined } as SessionListState
}

function fakeT(): (key: string, params?: Record<string, unknown>) => string {
  return (key, params) => (params === undefined ? key : `${key}[${Object.values(params).join(',')}]`)
}

function makeProps(rows: SessionSummary[], open: (s: SessionId) => void = () => {}) {
  return {
    useSessions: () => stateOf(rows),
    open,
    t: fakeT(),
  } as unknown as Parameters<typeof WindowStatsView>[0]
}

describe('WindowStatsView', () => {
  it('renders an empty state when there are no non-blank sessions', () => {
    const { container } = render(<WindowStatsView {...makeProps([])} />)
    expect(container.textContent).toContain('empty.title')
  })

  it('renders a header with totals and one row per session', () => {
    const rows = [
      summary({
        id: id(1),
        displayTitle: 'Fix the build',
        running: true,
        updatedAt: 1000,
        projectionValues: {
          tokenUsage: { uncachedInputTokens: 100, outputTokens: 50, cacheReadTokens: 20, cacheWriteTokens: 5 },
          sessionStats: { turns: 2, steps: 4, llmMs: 10, toolMs: 20, ttftMs: 3, ttftSteps: 4, decodeMs: 5, decodeTokens: 50 },
          contextPressure: { projectedTokens: 400, contextWindow: 8000 },
        },
      }),
      summary({
        id: id(2),
        displayTitle: 'Review PR',
        running: false,
        pendingInteraction: 'question',
        updatedAt: 2000,
        projectionValues: {
          tokenUsage: { uncachedInputTokens: 200, outputTokens: 30, cacheReadTokens: 40, cacheWriteTokens: 5 },
          sessionStats: { turns: 1, steps: 2, llmMs: 8, toolMs: 12, ttftMs: 2, ttftSteps: 2, decodeMs: 4, decodeTokens: 30 },
        },
      }),
    ]
    const { container, getAllByRole } = render(<WindowStatsView {...makeProps(rows)} />)
    expect(container.textContent).toContain('Fix the build')
    expect(container.textContent).toContain('Review PR')
    // header totals: 2 sessions, 1 running, in = 125 + 245 = 370, out = 80
    expect(container.textContent).toContain('370')
    expect(container.textContent).toContain('80')
    // progress "2 / 4" and "1 / 2"
    expect(container.textContent).toContain('2 / 4')
    expect(container.textContent).toContain('1 / 2')
    expect(getAllByRole('row').length).toBe(3) // header + 2 rows
  })

  it('opens a session when a row is activated', () => {
    const open = vi.fn()
    const rows = [summary({ id: id(7), displayTitle: 'Click me', updatedAt: 1 })]
    const { getByText } = render(<WindowStatsView {...makeProps(rows, open)} />)
    fireEvent.click(getByText('Click me'))
    expect(open).toHaveBeenCalledWith(id(7))
  })

  it('shows – for missing token cells instead of NaN', () => {
    const rows = [summary({ id: id(1), displayTitle: 'No usage', updatedAt: 1 })]
    const { container } = render(<WindowStatsView {...makeProps(rows)} />)
    expect(container.textContent).toContain('–')
    expect(container.textContent).not.toContain('NaN')
  })
})
