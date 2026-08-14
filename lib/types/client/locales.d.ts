/**
 * `windowStats` namespace dictionaries for the 「窗口统计」 (Window Stats) view tab.
 * Registered with the client locale service via `ctx.locale.register(NS, { zh, en })`.
 * Product copy is Chinese; code comments are English.
 */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "windowStats";
/** The window stats dictionary key set (the source of truth for both locales). */
export type WindowStatsKey = 'view.windowStats' | 'header.sessions' | 'header.running' | 'col.status' | 'col.session' | 'col.progress' | 'col.tokensIn' | 'col.tokensOut' | 'col.cache' | 'col.context' | 'col.activity' | 'status.running' | 'status.idle' | 'status.completed' | 'status.waitingApproval' | 'status.waitingAnswer' | 'status.planReview' | 'empty.title' | 'empty.hint' | 'hint.hiddenSubagents' | 'value.missing' | 'value.cacheRatio' | 'value.context' | 'time.now' | 'time.min' | 'time.hour' | 'time.day' | 'time.week' | 'time.month' | 'time.year' | 'a11y.openSession' | 'a11y.status' | 'col.duration' | 'header.duration' | 'detail.title' | 'detail.empty' | 'detail.open' | 'detail.tokens' | 'detail.uncachedInput' | 'detail.cacheRead' | 'detail.cacheWrite' | 'detail.output' | 'detail.total' | 'detail.context' | 'detail.occupancy' | 'detail.system' | 'detail.tools' | 'detail.messages' | 'detail.timing' | 'detail.llm' | 'detail.tool' | 'detail.ttft' | 'detail.throughput' | 'detail.turns' | 'detail.steps' | 'detail.jobs' | 'detail.subagents' | 'value.tokPerSec' | 'value.ms' | 'view.sessionAnalytics' | 'range.10m' | 'range.1h' | 'range.1d' | 'range.all' | 'an.summary.toolCalls' | 'an.summary.toolDuration' | 'an.summary.turns' | 'an.tools.title' | 'an.tools.count' | 'an.tools.duration' | 'an.turns.title' | 'an.turns.empty' | 'an.noPrompt';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The window stats view tab label and table copy. */
        'windowStats': WindowStatsKey;
    }
}
/** Simplified Chinese dictionary. */
export declare const zh: Record<WindowStatsKey, string>;
/** English dictionary. */
export declare const en: Record<WindowStatsKey, string>;
