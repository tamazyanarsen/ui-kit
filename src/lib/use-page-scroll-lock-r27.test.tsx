import { afterEach, describe, expect, it, vi } from "vitest"
import { renderHook } from "@testing-library/react"

// r27: в микрофронтах у каждого приложения своя копия кита, а значит и свой
// модульный счётчик замков прокрутки. Замок второй копии запоминал уже
// «hidden», и после снятия обоих страница оставалась запертой навсегда; снятый
// первым замок одной копии отпирал страницу под слоем другой. Теперь счётчик
// общий и лежит на window.

const locked = () => document.documentElement.hasAttribute("data-page-scroll-lock")

async function freshHook() {
  vi.resetModules()
  const mod = await import("./use-page-scroll-lock")
  return mod.usePageScrollLock
}

describe("usePageScrollLock: две копии кита", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-page-scroll-lock")
  })

  it("пока открыт слой второй копии, страница остаётся запертой", async () => {
    const lockA = await freshHook()
    const lockB = await freshHook()
    const a = renderHook(() => lockA(true))
    const b = renderHook(() => lockB(true))
    expect(locked()).toBe(true)

    a.unmount()
    // Раньше первая копия отпирала страницу под слоем второй.
    expect(locked()).toBe(true)

    b.unmount()
    // Раньше вторая копия «восстанавливала» hidden и запирала страницу навсегда.
    expect(locked()).toBe(false)
  })

  it("порядок снятия не важен", async () => {
    const lockA = await freshHook()
    const lockB = await freshHook()
    const a = renderHook(() => lockA(true))
    const b = renderHook(() => lockB(true))
    b.unmount()
    expect(locked()).toBe(true)
    a.unmount()
    expect(locked()).toBe(false)
  })
})

describe("usePageScrollLock: замок Base UI", () => {
  it("отложенное восстановление body.style.overflow чужим замком не запирает страницу", async () => {
    const lock = await freshHook()
    // Чужой замок (Base UI) установил hidden поверх нашего и снимет его позже, вернув запомненное значение.
    const layer = renderHook(() => lock(true))
    document.body.style.overflow = "hidden"
    layer.unmount()
    expect(document.documentElement.hasAttribute("data-page-scroll-lock")).toBe(false)
    // Наш замок ничего не писал в body.style, поэтому чужое восстановление ничего не ломает.
    document.body.style.overflow = ""
    expect(document.body.style.overflow).toBe("")
  })

  it("замок кита не пишет в инлайн-стиль body", async () => {
    const lock = await freshHook()
    const layer = renderHook(() => lock(true))
    expect(document.body.style.overflow).toBe("")
    expect(document.body.style.paddingRight).toBe("")
    layer.unmount()
  })
})
