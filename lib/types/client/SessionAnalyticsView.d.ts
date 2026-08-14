import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
type Props = ConvViewProps & PropsLocale<typeof NS>;
/**
 * Render the session activity analytics.
 * @param props - the composed slot props.
 */
export declare function SessionAnalyticsView({ useSession, useProjection, t }: Props): import("react").JSX.Element;
export {};
