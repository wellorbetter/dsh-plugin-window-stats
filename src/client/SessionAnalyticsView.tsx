/**
 * 「会话分析」 view tab: a time-range-scoped activity report of the CURRENT
 * session — tool-type duration distribution (bars + donut), a token trend
 * chart, and per-turn task summaries. Reads the conversation snapshot and the
 * `tokenHistory` projection through the session standard kit.
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/SessionAnalyticsView
 */
import { useMemo, useState } from 'react'
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { NS } from './locales.ts'
import { deriveActivity, type ToolActivity, type TurnActivity } from './activity.ts'
import { formatDuration, formatTokens, relativeTime, type RelativeTimeUnit, type TokenHistoryProjection } from './stats.ts'
import css from './SessionAnalyticsView.module.css'

type Props = ConvViewProps & PropsLocale<typeof NS>

type RangeKey = 'range.10m' | 'range.1h' | 'range.1d' | 'range.all'
const PRESETS: readonly { key: RangeKey; ms: number | null }[] = [
  { key: 'range.10m', ms: 10 * 60_000 },
  { key: 'range.1h', ms: 60 * 60_000 },
  { key: 'range.1d', ms: 24 * 60 * 60_000 },
  { key: 'range.all', ms: null },
]

const UNIT_MS: Record<'minutes' | 'hours' | 'days', number> = {
  minutes: 60_000,
  hours: 3_600_000,
  days: 86_400_000,
}

const PALETTE = ['#4176e6', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

type TimeKey = 'time.now' | 'time.min' | 'time.hour' | 'time.day' | 'time.week' | 'time.month' | 'time.year'
const TIME_KEYS: Record<RelativeTimeUnit, TimeKey> = {
  now: 'time.now', min: 'time.min', hour: 'time.hour', day: 'time.day',
  week: 'time.week', month: 'time.month', year: 'time.year',
}

/**
 * Render the session activity analytics.
 * @param props - the composed slot props.
 */
export function SessionAnalyticsView({ useSession, useProjection, t }: Props) {
  const snapshot = useSession(s => s)
  const history = useProjection('tokenHistory')
  const now = useMemo(() => Date.now(), [snapshot])

  const [presetMs, setPresetMs] = useState<number | null>(null)
  const [custom, setCustom] = useState(false)
  const [customN, setCustomN] = useState(1)
  const [customUnit, setCustomUnit] = useState<'minutes' | 'hours' | 'days'>('hours')

  const rangeMs = custom ? customN * UNIT_MS[customUnit] : presetMs
  const report = useMemo(() => deriveActivity(snapshot, now, rangeMs), [snapshot, now, rangeMs])
  const maxToolMs = report.tools[0]?.durationMs ?? 0

  return (
    <div className={css.root}>
      <div className={css.ranges}>
        {PRESETS.map(r => (
          <button
            key={r.key}
            type="button"
            className={!custom && presetMs === r.ms ? `${css.range} ${css.rangeActive}` : css.range}
            onClick={() => { setPresetMs(r.ms); setCustom(false) }}
          >
            {t(r.key)}
          </button>
        ))}
        <button
          type="button"
          className={custom ? `${css.range} ${css.rangeActive}` : css.range}
          onClick={() => { setCustom(true) }}
        >
          {t('range.custom')}
        </button>
        {custom && (
          <span className={css.customRange}>
            <input
              type="number"
              min={1}
              className={css.customInput}
              value={customN}
              onChange={(e) => { setCustomN(Math.max(1, Number(e.target.value) || 1)) }}
            />
            <select
              className={css.customSelect}
              value={customUnit}
              onChange={(e) => { setCustomUnit(e.target.value as 'minutes' | 'hours' | 'days') }}
            >
              <option value="minutes">{t('unit.minutes')}</option>
              <option value="hours">{t('unit.hours')}</option>
              <option value="days">{t('unit.days')}</option>
            </select>
          </span>
        )}
      </div>

      <div className={css.summary}>
        <Stat label={t('an.summary.toolCalls')} value={String(report.totalToolCalls)} accent="business" />
        <Stat label={t('an.summary.toolDuration')} value={formatDuration(report.totalToolMs)} accent="warn" />
        <Stat label={t('an.summary.turns')} value={String(report.turnCount)} accent="success" />
      </div>

      <div className={css.section} data-accent="business">
        <div className={css.sectionTitle}>{t('chart.tokens')}</div>
        <TokenTrendChart history={history} now={now} rangeMs={rangeMs} t={t} />
      </div>

      <div className={css.section} data-accent="warn">
        <div className={css.sectionTitle}>{t('an.tools.title')}</div>
        {report.tools.length === 0
          ? <div className={css.emptyHint}>{t('an.turns.empty')}</div>
          : (
            <div className={css.toolLayout}>
              <ToolDonut tools={report.tools} />
              <div className={css.toolRows}>
                {report.tools.map(tool => (
                  <ToolRow key={tool.name} name={tool.name} count={tool.count} durationMs={tool.durationMs} max={maxToolMs} t={t} />
                ))}
              </div>
            </div>
          )}
      </div>

      <div className={css.section} data-accent="success">
        <div className={css.sectionTitle}>{t('an.turns.title')}</div>
        {report.turns.length === 0
          ? <div className={css.emptyHint}>{t('an.turns.empty')}</div>
          : report.turns.map(turn => <TurnRow key={turn.turn} turn={turn} now={now} t={t} />)}
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent: 'business' | 'warn' | 'success' }) {
  return (
    <span className={css.stat} data-accent={accent}>
      <span className={css.statLabel}>{label}</span>
      <span className={css.statValue}>{value}</span>
    </span>
  )
}

function TokenTrendChart({ history, now, rangeMs, t }: { history: TokenHistoryProjection | undefined; now: number; rangeMs: number | null; t: Props['t'] }) {
  if (history === undefined) return <div className={css.chartEmpty}>–</div>
  const since = rangeMs === null ? null : now - rangeMs
  const days = Object.keys(history)
    .filter(key => {
      if (since === null) return true
      const dayTime = new Date(`${key}T00:00:00Z`).getTime()
      return dayTime >= since
    })
    .sort()
  if (days.length === 0) return <div className={css.chartEmpty}>–</div>

  const series = days.map(key => ({ key, ...history[key]! }))
  let max = 0
  for (const s of series) max = Math.max(max, s.input, s.output)
  const scaleMax = max > 0 ? max : 1

  // Fixed, non-stretched canvas (aspect preserved; width is capped in CSS).
  const W = 520
  const H = 190
  const PAD = { top: 14, right: 14, bottom: 26, left: 48 }
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const xOf = (i: number): number => PAD.left + (plotW * (i + 0.5)) / series.length
  const yOf = (v: number): number => PAD.top + plotH - (v / scaleMax) * plotH
  const barW = series.length === 1 ? 40 : Math.min(40, (plotW / series.length) * 0.5)

  // Input tokens = bars (light), output tokens = line + dots (solid).
  const ticks = [0, 0.5, 1].map(f => ({ f, v: scaleMax * f, y: yOf(scaleMax * f) }))
  const linePath = series.map((s, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(s.output).toFixed(1)}`).join(' ')
  const dayLabel = (key: string): string => key.slice(5) // "YYYY-MM-DD" → "MM-DD"

  return (
    <div className={css.chartBox}>
      <svg className={css.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t('chart.tokens')}>
        {ticks.map(tk => (
          <g key={tk.f}>
            <line className={css.chartGrid} x1={PAD.left} x2={W - PAD.right} y1={tk.y} y2={tk.y} />
            <text className={css.chartAxis} x={PAD.left - 6} y={tk.y + 3} textAnchor="end">{formatTokens(tk.v)}</text>
          </g>
        ))}
        {series.map((s, i) => (
          <rect key={s.key} className={css.chartBar} x={xOf(i) - barW / 2} y={yOf(s.input)} width={barW} height={Math.max(1, PAD.top + plotH - yOf(s.input))} rx={3} />
        ))}
        <path className={css.chartLine} d={linePath} />
        {series.map((s, i) => (
          <g key={s.key}>
            <circle className={css.chartDot} cx={xOf(i)} cy={yOf(s.output)} r={3} />
            <text className={css.chartAxis} x={xOf(i)} y={H - 8} textAnchor="middle">{dayLabel(s.key)}</text>
          </g>
        ))}
      </svg>
      <div className={css.chartLegend}>
        <span className={css.legendItem}><span className={css.legendBar} />{t('chart.input')}</span>
        <span className={css.legendItem}><span className={css.legendLine} />{t('chart.output')}</span>
      </div>
    </div>
  )
}

function ToolDonut({ tools }: { tools: readonly ToolActivity[] }) {
  const total = tools.reduce((sum, x) => sum + x.durationMs, 0)
  if (total <= 0) return null
  const R = 42
  const C = 2 * Math.PI * R
  let acc = 0
  const segments = tools.slice(0, 8).map((tool, i) => {
    const frac = tool.durationMs / total
    const seg = { tool, color: PALETTE[i % PALETTE.length]!, dash: frac * C, offset: acc }
    acc += frac * C
    return seg
  })
  return (
    <div className={css.donutWrap}>
      <svg viewBox="0 0 100 100" className={css.donut} role="img">
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--dsw-alias-interactive-bg-hover)" strokeWidth="12" />
        {segments.map(s => (
          <circle key={s.tool.name} cx="50" cy="50" r={R} fill="none" stroke={s.color} strokeWidth="12"
            strokeDasharray={`${s.dash} ${C - s.dash}`} strokeDashoffset={-s.offset} transform="rotate(-90 50 50)" />
        ))}
      </svg>
    </div>
  )
}

function ToolRow({ name, count, durationMs, max, t }: { name: string; count: number; durationMs: number; max: number; t: Props['t'] }) {
  const pct = max > 0 ? Math.min(100, (durationMs / max) * 100) : 0
  return (
    <div className={css.toolRow}>
      <span className={css.toolName}>{name}</span>
      <div className={css.toolTrack}><div className={css.toolFill} style={{ width: `${pct}%` }} /></div>
      <span className={css.toolCount}>{t('an.tools.count', { n: count })}</span>
      <span className={css.toolDur}>{formatDuration(durationMs)}</span>
    </div>
  )
}

function TurnRow({ turn, now, t }: { turn: TurnActivity; now: number; t: Props['t'] }) {
  const time = relativeTime(turn.startTime, now)
  const when = time.unit === 'now' ? t('time.now') : t(TIME_KEYS[time.unit], { n: time.n })
  return (
    <div className={css.turnRow}>
      <div className={css.turnHead}>
        <span className={css.turnTime}>{when}</span>
        <span className={css.turnDur}>{formatDuration(turn.durationMs)}</span>
      </div>
      <div className={css.turnPrompt}>{turn.prompt.length > 0 ? turn.prompt : t('an.noPrompt')}</div>
      {turn.tools.length > 0 && (
        <div className={css.turnTools}>{turn.tools.map(name => <span key={name} className={css.toolTag}>{name}</span>)}</div>
      )}
    </div>
  )
}
