import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 「窗口统计」 view tab: a split dashboard — a toolbar (sort / filter / group /
 * cost model) above a per-session table, with a rich per-session detail panel
 * (token/context/timing breakdown + a token-consumption heatmap). Pure
 * presentational; data arrives through `useSessions` and the inject face.
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/WindowStatsView
 */
import { useMemo, useState } from 'react';
import { StateDot } from '@deepseek-ai/dsh-client-ui-primitives';
import { CURRENCIES, DEFAULT_PRICING, aggregate, cacheHitRatio, costUsd, decodeThroughput, deriveWindowRows, filterRows, formatCost, formatDuration, formatOneDecimal, formatTokens, groupByWorkspace, hiddenSubagentCount, peakDailyTokens, relativeTime, sortRows, ttftAverageMs, } from "./stats.js";
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
/** CSS class for a row's visible status badge. */
function statusBadgeClass(row) {
    if (row.running)
        return css.badgeRunning;
    if (row.pendingInteraction !== undefined)
        return css.badgeWaiting;
    return row.completed ? css.badgeDone : css.badgeIdle;
}
const TIME_UNIT_KEYS = {
    now: 'time.now', min: 'time.min', hour: 'time.hour', day: 'time.day',
    week: 'time.week', month: 'time.month', year: 'time.year',
};
function rowDurationMs(row) {
    if (row.llmMs === undefined && row.toolMs === undefined)
        return null;
    return (row.llmMs ?? 0) + (row.toolMs ?? 0);
}
const MODEL_KEYS = ['deepseek-v4-flash', 'deepseek-v4-pro'];
/**
 * Render the Window Stats dashboard.
 * @param props - the composed slot props.
 */
export function WindowStatsView({ useSessions, open, t }) {
    const state = useSessions(s => s);
    const now = useMemo(() => Date.now(), [state]);
    const allRows = useMemo(() => deriveWindowRows(state, { includeBlank: false }), [state]);
    const hiddenSubagents = useMemo(() => hiddenSubagentCount(state), [state]);
    const [sortKey, setSortKey] = useState('activity');
    const [statusFilter, setStatusFilter] = useState('all');
    const [grouped, setGrouped] = useState(false);
    const [modelKey, setModelKey] = useState('deepseek-v4-pro');
    const [currencyCode, setCurrencyCode] = useState('USD');
    const pricing = DEFAULT_PRICING[modelKey] ?? DEFAULT_PRICING['deepseek-v4-pro'];
    const currency = CURRENCIES.find(c => c.code === currencyCode) ?? CURRENCIES[0];
    const filtered = useMemo(() => filterRows(allRows, statusFilter), [allRows, statusFilter]);
    const sorted = useMemo(() => sortRows(filtered, sortKey), [filtered, sortKey]);
    const groups = useMemo(() => (grouped ? groupByWorkspace(sorted) : null), [grouped, sorted]);
    const totals = useMemo(() => aggregate(filtered), [filtered]);
    const totalCost = useMemo(() => filtered.reduce((sum, row) => sum + (costUsd(row, pricing) ?? 0), 0), [filtered, pricing]);
    const [selectedId, setSelectedId] = useState(null);
    const selected = useMemo(() => (selectedId === null ? null : (allRows.find(r => r.id === selectedId) ?? null)), [allRows, selectedId]);
    if (allRows.length === 0) {
        return (_jsxs("div", { className: css.empty, children: [_jsx("div", { className: css.emptyTitle, children: t('empty.title') }), _jsx("div", { className: css.emptyHint, children: t('empty.hint') })] }));
    }
    return (_jsxs("div", { className: css.root, children: [_jsxs("div", { className: css.toolbar, children: [_jsx("div", { className: css.toolGroup, children: ['activity', 'inputTokens', 'duration'].map(key => (_jsx("button", { type: "button", className: sortKey === key ? `${css.chip} ${css.chipActive}` : css.chip, onClick: () => { setSortKey(key); }, children: t(key === 'activity' ? 'sort.activity' : key === 'inputTokens' ? 'sort.inputTokens' : 'sort.duration') }, key))) }), _jsx("div", { className: css.toolGroup, children: ['all', 'running', 'waiting', 'idle'].map(key => (_jsx("button", { type: "button", className: statusFilter === key ? `${css.chip} ${css.chipActive}` : css.chip, onClick: () => { setStatusFilter(key); }, children: t(key === 'all' ? 'filter.all' : key === 'running' ? 'filter.running' : key === 'waiting' ? 'filter.waiting' : 'filter.idle') }, key))) }), _jsx("div", { className: css.toolGroup, children: _jsx("button", { type: "button", className: grouped ? `${css.chip} ${css.chipActive}` : css.chip, onClick: () => { setGrouped(v => !v); }, children: t('group.byWorkspace') }) }), _jsxs("div", { className: css.toolGroup, children: [MODEL_KEYS.map(key => (_jsx("button", { type: "button", className: modelKey === key ? `${css.chip} ${css.chipActive}` : css.chip, onClick: () => { setModelKey(key); }, title: `${key} ${t('header.cost')}`, children: key === 'deepseek-v4-flash' ? 'V4-Flash' : 'V4-Pro' }, key))), _jsx("select", { className: css.select, value: currencyCode, onChange: (e) => { setCurrencyCode(e.target.value); }, "aria-label": t('header.cost'), children: CURRENCIES.map(c => _jsxs("option", { value: c.code, children: [c.code, " ", c.symbol] }, c.code)) })] })] }), _jsxs("div", { className: css.header, children: [_jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('header.sessions') }), _jsx("span", { className: css.headerValue, children: String(totals.total) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('header.running') }), _jsx("span", { className: css.headerValue, children: String(totals.running) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('col.tokensIn') }), _jsx("span", { className: css.headerValue, children: formatTokens(totals.inputTokens) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('col.tokensOut') }), _jsx("span", { className: css.headerValue, children: formatTokens(totals.outputTokens) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('header.duration') }), _jsx("span", { className: css.headerValue, children: formatDuration(totals.llmMs + totals.toolMs) })] }), _jsxs("span", { className: css.headerItem, children: [_jsx("span", { className: css.headerLabel, children: t('header.cost') }), _jsx("span", { className: css.headerValue, children: formatCost(totalCost, currency) })] })] }), hiddenSubagents > 0 && (_jsx("div", { className: css.hint, children: t('hint.hiddenSubagents', { n: hiddenSubagents }) })), _jsxs("div", { className: css.split, children: [_jsx("div", { className: css.listPane, children: _jsxs("table", { className: css.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: css.thStatus, scope: "col", children: t('col.status') }), _jsx("th", { scope: "col", children: t('col.session') }), _jsx("th", { scope: "col", children: t('col.progress') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.tokensIn') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.tokensOut') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.cache') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.context') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.duration') }), _jsx("th", { scope: "col", className: css.thNum, children: t('col.cost') }), _jsx("th", { scope: "col", className: css.thActivity, children: t('col.activity') })] }) }), _jsx("tbody", { children: groups !== null
                                        ? groups.map(group => (_jsx(GroupSection, { group: group, now: now, t: t, pricing: pricing, currency: currency, selectedId: selectedId, onSelect: setSelectedId }, group.title)))
                                        : sorted.map(row => (_jsx(WindowStatsRow, { row: row, now: now, t: t, pricing: pricing, currency: currency, selected: row.id === selectedId, onSelect: () => { setSelectedId(row.id); } }, row.id))) })] }) }), _jsx("aside", { className: css.detailPane, children: selected === null
                            ? _jsx("div", { className: css.detailEmpty, children: t('detail.empty') })
                            : _jsx(SessionDetail, { row: selected, t: t, pricing: pricing, currency: currency, onOpen: () => { open(selected.id); } }) })] })] }));
}
function GroupSection({ group, now, t, pricing, currency, selectedId, onSelect }) {
    return (_jsxs(_Fragment, { children: [_jsx("tr", { className: css.groupRow, children: _jsx("td", { colSpan: 10, className: css.groupTitle, children: group.title === 'ungrouped' ? t('status.idle') : group.title }) }), group.rows.map(row => (_jsx(WindowStatsRow, { row: row, now: now, t: t, pricing: pricing, currency: currency, selected: row.id === selectedId, onSelect: () => { onSelect(row.id); } }, row.id)))] }));
}
function WindowStatsRow({ row, now, t, pricing, currency, selected, onSelect }) {
    const hit = cacheHitRatio(row);
    const occupied = row.projectedTokens !== undefined && row.contextWindow !== undefined && row.contextWindow > 0
        ? Math.round((row.projectedTokens / row.contextWindow) * 100)
        : null;
    const time = relativeTime(row.updatedAt, now);
    const activity = time.unit === 'now' ? t('time.now') : t(TIME_UNIT_KEYS[time.unit], { n: time.n });
    const statusLabel = t(statusKeyOf(row));
    const duration = rowDurationMs(row);
    const cost = costUsd(row, pricing);
    return (_jsxs("tr", { className: selected ? `${css.row} ${css.rowSelected}` : css.row, onClick: onSelect, onKeyDown: (event) => { if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect();
        } }, tabIndex: 0, role: "row", "aria-selected": selected, "aria-label": t('a11y.openSession', { title: row.title }), children: [_jsx("td", { className: css.cellStatus, children: _jsxs("span", { className: css.statusCell, children: [_jsx(StateDot, { state: stateOf(row) }), _jsx("span", { className: `${css.statusBadge} ${statusBadgeClass(row)}`, children: statusLabel }), _jsx("span", { className: css.visuallyHidden, children: t('a11y.status', { label: statusLabel }) })] }) }), _jsxs("td", { className: css.cellTitle, children: [_jsx("span", { className: css.title, children: row.title }), row.cwd !== undefined && _jsx("span", { className: css.cwd, children: row.cwd })] }), _jsx("td", { className: css.cellProgress, children: row.turns !== undefined && row.steps !== undefined ? `${row.turns} / ${row.steps}` : '–' }), _jsx("td", { className: css.cellNum, children: row.inputTokens !== undefined ? formatTokens(row.inputTokens) : '–' }), _jsx("td", { className: css.cellNum, children: row.outputTokens !== undefined ? formatTokens(row.outputTokens) : '–' }), _jsx("td", { className: css.cellNum, children: hit !== null ? t('value.cacheRatio', { pct: Math.round(hit * 100) }) : '–' }), _jsx("td", { className: css.cellNum, children: occupied !== null ? t('value.context', { pct: occupied }) : '–' }), _jsx("td", { className: css.cellNum, children: duration !== null ? formatDuration(duration) : '–' }), _jsx("td", { className: css.cellNum, children: cost !== null ? formatCost(cost, currency) : '–' }), _jsx("td", { className: css.cellActivity, children: activity })] }));
}
function SessionDetail({ row, t, pricing, currency, onOpen }) {
    const hit = cacheHitRatio(row);
    const total = row.inputTokens !== undefined ? row.inputTokens + (row.outputTokens ?? 0) : undefined;
    const occupied = row.projectedTokens !== undefined && row.contextWindow !== undefined && row.contextWindow > 0
        ? Math.round((row.projectedTokens / row.contextWindow) * 100)
        : null;
    const throughput = decodeThroughput(row);
    const ttft = ttftAverageMs(row);
    const duration = rowDurationMs(row);
    const cost = costUsd(row, pricing);
    return (_jsxs("div", { className: css.detail, children: [_jsxs("div", { className: css.detailHead, children: [_jsxs("div", { className: css.detailStatusRow, children: [_jsx(StateDot, { state: stateOf(row) }), _jsx("span", { className: css.detailStatusText, children: t(statusKeyOf(row)) })] }), _jsx("div", { className: css.detailTitle, children: row.title }), row.cwd !== undefined && _jsx("div", { className: css.detailCwd, children: row.cwd })] }), _jsx("button", { type: "button", className: css.detailOpen, onClick: onOpen, children: t('detail.open') }), _jsxs("div", { className: css.detailSection, children: [_jsx("div", { className: css.detailSectionTitle, children: t('detail.tokens') }), _jsx(TokenBar, { label: t('detail.uncachedInput'), value: row.uncachedInputTokens, max: total }), _jsx(TokenBar, { label: t('detail.cacheRead'), value: row.cacheReadTokens, max: total }), _jsx(TokenBar, { label: t('detail.cacheWrite'), value: row.cacheWriteTokens, max: total }), _jsx(TokenBar, { label: t('detail.output'), value: row.outputTokens, max: total }), _jsx(Kv, { label: t('detail.total'), value: total !== undefined ? formatTokens(total) : '–' }), _jsx(Kv, { label: t('col.cache'), value: hit !== null ? t('value.cacheRatio', { pct: Math.round(hit * 100) }) : '–' }), _jsx(Kv, { label: t('col.cost'), value: cost !== null ? formatCost(cost, currency) : '–' })] }), _jsxs("div", { className: css.detailSection, children: [_jsx("div", { className: css.detailSectionTitle, children: t('detail.context') }), occupied !== null && _jsx(OccupancyBar, { pct: occupied }), _jsx(Kv, { label: t('detail.occupancy'), value: occupied !== null ? t('value.context', { pct: occupied }) : '–' }), _jsx(Kv, { label: t('detail.system'), value: row.systemTokens !== undefined ? formatTokens(row.systemTokens) : '–' }), _jsx(Kv, { label: t('detail.tools'), value: row.toolsTokens !== undefined ? formatTokens(row.toolsTokens) : '–' }), _jsx(Kv, { label: t('detail.messages'), value: row.messageTokens !== undefined ? formatTokens(row.messageTokens) : '–' })] }), _jsxs("div", { className: css.detailSection, children: [_jsx("div", { className: css.detailSectionTitle, children: t('detail.timing') }), _jsx(Kv, { label: t('col.duration'), value: duration !== null ? formatDuration(duration) : '–' }), _jsx(Kv, { label: t('detail.llm'), value: row.llmMs !== undefined ? formatDuration(row.llmMs) : '–' }), _jsx(Kv, { label: t('detail.tool'), value: row.toolMs !== undefined ? formatDuration(row.toolMs) : '–' }), _jsx(Kv, { label: t('detail.ttft'), value: ttft !== null ? t('value.ms', { n: Math.round(ttft) }) : '–' }), _jsx(Kv, { label: t('detail.throughput'), value: throughput !== null ? t('value.tokPerSec', { n: formatOneDecimal(throughput) }) : '–' })] }), _jsxs("div", { className: css.detailSection, children: [_jsx("div", { className: css.detailSectionTitle, children: t('detail.heatmap') }), _jsx(Heatmap, { history: row.tokenHistory })] }), _jsxs("div", { className: css.detailSection, children: [_jsx("div", { className: css.detailSectionTitle, children: t('detail.turns') }), _jsx(Kv, { label: t('detail.turns'), value: row.turns !== undefined ? String(row.turns) : '–' }), _jsx(Kv, { label: t('detail.steps'), value: row.steps !== undefined ? String(row.steps) : '–' }), _jsx(Kv, { label: t('detail.jobs'), value: String(row.jobsCount) }), _jsx(Kv, { label: t('detail.subagents'), value: String(row.subagentCount) })] })] }));
}
function Heatmap({ history }) {
    if (history === undefined || Object.keys(history).length === 0) {
        return _jsx("div", { className: css.heatmapEmpty, children: "\u2013" });
    }
    const peak = peakDailyTokens(history);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setUTCDate(start.getUTCDate() - 25 * 7); // ~26 weeks back
    start.setUTCDate(start.getUTCDate() - start.getUTCDay()); // align to Sunday
    const weeks = [];
    const cursor = new Date(start);
    while (cursor.getTime() <= today.getTime()) {
        const key = cursor.toISOString().slice(0, 10);
        const day = history[key];
        const total = day !== undefined ? day.input + day.output : 0;
        const weekIndex = weeks.length - 1;
        if (weeks.length === 0 || weeks[weekIndex].length === 7)
            weeks.push([]);
        weeks[weeks.length - 1].push({ key, total });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return (_jsx("div", { className: css.heatmap, children: weeks.map((week, wi) => (_jsx("div", { className: css.heatmapWeek, children: week.map(cell => {
                const opacity = cell.total === 0 ? 0.14 : 0.35 + 0.65 * (cell.total / peak);
                return _jsx("span", { className: css.heatmapCell, style: { opacity }, title: `${cell.key}: ${cell.total}` }, cell.key);
            }) }, wi))) }));
}
function Kv({ label, value }) {
    return _jsxs("div", { className: css.detailKV, children: [_jsx("span", { className: css.detailKVLabel, children: label }), _jsx("span", { className: css.detailKVValue, children: value })] });
}
function TokenBar({ label, value, max }) {
    const v = value ?? 0;
    const pct = max !== undefined && max > 0 ? Math.min(100, (v / max) * 100) : 0;
    return (_jsxs("div", { className: css.barRow, children: [_jsx("span", { className: css.barLabel, children: label }), _jsx("div", { className: css.barTrack, children: _jsx("div", { className: css.barFill, style: { width: `${pct}%` } }) }), _jsx("span", { className: css.barValue, children: formatTokens(v) })] }));
}
function OccupancyBar({ pct }) {
    const clamped = Math.min(100, Math.max(0, pct));
    return _jsx("div", { className: css.occTrack, children: _jsx("div", { className: css.occFill, style: { width: `${clamped}%` } }) });
}
//# sourceMappingURL=WindowStatsView.js.map