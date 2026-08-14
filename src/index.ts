/**
 * Host half of @wellorbetter/dsh-plugin-window-stats.
 *
 * v1 is a pure client surface: the browser half registers the 「窗口统计」
 * (Window Stats) view tab and reads projections the host already delivers to
 * the client (`tokenUsage`, `sessionStats`, `contextPressure` ride every
 * `session.list` row and the `session/projection` push frames). This host
 * half therefore contributes nothing — no routes, no services, no tools, no
 * durable state — which keeps the plugin's server surface zero and its
 * teardown trivial.
 *
 * @module @wellorbetter/dsh-plugin-window-stats
 */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'

/** Stable loader name; matches the bundle row `id: window-stats`. */
export const name = '@wellorbetter/dsh-plugin-window-stats'

/** The plugin has no host configuration in v1. */
export interface Config {}

/** Empty config schema (schemastery); any key is rejected until a host option exists. */
export const Config = z.object({})

/**
 * No-op host apply: see the module contract above. The client half is
 * discovered from the package's `dsh.client` manifest by dsh-client-modules.
 * @param _ctx - host cordis context (unused in v1).
 */
export function apply(_ctx: Context): void {}
