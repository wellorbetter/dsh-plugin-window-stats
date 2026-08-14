import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Always-visible overview surfaces: a compact summary in the sidebar footer
 * (left) and a collapsible global overview panel docked to the right (via
 * `shell.overlay`). Both read the global session list (`useSessions`).
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/Overview
 */
import { useMemo, useState } from 'react';
import { DEFAULT_PRICING, aggregate, costUsd, deriveWindowRows, formatCost, formatDuration, formatTokens, relativeTime, } from "./stats.js";
import css from './Overview.module.css';
/**
 * Compact sidebar-footer summary: running count and total input tokens.
 * @param props - the sidebar footer slot props.
 */
export function SidebarSummary({ wide, useSessions, t }) {
    const state = useSessions(s => s);
    const rows = useMemo(() => deriveWindowRows(state, { includeBlank: false }), [state]);
    const totals = useMemo(() => aggregate(rows), [rows]);
    const cost = useMemo(() => rows.reduce((sum, r) => sum + (costUsd(r, DEFAULT_PRICING['deepseek-v4-pro']) ?? 0), 0), [rows]);
    if (!wide) {
        return _jsx("span", { className: css.sidebarDot, title: `${totals.running} ${t('header.running')}`, children: totals.running });
    }
    return (_jsxs("div", { className: css.sidebarRow, title: `${t('header.running')} · ${t('col.tokensIn')} · ${t('header.cost')}`, children: [_jsx("span", { className: css.dot }), _jsxs("span", { className: css.sidebarText, children: [_jsx("b", { children: totals.running }), " ", t('header.running')] }), _jsxs("span", { className: css.sidebarSub, children: [formatTokens(totals.inputTokens), " \u00B7 ", formatCost(cost)] })] }));
}
/**
 * Right-docked global overview panel: totals, running sessions, and top token
 * consumers, each clickable to open.
 * @param props - the shell.overlay slot props.
 */
export function GlobalOverviewPanel({ useSessions, open, t }) {
    const state = useSessions(s => s);
    const now = useMemo(() => Date.now(), [state]);
    const rows = useMemo(() => deriveWindowRows(state, { includeBlank: false }), [state]);
    const totals = useMemo(() => aggregate(rows), [rows]);
    const [collapsed, setCollapsed] = useState(true);
    const running = useMemo(() => rows.filter(r => r.running), [rows]);
    const top = useMemo(() => [...rows].sort((a, b) => (b.inputTokens ?? -1) - (a.inputTokens ?? -1)).slice(0, 6), [rows]);
    const recent = useMemo(() => rows.slice(0, 8), [rows]);
    const cost = useMemo(() => rows.reduce((sum, r) => sum + (costUsd(r, DEFAULT_PRICING['deepseek-v4-pro']) ?? 0), 0), [rows]);
    if (collapsed) {
        return (_jsx("button", { type: "button", className: css.panelToggle, onClick: () => { setCollapsed(false); }, "aria-label": t('overview.title'), children: "\u25C0" }));
    }
    return (_jsxs("div", { className: css.panel, children: [_jsxs("div", { className: css.panelHead, children: [_jsx("span", { className: css.panelTitle, children: t('overview.title') }), _jsx("button", { type: "button", className: css.panelClose, onClick: () => { setCollapsed(true); }, "aria-label": t('overview.collapse'), children: "\u25B6" })] }), _jsxs("div", { className: css.panelStats, children: [_jsxs("div", { className: css.panelStat, children: [_jsx("span", { className: css.panelStatLabel, children: t('header.sessions') }), _jsx("span", { className: css.panelStatValue, children: String(totals.total) })] }), _jsxs("div", { className: css.panelStat, children: [_jsx("span", { className: css.panelStatLabel, children: t('header.running') }), _jsx("span", { className: css.panelStatValue, children: String(totals.running) })] }), _jsxs("div", { className: css.panelStat, children: [_jsx("span", { className: css.panelStatLabel, children: t('col.tokensIn') }), _jsx("span", { className: css.panelStatValue, children: formatTokens(totals.inputTokens) })] }), _jsxs("div", { className: css.panelStat, children: [_jsx("span", { className: css.panelStatLabel, children: t('header.duration') }), _jsx("span", { className: css.panelStatValue, children: formatDuration(totals.llmMs + totals.toolMs) })] }), _jsxs("div", { className: css.panelStat, children: [_jsx("span", { className: css.panelStatLabel, children: t('header.cost') }), _jsx("span", { className: css.panelStatValue, children: formatCost(cost) })] })] }), _jsxs("div", { className: css.panelSection, children: [_jsx("div", { className: css.panelSectionTitle, children: t('overview.running') }), running.length === 0
                        ? _jsx("div", { className: css.panelEmpty, children: "\u2013" })
                        : running.map(r => (_jsx("button", { type: "button", className: css.panelItem, onClick: () => { open(r.id); }, title: r.title, children: _jsx("span", { className: css.panelItemTitle, children: r.title }) }, r.id)))] }), _jsxs("div", { className: css.panelSection, children: [_jsx("div", { className: css.panelSectionTitle, children: t('overview.topTokens') }), top.map(r => (_jsxs("button", { type: "button", className: css.panelItem, onClick: () => { open(r.id); }, title: r.title, children: [_jsx("span", { className: css.panelItemTitle, children: r.title }), _jsx("span", { className: css.panelItemValue, children: formatTokens(r.inputTokens ?? 0) })] }, r.id)))] }), _jsxs("div", { className: css.panelSection, children: [_jsx("div", { className: css.panelSectionTitle, children: t('overview.recent') }), recent.map(r => (_jsxs("button", { type: "button", className: css.panelItem, onClick: () => { open(r.id); }, title: r.title, children: [_jsx("span", { className: css.panelItemTitle, children: r.title }), _jsx("span", { className: css.panelItemValue, children: whenLabel(r.updatedAt, now, t) })] }, r.id)))] })] }));
}
function whenLabel(ts, now, t) {
    const time = relativeTime(ts, now);
    if (time.unit === 'now')
        return t('time.now');
    const keys = { min: 'time.min', hour: 'time.hour', day: 'time.day', week: 'time.week', month: 'time.month', year: 'time.year' };
    return t(keys[time.unit], { n: time.n });
}
//# sourceMappingURL=Overview.js.map