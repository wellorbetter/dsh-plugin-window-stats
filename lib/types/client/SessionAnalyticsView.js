import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 「会话分析」 view tab: a time-range-scoped activity report of the CURRENT
 * session — tool-type duration distribution (bars + donut), a token trend
 * chart, and per-turn task summaries. Reads the conversation snapshot and the
 * `tokenHistory` projection through the session standard kit.
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/SessionAnalyticsView
 */
import { useMemo, useState } from 'react';
import { deriveActivity } from "./activity.js";
import { formatDuration, relativeTime } from "./stats.js";
import css from './SessionAnalyticsView.module.css';
const PRESETS = [
    { key: 'range.10m', ms: 10 * 60_000 },
    { key: 'range.1h', ms: 60 * 60_000 },
    { key: 'range.1d', ms: 24 * 60 * 60_000 },
    { key: 'range.all', ms: null },
];
const UNIT_MS = {
    minutes: 60_000,
    hours: 3_600_000,
    days: 86_400_000,
};
const PALETTE = ['#4176e6', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];
const TIME_KEYS = {
    now: 'time.now', min: 'time.min', hour: 'time.hour', day: 'time.day',
    week: 'time.week', month: 'time.month', year: 'time.year',
};
/**
 * Render the session activity analytics.
 * @param props - the composed slot props.
 */
export function SessionAnalyticsView({ useSession, useProjection, t }) {
    const snapshot = useSession(s => s);
    const history = useProjection('tokenHistory');
    const now = useMemo(() => Date.now(), [snapshot]);
    const [presetMs, setPresetMs] = useState(null);
    const [custom, setCustom] = useState(false);
    const [customN, setCustomN] = useState(1);
    const [customUnit, setCustomUnit] = useState('hours');
    const rangeMs = custom ? customN * UNIT_MS[customUnit] : presetMs;
    const report = useMemo(() => deriveActivity(snapshot, now, rangeMs), [snapshot, now, rangeMs]);
    const maxToolMs = report.tools[0]?.durationMs ?? 0;
    return (_jsxs("div", { className: css.root, children: [_jsxs("div", { className: css.ranges, children: [PRESETS.map(r => (_jsx("button", { type: "button", className: !custom && presetMs === r.ms ? `${css.range} ${css.rangeActive}` : css.range, onClick: () => { setPresetMs(r.ms); setCustom(false); }, children: t(r.key) }, r.key))), _jsx("button", { type: "button", className: custom ? `${css.range} ${css.rangeActive}` : css.range, onClick: () => { setCustom(true); }, children: t('range.custom') }), custom && (_jsxs("span", { className: css.customRange, children: [_jsx("input", { type: "number", min: 1, className: css.customInput, value: customN, onChange: (e) => { setCustomN(Math.max(1, Number(e.target.value) || 1)); } }), _jsxs("select", { className: css.customSelect, value: customUnit, onChange: (e) => { setCustomUnit(e.target.value); }, children: [_jsx("option", { value: "minutes", children: t('unit.minutes') }), _jsx("option", { value: "hours", children: t('unit.hours') }), _jsx("option", { value: "days", children: t('unit.days') })] })] }))] }), _jsxs("div", { className: css.summary, children: [_jsx(Stat, { label: t('an.summary.toolCalls'), value: String(report.totalToolCalls) }), _jsx(Stat, { label: t('an.summary.toolDuration'), value: formatDuration(report.totalToolMs) }), _jsx(Stat, { label: t('an.summary.turns'), value: String(report.turnCount) })] }), _jsxs("div", { className: css.section, children: [_jsx("div", { className: css.sectionTitle, children: t('chart.tokens') }), _jsx(TokenTrendChart, { history: history, now: now, rangeMs: rangeMs, t: t })] }), _jsxs("div", { className: css.section, children: [_jsx("div", { className: css.sectionTitle, children: t('an.tools.title') }), report.tools.length === 0
                        ? _jsx("div", { className: css.emptyHint, children: t('an.turns.empty') })
                        : (_jsxs("div", { className: css.toolLayout, children: [_jsx(ToolDonut, { tools: report.tools }), _jsx("div", { className: css.toolRows, children: report.tools.map(tool => (_jsx(ToolRow, { name: tool.name, count: tool.count, durationMs: tool.durationMs, max: maxToolMs, t: t }, tool.name))) })] }))] }), _jsxs("div", { className: css.section, children: [_jsx("div", { className: css.sectionTitle, children: t('an.turns.title') }), report.turns.length === 0
                        ? _jsx("div", { className: css.emptyHint, children: t('an.turns.empty') })
                        : report.turns.map(turn => _jsx(TurnRow, { turn: turn, now: now, t: t }, turn.turn))] })] }));
}
function Stat({ label, value }) {
    return (_jsxs("span", { className: css.stat, children: [_jsx("span", { className: css.statLabel, children: label }), _jsx("span", { className: css.statValue, children: value })] }));
}
function TokenTrendChart({ history, now, rangeMs, t }) {
    if (history === undefined)
        return _jsx("div", { className: css.chartEmpty, children: "\u2013" });
    const since = rangeMs === null ? null : now - rangeMs;
    const days = Object.keys(history)
        .filter(key => {
        if (since === null)
            return true;
        const dayTime = new Date(`${key}T00:00:00Z`).getTime();
        return dayTime >= since;
    })
        .sort();
    if (days.length === 0)
        return _jsx("div", { className: css.chartEmpty, children: "\u2013" });
    let max = 0;
    for (const key of days) {
        const d = history[key];
        const total = d.input + d.output;
        if (total > max)
            max = total;
    }
    const W = 620;
    const H = 120;
    const barW = Math.max(3, Math.floor(W / days.length) - 1);
    const color = 'var(--dsw-alias-state-business-primary)';
    return (_jsxs("div", { children: [_jsx("svg", { className: css.chart, viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none", role: "img", "aria-label": t('chart.tokens'), children: days.map((key, i) => {
                    const d = history[key];
                    const inH = max > 0 ? (d.input / max) * (H - 6) : 0;
                    const outH = max > 0 ? (d.output / max) * (H - 6) : 0;
                    const x = i * (barW + 1);
                    return (_jsxs("g", { children: [_jsx("rect", { x: x, y: H - inH - outH, width: barW, height: Math.max(1, inH), style: { fill: color, opacity: 0.5 } }), _jsx("rect", { x: x, y: H - outH, width: barW, height: Math.max(1, outH), style: { fill: color } })] }, key));
                }) }), _jsxs("div", { className: css.chartLegend, children: [_jsxs("span", { className: css.legendItem, children: [_jsx("span", { className: css.legendDot, style: { background: '#4176e6', opacity: 0.5 } }), t('chart.input')] }), _jsxs("span", { className: css.legendItem, children: [_jsx("span", { className: css.legendDot, style: { background: '#4176e6' } }), t('chart.output')] })] })] }));
}
function ToolDonut({ tools }) {
    const total = tools.reduce((sum, x) => sum + x.durationMs, 0);
    if (total <= 0)
        return null;
    const R = 42;
    const C = 2 * Math.PI * R;
    let acc = 0;
    const segments = tools.slice(0, 8).map((tool, i) => {
        const frac = tool.durationMs / total;
        const seg = { tool, color: PALETTE[i % PALETTE.length], dash: frac * C, offset: acc };
        acc += frac * C;
        return seg;
    });
    return (_jsx("div", { className: css.donutWrap, children: _jsxs("svg", { viewBox: "0 0 100 100", className: css.donut, role: "img", children: [_jsx("circle", { cx: "50", cy: "50", r: R, fill: "none", stroke: "var(--dsw-alias-interactive-bg-hover)", strokeWidth: "12" }), segments.map(s => (_jsx("circle", { cx: "50", cy: "50", r: R, fill: "none", stroke: s.color, strokeWidth: "12", strokeDasharray: `${s.dash} ${C - s.dash}`, strokeDashoffset: -s.offset, transform: "rotate(-90 50 50)" }, s.tool.name)))] }) }));
}
function ToolRow({ name, count, durationMs, max, t }) {
    const pct = max > 0 ? Math.min(100, (durationMs / max) * 100) : 0;
    return (_jsxs("div", { className: css.toolRow, children: [_jsx("span", { className: css.toolName, children: name }), _jsx("div", { className: css.toolTrack, children: _jsx("div", { className: css.toolFill, style: { width: `${pct}%` } }) }), _jsx("span", { className: css.toolCount, children: t('an.tools.count', { n: count }) }), _jsx("span", { className: css.toolDur, children: formatDuration(durationMs) })] }));
}
function TurnRow({ turn, now, t }) {
    const time = relativeTime(turn.startTime, now);
    const when = time.unit === 'now' ? t('time.now') : t(TIME_KEYS[time.unit], { n: time.n });
    return (_jsxs("div", { className: css.turnRow, children: [_jsxs("div", { className: css.turnHead, children: [_jsx("span", { className: css.turnTime, children: when }), _jsx("span", { className: css.turnDur, children: formatDuration(turn.durationMs) })] }), _jsx("div", { className: css.turnPrompt, children: turn.prompt.length > 0 ? turn.prompt : t('an.noPrompt') }), turn.tools.length > 0 && (_jsx("div", { className: css.turnTools, children: turn.tools.map(name => _jsx("span", { className: css.toolTag, children: name }, name)) }))] }));
}
//# sourceMappingURL=SessionAnalyticsView.js.map