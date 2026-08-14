/**
 * Test stub for @deepseek-ai/dsh-client-ui-primitives. The real package's
 * barrel eagerly imports Markdown/katex CSS, which the vitest node/jsdom lane
 * cannot resolve. The view only consumes `StateDot`, so this stub provides the
 * minimal runtime surface.
 */
export function StateDot({ state, className }: { state: string; size?: number; className?: string }) {
  return <span className={className} data-state={state} />
}
