import z from '@deepseek-ai/schemastery';
/** Stable loader name; matches the bundle row `id: window-stats`. */
export const name = '@wellorbetter/dsh-plugin-window-stats';
/** Empty config schema (schemastery); any key is rejected until a host option exists. */
export const Config = z.object({});
/**
 * No-op host apply: see the module contract above. The client half is
 * discovered from the package's `dsh.client` manifest by dsh-client-modules.
 * @param _ctx - host cordis context (unused in v1).
 */
export function apply(_ctx) { }
//# sourceMappingURL=index.js.map