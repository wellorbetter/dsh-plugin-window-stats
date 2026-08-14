import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client';
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Business face supplied by the plugin's apply closure. */
export interface WindowStatsInjected {
    /** Open a session (current-session switch). */
    open: (id: SessionId) => void;
}
/** Composed component props: the view slot shares plus the inject face and locale seat. */
type WindowStatsProps = ConvViewProps & InjectFace<WindowStatsInjected> & PropsLocale<typeof NS>;
/**
 * Render the Window Stats dashboard.
 * @param props - the composed slot props.
 */
export declare function WindowStatsView({ useSessions, open, t }: WindowStatsProps): import("react").JSX.Element;
export {};
