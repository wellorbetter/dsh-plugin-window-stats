// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { apply } from '../src/client/index.ts'

interface FakeState {
  localeRegisterCalls: unknown[][]
  localeDisposed: boolean
  slotsInjectKey: string | null
  registerArgs: unknown[]
  registerDisposed: boolean
  opened: string[]
}

function makeFake() {
  const state: FakeState = {
    localeRegisterCalls: [],
    localeDisposed: false,
    slotsInjectKey: null,
    registerArgs: [],
    registerDisposed: false,
    opened: [],
  }
  const ctx: {
    effect: (fn: () => (() => void) | void, label: string) => void
    effects: Array<() => void>
    locale: { register: (...args: unknown[]) => () => void; bind: () => (key: string) => string }
    slots: { inject: (name: string, cb: () => (() => void) | void) => () => void; register: (...args: unknown[]) => () => void }
    sessions: { open: (id: string) => void }
  } = {
    effects: [],
    effect(fn) {
      const d = fn()
      ctx.effects.push(() => { d?.() })
    },
    locale: {
      register: (...args) => {
        state.localeRegisterCalls.push(args)
        return () => { state.localeDisposed = true }
      },
      bind: () => (key) => key,
    },
    slots: {
      inject: (name, cb) => {
        state.slotsInjectKey = name
        cb()
        return () => { state.registerDisposed = true }
      },
      register: (...args) => {
        state.registerArgs = args
        return () => { state.registerDisposed = true }
      },
    },
    sessions: {
      open: (id) => { state.opened.push(id) },
    },
  }
  return { ctx, state }
}

describe('client apply', () => {
  it('registers the windowStats locale and the conversation.view tab', () => {
    const { ctx, state } = makeFake()
    apply(ctx as never)
    expect(state.localeRegisterCalls.length).toBe(1)
    expect(state.localeRegisterCalls[0]?.[0]).toBe('windowStats')
    expect(state.slotsInjectKey).toBe('conversation.view')
    const options = state.registerArgs[0] as { name: string; id: string; order: number }
    expect(options.name).toBe('conversation.view')
    expect(options.id).toBe('windowStats')
    expect(options.order).toBe(20)
  })

  it('inject face opens the session', () => {
    const { ctx, state } = makeFake()
    apply(ctx as never)
    const options = state.registerArgs[0] as { inject: () => { open: (id: string) => void } }
    const injected = options.inject()
    injected.open('session-9')
    expect(state.opened).toEqual(['session-9'])
  })

  it('disposes the locale registration on fiber teardown', () => {
    const { ctx, state } = makeFake()
    apply(ctx as never)
    for (const dispose of ctx.effects) dispose()
    expect(state.localeDisposed).toBe(true)
  })
})
