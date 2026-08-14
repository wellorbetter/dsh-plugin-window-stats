# dsh-plugin-window-stats

<div align="center">

**A DSH web plugin: adds a "Window Stats" tab to the conversation view ring, showing progress and token usage across ALL sessions at a glance.**

[🌏 中文](./README.md) · [English](./README_EN.md)

</div>

![Window Stats](assets/window-stats.png)

## ✨ Features

- **All-windows overview**: one row per session — status (running / waiting for approval / waiting for your answer / plan review / completed / idle), title, turns/steps, input/output tokens, cache-hit ratio, context occupancy, and last activity.
- **Aggregate header**: total sessions, running count, and summed input/output tokens.
- **Click to jump**: activating a row opens that session.
- **Live updates**: data rides the official projection push (`session/projection` frames); running sessions update without a manual refresh.
- **Read-only & local-only**: no outbound network requests, no session writes, no host service, no new RPC.

## 🚀 Install

```sh
# from npm (after publishing)
dsh plugin --profile web add @wellorbetter/dsh-plugin-window-stats

# from GitHub (pre-built lib/ is committed — works out of the box, no allowBuilds)
dsh plugin --profile web add github:wellorbetter/dsh-plugin-window-stats

# local development
dsh plugin --profile web add link:<path>
```

Restart the target profile (`dsh web`) after installing; the "Window Stats" tab appears in the view ring of any session.

Verify the layer:

```sh
dsh --profile web --dump-config
# expect a "# == @wellorbetter/dsh-plugin-window-stats" layer and an "id: window-stats" row
```

Uninstall:

```sh
dsh plugin --profile web remove @wellorbetter/dsh-plugin-window-stats
```

## 📊 Data source

The table reads each row's `projectionValues` from the client's global `useSessions` snapshot (readable without opening any session):

| Displayed | Source |
|---|---|
| turns / steps | `sessionStats` projection (`turns` / `steps` over the whole log) |
| input / output / cache tokens | `tokenUsage` projection (`uncachedInputTokens` + `cacheReadTokens` + `cacheWriteTokens` / `outputTokens`) |
| cache-hit ratio | `cacheReadTokens ÷ input tokens` (clamped 0–100%) |
| context occupancy | `contextPressure` projection (`~projectedTokens / contextWindow`, approximate) |
| status | `SessionSummary.running` / `pendingInteraction` / `completed` |

These projections are computed on the host by the official `dsh-session-stats` and `dsh-token-meter` units and delivered on `session.list` rows and `session/projection` push frames (higher-seq-wins).

## Model Experience

None — this plugin renders a read-only client view over projections the host already computes; it adds no prompt, message, schema, tool, or model call.

#### KV Cache effect

None — it never assembles or sends a provider request.

## 🛠 Development & build

```sh
pnpm install
pnpm verify      # typecheck + build + test
pnpm test        # vitest run (15 cases)
```

Artifacts: `lib/index.js` (host half, empty apply), `lib/invariant.js`, `lib/client.js` (browser bundle wrapped in `window.__ModuleLoader__.load`).

## 📦 Publish to GitHub (`gh`)

```sh
# 1. init and push (the plugin dir already gitignores node_modules/ and lib/)
#    NOTE: commit the built lib/ so github: installs work out of the box
cd plugin
git init && git add -A && git commit -m "dsh-plugin-window-stats v0.1.0"
gh repo create dsh-plugin-window-stats --public --source=. --push

# 2. tag with the community topics (surfaces it at https://github.com/topics/dsh-plugin)
gh repo edit wellorbetter/dsh-plugin-window-stats --add-topic dsh-plugin --add-topic dsh --add-topic deepseek

# 3. verify install
dsh plugin --profile web add github:wellorbetter/dsh-plugin-window-stats
```

> Why commit `lib/`: `dsh plugin add github:...` fetches Git sources (not npm build output). The official path is a self-contained `prepare` script, but pnpm ≥10 blocks build scripts for Git deps, so this repo commits the pre-built `lib/` instead — `github:` installs work with no `allowBuilds`.

## ⚠️ Known limitations

- **Cold-session projections can lag**: a session never opened in this process reads its list-row projections from the projection cache (persisted every 200 events / 5 s), so it can trail live values; opened sessions are live.
- **Read-only, no history charts**: current snapshot only; no billing, export, or time series.
- **Context occupancy is approximate**: `projectedTokens` uses the official 4-chars/token heuristic plus a provider anchor; the UI prefixes it with `~`.
- **Sort/group**: v1 sorts by last activity descending; grouping by workspace and sorting by tokens are follow-ups.
- **Session-scoped tab**: the view ring belongs to the current session, so every session's tab ring shows the same global dashboard (content is session-independent).

## 🖥 Platform support

- Web (`dsh.client.platform: 'web'`); any desktop/server environment running the DSH web GUI.
- Depends on the public `@deepseek-ai/*@0.1.0-rc.6` contracts.
