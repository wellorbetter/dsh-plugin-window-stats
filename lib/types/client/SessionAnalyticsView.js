import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 「会话分析」 view tab: a time-range-scoped activity report of the CURRENT
 * session — tool-type distribution plus per-turn task summaries. Reads the
 * conversation snapshot through the session standard kit (`useSession`).
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/SessionAnalyticsView
 */
import { useMemo, useState } from 'react';
import { deriveActivity } from "./activity.js";
import { formatDuration, relativeTime } from "./stats.js";
import css from './SessionAnalyticsView.module.css';
const RANGES = [
    { key: 'range.10m', ms: 10 * 60_000 },
    { key: 'range.1h', ms: 60 * 60_000 },
    { key: 'range.1d', ms: 24 * 60 * 60_000 },
    { key: 'range.all', ms: null },
];
const TIME_KEYS = {
    now: 'time.now', min: 'time.min', hour: 'time.hour', day: 'time.day',
    week: 'time.week', month: 'time.month', year: 'time.year',
};
/**
 * Render the session activity analytics.
 * @param props - the composed slot props.
 */
export function SessionAnalyticsView({ useSession, t }) {
    const snapshot = useSession(s => s);
    const now = useMemo(() => Date.now(), [snapshot]);
    const [rangeMs, setRangeMs] = useState(null);
    const report = useMemo(() => deriveActivity(snapshot, now, rangeMs), [snapshot, now, rangeMs]);
    const maxToolMs = report.tools[0]?.durationMs ?? 0;
    return (_jsxs("div", { className: css.root, children: [_jsx("div", { className: css.ranges, children: RANGES.map(r => (_jsx("button", { type: "button", className: r.ms === rangeMs ? `${css.range} ${css.rangeActive}` : css.range, onClick: () => { setRangeMs(r.ms); }, children: t(r.key) }, r.key))) }), _jsxs("div", { className: css.summary, children: [_jsx(Stat, { label: t('an.summary.toolCalls'), value: String(report.totalToolCalls) }), _jsx(Stat, { label: t('an.summary.toolDuration'), value: formatDuration(report.totalToolMs) }), _jsx(Stat, { label: t('an.summary.turns'), value: String(report.turnCount) })] }), _jsxs("div", { className: css.section, children: [_jsx("div", { className: css.sectionTitle, children: t('an.tools.title') }), report.tools.length === 0
                        ? _jsx("div", { className: css.emptyHint, children: t('an.turns.empty') })
                        : report.tools.map(tool => (_jsx(ToolRow, { name: tool.name, count: tool.count, durationMs: tool.durationMs, max: maxToolMs, t: t }, tool.name)))] }), _jsxs("div", { className: css.section, children: [_jsx("div", { className: css.sectionTitle, children: t('an.turns.title') }), report.turns.length === 0
                        ? _jsx("div", { className: css.emptyHint, children: t('an.turns.empty') })
                        : report.turns.map(turn => _jsx(TurnRow, { turn: turn, now: now, t: t }, turn.turn))] })] }));
}
function Stat({ label, value }) {
    return (_jsxs("span", { className: css.stat, children: [_jsx("span", { className: css.statLabel, children: label }), _jsx("span", { className: css.statValue, children: value })] }));
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