import { afterEach, describe, expect, it, vi } from "vitest"
import { renderHook } from "@testing-library/react"

// r27: в микрофронтах у каждого приложения своя копия кита, а значит и свой
// модульный счётчик замков прокрутки. Замок второй копии запоминал уже
// «hidden», и после снятия обоих страница оставалась запертой навсегда; снятый
// первым замок одной копии отпирал страницу под слоем другой. Теперь счётчик
// общий и лежит на window.

async function freshHook() {
  vi.resetModules()
  const mod = await import("./use-page-scroll-lock")
  return mod.usePageScrollLock
}

describe("usePageScrollLock: две копии кита", () => {
  afterEach(() => {
    document.body.style.overflow = ""
  })

  it("пока открыт слой второй копии, страница остаётся запертой", async () => {
    const lockA = await freshHook()
    const lockB = await freshHook()
    const a = renderHook(() => lockA(true))
    const b = renderHook(() => lockB(true))
    expect(document.body.style.overflow).toBe("hidden")

    a.unmount()
    // Раньше первая копия отпирала страницу под слоем второй.
    expect(document.body.style.overflow).toBe("hidden")

    b.unmount()
    // Раньше вторая копия «восстанавливала» hidden и запирала страницу навсегда.
    expect(document.body.style.overflow).toBe("")
  })

  it("порядок снятия не важен", async () => {
    const lockA = await freshHook()
    const lockB = await freshHook()
    const a = renderHook(() => lockA(true))
    const b = renderHook(() => lockB(true))
    b.unmount()
    expect(document.body.style.overflow).toBe("hidden")
    a.unmount()
    expect(document.body.style.overflow).toBe("")
  })
})
