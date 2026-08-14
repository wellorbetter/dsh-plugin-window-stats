/**
 * 「窗口统计」 view tab: a split dashboard — a toolbar (sort / filter / group /
 * cost model) above a per-session table, with a rich per-session detail panel
 * (token/context/timing breakdown + a token-consumption heatmap). Pure
 * presentational; data arrives through `useSessions` and the inject face.
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/WindowStatsView
 */
import { useMemo, useState } from 'react'
import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { StateDot, type StateDotState } from '@deepseek-ai/dsh-client-ui-primitives'
import { NS } from './locales.ts'
import {
  DEFAULT_PRICING,
  aggregate,
  cacheHitRatio,
  costUsd,
  decodeThroughput,
  deriveWindowRows,
  filterRows,
  formatCost,
  formatDuration,
  formatOneDecimal,
  formatTokens,
  groupByWorkspace,
  hiddenSubagentCount,
  peakDailyTokens,
  relativeTime,
  sortRows,
  ttftAverageMs,
  type ModelPricing,
  type RelativeTimeUnit,
  type SortKey,
  type StatusFilter,
  type TokenHistoryProjection,
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

type StatusKey =
  | 'status.running' | 'status.waitingApproval' | 'status.waitingAnswer'
  | 'status.planReview' | 'status.completed' | 'status.idle'

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

function stateOf(row: WindowRow): StateDotState {
  if (row.running) return 'ongoing'
  if (row.pendingInteraction !== undefined) return 'warning'
  return 'done'
}

type TimeKey = 'time.now' | 'time.min' | 'time.hour' | 'time.day' | 'time.week' | 'time.month' | 'time.year'
const TIME_UNIT_KEYS: Record<RelativeTimeUnit, TimeKey> = {
  now: 'time.now', min: 'time.min', hour: 'time.hour', day: 'time.day',
  week: 'time.week', month: 'time.month', year: 'time.year',
}

function rowDurationMs(row: WindowRow): number | null {
  if (row.llmMs === undefined && row.toolMs === undefined) return null
  return (row.llmMs ?? 0) + (row.toolMs ?? 0)
}

const MODEL_KEYS = ['deepseek-v4-flash', 'deepseek-v4-pro'] as const
type ModelKey = typeof MODEL_KEYS[number]

/**
 * Render the Window Stats dashboard.
 * @param props - the composed slot props.
 */
export function WindowStatsView({ useSessions, open, t }: WindowStatsProps) {
  const state = useSessions(s => s)
  const now = useMemo(() => Date.now(), [state])
  const allRows = useMemo(() => deriveWindowRows(state, { includeBlank: false }), [state])
  const hiddenSubagents = useMemo(() => hiddenSubagentCount(state), [state])

  const [sortKey, setSortKey] = useState<SortKey>('activity')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [grouped, setGrouped] = useState(false)
  const [modelKey, setModelKey] = useState<ModelKey>('deepseek-v4-pro')

  const pricing: ModelPricing = DEFAULT_PRICING[modelKey] ?? DEFAULT_PRICING['deepseek-v4-pro']!

  const filtered = useMemo(() => filterRows(allRows, statusFilter), [allRows, statusFilter])
  const sorted = useMemo(() => sortRows(filtered, sortKey), [filtered, sortKey])
  const groups = useMemo(() => (grouped ? groupByWorkspace(sorted) : null), [grouped, sorted])
  const totals = useMemo(() => aggregate(filtered), [filtered])
  const totalCost = useMemo(
    () => filtered.reduce((sum, row) => sum + (costUsd(row, pricing) ?? 0), 0),
    [filtered, pricing],
  )

  const [selectedId, setSelectedId] = useState<SessionId | null>(null)
  const selected = useMemo(
    () => (selectedId === null ? null : (allRows.find(r => r.id === selectedId) ?? null)),
    [allRows, selectedId],
  )

  if (allRows.length === 0) {
    return (
      <div className={css.empty}>
        <div className={css.emptyTitle}>{t('empty.title')}</div>
        <div className={css.emptyHint}>{t('empty.hint')}</div>
      </div>
    )
  }

  return (
    <div className={css.root}>
      <div className={css.toolbar}>
        <div className={css.toolGroup}>
          {(['activity', 'inputTokens', 'duration'] as const).map(key => (
            <button key={key} type="button"
              className={sortKey === key ? `${css.chip} ${css.chipActive}` : css.chip}
              onClick={() => { setSortKey(key) }}>
              {t(key === 'activity' ? 'sort.activity' : key === 'inputTokens' ? 'sort.inputTokens' : 'sort.duration')}
            </button>
          ))}
        </div>
        <div className={css.toolGroup}>
          {(['all', 'running', 'waiting', 'idle'] as const).map(key => (
            <button key={key} type="button"
              className={statusFilter === key ? `${css.chip} ${css.chipActive}` : css.chip}
              onClick={() => { setStatusFilter(key) }}>
              {t(key === 'all' ? 'filter.all' : key === 'running' ? 'filter.running' : key === 'waiting' ? 'filter.waiting' : 'filter.idle')}
            </button>
          ))}
        </div>
        <div className={css.toolGroup}>
          <button type="button"
            className={grouped ? `${css.chip} ${css.chipActive}` : css.chip}
            onClick={() => { setGrouped(v => !v) }}>
            {t('group.byWorkspace')}
          </button>
        </div>
        <div className={css.toolGroup}>
          {MODEL_KEYS.map(key => (
            <button key={key} type="button"
              className={modelKey === key ? `${css.chip} ${css.chipActive}` : css.chip}
              onClick={() => { setModelKey(key) }}
              title={`${key} ${t('header.cost')}`}>
              {key === 'deepseek-v4-flash' ? 'V4-Flash' : 'V4-Pro'}
            </button>
          ))}
        </div>
      </div>

      <div className={css.header}>
        <span className={css.headerItem}><span className={css.headerLabel}>{t('header.sessions')}</span><span className={css.headerValue}>{String(totals.total)}</span></span>
        <span className={css.headerItem}><span className={css.headerLabel}>{t('header.running')}</span><span className={css.headerValue}>{String(totals.running)}</span></span>
        <span className={css.headerItem}><span className={css.headerLabel}>{t('col.tokensIn')}</span><span className={css.headerValue}>{formatTokens(totals.inputTokens)}</span></span>
        <span className={css.headerItem}><span className={css.headerLabel}>{t('col.tokensOut')}</span><span className={css.headerValue}>{formatTokens(totals.outputTokens)}</span></span>
        <span className={css.headerItem}><span className={css.headerLabel}>{t('header.duration')}</span><span className={css.headerValue}>{formatDuration(totals.llmMs + totals.toolMs)}</span></span>
        <span className={css.headerItem}><span className={css.headerLabel}>{t('header.cost')}</span><span className={css.headerValue}>{formatCost(totalCost)}</span></span>
      </div>

      {hiddenSubagents > 0 && (
        <div className={css.hint}>{t('hint.hiddenSubagents', { n: hiddenSubagents })}</div>
      )}

      <div className={css.split}>
        <div className={css.listPane}>
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
                <th scope="col" className={css.thNum}>{t('col.duration')}</th>
                <th scope="col" className={css.thNum}>{t('col.cost')}</th>
                <th scope="col" className={css.thActivity}>{t('col.activity')}</th>
              </tr>
            </thead>
            <tbody>
              {groups !== null
                ? groups.map(group => (
                  <GroupSection key={group.title} group={group} now={now} t={t} pricing={pricing}
                    selectedId={selectedId} onSelect={setSelectedId} />
                ))
                : sorted.map(row => (
                  <WindowStatsRow key={row.id} row={row} now={now} t={t} pricing={pricing}
                    selected={row.id === selectedId} onSelect={() => { setSelectedId(row.id) }} />
                ))}
            </tbody>
          </table>
        </div>
        <aside className={css.detailPane}>
          {selected === null
            ? <div className={css.detailEmpty}>{t('detail.empty')}</div>
            : <SessionDetail row={selected} t={t} pricing={pricing} onOpen={() => { open(selected.id) }} />}
        </aside>
      </div>
    </div>
  )
}

function GroupSection({ group, now, t, pricing, selectedId, onSelect }: {
  group: { title: string; rows: WindowRow[] }
  now: number
  t: WindowStatsProps['t']
  pricing: ModelPricing
  selectedId: SessionId | null
  onSelect: (id: SessionId) => void
}) {
  return (
    <>
      <tr className={css.groupRow}><td colSpan={10} className={css.groupTitle}>{group.title === 'ungrouped' ? t('status.idle') : group.title}</td></tr>
      {group.rows.map(row => (
        <WindowStatsRow key={row.id} row={row} now={now} t={t} pricing={pricing}
          selected={row.id === selectedId} onSelect={() => { onSelect(row.id) }} />
      ))}
    </>
  )
}

interface RowProps {
  row: WindowRow
  now: number
  t: WindowStatsProps['t']
  pricing: ModelPricing
  selected: boolean
  onSelect: () => void
}

function WindowStatsRow({ row, now, t, pricing, selected, onSelect }: RowProps) {
  const hit = cacheHitRatio(row)
  const occupied = row.projectedTokens !== undefined && row.contextWindow !== undefined && row.contextWindow > 0
    ? Math.round((row.projectedTokens / row.contextWindow) * 100)
    : null
  const time = relativeTime(row.updatedAt, now)
  const activity = time.unit === 'now' ? t('time.now') : t(TIME_UNIT_KEYS[time.unit], { n: time.n })
  const statusLabel = t(statusKeyOf(row))
  const duration = rowDurationMs(row)
  const cost = costUsd(row, pricing)

  return (
    <tr
      className={selected ? `${css.row} ${css.rowSelected}` : css.row}
      onClick={onSelect}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect() } }}
      tabIndex={0}
      role="row"
      aria-selected={selected}
      aria-label={t('a11y.openSession', { title: row.title })}
    >
      <td className={css.cellStatus}><span className={css.statusCell}><StateDot state={stateOf(row)} /><span className={css.visuallyHidden}>{t('a11y.status', { label: statusLabel })}</span></span></td>
      <td className={css.cellTitle}><span className={css.title}>{row.title}</span>{row.cwd !== undefined && <span className={css.cwd}>{row.cwd}</span>}</td>
      <td className={css.cellProgress}>{row.turns !== undefined && row.steps !== undefined ? `${row.turns} / ${row.steps}` : '–'}</td>
      <td className={css.cellNum}>{row.inputTokens !== undefined ? formatTokens(row.inputTokens) : '–'}</td>
      <td className={css.cellNum}>{row.outputTokens !== undefined ? formatTokens(row.outputTokens) : '–'}</td>
      <td className={css.cellNum}>{hit !== null ? t('value.cacheRatio', { pct: Math.round(hit * 100) }) : '–'}</td>
      <td className={css.cellNum}>{occupied !== null ? t('value.context', { pct: occupied }) : '–'}</td>
      <td className={css.cellNum}>{duration !== null ? formatDuration(duration) : '–'}</td>
      <td className={css.cellNum}>{cost !== null ? formatCost(cost) : '–'}</td>
      <td className={css.cellActivity}>{activity}</td>
    </tr>
  )
}

interface DetailProps {
  row: WindowRow
  t: WindowStatsProps['t']
  pricing: ModelPricing
  onOpen: () => void
}

function SessionDetail({ row, t, pricing, onOpen }: DetailProps) {
  const hit = cacheHitRatio(row)
  const total = row.inputTokens !== undefined ? row.inputTokens + (row.outputTokens ?? 0) : undefined
  const occupied = row.projectedTokens !== undefined && row.contextWindow !== undefined && row.contextWindow > 0
    ? Math.round((row.projectedTokens / row.contextWindow) * 100)
    : null
  const throughput = decodeThroughput(row)
  const ttft = ttftAverageMs(row)
  const duration = rowDurationMs(row)
  const cost = costUsd(row, pricing)

  return (
    <div className={css.detail}>
      <div className={css.detailHead}>
        <div className={css.detailStatusRow}><StateDot state={stateOf(row)} /><span className={css.detailStatusText}>{t(statusKeyOf(row))}</span></div>
        <div className={css.detailTitle}>{row.title}</div>
        {row.cwd !== undefined && <div className={css.detailCwd}>{row.cwd}</div>}
      </div>

      <button type="button" className={css.detailOpen} onClick={onOpen}>{t('detail.open')}</button>

      <div className={css.detailSection}>
        <div className={css.detailSectionTitle}>{t('detail.tokens')}</div>
        <TokenBar label={t('detail.uncachedInput')} value={row.uncachedInputTokens} max={total} />
        <TokenBar label={t('detail.cacheRead')} value={row.cacheReadTokens} max={total} />
        <TokenBar label={t('detail.cacheWrite')} value={row.cacheWriteTokens} max={total} />
        <TokenBar label={t('detail.output')} value={row.outputTokens} max={total} />
        <Kv label={t('detail.total')} value={total !== undefined ? formatTokens(total) : '–'} />
        <Kv label={t('col.cache')} value={hit !== null ? t('value.cacheRatio', { pct: Math.round(hit * 100) }) : '–'} />
        <Kv label={t('col.cost')} value={cost !== null ? formatCost(cost) : '–'} />
      </div>

      <div className={css.detailSection}>
        <div className={css.detailSectionTitle}>{t('detail.context')}</div>
        {occupied !== null && <OccupancyBar pct={occupied} />}
        <Kv label={t('detail.occupancy')} value={occupied !== null ? t('value.context', { pct: occupied }) : '–'} />
        <Kv label={t('detail.system')} value={row.systemTokens !== undefined ? formatTokens(row.systemTokens) : '–'} />
        <Kv label={t('detail.tools')} value={row.toolsTokens !== undefined ? formatTokens(row.toolsTokens) : '–'} />
        <Kv label={t('detail.messages')} value={row.messageTokens !== undefined ? formatTokens(row.messageTokens) : '–'} />
      </div>

      <div className={css.detailSection}>
        <div className={css.detailSectionTitle}>{t('detail.timing')}</div>
        <Kv label={t('col.duration')} value={duration !== null ? formatDuration(duration) : '–'} />
        <Kv label={t('detail.llm')} value={row.llmMs !== undefined ? formatDuration(row.llmMs) : '–'} />
        <Kv label={t('detail.tool')} value={row.toolMs !== undefined ? formatDuration(row.toolMs) : '–'} />
        <Kv label={t('detail.ttft')} value={ttft !== null ? t('value.ms', { n: Math.round(ttft) }) : '–'} />
        <Kv label={t('detail.throughput')} value={throughput !== null ? t('value.tokPerSec', { n: formatOneDecimal(throughput) }) : '–'} />
      </div>

      <div className={css.detailSection}>
        <div className={css.detailSectionTitle}>{t('detail.heatmap')}</div>
        <Heatmap history={row.tokenHistory} />
      </div>

      <div className={css.detailSection}>
        <div className={css.detailSectionTitle}>{t('detail.turns')}</div>
        <Kv label={t('detail.turns')} value={row.turns !== undefined ? String(row.turns) : '–'} />
        <Kv label={t('detail.steps')} value={row.steps !== undefined ? String(row.steps) : '–'} />
        <Kv label={t('detail.jobs')} value={String(row.jobsCount)} />
        <Kv label={t('detail.subagents')} value={String(row.subagentCount)} />
      </div>
    </div>
  )
}

function Heatmap({ history }: { history: TokenHistoryProjection | undefined }) {
  if (history === undefined || Object.keys(history).length === 0) {
    return <div className={css.heatmapEmpty}>–</div>
  }
  const peak = peakDailyTokens(history)
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setUTCDate(start.getUTCDate() - 25 * 7) // ~26 weeks back
  start.setUTCDate(start.getUTCDate() - start.getUTCDay()) // align to Sunday
  const weeks: { key: string; total: number }[][] = []
  const cursor = new Date(start)
  while (cursor.getTime() <= today.getTime()) {
    const key = cursor.toISOString().slice(0, 10)
    const day = history[key]
    const total = day !== undefined ? day.input + day.output : 0
    const weekIndex = weeks.length - 1
    if (weeks.length === 0 || weeks[weekIndex]!.length === 7) weeks.push([])
    weeks[weeks.length - 1]!.push({ key, total })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return (
    <div className={css.heatmap}>
      {weeks.map((week, wi) => (
        <div key={wi} className={css.heatmapWeek}>
          {week.map(cell => {
            const opacity = cell.total === 0 ? 0.14 : 0.35 + 0.65 * (cell.total / peak)
            return <span key={cell.key} className={css.heatmapCell} style={{ opacity }} title={`${cell.key}: ${cell.total}`} />
          })}
        </div>
      ))}
    </div>
  )
}

function Kv({ label, value }: { label: string; value: string }) {
  return <div className={css.detailKV}><span className={css.detailKVLabel}>{label}</span><span className={css.detailKVValue}>{value}</span></div>
}

function TokenBar({ label, value, max }: { label: string; value: number | undefined; max: number | undefined }) {
  const v = value ?? 0
  const pct = max !== undefined && max > 0 ? Math.min(100, (v / max) * 100) : 0
  return (
    <div className={css.barRow}>
      <span className={css.barLabel}>{label}</span>
      <div className={css.barTrack}><div className={css.barFill} style={{ width: `${pct}%` }} /></div>
      <span className={css.barValue}>{formatTokens(v)}</span>
    </div>
  )
}

function OccupancyBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct))
  return <div className={css.occTrack}><div className={css.occFill} style={{ width: `${clamped}%` }} /></div>
}
