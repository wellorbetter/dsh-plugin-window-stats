/**
 * Always-visible overview surfaces: a compact summary in the sidebar footer
 * (left) and a collapsible global overview panel docked to the right (via
 * `shell.overlay`). Both read the global session list (`useSessions`).
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/Overview
 */
import { useMemo, useState } from 'react'
import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only SlotMap merges for the two target slots.
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { NS } from './locales.ts'
import {
  DEFAULT_PRICING,
  aggregate,
  costUsd,
  deriveWindowRows,
  formatCost,
  formatDuration,
  formatTokens,
  relativeTime,
} from './stats.ts'
import css from './Overview.module.css'

/** Business face supplied by the plugin's apply closure. */
export interface OverviewInjected {
  open: (id: SessionId) => void
}

type SidebarProps = PropsRuntime<'sidebar.footer.action'> & PropsLocale<typeof NS>
type PanelProps = PropsRuntime<'shell.overlay'> & InjectFace<OverviewInjected> & PropsLocale<typeof NS>

/**
 * Compact sidebar-footer summary: running count and total input tokens.
 * @param props - the sidebar footer slot props.
 */
export function SidebarSummary({ wide, useSessions, t }: SidebarProps) {
  const state = useSessions(s => s)
  const rows = useMemo(() => deriveWindowRows(state, { includeBlank: false }), [state])
  const totals = useMemo(() => aggregate(rows), [rows])
  const cost = useMemo(
    () => rows.reduce((sum, r) => sum + (costUsd(r, DEFAULT_PRICING['deepseek-v4-pro']!) ?? 0), 0),
    [rows],
  )
  if (!wide) {
    return <span className={css.sidebarDot} title={`${totals.running} ${t('header.running')}`}>{totals.running}</span>
  }
  return (
    <div className={css.sidebarRow} title={`${t('header.running')} · ${t('col.tokensIn')} · ${t('header.cost')}`}>
      <span className={css.dot} />
      <span className={css.sidebarText}>
        <b>{totals.running}</b> {t('header.running')}
      </span>
      <span className={css.sidebarSub}>{formatTokens(totals.inputTokens)} · {formatCost(cost)}</span>
    </div>
  )
}

/**
 * Right-docked global overview panel: totals, running sessions, and top token
 * consumers, each clickable to open.
 * @param props - the shell.overlay slot props.
 */
export function GlobalOverviewPanel({ useSessions, open, t }: PanelProps) {
  const state = useSessions(s => s)
  const now = useMemo(() => Date.now(), [state])
  const rows = useMemo(() => deriveWindowRows(state, { includeBlank: false }), [state])
  const totals = useMemo(() => aggregate(rows), [rows])
  const [collapsed, setCollapsed] = useState(true)
  const running = useMemo(() => rows.filter(r => r.running), [rows])
  const top = useMemo(
    () => [...rows].sort((a, b) => (b.inputTokens ?? -1) - (a.inputTokens ?? -1)).slice(0, 6),
    [rows],
  )
  const recent = useMemo(() => rows.slice(0, 8), [rows])
  const cost = useMemo(
    () => rows.reduce((sum, r) => sum + (costUsd(r, DEFAULT_PRICING['deepseek-v4-pro']!) ?? 0), 0),
    [rows],
  )

  if (collapsed) {
    return (
      <button type="button" className={css.panelToggle} onClick={() => { setCollapsed(false) }} aria-label={t('overview.title')}>
        ◀
      </button>
    )
  }

  return (
    <div className={css.panel}>
      <div className={css.panelHead}>
        <span className={css.panelTitle}>{t('overview.title')}</span>
        <button type="button" className={css.panelClose} onClick={() => { setCollapsed(true) }} aria-label={t('overview.collapse')}>▶</button>
      </div>

      <div className={css.panelStats}>
        <div className={css.panelStat}><span className={css.panelStatLabel}>{t('header.sessions')}</span><span className={css.panelStatValue}>{String(totals.total)}</span></div>
        <div className={css.panelStat}><span className={css.panelStatLabel}>{t('header.running')}</span><span className={css.panelStatValue}>{String(totals.running)}</span></div>
        <div className={css.panelStat}><span className={css.panelStatLabel}>{t('col.tokensIn')}</span><span className={css.panelStatValue}>{formatTokens(totals.inputTokens)}</span></div>
        <div className={css.panelStat}><span className={css.panelStatLabel}>{t('header.duration')}</span><span className={css.panelStatValue}>{formatDuration(totals.llmMs + totals.toolMs)}</span></div>
        <div className={css.panelStat}><span className={css.panelStatLabel}>{t('header.cost')}</span><span className={css.panelStatValue}>{formatCost(cost)}</span></div>
      </div>

      <div className={css.panelSection} data-accent="running">
        <div className={css.panelSectionTitle}>
          <span className={css.accentDot} />
          {t('overview.running')}
          {running.length > 0 && <span className={css.sectionCount}>{running.length}</span>}
        </div>
        {running.length === 0
          ? <div className={css.panelEmpty}>–</div>
          : running.map(r => (
            <button key={r.id} type="button" className={css.panelItem} onClick={() => { open(r.id) }} title={r.title}>
              <span className={css.pulseDot} />
              <span className={css.panelItemTitle}>{r.title}</span>
            </button>
          ))}
      </div>

      <div className={css.panelSection} data-accent="top">
        <div className={css.panelSectionTitle}><span className={css.accentDot} />{t('overview.topTokens')}</div>
        {top.map(r => (
          <button key={r.id} type="button" className={css.panelItem} onClick={() => { open(r.id) }} title={r.title}>
            <span className={css.panelItemTitle}>{r.title}</span>
            <span className={css.panelItemValue}>{formatTokens(r.inputTokens ?? 0)}</span>
          </button>
        ))}
      </div>

      <div className={css.panelSection} data-accent="recent">
        <div className={css.panelSectionTitle}><span className={css.accentDot} />{t('overview.recent')}</div>
        {recent.map(r => (
          <button key={r.id} type="button" className={css.panelItem} onClick={() => { open(r.id) }} title={r.title}>
            <span className={css.panelItemTitle}>{r.title}</span>
            <span className={css.panelItemValue}>{whenLabel(r.updatedAt, now, t)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function whenLabel(ts: number, now: number, t: PanelProps['t']): string {
  const time = relativeTime(ts, now)
  if (time.unit === 'now') return t('time.now')
  const keys = { min: 'time.min', hour: 'time.hour', day: 'time.day', week: 'time.week', month: 'time.month', year: 'time.year' } as const
  return t(keys[time.unit], { n: time.n })
}
