import { describe, expect, it } from "vitest"

import { nextHybridTop } from "./use-hybrid-sticky"

// Дизайн-чек от 08.10, замечание 32: top = clamp(prevTop − dy, vh − 40 − h, minTop).
describe("nextHybridTop", () => {
  const base = { viewport: 600, inset: 64 }

  it("случай А: колонка помещается — всегда minTop, направление не важно", () => {
    expect(nextHybridTop({ ...base, prevTop: 104, dy: 300, height: 400 })).toBe(104)
    expect(nextHybridTop({ ...base, prevTop: -50, dy: -10, height: 456 })).toBe(104)
  })

  it("случай Б, вниз: едет со страницей до 40 px от низа окна", () => {
    expect(nextHybridTop({ ...base, prevTop: 104, dy: 100, height: 700 })).toBe(4)
    expect(nextHybridTop({ ...base, prevTop: 4, dy: 500, height: 700 })).toBe(-140)
  })

  it("случай Б, вверх: едет до minTop и стоит", () => {
    expect(nextHybridTop({ ...base, prevTop: -140, dy: -60, height: 700 })).toBe(-80)
    expect(nextHybridTop({ ...base, prevTop: -80, dy: -900, height: 700 })).toBe(104)
  })

  it("смена направления не даёт прыжка к краю", () => {
    const down = nextHybridTop({ ...base, prevTop: 104, dy: 50, height: 700 })
    expect(down).toBe(54)
    expect(nextHybridTop({ ...base, prevTop: down, dy: -20, height: 700 })).toBe(74)
  })

  it("inset входит только в верхний отступ", () => {
    expect(nextHybridTop({ viewport: 600, inset: 0, prevTop: 40, dy: 9999, height: 700 })).toBe(-140)
    expect(nextHybridTop({ viewport: 600, inset: 128, prevTop: 0, dy: -9999, height: 700 })).toBe(168)
  })
})
