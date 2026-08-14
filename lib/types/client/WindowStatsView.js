import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 「窗口统计」 view tab: a split dashboard — the left pane is a per-session
 * table (overview), the right pane is a rich per-session detail breakdown.
 * Pure presentational: data arrives through the framework standard kit
 * (`useSessions`) and the inject face (`open`).
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/WindowStatsView
 */
import { useMemo, useState } from 'react';
import { StateDot } from '@deepseek-ai/dsh-client-ui-primitives';
import { aggregate, cacheHitRatio, decodeThroughput, deriveWindowRows, formatDuration, formatOneDecimal, formatTokens, hiddenSubagentCount, relativeTime, ttftAverageMs, } from "./stats.js";
import css from './WindowStatsView.module.css';
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
function stateOf(row) {
    if (row.running)
        return 'ongoing';
    if (row.pendingInteraction !== undefined)
        return 'warning';
    return 'done';
}
const TIME_UNIT_KEYS = {
    now: 'time.now', min: 'time.min', hour: 'time.hour', day: 'time.day',
    week: 'time.week', month: 'time.month', year: 'time.year',
};
/** Total wall time (LLM + tool) for a row, or null when no timing recorded. */
function rowDurationMs(row) {
    if (row.llmMs === undefined && row.toolMs === undefined)
        return null;
    return (row.llmMs ?? 0) + (row.toolMs ?? 0);
}
/**
 * Render the Window Stats dashboard.
 * @param props - the composed slot props.
 */
export function WindowStatsView({ useSessions, open, t }) {
    const state = useSessions(s => s);
    const now = useMemo(() => Date.now(), [state]);
    const rows = useMemo(() => deriveWindowRows(state, { includeBlank: false }), [state]);
    const totals = useMemo(() => aggregate(rows), [rows]);
    const hiddenSubagents = useMemo(() => hiddenSubagentCount(state), [state]);
    const [selectedId, setSelectedId] = useState(null);
    const selected = useMemo(() => (selectedId === null ? null : (rows.find(r => r.id === selectedId) ?? null)), [rows, selectedId]);
    if (rows.length === 0) {
        return (_jsxs("div", { className: css.empty, children: [_jsx("div", { className: css.emptyTitle, children: t('empty.title') }), _jsx("div", { className: css.emptyHint, children: t('empty.hint') })] }));
    }
    return (_jsxs("div", { className: css.root, children: [_jsxs("div", { className: css.header, children: [_jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('header.sessions') }), _jsx("span", { className: css.headerValue, children: String(totals.total) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('header.running') }), _jsx("span", { className: css.headerValue, children: String(totals.running) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('col.tokensIn') }), _jsx("span", { className: css.headerValue, children: formatTokens(totals.inputTokens) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('col.tokensOut') }), _jsx("span", { className: css.headerValue, children: formatTokens(totals.outputTokens) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('header.duration') }), _jsx("span", { className: css.headerValue, children: formatDuration(totals.llmMs + totals.toolMs) })] })] }), hiddenSubagents > 0 && (_jsx("div", { className: css.hint, children: t('hint.hiddenSubagents', { n: hiddenSubagents }) })), _jsxs("div", { className: css.split, children: [_jsx("div", { className: css.listPane, children: _jsxs("table", { className: css.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: css.thStatus, scope: "col", children: t('col.status') }), _jsx("th", { scope: "col", children: t('col.session') }), _jsx("th", { scope: "col", children: t('col.progress') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.tokensIn') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.tokensOut') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.cache') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.context') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.duration') }), _jsx("th", { scope: "col", className: css.thActivity, children: t('col.activity') })] }) }), _jsx("tbody", { children: rows.map(row => (_jsx(WindowStatsRow, { row: row, now: now, t: t, selected: row.id === selectedId, onSelect: () => { setSelectedId(row.id); } }, row.id))) })] }) }), _jsx("aside", { className: css.detailPane, children: selected === null
                            ? _jsx("div", { className: css.detailEmpty, children: t('detail.empty') })
                            : _jsx(SessionDetail, { row: selected, t: t, onOpen: () => { open(selected.id); } }) })] })] }));
}
function WindowStatsRow({ row, now, t, selected, onSelect }) {
    const hit = cacheHitRatio(row);
    const occupied = row.projectedTokens !== undefined && row.contextWindow !== undefined && row.contextWindow > 0
        ? Math.round((row.projectedTokens / row.contextWindow) * 100)
        : null;
    const time = relativeTime(row.updatedAt, now);
    const activity = time.unit === 'now' ? t('time.now') : t(TIME_UNIT_KEYS[time.unit], { n: time.n });
    const statusLabel = t(statusKeyOf(row));
    const duration = rowDurationMs(row);
    return (_jsxs("tr", { className: selected ? `${css.row} ${css.rowSelected}` : css.row, onClick: onSelect, onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect();
            }
        }, tabIndex: 0, role: "row", "aria-selected": selected, "aria-label": t('a11y.openSession', { title: row.title }), children: [_jsx("td", { className: css.cellStatus, children: _jsxs("span", { className: css.statusCell, children: [_jsx(StateDot, { state: stateOf(row) }), _jsx("span", { className: css.visuallyHidden, children: t('a11y.status', { label: statusLabel }) })] }) }), _jsxs("td", { className: css.cellTitle, children: [_jsx("span", { className: css.title, children: row.title }), row.cwd !== undefined && _jsx("span", { className: css.cwd, children: row.cwd })] }), _jsx("td", { className: css.cellProgress, children: row.turns !== undefined && row.steps !== undefined ? `${row.turns} / ${row.steps}` : '–' }), _jsx("td", { className: css.cellNum, children: row.inputTokens !== undefined ? formatTokens(row.inputTokens) : '–' }), _jsx("td", { className: css.cellNum, children: row.outputTokens !== undefined ? formatTokens(row.outputTokens) : '–' }), _jsx("td", { className: css.cellNum, children: hit !== null ? t('value.cacheRatio', { pct: Math.round(hit * 100) }) : '–' }), _jsx("td", { className: css.cellNum, children: occupied !== null ? t('value.context', { pct: occupied }) : '–' }), _jsx("td", { className: css.cellNum, children: duration !== null ? formatDuration(duration) : '–' }), _jsx("td", { className: css.cellActivity, children: activity })] }));
}
function SessionDetail({ row, t, onOpen }) {
    const hit = cacheHitRatio(row);
    const total = row.inputTokens !== undefined ? row.inputTokens + (row.outputTokens ?? 0) : undefined;
    const occupied = row.projectedTokens !== undefined && row.contextWindow !== undefined && row.contextWindow > 0
        ? Math.round((row.projectedTokens / row.contextWindow) * 100)
        : null;
    const throughput = decodeThroughput(row);
    const ttft = ttftAverageMs(row);
    const duration = rowDurationMs(row);
    return (_jsxs("div", { className: css.detail, children: [_jsxs("div", { className: css.detailHead, children: [_jsxs("div", { className: css.detailStatusRow, children: [_jsx(StateDot, { state: stateOf(row) }), _jsx("span", { className: css.detailStatusText, children: t(statusKeyOf(row)) })] }), _jsx("div", { className: css.detailTitle, children: row.title }), row.cwd !== undefined && _jsx("div", { className: css.detailCwd, children: row.cwd })] }), _jsx("button", { type: "button", className: css.detailOpen, onClick: onOpen, children: t('detail.open') }), _jsxs("div", { className: css.detailSection, children: [_jsx("div", { className: css.detailSectionTitle, children: t('detail.tokens') }), _jsx(TokenBar, { label: t('detail.uncachedInput'), value: row.uncachedInputTokens, max: total }), _jsx(TokenBar, { label: t('detail.cacheRead'), value: row.cacheReadTokens, max: total }), _jsx(TokenBar, { label: t('detail.cacheWrite'), value: row.cacheWriteTokens, max: total }), _jsx(TokenBar, { label: t('detail.output'), value: row.outputTokens, max: total }), _jsx(Kv, { label: t('detail.total'), value: total !== undefined ? formatTokens(total) : '–' }), _jsx(Kv, { label: t('col.cache'), value: hit !== null ? t('value.cacheRatio', { pct: Math.round(hit * 100) }) : '–' })] }), _jsxs("div", { className: css.detailSection, children: [_jsx("div", { className: css.detailSectionTitle, children: t('detail.context') }), occupied !== null && _jsx(OccupancyBar, { pct: occupied }), _jsx(Kv, { label: t('detail.occupancy'), value: occupied !== null ? t('value.context', { pct: occupied }) : '–' }), _jsx(Kv, { label: t('detail.system'), value: row.systemTokens !== undefined ? formatTokens(row.systemTokens) : '–' }), _jsx(Kv, { label: t('detail.tools'), value: row.toolsTokens !== undefined ? formatTokens(row.toolsTokens) : '–' }), _jsx(Kv, { label: t('detail.messages'), value: row.messageTokens !== undefined ? formatTokens(row.messageTokens) : '–' })] }), _jsxs("div", { className: css.detailSection, children: [_jsx("div", { className: css.detailSectionTitle, children: t('detail.timing') }), _jsx(Kv, { label: t('col.duration'), value: duration !== null ? formatDuration(duration) : '–' }), _jsx(Kv, { label: t('detail.llm'), value: row.llmMs !== undefined ? formatDuration(row.llmMs) : '–' }), _jsx(Kv, { label: t('detail.tool'), value: row.toolMs !== undefined ? formatDuration(row.toolMs) : '–' }), _jsx(Kv, { label: t('detail.ttft'), value: ttft !== null ? t('value.ms', { n: Math.round(ttft) }) : '–' }), _jsx(Kv, { label: t('detail.throughput'), value: throughput !== null ? t('value.tokPerSec', { n: formatOneDecimal(throughput) }) : '–' })] }), _jsxs("div", { className: css.detailSection, children: [_jsx("div", { className: css.detailSectionTitle, children: t('detail.turns') }), _jsx(Kv, { label: t('detail.turns'), value: row.turns !== undefined ? String(row.turns) : '–' }), _jsx(Kv, { label: t('detail.steps'), value: row.steps !== undefined ? String(row.steps) : '–' }), _jsx(Kv, { label: t('detail.jobs'), value: String(row.jobsCount) }), _jsx(Kv, { label: t('detail.subagents'), value: String(row.subagentCount) })] })] }));
}
function Kv({ label, value }) {
    return (_jsxs("div", { className: css.detailKV, children: [_jsx("span", { className: css.detailKVLabel, children: label }), _jsx("span", { className: css.detailKVValue, children: value })] }));
}
function TokenBar({ label, value, max }) {
    const v = value ?? 0;
    const pct = max !== undefined && max > 0 ? Math.min(100, (v / max) * 100) : 0;
    return (_jsxs("div", { className: css.barRow, children: [_jsx("span", { className: css.barLabel, children: label }), _jsx("div", { className: css.barTrack, children: _jsx("div", { className: css.barFill, style: { width: `${pct}%` } }) }), _jsx("span", { className: css.barValue, children: formatTokens(v) })] }));
}
function OccupancyBar({ pct }) {
    const clamped = Math.min(100, Math.max(0, pct));
    return (_jsx("div", { className: css.occTrack, children: _jsx("div", { className: css.occFill, style: { width: `${clamped}%` } }) }));
}
//# sourceMappingURL=WindowStatsView.js.map