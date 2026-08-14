//#region lib/types/invariant.js
/**
* Package invariant companion for @wellorbetter/dsh-plugin-window-stats.
*
* No runtime invariant: this package registers no host services, tools,
* routes, or durable event relationships of its own. The client half
* contributes UI only and reads projections the host already produces, so
* there is no owned relationship to assert at runtime.
*
* @module @wellorbetter/dsh-plugin-window-stats/invariant
*/
/** Manifest name this companion documents (matches the plugin `name`). */
const invariantOwner = "@wellorbetter/dsh-plugin-window-stats";
//#endregion
export { invariantOwner };
