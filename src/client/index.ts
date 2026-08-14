/**
 * Client half of @wellorbetter/dsh-plugin-window-stats: registers the
 * 「窗口统计」 view tab into the conversation view ring and its locale
 * namespace. All registrations ride the plugin fiber and dispose with it.
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client
 */
import type { Context } from '@deepseek-ai/cordis'
// Type-only: pulls the locale service's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: the 'conversation.view' SlotMap row (declared by ui-conversation).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { en, NS, zh } from './locales.ts'
import { WindowStatsView, type WindowStatsInjected } from './WindowStatsView.tsx'

/** Required services: slot registry, locale, and the session list. */
export const inject = ['slots', 'locale', 'sessions']

/**
 * Client plugin body: register the locale dictionaries and the Window Stats
 * view tab. The slot registration waits on the `conversation.view` declaration
 * via `ctx.slots.inject` and is removed when the plugin unloads.
 * @param ctx - client cordis context.
 */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'window-stats: dictionaries')
  // The tab label reads through the bound translate as a thunk so it follows
  // the active locale without re-registration.
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
    id: 'windowStats',
    order: 20,
    locale: NS,
    label: () => t('view.windowStats'),
    inject: (): WindowStatsInjected => ({
      open: (id) => { ctx.sessions.open(id) },
    }),
  }, WindowStatsView))
}
