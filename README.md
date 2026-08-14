<div align="center">

# 🪟 dsh-plugin-window-stats

**DSH Web 插件 —— 一屏看全所有会话窗口的对话进度与 Token 消耗。**

<code>全窗口总览</code> · <code>实时刷新</code> · <code>Token 统计</code> · <code>纯只读</code>

[🌏 中文](./README.md) · [English](./README_EN.md)

<p>
  <a href="https://github.com/wellorbetter/dsh-plugin-window-stats"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/wellorbetter/dsh-plugin-window-stats?style=flat-square&color=4176e6"></a>
  <a href="https://github.com/topics/dsh-plugin"><img alt="dsh-plugin" src="https://img.shields.io/badge/dsh--plugin-DSH%20插件-4176e6?style=flat-square"></a>
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square"></a>
  <a href="https://github.com/wellorbetter/dsh-plugin-window-stats"><img alt="GitHub" src="https://img.shields.io/badge/github-源码-0f1115?style=flat-square&logo=github"></a>
</p>

</div>

<img src="assets/window-stats-demo.png" alt="窗口统计预览" width="100%">

<details>
<summary><b>📷 实测截图（真实 DSH GUI）</b></summary>

<img src="assets/window-stats.png" alt="真实环境实测" width="100%">

</details>

## ✨ 功能一览

- 🗂️ **全窗口总览**：每个会话一行，展示状态（运行中 / 等待审批 / 等待回答 / 待审计划 / 已完成 / 空闲）、标题、轮次/步数、输入/输出 Token、缓存命中率、上下文占用、耗时、最后活动时间。
- 📋 **右侧详情面板**：点选任意会话，右侧展开多维度明细 —— Token 四桶分解（未缓存输入/缓存读/缓存写/输出，带占比条）、上下文组成（系统/工具/消息）与占用条、耗时（LLM/工具/首 Token 均值/解码吞吐）、后台任务与子代理数。
- 📈 **会话分析页签**：按时间范围（10 分钟 / 1 小时 / 1 天 / 全部）分析当前会话 —— 工具类型时长分布（web / bash / read / edit… 的次数与耗时占比）、每轮任务摘要（用户输入 + 所用工具 + 耗时）。
- 💰 **成本估算**：按 DeepSeek 官方定价估算每个会话的 USD 成本（V4-Flash / V4-Pro 可切换，缓存命中/未命中/输出分开计价）。
- 🗓️ **Token 热力图**：详情面板展示会话的每日 Token 消耗热力图（GitHub 风格，由 host 投影 `tokenHistory` 提供）。
- 🔀 **分组 / 排序 / 过滤**：按工作区分组、按活动/输入/耗时排序、按状态（运行中/等待中/空闲）过滤。
- 🧹 **隐藏子代理会话**：默认只显示顶层会话，自动隐藏内部子代理（agent 派生的子任务）会话，避免列表被内部工作流刷屏。
- 📊 **汇总头部**：会话总数、运行中数量、输入/输出 Token、总耗时、总成本，一眼掌握全局。
- 🖱️ **点击直达**：详情面板内置「打开会话」按钮，一键跳转到对应会话。
- ⚡ **实时刷新**：数据来自官方 projection 推送（`session/projection` 帧），运行中的窗口自动更新，无需手动刷新。
- 🔒 **纯只读、纯本地**：不发起网络请求、不写任何会话数据。

## 🚀 安装

> 前置：已装好 DSH（`dsh web` 能正常运行）。

```sh
# 从 GitHub 安装（预构建 lib/ 已入库，开箱即用，无需 allowBuilds）
dsh plugin --profile web add github:wellorbetter/dsh-plugin-window-stats

# 从 npm 安装（发布后）
dsh plugin --profile web add @wellorbetter/dsh-plugin-window-stats

# 本地开发安装
dsh plugin --profile web add link:<本地路径>
```

装完**重启 `dsh web`**，打开任一会话，顶部视图环即出现「窗口统计」页签。

<details>
<summary><b>验证是否生效（可选）</b></summary>

```sh
dsh --profile web --dump-config
# 应出现 "# == @wellorbetter/dsh-plugin-window-stats" 层与 "id: window-stats" 行
```

</details>

卸载：

```sh
dsh plugin --profile web remove @wellorbetter/dsh-plugin-window-stats
```

## 📊 数据来源

表格读取客户端全局 `useSessions` 快照里每行的 `projectionValues`（无需打开会话即可读取）：

| 展示 | 来源 |
|---|---|
| 轮次 / 步数 | `sessionStats` projection（整条日志的 `turns` / `steps`） |
| 输入 / 输出 / 缓存 Token | `tokenUsage` projection（`uncachedInputTokens` + `cacheReadTokens` + `cacheWriteTokens` / `outputTokens`） |
| 缓存命中率 | `cacheReadTokens ÷ 输入 Token`（钳制 0–100%） |
| 上下文占用 | `contextPressure` projection（`~projectedTokens / contextWindow`，近似值） |
| 状态 | `SessionSummary.running` / `pendingInteraction` / `completed` |

这些 projection 由官方 `dsh-session-stats`、`dsh-token-meter` 在 host 计算，随 `session.list` 行与 `session/projection` push 帧下发（higher-seq-wins）。

## 📁 项目结构

```
dsh-plugin-window-stats/
├── src/
│   ├── index.ts                 # host 半（空 apply）
│   ├── invariant.ts             # 包级 invariant 伴生
│   └── client/                  # 浏览器半（"./client" 入口）
│       ├── index.ts             # inject + apply：注册「窗口统计」页签
│       ├── stats.ts             # 纯派生：行模型 / 汇总 / 格式化
│       ├── locales.ts           # zh / en 字典
│       ├── WindowStatsView.tsx  # 表格视图组件
│       └── WindowStatsView.module.css
├── tests/                       # 15 个用例（派生 / 视图 / apply·dispose）
├── cordis.patch.yml             # bundle 层（id: window-stats）
├── tsdown.config.ts             # host + client 构建（ModuleLoader 包装 + 纯度门）
└── lib/                         # 预构建产物（入库以支持 github: 安装）
```

## Model Experience

None — 本插件只渲染一个客户端只读视图，读取 host 已计算的 projection；不新增 prompt、message、schema、tool 或任何模型调用。

#### KV Cache effect

None — 不组装或发送任何 provider 请求。

## 🛠 开发与构建

```sh
pnpm install
pnpm verify      # typecheck + build + test
pnpm test        # vitest run（15 个用例）
```

产物：`lib/index.js`（host 半）、`lib/invariant.js`、`lib/client.js`（`window.__ModuleLoader__.load` 包装的浏览器 bundle）。

## 📦 发布到 GitHub（`gh`）

```sh
cd plugin
git init && git add -A && git commit -m "dsh-plugin-window-stats v0.1.0"
gh repo create dsh-plugin-window-stats --public --source=. --push
gh repo edit wellorbetter/dsh-plugin-window-stats --add-topic dsh-plugin --add-topic dsh --add-topic deepseek
```

> `lib/` 入库说明：`dsh plugin add github:...` 拉取的是 Git 源码（不是 npm 构建产物）。官方推荐自包含 `prepare` 脚本，但 pnpm ≥10 会拦截 Git 依赖的构建脚本；本仓库采用「预构建 `lib/` 入库」，让 `github:` 安装开箱即用。

## ⚠️ 已知限制

- **冷会话的 projection 可能滞后**：从未在本进程打开过的会话，其列表行 projection 来自 projection 缓存（每 200 事件 / 5 秒落盘），可能略旧于实时值；打开过的会话为实时值。
- **只读视图，无历史图表**：仅当前快照；不做 token 计费、导出或时序图。
- **上下文占用是近似值**：`projectedTokens` 采用官方 4 字符/token 启发式 + provider 锚点，UI 以 `~` 前缀呈现。
- **排序/分组**：v1 按最后活动时间降序；按工作区分组、按 token 排序属后续工作。
- **页签为 session 作用域**：每个会话的页签环里都能看到同一个全局仪表盘（内容与当前会话无关）。

## 🖥 平台支持

- Web（`dsh.client.platform: 'web'`）；任意支持 DSH Web GUI 的桌面/服务器环境。
- 依赖 `@deepseek-ai/*@0.1.0-rc.6` 系列公开契约。

## 📄 License

[MIT](./LICENSE) © 2026 wellorbetter
