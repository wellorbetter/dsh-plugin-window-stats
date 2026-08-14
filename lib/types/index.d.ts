/**
 * Host half of @wellorbetter/dsh-plugin-window-stats: registers the
 * `tokenHistory` session projection — a per-day fold of `assistant/message`
 * usage into input/output token totals, so the client can render a token
 * consumption heatmap without a separate host service.
 *
 * @module @wellorbetter/dsh-plugin-window-stats
 */
import type { Context } from '@deepseek-ai/cordis';
/** Stable loader name; matches the bundle row `id: window-stats`. */
export declare const name = "@wellorbetter/dsh-plugin-window-stats";
/** Required service: the projection registry the base bundle mounts. */
export declare const inject: string[];
/** One UTC day of token usage. */
interface TokenHistoryDay {
    input: number;
    output: number;
}
declare module '@deepseek-ai/dsh-session-projection/types' {
    interface SessionProjectionMap {
        tokenHistory: Record<string, TokenHistoryDay>;
    }
}
/**
 * Host plugin body: register the token-history projection unit. The registry
 * drives it over committed session events and serves it through list rows and
 * `session/projection` push frames like the built-in token/stats units.
 * @param ctx - host cordis context.
 */
export declare function apply(ctx: Context): void;
export {};
