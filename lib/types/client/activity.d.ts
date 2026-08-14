/**
 * Pure derivation of the 「会话分析」 (Session Analysis) report from the
 * current session's conversation snapshot: tool-type distribution and
 * per-turn task summaries, filtered by a time range. No React, no I/O.
 *
 * @module @wellorbetter/dsh-plugin-window-stats/client/activity
 */
import type { ConversationSnapshot } from '@deepseek-ai/dsh-client-runtime/client';
/** One tool-type bucket (tool name → call count + summed duration). */
export interface ToolActivity {
    name: string;
    count: number;
    durationMs: number;
}
/** One turn summarized for the selected range. */
export interface TurnActivity {
    turn: number;
    startTime: number;
    endTime?: number;
    durationMs: number;
    /** User prompt excerpt that opened the turn (empty when none in-window). */
    prompt: string;
    /** Unique tool names run during the turn, in first-seen order. */
    tools: string[];
    toolCount: number;
}
/** The folded activity report for one range. */
export interface ActivityReport {
    /** Tool buckets sorted by duration descending. */
    tools: ToolActivity[];
    /** Turns sorted by start time descending (newest first). */
    turns: TurnActivity[];
    totalToolCalls: number;
    totalToolMs: number;
    turnCount: number;
}
/**
 * Fold the current session's in-window conversation into an activity report.
 * @param snapshot - the current session's conversation snapshot.
 * @param now - epoch ms anchor for the range cut.
 * @param rangeMs - how far back to include (null = the whole loaded window).
 * @returns tool-type distribution and turn summaries within the range.
 */
export declare function deriveActivity(snapshot: ConversationSnapshot, now: number, rangeMs: number | null): ActivityReport;
