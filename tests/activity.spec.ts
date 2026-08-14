// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { ConversationSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import { deriveActivity } from '../src/client/activity.ts'

function toolResult(time: number, name: string, callTime: number) {
  return { kind: 'tool-result', seq: 0, time, callId: `c-${name}-${time}`, call: { name, argsRaw: '' }, callTime, content: [], isError: false }
}

function user(time: number, text: string) {
  return { kind: 'user', seq: 0, time, content: [{ type: 'text', text }], source: undefined }
}

function snapshot(nodes: unknown[], turnTimings: Map<number, { startTime: number; endTime?: number }>) {
  return { nodes, turnTimings } as unknown as ConversationSnapshot
}

describe('deriveActivity', () => {
  it('buckets tool calls by name and sums their durations', () => {
    const nodes = [
      toolResult(1000, 'web', 800),
      toolResult(1100, 'web', 900),
      toolResult(2000, 'bash', 1500),
    ]
    const report = deriveActivity(snapshot(nodes, new Map()), 3000, null)
    expect(report.totalToolCalls).toBe(3)
    expect(report.totalToolMs).toBe(200 + 200 + 500)
    const web = report.tools.find(t => t.name === 'web')
    expect(web).toEqual({ name: 'web', count: 2, durationMs: 400 })
  })

  it('filters tool calls and turns by the time range', () => {
    const nodes = [
      toolResult(500_000, 'web', 480_000),
      toolResult(100_000, 'bash', 80_000),
    ]
    const report = deriveActivity(snapshot(nodes, new Map()), 1_000_000, 10 * 60_000)
    expect(report.totalToolCalls).toBe(1)
    expect(report.tools.map(t => t.name)).toEqual(['web'])
  })

  it('summarizes turns with prompt excerpt and in-turn tools', () => {
    const nodes = [
      user(100, 'fix the login timeout'),
      toolResult(200, 'read', 150),
      toolResult(300, 'edit', 250),
      user(1000, 'run tests'),
      toolResult(1100, 'bash', 1050),
    ]
    const timings = new Map<number, { startTime: number; endTime?: number }>([
      [1, { startTime: 100, endTime: 500 }],
      [2, { startTime: 1000, endTime: 1200 }],
    ])
    const report = deriveActivity(snapshot(nodes, timings), 2000, null)
    expect(report.turnCount).toBe(2)
    const t1 = report.turns.find(t => t.turn === 1)
    expect(t1?.prompt).toBe('fix the login timeout')
    expect(t1?.tools).toEqual(['read', 'edit'])
    expect(t1?.toolCount).toBe(2)
    expect(t1?.durationMs).toBe(400)
    const t2 = report.turns.find(t => t.turn === 2)
    expect(t2?.tools).toEqual(['bash'])
  })
})
