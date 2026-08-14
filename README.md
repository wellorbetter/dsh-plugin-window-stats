# dsh-plugin-window-stats

<div align="center">

**一个 DSH Web 插件：在会话视图环里新增「窗口统计」页签，一屏看全所有会话窗口的对话进度与 Token 消耗。**

[🌏 中文](./README.md) · [English](./README_EN.md)

</div>

![窗口统计](assets/window-stats.png)

## ✨ 功能一览

- **所有窗口一屏总览**：每个会话一行，展示状态（运行中 / 等待审批 / 等待回答 / 待审计划 / 已完成 / 空闲）、标题、轮次/步数、输入/输出 Token、缓存命中率、上下文占用、最后活动时间。
- **汇总头部**：会话总数、运行中数量、输入/输出 Token 合计。
- **点击直达**：点任意行直接打开对应会话。
- **实时刷新**：数据来自官方 projection 推送（`session/projection` 帧），运行中的窗口自动更新，无需手动刷新。
- **纯只读、纯本地**：不发起网络请求、不写任何会话数据、无 host 服务、无新增 RPC。

## 🚀 安装

```sh
# 从 npm 安装（发布后）
dsh plugin --profile web add @wellorbetter/dsh-plugin-window-stats

# 从 GitHub 安装（预构建 lib/ 已入库，开箱即用，无需 allowBuilds）
dsh plugin --profile web add github:wellorbetter/dsh-plugin-window-stats

# 本地开发安装
dsh plugin --profile web add link:<本地路径>
```

安装后重启目标 profile（`dsh web`），打开任一会话，顶部视图环即出现「窗口统计」页签。

验证层是否生效：

```sh
dsh --profile web --dump-config
# 应出现 "# == @wellorbetter/dsh-plugin-window-stats" 层与 "id: window-stats" 行
```

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

产物：`lib/index.js`（host 半，空 apply）、`lib/invariant.js`、`lib/client.js`（`window.__ModuleLoader__.load` 包装的浏览器 bundle）。

## 📦 发布到 GitHub（`gh`）

```sh
# 1. 初始化仓库并推送（插件目录已含 .gitignore，忽略 node_modules/ 与 lib/）
#    注意：为支持 github: 安装开箱即用，需把构建好的 lib/ 一并提交入库
cd plugin
git init && git add -A && git commit -m "dsh-plugin-window-stats v0.1.0"
gh repo create dsh-plugin-window-stats --public --source=. --push

# 2. 打上社区 topic（让插件出现在 https://github.com/topics/dsh-plugin）
gh repo edit wellorbetter/dsh-plugin-window-stats --add-topic dsh-plugin --add-topic dsh --add-topic deepseek

# 3. 安装验证
dsh plugin --profile web add github:wellorbetter/dsh-plugin-window-stats
```

> `lib/` 入库说明：`dsh plugin add github:...` 拉取的是 Git 源码（不是 npm 构建产物）。官方推荐自包含 `prepare` 脚本，但 pnpm ≥10 会拦截 Git 依赖的构建脚本。因此本仓库采用「**预构建 `lib/` 入库**」策略，让 `github:` 安装开箱即用、无需 `allowBuilds`。

## ⚠️ 已知限制

- **冷会话的 projection 可能滞后**：从未在本进程打开过的会话，其列表行 projection 来自 projection 缓存（每 200 事件 / 5 秒落盘），可能略旧于实时值；打开过的会话为实时值。
- **只读视图，无历史图表**：仅当前快照；不做 token 计费、导出或时序图。
- **上下文占用是近似值**：`projectedTokens` 采用官方 4 字符/token 启发式 + provider 锚点，UI 以 `~` 前缀呈现。
- **排序/分组**：v1 按最后活动时间降序；按工作区分组、按 token 排序属后续工作。
- **页签为 session 作用域**：每个会话的页签环里都能看到同一个全局仪表盘（内容与当前会话无关）。

## 🖥 平台支持

- Web（`dsh.client.platform: 'web'`）；任意支持 DSH Web GUI 的桌面/服务器环境。
- 依赖 `@deepseek-ai/*@0.1.0-rc.6` 系列公开契约。
