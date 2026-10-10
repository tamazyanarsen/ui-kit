import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

// Ревью 10.10, КК-4: реестры занятых краёв вьюпорта жили в модульных
// переменных. В микрофронтах у каждого приложения своя копия кита, и копия
// без своих полос публиковала `0px` поверх значения соседней.

type InsetTopHook = typeof import("./use-viewport-inset-top").useViewportInsetTop

async function freshCopy(): Promise<InsetTopHook> {
  vi.resetModules()
  return (await import("./use-viewport-inset-top")).useViewportInsetTop
}

function Bar({ hook, bottom }: { hook: InsetTopHook; bottom: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    ref.current!.getBoundingClientRect = () =>
      ({ top: bottom - 64, bottom, height: 64, left: 0, right: 0, width: 0 }) as DOMRect
  })
  hook(ref)
  return <div ref={ref} />
}

afterEach(() => {
  document.documentElement.style.removeProperty("--viewport-inset-top")
})

describe("Занятые края вьюпорта — общие для копий кита (ревью 10.10, КК-4)", () => {
  it("копия без перекрытия не затирает значение соседней", async () => {
    const first = await freshCopy()
    const second = await freshCopy()
    expect(first).not.toBe(second)

    // Шапка первой копии стоит у верха и занимает 64px.
    render(<Bar hook={first} bottom={64} />)
    expect(document.documentElement.style.getPropertyValue("--viewport-inset-top")).toBe("64px")

    // Узел второй копии уехал за верх экрана — его вклад 0.
    render(<Bar hook={second} bottom={-10} />)
    expect(document.documentElement.style.getPropertyValue("--viewport-inset-top")).toBe("64px")
  })
})
