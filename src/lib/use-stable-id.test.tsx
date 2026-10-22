import { render } from "@testing-library/react"
import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

const KEY = Symbol.for("@core/ui-kit/use-stable-id")

// Каждый `import()` после `resetModules` — новая копия модуля, как второй
// экземпляр кита в соседнем микрофронте.
async function loadCopy() {
  vi.resetModules()
  return (await import("./use-stable-id")).useStableId
}

function Probe({ hook, out }: { hook: () => string; out: string[] }) {
  const id = hook()
  out.push(id)
  return <span id={id} />
}

afterEach(() => {
  vi.doUnmock("react")
  delete (globalThis as Record<symbol, unknown>)[KEY]
})

describe("useStableId", () => {
  it("первая копия кита отдаёт id React как есть, вторая — с префиксом", async () => {
    const first = await loadCopy()
    const second = await loadCopy()
    const a: string[] = []
    const b: string[] = []
    render(
      <>
        <Probe hook={first} out={a} />
        <Probe hook={second} out={b} />
      </>
    )
    expect(a[0]).toMatch(/^:[^:]+:$/)
    expect(b[0]).toMatch(/^k1:[^:]+:$/)
  })

  it("на React 17 (без useId) id есть с первого рендера, стабилен и уникален между копиями", async () => {
    vi.doMock("react", async () => {
      const actual = await vi.importActual<typeof React>("react")
      return { ...actual, useId: undefined, default: { ...actual, useId: undefined } }
    })
    const first = await loadCopy()
    const second = await loadCopy()
    const a: string[] = []
    const b: string[] = []
    const ui = () => (
      <>
        <Probe hook={first} out={a} />
        <Probe hook={first} out={a} />
        <Probe hook={second} out={b} />
      </>
    )
    const { rerender } = render(ui())
    rerender(ui())
    expect(a[0]).toBeTruthy()
    expect(a[0]).not.toBe(a[1])
    // повторный рендер не меняет id
    expect(a[2]).toBe(a[0])
    expect(a[3]).toBe(a[1])
    expect(b[0]).toMatch(/^k1:/)
    expect(new Set([a[0], a[1], b[0]]).size).toBe(3)
  })
})
