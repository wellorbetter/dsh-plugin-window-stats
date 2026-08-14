import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Business face supplied by the plugin's apply closure. */
export interface OverviewInjected {
    open: (id: SessionId) => void;
}
type SidebarProps = PropsRuntime<'sidebar.footer.action'> & PropsLocale<typeof NS>;
type PanelProps = PropsRuntime<'shell.overlay'> & InjectFace<OverviewInjected> & PropsLocale<typeof NS>;
/**
 * Compact sidebar-footer summary: running count and total input tokens.
 * @param props - the sidebar footer slot props.
 */
export declare function SidebarSummary({ wide, useSessions, t }: SidebarProps): import("react").JSX.Element;
/**
 * Right-docked global overview panel: totals, running sessions, and top token
 * consumers, each clickable to open.
 * @param props - the shell.overlay slot props.
 */
export declare function GlobalOverviewPanel({ useSessions, open, t }: PanelProps): import("react").JSX.Element;
export {};
