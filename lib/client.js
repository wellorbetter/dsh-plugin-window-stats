window.__ModuleLoader__.load({
	id: "@wellorbetter/dsh-plugin-window-stats",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region lib/types/client/locales.js
		/**
		* `windowStats` namespace dictionaries for the 「窗口统计」 (Window Stats) view tab.
		* Registered with the client locale service via `ctx.locale.register(NS, { zh, en })`.
		* Product copy is Chinese; code comments are English.
		*/
		/** Dictionary namespace owned by this plugin. */
		const NS = "windowStats";
		/** Simplified Chinese dictionary. */
		const zh = {
			"view.windowStats": "窗口统计",
			"header.sessions": "会话",
			"header.running": "运行中",
			"col.status": "状态",
			"col.session": "会话",
			"col.progress": "进度",
			"col.tokensIn": "输入 Tokens",
			"col.tokensOut": "输出 Tokens",
			"col.cache": "缓存命中",
			"col.context": "上下文",
			"col.activity": "最后活动",
			"status.running": "运行中",
			"status.idle": "空闲",
			"status.completed": "已完成",
			"status.waitingApproval": "等待审批",
			"status.waitingAnswer": "等待回答",
			"status.planReview": "待审计划",
			"empty.title": "暂无会话",
			"empty.hint": "在任意工作区开始对话后，这里会展示其进度与 token 消耗。",
			"hint.hiddenSubagents": "已隐藏 {n} 个子代理会话",
			"value.missing": "–",
			"value.cacheRatio": "{pct}%",
			"value.context": "~{pct}%",
			"time.now": "刚刚",
			"time.min": "{n} 分钟",
			"time.hour": "{n} 小时",
			"time.day": "{n} 天",
			"time.week": "{n} 周",
			"time.month": "{n} 个月",
			"time.year": "{n} 年",
			"a11y.openSession": "打开会话 {title}",
			"a11y.status": "状态：{label}",
			"col.duration": "耗时",
			"header.duration": "耗时",
			"detail.title": "会话详情",
			"detail.empty": "点击左侧会话查看详情",
			"detail.open": "打开会话",
			"detail.tokens": "Token 明细",
			"detail.uncachedInput": "未缓存输入",
			"detail.cacheRead": "缓存读",
			"detail.cacheWrite": "缓存写",
			"detail.output": "输出",
			"detail.total": "合计",
			"detail.context": "上下文",
			"detail.occupancy": "占用",
			"detail.system": "系统",
			"detail.tools": "工具",
			"detail.messages": "消息",
			"detail.timing": "耗时",
			"detail.llm": "LLM",
			"detail.tool": "工具",
			"detail.ttft": "首 Token 均值",
			"detail.throughput": "解码吞吐",
			"detail.turns": "轮次",
			"detail.steps": "步数",
			"detail.jobs": "后台任务",
			"detail.subagents": "子代理",
			"value.tokPerSec": "{n} tok/s",
			"value.ms": "{n} ms",
			"view.sessionAnalytics": "会话分析",
			"range.10m": "10 分钟",
			"range.1h": "1 小时",
			"range.1d": "1 天",
			"range.all": "全部",
			"an.summary.toolCalls": "工具调用",
			"an.summary.toolDuration": "工具耗时",
			"an.summary.turns": "轮次",
			"an.tools.title": "工具类型分布",
			"an.tools.count": "{n} 次",
			"an.tools.duration": "耗时",
			"an.turns.title": "任务摘要",
			"an.turns.empty": "该时间范围内暂无活动",
			"an.noPrompt": "（无用户输入）",
			"col.cost": "成本",
			"header.cost": "成本",
			"sort.activity": "按活动",
			"sort.inputTokens": "按输入",
			"sort.duration": "按耗时",
			"filter.all": "全部",
			"filter.running": "运行中",
			"filter.waiting": "等待中",
			"filter.idle": "空闲",
			"group.byWorkspace": "按工作区",
			"detail.heatmap": "Token 热力图",
			"range.custom": "自定义",
			"unit.minutes": "分钟",
			"unit.hours": "小时",
			"unit.days": "天",
			"chart.tokens": "Token 趋势",
			"chart.toolShare": "工具占比",
			"chart.input": "输入",
			"chart.output": "输出",
			"overview.title": "全局总览",
			"overview.running": "运行中",
			"overview.topTokens": "Token 消耗 Top",
			"overview.collapse": "收起",
			"overview.recent": "最近活动"
		};
		/** English dictionary. */
		const en = {
			"view.windowStats": "Window Stats",
			"header.sessions": "Sessions",
			"header.running": "Running",
			"col.status": "Status",
			"col.session": "Session",
			"col.progress": "Progress",
			"col.tokensIn": "Tokens in",
			"col.tokensOut": "Tokens out",
			"col.cache": "Cache hit",
			"col.context": "Context",
			"col.activity": "Last activity",
			"status.running": "Running",
			"status.idle": "Idle",
			"status.completed": "Completed",
			"status.waitingApproval": "Waiting for approval",
			"status.waitingAnswer": "Waiting for your answer",
			"status.planReview": "Plan review",
			"empty.title": "No sessions yet",
			"empty.hint": "Start a conversation in any workspace to see its progress and token usage here.",
			"hint.hiddenSubagents": "{n} subagent sessions hidden",
			"value.missing": "–",
			"value.cacheRatio": "{pct}%",
			"value.context": "~{pct}%",
			"time.now": "now",
			"time.min": "{n}min",
			"time.hour": "{n}h",
			"time.day": "{n}d",
			"time.week": "{n}w",
			"time.month": "{n}mo",
			"time.year": "{n}y",
			"a11y.openSession": "Open session {title}",
			"a11y.status": "Status: {label}",
			"col.duration": "Duration",
			"header.duration": "Duration",
			"detail.title": "Session details",
			"detail.empty": "Select a session on the left to see details",
			"detail.open": "Open session",
			"detail.tokens": "Token breakdown",
			"detail.uncachedInput": "Uncached input",
			"detail.cacheRead": "Cache read",
			"detail.cacheWrite": "Cache write",
			"detail.output": "Output",
			"detail.total": "Total",
			"detail.context": "Context",
			"detail.occupancy": "Occupancy",
			"detail.system": "System",
			"detail.tools": "Tools",
			"detail.messages": "Messages",
			"detail.timing": "Timing",
			"detail.llm": "LLM",
			"detail.tool": "Tool",
			"detail.ttft": "Avg TTFT",
			"detail.throughput": "Decode throughput",
			"detail.turns": "Turns",
			"detail.steps": "Steps",
			"detail.jobs": "Background jobs",
			"detail.subagents": "Subagents",
			"value.tokPerSec": "{n} tok/s",
			"value.ms": "{n} ms",
			"view.sessionAnalytics": "Session Analysis",
			"range.10m": "10m",
			"range.1h": "1h",
			"range.1d": "1d",
			"range.all": "All",
			"an.summary.toolCalls": "Tool calls",
			"an.summary.toolDuration": "Tool duration",
			"an.summary.turns": "Turns",
			"an.tools.title": "Tool-type distribution",
			"an.tools.count": "{n} calls",
			"an.tools.duration": "Duration",
			"an.turns.title": "Task summary",
			"an.turns.empty": "No activity in this range",
			"an.noPrompt": "(no user input)",
			"col.cost": "Cost",
			"header.cost": "Cost",
			"sort.activity": "Activity",
			"sort.inputTokens": "Input",
			"sort.duration": "Duration",
			"filter.all": "All",
			"filter.running": "Running",
			"filter.waiting": "Waiting",
			"filter.idle": "Idle",
			"group.byWorkspace": "By workspace",
			"detail.heatmap": "Token heatmap",
			"range.custom": "Custom",
			"unit.minutes": "min",
			"unit.hours": "h",
			"unit.days": "d",
			"chart.tokens": "Token trend",
			"chart.toolShare": "Tool share",
			"chart.input": "Input",
			"chart.output": "Output",
			"overview.title": "Overview",
			"overview.running": "Running",
			"overview.topTokens": "Top token usage",
			"overview.collapse": "Collapse",
			"overview.recent": "Recent activity"
		};
		//#endregion
		//#region lib/types/client/stats.js
		const ID_TAIL_LENGTH = 8;
		/** Fallback title: the last characters of the session id. */
		function idTail(id) {
			return id.length > ID_TAIL_LENGTH ? id.slice(-8) : id;
		}
		/**
		* Derive one row from a `SessionSummary`.
		* @param summary - the list row.
		* @returns the row with projection values copied (absent keys stay undefined).
		*/
		function deriveRow(summary) {
			const usage = summary.projectionValues?.tokenUsage;
			const stats = summary.projectionValues?.sessionStats;
			const pressure = summary.projectionValues?.contextPressure;
			const breakdown = summary.projectionValues?.contextBreakdown;
			return {
				id: summary.id,
				title: summary.displayTitle.length > 0 ? summary.displayTitle : idTail(summary.id),
				...summary.cwd !== void 0 ? { cwd: summary.cwd } : {},
				running: summary.running,
				...summary.pendingInteraction !== void 0 ? { pendingInteraction: summary.pendingInteraction } : {},
				completed: summary.completed === true,
				blank: summary.blank,
				updatedAt: summary.updatedAt,
				jobsCount: 0,
				subagentCount: 0,
				...stats !== void 0 ? {
					turns: stats.turns,
					steps: stats.steps,
					llmMs: stats.llmMs,
					toolMs: stats.toolMs,
					ttftMs: stats.ttftMs,
					ttftSteps: stats.ttftSteps,
					decodeMs: stats.decodeMs,
					decodeTokens: stats.decodeTokens
				} : {},
				...usage !== void 0 ? {
					uncachedInputTokens: usage.uncachedInputTokens,
					inputTokens: usage.uncachedInputTokens + usage.cacheReadTokens + usage.cacheWriteTokens,
					outputTokens: usage.outputTokens,
					cacheReadTokens: usage.cacheReadTokens,
					cacheWriteTokens: usage.cacheWriteTokens
				} : {},
				...pressure !== void 0 ? {
					...pressure.projectedTokens !== void 0 ? { projectedTokens: pressure.projectedTokens } : {},
					...pressure.contextWindow !== void 0 ? { contextWindow: pressure.contextWindow } : {}
				} : {},
				...breakdown !== void 0 ? {
					systemTokens: breakdown.systemTokens,
					toolsTokens: breakdown.toolsTokens,
					messageTokens: breakdown.messageTokens
				} : {},
				...summary.projectionValues?.tokenHistory !== void 0 ? { tokenHistory: summary.projectionValues.tokenHistory } : {}
			};
		}
		/**
		* Derive the ordered dashboard rows from a session-list snapshot.
		* @param state - the `useSessions` snapshot.
		* @param opts - blank/subagent filtering (defaults hide both).
		* @returns non-blank, non-subagent rows sorted by `updatedAt` descending (stable).
		*/
		function deriveWindowRows(state, opts) {
			const rows = [];
			for (const id of state.ids) {
				const summary = state.byId[id];
				if (summary === void 0) continue;
				if (summary.blank && !opts.includeBlank) continue;
				if (summary.origin === "subagent" && !opts.includeSubagents) continue;
				const row = deriveRow(summary);
				row.jobsCount = state.jobsBySession[id]?.length ?? 0;
				row.subagentCount = state.subagentsByParent[id]?.entries.length ?? 0;
				rows.push(row);
			}
			rows.sort((a, b) => b.updatedAt - a.updatedAt);
			return rows;
		}
		/**
		* Count sessions the dashboard hides by default (subagents, plus blank rows
		* when blank sessions are excluded).
		* @param state - the `useSessions` snapshot.
		* @returns the number of hidden subagent sessions.
		*/
		function hiddenSubagentCount(state) {
			let count = 0;
			for (const id of state.ids) {
				const summary = state.byId[id];
				if (summary !== void 0 && summary.origin === "subagent") count += 1;
			}
			return count;
		}
		/**
		* Aggregate totals across derived rows.
		* @param rows - the dashboard rows.
		* @returns counts and token sums (rows without a value contribute zero).
		*/
		function aggregate(rows) {
			let running = 0;
			let inputTokens = 0;
			let outputTokens = 0;
			let cacheReadTokens = 0;
			let cacheWriteTokens = 0;
			let llmMs = 0;
			let toolMs = 0;
			let counted = 0;
			for (const row of rows) {
				if (row.running) running += 1;
				if (row.inputTokens !== void 0) {
					inputTokens += row.inputTokens;
					outputTokens += row.outputTokens ?? 0;
					cacheReadTokens += row.cacheReadTokens ?? 0;
					cacheWriteTokens += row.cacheWriteTokens ?? 0;
					counted += 1;
				}
				llmMs += row.llmMs ?? 0;
				toolMs += row.toolMs ?? 0;
			}
			return {
				total: rows.length,
				running,
				inputTokens,
				outputTokens,
				cacheReadTokens,
				cacheWriteTokens,
				llmMs,
				toolMs,
				counted
			};
		}
		/**
		* Cache-hit ratio for one row, clamped to [0, 1].
		* @param row - the dashboard row.
		* @returns the ratio, or null when the row has no input tokens.
		*/
		function cacheHitRatio(row) {
			if (row.inputTokens === void 0 || row.inputTokens <= 0) return null;
			const reads = row.cacheReadTokens ?? 0;
			return Math.min(1, Math.max(0, reads / row.inputTokens));
		}
		/**
		* Compact token/step formatting: 1234 → "1.2k", 1234567 → "1.2M".
		* @param n - a finite non-negative number.
		* @returns the formatted string ("–" for non-finite values).
		*/
		function formatTokens(n) {
			if (!Number.isFinite(n) || n < 0) return "–";
			if (n < 1e3) return String(Math.floor(n));
			if (n < 1e6) return trimTenths(n / 1e3) + "k";
			return trimTenths(n / 1e6) + "M";
		}
		/** One-decimal formatting with a trailing ".0" removed. */
		function trimTenths(value) {
			const tenths = Math.floor(value * 10) / 10;
			return Number.isInteger(tenths) ? String(tenths) : tenths.toFixed(1);
		}
		/**
		* Human wall-time formatting for a millisecond duration: 45s, 3m 12s, 1h 23m, 2d 5h.
		* @param ms - non-negative duration in milliseconds.
		* @returns the formatted string ("–" for non-finite values).
		*/
		function formatDuration(ms) {
			if (!Number.isFinite(ms) || ms < 0) return "–";
			const seconds = Math.round(ms / 1e3);
			if (seconds < 60) return `${seconds}s`;
			const minutes = Math.floor(seconds / 60);
			if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
			const hours = Math.floor(minutes / 60);
			if (hours < 24) return `${hours}h ${minutes % 60}m`;
			return `${Math.floor(hours / 24)}d ${hours % 24}h`;
		}
		/**
		* Decode throughput in tokens/second over the decode-timed steps.
		* @param row - the dashboard row.
		* @returns tokens/second, or null when the row has no decode timing/usage.
		*/
		function decodeThroughput(row) {
			if (row.decodeMs === void 0 || row.decodeTokens === void 0 || row.decodeMs <= 0) return null;
			return row.decodeTokens / row.decodeMs * 1e3;
		}
		/**
		* Average first-token latency across the steps that recorded one.
		* @param row - the dashboard row.
		* @returns average TTFT in milliseconds, or null when no step recorded one.
		*/
		function ttftAverageMs(row) {
			if (row.ttftMs === void 0 || row.ttftSteps === void 0 || row.ttftSteps <= 0) return null;
			return row.ttftMs / row.ttftSteps;
		}
		/**
		* One-decimal number formatting with a trailing ".0" removed (e.g. 12.3, 5).
		* @param n - a finite number.
		* @returns the formatted string.
		*/
		function formatOneDecimal(n) {
			if (!Number.isFinite(n)) return "–";
			const tenths = Math.round(n * 10) / 10;
			return Number.isInteger(tenths) ? String(tenths) : tenths.toFixed(1);
		}
		/**
		* Bucket an epoch-ms timestamp relative to `now` for localized display.
		* @param ts - the timestamp (epoch ms).
		* @param now - the current time (epoch ms).
		* @returns the unit and its count.
		*/
		function relativeTime(ts, now) {
			const seconds = Math.max(0, Math.floor((now - ts) / 1e3));
			if (seconds < 60) return {
				unit: "now",
				n: 0
			};
			const minutes = Math.floor(seconds / 60);
			if (minutes < 60) return {
				unit: "min",
				n: minutes
			};
			const hours = Math.floor(minutes / 60);
			if (hours < 24) return {
				unit: "hour",
				n: hours
			};
			const days = Math.floor(hours / 24);
			if (days < 7) return {
				unit: "day",
				n: days
			};
			const weeks = Math.floor(days / 7);
			if (days < 30) return {
				unit: "week",
				n: weeks
			};
			const months = Math.floor(days / 30);
			if (days < 365) return {
				unit: "month",
				n: months
			};
			return {
				unit: "year",
				n: Math.floor(days / 365)
			};
		}
		/**
		* DeepSeek official pricing (snapshot 2026-08-14 from
		* https://api-docs.deepseek.com/quick_start/pricing/). Update here when the
		* upstream page changes.
		*/
		const DEFAULT_PRICING = {
			"deepseek-v4-flash": {
				inputHit: .0028,
				inputMiss: .14,
				output: .28
			},
			"deepseek-v4-pro": {
				inputHit: .003625,
				inputMiss: .435,
				output: .87
			}
		};
		/**
		* Estimate the USD cost of one session's recorded usage.
		* Cache reads are billed at the hit price; uncached input and cache writes at
		* the miss price; output at the output price.
		* @param row - the dashboard row.
		* @param pricing - the model pricing to apply.
		* @returns cost in USD, or null when the row has no usage.
		*/
		function costUsd(row, pricing) {
			if (row.inputTokens === void 0) return null;
			const miss = (row.uncachedInputTokens ?? 0) + (row.cacheWriteTokens ?? 0);
			const hit = row.cacheReadTokens ?? 0;
			const output = row.outputTokens ?? 0;
			return (miss * pricing.inputMiss + hit * pricing.inputHit + output * pricing.output) / 1e6;
		}
		/** Approximate exchange rates (snapshot 2026-08; update as needed). */
		const CURRENCIES = [
			{
				code: "USD",
				symbol: "$",
				rate: 1
			},
			{
				code: "CNY",
				symbol: "¥",
				rate: 7.2
			},
			{
				code: "EUR",
				symbol: "€",
				rate: .92
			},
			{
				code: "GBP",
				symbol: "£",
				rate: .79
			},
			{
				code: "JPY",
				symbol: "¥",
				rate: 150
			}
		];
		/**
		* Format a USD cost in the given currency: $12.30, ¥88.56, €11.32, ¥1,320.
		* @param usd - cost in USD.
		* @param currency - display currency (default USD).
		*/
		function formatCost(usd, currency = CURRENCIES[0]) {
			if (!Number.isFinite(usd) || usd < 0) return "–";
			const amount = usd * currency.rate;
			if (currency.code === "JPY") return `${currency.symbol}${Math.round(amount)}`;
			let decimals = 2;
			if (amount >= 100) decimals = 0;
			else if (amount < 1) decimals = 3;
			else if (amount < .01) decimals = 4;
			return `${currency.symbol}${amount.toFixed(decimals)}`;
		}
		/** Whether a row is in a waiting state (pending interaction). */
		function isWaiting(row) {
			return row.pendingInteraction !== void 0;
		}
		/**
		* Filter rows by status bucket.
		* @param rows - the derived rows.
		* @param status - the bucket to keep.
		* @returns the filtered rows.
		*/
		function filterRows(rows, status) {
			switch (status) {
				case "running": return rows.filter((r) => r.running);
				case "waiting": return rows.filter(isWaiting);
				case "idle": return rows.filter((r) => !r.running && !isWaiting(r));
				case "all": return [...rows];
			}
		}
		/**
		* Sort rows by the given key (stable tie-break by activity).
		* @param rows - the derived rows.
		* @param key - the sort key.
		* @returns a new sorted array.
		*/
		function sortRows(rows, key) {
			const copy = [...rows];
			switch (key) {
				case "inputTokens":
					copy.sort((a, b) => (b.inputTokens ?? -1) - (a.inputTokens ?? -1));
					return copy;
				case "duration": {
					const dur = (r) => (r.llmMs ?? 0) + (r.toolMs ?? 0);
					copy.sort((a, b) => dur(b) - dur(a));
					return copy;
				}
				case "activity":
					copy.sort((a, b) => b.updatedAt - a.updatedAt);
					return copy;
			}
		}
		/** Basename of a path (workspace title fallback). */
		function basename(path) {
			const norm = path.replace(/[\\/]+$/, "");
			const idx = Math.max(norm.lastIndexOf("\\"), norm.lastIndexOf("/"));
			return idx >= 0 ? norm.slice(idx + 1) : norm;
		}
		/**
		* Group rows by workspace (cwd), preserving the input order inside each group.
		* @param rows - the derived rows (already sorted).
		* @returns groups ordered by their first row's position.
		*/
		function groupByWorkspace(rows) {
			const groups = [];
			const index = /* @__PURE__ */ new Map();
			for (const row of rows) {
				const title = row.cwd !== void 0 && row.cwd.length > 0 ? basename(row.cwd) : "ungrouped";
				let group = index.get(title);
				if (group === void 0) {
					group = {
						title,
						rows: []
					};
					index.set(title, group);
					groups.push(group);
				}
				group.rows.push(row);
			}
			return groups;
		}
		/**
		* Peak daily token total (input + output) across the history.
		* @param history - the per-day token history.
		* @returns the maximum single-day total (0 when empty).
		*/
		function peakDailyTokens(history) {
			let peak = 0;
			for (const key of Object.keys(history)) {
				const day = history[key];
				if (day === void 0) continue;
				const total = day.input + day.output;
				if (total > peak) peak = total;
			}
			return peak;
		}
		//#endregion
		//#region \0dsh-css:I:\Github\pr\.opencode\workflow\dsh-window-stats\plugin\src\client\WindowStatsView.module.css.mjs
		const css$2 = ".SBPBLa_root{flex-direction:column;gap:10px;height:100%;min-height:0;padding:12px 16px;display:flex;overflow:hidden}.SBPBLa_header{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover);border-radius:10px;flex-wrap:wrap;align-items:center;gap:16px;padding:12px 16px;display:flex;box-shadow:0 1px 2px #00000008}.SBPBLa_headerItem{align-items:baseline;gap:6px;display:flex}.SBPBLa_headerLabel{color:var(--dsw-alias-label-tertiary);font-size:12px}.SBPBLa_headerValue{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;font-weight:600}.SBPBLa_hint{color:var(--dsw-alias-label-tertiary);padding:0 2px;font-size:12px}.SBPBLa_toolbar{flex-wrap:wrap;gap:10px 14px;display:flex}.SBPBLa_toolGroup{flex-wrap:wrap;gap:4px;display:flex}.SBPBLa_chip{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:999px;padding:3px 10px;font-size:12px}.SBPBLa_chip:hover{background:var(--dsw-alias-interactive-bg-hover)}.SBPBLa_chipActive{color:#fff;border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-primary);font-weight:600}.SBPBLa_select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-primary);border-radius:6px;padding:3px 8px;font-size:12px}.SBPBLa_table{border-collapse:collapse;width:100%;font-size:13px}.SBPBLa_table th{text-align:left;border-bottom:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);white-space:nowrap;background:var(--dsw-alias-interactive-bg-hover);padding:6px 8px;font-weight:500}.SBPBLa_table tbody tr:nth-child(2n) td{background:#26314805}.SBPBLa_table td{border-bottom:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;vertical-align:middle;padding:8px}.SBPBLa_thStatus{width:40px}.SBPBLa_thNum,.SBPBLa_thActivity{text-align:right}.SBPBLa_row{cursor:pointer;outline:none}.SBPBLa_row:hover,.SBPBLa_row:focus-visible{background:var(--dsw-alias-interactive-bg-hover)}.SBPBLa_row:focus-visible{box-shadow:inset 0 0 0 1px var(--dsw-alias-state-business-primary)}.SBPBLa_rowSelected{background:var(--dsw-alias-interactive-bg-hover);box-shadow:inset 2px 0 0 var(--dsw-alias-state-business-primary)}.SBPBLa_cellStatus{width:40px}.SBPBLa_statusCell{align-items:center;gap:6px;display:inline-flex}.SBPBLa_statusBadge{white-space:nowrap;border-radius:999px;padding:1px 8px;font-size:11px}.SBPBLa_badgeRunning{color:#1d4ed8;background:#3b82f61f}.SBPBLa_badgeWaiting{color:#b45309;background:#f59e0b24}.SBPBLa_badgeDone{color:#15803d;background:#22c55e1f}.SBPBLa_badgeIdle{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}.SBPBLa_cellTitle{flex-direction:column;gap:2px;max-width:280px;display:flex}.SBPBLa_title{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.SBPBLa_cwd{text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary);text-align:left;direction:rtl;font-size:11px;overflow:hidden}.SBPBLa_cellProgress{white-space:nowrap}.SBPBLa_cellNum{text-align:right;white-space:nowrap}.SBPBLa_cellActivity{text-align:right;color:var(--dsw-alias-label-secondary);white-space:nowrap}.SBPBLa_empty{height:100%;color:var(--dsw-alias-label-secondary);flex-direction:column;justify-content:center;align-items:center;gap:8px;display:flex}.SBPBLa_emptyTitle{color:var(--dsw-alias-label-primary);font-weight:600}.SBPBLa_emptyHint{text-align:center;max-width:420px;color:var(--dsw-alias-label-tertiary)}.SBPBLa_visuallyHidden{clip:rect(0 0 0 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.SBPBLa_split{flex:1;gap:12px;min-height:0;display:flex}.SBPBLa_listPane{flex:1;min-width:0;overflow:auto}.SBPBLa_detailPane{border-left:1px solid var(--dsw-alias-border-l2);flex:0 0 300px;width:300px;padding-left:12px;overflow:auto}.SBPBLa_detailEmpty{color:var(--dsw-alias-label-tertiary);padding:8px 2px;font-size:13px}.SBPBLa_detail{flex-direction:column;gap:14px;display:flex}.SBPBLa_detailHead{flex-direction:column;gap:4px;display:flex}.SBPBLa_detailStatusRow{align-items:center;gap:6px;display:flex}.SBPBLa_detailStatusText{color:var(--dsw-alias-label-secondary);font-size:12px}.SBPBLa_detailTitle{color:var(--dsw-alias-label-primary);overflow-wrap:anywhere;font-size:15px;font-weight:600}.SBPBLa_detailCwd{color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere;font-size:11px}.SBPBLa_detailOpen{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-primary);cursor:pointer;border-radius:6px;align-self:flex-start;padding:5px 12px;font-size:12px}.SBPBLa_detailOpen:hover{background:var(--dsw-alias-interactive-bg-hover)}.SBPBLa_detailSection{border-top:1px solid var(--dsw-alias-border-l2);flex-direction:column;gap:6px;padding-top:10px;display:flex}.SBPBLa_detailSectionTitle{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600}.SBPBLa_detailKV{justify-content:space-between;align-items:baseline;font-size:12px;display:flex}.SBPBLa_detailKVLabel{color:var(--dsw-alias-label-tertiary)}.SBPBLa_detailKVValue{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}.SBPBLa_barRow{grid-template-columns:72px 1fr 52px;align-items:center;gap:8px;font-size:12px;display:grid}.SBPBLa_barLabel{color:var(--dsw-alias-label-tertiary);white-space:nowrap}.SBPBLa_barTrack{background:var(--dsw-alias-interactive-bg-hover);border-radius:3px;height:6px;overflow:hidden}.SBPBLa_barFill{background:var(--dsw-alias-state-business-primary);border-radius:3px;height:100%}.SBPBLa_barValue{text-align:right;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}.SBPBLa_occTrack{background:var(--dsw-alias-interactive-bg-hover);border-radius:4px;height:8px;overflow:hidden}.SBPBLa_occFill{background:var(--dsw-alias-state-business-primary);border-radius:4px;height:100%}.SBPBLa_groupRow td{border-bottom:none;padding:10px 8px 4px}.SBPBLa_groupTitle{color:var(--dsw-alias-label-secondary);text-transform:none;font-size:12px;font-weight:600}.SBPBLa_heatmap{gap:2px;padding:2px 0;display:flex;overflow-x:auto}.SBPBLa_heatmapWeek{flex-direction:column;gap:2px;display:flex}.SBPBLa_heatmapCell{background:var(--dsw-alias-state-business-primary);border-radius:2px;width:11px;height:11px}.SBPBLa_heatmapEmpty{color:var(--dsw-alias-label-tertiary);font-size:12px}";
		const tagId$2 = "@wellorbetter/dsh-plugin-window-stats/WindowStatsView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@wellorbetter/dsh-plugin-window-stats";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var WindowStatsView_module_css_default = {
			"detail": "SBPBLa_detail",
			"cellActivity": "SBPBLa_cellActivity",
			"detailSectionTitle": "SBPBLa_detailSectionTitle",
			"headerItem": "SBPBLa_headerItem",
			"thStatus": "SBPBLa_thStatus",
			"badgeRunning": "SBPBLa_badgeRunning",
			"detailKV": "SBPBLa_detailKV",
			"barRow": "SBPBLa_barRow",
			"visuallyHidden": "SBPBLa_visuallyHidden",
			"groupTitle": "SBPBLa_groupTitle",
			"badgeIdle": "SBPBLa_badgeIdle",
			"badgeDone": "SBPBLa_badgeDone",
			"detailHead": "SBPBLa_detailHead",
			"detailOpen": "SBPBLa_detailOpen",
			"cellTitle": "SBPBLa_cellTitle",
			"table": "SBPBLa_table",
			"cellStatus": "SBPBLa_cellStatus",
			"row": "SBPBLa_row",
			"detailTitle": "SBPBLa_detailTitle",
			"thNum": "SBPBLa_thNum",
			"heatmapEmpty": "SBPBLa_heatmapEmpty",
			"detailEmpty": "SBPBLa_detailEmpty",
			"toolGroup": "SBPBLa_toolGroup",
			"split": "SBPBLa_split",
			"header": "SBPBLa_header",
			"detailPane": "SBPBLa_detailPane",
			"barValue": "SBPBLa_barValue",
			"statusCell": "SBPBLa_statusCell",
			"cellProgress": "SBPBLa_cellProgress",
			"listPane": "SBPBLa_listPane",
			"detailSection": "SBPBLa_detailSection",
			"statusBadge": "SBPBLa_statusBadge",
			"detailCwd": "SBPBLa_detailCwd",
			"badgeWaiting": "SBPBLa_badgeWaiting",
			"title": "SBPBLa_title",
			"root": "SBPBLa_root",
			"occTrack": "SBPBLa_occTrack",
			"empty": "SBPBLa_empty",
			"heatmapCell": "SBPBLa_heatmapCell",
			"headerValue": "SBPBLa_headerValue",
			"detailKVValue": "SBPBLa_detailKVValue",
			"barFill": "SBPBLa_barFill",
			"headerLabel": "SBPBLa_headerLabel",
			"select": "SBPBLa_select",
			"cellNum": "SBPBLa_cellNum",
			"detailStatusRow": "SBPBLa_detailStatusRow",
			"thActivity": "SBPBLa_thActivity",
			"barLabel": "SBPBLa_barLabel",
			"chipActive": "SBPBLa_chipActive",
			"emptyHint": "SBPBLa_emptyHint",
			"emptyTitle": "SBPBLa_emptyTitle",
			"cwd": "SBPBLa_cwd",
			"hint": "SBPBLa_hint",
			"chip": "SBPBLa_chip",
			"toolbar": "SBPBLa_toolbar",
			"heatmap": "SBPBLa_heatmap",
			"barTrack": "SBPBLa_barTrack",
			"detailStatusText": "SBPBLa_detailStatusText",
			"occFill": "SBPBLa_occFill",
			"rowSelected": "SBPBLa_rowSelected",
			"heatmapWeek": "SBPBLa_heatmapWeek",
			"groupRow": "SBPBLa_groupRow",
			"detailKVLabel": "SBPBLa_detailKVLabel"
		};
		//#endregion
		//#region lib/types/client/WindowStatsView.js
		/**
		* 「窗口统计」 view tab: a split dashboard — a toolbar (sort / filter / group /
		* cost model) above a per-session table, with a rich per-session detail panel
		* (token/context/timing breakdown + a token-consumption heatmap). Pure
		* presentational; data arrives through `useSessions` and the inject face.
		*
		* @module @wellorbetter/dsh-plugin-window-stats/client/WindowStatsView
		*/
		function statusKeyOf(row) {
			if (row.running) return "status.running";
			switch (row.pendingInteraction) {
				case "approval": return "status.waitingApproval";
				case "question": return "status.waitingAnswer";
				case "plan-review": return "status.planReview";
				case void 0:
			}
			return row.completed ? "status.completed" : "status.idle";
		}
		function stateOf(row) {
			if (row.running) return "ongoing";
			if (row.pendingInteraction !== void 0) return "warning";
			return "done";
		}
		/** CSS class for a row's visible status badge. */
		function statusBadgeClass(row) {
			if (row.running) return WindowStatsView_module_css_default.badgeRunning;
			if (row.pendingInteraction !== void 0) return WindowStatsView_module_css_default.badgeWaiting;
			return row.completed ? WindowStatsView_module_css_default.badgeDone : WindowStatsView_module_css_default.badgeIdle;
		}
		const TIME_UNIT_KEYS = {
			now: "time.now",
			min: "time.min",
			hour: "time.hour",
			day: "time.day",
			week: "time.week",
			month: "time.month",
			year: "time.year"
		};
		function rowDurationMs(row) {
			if (row.llmMs === void 0 && row.toolMs === void 0) return null;
			return (row.llmMs ?? 0) + (row.toolMs ?? 0);
		}
		const MODEL_KEYS = ["deepseek-v4-flash", "deepseek-v4-pro"];
		/**
		* Render the Window Stats dashboard.
		* @param props - the composed slot props.
		*/
		function WindowStatsView({ useSessions, open, t }) {
			const state = useSessions((s) => s);
			const now = (0, react.useMemo)(() => Date.now(), [state]);
			const allRows = (0, react.useMemo)(() => deriveWindowRows(state, { includeBlank: false }), [state]);
			const hiddenSubagents = (0, react.useMemo)(() => hiddenSubagentCount(state), [state]);
			const [sortKey, setSortKey] = (0, react.useState)("activity");
			const [statusFilter, setStatusFilter] = (0, react.useState)("all");
			const [grouped, setGrouped] = (0, react.useState)(false);
			const [modelKey, setModelKey] = (0, react.useState)("deepseek-v4-pro");
			const [currencyCode, setCurrencyCode] = (0, react.useState)("USD");
			const pricing = DEFAULT_PRICING[modelKey] ?? DEFAULT_PRICING["deepseek-v4-pro"];
			const currency = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];
			const filtered = (0, react.useMemo)(() => filterRows(allRows, statusFilter), [allRows, statusFilter]);
			const sorted = (0, react.useMemo)(() => sortRows(filtered, sortKey), [filtered, sortKey]);
			const groups = (0, react.useMemo)(() => grouped ? groupByWorkspace(sorted) : null, [grouped, sorted]);
			const totals = (0, react.useMemo)(() => aggregate(filtered), [filtered]);
			const totalCost = (0, react.useMemo)(() => filtered.reduce((sum, row) => sum + (costUsd(row, pricing) ?? 0), 0), [filtered, pricing]);
			const [selectedId, setSelectedId] = (0, react.useState)(null);
			const selected = (0, react.useMemo)(() => selectedId === null ? null : allRows.find((r) => r.id === selectedId) ?? null, [allRows, selectedId]);
			if (allRows.length === 0) return (0, react_jsx_runtime.jsxs)("div", {
				className: WindowStatsView_module_css_default.empty,
				children: [(0, react_jsx_runtime.jsx)("div", {
					className: WindowStatsView_module_css_default.emptyTitle,
					children: t("empty.title")
				}), (0, react_jsx_runtime.jsx)("div", {
					className: WindowStatsView_module_css_default.emptyHint,
					children: t("empty.hint")
				})]
			});
			return (0, react_jsx_runtime.jsxs)("div", {
				className: WindowStatsView_module_css_default.root,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: WindowStatsView_module_css_default.toolbar,
						children: [
							(0, react_jsx_runtime.jsx)("div", {
								className: WindowStatsView_module_css_default.toolGroup,
								children: [
									"activity",
									"inputTokens",
									"duration"
								].map((key) => (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: sortKey === key ? `${WindowStatsView_module_css_default.chip} ${WindowStatsView_module_css_default.chipActive}` : WindowStatsView_module_css_default.chip,
									onClick: () => {
										setSortKey(key);
									},
									children: t(key === "activity" ? "sort.activity" : key === "inputTokens" ? "sort.inputTokens" : "sort.duration")
								}, key))
							}),
							(0, react_jsx_runtime.jsx)("div", {
								className: WindowStatsView_module_css_default.toolGroup,
								children: [
									"all",
									"running",
									"waiting",
									"idle"
								].map((key) => (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: statusFilter === key ? `${WindowStatsView_module_css_default.chip} ${WindowStatsView_module_css_default.chipActive}` : WindowStatsView_module_css_default.chip,
									onClick: () => {
										setStatusFilter(key);
									},
									children: t(key === "all" ? "filter.all" : key === "running" ? "filter.running" : key === "waiting" ? "filter.waiting" : "filter.idle")
								}, key))
							}),
							(0, react_jsx_runtime.jsx)("div", {
								className: WindowStatsView_module_css_default.toolGroup,
								children: (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: grouped ? `${WindowStatsView_module_css_default.chip} ${WindowStatsView_module_css_default.chipActive}` : WindowStatsView_module_css_default.chip,
									onClick: () => {
										setGrouped((v) => !v);
									},
									children: t("group.byWorkspace")
								})
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: WindowStatsView_module_css_default.toolGroup,
								children: [MODEL_KEYS.map((key) => (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: modelKey === key ? `${WindowStatsView_module_css_default.chip} ${WindowStatsView_module_css_default.chipActive}` : WindowStatsView_module_css_default.chip,
									onClick: () => {
										setModelKey(key);
									},
									title: `${key} ${t("header.cost")}`,
									children: key === "deepseek-v4-flash" ? "V4-Flash" : "V4-Pro"
								}, key)), (0, react_jsx_runtime.jsx)("select", {
									className: WindowStatsView_module_css_default.select,
									value: currencyCode,
									onChange: (e) => {
										setCurrencyCode(e.target.value);
									},
									"aria-label": t("header.cost"),
									children: CURRENCIES.map((c) => (0, react_jsx_runtime.jsxs)("option", {
										value: c.code,
										children: [
											c.code,
											" ",
											c.symbol
										]
									}, c.code))
								})]
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: WindowStatsView_module_css_default.header,
						children: [
							(0, react_jsx_runtime.jsxs)("span", {
								className: WindowStatsView_module_css_default.headerItem,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerLabel,
									children: t("header.sessions")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerValue,
									children: String(totals.total)
								})]
							}),
							(0, react_jsx_runtime.jsxs)("span", {
								className: WindowStatsView_module_css_default.headerItem,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerLabel,
									children: t("header.running")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerValue,
									children: String(totals.running)
								})]
							}),
							(0, react_jsx_runtime.jsxs)("span", {
								className: WindowStatsView_module_css_default.headerItem,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerLabel,
									children: t("col.tokensIn")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerValue,
									children: formatTokens(totals.inputTokens)
								})]
							}),
							(0, react_jsx_runtime.jsxs)("span", {
								className: WindowStatsView_module_css_default.headerItem,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerLabel,
									children: t("col.tokensOut")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerValue,
									children: formatTokens(totals.outputTokens)
								})]
							}),
							(0, react_jsx_runtime.jsxs)("span", {
								className: WindowStatsView_module_css_default.headerItem,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerLabel,
									children: t("header.duration")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerValue,
									children: formatDuration(totals.llmMs + totals.toolMs)
								})]
							}),
							(0, react_jsx_runtime.jsxs)("span", {
								className: WindowStatsView_module_css_default.headerItem,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerLabel,
									children: t("header.cost")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.headerValue,
									children: formatCost(totalCost, currency)
								})]
							})
						]
					}),
					hiddenSubagents > 0 && (0, react_jsx_runtime.jsx)("div", {
						className: WindowStatsView_module_css_default.hint,
						children: t("hint.hiddenSubagents", { n: hiddenSubagents })
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: WindowStatsView_module_css_default.split,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: WindowStatsView_module_css_default.listPane,
							children: (0, react_jsx_runtime.jsxs)("table", {
								className: WindowStatsView_module_css_default.table,
								children: [(0, react_jsx_runtime.jsx)("thead", { children: (0, react_jsx_runtime.jsxs)("tr", { children: [
									(0, react_jsx_runtime.jsx)("th", {
										className: WindowStatsView_module_css_default.thStatus,
										scope: "col",
										children: t("col.status")
									}),
									(0, react_jsx_runtime.jsx)("th", {
										scope: "col",
										children: t("col.session")
									}),
									(0, react_jsx_runtime.jsx)("th", {
										scope: "col",
										children: t("col.progress")
									}),
									(0, react_jsx_runtime.jsx)("th", {
										scope: "col",
										className: WindowStatsView_module_css_default.thNum,
										children: t("col.tokensIn")
									}),
									(0, react_jsx_runtime.jsx)("th", {
										scope: "col",
										className: WindowStatsView_module_css_default.thNum,
										children: t("col.tokensOut")
									}),
									(0, react_jsx_runtime.jsx)("th", {
										scope: "col",
										className: WindowStatsView_module_css_default.thNum,
										children: t("col.cache")
									}),
									(0, react_jsx_runtime.jsx)("th", {
										scope: "col",
										className: WindowStatsView_module_css_default.thNum,
										children: t("col.context")
									}),
									(0, react_jsx_runtime.jsx)("th", {
										scope: "col",
										className: WindowStatsView_module_css_default.thNum,
										children: t("col.duration")
									}),
									(0, react_jsx_runtime.jsx)("th", {
										scope: "col",
										className: WindowStatsView_module_css_default.thNum,
										children: t("col.cost")
									}),
									(0, react_jsx_runtime.jsx)("th", {
										scope: "col",
										className: WindowStatsView_module_css_default.thActivity,
										children: t("col.activity")
									})
								] }) }), (0, react_jsx_runtime.jsx)("tbody", { children: groups !== null ? groups.map((group) => (0, react_jsx_runtime.jsx)(GroupSection, {
									group,
									now,
									t,
									pricing,
									currency,
									selectedId,
									onSelect: setSelectedId
								}, group.title)) : sorted.map((row) => (0, react_jsx_runtime.jsx)(WindowStatsRow, {
									row,
									now,
									t,
									pricing,
									currency,
									selected: row.id === selectedId,
									onSelect: () => {
										setSelectedId(row.id);
									}
								}, row.id)) })]
							})
						}), (0, react_jsx_runtime.jsx)("aside", {
							className: WindowStatsView_module_css_default.detailPane,
							children: selected === null ? (0, react_jsx_runtime.jsx)("div", {
								className: WindowStatsView_module_css_default.detailEmpty,
								children: t("detail.empty")
							}) : (0, react_jsx_runtime.jsx)(SessionDetail, {
								row: selected,
								t,
								pricing,
								currency,
								onOpen: () => {
									open(selected.id);
								}
							})
						})]
					})
				]
			});
		}
		function GroupSection({ group, now, t, pricing, currency, selectedId, onSelect }) {
			return (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("tr", {
				className: WindowStatsView_module_css_default.groupRow,
				children: (0, react_jsx_runtime.jsx)("td", {
					colSpan: 10,
					className: WindowStatsView_module_css_default.groupTitle,
					children: group.title === "ungrouped" ? t("status.idle") : group.title
				})
			}), group.rows.map((row) => (0, react_jsx_runtime.jsx)(WindowStatsRow, {
				row,
				now,
				t,
				pricing,
				currency,
				selected: row.id === selectedId,
				onSelect: () => {
					onSelect(row.id);
				}
			}, row.id))] });
		}
		function WindowStatsRow({ row, now, t, pricing, currency, selected, onSelect }) {
			const hit = cacheHitRatio(row);
			const occupied = row.projectedTokens !== void 0 && row.contextWindow !== void 0 && row.contextWindow > 0 ? Math.round(row.projectedTokens / row.contextWindow * 100) : null;
			const time = relativeTime(row.updatedAt, now);
			const activity = time.unit === "now" ? t("time.now") : t(TIME_UNIT_KEYS[time.unit], { n: time.n });
			const statusLabel = t(statusKeyOf(row));
			const duration = rowDurationMs(row);
			const cost = costUsd(row, pricing);
			return (0, react_jsx_runtime.jsxs)("tr", {
				className: selected ? `${WindowStatsView_module_css_default.row} ${WindowStatsView_module_css_default.rowSelected}` : WindowStatsView_module_css_default.row,
				onClick: onSelect,
				onKeyDown: (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						onSelect();
					}
				},
				tabIndex: 0,
				role: "row",
				"aria-selected": selected,
				"aria-label": t("a11y.openSession", { title: row.title }),
				children: [
					(0, react_jsx_runtime.jsx)("td", {
						className: WindowStatsView_module_css_default.cellStatus,
						children: (0, react_jsx_runtime.jsxs)("span", {
							className: WindowStatsView_module_css_default.statusCell,
							children: [
								(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: stateOf(row) }),
								(0, react_jsx_runtime.jsx)("span", {
									className: `${WindowStatsView_module_css_default.statusBadge} ${statusBadgeClass(row)}`,
									children: statusLabel
								}),
								(0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.visuallyHidden,
									children: t("a11y.status", { label: statusLabel })
								})
							]
						})
					}),
					(0, react_jsx_runtime.jsxs)("td", {
						className: WindowStatsView_module_css_default.cellTitle,
						children: [(0, react_jsx_runtime.jsx)("span", {
							className: WindowStatsView_module_css_default.title,
							children: row.title
						}), row.cwd !== void 0 && (0, react_jsx_runtime.jsx)("span", {
							className: WindowStatsView_module_css_default.cwd,
							children: row.cwd
						})]
					}),
					(0, react_jsx_runtime.jsx)("td", {
						className: WindowStatsView_module_css_default.cellProgress,
						children: row.turns !== void 0 && row.steps !== void 0 ? `${row.turns} / ${row.steps}` : "–"
					}),
					(0, react_jsx_runtime.jsx)("td", {
						className: WindowStatsView_module_css_default.cellNum,
						children: row.inputTokens !== void 0 ? formatTokens(row.inputTokens) : "–"
					}),
					(0, react_jsx_runtime.jsx)("td", {
						className: WindowStatsView_module_css_default.cellNum,
						children: row.outputTokens !== void 0 ? formatTokens(row.outputTokens) : "–"
					}),
					(0, react_jsx_runtime.jsx)("td", {
						className: WindowStatsView_module_css_default.cellNum,
						children: hit !== null ? t("value.cacheRatio", { pct: Math.round(hit * 100) }) : "–"
					}),
					(0, react_jsx_runtime.jsx)("td", {
						className: WindowStatsView_module_css_default.cellNum,
						children: occupied !== null ? t("value.context", { pct: occupied }) : "–"
					}),
					(0, react_jsx_runtime.jsx)("td", {
						className: WindowStatsView_module_css_default.cellNum,
						children: duration !== null ? formatDuration(duration) : "–"
					}),
					(0, react_jsx_runtime.jsx)("td", {
						className: WindowStatsView_module_css_default.cellNum,
						children: cost !== null ? formatCost(cost, currency) : "–"
					}),
					(0, react_jsx_runtime.jsx)("td", {
						className: WindowStatsView_module_css_default.cellActivity,
						children: activity
					})
				]
			});
		}
		function SessionDetail({ row, t, pricing, currency, onOpen }) {
			const hit = cacheHitRatio(row);
			const total = row.inputTokens !== void 0 ? row.inputTokens + (row.outputTokens ?? 0) : void 0;
			const occupied = row.projectedTokens !== void 0 && row.contextWindow !== void 0 && row.contextWindow > 0 ? Math.round(row.projectedTokens / row.contextWindow * 100) : null;
			const throughput = decodeThroughput(row);
			const ttft = ttftAverageMs(row);
			const duration = rowDurationMs(row);
			const cost = costUsd(row, pricing);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: WindowStatsView_module_css_default.detail,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: WindowStatsView_module_css_default.detailHead,
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: WindowStatsView_module_css_default.detailStatusRow,
								children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: stateOf(row) }), (0, react_jsx_runtime.jsx)("span", {
									className: WindowStatsView_module_css_default.detailStatusText,
									children: t(statusKeyOf(row))
								})]
							}),
							(0, react_jsx_runtime.jsx)("div", {
								className: WindowStatsView_module_css_default.detailTitle,
								children: row.title
							}),
							row.cwd !== void 0 && (0, react_jsx_runtime.jsx)("div", {
								className: WindowStatsView_module_css_default.detailCwd,
								children: row.cwd
							})
						]
					}),
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: WindowStatsView_module_css_default.detailOpen,
						onClick: onOpen,
						children: t("detail.open")
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: WindowStatsView_module_css_default.detailSection,
						children: [
							(0, react_jsx_runtime.jsx)("div", {
								className: WindowStatsView_module_css_default.detailSectionTitle,
								children: t("detail.tokens")
							}),
							(0, react_jsx_runtime.jsx)(TokenBar, {
								label: t("detail.uncachedInput"),
								value: row.uncachedInputTokens,
								max: total
							}),
							(0, react_jsx_runtime.jsx)(TokenBar, {
								label: t("detail.cacheRead"),
								value: row.cacheReadTokens,
								max: total
							}),
							(0, react_jsx_runtime.jsx)(TokenBar, {
								label: t("detail.cacheWrite"),
								value: row.cacheWriteTokens,
								max: total
							}),
							(0, react_jsx_runtime.jsx)(TokenBar, {
								label: t("detail.output"),
								value: row.outputTokens,
								max: total
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.total"),
								value: total !== void 0 ? formatTokens(total) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("col.cache"),
								value: hit !== null ? t("value.cacheRatio", { pct: Math.round(hit * 100) }) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("col.cost"),
								value: cost !== null ? formatCost(cost, currency) : "–"
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: WindowStatsView_module_css_default.detailSection,
						children: [
							(0, react_jsx_runtime.jsx)("div", {
								className: WindowStatsView_module_css_default.detailSectionTitle,
								children: t("detail.context")
							}),
							occupied !== null && (0, react_jsx_runtime.jsx)(OccupancyBar, { pct: occupied }),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.occupancy"),
								value: occupied !== null ? t("value.context", { pct: occupied }) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.system"),
								value: row.systemTokens !== void 0 ? formatTokens(row.systemTokens) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.tools"),
								value: row.toolsTokens !== void 0 ? formatTokens(row.toolsTokens) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.messages"),
								value: row.messageTokens !== void 0 ? formatTokens(row.messageTokens) : "–"
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: WindowStatsView_module_css_default.detailSection,
						children: [
							(0, react_jsx_runtime.jsx)("div", {
								className: WindowStatsView_module_css_default.detailSectionTitle,
								children: t("detail.timing")
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("col.duration"),
								value: duration !== null ? formatDuration(duration) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.llm"),
								value: row.llmMs !== void 0 ? formatDuration(row.llmMs) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.tool"),
								value: row.toolMs !== void 0 ? formatDuration(row.toolMs) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.ttft"),
								value: ttft !== null ? t("value.ms", { n: Math.round(ttft) }) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.throughput"),
								value: throughput !== null ? t("value.tokPerSec", { n: formatOneDecimal(throughput) }) : "–"
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: WindowStatsView_module_css_default.detailSection,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: WindowStatsView_module_css_default.detailSectionTitle,
							children: t("detail.heatmap")
						}), (0, react_jsx_runtime.jsx)(Heatmap, { history: row.tokenHistory })]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: WindowStatsView_module_css_default.detailSection,
						children: [
							(0, react_jsx_runtime.jsx)("div", {
								className: WindowStatsView_module_css_default.detailSectionTitle,
								children: t("detail.turns")
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.turns"),
								value: row.turns !== void 0 ? String(row.turns) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.steps"),
								value: row.steps !== void 0 ? String(row.steps) : "–"
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.jobs"),
								value: String(row.jobsCount)
							}),
							(0, react_jsx_runtime.jsx)(Kv, {
								label: t("detail.subagents"),
								value: String(row.subagentCount)
							})
						]
					})
				]
			});
		}
		function Heatmap({ history }) {
			if (history === void 0 || Object.keys(history).length === 0) return (0, react_jsx_runtime.jsx)("div", {
				className: WindowStatsView_module_css_default.heatmapEmpty,
				children: "–"
			});
			const peak = peakDailyTokens(history);
			const today = /* @__PURE__ */ new Date();
			today.setUTCHours(0, 0, 0, 0);
			const start = new Date(today);
			start.setUTCDate(start.getUTCDate() - 175);
			start.setUTCDate(start.getUTCDate() - start.getUTCDay());
			const weeks = [];
			const cursor = new Date(start);
			while (cursor.getTime() <= today.getTime()) {
				const key = cursor.toISOString().slice(0, 10);
				const day = history[key];
				const total = day !== void 0 ? day.input + day.output : 0;
				const weekIndex = weeks.length - 1;
				if (weeks.length === 0 || weeks[weekIndex].length === 7) weeks.push([]);
				weeks[weeks.length - 1].push({
					key,
					total
				});
				cursor.setUTCDate(cursor.getUTCDate() + 1);
			}
			return (0, react_jsx_runtime.jsx)("div", {
				className: WindowStatsView_module_css_default.heatmap,
				children: weeks.map((week, wi) => (0, react_jsx_runtime.jsx)("div", {
					className: WindowStatsView_module_css_default.heatmapWeek,
					children: week.map((cell) => {
						const opacity = cell.total === 0 ? .14 : .35 + .65 * (cell.total / peak);
						return (0, react_jsx_runtime.jsx)("span", {
							className: WindowStatsView_module_css_default.heatmapCell,
							style: { opacity },
							title: `${cell.key}: ${cell.total}`
						}, cell.key);
					})
				}, wi))
			});
		}
		function Kv({ label, value }) {
			return (0, react_jsx_runtime.jsxs)("div", {
				className: WindowStatsView_module_css_default.detailKV,
				children: [(0, react_jsx_runtime.jsx)("span", {
					className: WindowStatsView_module_css_default.detailKVLabel,
					children: label
				}), (0, react_jsx_runtime.jsx)("span", {
					className: WindowStatsView_module_css_default.detailKVValue,
					children: value
				})]
			});
		}
		function TokenBar({ label, value, max }) {
			const v = value ?? 0;
			const pct = max !== void 0 && max > 0 ? Math.min(100, v / max * 100) : 0;
			return (0, react_jsx_runtime.jsxs)("div", {
				className: WindowStatsView_module_css_default.barRow,
				children: [
					(0, react_jsx_runtime.jsx)("span", {
						className: WindowStatsView_module_css_default.barLabel,
						children: label
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: WindowStatsView_module_css_default.barTrack,
						children: (0, react_jsx_runtime.jsx)("div", {
							className: WindowStatsView_module_css_default.barFill,
							style: { width: `${pct}%` }
						})
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: WindowStatsView_module_css_default.barValue,
						children: formatTokens(v)
					})
				]
			});
		}
		function OccupancyBar({ pct }) {
			const clamped = Math.min(100, Math.max(0, pct));
			return (0, react_jsx_runtime.jsx)("div", {
				className: WindowStatsView_module_css_default.occTrack,
				children: (0, react_jsx_runtime.jsx)("div", {
					className: WindowStatsView_module_css_default.occFill,
					style: { width: `${clamped}%` }
				})
			});
		}
		//#endregion
		//#region lib/types/client/activity.js
		const PROMPT_MAX_CHARS = 160;
		/** Extract concatenated text from content blocks (ignoring non-text blocks). */
		function extractText(content) {
			let text = "";
			for (const block of content) if (block.type === "text" && typeof block.text === "string") text += block.text;
			return text;
		}
		/**
		* Fold the current session's in-window conversation into an activity report.
		* @param snapshot - the current session's conversation snapshot.
		* @param now - epoch ms anchor for the range cut.
		* @param rangeMs - how far back to include (null = the whole loaded window).
		* @returns tool-type distribution and turn summaries within the range.
		*/
		function deriveActivity(snapshot, now, rangeMs) {
			const since = rangeMs === null ? null : now - rangeMs;
			const buckets = /* @__PURE__ */ new Map();
			let totalToolCalls = 0;
			let totalToolMs = 0;
			const inRange = (time) => since === null || time >= since;
			for (const node of snapshot.nodes) {
				if (node.kind !== "tool-result") continue;
				if (!inRange(node.time)) continue;
				const name = node.call?.name ?? "unknown";
				const start = node.callTime ?? node.time;
				const durationMs = Math.max(0, node.time - start);
				const entry = buckets.get(name) ?? {
					count: 0,
					durationMs: 0
				};
				entry.count += 1;
				entry.durationMs += durationMs;
				buckets.set(name, entry);
				totalToolCalls += 1;
				totalToolMs += durationMs;
			}
			const turns = [];
			for (const [turn, timing] of snapshot.turnTimings) {
				if (!inRange(timing.startTime)) continue;
				const endTime = timing.endTime;
				const durationMs = endTime !== void 0 ? Math.max(0, endTime - timing.startTime) : 0;
				const tools = /* @__PURE__ */ new Set();
				let toolCount = 0;
				for (const node of snapshot.nodes) {
					if (node.kind !== "tool-result") continue;
					const t = node.time;
					if (t < timing.startTime) continue;
					if (endTime !== void 0 && t > endTime) continue;
					tools.add(node.call?.name ?? "unknown");
					toolCount += 1;
				}
				let prompt = "";
				for (const node of snapshot.nodes) if (node.kind === "user" && node.time <= timing.startTime) prompt = extractText(node.content).trim();
				turns.push({
					turn,
					startTime: timing.startTime,
					...endTime !== void 0 ? { endTime } : {},
					durationMs,
					prompt: prompt.slice(0, PROMPT_MAX_CHARS),
					tools: [...tools],
					toolCount
				});
			}
			const toolList = [...buckets.entries()].map(([name, v]) => ({
				name,
				count: v.count,
				durationMs: v.durationMs
			})).sort((a, b) => b.durationMs - a.durationMs);
			turns.sort((a, b) => b.startTime - a.startTime);
			return {
				tools: toolList,
				turns,
				totalToolCalls,
				totalToolMs,
				turnCount: turns.length
			};
		}
		//#endregion
		//#region \0dsh-css:I:\Github\pr\.opencode\workflow\dsh-window-stats\plugin\src\client\SessionAnalyticsView.module.css.mjs
		const css$1 = ".Ld-dQq_root{flex-direction:column;gap:14px;height:100%;padding:4px 2px;display:flex;overflow:auto}.Ld-dQq_ranges{flex-wrap:wrap;gap:6px;display:flex}.Ld-dQq_range{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:999px;padding:4px 12px;font-size:12px}.Ld-dQq_range:hover{background:var(--dsw-alias-interactive-bg-hover)}.Ld-dQq_rangeActive{color:#fff;border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-primary);font-weight:600}.Ld-dQq_customRange{align-items:center;gap:4px;display:inline-flex}.Ld-dQq_customInput{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);width:56px;color:var(--dsw-alias-label-primary);border-radius:6px;padding:3px 8px;font-size:12px}.Ld-dQq_customSelect{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-primary);border-radius:6px;padding:3px 6px;font-size:12px}.Ld-dQq_summary{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover);border-radius:10px;flex-wrap:wrap;gap:14px 24px;padding:10px 14px;display:flex}.Ld-dQq_stat{align-items:baseline;gap:7px;display:flex}.Ld-dQq_statLabel{color:var(--dsw-alias-label-tertiary);font-size:12px}.Ld-dQq_statValue{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;font-size:15px;font-weight:600}.Ld-dQq_section{flex-direction:column;gap:8px;display:flex}.Ld-dQq_sectionTitle{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600}.Ld-dQq_emptyHint{color:var(--dsw-alias-label-tertiary);font-size:13px}.Ld-dQq_toolRow{grid-template-columns:110px 1fr 70px 70px;align-items:center;gap:10px;font-size:12px;display:grid}.Ld-dQq_toolName{color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code,monospace);white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.Ld-dQq_toolTrack{background:var(--dsw-alias-interactive-bg-hover);border-radius:3px;height:7px;overflow:hidden}.Ld-dQq_toolFill{background:var(--dsw-alias-state-business-primary);border-radius:3px;height:100%}.Ld-dQq_toolCount{color:var(--dsw-alias-label-secondary);text-align:right;font-variant-numeric:tabular-nums}.Ld-dQq_toolDur{color:var(--dsw-alias-label-primary);text-align:right;font-variant-numeric:tabular-nums}.Ld-dQq_turnRow{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;flex-direction:column;gap:4px;padding:8px 10px;display:flex}.Ld-dQq_turnHead{justify-content:space-between;align-items:baseline;display:flex}.Ld-dQq_turnTime{color:var(--dsw-alias-label-secondary);font-size:11px}.Ld-dQq_turnDur{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;font-size:11px}.Ld-dQq_turnPrompt{color:var(--dsw-alias-label-primary);-webkit-line-clamp:2;overflow-wrap:anywhere;-webkit-box-orient:vertical;font-size:13px;display:-webkit-box;overflow:hidden}.Ld-dQq_turnTools{flex-wrap:wrap;gap:4px;display:flex}.Ld-dQq_toolTag{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-secondary);font-size:11px;font-family:var(--ds-font-family-code,monospace);border-radius:999px;padding:1px 7px}.Ld-dQq_chartBox{max-width:440px}.Ld-dQq_chart{width:100%;height:auto;display:block}.Ld-dQq_chartGrid{stroke:var(--dsw-alias-border-l2);stroke-width:1px}.Ld-dQq_chartAxis{fill:var(--dsw-alias-label-tertiary);font-size:10px}.Ld-dQq_chartBar{fill:var(--dsw-alias-state-business-primary);opacity:.35}.Ld-dQq_chartLine{fill:none;stroke:var(--dsw-alias-state-business-primary);stroke-width:2px;stroke-linejoin:round;stroke-linecap:round}.Ld-dQq_chartDot{fill:var(--dsw-alias-state-business-primary)}.Ld-dQq_chartEmpty{color:var(--dsw-alias-label-tertiary);font-size:12px}.Ld-dQq_chartLegend{gap:14px;margin-top:6px;display:flex}.Ld-dQq_legendItem{color:var(--dsw-alias-label-secondary);align-items:center;gap:5px;font-size:11px;display:inline-flex}.Ld-dQq_legendBar{background:var(--dsw-alias-state-business-primary);opacity:.35;border-radius:2px;width:9px;height:9px}.Ld-dQq_legendLine{background:var(--dsw-alias-state-business-primary);border-radius:1px;width:12px;height:2px}.Ld-dQq_toolLayout{align-items:flex-start;gap:14px;display:flex}.Ld-dQq_donutWrap{flex:0 0 96px}.Ld-dQq_donut{width:96px;height:96px}.Ld-dQq_toolRows{flex-direction:column;flex:1;gap:6px;min-width:0;display:flex}";
		const tagId$1 = "@wellorbetter/dsh-plugin-window-stats/SessionAnalyticsView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@wellorbetter/dsh-plugin-window-stats";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var SessionAnalyticsView_module_css_default = {
			"chartAxis": "Ld-dQq_chartAxis",
			"chartLegend": "Ld-dQq_chartLegend",
			"chart": "Ld-dQq_chart",
			"statValue": "Ld-dQq_statValue",
			"legendLine": "Ld-dQq_legendLine",
			"donutWrap": "Ld-dQq_donutWrap",
			"turnDur": "Ld-dQq_turnDur",
			"toolFill": "Ld-dQq_toolFill",
			"chartGrid": "Ld-dQq_chartGrid",
			"root": "Ld-dQq_root",
			"donut": "Ld-dQq_donut",
			"chartBox": "Ld-dQq_chartBox",
			"stat": "Ld-dQq_stat",
			"toolName": "Ld-dQq_toolName",
			"turnHead": "Ld-dQq_turnHead",
			"chartLine": "Ld-dQq_chartLine",
			"legendItem": "Ld-dQq_legendItem",
			"toolLayout": "Ld-dQq_toolLayout",
			"customRange": "Ld-dQq_customRange",
			"summary": "Ld-dQq_summary",
			"turnTime": "Ld-dQq_turnTime",
			"customInput": "Ld-dQq_customInput",
			"turnTools": "Ld-dQq_turnTools",
			"emptyHint": "Ld-dQq_emptyHint",
			"sectionTitle": "Ld-dQq_sectionTitle",
			"statLabel": "Ld-dQq_statLabel",
			"legendBar": "Ld-dQq_legendBar",
			"chartDot": "Ld-dQq_chartDot",
			"toolRows": "Ld-dQq_toolRows",
			"section": "Ld-dQq_section",
			"toolTag": "Ld-dQq_toolTag",
			"toolTrack": "Ld-dQq_toolTrack",
			"toolRow": "Ld-dQq_toolRow",
			"range": "Ld-dQq_range",
			"toolCount": "Ld-dQq_toolCount",
			"turnPrompt": "Ld-dQq_turnPrompt",
			"ranges": "Ld-dQq_ranges",
			"rangeActive": "Ld-dQq_rangeActive",
			"customSelect": "Ld-dQq_customSelect",
			"turnRow": "Ld-dQq_turnRow",
			"toolDur": "Ld-dQq_toolDur",
			"chartEmpty": "Ld-dQq_chartEmpty",
			"chartBar": "Ld-dQq_chartBar"
		};
		//#endregion
		//#region lib/types/client/SessionAnalyticsView.js
		/**
		* 「会话分析」 view tab: a time-range-scoped activity report of the CURRENT
		* session — tool-type duration distribution (bars + donut), a token trend
		* chart, and per-turn task summaries. Reads the conversation snapshot and the
		* `tokenHistory` projection through the session standard kit.
		*
		* @module @wellorbetter/dsh-plugin-window-stats/client/SessionAnalyticsView
		*/
		const PRESETS = [
			{
				key: "range.10m",
				ms: 6e5
			},
			{
				key: "range.1h",
				ms: 36e5
			},
			{
				key: "range.1d",
				ms: 864e5
			},
			{
				key: "range.all",
				ms: null
			}
		];
		const UNIT_MS = {
			minutes: 6e4,
			hours: 36e5,
			days: 864e5
		};
		const PALETTE = [
			"#4176e6",
			"#f59e0b",
			"#22c55e",
			"#ef4444",
			"#8b5cf6",
			"#06b6d4",
			"#ec4899",
			"#84cc16"
		];
		const TIME_KEYS = {
			now: "time.now",
			min: "time.min",
			hour: "time.hour",
			day: "time.day",
			week: "time.week",
			month: "time.month",
			year: "time.year"
		};
		/**
		* Render the session activity analytics.
		* @param props - the composed slot props.
		*/
		function SessionAnalyticsView({ useSession, useProjection, t }) {
			const snapshot = useSession((s) => s);
			const history = useProjection("tokenHistory");
			const now = (0, react.useMemo)(() => Date.now(), [snapshot]);
			const [presetMs, setPresetMs] = (0, react.useState)(null);
			const [custom, setCustom] = (0, react.useState)(false);
			const [customN, setCustomN] = (0, react.useState)(1);
			const [customUnit, setCustomUnit] = (0, react.useState)("hours");
			const rangeMs = custom ? customN * UNIT_MS[customUnit] : presetMs;
			const report = (0, react.useMemo)(() => deriveActivity(snapshot, now, rangeMs), [
				snapshot,
				now,
				rangeMs
			]);
			const maxToolMs = report.tools[0]?.durationMs ?? 0;
			return (0, react_jsx_runtime.jsxs)("div", {
				className: SessionAnalyticsView_module_css_default.root,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: SessionAnalyticsView_module_css_default.ranges,
						children: [
							PRESETS.map((r) => (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: !custom && presetMs === r.ms ? `${SessionAnalyticsView_module_css_default.range} ${SessionAnalyticsView_module_css_default.rangeActive}` : SessionAnalyticsView_module_css_default.range,
								onClick: () => {
									setPresetMs(r.ms);
									setCustom(false);
								},
								children: t(r.key)
							}, r.key)),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: custom ? `${SessionAnalyticsView_module_css_default.range} ${SessionAnalyticsView_module_css_default.rangeActive}` : SessionAnalyticsView_module_css_default.range,
								onClick: () => {
									setCustom(true);
								},
								children: t("range.custom")
							}),
							custom && (0, react_jsx_runtime.jsxs)("span", {
								className: SessionAnalyticsView_module_css_default.customRange,
								children: [(0, react_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									className: SessionAnalyticsView_module_css_default.customInput,
									value: customN,
									onChange: (e) => {
										setCustomN(Math.max(1, Number(e.target.value) || 1));
									}
								}), (0, react_jsx_runtime.jsxs)("select", {
									className: SessionAnalyticsView_module_css_default.customSelect,
									value: customUnit,
									onChange: (e) => {
										setCustomUnit(e.target.value);
									},
									children: [
										(0, react_jsx_runtime.jsx)("option", {
											value: "minutes",
											children: t("unit.minutes")
										}),
										(0, react_jsx_runtime.jsx)("option", {
											value: "hours",
											children: t("unit.hours")
										}),
										(0, react_jsx_runtime.jsx)("option", {
											value: "days",
											children: t("unit.days")
										})
									]
								})]
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: SessionAnalyticsView_module_css_default.summary,
						children: [
							(0, react_jsx_runtime.jsx)(Stat, {
								label: t("an.summary.toolCalls"),
								value: String(report.totalToolCalls)
							}),
							(0, react_jsx_runtime.jsx)(Stat, {
								label: t("an.summary.toolDuration"),
								value: formatDuration(report.totalToolMs)
							}),
							(0, react_jsx_runtime.jsx)(Stat, {
								label: t("an.summary.turns"),
								value: String(report.turnCount)
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: SessionAnalyticsView_module_css_default.section,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: SessionAnalyticsView_module_css_default.sectionTitle,
							children: t("chart.tokens")
						}), (0, react_jsx_runtime.jsx)(TokenTrendChart, {
							history,
							now,
							rangeMs,
							t
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: SessionAnalyticsView_module_css_default.section,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: SessionAnalyticsView_module_css_default.sectionTitle,
							children: t("an.tools.title")
						}), report.tools.length === 0 ? (0, react_jsx_runtime.jsx)("div", {
							className: SessionAnalyticsView_module_css_default.emptyHint,
							children: t("an.turns.empty")
						}) : (0, react_jsx_runtime.jsxs)("div", {
							className: SessionAnalyticsView_module_css_default.toolLayout,
							children: [(0, react_jsx_runtime.jsx)(ToolDonut, { tools: report.tools }), (0, react_jsx_runtime.jsx)("div", {
								className: SessionAnalyticsView_module_css_default.toolRows,
								children: report.tools.map((tool) => (0, react_jsx_runtime.jsx)(ToolRow, {
									name: tool.name,
									count: tool.count,
									durationMs: tool.durationMs,
									max: maxToolMs,
									t
								}, tool.name))
							})]
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: SessionAnalyticsView_module_css_default.section,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: SessionAnalyticsView_module_css_default.sectionTitle,
							children: t("an.turns.title")
						}), report.turns.length === 0 ? (0, react_jsx_runtime.jsx)("div", {
							className: SessionAnalyticsView_module_css_default.emptyHint,
							children: t("an.turns.empty")
						}) : report.turns.map((turn) => (0, react_jsx_runtime.jsx)(TurnRow, {
							turn,
							now,
							t
						}, turn.turn))]
					})
				]
			});
		}
		function Stat({ label, value }) {
			return (0, react_jsx_runtime.jsxs)("span", {
				className: SessionAnalyticsView_module_css_default.stat,
				children: [(0, react_jsx_runtime.jsx)("span", {
					className: SessionAnalyticsView_module_css_default.statLabel,
					children: label
				}), (0, react_jsx_runtime.jsx)("span", {
					className: SessionAnalyticsView_module_css_default.statValue,
					children: value
				})]
			});
		}
		function TokenTrendChart({ history, now, rangeMs, t }) {
			if (history === void 0) return (0, react_jsx_runtime.jsx)("div", {
				className: SessionAnalyticsView_module_css_default.chartEmpty,
				children: "–"
			});
			const since = rangeMs === null ? null : now - rangeMs;
			const days = Object.keys(history).filter((key) => {
				if (since === null) return true;
				return (/* @__PURE__ */ new Date(`${key}T00:00:00Z`)).getTime() >= since;
			}).sort();
			if (days.length === 0) return (0, react_jsx_runtime.jsx)("div", {
				className: SessionAnalyticsView_module_css_default.chartEmpty,
				children: "–"
			});
			const series = days.map((key) => ({
				key,
				...history[key]
			}));
			let max = 0;
			for (const s of series) max = Math.max(max, s.input, s.output);
			const scaleMax = max > 0 ? max : 1;
			const W = 520;
			const H = 190;
			const PAD = {
				top: 14,
				right: 14,
				bottom: 26,
				left: 48
			};
			const plotW = W - PAD.left - PAD.right;
			const plotH = H - PAD.top - PAD.bottom;
			const xOf = (i) => PAD.left + plotW * (i + .5) / series.length;
			const yOf = (v) => PAD.top + plotH - v / scaleMax * plotH;
			const barW = series.length === 1 ? 40 : Math.min(40, plotW / series.length * .5);
			const ticks = [
				0,
				.5,
				1
			].map((f) => ({
				f,
				v: scaleMax * f,
				y: yOf(scaleMax * f)
			}));
			const linePath = series.map((s, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(s.output).toFixed(1)}`).join(" ");
			const dayLabel = (key) => key.slice(5);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: SessionAnalyticsView_module_css_default.chartBox,
				children: [(0, react_jsx_runtime.jsxs)("svg", {
					className: SessionAnalyticsView_module_css_default.chart,
					viewBox: `0 0 ${W} ${H}`,
					role: "img",
					"aria-label": t("chart.tokens"),
					children: [
						ticks.map((tk) => (0, react_jsx_runtime.jsxs)("g", { children: [(0, react_jsx_runtime.jsx)("line", {
							className: SessionAnalyticsView_module_css_default.chartGrid,
							x1: PAD.left,
							x2: W - PAD.right,
							y1: tk.y,
							y2: tk.y
						}), (0, react_jsx_runtime.jsx)("text", {
							className: SessionAnalyticsView_module_css_default.chartAxis,
							x: PAD.left - 6,
							y: tk.y + 3,
							textAnchor: "end",
							children: formatTokens(tk.v)
						})] }, tk.f)),
						series.map((s, i) => (0, react_jsx_runtime.jsx)("rect", {
							className: SessionAnalyticsView_module_css_default.chartBar,
							x: xOf(i) - barW / 2,
							y: yOf(s.input),
							width: barW,
							height: Math.max(1, PAD.top + plotH - yOf(s.input)),
							rx: 3
						}, s.key)),
						(0, react_jsx_runtime.jsx)("path", {
							className: SessionAnalyticsView_module_css_default.chartLine,
							d: linePath
						}),
						series.map((s, i) => (0, react_jsx_runtime.jsxs)("g", { children: [(0, react_jsx_runtime.jsx)("circle", {
							className: SessionAnalyticsView_module_css_default.chartDot,
							cx: xOf(i),
							cy: yOf(s.output),
							r: 3
						}), (0, react_jsx_runtime.jsx)("text", {
							className: SessionAnalyticsView_module_css_default.chartAxis,
							x: xOf(i),
							y: 182,
							textAnchor: "middle",
							children: dayLabel(s.key)
						})] }, s.key))
					]
				}), (0, react_jsx_runtime.jsxs)("div", {
					className: SessionAnalyticsView_module_css_default.chartLegend,
					children: [(0, react_jsx_runtime.jsxs)("span", {
						className: SessionAnalyticsView_module_css_default.legendItem,
						children: [(0, react_jsx_runtime.jsx)("span", { className: SessionAnalyticsView_module_css_default.legendBar }), t("chart.input")]
					}), (0, react_jsx_runtime.jsxs)("span", {
						className: SessionAnalyticsView_module_css_default.legendItem,
						children: [(0, react_jsx_runtime.jsx)("span", { className: SessionAnalyticsView_module_css_default.legendLine }), t("chart.output")]
					})]
				})]
			});
		}
		function ToolDonut({ tools }) {
			const total = tools.reduce((sum, x) => sum + x.durationMs, 0);
			if (total <= 0) return null;
			const R = 42;
			const C = 2 * Math.PI * R;
			let acc = 0;
			const segments = tools.slice(0, 8).map((tool, i) => {
				const frac = tool.durationMs / total;
				const seg = {
					tool,
					color: PALETTE[i % PALETTE.length],
					dash: frac * C,
					offset: acc
				};
				acc += frac * C;
				return seg;
			});
			return (0, react_jsx_runtime.jsx)("div", {
				className: SessionAnalyticsView_module_css_default.donutWrap,
				children: (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 100 100",
					className: SessionAnalyticsView_module_css_default.donut,
					role: "img",
					children: [(0, react_jsx_runtime.jsx)("circle", {
						cx: "50",
						cy: "50",
						r: R,
						fill: "none",
						stroke: "var(--dsw-alias-interactive-bg-hover)",
						strokeWidth: "12"
					}), segments.map((s) => (0, react_jsx_runtime.jsx)("circle", {
						cx: "50",
						cy: "50",
						r: R,
						fill: "none",
						stroke: s.color,
						strokeWidth: "12",
						strokeDasharray: `${s.dash} ${C - s.dash}`,
						strokeDashoffset: -s.offset,
						transform: "rotate(-90 50 50)"
					}, s.tool.name))]
				})
			});
		}
		function ToolRow({ name, count, durationMs, max, t }) {
			const pct = max > 0 ? Math.min(100, durationMs / max * 100) : 0;
			return (0, react_jsx_runtime.jsxs)("div", {
				className: SessionAnalyticsView_module_css_default.toolRow,
				children: [
					(0, react_jsx_runtime.jsx)("span", {
						className: SessionAnalyticsView_module_css_default.toolName,
						children: name
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: SessionAnalyticsView_module_css_default.toolTrack,
						children: (0, react_jsx_runtime.jsx)("div", {
							className: SessionAnalyticsView_module_css_default.toolFill,
							style: { width: `${pct}%` }
						})
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: SessionAnalyticsView_module_css_default.toolCount,
						children: t("an.tools.count", { n: count })
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: SessionAnalyticsView_module_css_default.toolDur,
						children: formatDuration(durationMs)
					})
				]
			});
		}
		function TurnRow({ turn, now, t }) {
			const time = relativeTime(turn.startTime, now);
			const when = time.unit === "now" ? t("time.now") : t(TIME_KEYS[time.unit], { n: time.n });
			return (0, react_jsx_runtime.jsxs)("div", {
				className: SessionAnalyticsView_module_css_default.turnRow,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: SessionAnalyticsView_module_css_default.turnHead,
						children: [(0, react_jsx_runtime.jsx)("span", {
							className: SessionAnalyticsView_module_css_default.turnTime,
							children: when
						}), (0, react_jsx_runtime.jsx)("span", {
							className: SessionAnalyticsView_module_css_default.turnDur,
							children: formatDuration(turn.durationMs)
						})]
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: SessionAnalyticsView_module_css_default.turnPrompt,
						children: turn.prompt.length > 0 ? turn.prompt : t("an.noPrompt")
					}),
					turn.tools.length > 0 && (0, react_jsx_runtime.jsx)("div", {
						className: SessionAnalyticsView_module_css_default.turnTools,
						children: turn.tools.map((name) => (0, react_jsx_runtime.jsx)("span", {
							className: SessionAnalyticsView_module_css_default.toolTag,
							children: name
						}, name))
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:I:\Github\pr\.opencode\workflow\dsh-window-stats\plugin\src\client\Overview.module.css.mjs
		const css = "._4IoqtG_sidebarRow{color:var(--dsw-alias-label-secondary);align-items:center;gap:6px;padding:2px 4px;font-size:11px;display:flex}._4IoqtG_sidebarText{white-space:nowrap}._4IoqtG_sidebarSub{white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;margin-left:auto;font-size:11px}._4IoqtG_dot{background:#22c55e;border-radius:50%;flex:none;width:8px;height:8px}._4IoqtG_sidebarDot{color:var(--dsw-alias-label-primary);padding:0 4px;font-size:11px;font-weight:600}._4IoqtG_panel{background:var(--dsw-alias-button-elevated-fill);border-left:1px solid var(--dsw-alias-border-l2);pointer-events:auto;flex-direction:column;gap:10px;width:320px;padding:14px 16px;display:flex;position:absolute;top:0;bottom:0;right:0;overflow-y:auto}._4IoqtG_panelHead{justify-content:space-between;align-items:center;display:flex}._4IoqtG_panelTitle{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:600}._4IoqtG_panelClose,._4IoqtG_panelToggle{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:6px;padding:3px 8px;font-size:11px}._4IoqtG_panelToggle{pointer-events:auto;position:absolute;top:50%;right:8px;transform:translateY(-50%)}._4IoqtG_panelStats{grid-template-columns:1fr 1fr;gap:8px;display:grid}._4IoqtG_panelStat{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover);border-radius:8px;flex-direction:column;gap:2px;padding:8px 10px;display:flex}._4IoqtG_panelStatLabel{color:var(--dsw-alias-label-tertiary);font-size:11px}._4IoqtG_panelStatValue{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;font-weight:600}._4IoqtG_panelSection{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);box-shadow:var(--dsw-shadow-lv1);border-radius:10px;flex-direction:column;gap:4px;padding:10px 12px;display:flex}._4IoqtG_panelSectionTitle{color:var(--dsw-alias-label-secondary);align-items:center;gap:6px;font-size:12px;font-weight:600;display:flex}._4IoqtG_accentDot{background:var(--dsw-alias-label-tertiary);border-radius:50%;flex:none;width:8px;height:8px}._4IoqtG_panelSection[data-accent=running] ._4IoqtG_accentDot{background:var(--dsw-alias-state-success-primary)}._4IoqtG_panelSection[data-accent=top] ._4IoqtG_accentDot{background:var(--dsw-alias-state-business-primary)}._4IoqtG_panelSection[data-accent=recent] ._4IoqtG_accentDot{background:var(--dsw-alias-label-tertiary)}._4IoqtG_sectionCount{background:var(--dsw-alias-state-success-tertiary);min-width:18px;height:18px;color:var(--dsw-alias-state-success-primary);font-variant-numeric:tabular-nums;border-radius:999px;justify-content:center;align-items:center;margin-left:auto;padding:0 5px;font-size:11px;font-weight:600;display:inline-flex}._4IoqtG_pulseDot{background:var(--dsw-alias-state-success-primary);border-radius:50%;flex:none;width:7px;height:7px;animation:1.6s ease-in-out infinite _4IoqtG_overviewPulse}@keyframes _4IoqtG_overviewPulse{0%,to{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.6)}}@media (prefers-reduced-motion:reduce){._4IoqtG_pulseDot{animation:none}}._4IoqtG_panelEmpty{color:var(--dsw-alias-label-tertiary);font-size:12px}._4IoqtG_panelItem{color:var(--dsw-alias-label-primary);cursor:pointer;text-align:left;background:0 0;border:none;border-radius:6px;justify-content:space-between;align-items:center;gap:8px;padding:5px 8px;font-size:12px;display:flex}._4IoqtG_panelItem:hover{background:var(--dsw-alias-interactive-bg-hover)}._4IoqtG_panelItemTitle{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}._4IoqtG_panelItemValue{color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;flex:none}";
		const tagId = "@wellorbetter/dsh-plugin-window-stats/Overview.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@wellorbetter/dsh-plugin-window-stats";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var Overview_module_css_default = {
			"sectionCount": "_4IoqtG_sectionCount",
			"panelTitle": "_4IoqtG_panelTitle",
			"sidebarText": "_4IoqtG_sidebarText",
			"overviewPulse": "_4IoqtG_overviewPulse",
			"panelHead": "_4IoqtG_panelHead",
			"dot": "_4IoqtG_dot",
			"panelClose": "_4IoqtG_panelClose",
			"panelSectionTitle": "_4IoqtG_panelSectionTitle",
			"panelItem": "_4IoqtG_panelItem",
			"panelEmpty": "_4IoqtG_panelEmpty",
			"pulseDot": "_4IoqtG_pulseDot",
			"panelStats": "_4IoqtG_panelStats",
			"panelStatValue": "_4IoqtG_panelStatValue",
			"panelStatLabel": "_4IoqtG_panelStatLabel",
			"panelItemTitle": "_4IoqtG_panelItemTitle",
			"panelSection": "_4IoqtG_panelSection",
			"accentDot": "_4IoqtG_accentDot",
			"sidebarDot": "_4IoqtG_sidebarDot",
			"panelItemValue": "_4IoqtG_panelItemValue",
			"sidebarSub": "_4IoqtG_sidebarSub",
			"panel": "_4IoqtG_panel",
			"sidebarRow": "_4IoqtG_sidebarRow",
			"panelToggle": "_4IoqtG_panelToggle",
			"panelStat": "_4IoqtG_panelStat"
		};
		//#endregion
		//#region lib/types/client/Overview.js
		/**
		* Always-visible overview surfaces: a compact summary in the sidebar footer
		* (left) and a collapsible global overview panel docked to the right (via
		* `shell.overlay`). Both read the global session list (`useSessions`).
		*
		* @module @wellorbetter/dsh-plugin-window-stats/client/Overview
		*/
		/**
		* Compact sidebar-footer summary: running count and total input tokens.
		* @param props - the sidebar footer slot props.
		*/
		function SidebarSummary({ wide, useSessions, t }) {
			const state = useSessions((s) => s);
			const rows = (0, react.useMemo)(() => deriveWindowRows(state, { includeBlank: false }), [state]);
			const totals = (0, react.useMemo)(() => aggregate(rows), [rows]);
			const cost = (0, react.useMemo)(() => rows.reduce((sum, r) => sum + (costUsd(r, DEFAULT_PRICING["deepseek-v4-pro"]) ?? 0), 0), [rows]);
			if (!wide) return (0, react_jsx_runtime.jsx)("span", {
				className: Overview_module_css_default.sidebarDot,
				title: `${totals.running} ${t("header.running")}`,
				children: totals.running
			});
			return (0, react_jsx_runtime.jsxs)("div", {
				className: Overview_module_css_default.sidebarRow,
				title: `${t("header.running")} · ${t("col.tokensIn")} · ${t("header.cost")}`,
				children: [
					(0, react_jsx_runtime.jsx)("span", { className: Overview_module_css_default.dot }),
					(0, react_jsx_runtime.jsxs)("span", {
						className: Overview_module_css_default.sidebarText,
						children: [
							(0, react_jsx_runtime.jsx)("b", { children: totals.running }),
							" ",
							t("header.running")
						]
					}),
					(0, react_jsx_runtime.jsxs)("span", {
						className: Overview_module_css_default.sidebarSub,
						children: [
							formatTokens(totals.inputTokens),
							" · ",
							formatCost(cost)
						]
					})
				]
			});
		}
		/**
		* Right-docked global overview panel: totals, running sessions, and top token
		* consumers, each clickable to open.
		* @param props - the shell.overlay slot props.
		*/
		function GlobalOverviewPanel({ useSessions, open, t }) {
			const state = useSessions((s) => s);
			const now = (0, react.useMemo)(() => Date.now(), [state]);
			const rows = (0, react.useMemo)(() => deriveWindowRows(state, { includeBlank: false }), [state]);
			const totals = (0, react.useMemo)(() => aggregate(rows), [rows]);
			const [collapsed, setCollapsed] = (0, react.useState)(true);
			const running = (0, react.useMemo)(() => rows.filter((r) => r.running), [rows]);
			const top = (0, react.useMemo)(() => [...rows].sort((a, b) => (b.inputTokens ?? -1) - (a.inputTokens ?? -1)).slice(0, 6), [rows]);
			const recent = (0, react.useMemo)(() => rows.slice(0, 8), [rows]);
			const cost = (0, react.useMemo)(() => rows.reduce((sum, r) => sum + (costUsd(r, DEFAULT_PRICING["deepseek-v4-pro"]) ?? 0), 0), [rows]);
			if (collapsed) return (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: Overview_module_css_default.panelToggle,
				onClick: () => {
					setCollapsed(false);
				},
				"aria-label": t("overview.title"),
				children: "◀"
			});
			return (0, react_jsx_runtime.jsxs)("div", {
				className: Overview_module_css_default.panel,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: Overview_module_css_default.panelHead,
						children: [(0, react_jsx_runtime.jsx)("span", {
							className: Overview_module_css_default.panelTitle,
							children: t("overview.title")
						}), (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: Overview_module_css_default.panelClose,
							onClick: () => {
								setCollapsed(true);
							},
							"aria-label": t("overview.collapse"),
							children: "▶"
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: Overview_module_css_default.panelStats,
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: Overview_module_css_default.panelStat,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.panelStatLabel,
									children: t("header.sessions")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.panelStatValue,
									children: String(totals.total)
								})]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: Overview_module_css_default.panelStat,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.panelStatLabel,
									children: t("header.running")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.panelStatValue,
									children: String(totals.running)
								})]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: Overview_module_css_default.panelStat,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.panelStatLabel,
									children: t("col.tokensIn")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.panelStatValue,
									children: formatTokens(totals.inputTokens)
								})]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: Overview_module_css_default.panelStat,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.panelStatLabel,
									children: t("header.duration")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.panelStatValue,
									children: formatDuration(totals.llmMs + totals.toolMs)
								})]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: Overview_module_css_default.panelStat,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.panelStatLabel,
									children: t("header.cost")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.panelStatValue,
									children: formatCost(cost)
								})]
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: Overview_module_css_default.panelSection,
						"data-accent": "running",
						children: [(0, react_jsx_runtime.jsxs)("div", {
							className: Overview_module_css_default.panelSectionTitle,
							children: [
								(0, react_jsx_runtime.jsx)("span", { className: Overview_module_css_default.accentDot }),
								t("overview.running"),
								running.length > 0 && (0, react_jsx_runtime.jsx)("span", {
									className: Overview_module_css_default.sectionCount,
									children: running.length
								})
							]
						}), running.length === 0 ? (0, react_jsx_runtime.jsx)("div", {
							className: Overview_module_css_default.panelEmpty,
							children: "–"
						}) : running.map((r) => (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: Overview_module_css_default.panelItem,
							onClick: () => {
								open(r.id);
							},
							title: r.title,
							children: [(0, react_jsx_runtime.jsx)("span", { className: Overview_module_css_default.pulseDot }), (0, react_jsx_runtime.jsx)("span", {
								className: Overview_module_css_default.panelItemTitle,
								children: r.title
							})]
						}, r.id))]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: Overview_module_css_default.panelSection,
						"data-accent": "top",
						children: [(0, react_jsx_runtime.jsxs)("div", {
							className: Overview_module_css_default.panelSectionTitle,
							children: [(0, react_jsx_runtime.jsx)("span", { className: Overview_module_css_default.accentDot }), t("overview.topTokens")]
						}), top.map((r) => (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: Overview_module_css_default.panelItem,
							onClick: () => {
								open(r.id);
							},
							title: r.title,
							children: [(0, react_jsx_runtime.jsx)("span", {
								className: Overview_module_css_default.panelItemTitle,
								children: r.title
							}), (0, react_jsx_runtime.jsx)("span", {
								className: Overview_module_css_default.panelItemValue,
								children: formatTokens(r.inputTokens ?? 0)
							})]
						}, r.id))]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: Overview_module_css_default.panelSection,
						"data-accent": "recent",
						children: [(0, react_jsx_runtime.jsxs)("div", {
							className: Overview_module_css_default.panelSectionTitle,
							children: [(0, react_jsx_runtime.jsx)("span", { className: Overview_module_css_default.accentDot }), t("overview.recent")]
						}), recent.map((r) => (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: Overview_module_css_default.panelItem,
							onClick: () => {
								open(r.id);
							},
							title: r.title,
							children: [(0, react_jsx_runtime.jsx)("span", {
								className: Overview_module_css_default.panelItemTitle,
								children: r.title
							}), (0, react_jsx_runtime.jsx)("span", {
								className: Overview_module_css_default.panelItemValue,
								children: whenLabel(r.updatedAt, now, t)
							})]
						}, r.id))]
					})
				]
			});
		}
		function whenLabel(ts, now, t) {
			const time = relativeTime(ts, now);
			if (time.unit === "now") return t("time.now");
			return t({
				min: "time.min",
				hour: "time.hour",
				day: "time.day",
				week: "time.week",
				month: "time.month",
				year: "time.year"
			}[time.unit], { n: time.n });
		}
		//#endregion
		//#region lib/types/client/index.js
		/** Required services: slot registry, locale, and the session list. */
		const inject = [
			"slots",
			"locale",
			"sessions"
		];
		/**
		* Client plugin body: register the locale dictionaries, the two view tabs
		* (Window Stats overview + Session Analysis), the sidebar summary, and the
		* right-docked overview panel. Each registration waits on its slot's
		* declaration via `ctx.slots.inject` and is removed when the plugin unloads.
		* @param ctx - client cordis context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "window-stats: dictionaries");
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("conversation.view", () => ctx.slots.register({
				name: "conversation.view",
				id: "windowStats",
				order: 20,
				locale: NS,
				label: () => t("view.windowStats"),
				inject: () => ({ open: (id) => {
					ctx.sessions.open(id);
				} })
			}, WindowStatsView));
			ctx.slots.inject("conversation.view", () => ctx.slots.register({
				name: "conversation.view",
				id: "sessionAnalytics",
				order: 21,
				locale: NS,
				label: () => t("view.sessionAnalytics")
			}, SessionAnalyticsView));
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "windowStatsSummary",
				locale: NS
			}, SidebarSummary));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "windowStatsOverview",
				locale: NS,
				inject: () => ({ open: (id) => {
					ctx.sessions.open(id);
				} })
			}, GlobalOverviewPanel));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map