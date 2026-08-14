/**
 * Client half of @wellorbetter/dsh-plugin-window-stats: registers the
 * 「窗口统计」 view tab into the conversation view ring and its locale
 * namespace. All registrations ride the plugin fiber and dispose with it.
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client
 */
import type { Context } from '@deepseek-ai/cordis';
/** Required services: slot registry, locale, and the session list. */
export declare const inject: string[];
/**
 * Client plugin body: register the locale dictionaries, the two view tabs
 * (Window Stats overview + Session Analysis), the sidebar summary, and the
 * right-docked overview panel. Each registration waits on its slot's
 * declaration via `ctx.slots.inject` and is removed when the plugin unloads.
 * @param ctx - client cordis context.
 */
export declare function apply(ctx: Context): void;
