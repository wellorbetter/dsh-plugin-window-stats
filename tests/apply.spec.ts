// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { apply } from '../src/client/index.ts'

interface FakeState {
  localeRegisterCalls: unknown[][]
  localeDisposed: boolean
  slotsInjectKeys: string[]
  registrations: unknown[][]
  registerDisposed: boolean
  opened: string[]
}

interface RegistrationOptions {
  name: string
  id: string
  order: number
  inject?: () => { open: (id: string) => void }
}

function makeFake() {
  const state: FakeState = {
    localeRegisterCalls: [],
    localeDisposed: false,
    slotsInjectKeys: [],
    registrations: [],
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
        state.slotsInjectKeys.push(name)
        cb()
        return () => { state.registerDisposed = true }
      },
      register: (...args) => {
        state.registrations.push(args)
        return () => { state.registerDisposed = true }
      },
    },
    sessions: {
      open: (id) => { state.opened.push(id) },
    },
  }
  return { ctx, state }
}

const optionsOf = (state: FakeState, id: string): RegistrationOptions =>
  state.registrations.map(args => args[0] as RegistrationOptions).find(o => o.id === id) as RegistrationOptions

describe('client apply', () => {
  it('registers the locale and both conversation.view tabs', () => {
    const { ctx, state } = makeFake()
    apply(ctx as never)
    expect(state.localeRegisterCalls.length).toBe(1)
    expect(state.localeRegisterCalls[0]?.[0]).toBe('windowStats')
    expect(state.slotsInjectKeys).toEqual(['conversation.view', 'conversation.view'])
    const overview = optionsOf(state, 'windowStats')
    expect(overview.name).toBe('conversation.view')
    expect(overview.order).toBe(20)
    const analytics = optionsOf(state, 'sessionAnalytics')
    expect(analytics.name).toBe('conversation.view')
    expect(analytics.order).toBe(21)
  })

  it('inject face opens the session', () => {
    const { ctx, state } = makeFake()
    apply(ctx as never)
    const overview = optionsOf(state, 'windowStats')
    const injected = overview.inject!()
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
