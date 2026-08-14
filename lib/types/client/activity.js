const PROMPT_MAX_CHARS = 160;
/** Extract concatenated text from content blocks (ignoring non-text blocks). */
function extractText(content) {
    let text = '';
    for (const block of content) {
        if (block.type === 'text' && typeof block.text === 'string')
            text += block.text;
    }
    return text;
}
/**
 * Fold the current session's in-window conversation into an activity report.
 * @param snapshot - the current session's conversation snapshot.
 * @param now - epoch ms anchor for the range cut.
 * @param rangeMs - how far back to include (null = the whole loaded window).
 * @returns tool-type distribution and turn summaries within the range.
 */
export function deriveActivity(snapshot, now, rangeMs) {
    const since = rangeMs === null ? null : now - rangeMs;
    // Tool buckets + global tool totals.
    const buckets = new Map();
    let totalToolCalls = 0;
    let totalToolMs = 0;
    const inRange = (time) => since === null || time >= since;
    for (const node of snapshot.nodes) {
        if (node.kind !== 'tool-result')
            continue;
        if (!inRange(node.time))
            continue;
        const name = node.call?.name ?? 'unknown';
        const start = node.callTime ?? node.time;
        const durationMs = Math.max(0, node.time - start);
        const entry = buckets.get(name) ?? { count: 0, durationMs: 0 };
        entry.count += 1;
        entry.durationMs += durationMs;
        buckets.set(name, entry);
        totalToolCalls += 1;
        totalToolMs += durationMs;
    }
    // Turn summaries: associate tool results by time within each turn's span.
    const turns = [];
    for (const [turn, timing] of snapshot.turnTimings) {
        if (!inRange(timing.startTime))
            continue;
        const endTime = timing.endTime;
        const durationMs = endTime !== undefined ? Math.max(0, endTime - timing.startTime) : 0;
        const tools = new Set();
        let toolCount = 0;
        for (const node of snapshot.nodes) {
            if (node.kind !== 'tool-result')
                continue;
            const t = node.time;
            if (t < timing.startTime)
                continue;
            if (endTime !== undefined && t > endTime)
                continue;
            tools.add(node.call?.name ?? 'unknown');
            toolCount += 1;
        }
        // Last user message at or before the turn start is the opening prompt.
        let prompt = '';
        for (const node of snapshot.nodes) {
            if (node.kind === 'user' && node.time <= timing.startTime) {
                prompt = extractText(node.content).trim();
            }
        }
        turns.push({
            turn,
            startTime: timing.startTime,
            ...(endTime !== undefined ? { endTime } : {}),
            durationMs,
            prompt: prompt.slice(0, PROMPT_MAX_CHARS),
            tools: [...tools],
            toolCount,
        });
    }
    const toolList = [...buckets.entries()]
        .map(([name, v]) => ({ name, count: v.count, durationMs: v.durationMs }))
        .sort((a, b) => b.durationMs - a.durationMs);
    turns.sort((a, b) => b.startTime - a.startTime);
    return { tools: toolList, turns, totalToolCalls, totalToolMs, turnCount: turns.length };
}
//# sourceMappingURL=activity.js.map