import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 「窗口统计」 view tab: a read-only table of every non-blank session with its
 * progress (turns/steps) and token consumption (input/output/cache/context),
 * plus an aggregate header. Pure presentational — all data arrives through the
 * framework standard kit (`useSessions`) and the inject face (`open`).
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/WindowStatsView
 */
import { useMemo } from 'react';
import { StateDot } from '@deepseek-ai/dsh-client-ui-primitives';
import { aggregate, cacheHitRatio, deriveWindowRows, formatTokens, relativeTime, } from "./stats.js";
import css from './WindowStatsView.module.css';
/** Map a row to its presentation state dot. */
function stateOf(row) {
    if (row.running)
        return 'ongoing';
    if (row.pendingInteraction !== undefined)
        return 'warning';
    return 'done';
}
function statusKeyOf(row) {
    if (row.running)
        return 'status.running';
    switch (row.pendingInteraction) {
        case 'approval': return 'status.waitingApproval';
        case 'question': return 'status.waitingAnswer';
        case 'plan-review': return 'status.planReview';
        case undefined: break;
    }
    return row.completed ? 'status.completed' : 'status.idle';
}
const TIME_UNIT_KEYS = {
    now: 'time.now',
    min: 'time.min',
    hour: 'time.hour',
    day: 'time.day',
    week: 'time.week',
    month: 'time.month',
    year: 'time.year',
};
/**
 * Render the Window Stats dashboard.
 * @param props - the composed slot props.
 * @returns the table, header, and empty state.
 */
export function WindowStatsView({ useSessions, open, t }) {
    const state = useSessions(s => s);
    const now = useMemo(() => Date.now(), [state]);
    const rows = useMemo(() => deriveWindowRows(state, { includeBlank: false }), [state]);
    const totals = useMemo(() => aggregate(rows), [rows]);
    if (rows.length === 0) {
        return (_jsxs("div", { className: css.empty, children: [_jsx("div", { className: css.emptyTitle, children: t('empty.title') }), _jsx("div", { className: css.emptyHint, children: t('empty.hint') })] }));
    }
    return (_jsxs("div", { className: css.root, children: [_jsxs("div", { className: css.header, children: [_jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('header.sessions') }), _jsx("span", { className: css.headerValue, children: String(totals.total) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('header.running') }), _jsx("span", { className: css.headerValue, children: String(totals.running) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('col.tokensIn') }), _jsx("span", { className: css.headerValue, children: formatTokens(totals.inputTokens) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('col.tokensOut') }), _jsx("span", { className: css.headerValue, children: formatTokens(totals.outputTokens) })] })] }), _jsxs("table", { className: css.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: css.thStatus, scope: "col", children: t('col.status') }), _jsx("th", { scope: "col", children: t('col.session') }), _jsx("th", { scope: "col", children: t('col.progress') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.tokensIn') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.tokensOut') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.cache') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.context') }), _jsx("th", { scope: "col", className: css.thActivity, children: t('col.activity') })] }) }), _jsx("tbody", { children: rows.map(row => _jsx(WindowStatsRow, { row: row, now: now, t: t, onOpen: () => { open(row.id); } }, row.id)) })] })] }));
}
function WindowStatsRow({ row, now, t, onOpen }) {
    const hit = cacheHitRatio(row);
    const occupied = row.projectedTokens !== undefined && row.contextWindow !== undefined && row.contextWindow > 0
        ? Math.round((row.projectedTokens / row.contextWindow) * 100)
        : null;
    const time = relativeTime(row.updatedAt, now);
    const activity = time.unit === 'now' ? t('time.now') : t(TIME_UNIT_KEYS[time.unit], { n: time.n });
    const statusLabel = t(statusKeyOf(row));
    const dot = _jsx(StateDot, { state: stateOf(row) });
    return (_jsxs("tr", { className: css.row, onClick: onOpen, onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpen();
            }
        }, tabIndex: 0, role: "row", "aria-label": t('a11y.openSession', { title: row.title }), children: [_jsx("td", { className: css.cellStatus, children: _jsxs("span", { className: css.statusCell, children: [dot, _jsx("span", { className: css.visuallyHidden, children: t('a11y.status', { label: statusLabel }) })] }) }), _jsxs("td", { className: css.cellTitle, children: [_jsx("span", { className: css.title, children: row.title }), row.cwd !== undefined && _jsx("span", { className: css.cwd, children: row.cwd })] }), _jsx("td", { className: css.cellProgress, children: row.turns !== undefined && row.steps !== undefined
                    ? `${row.turns} / ${row.steps}`
                    : '–' }), _jsx("td", { className: css.cellNum, children: row.inputTokens !== undefined ? formatTokens(row.inputTokens) : '–' }), _jsx("td", { className: css.cellNum, children: row.outputTokens !== undefined ? formatTokens(row.outputTokens) : '–' }), _jsx("td", { className: css.cellNum, children: hit !== null ? t('value.cacheRatio', { pct: Math.round(hit * 100) }) : '–' }), _jsx("td", { className: css.cellNum, children: occupied !== null ? t('value.context', { pct: occupied }) : '–' }), _jsx("td", { className: css.cellActivity, children: activity })] }));
}
//# sourceMappingURL=WindowStatsView.js.map