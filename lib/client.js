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
			"a11y.status": "状态：{label}"
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
			"a11y.status": "Status: {label}"
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
			return {
				id: summary.id,
				title: summary.displayTitle.length > 0 ? summary.displayTitle : idTail(summary.id),
				...summary.cwd !== void 0 ? { cwd: summary.cwd } : {},
				running: summary.running,
				...summary.pendingInteraction !== void 0 ? { pendingInteraction: summary.pendingInteraction } : {},
				completed: summary.completed === true,
				blank: summary.blank,
				updatedAt: summary.updatedAt,
				...stats !== void 0 ? {
					turns: stats.turns,
					steps: stats.steps
				} : {},
				...usage !== void 0 ? {
					inputTokens: usage.uncachedInputTokens + usage.cacheReadTokens + usage.cacheWriteTokens,
					outputTokens: usage.outputTokens,
					cacheReadTokens: usage.cacheReadTokens,
					cacheWriteTokens: usage.cacheWriteTokens
				} : {},
				...pressure !== void 0 ? {
					...pressure.projectedTokens !== void 0 ? { projectedTokens: pressure.projectedTokens } : {},
					...pressure.contextWindow !== void 0 ? { contextWindow: pressure.contextWindow } : {}
				} : {}
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
				rows.push(deriveRow(summary));
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
			}
			return {
				total: rows.length,
				running,
				inputTokens,
				outputTokens,
				cacheReadTokens,
				cacheWriteTokens,
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
		//#endregion
		//#region \0dsh-css:I:\Github\pr\.opencode\workflow\dsh-window-stats\plugin\src\client\WindowStatsView.module.css.mjs
		const css = ".SBPBLa_root{flex-direction:column;gap:10px;height:100%;min-height:0;padding:12px 16px;display:flex;overflow:auto}.SBPBLa_header{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover);border-radius:8px;flex-wrap:wrap;align-items:center;gap:16px;padding:8px 12px;display:flex}.SBPBLa_headerItem{align-items:baseline;gap:6px;display:flex}.SBPBLa_headerLabel{color:var(--dsw-alias-label-tertiary);font-size:12px}.SBPBLa_headerValue{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;font-weight:600}.SBPBLa_hint{color:var(--dsw-alias-label-tertiary);padding:0 2px;font-size:12px}.SBPBLa_table{border-collapse:collapse;width:100%;font-size:13px}.SBPBLa_table th{text-align:left;border-bottom:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);white-space:nowrap;padding:6px 8px;font-weight:500}.SBPBLa_table td{border-bottom:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;vertical-align:middle;padding:8px}.SBPBLa_thStatus{width:40px}.SBPBLa_thNum,.SBPBLa_thActivity{text-align:right}.SBPBLa_row{cursor:pointer;outline:none}.SBPBLa_row:hover,.SBPBLa_row:focus-visible{background:var(--dsw-alias-interactive-bg-hover)}.SBPBLa_row:focus-visible{box-shadow:inset 0 0 0 1px var(--dsw-alias-state-business-primary)}.SBPBLa_cellStatus{width:40px}.SBPBLa_statusCell{align-items:center;display:inline-flex}.SBPBLa_cellTitle{flex-direction:column;gap:2px;max-width:280px;display:flex}.SBPBLa_title{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.SBPBLa_cwd{text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary);text-align:left;direction:rtl;font-size:11px;overflow:hidden}.SBPBLa_cellProgress{white-space:nowrap}.SBPBLa_cellNum{text-align:right;white-space:nowrap}.SBPBLa_cellActivity{text-align:right;color:var(--dsw-alias-label-secondary);white-space:nowrap}.SBPBLa_empty{height:100%;color:var(--dsw-alias-label-secondary);flex-direction:column;justify-content:center;align-items:center;gap:8px;display:flex}.SBPBLa_emptyTitle{color:var(--dsw-alias-label-primary);font-weight:600}.SBPBLa_emptyHint{text-align:center;max-width:420px;color:var(--dsw-alias-label-tertiary)}.SBPBLa_visuallyHidden{clip:rect(0 0 0 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}";
		const tagId = "@wellorbetter/dsh-plugin-window-stats/WindowStatsView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@wellorbetter/dsh-plugin-window-stats";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var WindowStatsView_module_css_default = {
			"cellTitle": "SBPBLa_cellTitle",
			"thActivity": "SBPBLa_thActivity",
			"headerValue": "SBPBLa_headerValue",
			"cwd": "SBPBLa_cwd",
			"thStatus": "SBPBLa_thStatus",
			"cellNum": "SBPBLa_cellNum",
			"cellProgress": "SBPBLa_cellProgress",
			"title": "SBPBLa_title",
			"cellActivity": "SBPBLa_cellActivity",
			"root": "SBPBLa_root",
			"headerItem": "SBPBLa_headerItem",
			"headerLabel": "SBPBLa_headerLabel",
			"statusCell": "SBPBLa_statusCell",
			"empty": "SBPBLa_empty",
			"visuallyHidden": "SBPBLa_visuallyHidden",
			"cellStatus": "SBPBLa_cellStatus",
			"emptyTitle": "SBPBLa_emptyTitle",
			"hint": "SBPBLa_hint",
			"table": "SBPBLa_table",
			"header": "SBPBLa_header",
			"thNum": "SBPBLa_thNum",
			"emptyHint": "SBPBLa_emptyHint",
			"row": "SBPBLa_row"
		};
		//#endregion
		//#region lib/types/client/WindowStatsView.js
		/**
		* 「窗口统计」 view tab: a read-only table of every non-blank session with its
		* progress (turns/steps) and token consumption (input/output/cache/context),
		* plus an aggregate header. Pure presentational — all data arrives through the
		* framework standard kit (`useSessions`) and the inject face (`open`).
		*
		* @module @wellorbetter/dsh-plugin-window-stats/client/WindowStatsView
		*/
		/** Map a row to its presentation state dot. */
		function stateOf(row) {
			if (row.running) return "ongoing";
			if (row.pendingInteraction !== void 0) return "warning";
			return "done";
		}
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
		const TIME_UNIT_KEYS = {
			now: "time.now",
			min: "time.min",
			hour: "time.hour",
			day: "time.day",
			week: "time.week",
			month: "time.month",
			year: "time.year"
		};
		/**
		* Render the Window Stats dashboard.
		* @param props - the composed slot props.
		* @returns the table, header, and empty state.
		*/
		function WindowStatsView({ useSessions, open, t }) {
			const state = useSessions((s) => s);
			const now = (0, react.useMemo)(() => Date.now(), [state]);
			const rows = (0, react.useMemo)(() => deriveWindowRows(state, { includeBlank: false }), [state]);
			const totals = (0, react.useMemo)(() => aggregate(rows), [rows]);
			const hiddenSubagents = (0, react.useMemo)(() => hiddenSubagentCount(state), [state]);
			if (rows.length === 0) return (0, react_jsx_runtime.jsxs)("div", {
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
							})
						]
					}),
					hiddenSubagents > 0 && (0, react_jsx_runtime.jsx)("div", {
						className: WindowStatsView_module_css_default.hint,
						children: t("hint.hiddenSubagents", { n: hiddenSubagents })
					}),
					(0, react_jsx_runtime.jsxs)("table", {
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
								className: WindowStatsView_module_css_default.thActivity,
								children: t("col.activity")
							})
						] }) }), (0, react_jsx_runtime.jsx)("tbody", { children: rows.map((row) => (0, react_jsx_runtime.jsx)(WindowStatsRow, {
							row,
							now,
							t,
							onOpen: () => {
								open(row.id);
							}
						}, row.id)) })]
					})
				]
			});
		}
		function WindowStatsRow({ row, now, t, onOpen }) {
			const hit = cacheHitRatio(row);
			const occupied = row.projectedTokens !== void 0 && row.contextWindow !== void 0 && row.contextWindow > 0 ? Math.round(row.projectedTokens / row.contextWindow * 100) : null;
			const time = relativeTime(row.updatedAt, now);
			const activity = time.unit === "now" ? t("time.now") : t(TIME_UNIT_KEYS[time.unit], { n: time.n });
			const statusLabel = t(statusKeyOf(row));
			const dot = (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: stateOf(row) });
			return (0, react_jsx_runtime.jsxs)("tr", {
				className: WindowStatsView_module_css_default.row,
				onClick: onOpen,
				onKeyDown: (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						onOpen();
					}
				},
				tabIndex: 0,
				role: "row",
				"aria-label": t("a11y.openSession", { title: row.title }),
				children: [
					(0, react_jsx_runtime.jsx)("td", {
						className: WindowStatsView_module_css_default.cellStatus,
						children: (0, react_jsx_runtime.jsxs)("span", {
							className: WindowStatsView_module_css_default.statusCell,
							children: [dot, (0, react_jsx_runtime.jsx)("span", {
								className: WindowStatsView_module_css_default.visuallyHidden,
								children: t("a11y.status", { label: statusLabel })
							})]
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
						className: WindowStatsView_module_css_default.cellActivity,
						children: activity
					})
				]
			});
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
		* Client plugin body: register the locale dictionaries and the Window Stats
		* view tab. The slot registration waits on the `conversation.view` declaration
		* via `ctx.slots.inject` and is removed when the plugin unloads.
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
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map