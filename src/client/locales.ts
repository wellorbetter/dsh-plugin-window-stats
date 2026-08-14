/**
 * `windowStats` namespace dictionaries for the 「窗口统计」 (Window Stats) view tab.
 * Registered with the client locale service via `ctx.locale.register(NS, { zh, en })`.
 * Product copy is Chinese; code comments are English.
 */

/** Dictionary namespace owned by this plugin. */
export const NS = 'windowStats'

/** The window stats dictionary key set (the source of truth for both locales). */
export type WindowStatsKey =
  | 'view.windowStats'
  | 'header.sessions'
  | 'header.running'
  | 'col.status'
  | 'col.session'
  | 'col.progress'
  | 'col.tokensIn'
  | 'col.tokensOut'
  | 'col.cache'
  | 'col.context'
  | 'col.activity'
  | 'status.running'
  | 'status.idle'
  | 'status.completed'
  | 'status.waitingApproval'
  | 'status.waitingAnswer'
  | 'status.planReview'
  | 'empty.title'
  | 'empty.hint'
  | 'hint.hiddenSubagents'
  | 'value.missing'
  | 'value.cacheRatio'
  | 'value.context'
  | 'time.now'
  | 'time.min'
  | 'time.hour'
  | 'time.day'
  | 'time.week'
  | 'time.month'
  | 'time.year'
  | 'a11y.openSession'
  | 'a11y.status'
  | 'col.duration'
  | 'header.duration'
  | 'detail.title'
  | 'detail.empty'
  | 'detail.open'
  | 'detail.tokens'
  | 'detail.uncachedInput'
  | 'detail.cacheRead'
  | 'detail.cacheWrite'
  | 'detail.output'
  | 'detail.total'
  | 'detail.context'
  | 'detail.occupancy'
  | 'detail.system'
  | 'detail.tools'
  | 'detail.messages'
  | 'detail.timing'
  | 'detail.llm'
  | 'detail.tool'
  | 'detail.ttft'
  | 'detail.throughput'
  | 'detail.turns'
  | 'detail.steps'
  | 'detail.jobs'
  | 'detail.subagents'
  | 'value.tokPerSec'
  | 'value.ms'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The window stats view tab label and table copy. */
    'windowStats': WindowStatsKey
  }
}

/** Simplified Chinese dictionary. */
export const zh: Record<WindowStatsKey, string> = {
  'view.windowStats': '窗口统计',
  'header.sessions': '会话',
  'header.running': '运行中',
  'col.status': '状态',
  'col.session': '会话',
  'col.progress': '进度',
  'col.tokensIn': '输入 Tokens',
  'col.tokensOut': '输出 Tokens',
  'col.cache': '缓存命中',
  'col.context': '上下文',
  'col.activity': '最后活动',
  'status.running': '运行中',
  'status.idle': '空闲',
  'status.completed': '已完成',
  'status.waitingApproval': '等待审批',
  'status.waitingAnswer': '等待回答',
  'status.planReview': '待审计划',
  'empty.title': '暂无会话',
  'empty.hint': '在任意工作区开始对话后，这里会展示其进度与 token 消耗。',
  'hint.hiddenSubagents': '已隐藏 {n} 个子代理会话',
  'value.missing': '–',
  'value.cacheRatio': '{pct}%',
  'value.context': '~{pct}%',
  'time.now': '刚刚',
  'time.min': '{n} 分钟',
  'time.hour': '{n} 小时',
  'time.day': '{n} 天',
  'time.week': '{n} 周',
  'time.month': '{n} 个月',
  'time.year': '{n} 年',
  'a11y.openSession': '打开会话 {title}',
  'a11y.status': '状态：{label}',
  'col.duration': '耗时',
  'header.duration': '耗时',
  'detail.title': '会话详情',
  'detail.empty': '点击左侧会话查看详情',
  'detail.open': '打开会话',
  'detail.tokens': 'Token 明细',
  'detail.uncachedInput': '未缓存输入',
  'detail.cacheRead': '缓存读',
  'detail.cacheWrite': '缓存写',
  'detail.output': '输出',
  'detail.total': '合计',
  'detail.context': '上下文',
  'detail.occupancy': '占用',
  'detail.system': '系统',
  'detail.tools': '工具',
  'detail.messages': '消息',
  'detail.timing': '耗时',
  'detail.llm': 'LLM',
  'detail.tool': '工具',
  'detail.ttft': '首 Token 均值',
  'detail.throughput': '解码吞吐',
  'detail.turns': '轮次',
  'detail.steps': '步数',
  'detail.jobs': '后台任务',
  'detail.subagents': '子代理',
  'value.tokPerSec': '{n} tok/s',
  'value.ms': '{n} ms',
}

/** English dictionary. */
export const en: Record<WindowStatsKey, string> = {
  'view.windowStats': 'Window Stats',
  'header.sessions': 'Sessions',
  'header.running': 'Running',
  'col.status': 'Status',
  'col.session': 'Session',
  'col.progress': 'Progress',
  'col.tokensIn': 'Tokens in',
  'col.tokensOut': 'Tokens out',
  'col.cache': 'Cache hit',
  'col.context': 'Context',
  'col.activity': 'Last activity',
  'status.running': 'Running',
  'status.idle': 'Idle',
  'status.completed': 'Completed',
  'status.waitingApproval': 'Waiting for approval',
  'status.waitingAnswer': 'Waiting for your answer',
  'status.planReview': 'Plan review',
  'empty.title': 'No sessions yet',
  'empty.hint': 'Start a conversation in any workspace to see its progress and token usage here.',
  'hint.hiddenSubagents': '{n} subagent sessions hidden',
  'value.missing': '–',
  'value.cacheRatio': '{pct}%',
  'value.context': '~{pct}%',
  'time.now': 'now',
  'time.min': '{n}min',
  'time.hour': '{n}h',
  'time.day': '{n}d',
  'time.week': '{n}w',
  'time.month': '{n}mo',
  'time.year': '{n}y',
  'a11y.openSession': 'Open session {title}',
  'a11y.status': 'Status: {label}',
  'col.duration': 'Duration',
  'header.duration': 'Duration',
  'detail.title': 'Session details',
  'detail.empty': 'Select a session on the left to see details',
  'detail.open': 'Open session',
  'detail.tokens': 'Token breakdown',
  'detail.uncachedInput': 'Uncached input',
  'detail.cacheRead': 'Cache read',
  'detail.cacheWrite': 'Cache write',
  'detail.output': 'Output',
  'detail.total': 'Total',
  'detail.context': 'Context',
  'detail.occupancy': 'Occupancy',
  'detail.system': 'System',
  'detail.tools': 'Tools',
  'detail.messages': 'Messages',
  'detail.timing': 'Timing',
  'detail.llm': 'LLM',
  'detail.tool': 'Tool',
  'detail.ttft': 'Avg TTFT',
  'detail.throughput': 'Decode throughput',
  'detail.turns': 'Turns',
  'detail.steps': 'Steps',
  'detail.jobs': 'Background jobs',
  'detail.subagents': 'Subagents',
  'value.tokPerSec': '{n} tok/s',
  'value.ms': '{n} ms',
}
