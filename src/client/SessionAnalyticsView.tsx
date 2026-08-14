/**
 * 「会话分析」 view tab: a time-range-scoped activity report of the CURRENT
 * session — tool-type distribution plus per-turn task summaries. Reads the
 * conversation snapshot through the session standard kit (`useSession`).
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/SessionAnalyticsView
 */
import { useMemo, useState } from 'react'
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { NS } from './locales.ts'
import { deriveActivity, type TurnActivity } from './activity.ts'
import { formatDuration, relativeTime, type RelativeTimeUnit } from './stats.ts'
import css from './SessionAnalyticsView.module.css'

type Props = ConvViewProps & PropsLocale<typeof NS>

const RANGES: readonly { key: 'range.10m' | 'range.1h' | 'range.1d' | 'range.all'; ms: number | null }[] = [
  { key: 'range.10m', ms: 10 * 60_000 },
  { key: 'range.1h', ms: 60 * 60_000 },
  { key: 'range.1d', ms: 24 * 60 * 60_000 },
  { key: 'range.all', ms: null },
]

type TimeKey = 'time.now' | 'time.min' | 'time.hour' | 'time.day' | 'time.week' | 'time.month' | 'time.year'
const TIME_KEYS: Record<RelativeTimeUnit, TimeKey> = {
  now: 'time.now', min: 'time.min', hour: 'time.hour', day: 'time.day',
  week: 'time.week', month: 'time.month', year: 'time.year',
}

/**
 * Render the session activity analytics.
 * @param props - the composed slot props.
 */
export function SessionAnalyticsView({ useSession, t }: Props) {
  const snapshot = useSession(s => s)
  const now = useMemo(() => Date.now(), [snapshot])
  const [rangeMs, setRangeMs] = useState<number | null>(null)
  const report = useMemo(() => deriveActivity(snapshot, now, rangeMs), [snapshot, now, rangeMs])
  const maxToolMs = report.tools[0]?.durationMs ?? 0

  return (
    <div className={css.root}>
      <div className={css.ranges}>
        {RANGES.map(r => (
          <button
            key={r.key}
            type="button"
            className={r.ms === rangeMs ? `${css.range} ${css.rangeActive}` : css.range}
            onClick={() => { setRangeMs(r.ms) }}
          >
            {t(r.key)}
          </button>
        ))}
      </div>

      <div className={css.summary}>
        <Stat label={t('an.summary.toolCalls')} value={String(report.totalToolCalls)} />
        <Stat label={t('an.summary.toolDuration')} value={formatDuration(report.totalToolMs)} />
        <Stat label={t('an.summary.turns')} value={String(report.turnCount)} />
      </div>

      <div className={css.section}>
        <div className={css.sectionTitle}>{t('an.tools.title')}</div>
        {report.tools.length === 0
          ? <div className={css.emptyHint}>{t('an.turns.empty')}</div>
          : report.tools.map(tool => (
            <ToolRow key={tool.name} name={tool.name} count={tool.count} durationMs={tool.durationMs} max={maxToolMs} t={t} />
          ))}
      </div>

      <div className={css.section}>
        <div className={css.sectionTitle}>{t('an.turns.title')}</div>
        {report.turns.length === 0
          ? <div className={css.emptyHint}>{t('an.turns.empty')}</div>
          : report.turns.map(turn => <TurnRow key={turn.turn} turn={turn} now={now} t={t} />)}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className={css.stat}>
      <span className={css.statLabel}>{label}</span>
      <span className={css.statValue}>{value}</span>
    </span>
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
