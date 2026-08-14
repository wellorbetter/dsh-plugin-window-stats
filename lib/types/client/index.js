import { en, NS, zh } from "./locales.js";
import { WindowStatsView } from "./WindowStatsView.js";
import { SessionAnalyticsView } from "./SessionAnalyticsView.js";
import { GlobalOverviewPanel, SidebarSummary } from "./Overview.js";
/** Required services: slot registry, locale, and the session list. */
export const inject = ['slots', 'locale', 'sessions'];
/**
 * Client plugin body: register the locale dictionaries, the two view tabs
 * (Window Stats overview + Session Analysis), the sidebar summary, and the
 * right-docked overview panel. Each registration waits on its slot's
 * declaration via `ctx.slots.inject` and is removed when the plugin unloads.
 * @param ctx - client cordis context.
 */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'window-stats: dictionaries');
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
    ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
        name: 'sidebar.footer.action',
        id: 'windowStatsSummary',
        locale: NS,
    }, SidebarSummary));
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'windowStatsOverview',
        locale: NS,
        inject: () => ({ open: (id) => { ctx.sessions.open(id); } }),
    }, GlobalOverviewPanel));
}
//# sourceMappingURL=index.js.map