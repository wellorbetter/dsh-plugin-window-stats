import { en, NS, zh } from "./locales.js";
import { WindowStatsView } from "./WindowStatsView.js";
import { SessionAnalyticsView } from "./SessionAnalyticsView.js";
/** Required services: slot registry, locale, and the session list. */
export const inject = ['slots', 'locale', 'sessions'];
/**
 * Client plugin body: register the locale dictionaries and the two view tabs
 * (Window Stats overview + Session Analysis). Each slot registration waits on
 * the `conversation.view` declaration via `ctx.slots.inject` and is removed
 * when the plugin unloads.
 * @param ctx - client cordis context.
 */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'window-stats: dictionaries');
    // The tab labels read through the bound translate as a thunk so they follow
    // the active locale without re-registration.
    const t = ctx.locale.bind(NS);
    ctx.slots.inject('conversation.view', () => ctx.slots.register({
        name: 'conversation.view',
        id: 'windowStats',
        order: 20,
        locale: NS,
        label: () => t('view.windowStats'),
        inject: () => ({
            open: (id) => { ctx.sessions.open(id); },
        }),
    }, WindowStatsView));
    ctx.slots.inject('conversation.view', () => ctx.slots.register({
        name: 'conversation.view',
        id: 'sessionAnalytics',
        order: 21,
        locale: NS,
        label: () => t('view.sessionAnalytics'),
    }, SessionAnalyticsView));
}
//# sourceMappingURL=index.js.map