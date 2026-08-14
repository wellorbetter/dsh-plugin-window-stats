import { z } from 'zod';
/** Stable loader name; matches the bundle row `id: window-stats`. */
export const name = '@wellorbetter/dsh-plugin-window-stats';
/** Required service: the projection registry the base bundle mounts. */
export const inject = ['sessionProjections'];
const tokenHistorySchema = z.record(z.string(), z.object({ input: z.number(), output: z.number() }));
/** UTC day key (YYYY-MM-DD) for an epoch-ms timestamp. */
function dayKey(time) {
    return new Date(time).toISOString().slice(0, 10);
}
/**
 * Host plugin body: register the token-history projection unit. The registry
 * drives it over committed session events and serves it through list rows and
 * `session/projection` push frames like the built-in token/stats units.
 * @param ctx - host cordis context.
 */
export function apply(ctx) {
    ctx.sessionProjections.register({
        key: 'tokenHistory',
        schema: tokenHistorySchema,
        init: () => ({}),
        apply(state, event) {
            if (event.type !== 'assistant/message')
                return state;
            const usage = event.data.usage;
            if (usage === undefined)
                return state;
            const input = usage.inputTokens;
            const output = usage.outputTokens;
            if (input === 0 && output === 0)
                return state;
            const key = dayKey(event.time);
            const existing = state[key];
            return {
                ...state,
                [key]: {
                    input: (existing?.input ?? 0) + input,
                    output: (existing?.output ?? 0) + output,
                },
            };
        },
        view(state) {
            return state;
        },
        stateVersion: 1,
    });
}
//# sourceMappingURL=index.js.map