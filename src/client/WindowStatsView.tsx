/**
 * 「窗口统计」 view tab: a read-only table of every non-blank session with its
 * progress (turns/steps) and token consumption (input/output/cache/context),
 * plus an aggregate header. Pure presentational — all data arrives through the
 * framework standard kit (`useSessions`) and the inject face (`open`).
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/WindowStatsView
 */
import { useMemo } from 'react'
import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { StateDot, type StateDotState } from '@deepseek-ai/dsh-client-ui-primitives'
import { NS } from './locales.ts'
import {
  aggregate,
  cacheHitRatio,
  deriveWindowRows,
  formatTokens,
  relativeTime,
  type RelativeTimeUnit,
  type WindowRow,
} from './stats.ts'
import css from './WindowStatsView.module.css'

/** Business face supplied by the plugin's apply closure. */
export interface WindowStatsInjected {
  /** Open a session (current-session switch). */
  open: (id: SessionId) => void
}

/** Composed component props: the view slot shares plus the inject face and locale seat. */
type WindowStatsProps = ConvViewProps & InjectFace<WindowStatsInjected> & PropsLocale<typeof NS>

/** Map a row to its presentation state dot. */
function stateOf(row: WindowRow): StateDotState {
  if (row.running) return 'ongoing'
  if (row.pendingInteraction !== undefined) return 'warning'
  return 'done'
}

/** Localized status label key for a row. */
type StatusKey =
  | 'status.running'
  | 'status.waitingApproval'
  | 'status.waitingAnswer'
  | 'status.planReview'
  | 'status.completed'
  | 'status.idle'

function statusKeyOf(row: WindowRow): StatusKey {
  if (row.running) return 'status.running'
  switch (row.pendingInteraction) {
    case 'approval': return 'status.waitingApproval'
    case 'question': return 'status.waitingAnswer'
    case 'plan-review': return 'status.planReview'
    case undefined: break
  }
  return row.completed ? 'status.completed' : 'status.idle'
}

/** Relative-time label key per bucket. */
type TimeKey =
  | 'time.now'
  | 'time.min'
  | 'time.hour'
  | 'time.day'
  | 'time.week'
  | 'time.month'
  | 'time.year'

const TIME_UNIT_KEYS: Record<RelativeTimeUnit, TimeKey> = {
  now: 'time.now',
  min: 'time.min',
  hour: 'time.hour',
  day: 'time.day',
  week: 'time.week',
  month: 'time.month',
  year: 'time.year',
}

/**
 * Render the Window Stats dashboard.
 * @param props - the composed slot props.
 * @returns the table, header, and empty state.
 */
export function WindowStatsView({ useSessions, open, t }: WindowStatsProps) {
  const state = useSessions(s => s)
  const now = useMemo(() => Date.now(), [state])
  const rows = useMemo(() => deriveWindowRows(state, { includeBlank: false }), [state])
  const totals = useMemo(() => aggregate(rows), [rows])

  if (rows.length === 0) {
    return (
      <div className={css.empty}>
        <div className={css.emptyTitle}>{t('empty.title')}</div>
        <div className={css.emptyHint}>{t('empty.hint')}</div>
      </div>
    )
  }

  return (
    <div className={css.root}>
      <div className={css.header}>
        <span className={css.headerItem}>
          <span className={css.headerLabel}>{t('header.sessions')}</span>
          <span className={css.headerValue}>{String(totals.total)}</span>
        </span>
        <span className={css.headerItem}>
          <span className={css.headerLabel}>{t('header.running')}</span>
          <span className={css.headerValue}>{String(totals.running)}</span>
        </span>
        <span className={css.headerItem}>
          <span className={css.headerLabel}>{t('col.tokensIn')}</span>
          <span className={css.headerValue}>{formatTokens(totals.inputTokens)}</span>
        </span>
        <span className={css.headerItem}>
          <span className={css.headerLabel}>{t('col.tokensOut')}</span>
          <span className={css.headerValue}>{formatTokens(totals.outputTokens)}</span>
        </span>
      </div>
      <table className={css.table}>
        <thead>
          <tr>
            <th className={css.thStatus} scope="col">{t('col.status')}</th>
            <th scope="col">{t('col.session')}</th>
            <th scope="col">{t('col.progress')}</th>
            <th scope="col" className={css.thNum}>{t('col.tokensIn')}</th>
            <th scope="col" className={css.thNum}>{t('col.tokensOut')}</th>
            <th scope="col" className={css.thNum}>{t('col.cache')}</th>
            <th scope="col" className={css.thNum}>{t('col.context')}</th>
            <th scope="col" className={css.thActivity}>{t('col.activity')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => <WindowStatsRow key={row.id} row={row} now={now} t={t} onOpen={() => { open(row.id) }} />)}
        </tbody>
      </table>
    </div>
  )
}

interface RowProps {
  row: WindowRow
  now: number
  t: WindowStatsProps['t']
  onOpen: () => void
}

function WindowStatsRow({ row, now, t, onOpen }: RowProps) {
  const hit = cacheHitRatio(row)
  const occupied = row.projectedTokens !== undefined && row.contextWindow !== undefined && row.contextWindow > 0
    ? Math.round((row.projectedTokens / row.contextWindow) * 100)
    : null
  const time = relativeTime(row.updatedAt, now)
  const activity = time.unit === 'now' ? t('time.now') : t(TIME_UNIT_KEYS[time.unit], { n: time.n })
  const statusLabel = t(statusKeyOf(row))
  const dot = <StateDot state={stateOf(row)} />

  return (
    <tr
      className={css.row}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      tabIndex={0}
      role="row"
      aria-label={t('a11y.openSession', { title: row.title })}
    >
      <td className={css.cellStatus}>
        <span className={css.statusCell}>
          {dot}
          <span className={css.visuallyHidden}>{t('a11y.status', { label: statusLabel })}</span>
        </span>
      </td>
      <td className={css.cellTitle}>
        <span className={css.title}>{row.title}</span>
        {row.cwd !== undefined && <span className={css.cwd}>{row.cwd}</span>}
      </td>
      <td className={css.cellProgress}>
        {row.turns !== undefined && row.steps !== undefined
          ? `${row.turns} / ${row.steps}`
          : '–'}
      </td>
      <td className={css.cellNum}>{row.inputTokens !== undefined ? formatTokens(row.inputTokens) : '–'}</td>
      <td className={css.cellNum}>{row.outputTokens !== undefined ? formatTokens(row.outputTokens) : '–'}</td>
      <td className={css.cellNum}>{hit !== null ? t('value.cacheRatio', { pct: Math.round(hit * 100) }) : '–'}</td>
      <td className={css.cellNum}>{occupied !== null ? t('value.context', { pct: occupied }) : '–'}</td>
      <td className={css.cellActivity}>{activity}</td>
    </tr>
  )
}
