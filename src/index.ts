/**
 * Host half of @wellorbetter/dsh-plugin-window-stats: registers the
 * `tokenHistory` session projection — a per-day fold of `assistant/message`
 * usage into input/output token totals, so the client can render a token
 * consumption heatmap without a separate host service.
 *
 * @module @wellorbetter/dsh-plugin-window-stats
 */
import type { Context } from '@deepseek-ai/cordis'
import { z } from 'zod'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
// Type-only: the merge-extensible SessionProjectionMap target (my augmentation).
import type {} from '@deepseek-ai/dsh-session-projection/types'
// Type-only: the cordis Context.sessionProjections service merge.
import type {} from '@deepseek-ai/dsh-session-projection'

/** Stable loader name; matches the bundle row `id: window-stats`. */
export const name = '@wellorbetter/dsh-plugin-window-stats'

/** Required service: the projection registry the base bundle mounts. */
export const inject = ['sessionProjections']

/** One UTC day of token usage. */
interface TokenHistoryDay {
  input: number
  output: number
}

/** Projection state: day key `YYYY-MM-DD` → input/output totals. */
type TokenHistoryState = Record<string, TokenHistoryDay>

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionMap {
    tokenHistory: Record<string, TokenHistoryDay>
  }
}

const tokenHistorySchema = z.record(z.string(), z.object({ input: z.number(), output: z.number() }))

/** UTC day key (YYYY-MM-DD) for an epoch-ms timestamp. */
function dayKey(time: number): string {
  return new Date(time).toISOString().slice(0, 10)
}

/**
 * Host plugin body: register the token-history projection unit. The registry
 * drives it over committed session events and serves it through list rows and
 * `session/projection` push frames like the built-in token/stats units.
 * @param ctx - host cordis context.
 */
export function apply(ctx: Context): void {
  ctx.sessionProjections.register({
    key: 'tokenHistory',
    schema: tokenHistorySchema,
    init: (): TokenHistoryState => ({}),
    apply(state: TokenHistoryState, event: SessionEvent): TokenHistoryState {
      if (event.type !== 'assistant/message') return state
      const usage = event.data.usage
      if (usage === undefined) return state
      const input = usage.inputTokens
      const output = usage.outputTokens
      if (input === 0 && output === 0) return state
      const key = dayKey(event.time)
      const existing = state[key]
      return {
        ...state,
        [key]: {
          input: (existing?.input ?? 0) + input,
          output: (existing?.output ?? 0) + output,
        },
      }
    },
    view(state: TokenHistoryState): Record<string, TokenHistoryDay> {
      return state
    },
    stateVersion: 1,
  })
}
