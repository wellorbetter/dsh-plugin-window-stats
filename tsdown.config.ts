/**
 * Standalone tsdown build for @wellorbetter/dsh-plugin-window-stats,
 * replicating the official client-plugin build contract (see the deepseek
 * harness `packages/client/tsdown.client.ts` clientConfig):
 *
 * - Host half: bundle `lib/types/{index,invariant}.js` (emitted by tsc) into
 *   `lib/{index,invariant}.js` as ESM for Node.
 * - Client half: bundle `lib/types/client/index.js` into `lib/client.js` as a
 *   CJS browser artifact wrapped in `window.__ModuleLoader__.load({ id,
 *   factory })`, with platform modules external (answered by the frozen
 *   loader module table) and everything else inlined. CSS Modules are
 *   compiled by lightningcss and injected as `<style data-plugin>` tags.
 *
 * @module tsdown.config
 */
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { basename, dirname, resolve as resolvePath, sep } from 'node:path'
import { defineConfig, type UserConfig } from 'tsdown'
import { transform } from 'lightningcss'

const PLUGIN_ID = '@wellorbetter/dsh-plugin-window-stats'

/** Browser platform modules shared by the shell (mirror of dsh-client-web platform.ts). */
const PLATFORM_MODULES: readonly string[] = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment',
  '@deepseek-ai/dsh-client-schema-form',
]

/**
 * Externals resolved from the loader module table: the platform seed entries
 * plus the documented runtime store exemption.
 */
const CLIENT_EXTERNALS: readonly string[] = [...PLATFORM_MODULES, '@deepseek-ai/dsh-client-runtime/client']

/** Wire/type layers a client bundle may inline (no shared runtime identity). */
const INLINE_SAFE = /^@deepseek-ai\/dsh-(host-apiproxy|session|llm|tools|brand)(\/|$)/

/** Vendored framework libraries (ordinary libraries a browser bundle inlines). */
const VENDORED_LIBRARY = /^@deepseek-ai\/(cosmokit|schemastery)(\/|$)/

/** Generated descriptor/codec contribution with no shared runtime identity. */
const GENERATED_REMOTE = /^@deepseek-ai\/dsh-[a-z0-9]+(?:-[a-z0-9]+)*\/remote$/

/** Virtual-id wrapper keeping module CSS away from tsdown's own css pipeline. */
const CSS_VIRTUAL_PREFIX = '\0dsh-css:'
const CSS_VIRTUAL_SUFFIX = '.mjs'

const NODE_ENV = process.env.NODE_ENV ?? 'production'

/** tsdown resolveId hook: reject non-platform @deepseek-ai/* value imports. */
function purityResolveId(source: string): string | null {
  if (!source.startsWith('@deepseek-ai/')) return null
  if (CLIENT_EXTERNALS.includes(source)) return null
  if (VENDORED_LIBRARY.test(source)) return null
  if (INLINE_SAFE.test(source) || GENERATED_REMOTE.test(source)) return null
  throw new Error(
    `client bundle purity: "${source}" is not a platform module (CLIENT_EXTERNALS), `
    + 'an inline-safe wire layer, or a generated /remote contribution — cross-plugin value '
    + 'imports are forbidden; collaborate through cordis services (type-only imports are erased)',
  )
}

const cssModulePlugin = {
  name: 'dsh-css-modules-inline',
  resolveId(source: string, importer: string | undefined) {
    if (!source.endsWith('.module.css')) return null
    const abs = importer !== undefined ? sourceAssetPath(source, importer) : source
    return CSS_VIRTUAL_PREFIX + abs + CSS_VIRTUAL_SUFFIX
  },
  async load(virtualId: string) {
    if (!virtualId.startsWith(CSS_VIRTUAL_PREFIX)) return null
    const fileId = virtualId.slice(CSS_VIRTUAL_PREFIX.length, -CSS_VIRTUAL_SUFFIX.length)
    if (this !== undefined) this.addWatchFile(fileId)
    const source = await readFile(fileId)
    const { code, exports: cssExports } = transform({
      filename: fileId,
      code: source,
      cssModules: { pattern: '[hash]_[local]' },
      minify: true,
    })
    const classMap: Record<string, string> = {}
    for (const [local, exp] of Object.entries(cssExports ?? {})) classMap[local] = exp.name
    return [
      `const css = ${JSON.stringify(code.toString())};`,
      `const tagId = ${JSON.stringify(`${PLUGIN_ID}/${basename(fileId)}`)};`,
      'if (typeof document !== \'undefined\' && document.querySelector(\'style[data-plugin-css=\' + JSON.stringify(tagId) + \']\') === null) {',
      '  const tag = document.createElement(\'style\');',
      `  tag.dataset.plugin = ${JSON.stringify(PLUGIN_ID)};`,
      '  tag.dataset.pluginCss = tagId;',
      '  tag.textContent = css;',
      '  document.head.appendChild(tag);',
      '}',
      `export default ${JSON.stringify(classMap)};`,
    ].join('\n')
  },
}

/** Resolve an emitted JS asset's CSS import against its source-tree counterpart. */
function sourceAssetPath(source: string, importer: string): string {
  const emitted = resolvePath(dirname(importer), source)
  if (existsSync(emitted)) return emitted
  const marker = `${sep}lib${sep}types${sep}`
  const boundary = emitted.indexOf(marker)
  if (boundary < 0) return emitted
  return resolvePath(emitted.slice(0, boundary), 'src', emitted.slice(boundary + marker.length))
}

const hostConfig: UserConfig = {
  name: `${PLUGIN_ID}/host`,
  entry: ['lib/types/index.js', 'lib/types/invariant.js'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  dts: false,
  clean: false,
  fixedExtension: false,
}

const clientConfig: UserConfig = {
  name: `${PLUGIN_ID}/client`,
  entry: { client: 'lib/types/client/index.js' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  external: [...CLIENT_EXTERNALS],
  define: {
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'import.meta.env.MODE': JSON.stringify(NODE_ENV),
    'import.meta.env': JSON.stringify({ MODE: NODE_ENV }),
  },
  noExternal: (id: string) => (CLIENT_EXTERNALS.includes(id) ? undefined : true),
  plugins: [{ name: 'dsh-client-bundle-purity', resolveId: purityResolveId }, cssModulePlugin],
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

export default defineConfig([hostConfig, clientConfig])
